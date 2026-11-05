# Room Booking frontend

Giao diện ReactJS dùng Create React App, tích hợp backend Spring Boot bằng API thật. Dự án không dùng Vite và không có dữ liệu nghiệp vụ mẫu.

## Yêu cầu

- Node.js tương thích react-scripts 5 (Node 20 trở lên được khuyến nghị).
- Backend Room Booking chạy tại http://localhost:8086.
- Trình duyệt truy cập được GET http://localhost:8086/v3/api-docs.

## Cấu hình

Sao chép .env.example thành .env và đặt URL gốc của API:

    REACT_APP_API_BASE_URL=http://localhost:8086

Giá trị là origin backend; các module API tự thêm path /api/.... Không thêm /api vào biến này. Khi chạy CRA ở development, URL backend local `http://localhost:8086` được gửi qua proxy tích hợp theo origin frontend hiện tại, kể cả khi CRA chuyển sang cổng 3001.

Proxy development tránh phụ thuộc vào danh sách CORS của backend khi dùng backend local. Nếu trỏ frontend development tới backend từ xa, backend đó vẫn cần cho phép chính xác origin frontend.

## Cài đặt và chạy

    npm ci
    npm start

Create React App thường mở frontend tại http://localhost:3000; nếu cổng bận, cổng thay thế như 3001 vẫn dùng được vì API local đi qua proxy.

## Kiểm tra

    npm test -- --watchAll=false --runInBand
    npm run build

## API và bảo mật phiên

- Chi tiết 70 operation trên 54 path được ghi ở docs/openapi-inventory.md, lấy trực tiếp từ OpenAPI đang chạy và đối chiếu Spring Security.
- Access/refresh token được giữ trong sessionStorage theo phiên tab, không ghi vào log hoặc lưu mật khẩu. Các request bảo vệ gửi Bearer token; interceptor chỉ refresh một lần đồng thời và retry request ban đầu tối đa một lần.
- Backend trả token cho JavaScript client, vì vậy ứng dụng không thể đặt token trong cookie HttpOnly nếu không đổi contract backend. sessionStorage giới hạn thời gian lưu nhưng vẫn có thể bị đọc nếu xảy ra XSS; cần CSP và sanitization ở cấu hình triển khai để giảm rủi ro.
- Nếu backend hoặc CORS không sẵn sàng, UI hiển thị lỗi và nút thử lại; không chuyển sang dữ liệu giả.

## Quyền backend

Frontend xác minh vai trò ROLE_ADMIN từ GET /api/auth/me để điều hướng và bảo vệ UX. Spring Security/service của backend vẫn quyết định quyền truy cập cuối cùng.
