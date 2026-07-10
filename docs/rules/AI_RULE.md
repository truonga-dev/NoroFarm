# Bộ Quy tắc Bắt buộc dành cho AI Agent (AI Core Directives)

## Mệnh lệnh Tối cao (Supreme Directive)
Tài liệu này đóng vai trò là **Hiến pháp** của dự án NoroFarm. Bất kỳ AI Agent nào (Claude, GPT, Gemini, v.v.) khi tham gia sinh code (Code Generation) hoặc tái cấu trúc (Refactoring) đều **BẮT BUỘC PHẢI TUÂN THỦ TUYỆT ĐỐI** các quy tắc dưới đây.

## Quyền hạn & Giới hạn (Scope of Authority)
AI **KHÔNG ĐƯỢC PHÉP TỰ Ý THAY ĐỔI** bất kỳ yếu tố cốt lõi nào sau đây nếu chưa được Người dùng (Human Developer) cho phép rõ ràng:

1. **Hệ thống Giao diện & Trải nghiệm (UI/UX):** Không được tự ý đổi Layout, thay đổi màu sắc (Color Tokens), thay đổi font chữ (Typography), hay hiệu ứng (Motion/Animation).
2. **Kiến trúc Dữ liệu (Database & API):** Không được tự ý thêm/sửa/xóa bảng, cột (Columns), hay đổi cấu trúc trả về của API (Response Payload).
3. **Cấu trúc Thư mục (Folder Structure):** Phải tuân thủ kiến trúc đã định nghĩa sẵn. Không tự ý gom nhóm hoặc tạo thư mục mới sai chuẩn.
4. **Môi trường & Thư viện (Dependencies):** Tuyệt đối không tự ý chạy lệnh `npm install`, `pip install`, hay cập nhật phiên bản các gói thư viện.

## Giao thức Xử lý Thiếu Thông tin (Missing Context Protocol)
- **CẤM TỰ SUY DIỄN:** Nếu yêu cầu của người dùng thiếu rõ ràng (Underspecified), AI không được phép "đoán" hoặc "giả định" (Assume) để viết code bừa.
- **BẮT BUỘC DỪNG LẠI (Halt & Ask):** AI phải DỪNG ngay quá trình sinh code, in ra thông báo LỖI THIẾU THÔNG TIN và liệt kê cụ thể các câu hỏi yêu cầu người dùng xác nhận trước khi đi tiếp.

## Nguyên tắc Thực thi Code (Code Generation Principles)
1. **Tuân thủ Hiện trạng (Respect Existing Code):** Khi sửa đổi một file, giữ nguyên các Comments, Docstrings và Style Code của các hàm không liên quan. Không tự ý Format cả file làm hỏng Git History.
2. **Nguyên tắc Nguyên tử (Atomic Changes):** Viết code giải quyết ĐÚNG trọng tâm yêu cầu. Không tự tiện dọn dẹp (Cleanup) hoặc sửa đổi logic ngầm (Under-the-hood) của các file khác.
3. **Báo cáo Trung thực:** Mọi dòng code sinh ra phải được giải thích rõ mục đích (Why) chứ không chỉ mô tả cách thức (How).
