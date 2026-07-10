# Tiêu chuẩn Lập trình (Coding Standard)

## Mục tiêu
Đảm bảo mã nguồn của NoroFarm đạt chất lượng Enterprise, dễ đọc (Readability), dễ bảo trì (Maintainability) và thống nhất dù được viết bởi Human hay AI.

## 1. Tiêu chuẩn Frontend (Next.js / React / TypeScript)
- **TypeScript Strict Mode:** BẮT BUỘC bật `strict: true` trong `tsconfig.json`. Mọi biến số, hàm trả về đều phải có Type cụ thể. Nghiêm cấm sử dụng kiểu `any` (Trừ trường hợp ép buộc của Thư viện thứ 3).
- **Functional Components:** 100% sử dụng Arrow Functions cho Component. Không dùng Class Component.
- **Hooks:** Tách biệt Logic và UI (Custom Hooks). Không nhồi nhét quá nhiều logic (Fetch data, state, tính toán) trực tiếp vào trong UI Component.
- **Tránh Magic Numbers/Strings:** Mọi con số hoặc chuỗi có ý nghĩa đặc biệt phải được khai báo thành Const Variables. (Ví dụ: Thay vì `if (status === 2)`, hãy dùng `if (status === USER_STATUS.ACTIVE)`).

## 2. Tiêu chuẩn Backend (FastAPI / Python)
- **Type Hinting:** BẮT BUỘC khai báo Type Hint cho 100% biến, tham số hàm và kiểu trả về (Return Type) trong Python. (Ví dụ: `def get_user(user_id: int) -> UserResponse:`).
- **Độ dài Hàm (Function Length):** Một hàm không được dài quá 50 dòng. Nếu vượt quá, AI phải chủ động tách thành các hàm helper (Refactor by extracting method).
- **Docstrings:** Sử dụng chuẩn Google Docstring format. Mỗi hàm Public phải có mô tả tóm tắt, khai báo Args và Returns.

## 3. Tiêu chuẩn CSS (Tailwind)
- **Thứ tự Class (Class Sorting):** Phải sắp xếp các class của Tailwind theo thứ tự chuẩn: Layout -> Spacing -> Sizing -> Typography -> Backgrounds -> Borders -> Effects. (Hoặc sử dụng Prettier plugin `prettier-plugin-tailwindcss` để tự sắp xếp).
- **Tránh viết Inline CSS:** Không dùng thẻ `style={{ ... }}` trừ khi bắt buộc phải tính toán thông số động bằng JavaScript.
