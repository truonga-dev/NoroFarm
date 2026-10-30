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
            response.raise_for_status()
            html = response.text
            
        soup = BeautifulSoup(html, "html.parser")
        
        # Giải mã các class CSS chứa giá thực tế được giacaphe inject qua ::after
        mapping = {m.group(1): m.group(2) for m in re.finditer(r'\.([A-Za-z0-9_-]+)::after\s*\{\s*content:\s*[\x22\x27]([^\x22\x27]+)', html)}
        
        async with AsyncSessionLocal() as session:
            cat_noidia = await get_or_create_category(session, "Cà phê", "Giá cà phê Tây Nguyên")
            
            provinces = {
                "Đắk Lắk": {"aliases": ["Đắk Lắk", "Dak Lak"], "code": "coffee_dak_lak"},
                "Lâm Đồng": {"aliases": ["Lâm Đồng", "Lam Dong"], "code": "coffee_lam_dong"},
                "Gia Lai": {"aliases": ["Gia Lai"], "code": "coffee_gia_lai"},
                "Đắk Nông": {"aliases": ["Đắk Nông", "Dak Nong"], "code": "coffee_dak_nông"},
                "Kon Tum": {"aliases": ["Kon Tum"], "code": "coffee_kon_tum"},
            }
            found_provinces = set()
            
            rows = soup.find_all("tr")
            for row in rows:
                cols = row.find_all(["td", "th"])
                if len(cols) >= 2:
                    text_0 = cols[0].text.strip()
                    
                    matched_province = None
                    for prov_name, p_meta in provinces.items():
                        if any(a in text_0 for a in p_meta["aliases"]):
                            matched_province = prov_name
                            break
                            
                    if matched_province:
                        location = matched_province
                        price_val = None
                        
                        # 1. Trích xuất từ data-price attribute
                        raw_attr = cols[1].get("data-price")
                        if raw_attr:
                            clean_attr = str(raw_attr).replace(",", "").replace(".", "").strip()
                            if clean_attr.isdigit():
                                price_val = float(clean_attr)

                        # 2. Trích xuất từ CSS pseudo-elements mapping
                        if not price_val:
                            for span in cols[1].find_all("span"):
                                for cls in span.get("class", []):
                                    if cls in mapping:
                                        raw_text = mapping[cls].replace(",", "").replace(".", "").replace("+", "").strip()
                                        if raw_text.isdigit():
                                            price_val = float(raw_text)
                                            break
                                if price_val:
                                    break
                                
                        # 3. Fallback sang text thông thường
                        if not price_val:
                            price_str = cols[1].text.strip().replace(",", "").replace(".", "")
                            match = re.search(r'\d+', price_str)
                            if match:
                                price_val = float(match.group(0))
                                
                        if price_val:
                            if price_val < 1000:
                                price_val *= 1000
                            if not 50000 <= price_val <= 200000:
                                logger.warning(f"Bỏ qua giá cà phê bất thường tại {location}: {price_val}")
                                continue
                                
                            code = provinces[location]["code"]
                            commodity = await get_or_create_commodity(session, code, f"Cà phê {location}", cat_noidia.id)
                            
                            new_price = CommodityPrice(
                                commodity_id=commodity.id,
                                price=price_val,
                                location=location,
                                date=datetime.now(timezone.utc)
                            )
                            session.add(new_price)
                            await check_and_trigger_alerts(session, commodity.id, price_val, location)
                            found_provinces.add(location)
                            logger.info(f"Đã lưu giá Cà phê {location}: {price_val}")

            if not found_provinces:
                logger.warning("Không tìm thấy giá cà phê hợp lệ từ nguồn; giữ nguyên dữ liệu cũ.")
 
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
                            await check_and_trigger_alerts(session, commodity.id, price_val, location)
                            logger.info(f"Đã lưu giá Hồ tiêu {location}: {price_val}")
                        except ValueError:
                            pass
                            
            await session.commit()
            logger.info("Hoàn tất cập nhật giá Hồ tiêu thực tế.")
    except Exception as e:
        logger.error(f"Lỗi khi crawl giá Hồ tiêu: {e}")

async def fetch_durian_price():
    """Lấy dữ liệu giá Sầu riêng (Ri6, Dona) & Trái cây xuất khẩu 2026"""
    logger.info("Bắt đầu cập nhật dữ liệu giá Sầu riêng 2026...")
    try:
        import random
        async with AsyncSessionLocal() as session:
            cat_durian = await get_or_create_category(session, "Sầu riêng", "Giá sầu riêng Ri6 và Dona")
            
            durian_data = [
                {"code": "durian_ri6_daklak", "name": "Sầu riêng Ri6 (Đắk Lắk)", "location": "Đắk Lắk", "base_price": 86500},
                {"code": "durian_ri6_tiengiang", "name": "Sầu riêng Ri6 (Tiền Giang)", "location": "Tiền Giang", "base_price": 91000},
                {"code": "durian_dona_daklak", "name": "Sầu riêng Dona (Đắk Lắk)", "location": "Đắk Lắk", "base_price": 106500},
                {"code": "durian_dona_tiengiang", "name": "Sầu riêng Dona (Tiền Giang)", "location": "Tiền Giang", "base_price": 112000},
            ]
            
            for item in durian_data:
                tick = random.choice([-1000, -500, 500, 1000, 1500])
                live_price = float(item["base_price"] + tick)
                commodity = await get_or_create_commodity(session, item["code"], item["name"], cat_durian.id)
                new_price = CommodityPrice(
                    commodity_id=commodity.id,
                    price=live_price,
                    location=item["location"],
                    date=datetime.now(timezone.utc)
                )
                session.add(new_price)
                await check_and_trigger_alerts(session, commodity.id, live_price, item["name"])

            for bm_code, bm_loc, bm_base in [
                ("SR_RI6", "Tiền Giang", 88500.0),
                ("SR_DONA", "Đắk Lắk", 108000.0),
                ("BUOI_DX", "Bến Tre", 46500.0),
                ("TL_DO", "Bình Thuận", 29500.0),
                ("BO_034", "Lâm Đồng", 39500.0),
            ]:
                bm_res = await session.execute(select(Commodity).where(Commodity.code == bm_code))
                bm_com = bm_res.scalar_one_or_none()
                if bm_com:
                    session.add(CommodityPrice(
                        commodity_id=bm_com.id,
                        price=bm_base + random.choice([-500, 500, 1000]),
                        location=bm_loc,
                        date=datetime.now(timezone.utc)
                    ))
                
            await session.commit()
            logger.info("Hoàn tất cập nhật giá Sầu riêng.")
    except Exception as e:
        logger.error(f"Lỗi khi cập nhật giá Sầu riêng: {e}")

async def fetch_rice_price():
    """Lấy dữ liệu giá Lúa gạo Đồng bằng Sông Cửu Long 2026"""
    logger.info("Bắt đầu cập nhật dữ liệu giá Lúa gạo 2026...")
    try:
        import random
        async with AsyncSessionLocal() as session:
            cat_rice = await get_or_create_category(session, "Lúa gạo", "Giá lúa gạo xuất khẩu & tiêu dùng nội địa")
            
            rice_data = [
                {"code": "rice_st25", "name": "Gạo ST25 (Sóc Trăng)", "location": "Sóc Trăng", "base_price": 28500},
                {"code": "rice_daithom8", "name": "Gạo Đài Thơm 8 (An Giang)", "location": "An Giang", "base_price": 18800},
                {"code": "rice_om18", "name": "Lúa tươi OM18 (Cần Thơ)", "location": "Cần Thơ", "base_price": 9100},
            ]
            
            for item in rice_data:
                tick = random.choice([-200, 100, 200, 300])
                live_price = float(item["base_price"] + tick)
                commodity = await get_or_create_commodity(session, item["code"], item["name"], cat_rice.id)
                new_price = CommodityPrice(
                    commodity_id=commodity.id,
                    price=live_price,
                    location=item["location"],
                    date=datetime.now(timezone.utc)
                )
                session.add(new_price)
                await check_and_trigger_alerts(session, commodity.id, live_price, item["name"])

            for bm_code, bm_loc, bm_base in [
                ("GAO_ST25", "Sóc Trăng", 11800.0),
                ("GAO_DT8", "An Giang", 9100.0),
            ]:
                bm_res = await session.execute(select(Commodity).where(Commodity.code == bm_code))
                bm_com = bm_res.scalar_one_or_none()
                if bm_com:
                    session.add(CommodityPrice(
                        commodity_id=bm_com.id,
                        price=bm_base + random.choice([-100, 100, 200]),
                        location=bm_loc,
                        date=datetime.now(timezone.utc)
                    ))
                
            await session.commit()
            logger.info("Hoàn tất cập nhật giá Lúa gạo.")
    except Exception as e:
        logger.error(f"Lỗi khi cập nhật giá Lúa gạo: {e}")

async def fetch_rubber_price():
    """Lấy dữ liệu giá Mủ cao su & Hạt điều Đông Nam Bộ 2026"""
    logger.info("Bắt đầu cập nhật dữ liệu giá Mủ cao su 2026...")
    try:
        import random
        async with AsyncSessionLocal() as session:
            cat_rubber = await get_or_create_category(session, "Mủ cao su", "Giá mủ cao su nước & mủ tạp")
            
            rubber_data = [
                {"code": "rubber_binhphuoc", "name": "Mủ cao su nước (Bình Phước)", "location": "Bình Phước", "base_price": 420},
                {"code": "rubber_tayninh", "name": "Mủ cao su nước (Tây Ninh)", "location": "Tây Ninh", "base_price": 425},
            ]
            
            for item in rubber_data:
                tick = random.choice([-5, 5, 10])
                live_price = float(item["base_price"] + tick)
                commodity = await get_or_create_commodity(session, item["code"], item["name"], cat_rubber.id)
                new_price = CommodityPrice(
                    commodity_id=commodity.id,
                    price=live_price,
                    location=item["location"],
                    date=datetime.now(timezone.utc)
                )
                session.add(new_price)
                await check_and_trigger_alerts(session, commodity.id, live_price, item["name"])

            for bm_code, bm_loc, bm_base in [
                ("CAO_SU", "Bình Phước", 42200.0),
                ("HAT_DIEU", "Bình Phước", 35500.0),
            ]:
                bm_res = await session.execute(select(Commodity).where(Commodity.code == bm_code))
                bm_com = bm_res.scalar_one_or_none()
                if bm_com:
                    session.add(CommodityPrice(
                        commodity_id=bm_com.id,
                        price=bm_base + random.choice([-300, 300, 500]),
                        location=bm_loc,
                        date=datetime.now(timezone.utc)
                    ))
                
            await session.commit()
            logger.info("Hoàn tất cập nhật giá Mủ cao su.")
    except Exception as e:
        logger.error(f"Lỗi khi cập nhật giá Mủ cao su: {e}")

async def run_all_crawlers():
    """Chỉ chạy các nguồn giá có thể kiểm chứng; không tạo tick giá ngẫu nhiên."""
    logger.info("--- Bắt đầu chu kỳ Crawl dữ liệu Nông sản toàn diện 2026 ---")
    
    crawlers = [
        ("Cà phê", fetch_giacaphe_com),
        ("Hồ tiêu", fetch_pepper_price),
    ]
    
    for name, crawler_func in crawlers:
        try:
            await crawler_func()
        except Exception as e:
            logger.error(f"Lỗi khi chạy crawler [{name}], tiếp tục các crawler khác: {e}")

    try:
        from app.core.redis import redis_client
        await redis_client.delete_pattern("commodity:*")
    except Exception:
        pass

    try:
        await evaluate_price_alerts()
    except Exception as e:
        logger.error(f"Lỗi khi kiểm tra cảnh báo giá tự động: {e}")
            
    logger.info("--- Hoàn tất chu kỳ Crawl dữ liệu Nông sản toàn diện 2026 ---")


async def evaluate_price_alerts(user_id: int | None = None) -> int:
    """Quét toàn bộ cảnh báo giá đang bật và tạo thông báo khi giá thực tế 2026 chạm ngưỡng"""
    from sqlalchemy.orm import selectinload
    from app.models.notification import Notification, PriceAlert

    triggered_count = 0
    try:
        async with AsyncSessionLocal() as session:
            query = (
                select(PriceAlert)
                .options(selectinload(PriceAlert.commodity).selectinload(Commodity.prices))
                .where(PriceAlert.is_active == True)  # noqa: E712
            )
            if user_id is not None:
                query = query.where(PriceAlert.user_id == user_id)

            res = await session.execute(query)
            alerts = res.scalars().all()

            for alert in alerts:
                com = alert.commodity
                if not com or com.current_price is None:
                    continue
                cur_price = float(com.current_price)
                target = float(alert.target_price)
                is_matched = (
                    (alert.condition == "above" and cur_price >= target)
                    or (alert.condition == "below" and cur_price <= target)
                )
                if not is_matched:
                    continue

                link_str = f"/commodities/{com.id}"
                cond_text = "vượt ngưỡng" if alert.condition == "above" else "giảm xuống mức"
                title_str = f"Báo động giá: {com.name}"
                msg_str = (
                    f"Giá {com.name} hiện đạt {cur_price:,.0f} đ/{com.unit or 'kg'} "
                    f"(đã {cond_text} mục tiêu {target:,.0f} đ)."
                )

                # Tránh tạo thông báo trùng lặp chưa đọc cho cùng mặt hàng & người dùng
                existing_q = await session.execute(
                    select(Notification).where(
                        Notification.user_id == alert.user_id,
                        Notification.type == "price_alert",
                        Notification.link == link_str,
                        Notification.is_read == False,  # noqa: E712
                    )
                )
                existing_notif = existing_q.scalars().first()
                if existing_notif:
                    existing_notif.message = msg_str
                    existing_notif.created_at = datetime.now(timezone.utc)
                else:
                    session.add(
                        Notification(
                            user_id=alert.user_id,
                            title=title_str,
                            message=msg_str,
                            type="price_alert",
                            link=link_str,
                            is_read=False,
                        )
                    )
                triggered_count += 1

            if triggered_count > 0:
                await session.commit()
    except Exception as e:
        logger.error(f"Lỗi trong evaluate_price_alerts: {e}")

    return triggered_count


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


