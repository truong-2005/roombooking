# 🏢 Room Booking Management System (Hệ Thống Đặt Phòng Họp)

Hệ thống quản lý và đặt phòng họp trực tuyến full-stack được xây dựng với **Spring Boot (Java 21)** cho Backend và **ReactJS** cho Frontend, sử dụng cơ sở dữ liệu **MySQL** hỗ trợ chạy trên các môi trường máy chủ cục bộ phổ biến: **XAMPP**, **Laragon**, hoặc **WampServer**.

---

## 📑 Mục lục
- [1. Giới thiệu & Tính năng](#1-giới-thiệu--tính-năng)
- [2. Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
- [3. Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
- [4. Yêu cầu cài đặt (Prerequisites)](#4-yêu-cầu-cài-đặt-prerequisites)
- [5. Hướng dẫn thiết lập MySQL (XAMPP / Laragon / WampServer)](#5-hướng-dẫn-thiết-lập-mysql-xampp--laragon--wampserver)
  - [Cách 1: Sử dụng XAMPP](#cách-1-sử-dụng-xampp)
  - [Cách 2: Sử dụng Laragon (Khuyên dùng)](#cách-2-sử-dụng-laragon-khuyên-dùng)
  - [Cách 3: Sử dụng WampServer](#cách-3-sử-dụng-wampserver)
  - [Tạo cơ sở dữ liệu trên phpMyAdmin](#tạo-cơ-sở-dữ-liệu-trên-phpmyadmin)
- [6. Cài đặt & Khởi chạy Backend (Spring Boot)](#6-cài-đặt--khởi-chạy-backend-spring-boot)
- [7. Cài đặt & Khởi chạy Frontend (ReactJS)](#7-cài-đặt--khởi-chạy-frontend-reactjs)
- [8. Khởi tạo tài khoản Quản trị viên (Admin)](#8-khởi-tạo-tài-khoản-quản-trị-viên-admin)
- [9. Tài liệu API (Swagger UI)](#9-tài-liệu-api-swagger-ui)
- [10. Xử lý sự cố thường gặp (Troubleshooting)](#10-xử-lý-sự-cố-thường-gặp-troubleshooting)

---

## 1. Giới thiệu & Tính năng

Hệ thống hỗ trợ 2 phân hệ người dùng chính:

* **Phân hệ Client (Người dùng thông thường):**
  - Xem danh sách và tìm kiếm phòng theo tiêu chí, phòng còn trống theo thời gian thực.
  - Đặt phòng họp, chọn khung giờ, đính kèm tài liệu cuộc họp.
  - Theo dõi lịch tuần cá nhân và lịch tuần toàn bộ phòng.
  - Quản lý danh sách đặt phòng cá nhân (chỉnh sửa, hủy lịch, đổi lịch).
  - Nhận thông báo về trạng thái duyệt lịch (Chấp thuận / Từ chối).
  - Quản lý hồ sơ cá nhân, đổi mật khẩu, quên mật khẩu qua email token.

* **Phân hệ Admin (Quản trị viên):**
  - Bảng điều khiển thống kê (Dashboard): Số lượt đặt, tỷ lệ phòng sử dụng, thống kê theo tuần/tháng.
  - Duyệt hoặc từ chối các yêu cầu đặt phòng (phát hiện xung đột lịch tự động).
  - Quản lý danh mục phòng họp (thêm, sửa, đóng cửa bảo trì, hình ảnh phòng).
  - Quản lý người dùng và phân quyền (Role & Permission).
  - Quản lý lịch tuần tổng thể.

---

## 2. Công nghệ sử dụng

| Thành phần | Công nghệ / Thư viện |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot, Spring Security (JWT), Spring Data JPA, Hibernate, Lombok |
| **Frontend** | React 19, React Router v7, Tailwind CSS, Axios, Create React App |
| **Database** | MySQL 8.x / MariaDB |
| **Môi trường DB** | XAMPP / Laragon / WampServer (phpMyAdmin) |
| **Tài liệu API** | OpenAPI 3.0 / Swagger UI |

---

## 3. Cấu trúc thư mục

```text
roombooking/
├── room-booking-system/     # Backend (Spring Boot)
│   ├── src/                 # Source code Java & Resources
│   ├── pom.xml              # Maven dependencies
│   └── mvnw.cmd / mvnw      # Maven wrapper
│
├── roombooking_fontend/     # Frontend (ReactJS)
│   ├── src/                 # Components, Pages, Contexts, Hooks, APIs
│   ├── public/              # Static assets, index.html
│   ├── package.json         # Node dependencies & scripts
│   └── .env.example         # Biến môi trường mẫu
│
├── .gitignore               # Cấu hình bỏ qua file rác / node_modules
└── README.md                # Tài liệu hướng dẫn dự án
```

---

## 4. Yêu cầu cài đặt (Prerequisites)

Trước khi bắt đầu, máy tính của bạn cần cài đặt:
1. **JDK (Java Development Kit)**: Phiên bản **21** (hoặc tối thiểu Java 17). Kiểm tra:
   ```bash
   java -version
   ```
2. **Node.js & npm**: Node.js **18.x** hoặc **20.x+**. Kiểm tra:
   ```bash
   node -v
   npm -v
   ```
3. **Cài đặt 1 trong 3 phần mềm máy chủ cục bộ (Local Server)**:
   - [XAMPP](https://www.apachefriends.org/download.html)
   - [Laragon](https://laragon.org/download/) *(Khuyến khích vì nhẹ và khởi động nhanh)*
   - [WampServer](https://www.wampserver.com/)

---

## 5. Hướng dẫn thiết lập MySQL (XAMPP / Laragon / WampServer)

Backend Spring Boot được cấu hình mặc định kết nối MySQL tại cổng `3306`, tài khoản `root`, mật khẩu để trống `""`.

### Cách 1: Sử dụng XAMPP
1. Mở **XAMPP Control Panel**.
2. Tại dòng **MySQL**, nhấn nút **Start**. (Đảm bảo cổng hiển thị là `3306`).
3. Nhấn nút **Admin** bên cạnh MySQL để mở trang quản lý **phpMyAdmin** trên trình duyệt (hoặc truy cập `http://localhost/phpmyadmin`).

### Cách 2: Sử dụng Laragon (Khuyên dùng)
1. Mở **Laragon**.
2. Nhấn nút **Start All** (hoặc chuột phải chọn `MySQL` > `Start MySQL`).
3. Nhấn nút **Database** (hoặc truy cập `http://localhost/phpmyadmin` nếu đã cài gói phpMyAdmin cho Laragon, hoặc dùng công cụ HeidiSQL có sẵn trong Laragon).

### Cách 3: Sử dụng WampServer
1. Khởi động ứng dụng **WampServer**.
2. Chờ biểu tượng WampServer ở khay hệ thống chuyển sang **màu xanh lá cây (Green)**.
3. Chuột trái vào biểu tượng WampServer > chọn **phpMyAdmin** (hoặc truy cập `http://localhost/phpmyadmin`).
> *Lưu ý với WampServer*: Tài khoản mặc định là `root`, mật khẩu để trống. Đảm bảo chọn Server Choice là `MySQL` (mặc định port 3306).

---

### Tạo cơ sở dữ liệu trên phpMyAdmin
1. Mở trình duyệt và truy cập: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Chọn tab **Databases (Cơ sở dữ liệu)**.
3. Nhập tên cơ sở dữ liệu: `room_booking_db`
4. Bảng mã (Collation): chọn `utf8mb4_unicode_ci` hoặc `utf8mb4_general_ci`.
5. Nhấn **Create (Tạo)**.

> 💡 **Mẹo:** Backend đã được tích hợp cờ `createDatabaseIfNotExist=true` và `spring.jpa.hibernate.ddl-auto=update`. Do đó, chỉ cần dịch vụ MySQL đang chạy, khi Backend khởi động sẽ **tự động tạo database và toàn bộ các bảng**, bạn không cần phải chạy file SQL thủ công!

---

## 6. Cài đặt & Khởi chạy Backend (Spring Boot)

### Bước 1: Kiểm tra cấu hình kết nối
File cấu hình nằm tại: `room-booking-system/src/main/resources/application.properties`
Mặc định:
```properties
server.port=8086
spring.datasource.url=jdbc:mysql://localhost:3306/room_booking_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=
```
*(Nếu MySQL của bạn có mật khẩu, hãy điền vào `spring.datasource.password=mat_khau_cua_ban`).*

### Bước 2: Chạy Backend
Mở Terminal / PowerShell tại thư mục gốc của dự án:
```powershell
# Di chuyển vào thư mục backend
cd room-booking-system

# Chạy backend qua Maven Wrapper trên Windows:
.\mvnw.cmd spring-boot:run

# Hoặc nếu trên Linux / macOS:
./mvnw spring-boot:run
```

Khi Terminal hiển thị dòng:
```text
Started RoomBookingSystemApplication in ... seconds
```
Backend đã khởi động thành công tại: **`http://localhost:8086`**

---

## 7. Cài đặt & Khởi chạy Frontend (ReactJS)

Mở một cửa sổ Terminal / PowerShell **thứ hai**:

```powershell
# Di chuyển vào thư mục frontend
cd roombooking_fontend

# Tạo file cấu hình môi trường .env từ mẫu .env.example (nếu chưa có)
# Trên Windows PowerShell:
Copy-Item .env.example .env

# Cài đặt các gói phụ thuộc (dependencies)
npm install

# Khởi chạy giao diện React
npm start
```

Giao diện người dùng sẽ tự động mở tại trình duyệt: **`http://localhost:3000`**

---

## 8. Khởi tạo tài khoản Quản trị viên (Admin)

Khi hệ thống vừa mới khởi tạo và chưa có bất kỳ tài khoản nào:

1. Truy cập vào trang khởi tạo Admin đầu tiên:
   👉 **`http://localhost:3000/admin/register`**
2. Nhập thông tin: Họ tên, Email, Mật khẩu, Số điện thoại để tạo **Super Admin**.
3. Sau khi tạo thành công, bạn có thể đăng nhập vào trang quản trị tại:
   👉 **`http://localhost:3000/admin/login`**
4. Để tạo tài khoản cho người dùng thông thường, người dùng có thể tự đăng ký tại:
   👉 **`http://localhost:3000/register`** và đăng nhập tại **`http://localhost:3000/login`**.

---

## 9. Tài liệu API (Swagger UI)

Hệ thống tích hợp sẵn Swagger UI giúp kiểm tra và gọi thử toàn bộ REST API:
* **Swagger UI:** [http://localhost:8086/swagger-ui.html](http://localhost:8086/swagger-ui.html)
* **OpenAPI JSON Spec:** [http://localhost:8086/v3/api-docs](http://localhost:8086/v3/api-docs)

---

## 10. Xử lý sự cố thường gặp (Troubleshooting)

### 1. MySQL trong XAMPP / Laragon không Start được (Lỗi Port 3306)
- **Nguyên nhân:** Máy tính của bạn đã có một dịch vụ MySQL chạy ngầm từ trước (như MySQL Installer của Oracle).
- **Khắc phục:** Mở `services.msc` trên Windows, tìm dịch vụ tên `MySQL` hoặc `MySQL80`, bấm chuột phải chọn **Stop**, sau đó quay lại XAMPP/Laragon và nhấn **Start**.

### 2. Lỗi `Access denied for user 'root'@'localhost'`
- **Nguyên nhân:** MySQL của bạn đã được đặt mật khẩu chứ không phải để trống.
- **Khắc phục:** Mở file `room-booking-system/src/main/resources/application.properties`, tìm dòng `spring.datasource.password=` và điền mật khẩu MySQL của bạn vào.

### 3. Cổng 8086 hoặc 3000 bị chiếm dụng
- Nếu cổng `8086` bị ứng dụng khác chiếm: Đổi `server.port=8087` trong `application.properties` và sửa lại `REACT_APP_API_BASE_URL=http://localhost:8087` trong file `.env` của frontend.
- Nếu cổng `3000` bị chiếm: React sẽ tự động hỏi `Would you like to run the app on another port instead?`, hãy gõ `Y` để chuyển sang cổng `3001`.

### 4. Lỗi khi chạy `npm install`
- Chạy với cờ bỏ qua xung đột phiên bản:
  ```bash
  npm install --legacy-peer-deps
  ```

---

## 👨‍💻 Thông tin tác giả
- **GitHub:** [truong-2005](https://github.com/truong-2005)
- **Dự án:** [roombooking](https://github.com/truong-2005/roombooking.git)
