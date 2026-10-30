import logging
from typing import List, Dict, Any, Tuple
import httpx
from app.core.config import settings
from app.schemas.ai_chat import ChatMessage, ChatResponse

logger = logging.getLogger(__name__)

NOROFARM_SYSTEM_PROMPT = """
Bạn là Cố vấn Nông nghiệp & Kinh tế Nông vụ Chuyên sâu của Nền tảng NoroFarm (norofarm.com).
Bạn là một chuyên gia nông học đầu ngành kiêm chuyên gia phân tích thị trường nông sản quốc tế và Việt Nam. Bạn có kiến thức bách khoa toàn diện, am hiểu sâu sắc về thực tiễn đồng ruộng và dòng chảy thương mại toàn cầu.

PHẠM VI NĂNG LỰC TOÀN DIỆN:

1. KIẾN THỨC NÔNG HỌC & BẢO VỆ THỰC VẬT (ƯU TIÊN HÀNG ĐẦU):
   - Khi người dùng hỏi về sâu bệnh hại (nấm hồng, rệp sáp, rỉ sắt, thán thư, nứt thân xì mủ, rầy xanh, tuyến trùng...): Hãy trả lời trực diện, chi tiết về triệu chứng, nguyên nhân gây hại, biện pháp canh tác và phác đồ thuốc BVTV đặc trị cụ thể (tên hoạt chất, cách phối trộn, thời điểm phun, thời gian cách ly PHI).
   - Tuyệt đối không trả lời lạc đề sang giá cả khi câu hỏi đang hỏi về kỹ thuật hoặc sâu bệnh hại.

2. CÁC LOẠI CÂY TRỒNG & VẬT NUÔI:
   - Cây công nghiệp: Cà phê (Robusta, Arabica), Hồ tiêu, Cao su, Điều, Mắc ca, Chè (trà), Ca cao...
   - Cây ăn quả giá trị cao: Sầu riêng (Ri6, Monthong / Dona, Musang King), Mít, Bơ 034, Thanh long, Cam quýt bưởi, Xoài, Chuối, Vải, Nhãn...
   - Lương thực & Hoa màu: Lúa gạo (ST24, ST25, Đài Thơm 8, OM 5451, Jasmine), Bắp/Ngô, Khoai lang, Sắn, Rau màu các loại.
   - Thủy sản & Chăn nuôi: Bò thịt, heo, gia cầm, tôm nước lợ, cá tra.

3. KỸ THUẬT CANH TÁC & DINH DƯỠNG THỔ NHƯỠNG:
   - Đo và nâng độ pH đất (5.5 - 6.5), giải độc phèn, hạ chua bằng vôi nông nghiệp/Dolomite; ủ phân hữu cơ vi sinh Trichoderma.
   - Chế độ bón phân NPK theo từng giai đoạn: phục hồi sau thu hoạch, kích đọt, phân hóa mầm hoa, nuôi trái non, nuôi lớn trái và tích lũy đường.
   - Kỹ thuật nước tưới: Xiết nước kích hoa, tưới giữ ẩm mùa khô, tưới nhỏ giọt tiết kiệm nước.

4. BẢN TIN GIÁ CẢ & THỊ TRƯỜNG THẾ GIỚI - NỘI ĐỊA (CHỈ KHI ĐƯỢC HỎI VỀ GIÁ HOẶC THỊ TRƯỜNG):
   - Sàn London ICE (Robusta), Sàn New York ICE (Arabica), Sàn nông sản Chicago (CBOT), Giá tiêu IPC quốc tế, Giá cao su TOCOM/SICOM, Giá gạo xuất khẩu 5% tấm.
   - Giá thu mua nông sản tại các tỉnh trọng điểm (Đắk Lắk, Gia Lai, Lâm Đồng, Đắk Nông, Bình Phước, ĐBSCL).
   - Phân tích kinh tế: Chênh lệch Basis Spread, tỷ giá USD/VND, chi phí logistics xuất nhập khẩu.

5. CHÍNH SÁCH XUẤT KHẨU & TIÊU CHUẨN:
   - Quy định chống phá rừng EUDR của EU (tọa độ GPS thửa đất, cam kết không mất rừng sau 31/12/2020).
   - Mã số vùng trồng (MSVT) xuất khẩu chính ngạch sang Trung Quốc (GACC), Mỹ, Nhật Bản, EU.
   - Tiêu chuẩn VietGAP, GlobalGAP, Rainforest Alliance (RA), 4C, Organic.
   - Khí tượng vụ mùa: Hiện tượng El Nino, La Nina, thời tiết nông vụ.

QUY TẮC TRẢ LỜI:
- Bắt đúng trọng tâm câu hỏi của người dùng. Nếu hỏi về sâu bệnh thì trả lời kỹ thuật sâu bệnh; nếu hỏi về giá thì trả lời giá; nếu hỏi về thời tiết thì dự báo thời tiết.
- Trình bày rõ ràng, dùng bullet points, in đậm từ khóa quan trọng và tên hoạt chất để bà con dễ đọc trên điện thoại.
- Giữ phong thái chuyên gia nông học gần gũi, uyên bác và thực tế.
"""

DEFAULT_SUGGESTIONS = [
    "Cách trị nấm hồng và rệp sáp cà phê?",
    "Giá cà phê hôm nay tại Tây Nguyên và sàn London",
    "Kỹ thuật chặn đọt sầu riêng khi nuôi trái non",
    "Quy định EUDR ảnh hưởng thế nào đến nông sản xuất khẩu?",
]

class AiChatService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = getattr(settings, "GEMINI_MODEL", "gemini-flash-latest")

    def _generate_fallback_response(self, user_msg: str) -> Tuple[str, List[str]]:
        """Phản hồi chuyên gia nông học thông minh dựa trên phân tích đúng trọng tâm câu hỏi"""
        msg_lower = user_msg.lower()

        # =========================================================================
        # ƯU TIÊN 1: SÂU BỆNH HẠI & PHÒNG TRỪ BẢO VỆ THỰC VẬT (Bắt trước tiên)
        # =========================================================================
        is_pest_query = any(w in msg_lower for w in [
            "sâu", "bệnh", "nấm", "rầy", "rệp", "thán thư", "xì mủ", "rỉ sắt",
            "chết nhanh", "chết chậm", "tuyến trùng", "đốm lá", "khô cành",
            "phòng trừ", "thuốc", "trị", "xịt", "phun", "hoạt chất"
        ])

        if is_pest_query:
            # 1.1 Sâu bệnh trên Cà phê (Nấm hồng, rệp sáp, rỉ sắt, mọt đục cành...)
            if any(w in msg_lower for w in ["cà phê", "cafe", "robusta", "arabica"]) or "nấm hồng" in msg_lower or "rệp sáp" in msg_lower:
                reply = (
                    "**Quy trình Phòng trừ Nấm hồng & Rệp sáp hại Cây Cà phê (Chuẩn IPM):**\n\n"
                    "### 1. Phòng trừ Bệnh Nấm hồng (*Corticium salmonicolor*):\n"
                    "• **Thời điểm gây hại:** Bùng phát mạnh trong mùa mưa (tháng 6 - 10), độ ẩm không khí cao, tán cây rậm rạp.\n"
                    "• **Triệu chứng:** Xuất hiện lớp phấn màu hồng/trắng trên vỏ cành, chùm quả; làm tắc mạch dẫn khiến cành khô cháy, rụng lá và quả non.\n"
                    "• **Biện pháp xử lý:**\n"
                    "  - *Canh tác:* Cắt tỉa cành tăm, cành vô hiệu giúp vườn thông thoáng; cắt bỏ đoạn cành nhiễm bệnh gom ra xa vườn đốt tiêu hủy.\n"
                    "  - *Thuốc đặc trị:* Phun ướt đều tán và thân cành bằng các hoạt chất: **Validamycin** (Valivita, Validacin), **Hexaconazole** (Anvil), **Cuprous oxide** (Đồng đỏ Nordox) hoặc **Mancozeb** kết hợp Metalaxyl. Phun kép 2 lần cách nhau 7 - 10 ngày.\n\n"
                    "### 2. Phòng trừ Rệp sáp (*Pseudococcus* spp.):\n"
                    "• **Tập tính:** Ký sinh hút chích chùm quả non, cuống lá và rễ ngầm dưới đất; tiết mật ngọt tạo môi trường cho nấm bồ hóng phát triển.\n"
                    "• **Biện pháp xử lý:**\n"
                    "  - *Rệp sáp trên tán cành:* Phun hoạt chất **Spirotetramat** (Movento - lưu dẫn 2 chiều cực mạnh), **Buprofezin** (Applaud - chống lột xác ấu trùng), **Thiamethoxam** hoặc dầu khoáng sinh học SK Enspray 99 EC.\n"
                    "  - *Rệp sáp gốc & rễ:* Dùng thuốc gốc sinh học hoặc tưới gốc hoạt chất lưu dẫn sâu, dọn sạch cỏ quanh gốc và rải thuốc trừ kiến đen (vì kiến tha rệp lây lan).\n"
                    "• **Lưu ý an toàn:** Tuân thủ thời gian cách ly (PHI) tối thiểu 14 ngày trước vụ thu hoạch."
                )
                suggestions = [
                    "Thuốc sinh học phòng trừ rệp sáp an toàn",
                    "Cách cắt tỉa cành cà phê sau thu hoạch",
                    "Thời điểm bón phân đón mưa cho cà phê",
                ]
                return reply, suggestions

            # 1.2 Sâu bệnh trên Sầu riêng
            elif any(w in msg_lower for w in ["sầu riêng", "ri6", "monthong"]):
                reply = (
                    "**Quy trình Quản lý Sâu Bệnh hại Sầu riêng:**\n\n"
                    "• **Bệnh Nứt thân xì mủ & Thối rễ (*Phytophthora*):**\n"
                    "  - Dùng dao cạo sạch vết xì mủ trên thân, quét dung dịch đậm đặc **Fosetyl-Aluminium** (Aliette) hoặc **Metalaxyl + Mancozeb**.\n"
                    "  - Tưới gốc ngừa thối rễ bằng chế phẩm sinh học nấm đối kháng *Trichoderma* kết hợp *Bacillus subtilis*.\n"
                    "• **Rầy xanh & Rầy phấn trắng hại đọt non:**\n"
                    "  - Phun ngừa ngay khi cây vừa nhú đọt hình 'mũi giáo' bằng hoạt chất **Emamectin benzoate**, **Buprofezin** hoặc **Thiamethoxam**.\n"
                    "  - Phun nhắc lại sau 5-7 ngày để cắt đứt vòng đời lột xác của rầy."
                )
                suggestions = [
                    "Cách chặn đọt sầu riêng khi đang nuôi trái",
                    "Quy trình xử lý ra hoa nghịch vụ sầu riêng",
                    "Thuốc trị xì mủ sầu riêng hiệu quả nhất",
                ]
                return reply, suggestions

            # 1.3 Bệnh nấm và côn trùng nói chung
            else:
                reply = (
                    "**Hướng dẫn Phòng trừ Sâu Bệnh Hại Cây Trồng (Nguyên tắc IPM):**\n\n"
                    "• **1. Nhóm bệnh do Nấm (Thán thư, rỉ sắt, sương mai, nấm hồng):**\n"
                    "  - Cắt tỉa thông thoáng vườn, dọn dẹp tàn dư lá bệnh.\n"
                    "  - Hoạt chất khuyến nghị: *Hexaconazole*, *Azoxystrobin*, *Metalaxyl*, *Mancozeb*, *Copper Oxychloride*.\n"
                    "• **2. Nhóm chích hút & sâu hại (Rầy, rệp, bọ trĩ, sâu đục cành):**\n"
                    "  - Hoạt chất sinh học & thế hệ mới: *Emamectin*, *Spirotetramat*, *Buprofezin*, *Abamectin*.\n"
                    "  - Luân phiên hoạt chất để tránh bộc phát tính kháng thuốc; phun vào sáng sớm hoặc chiều mát."
                )
                suggestions = [
                    "Cách phối trộn thuốc BVTV an toàn",
                    "Thời gian cách ly an toàn (PHI) của thuốc BVTV",
                    "Chế phẩm sinh học phòng trừ sâu bệnh hữu cơ",
                ]
                return reply, suggestions

        # =========================================================================
        # ƯU TIÊN 2: DINH DƯỠNG, PHÂN BÓN & CẢI TẠO ĐẤT
        # =========================================================================
        is_fertilizer_query = any(w in msg_lower for w in [
            "phân", "bón", "npk", "đạm", "lân", "kali", "vi lượng",
            "đất", "độ ph", "chua", "hữu cơ", "trùn quế", "uống", "nuôi trái", "làm bông"
        ])

        if is_fertilizer_query:
            reply = (
                "**Hướng dẫn Quản lý Dinh dưỡng Cây trồng & Cải tạo Đất Canh tác:**\n\n"
                "• **1. Kiểm soát độ pH đất:**\n"
                "  - Đa số cây trồng phát triển tốt ở pH **5.5 - 6.5**. Nếu pH < 5.0 (đất chua), cây bị bó rễ, khó hấp thu lân và vi lượng.\n"
                "  - Bón 500kg - 1 tấn vôi nông nghiệp hoặc Dolomite/ha vào đầu mùa mưa để nâng pH và bổ sung Canxi/Magie.\n"
                "• **2. Nguyên tắc bón NPK theo chu kỳ mùa vụ:**\n"
                "  - *Phục hồi sau thu hoạch:* Ưu tiên Đạm & Lân cao (NPK 20-20-15, DAP) + bón lót phân chuồng hoai mục ủ Trichoderma.\n"
                "  - *Phân hóa mầm hoa:* Cắt giảm đạm, tăng lân và trung vi lượng Bo - Kẽm (NPK 10-50-10 hoặc 10-60-10).\n"
                "  - *Nuôi trái lớn & Tích lũy đường:* Tăng cường Kali Sunfat (K2SO4) để trái đều, nặng hạt, bóng đẹp và thơm ngọt."
            )
            suggestions = [
                "Cách nhận biết cây thiếu vi lượng Bo và Kẽm",
                "Kỹ thuật ủ phân chuồng hoai mục bằng Trichoderma",
                "Cách đo độ pH đất chính xác tại vườn",
            ]
            return reply, suggestions

        # =========================================================================
        # ƯU TIÊN 3: CHÍNH SÁCH XUẤT KHẨU (EUDR, Mã số vùng trồng, VietGAP)
        # =========================================================================
        is_policy_query = any(w in msg_lower for w in [
            "eudr", "phá rừng", "châu âu", "trung quốc", "mã số vùng trồng",
            "msvt", "vietgap", "globalgap", "tiêu chuẩn", "xuất khẩu", "nghị định thư"
        ])

        if is_policy_query:
            reply = (
                "**Bản tin Tiêu chuẩn & Quy định Nông sản Xuất khẩu:**\n\n"
                "• **Quy định chống phá rừng EUDR (Liên minh Châu Âu):**\n"
                "  - Áp dụng bắt buộc đối với cà phê, cao su, gỗ xuất khẩu sang thị trường EU.\n"
                "  - Yêu cầu cung cấp tọa độ GPS ranh giới thửa đất, chứng minh đất không bị chuyển đổi từ đất rừng tự nhiên sau mốc **31/12/2020**.\n"
                "• **Mã số vùng trồng (MSVT) xuất sang Trung Quốc (GACC):**\n"
                "  - Vùng trồng phải có sổ nhật ký canh tác số, kiểm soát nghiêm ngặt dư lượng hóa chất BVTV cấm và dịch hại kiểm dịch.\n"
                "• **Khuyến nghị:** Nhà vườn và hợp tác xã nên liên kết chuỗi giá trị và chuyển đổi sang quy trình VietGAP/GlobalGAP để hưởng lợi thế giá cao."
            )
            suggestions = [
                "Hồ sơ thủ tục đăng ký Mã số vùng trồng",
                "Cách lấy tọa độ GPS thửa đất phục vụ EUDR",
                "Danh mục hóa chất bị cấm khi xuất khẩu sầu riêng",
            ]
            return reply, suggestions

        # =========================================================================
        # ƯU TIÊN 4: THỜI TIẾT NÔNG VỤ & KHÍ TƯỢNG
        # =========================================================================
        is_weather_query = any(w in msg_lower for w in [
            "thời tiết", "mưa", "nắng", "nhiệt độ", "hạn", "khí tượng", "el nino", "la nina"
        ])

        if is_weather_query:
            reply = (
                "**Dự báo Khí tượng Nông vụ & Khuyến nghị Mùa vụ:**\n\n"
                "• **Khu vực Tây Nguyên & Nam Bộ:** Ban ngày nắng ráo với nhiệt độ 29°C - 32°C. Chiều tối có khả năng xuất hiện mưa dông cục bộ, độ ẩm đất thuận lợi.\n"
                "• **Khuyến cáo nhà nông:**\n"
                "  - Tranh thủ thời tiết nắng ráo tiến hành tỉa cành, dọn cỏ và kiểm tra sâu bệnh.\n"
                "  - Tránh rải phân đạm trước các cơn mưa dông lớn để không bị rửa trôi bề mặt.\n"
                "  - Cập nhật chi tiết dự báo 7 ngày tại trang **`/weather`**."
            )
            suggestions = [
                "Thời tiết Đắk Lắk 7 ngày tới",
                "Kỹ thuật tưới giữ ẩm mùa khô hạn",
                "Cách phòng chống mưa đá lốc xoáy cho vườn cây",
            ]
            return reply, suggestions

        # =========================================================================
        # ƯU TIÊN 5: GIÁ CẢ & BẢN TIN THỊ TRƯỜNG NÔNG SẢN
        # =========================================================================
        if any(w in msg_lower for w in ["cà phê", "cafe", "robusta", "arabica", "london"]):
            reply = (
                "**Bản tin Thị trường Cà phê & Phân tích Nông vụ:**\n\n"
                "• **Giá thu mua nội địa Tây Nguyên:** Dao động quanh mức **120.500 - 123.000 đ/kg** tại Đắk Lắk, Gia Lai, Đắk Nông và Lâm Đồng.\n"
                "• **Sàn London (ICE Futures Europe):** Hợp đồng Robusta giao dịch quanh ngưỡng **4.850 - 5.000 USD/tấn**, tồn kho đạt chuẩn sàn ICE vẫn ở mức thấp hỗ trợ giá.\n"
                "• **Khuyến nghị:** Theo dõi biểu đồ nến Pro TradingView trực tiếp tại trang **`/coffee`**."
            )
            suggestions = [
                "Biểu đồ nến Robusta London hôm nay",
                "Dự báo xu hướng giá cà phê vụ tới",
                "Kỹ thuật làm bông cà phê mùa khô",
            ]
            return reply, suggestions

        elif any(w in msg_lower for w in ["tiêu", "hồ tiêu", "ipc", "chư sê"]):
            reply = (
                "**Bản tin Thị trường Hồ tiêu & Kỹ thuật Canh tác:**\n\n"
                "• **Giá thu mua nội địa:** Giữ mức cao ổn định từ **152.000 - 156.000 đ/kg** tại Đắk Lắk, Bình Phước, Bà Rịa - Vũng Tàu và Gia Lai.\n"
                "• **Thị trường quốc tế (IPC):** Giá hạt tiêu đen xuất khẩu duy trì ổn định nhờ nhu cầu bền vững từ thị trường Mỹ và EU.\n"
                "• Xem chi tiết tại mục **`/commodities`**."
            )
            suggestions = [
                "Giá tiêu xuất khẩu hôm nay",
                "Cách phòng bệnh chết nhanh hồ tiêu",
                "Dự báo thị trường tiêu vụ tới",
            ]
            return reply, suggestions

        elif any(w in msg_lower for w in ["sầu riêng", "ri6", "monthong"]):
            reply = (
                "**Bản tin Thị trường Sầu riêng:**\n\n"
                "• **Giá thu mua tại vườn:** Sầu riêng Ri6 xô đạt **80.000 - 95.000 đ/kg**, Monthong tuyển chọn đạt **115.000 - 130.000 đ/kg** phục vụ xuất khẩu chính ngạch sang Trung Quốc.\n"
                "• Xem chi tiết bảng giá tại **`/commodities`**."
            )
            suggestions = [
                "Kỹ thuật làm bông sầu riêng nghịch vụ",
                "Cách chặn đọt sầu riêng khi nuôi trái non",
                "Thủ tục cấp mã số vùng trồng sầu riêng",
            ]
            return reply, suggestions

        # Mặc định
        reply = (
            f"**Cố vấn Nông nghiệp & Thị trường NoroFarm xin chào bạn!**\n\n"
            f"Về câu hỏi: *\"{user_msg}\"*, tôi có thể hỗ trợ toàn diện các lĩnh vực:\n\n"
            "1. **Kỹ thuật nông học & BVTV:** Chẩn đoán sâu bệnh hại (nấm hồng, rệp sáp, xì mủ, rỉ sắt), phác đồ thuốc BVTV đặc trị và chế độ bón phân NPK.\n"
            "2. **Bản tin giá cả thị trường:** Giá cà phê (Robusta London), hồ tiêu (IPC), sầu riêng, lúa gạo tại vườn và trên các sàn quốc tế.\n"
            "3. **Chính sách & Xuất khẩu:** Quy định EUDR chống phá rừng, chứng chỉ VietGAP/GlobalGAP, tiêu chuẩn mã số vùng trồng GACC.\n"
            "4. **Khí tượng nông vụ:** Dự báo thời tiết, khuyến cáo lịch tưới tiêu và bón phân đón mưa.\n\n"
            "Bạn muốn tìm hiểu chi tiết hơn về vấn đề nào?"
        )
        suggestions = DEFAULT_SUGGESTIONS
        return reply, suggestions

    async def chat(self, user_msg: str, history: List[ChatMessage] = None) -> ChatResponse:
        """Gửi câu hỏi tới Gemini API với cơ chế tự động thử model khả dụng và fallback thông minh"""
        if not self.api_key or self.api_key.startswith("your-"):
            logger.info("Chưa cấu hình GEMINI_API_KEY hợp lệ, chuyển sang phản hồi chuyên gia nội bộ.")
            reply, suggestions = self._generate_fallback_response(user_msg)
            return ChatResponse(reply=reply, suggestions=suggestions, model="norofarm-expert-engine")

        # Chuẩn bị contents gửi Gemini API
        contents = []
        if history:
            for m in history[-6:]:  # Giữ 6 lượt trao đổi gần nhất
                role = "model" if m.role in ("assistant", "model") else "user"
                contents.append({"role": role, "parts": [{"text": m.content}]})

        contents.append({"role": "user", "parts": [{"text": user_msg}]})

        # Danh sách model khả dụng (ưu tiên gemini-flash-latest)
        model_candidates = [
            self.model,
            "gemini-flash-latest",
            "gemini-3.8-flash",
        ]
        # Loại bỏ trùng lặp giữ nguyên thứ tự
        seen = set()
        models_to_try = [m for m in model_candidates if not (m in seen or seen.add(m))]

        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.api_key}"
            payload = {
                "system_instruction": {
                    "parts": [{"text": NOROFARM_SYSTEM_PROMPT}]
                },
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.7,
                    "topP": 0.95,
                    "maxOutputTokens": 1500,
                }
            }

            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    response = await client.post(url, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                reply_text = parts[0].get("text", "")
                                suggestions = [
                                    "Xem thêm bảng giá liên quan",
                                    "Khuyến nghị kỹ thuật mùa vụ",
                                    "Đặt câu hỏi nông vụ khác",
                                ]
                                return ChatResponse(
                                    reply=reply_text,
                                    suggestions=suggestions,
                                    model=model_name
                                )

                    logger.warning(f"Gemini API model {model_name} trả về status {response.status_code}: {response.text[:200]}")
            except Exception as e:
                logger.error(f"Lỗi khi gọi Gemini API với model {model_name}: {e}")

        # Fallback an toàn nếu toàn bộ model hoặc mạng gặp sự cố
        reply, suggestions = self._generate_fallback_response(user_msg)
        return ChatResponse(reply=reply, suggestions=suggestions, model="norofarm-expert-fallback")

ai_chat_service = AiChatService()
