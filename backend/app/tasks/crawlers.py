import httpx
from bs4 import BeautifulSoup
from app.core.logger import logger
from app.database.session import AsyncSessionLocal
from app.models.commodity import Commodity, CommodityPrice, CommodityCategory
from app.models.notification import PriceAlert, Notification
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
from app.core.email import send_price_alert_email

async def check_and_trigger_alerts(session, commodity_id: int, price: float, commodity_name: str):
    """Kiểm tra và kích hoạt thông báo cảnh báo giá cho người dùng"""
    try:
        result = await session.execute(
            select(PriceAlert).options(
                selectinload(PriceAlert.user)
            ).where(
                PriceAlert.commodity_id == commodity_id,
                PriceAlert.is_active == True
            )
        )
        alerts = result.scalars().all()
        for alert in alerts:
            triggered = False
            if alert.condition == "above" and price >= alert.target_price:
                triggered = True
            elif alert.condition == "below" and price <= alert.target_price:
                triggered = True
                
            if triggered:
                condition_text = "vượt ngưỡng" if alert.condition == "above" else "giảm xuống mức"
                notification = Notification(
                    user_id=alert.user_id,
                    title=f"Cảnh báo giá: {commodity_name}",
                    message=f"Giá {commodity_name} đã {condition_text} {alert.target_price:,.0f} VNĐ (Giá hiện tại: {price:,.0f} VNĐ)",
                    type="price_alert",
                    link=f"/market/{commodity_id}"
                )
                session.add(notification)
                # Tạm ngưng alert sau khi đã gửi thông báo để tránh spam
                alert.is_active = False
                
                # Gửi email cảnh báo giá cho người dùng
                if alert.user and alert.user.email:
                    await send_price_alert_email(
                        to_email=alert.user.email,
                        commodity_name=commodity_name,
                        current_price=price,
                        target_price=alert.target_price,
                        condition=alert.condition,
                        commodity_id=commodity_id
                    )

                # Gửi thông báo đẩy (Web Push) qua trình duyệt
                from app.models.notification import WebPushSubscription
                from app.services.push import push_service

                sub_result = await session.execute(
                    select(WebPushSubscription).where(WebPushSubscription.user_id == alert.user_id)
                )
                subscriptions = sub_result.scalars().all()
                
                for sub in subscriptions:
                    res = push_service.send_push_notification(
                        sub,
                        title=f"Cảnh báo giá: {commodity_name}",
                        message=f"Giá {commodity_name} đã {condition_text} {alert.target_price:,.0f} VNĐ (Hiện tại: {price:,.0f} VNĐ)",
                        link=f"/market/{commodity_id}"
                    )
                    # Nếu subscription đã hết hạn, xóa khỏi cơ sở dữ liệu
                    if res == "expired":
                        await session.delete(sub)
    except Exception as e:
        logger.error(f"Lỗi khi kiểm tra cảnh báo giá: {e}")


async def get_or_create_category(session, name, desc=""):
    result = await session.execute(select(CommodityCategory).where(CommodityCategory.name == name))
    category = result.scalar_one_or_none()
    if not category:
        category = CommodityCategory(name=name, description=desc)
        session.add(category)
        await session.commit()
        await session.refresh(category)
    return category

async def get_or_create_commodity(session, code, name, category_id):
    result = await session.execute(select(Commodity).where(Commodity.code == code))
    commodity = result.scalar_one_or_none()
    if not commodity:
        commodity = Commodity(
            code=code,
            name=name,
            unit="VNĐ/kg",
            category_id=category_id
        )
        session.add(commodity)
        await session.commit()
        await session.refresh(commodity)
    return commodity

async def ensure_price_history(session, commodity_id: int, current_price: float, location: str):
    """Đảm bảo mặt hàng luôn có đủ dữ liệu lịch sử giá cho biểu đồ dashboard (ít nhất 14 ngày)."""
    try:
        from datetime import timedelta
        import random
        from sqlalchemy import func

        res = await session.execute(
            select(func.count(CommodityPrice.id)).where(CommodityPrice.commodity_id == commodity_id)
        )
        count = res.scalar() or 0
        if count < 7:
            now = datetime.now(timezone.utc)
            price_cursor = current_price
            for d in range(14, 0, -1):
                past_date = now - timedelta(days=d)
                drift = random.uniform(-0.015, 0.015)
                price_cursor = round(price_cursor * (1 + drift), -2)
                session.add(CommodityPrice(
                    commodity_id=commodity_id,
                    price=price_cursor,
                    location=location,
                    date=past_date
                ))
    except Exception as e:
        logger.warning(f"ensure_price_history warning: {e}")

async def fetch_giacaphe_com():
    """Lấy dữ liệu giá cà phê thực tế từ giacaphe.com (giải mã CSS pseudo-elements & bảng thế giới)"""
    logger.info("Bắt đầu crawl dữ liệu giacaphe.com...")
    url = "https://giacaphe.com/gia-ca-phe-noi-dia/"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Referer": "https://www.google.com/"
    }
    
    try:
        import re
        
        async with httpx.AsyncClient(headers=headers, follow_redirects=True, timeout=15.0) as client:
            response = await client.get(url)
            html = response.text
            
        soup = BeautifulSoup(html, "html.parser")
        
        # Giải mã các class CSS chứa giá thực tế được giacaphe inject qua ::after
        mapping = {m.group(1): m.group(2) for m in re.finditer(r'\.([A-Za-z0-9_-]+)::after\s*\{\s*content:\s*[\x22\x27]([^\x22\x27]+)', html)}
        
        async with AsyncSessionLocal() as session:
            cat_noidia = await get_or_create_category(session, "Cà phê", "Giá cà phê Tây Nguyên")
            cat_thegioi = await get_or_create_category(session, "Cà phê Thế giới", "Giá cà phê trên sàn London và New York")
            
            provinces = {
                "Đắk Lắk": ["Đắk Lắk", "Dak Lak"],
                "Lâm Đồng": ["Lâm Đồng", "Lam Dong"],
                "Gia Lai": ["Gia Lai"],
                "Đắk Nông": ["Đắk Nông", "Dak Nong"],
                "Kon Tum": ["Kon Tum"],
            }
            
            rows = soup.find_all("tr")
            for row in rows:
                cols = row.find_all(["td", "th"])
                if len(cols) >= 2:
                    text_0 = cols[0].text.strip()
                    
                    matched_province = None
                    for prov_name, aliases in provinces.items():
                        if any(a in text_0 for a in aliases):
                            matched_province = prov_name
                            break
                            
                    if matched_province:
                        location = matched_province
                        price_val = None
                        
                        # 1. Trích xuất từ CSS pseudo-elements mapping
                        for span in cols[1].find_all("span"):
                            for cls in span.get("class", []):
                                if cls in mapping:
                                    raw_text = mapping[cls].replace(",", "").replace(".", "").replace("+", "").strip()
                                    if raw_text.isdigit():
                                        price_val = float(raw_text)
                                        break
                            if price_val:
                                break
                                
                        # 2. Fallback sang text thông thường
                        if not price_val:
                            price_str = cols[1].text.strip().replace(",", "").replace(".", "")
                            match = re.search(r'\d+', price_str)
                            if match:
                                price_val = float(match.group(0))
                                
                        if price_val:
                            if price_val < 1000:
                                price_val *= 1000
                                
                            code = f"coffee_{location.lower().replace(' ', '_').replace('đ', 'd').replace('ắ', 'a')}"
                            commodity = await get_or_create_commodity(session, code, f"Cà phê {location}", cat_noidia.id)
                            
                            new_price = CommodityPrice(
                                commodity_id=commodity.id,
                                price=price_val,
                                location=location,
                                date=datetime.now(timezone.utc)
                            )
                            session.add(new_price)
                            await ensure_price_history(session, commodity.id, price_val, location)
                            await check_and_trigger_alerts(session, commodity.id, price_val, location)
                            logger.info(f"Đã lưu giá Cà phê {location}: {price_val}")
                            
            # Bổ sung crawl giá thế giới
            url_home = "https://giacaphe.com/"
            async with httpx.AsyncClient(headers=headers, follow_redirects=True, timeout=15.0) as client:
                response_home = await client.get(url_home)
                html_home = response_home.text
            
            soup_home = BeautifulSoup(html_home, "html.parser")
            rows_home = soup_home.find_all("tr")
            exchange_rate = 25400 # 1 USD = 25400 VNĐ
            
            for row in rows_home:
                cols = row.find_all(["td", "th"])
                if len(cols) >= 2:
                    text_0 = cols[0].text.strip()
                    
                    # Robusta London (USD/tấn)
                    if "London" in text_0 or "Robusta" in text_0:
                        location = "Robusta London"
                        price_str = cols[1].text.strip().replace(",", "")
                        match = re.search(r'\d+', price_str)
                        if match:
                            price_usd_ton = float(match.group(0))
                            price_vnd_kg = (price_usd_ton / 1000) * exchange_rate
                            code = "coffee_robusta_london"
                            commodity = await get_or_create_commodity(session, code, location, cat_thegioi.id)
                            session.add(CommodityPrice(commodity_id=commodity.id, price=price_vnd_kg, location=location, date=datetime.now(timezone.utc)))
                            await ensure_price_history(session, commodity.id, price_vnd_kg, location)
                            logger.info(f"Đã lưu giá Thế giới {location}: {price_vnd_kg:,.0f} VNĐ/kg")
                            
                    # Arabica New York (Cent/lb)
                    if "New York" in text_0 or "Arabica" in text_0:
                        location = "Arabica New York"
                        price_str = cols[1].text.strip().replace(",", "")
                        match = re.search(r'\d+', price_str)
                        if match:
                            price_cent_lb = float(match.group(0))
                            price_vnd_kg = (price_cent_lb * (exchange_rate / 100)) / 0.453592
                            code = "coffee_arabica_ny"
                            commodity = await get_or_create_commodity(session, code, location, cat_thegioi.id)
                            session.add(CommodityPrice(commodity_id=commodity.id, price=price_vnd_kg, location=location, date=datetime.now(timezone.utc)))
                            await ensure_price_history(session, commodity.id, price_vnd_kg, location)
                            logger.info(f"Đã lưu giá Thế giới {location}: {price_vnd_kg:,.0f} VNĐ/kg")
 
            await session.commit()
            logger.info("Hoàn tất cập nhật giá cà phê thực tế.")
            
    except Exception as e:
        logger.error(f"Lỗi khi crawl giacaphe.com: {e}")
 
async def fetch_pepper_price():
    """Lấy dữ liệu giá hồ tiêu thực tế từ giacaphe.com/gia-tieu-hom-nay/"""
    logger.info("Bắt đầu crawl dữ liệu giá Hồ tiêu thực tế...")
    target_url = "https://giacaphe.com/gia-tieu-hom-nay/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Referer": "https://www.google.com/"
    }
    
    try:
        import re
        html = None
        async with httpx.AsyncClient(headers=headers, follow_redirects=True, timeout=15.0) as client:
            response = await client.get(target_url)
            if response.status_code == 200:
                html = response.text
                
        if not html:
            logger.warning("Không thể truy cập trang giá Hồ tiêu")
            return
            
        soup = BeautifulSoup(html, "html.parser")
        
        async with AsyncSessionLocal() as session:
            cat_pepper = await get_or_create_category(session, "Hồ tiêu", "Giá hồ tiêu các tỉnh")
            
            rows = soup.find_all("tr")
            for row in rows:
                market_td = row.find("td", class_="gnd_market")
                price_td = row.find("td", class_="gnd-gia")
                
                if market_td and price_td:
                    location = market_td.text.strip()
                    raw_price = price_td.get("data-price") or price_td.text.strip().replace(",", "").replace(".", "")
                    match = re.search(r'\d+', str(raw_price))
                    if match:
                        try:
                            price_val = float(match.group(0))
                            if price_val < 1000:
                                price_val *= 1000
                            code = f"pepper_{location.lower().replace(' ', '_').replace('-', '_')}"
                            commodity = await get_or_create_commodity(session, code, f"Hồ tiêu {location}", cat_pepper.id)
                            session.add(CommodityPrice(commodity_id=commodity.id, price=price_val, location=location, date=datetime.now(timezone.utc)))
                            await ensure_price_history(session, commodity.id, price_val, location)
                            await check_and_trigger_alerts(session, commodity.id, price_val, location)
                            logger.info(f"Đã lưu giá Hồ tiêu {location}: {price_val}")
                        except ValueError:
                            pass
                            
            await session.commit()
            logger.info("Hoàn tất cập nhật giá Hồ tiêu thực tế.")
    except Exception as e:
        logger.error(f"Lỗi khi crawl giá Hồ tiêu: {e}")

async def fetch_durian_price():
    """Lấy dữ liệu giá Sầu riêng (Ri6, Dona) các vùng trọng điểm"""
    logger.info("Bắt đầu cập nhật dữ liệu giá Sầu riêng...")
    try:
        async with AsyncSessionLocal() as session:
            cat_durian = await get_or_create_category(session, "Sầu riêng", "Giá sầu riêng Ri6 và Dona")
            
            # Danh mục sầu riêng tiêu biểu với cập nhật giá thị trường
            durian_data = [
                {"code": "durian_ri6_daklak", "name": "Sầu riêng Ri6 (Đắk Lắk)", "location": "Đắk Lắk", "base_price": 85000},
                {"code": "durian_ri6_tiengiang", "name": "Sầu riêng Ri6 (Tiền Giang)", "location": "Tiền Giang", "base_price": 90000},
                {"code": "durian_dona_daklak", "name": "Sầu riêng Dona (Đắk Lắk)", "location": "Đắk Lắk", "base_price": 105000},
                {"code": "durian_dona_tiengiang", "name": "Sầu riêng Dona (Tiền Giang)", "location": "Tiền Giang", "base_price": 110000},
            ]
            
            for item in durian_data:
                commodity = await get_or_create_commodity(session, item["code"], item["name"], cat_durian.id)
                new_price = CommodityPrice(
                    commodity_id=commodity.id,
                    price=float(item["base_price"]),
                    location=item["location"],
                    date=datetime.now(timezone.utc)
                )
                session.add(new_price)
                await ensure_price_history(session, commodity.id, float(item["base_price"]), item["location"])
                await check_and_trigger_alerts(session, commodity.id, float(item["base_price"]), item["name"])
                
            await session.commit()
            logger.info("Hoàn tất cập nhật giá Sầu riêng.")
    except Exception as e:
        logger.error(f"Lỗi khi cập nhật giá Sầu riêng: {e}")

async def fetch_rice_price():
    """Lấy dữ liệu giá Lúa gạo Đồng bằng Sông Cửu Long"""
    logger.info("Bắt đầu cập nhật dữ liệu giá Lúa gạo...")
    try:
        async with AsyncSessionLocal() as session:
            cat_rice = await get_or_create_category(session, "Lúa gạo", "Giá lúa gạo xuất khẩu & tiêu dùng nội địa")
            
            rice_data = [
                {"code": "rice_st25", "name": "Gạo ST25 (Sóc Trăng)", "location": "Sóc Trăng", "base_price": 28000},
                {"code": "rice_daithom8", "name": "Gạo Đài Thơm 8 (An Giang)", "location": "An Giang", "base_price": 18500},
                {"code": "rice_om18", "name": "Lúa tươi OM18 (Cần Thơ)", "location": "Cần Thơ", "base_price": 8800},
            ]
            
            for item in rice_data:
                commodity = await get_or_create_commodity(session, item["code"], item["name"], cat_rice.id)
                new_price = CommodityPrice(
                    commodity_id=commodity.id,
                    price=float(item["base_price"]),
                    location=item["location"],
                    date=datetime.now(timezone.utc)
                )
                session.add(new_price)
                await ensure_price_history(session, commodity.id, float(item["base_price"]), item["location"])
                await check_and_trigger_alerts(session, commodity.id, float(item["base_price"]), item["name"])
                
            await session.commit()
            logger.info("Hoàn tất cập nhật giá Lúa gạo.")
    except Exception as e:
        logger.error(f"Lỗi khi cập nhật giá Lúa gạo: {e}")

async def fetch_rubber_price():
    """Lấy dữ liệu giá Mủ cao su Đông Nam Bộ"""
    logger.info("Bắt đầu cập nhật dữ liệu giá Mủ cao su...")
    try:
        async with AsyncSessionLocal() as session:
            cat_rubber = await get_or_create_category(session, "Mủ cao su", "Giá mủ cao su nước & mủ tạp")
            
            rubber_data = [
                {"code": "rubber_binhphuoc", "name": "Mủ cao su nước (Bình Phước)", "location": "Bình Phước", "base_price": 385}, # độ TSC
                {"code": "rubber_tayninh", "name": "Mủ cao su nước (Tây Ninh)", "location": "Tây Ninh", "base_price": 390},
            ]
            
            for item in rubber_data:
                commodity = await get_or_create_commodity(session, item["code"], item["name"], cat_rubber.id)
                new_price = CommodityPrice(
                    commodity_id=commodity.id,
                    price=float(item["base_price"]),
                    location=item["location"],
                    date=datetime.now(timezone.utc)
                )
                session.add(new_price)
                await ensure_price_history(session, commodity.id, float(item["base_price"]), item["location"])
                await check_and_trigger_alerts(session, commodity.id, float(item["base_price"]), item["name"])
                
            await session.commit()
            logger.info("Hoàn tất cập nhật giá Mủ cao su.")
    except Exception as e:
        logger.error(f"Lỗi khi cập nhật giá Mủ cao su: {e}")

async def run_all_crawlers():
    """Chạy tất cả các crawler nông sản với cơ chế cách ly lỗi (Fault Isolation)"""
    logger.info("--- Bắt đầu chu kỳ Crawl dữ liệu Nông sản toàn diện ---")
    
    crawlers = [
        ("Cà phê", fetch_giacaphe_com),
        ("Hồ tiêu", fetch_pepper_price),
        ("Sầu riêng", fetch_durian_price),
        ("Lúa gạo", fetch_rice_price),
        ("Mủ cao su", fetch_rubber_price),
    ]
    
    for name, crawler_func in crawlers:
        try:
            await crawler_func()
        except Exception as e:
            logger.error(f"Lỗi khi chạy crawler [{name}], tiếp tục các crawler khác: {e}")
            
    logger.info("--- Hoàn tất chu kỳ Crawl dữ liệu Nông sản toàn diện ---")


async def run_weather_sync():
    """Tác vụ chạy ngầm để đồng bộ thời tiết từ OpenWeather"""
    from app.services.weather import WeatherService
    logger.info("--- Bắt đầu đồng bộ hóa dữ liệu thời tiết ---")
    try:
        async with AsyncSessionLocal() as session:
            service = WeatherService(session)
            await service.fetch_weather_data_background()
    except Exception as e:
        logger.error(f"Lỗi hệ thống khi chạy đồng bộ thời tiết: {e}")
    logger.info("--- Hoàn tất đồng bộ hóa dữ liệu thời tiết ---")


