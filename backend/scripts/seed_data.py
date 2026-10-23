import sys
import io
from pathlib import Path

# Cấu hình UTF-8 cho Windows terminal
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import asyncio
from datetime import datetime, timedelta, timezone
import random
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database.session import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User, Profile, Role, Permission, user_role, role_permission
from app.models.commodity import Commodity, CommodityCategory, CommodityPrice
from app.models.shop import ProductCategory, Product, Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus
from app.models.market import MarketPost, PostType, PostStatus
from app.models.news import ArticleCategory, Tag, Article, article_tag
from app.models.weather import Location, WeatherForecast, WeatherAlert
from app.core.redis import redis_client

async def seed_data():
    print("==================================================")
    print("Bắt đầu nạp toàn diện dữ liệu hạt giống (Seed Data) cho NoroFarm...")
    print("==================================================")

    async with AsyncSessionLocal() as db:
        # ==========================================
        # 1. SEED ROLES & PERMISSIONS
        # ==========================================
        print("\n--- 1. Nạp Roles & Permissions ---")
        permissions_data = [
            {"name": "admin:all", "description": "Toàn quyền quản trị hệ thống"},
            {"name": "shop:manage", "description": "Quản lý sản phẩm và danh mục cửa hàng"},
            {"name": "commodity:manage", "description": "Cập nhật và quản lý giá nông sản thị trường"},
            {"name": "news:manage", "description": "Biên tập và xuất bản tin tức, cẩm nang"},
            {"name": "market:post", "description": "Đăng tin giao dịch mua/bán nông sản sỉ"},
            {"name": "order:create", "description": "Đặt mua sản phẩm và theo dõi đơn hàng"},
        ]
        perm_map = {}
        for p in permissions_data:
            res = await db.execute(select(Permission).filter_by(name=p["name"]))
            existing = res.scalars().first()
            if not existing:
                existing = Permission(**p)
                db.add(existing)
                await db.commit()
                await db.refresh(existing)
            perm_map[p["name"]] = existing

        roles_data = [
            {"name": "admin", "description": "Quản trị viên tối cao", "perms": list(perm_map.values())},
            {"name": "manager", "description": "Quản lý thị trường & nội dung", "perms": [perm_map["commodity:manage"], perm_map["news:manage"], perm_map["shop:manage"]]},
            {"name": "farmer", "description": "Nhà vườn / Nông dân sản xuất", "perms": [perm_map["market:post"], perm_map["order:create"]]},
            {"name": "trader", "description": "Thương lái / Doanh nghiệp thu mua sỉ", "perms": [perm_map["market:post"], perm_map["order:create"]]},
            {"name": "customer", "description": "Khách hàng mua lẻ", "perms": [perm_map["order:create"]]},
        ]
        role_map = {}
        for r in roles_data:
            res = await db.execute(select(Role).options(selectinload(Role.permissions)).filter_by(name=r["name"]))
            existing = res.scalars().first()
            if not existing:
                existing = Role(name=r["name"], description=r["description"], permissions=r["perms"])
                db.add(existing)
                await db.commit()
                await db.refresh(existing)
            role_map[r["name"]] = existing

        print("-> Đã thiết lập xong 5 vai trò (admin, manager, farmer, trader, customer)")

        # ==========================================
        # 2. SEED USERS & PROFILES
        # ==========================================
        print("\n--- 2. Nạp Người Dùng & Hồ Sơ (Users & Profiles) ---")
        users_data = [
            {
                "email": "admin@norofarm.vn",
                "password": "Admin@123456",
                "role": "admin",
                "full_name": "Nguyễn Văn Admin",
                "phone": "0901234567",
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            },
            {
                "email": "quanly@norofarm.vn",
                "password": "Manager@123456",
                "role": "manager",
                "full_name": "Lê Hoàng Thị Trường",
                "phone": "0909888999",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            },
            {
                "email": "nongdan.sau@norofarm.vn",
                "password": "Farmer@123456",
                "role": "farmer",
                "full_name": "Trần Văn Sáu (Vườn Sầu Riêng Tiền Giang)",
                "phone": "0912345678",
                "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
            },
            {
                "email": "nongdan.caphe@norofarm.vn",
                "password": "Farmer@123456",
                "role": "farmer",
                "full_name": "Y Krong Niê (Vườn Cà Phê Cư M'gar)",
                "phone": "0923456789",
                "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
            },
            {
                "email": "thuonglai.toancau@norofarm.vn",
                "password": "Trader@123456",
                "role": "trader",
                "full_name": "Đặng Quốc Hưng (Công ty Thu Mua Toàn Cầu)",
                "phone": "0934567890",
                "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
            },
            {
                "email": "khachhang.mai@norofarm.vn",
                "password": "User@123456",
                "role": "customer",
                "full_name": "Phạm Tuyết Mai (TP. Hồ Chí Minh)",
                "phone": "0945678901",
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
            }
        ]

        user_map = {}
        for u in users_data:
            res = await db.execute(select(User).options(selectinload(User.roles)).filter_by(email=u["email"]))
            existing = res.scalars().first()
            if not existing:
                existing = User(
                    email=u["email"],
                    hashed_password=get_password_hash(u["password"]),
                    is_active=True,
                    is_verified=True,
                    roles=[role_map[u["role"]]]
                )
                db.add(existing)
                await db.commit()
                await db.refresh(existing)
                # Create Profile
                prof = Profile(
                    user_id=existing.id,
                    full_name=u["full_name"],
                    phone_number=u["phone"],
                    avatar_url=u["avatar"]
                )
                db.add(prof)
                await db.commit()
            user_map[u["email"]] = existing

        print(f"-> Đã thiết lập xong {len(users_data)} tài khoản mẫu (Admin, Manager, Nhà vườn, Thương lái, Khách hàng)")

        # ==========================================
        # 3. SEED SHOP CATEGORIES & PRODUCTS (B2C)
        # ==========================================
        print("\n--- 3. Nạp Danh Mục & Sản Phẩm Cửa Hàng B2C ---")
        shop_categories = [
            {"name": "Trái cây đặc sản", "description": "Trái cây tuyển chọn chuẩn VietGAP, độ ngọt cao, an toàn vệ sinh thực phẩm"},
            {"name": "Nông sản khô & Chế biến", "description": "Cà phê mộc, hạt điều rang củi, tiêu đen, macca, mật ong nguyên chất"},
            {"name": "Gạo & Ngũ cốc cao cấp", "description": "Gạo ST25 chính hãng, gạo lứt hữu cơ, các loại đậu hạt dinh dưỡng"},
            {"name": "Rau củ hữu cơ Đà Lạt", "description": "Rau củ quả tươi sạch thu hoạch hàng ngày tại nông trại Đà Lạt"},
            {"name": "Phân bón & Dinh dưỡng", "description": "Phân bón NPK cao cấp, phân hữu cơ trùn quế, chế phẩm sinh học Trichoderma"},
            {"name": "Vật tư & Thiết bị thông minh", "description": "Hệ thống tưới tự động, kéo cắt tỉa Nhật Bản, màng nilon chống tia cực tím"}
        ]

        shop_cat_map = {}
        for cat_data in shop_categories:
            res = await db.execute(select(ProductCategory).filter_by(name=cat_data["name"]))
            existing_cat = res.scalars().first()
            if not existing_cat:
                new_cat = ProductCategory(**cat_data)
                db.add(new_cat)
                await db.commit()
                await db.refresh(new_cat)
                shop_cat_map[cat_data["name"]] = new_cat
            else:
                shop_cat_map[cat_data["name"]] = existing_cat

        products_list = [
            # 1. Trái cây đặc sản
            {
                "name": "Sầu riêng Ri6 Cái Mơn Loại 1",
                "cat": "Trái cây đặc sản",
                "price": 135000.0,
                "stock": 180,
                "unit": "kg",
                "description": "Sầu riêng Ri6 chuẩn cơm vàng, hạt lép, vị ngọt đậm béo ngậy, bao ăn từng trái (trái từ 2.5kg - 4.5kg).",
                "image_url": "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Sầu riêng Monthong Dona Đắk Lắk",
                "cat": "Trái cây đặc sản",
                "price": 145000.0,
                "stock": 120,
                "unit": "kg",
                "description": "Cơm dày màu vàng nhạt, hạt dẹp, vị ngọt thanh bùi, thu hái trực tiếp từ vườn sầu riêng Đắk Lắk hữu cơ.",
                "image_url": "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Bưởi Da Xanh Bến Tre Ruột Hồng Chuẩn VietGAP",
                "cat": "Trái cây đặc sản",
                "price": 65000.0,
                "stock": 350,
                "unit": "kg",
                "description": "Bưởi da xanh tép hồng mọng nước, vị ngọt thanh không chua, vỏ mỏng dễ bóc, trọng lượng 1.4kg - 1.8kg/trái.",
                "image_url": "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Xoài Cát Hòa Lộc Tiền Giang Hạng A",
                "cat": "Trái cây đặc sản",
                "price": 85000.0,
                "stock": 160,
                "unit": "kg",
                "description": "Trái thon dài, thịt vàng ươm, mịn không xơ, hương thơm nồng nàn đặc trưng của vùng đất Hòa Lộc.",
                "image_url": "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Thanh Long Ruột Đỏ Bình Thuận Organic",
                "cat": "Trái cây đặc sản",
                "price": 38000.0,
                "stock": 250,
                "unit": "kg",
                "description": "Thanh long ruột đỏ thẫm mọng nước, giàu chất chống oxy hóa anthocyanin, vị ngọt dịu thanh mát.",
                "image_url": "https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Dưa Lưới Ichiba Nhật Bản Trồng Nhà Màng",
                "cat": "Trái cây đặc sản",
                "price": 75000.0,
                "stock": 90,
                "unit": "kg",
                "description": "Vân lưới nổi đều đẹp mắt, thịt cam giòn thơm, độ ngọt đạt chuẩn 14-16 Brix kiểm định bằng khúc xạ kế.",
                "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80"
            },

            # 2. Nông sản khô & Chế biến
            {
                "name": "Cà Phê Robusta Mộc Cư M'gar Đắk Lắk (Hộp 500g)",
                "cat": "Nông sản khô & Chế biến",
                "price": 140000.0,
                "stock": 300,
                "unit": "hộp",
                "description": "100% hạt Robusta chín cây lên men tự nhiên (Natural Process), rang mộc đậm đà chuẩn gu cà phê Việt.",
                "image_url": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Cà Phê Arabica Cầu Đất Specialty (Hộp 250g)",
                "cat": "Nông sản khô & Chế biến",
                "price": 175000.0,
                "stock": 150,
                "unit": "hộp",
                "description": "Arabica trồng ở độ cao 1.600m tại Cầu Đất Đà Lạt, hương hoa cỏ mùa xuân, vị chua thanh thoát và hậu vị ngọt sâu.",
                "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Hạt Điều Rang Muối Vỏ Lụa A Cồ Bình Phước (Hũ 500g)",
                "cat": "Nông sản khô & Chế biến",
                "price": 165000.0,
                "stock": 220,
                "unit": "hũ",
                "description": "Hạt điều size lớn nhất (A Cồ) rang củi truyền thống, giòn rụm béo ngậy, giữ trọn hương vị tự nhiên.",
                "image_url": "https://images.unsplash.com/photo-1509914398867-074a3f4e3c54?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Tiêu Đen Chư Sê Gia Lai Chuẩn Xuất Khẩu (Hũ 500g)",
                "cat": "Nông sản khô & Chế biến",
                "price": 120000.0,
                "stock": 180,
                "unit": "hũ",
                "description": "Hạt tiêu đen già phơi nắng tự nhiên, dung trọng 570g/l, cay nồng và thơm đậm đặc trưng đất đỏ bazan.",
                "image_url": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Mật Ong Hoa Cà Phê Tây Nguyên Nguyên Chất (Chai 1 Lít)",
                "cat": "Nông sản khô & Chế biến",
                "price": 210000.0,
                "stock": 140,
                "unit": "chai",
                "description": "Thu hoạch vào mùa hoa cà phê nở rộ tháng 3, mật vàng óng ánh đặc sánh, không pha đường, không chất bảo quản.",
                "image_url": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Trà Ô Long Thuần Chủng Bảo Lộc Thượng Hạng (Hộp 250g)",
                "cat": "Nông sản khô & Chế biến",
                "price": 195000.0,
                "stock": 110,
                "unit": "hộp",
                "description": "Búp trà 1 tôm 2 lá viên tròn đều, nước trà vàng xanh sóng sánh, hương thơm bền lâu và vị chát dịu hậu ngọt.",
                "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
            },

            # 3. Gạo & Ngũ cốc cao cấp
            {
                "name": "Gạo ST25 Ông Cua Cua Đỏ Chính Hãng (Túi 5kg)",
                "cat": "Gạo & Ngũ cốc cao cấp",
                "price": 195000.0,
                "stock": 400,
                "unit": "túi",
                "description": "Gạo ngon nhất thế giới chuẩn dòng ST25 của kỹ sư Hồ Quang Cua, hạt dài trong suốt, cơm dẻo mềm thơm mùi lá dứa.",
                "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Gạo Lứt Huyết Rồng Hữu Cơ Điện Biên (Túi 2kg)",
                "cat": "Gạo & Ngũ cốc cao cấp",
                "price": 95000.0,
                "stock": 190,
                "unit": "túi",
                "description": "Hạt gạo đỏ thẫm giàu chất xơ, vitamin B và khoáng chất, rất tốt cho người ăn kiêng, tiểu đường và tim mạch.",
                "image_url": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Gạo Đài Thơm 8 ĐBSCL Xuất Khẩu (Bao 10kg)",
                "cat": "Gạo & Ngũ cốc cao cấp",
                "price": 240000.0,
                "stock": 280,
                "unit": "bao",
                "description": "Hạt gạo thon dài bóng đẹp, cơm mềm ngọt và thơm nhẹ, giữ độ dẻo ngay cả khi để nguội.",
                "image_url": "https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Đậu Phộng Sẻ Thuần Chủng Đắk Nông (Gói 1kg)",
                "cat": "Gạo & Ngũ cốc cao cấp",
                "price": 75000.0,
                "stock": 160,
                "unit": "gói",
                "description": "Hạt đậu nhỏ tròn chắc mẩy, hàm lượng dầu cao, thơm bùi ngậy khi rang giòn hoặc nấu xôi chè.",
                "image_url": "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=600&q=80"
            },

            # 4. Rau củ hữu cơ Đà Lạt
            {
                "name": "Cà Chua Beef Đà Lạt Hữu Cơ (Hộp 1kg)",
                "cat": "Rau củ hữu cơ Đà Lạt",
                "price": 45000.0,
                "stock": 150,
                "unit": "kg",
                "description": "Trái cà chua to chắc thịt, mọng nước, ít hạt, vị ngọt thanh tự nhiên thích hợp làm salad hoặc nấu súp.",
                "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Ớt Chuông Ngọt Sweet Pepper Đà Lạt Đủ Màu (Túi 1kg)",
                "cat": "Rau củ hữu cơ Đà Lạt",
                "price": 60000.0,
                "stock": 130,
                "unit": "kg",
                "description": "Ớt chuông đỏ, vàng, cam giòn rụm không cay, lượng vitamin C dồi dào gấp 3 lần quả cam.",
                "image_url": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Khoai Lang Mật Lang Biang Đà Lạt (Túi 2kg)",
                "cat": "Rau củ hữu cơ Đà Lạt",
                "price": 70000.0,
                "stock": 200,
                "unit": "túi",
                "description": "Khoai lang mật ruột vàng cam chảy mật ngọt lịm khi nướng hoặc hấp, dẻo thơm không bị bở nghẹn.",
                "image_url": "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Xà Lách Romaine Thủy Canh Nhà Màng (Túi 500g)",
                "cat": "Rau củ hữu cơ Đà Lạt",
                "price": 32000.0,
                "stock": 100,
                "unit": "túi",
                "description": "Lá xà lách dày giòn tan, màu xanh mướt, hoàn toàn không dư lượng thuốc BVTV, ăn sống cực ngon.",
                "image_url": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80"
            },

            # 5. Phân bón & Dinh dưỡng cây trồng
            {
                "name": "Phân Bón NPK 20-20-15 Đầu Trâu Cao Cấp (Bao 50kg)",
                "cat": "Phân bón & Dinh dưỡng",
                "price": 880000.0,
                "stock": 120,
                "unit": "bao",
                "description": "Phân bón chuyên dùng cho sầu riêng, cà phê, hồ tiêu giai đoạn nuôi trái lớn nhanh, bóng trái chống rụng non.",
                "image_url": "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Phân Trùn Quế Hữu Cơ Vi Sinh Vermicompost (Bao 25kg)",
                "cat": "Phân bón & Dinh dưỡng",
                "price": 185000.0,
                "stock": 200,
                "unit": "bao",
                "description": "Cung cấp mùn hữu cơ tự nhiên, acid humic và hệ vi sinh vật bản địa giúp cải tạo đất bạc màu, kích thích rễ tơ.",
                "image_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Chế Phẩm Sinh Học Nấm Đối Kháng Trichoderma (Gói 1kg)",
                "cat": "Phân bón & Dinh dưỡng",
                "price": 85000.0,
                "stock": 350,
                "unit": "gói",
                "description": "Đặc trị nấm bệnh Phytophthora, Fusarium gây thối rễ, xì mủ sầu riêng, vàng lá chết nhanh trên hồ tiêu.",
                "image_url": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80"
            },

            # 6. Vật tư & Thiết bị thông minh
            {
                "name": "Kéo Cắt Cành Chuyên Dụng Okatsune 103 Nhật Bản",
                "cat": "Vật tư & Thiết bị thông minh",
                "price": 680000.0,
                "stock": 45,
                "unit": "cái",
                "description": "Lưỡi thép Izumo Yasugi trứ danh sắc bén tuyệt đối, cắt cành cây ăn trái không bị dập xơ vỏ cây.",
                "image_url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Bộ Van Tưới Nhỏ Giọt Bù Áp Israel (Set 50 Đầu Bù Áp 4L/h)",
                "cat": "Vật tư & Thiết bị thông minh",
                "price": 320000.0,
                "stock": 80,
                "unit": "bộ",
                "description": "Tưới nước nhỏ giọt chính xác vào gốc cây, tiết kiệm 60% lượng nước và công sức chăm sóc vườn.",
                "image_url": "https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=600&q=80"
            }
        ]

        for p_data in products_list:
            res = await db.execute(select(Product).filter_by(name=p_data["name"]))
            if not res.scalars().first():
                cat_obj = shop_cat_map.get(p_data["cat"])
                if cat_obj:
                    prod = Product(
                        category_id=cat_obj.id,
                        name=p_data["name"],
                        price=p_data["price"],
                        stock=p_data["stock"],
                        unit=p_data["unit"],
                        description=p_data["description"],
                        image_url=p_data["image_url"],
                        is_active=True
                    )
                    db.add(prod)

        await db.commit()
        print(f"-> Đã nạp thành công 6 danh mục và {len(products_list)} sản phẩm cửa hàng B2C")

        # ==========================================
        # 4. SEED COMMODITIES & HISTORICAL PRICES (30 DAYS)
        # ==========================================
        print("\n--- 4. Nạp Danh Mục Nông Sản & Biểu Đồ Giá Lịch Sử 30 Ngày ---")
        commodity_cats = [
            {"name": "Trái cây xuất khẩu", "description": "Sầu riêng, bưởi da xanh, xoài, thanh long, thanh trà"},
            {"name": "Cây công nghiệp", "description": "Cà phê, hồ tiêu, mủ cao su, hạt điều xuất khẩu"},
            {"name": "Lương thực & Ngũ cốc", "description": "Lúa gạo, bắp ngô, khoai mì, sắn lát"},
            {"name": "Rau củ & Gia vị", "description": "Ớt, gừng, tỏi, khoai tây, cà chua, hành tây"}
        ]

        com_cat_map = {}
        for c_cat in commodity_cats:
            res = await db.execute(select(CommodityCategory).filter_by(name=c_cat["name"]))
            existing = res.scalars().first()
            if not existing:
                existing = CommodityCategory(**c_cat)
                db.add(existing)
                await db.commit()
                await db.refresh(existing)
            com_cat_map[c_cat["name"]] = existing

        commodities_data = [
            {"code": "SR_RI6", "name": "Sầu riêng Ri6", "unit": "kg", "cat": "Trái cây xuất khẩu", "base_price": 85000.0, "volatility": 3000.0, "provinces": ["Tiền Giang", "Bến Tre", "Đồng Nai", "Đắk Lắk"]},
            {"code": "SR_DONA", "name": "Sầu riêng Dona (Monthong)", "unit": "kg", "cat": "Trái cây xuất khẩu", "base_price": 105000.0, "volatility": 4000.0, "provinces": ["Đắk Lắk", "Lâm Đồng", "Tiền Giang"]},
            {"code": "CA_PHE_RO", "name": "Cà phê Robusta (Nhân xô)", "unit": "kg", "cat": "Cây công nghiệp", "base_price": 122000.0, "volatility": 2500.0, "provinces": ["Đắk Lắk", "Lâm Đồng", "Gia Lai", "Đắk Nông"]},
            {"code": "CA_PHE_AR", "name": "Cà phê Arabica Cầu Đất", "unit": "kg", "cat": "Cây công nghiệp", "base_price": 165000.0, "volatility": 3000.0, "provinces": ["Lâm Đồng", "Sơn La", "Quảng Trị"]},
            {"code": "HO_TIEU", "name": "Hồ tiêu đen khô", "unit": "kg", "cat": "Cây công nghiệp", "base_price": 152000.0, "volatility": 2000.0, "provinces": ["Đắk Lắk", "Gia Lai", "Bình Phước", "Bà Rịa - Vũng Tàu"]},
            {"code": "HAT_DIEU", "name": "Hạt điều thô khô", "unit": "kg", "cat": "Cây công nghiệp", "base_price": 34000.0, "volatility": 800.0, "provinces": ["Bình Phước", "Đồng Nai", "Bình Thuận"]},
            {"code": "CAO_SU", "name": "Mủ cao su (DRC 100%)", "unit": "kg", "cat": "Cây công nghiệp", "base_price": 41500.0, "volatility": 600.0, "provinces": ["Bình Phước", "Tây Ninh", "Bình Dương", "Gia Lai"]},
            {"code": "GAO_ST25", "name": "Lúa ST25 tươi tại ruộng", "unit": "kg", "cat": "Lương thực & Ngũ cốc", "base_price": 11500.0, "volatility": 300.0, "provinces": ["Sóc Trăng", "Bạc Liêu", "Kiên Giang"]},
            {"code": "GAO_DT8", "name": "Lúa Đài Thơm 8 tươi", "unit": "kg", "cat": "Lương thực & Ngũ cốc", "base_price": 8900.0, "volatility": 200.0, "provinces": ["An Giang", "Đồng Tháp", "Long An"]},
            {"code": "BUOI_DX", "name": "Bưởi da xanh loại 1", "unit": "kg", "cat": "Trái cây xuất khẩu", "base_price": 45000.0, "volatility": 1500.0, "provinces": ["Bến Tre", "Tiền Giang", "Vĩnh Long"]},
            {"code": "TL_DO", "name": "Thanh long ruột đỏ", "unit": "kg", "cat": "Trái cây xuất khẩu", "base_price": 28000.0, "volatility": 1200.0, "provinces": ["Bình Thuận", "Long An", "Tiền Giang"]},
            {"code": "BO_034", "name": "Bơ sáp 034 Lâm Đồng", "unit": "kg", "cat": "Trái cây xuất khẩu", "base_price": 38000.0, "volatility": 1500.0, "provinces": ["Lâm Đồng", "Đắk Lắk", "Đắk Nông"]},
        ]

        now = datetime.now(timezone.utc)
        total_prices_seeded = 0

        for c_info in commodities_data:
            res = await db.execute(select(Commodity).filter_by(code=c_info["code"]))
            commodity = res.scalars().first()
            if not commodity:
                commodity = Commodity(
                    code=c_info["code"],
                    name=c_info["name"],
                    category_id=com_cat_map[c_info["cat"]].id,
                    description=f"Nông sản {c_info['name']} chất lượng cao trên thị trường Việt Nam",
                    unit=c_info["unit"]
                )
                db.add(commodity)
                await db.commit()
                await db.refresh(commodity)

            # Kiểm tra xem mặt hàng này đã có giá lịch sử hay chưa
            p_check = await db.execute(select(CommodityPrice).filter_by(commodity_id=commodity.id).limit(1))
            if not p_check.scalars().first():
                # Tạo chuỗi giá 30 ngày ngẫu nhiên thực tế (random walk trend)
                current_price = c_info["base_price"]
                prices_to_add = []
                for day_offset in range(30, -1, -1):
                    price_date = now - timedelta(days=day_offset, hours=random.randint(1, 8))
                    # Biến động giá nhẹ mỗi ngày
                    fluctuation = random.uniform(-c_info["volatility"], c_info["volatility"] * 1.05)
                    current_price = max(c_info["base_price"] * 0.7, current_price + fluctuation)
                    
                    # Thêm giá cho từng tỉnh trọng điểm
                    for prov in c_info["provinces"][:2]: # 2 tỉnh tiêu biểu mỗi ngày
                        prov_price = round(current_price + random.uniform(-1000, 1000), -2)
                        p_obj = CommodityPrice(
                            commodity_id=commodity.id,
                            price=prov_price,
                            currency="VND",
                            location=prov,
                            date=price_date
                        )
                        prices_to_add.append(p_obj)

                db.add_all(prices_to_add)
                total_prices_seeded += len(prices_to_add)

        await db.commit()
        print(f"-> Đã nạp xong 12 mặt hàng nông sản và {total_prices_seeded} bản ghi lịch sử giá 30 ngày")

        # ==========================================
        # 5. SEED P2P MARKET POSTS (SÀN NÔNG SẢN SỈ)
        # ==========================================
        print("\n--- 5. Nạp Bài Đăng Sàn Giao Dịch Nông Sản P2P ---")
        market_posts_data = [
            {
                "user_email": "nongdan.sau@norofarm.vn",
                "com_code": "SR_RI6",
                "post_type": PostType.SELL,
                "title": "Cần bán 15 tấn Sầu riêng Ri6 tại vườn Cái Bè - Tiền Giang, cơm vàng hạt lép",
                "description": "Vườn nhà tôi chuẩn bị cắt đợt 1 khoảng 15 tấn sầu riêng Ri6, trái đều đẹp từ 2.5 - 4.5kg, đạt chuẩn vào vựa xuất khẩu. Thương lái có nhu cầu xin liên hệ đến xem vườn trực tiếp.",
                "price": 86000.0,
                "quantity": 15.0,
                "unit": "tấn",
                "location": "Huyện Cái Bè, Tiền Giang",
                "contact_phone": "0912345678"
            },
            {
                "user_email": "nongdan.caphe@norofarm.vn",
                "com_code": "CA_PHE_RO",
                "post_type": PostType.SELL,
                "title": "Xuất bán 25 tấn Cà phê nhân xô Robusta niên vụ 2026 tại Cư M'gar",
                "description": "Cà phê hái chín trên 90%, phơi sấy bạt sạch sẽ, thủy phần dưới 12.5%, tạp chất dưới 0.5%, hàng sẵn sàng bốc tại kho xã Quảng Phú.",
                "price": 123000.0,
                "quantity": 25.0,
                "unit": "tấn",
                "location": "Huyện Cư M'gar, Đắk Lắk",
                "contact_phone": "0923456789"
            },
            {
                "user_email": "nongdan.sau@norofarm.vn",
                "com_code": "BUOI_DX",
                "post_type": PostType.SELL,
                "title": "Bán 8 tấn Bưởi da xanh ruột hồng chuẩn VietGAP tại Mỏ Cày Bắc",
                "description": "Bưởi da xanh sạch, vườn bao trái cẩn thận, ruột hồng tép giòn không hột. Cung ứng cho siêu thị hoặc vựa trái cây lớn.",
                "price": 46000.0,
                "quantity": 8.0,
                "unit": "tấn",
                "location": "Huyện Mỏ Cày Bắc, Bến Tre",
                "contact_phone": "0912345678"
            },
            {
                "user_email": "thuonglai.toancau@norofarm.vn",
                "com_code": "SR_DONA",
                "post_type": PostType.BUY,
                "title": "Công ty Nông sản Toàn Cầu cần thu mua 50 tấn Sầu riêng Dona xuất khẩu Trung Quốc",
                "description": "Chúng tôi cần thu mua số lượng lớn sầu riêng Dona tại Đắk Lắk và Lâm Đồng. Yêu cầu trái tròn đều từ 2.8kg trở lên, mẫu mã đẹp, test dư lượng đạt chuẩn. Đặt cọc ngay khi chốt hợp đồng vườn.",
                "price": 108000.0,
                "quantity": 50.0,
                "unit": "tấn",
                "location": "TP. Buôn Ma Thuột, Đắk Lắk",
                "contact_phone": "0934567890"
            },
            {
                "user_email": "thuonglai.toancau@norofarm.vn",
                "com_code": "HO_TIEU",
                "post_type": PostType.BUY,
                "title": "Thu mua 30 tấn Hồ tiêu đen khô dung trọng 570g/l giao tại kho Bình Dương",
                "description": "Thu mua tiêu khô dung trọng 570g/l trở lên, không lẫn ẩm mốc, thanh toán chuyển khoản ngay trong ngày sau khi cân và kiểm nghiệm.",
                "price": 153000.0,
                "quantity": 30.0,
                "unit": "tấn",
                "location": "TP. Dĩ An, Bình Dương",
                "contact_phone": "0934567890"
            },
            {
                "user_email": "thuonglai.toancau@norofarm.vn",
                "com_code": "GAO_ST25",
                "post_type": PostType.BUY,
                "title": "Hợp tác xã cần nhập 100 tấn Lúa ST25 tươi thu hoạch tại ruộng vụ Đông Xuân",
                "description": "Nhận bao tiêu vùng trồng lúa ST25 giống thuần chủng tại Sóc Trăng và Bạc Liêu. Cắt máy và chở ghe tại ruộng.",
                "price": 11800.0,
                "quantity": 100.0,
                "unit": "tấn",
                "location": "Huyện Mỹ Xuyên, Sóc Trăng",
                "contact_phone": "0934567890"
            }
        ]

        com_lookup = {}
        for c_code in ["SR_RI6", "SR_DONA", "CA_PHE_RO", "BUOI_DX", "HO_TIEU", "GAO_ST25"]:
            c_res = await db.execute(select(Commodity).filter_by(code=c_code))
            com_lookup[c_code] = c_res.scalars().first()

        for p_data in market_posts_data:
            res = await db.execute(select(MarketPost).filter_by(title=p_data["title"]))
            if not res.scalars().first():
                user = user_map.get(p_data["user_email"])
                com = com_lookup.get(p_data["com_code"])
                if user and com:
                    post = MarketPost(
                        user_id=user.id,
                        commodity_id=com.id,
                        post_type=p_data["post_type"],
                        status=PostStatus.APPROVED,
                        title=p_data["title"],
                        description=p_data["description"],
                        price=p_data["price"],
                        quantity=p_data["quantity"],
                        unit=p_data["unit"],
                        location=p_data["location"],
                        contact_phone=p_data["contact_phone"],
                        is_active=True
                    )
                    db.add(post)

        await db.commit()
        print(f"-> Đã nạp {len(market_posts_data)} bài đăng mua/bán nông sản sỉ P2P được duyệt")

        # ==========================================
        # 6. SEED NEWS / ARTICLES & TAGS
        # ==========================================
        print("\n--- 6. Nạp Chuyên Mục, Thẻ & Bài Viết Cẩm Nang Nông Nghiệp ---")
        art_categories = [
            {"name": "Thị trường nông sản", "slug": "thi-truong-nong-san", "description": "Biến động giá cả, xu hướng xuất khẩu nông sản Việt Nam"},
            {"name": "Kỹ thuật canh tác", "slug": "ky-thuat-canh-tac", "description": "Hướng dẫn trồng trọt, chăm sóc, phòng trừ sâu bệnh năng suất cao"},
            {"name": "Thời sự & Chính sách", "slug": "thoi-su-chinh-sach", "description": "Chủ trương chính sách hỗ trợ nông dân, mã số vùng trồng xuất khẩu"}
        ]
        art_cat_map = {}
        for ac in art_categories:
            res = await db.execute(select(ArticleCategory).filter_by(slug=ac["slug"]))
            existing = res.scalars().first()
            if not existing:
                existing = ArticleCategory(**ac)
                db.add(existing)
                await db.commit()
                await db.refresh(existing)
            art_cat_map[ac["slug"]] = existing

        tags_data = [
            {"name": "Sầu riêng", "slug": "sau-rieng"},
            {"name": "Cà phê Tây Nguyên", "slug": "ca-phe-tay-nguyen"},
            {"name": "Hồ tiêu", "slug": "ho-tieu"},
            {"name": "Gạo ST25", "slug": "gao-st25"},
            {"name": "Hữu cơ VietGAP", "slug": "huu-co-vietgap"},
            {"name": "Xuất khẩu", "slug": "xuat-khau"},
        ]
        tag_map = {}
        for t in tags_data:
            res = await db.execute(select(Tag).filter_by(slug=t["slug"]))
            existing = res.scalars().first()
            if not existing:
                existing = Tag(**t)
                db.add(existing)
                await db.commit()
                await db.refresh(existing)
            tag_map[t["slug"]] = existing

        admin_user = user_map.get("admin@norofarm.vn")
        articles_data = [
            {
                "title": "Kỹ thuật chăm sóc sầu riêng giai đoạn nuôi trái chống rụng non và méo trái",
                "slug": "ky-thuat-cham-soc-sau-rieng-giai-doan-nuoi-trai",
                "cat_slug": "ky-thuat-canh-tac",
                "tags": [tag_map["sau-rieng"], tag_map["huu-co-vietgap"]],
                "summary": "Giai đoạn từ 45 đến 70 ngày sau khi xả nhụy là thời điểm quyết định trọng lượng và hình thức trái sầu riêng. Hướng dẫn kỹ thuật bón phân NPK cân đối và quản lý nước tưới.",
                "content": """
### 1. Quản lý chế độ nước tưới
Trong giai đoạn trái từ 45 - 70 ngày tuổi, cây sầu riêng cần lượng nước ổn định, không để đất quá khô rồi tưới dồn dập khiến sốc nước gây nứt trái và rụng trái non. Tưới định kỳ 2 ngày một lần vào buổi sáng sớm.

### 2. Dinh dưỡng bón gốc
- Tăng cường Kali và Canxi Bo để cuống trái dai chắc, vỏ xanh bóng.
- Bón phân NPK chuyên dùng như 12-12-17 hoặc 20-20-15 Đầu Trâu với lượng 300g - 500g/gốc tùy theo đường kính tán.
- Bổ sung phân trùn quế hoặc phân hữu cơ vi sinh ủ Trichoderma xung quanh rìa tán cây.

### 3. Phòng trừ bọ xít muỗi và rệp sáp
Phun định kỳ chế phẩm sinh học bảo vệ thực vật phòng ngừa bọ trĩ và rệp sáp chích hút dịch trái non làm biến dạng múi.
                """,
                "thumbnail_url": "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80",
                "meta_title": "Kỹ thuật chăm sóc sầu riêng nuôi trái - NoroFarm",
                "meta_description": "Hướng dẫn đầy đủ cách chăm sóc sầu riêng giai đoạn nuôi trái chống rụng non, méo múi cho năng suất cao.",
                "view_count": 1420
            },
            {
                "title": "Thị trường cà phê Tây Nguyên niên vụ 2026: Cơ hội vàng khi giá duy trì mức kỷ lục",
                "slug": "thi-truong-ca-phe-tay-nguyen-nien-vu-2026",
                "cat_slug": "thi-truong-nong-san",
                "tags": [tag_map["ca-phe-tay-nguyen"], tag_map["xuat-khau"]],
                "summary": "Giá cà phê nhân xô Robusta các tỉnh Đắk Lắk, Lâm Đồng, Gia Lai tiếp tục giữ vững trên ngưỡng 120.000 đ/kg do nhu cầu toàn cầu tăng mạnh và sản lượng thế giới khan hiếm.",
                "content": """
### Toàn cảnh nguồn cung và nhu cầu quốc tế
Theo Hiệp hội Cà phê - Ca cao Việt Nam (VICOFA), sản lượng Robusta toàn cầu năm nay sụt giảm do tác động của biến đổi khí hậu tại Brazil và Indonesia. Trong khi đó, các nhà rang xay châu Âu và Mỹ đang gia tăng nhập khẩu cà phê từ Việt Nam nhờ chất lượng cải thiện rõ rệt.

### Khuyến cáo dành cho bà con nông dân
Bà con nông dân được khuyến cáo không nên vội vàng mở rộng diện tích trồng tự phát ở những vùng thiếu nước tưới, thay vào đó cần tập trung thâm canh, áp dụng quy trình hái chín trên 90% và sơ chế lên men tự nhiên (Natural / Honey process) để bán được mức giá cộng thưởng (premium price) cao hơn 15 - 20%.
                """,
                "thumbnail_url": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
                "meta_title": "Thị trường cà phê Tây Nguyên 2026 - NoroFarm",
                "meta_description": "Phân tích biến động giá cà phê nhân xô niên vụ 2026 và lời khuyên canh tác cho bà con nông dân.",
                "view_count": 2890
            },
            {
                "title": "Tiêu chuẩn cấp mã số vùng trồng cho sầu riêng và bưởi da xanh xuất khẩu chính ngạch",
                "slug": "tieu-chuan-cap-ma-so-vung-trong-xuat-khau-chinh-ngach",
                "cat_slug": "thoi-su-chinh-sach",
                "tags": [tag_map["sau-rieng"], tag_map["xuat-khau"], tag_map["huu-co-vietgap"]],
                "summary": "Bộ Nông nghiệp & PTNT siết chặt quy trình giám sát mã số vùng trồng và cơ sở đóng gói để đảm bảo xuất khẩu nông sản bền vững sang các thị trường lớn.",
                "content": """
### Yêu cầu bắt buộc về vùng trồng
1. Vùng trồng tối thiểu từ 10ha trở lên đối với cây ăn trái.
2. Có nhật ký điện tử ghi chép toàn bộ quá trình sử dụng phân bón, thuốc BVTV và thu hoạch.
3. Không sử dụng các hoạt chất bảo vệ thực vật nằm trong danh mục cấm của nước nhập khẩu.
4. Lắp đặt bẫy bả ruồi đục quả và rệp sáp, định kỳ lấy mẫu kiểm tra dịch hại.

NoroFarm hiện đang hỗ trợ kết nối trực tiếp các hợp tác xã với doanh nghiệp xuất khẩu có đầy đủ mã số vùng trồng hợp lệ.
                """,
                "thumbnail_url": "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80",
                "meta_title": "Mã số vùng trồng xuất khẩu sầu riêng - NoroFarm",
                "meta_description": "Chi tiết quy định và điều kiện để được cấp mã số vùng trồng xuất khẩu nông sản chính ngạch.",
                "view_count": 980
            },
            {
                "title": "Mô hình nuôi trùn quế kết hợp ủ phân vi sinh hữu cơ khép kín tại nông hộ",
                "slug": "mo-hinh-nuoi-trun-que-ket-hop-u-phan-vi-sinh",
                "cat_slug": "ky-thuat-canh-tac",
                "tags": [tag_map["huu-co-vietgap"]],
                "summary": "Tận dụng phân bò và phụ phẩm nông nghiệp nuôi trùn quế giúp nhà vườn tiết kiệm hàng chục triệu đồng tiền phân bón mỗi năm và phục hồi độ phì nhiêu của đất.",
                "content": """
### Lợi ích kép từ mô hình trùn quế
- Phân trùn quế chứa hàm lượng hữu cơ cao, kích thích hệ vi sinh vật có lợi phát triển mạnh.
- Thịt trùn quế là nguồn thức ăn giàu đạm cho gia cầm, cá và tôm.
- Chi phí đầu tư ban đầu thấp, chu kỳ thu hoạch phân chỉ từ 30 - 45 ngày.
                """,
                "thumbnail_url": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80",
                "meta_title": "Nuôi trùn quế cải tạo đất nông nghiệp - NoroFarm",
                "meta_description": "Mô hình nông nghiệp tuần hoàn bền vững nuôi trùn quế lấy phân bón cho cây trồng.",
                "view_count": 670
            }
        ]

        for art in articles_data:
            res = await db.execute(select(Article).filter_by(slug=art["slug"]))
            if not res.scalars().first():
                cat = art_cat_map[art["cat_slug"]]
                new_art = Article(
                    title=art["title"],
                    slug=art["slug"],
                    summary=art["summary"],
                    content=art["content"].strip(),
                    thumbnail_url=art["thumbnail_url"],
                    meta_title=art["meta_title"],
                    meta_description=art["meta_description"],
                    is_published=True,
                    published_at=now - timedelta(days=random.randint(1, 15)),
                    view_count=art["view_count"],
                    category_id=cat.id,
                    author_id=admin_user.id if admin_user else None,
                    tags=art["tags"]
                )
                db.add(new_art)

        await db.commit()
        print(f"-> Đã nạp thành công {len(articles_data)} bài viết chuyên sâu & cẩm nang nông nghiệp")

        # ==========================================
        # 7. SEED WEATHER LOCATIONS & FORECASTS
        # ==========================================
        print("\n--- 7. Nạp Vị Trí & Dự Báo Thời Tiết Nông Nghiệp ---")
        locations_data = [
            {"name": "Đắk Lắk", "code": "dak_lak", "latitude": 12.6667, "longitude": 108.0333},
            {"name": "Lâm Đồng", "code": "lam_dong", "latitude": 11.9464, "longitude": 108.4418},
            {"name": "Gia Lai", "code": "gia_lai", "latitude": 13.9833, "longitude": 108.0000},
            {"name": "Đắk Nông", "code": "dak_nong", "latitude": 12.1333, "longitude": 107.6833},
            {"name": "Kon Tum", "code": "kon_tum", "latitude": 14.3500, "longitude": 108.0000},
            {"name": "Bình Phước", "code": "binh_phuoc", "latitude": 11.7500, "longitude": 106.9000},
            {"name": "Tiền Giang", "code": "tien_giang", "latitude": 10.4167, "longitude": 106.3333},
            {"name": "Bến Tre", "code": "ben_tre", "latitude": 10.2333, "longitude": 106.3833},
            {"name": "Đồng Tháp", "code": "dong_thap", "latitude": 10.5000, "longitude": 105.6667},
            {"name": "Cần Thơ", "code": "can_tho", "latitude": 10.0333, "longitude": 105.7833},
        ]

        conditions = [
            ("Nắng ráo", "01d"),
            ("Ít mây", "02d"),
            ("Mây rải rác", "03d"),
            ("Mưa rào nhẹ", "10d"),
            ("Dông chiều tối", "11d")
        ]

        for loc_data in locations_data:
            res = await db.execute(select(Location).filter_by(code=loc_data["code"]))
            loc = res.scalars().first()
            if not loc:
                loc = Location(
                    name=loc_data["name"],
                    code=loc_data["code"],
                    latitude=loc_data["latitude"],
                    longitude=loc_data["longitude"],
                    is_active=True
                )
                db.add(loc)
                await db.commit()
                await db.refresh(loc)

            # Seed 5 days forecast if empty
            f_check = await db.execute(select(WeatherForecast).filter_by(location_id=loc.id).limit(1))
            if not f_check.scalars().first():
                for i in range(5):
                    cond_text, icon_id = random.choice(conditions)
                    t_min = round(random.uniform(20.0, 24.0), 1)
                    t_max = round(random.uniform(29.0, 34.0), 1)
                    fc = WeatherForecast(
                        location_id=loc.id,
                        forecast_date=now + timedelta(days=i),
                        temperature_min=t_min,
                        temperature_max=t_max,
                        humidity=round(random.uniform(65.0, 85.0), 1),
                        precipitation=round(random.uniform(0.0, 15.0), 1),
                        wind_speed=round(random.uniform(2.0, 6.0), 1),
                        condition=cond_text,
                        icon_url=f"https://openweathermap.org/img/wn/{icon_id}@2x.png"
                    )
                    db.add(fc)

        await db.commit()
        print(f"-> Đã nạp thành công 10 tỉnh thành nông nghiệp và dữ liệu dự báo thời tiết 5 ngày")

        # ==========================================
        # 8. SEED SAMPLE ORDERS & ITEMS
        # ==========================================
        print("\n--- 8. Nạp Đơn Hàng Mẫu Kiểm Thử (Orders & Items) ---")
        customer_user = user_map.get("khachhang.mai@norofarm.vn")
        if customer_user:
            res_orders = await db.execute(select(Order).filter_by(user_id=customer_user.id).limit(1))
            if not res_orders.scalars().first():
                # Lấy 3 sản phẩm mẫu
                res_p = await db.execute(select(Product).limit(4))
                prods = res_p.scalars().all()
                if len(prods) >= 3:
                    # Đơn 1: Đã hoàn thành (COMPLETED)
                    order1 = Order(
                        user_id=customer_user.id,
                        total_amount=prods[0].price * 2 + prods[1].price * 1,
                        status=OrderStatus.COMPLETED,
                        payment_method=PaymentMethod.COD,
                        payment_status=PaymentStatus.PAID,
                        shipping_address="123 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh",
                        contact_phone="0945678901",
                        notes="Giao giờ hành chính, gọi trước 15 phút"
                    )
                    db.add(order1)
                    await db.commit()
                    await db.refresh(order1)

                    item1 = OrderItem(order_id=order1.id, product_id=prods[0].id, quantity=2, price=prods[0].price)
                    item2 = OrderItem(order_id=order1.id, product_id=prods[1].id, quantity=1, price=prods[1].price)
                    db.add_all([item1, item2])

                    # Đơn 2: Đang giao hàng (SHIPPING)
                    order2 = Order(
                        user_id=customer_user.id,
                        total_amount=prods[2].price * 3,
                        status=OrderStatus.SHIPPING,
                        payment_method=PaymentMethod.VNPAY,
                        payment_status=PaymentStatus.PAID,
                        shipping_address="Tòa nhà Landmark 81, Bình Thạnh, TP. Hồ Chí Minh",
                        contact_phone="0945678901",
                        notes="Hàng dễ dập, vui lòng vận chuyển cẩn thận"
                    )
                    db.add(order2)
                    await db.commit()
                    await db.refresh(order2)

                    item3 = OrderItem(order_id=order2.id, product_id=prods[2].id, quantity=3, price=prods[2].price)
                    db.add(item3)

                    await db.commit()
                    print("-> Đã nạp 2 đơn hàng mẫu hoàn chỉnh kèm chi tiết món hàng")

        # ==========================================
        # 9. PURGE REDIS CACHES
        # ==========================================
        print("\n--- 9. Xóa Toàn Bộ Caches Cũ Để Áp Dụng Dữ Liệu Mới ---")
        try:
            await redis_client.delete_pattern("*")
            print("-> Đã làm mới toàn bộ bộ đệm Cache!")
        except Exception as e:
            print(f"-> Lưu ý: Không thể kết nối Redis để xóa cache ({e}), in-memory cache tự cập nhật.")

    print("\n==================================================")
    print("HOÀN THÀNH NẠP TOÀN BỘ DỮ LIỆU THÀNH CÔNG RỰC RỠ!")
    print("Tài khoản Quản trị: admin@norofarm.vn | Mật khẩu: Admin@123456")
    print("Tài khoản Nông dân: nongdan.sau@norofarm.vn | Mật khẩu: Farmer@123456")
    print("Tài khoản Thương lái: thuonglai.toancau@norofarm.vn | Mật khẩu: Trader@123456")
    print("Tài khoản Khách hàng: khachhang.mai@norofarm.vn | Mật khẩu: User@123456")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(seed_data())
