# 🎓 AI School Dashboard - Hướng Dẫn Cài Đặt

## 📋 Mục Lục
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Xử lý lỗi](#xử-lý-lỗi)

## 🖥️ Yêu Cầu Hệ Thống

Đảm bảo máy tính của bạn đã cài đặt:

- **Node.js** phiên bản 14.x trở lên ([Tải về](https://nodejs.org/))
- **PostgreSQL** phiên bản 12.x trở lên ([Tải về](https://www.postgresql.org/download/))
- **Git** ([Tải về](https://git-scm.com/))

### Kiểm tra phiên bản đã cài:
```bash
node --version    # Nên >= v14.0.0
npm --version     # Nên >= 6.0.0
psql --version    # Nên >= 12.0
git --version
```

## 📥 Bước 1: Tải Dự Án Về Máy

```bash
# Clone repository
git clone https://github.com/ptan12209-cmyk/ai-school-dashboard.git

# Vào thư mục dự án
cd ai-school-dashboard

# Checkout nhánh đã fix
git checkout claude/code-review-project-011CUKpGubkky4Mj445A72av
```

## 🗄️ Bước 2: Cài Đặt PostgreSQL Database

### Windows:
1. Mở **pgAdmin 4** hoặc **SQL Shell (psql)**
2. Kết nối với server PostgreSQL (mật khẩu đã đặt khi cài PostgreSQL)
3. Chạy các lệnh SQL sau:

```sql
-- Tạo database
CREATE DATABASE school_dashboard;

-- Tạo user cho dự án (tùy chọn)
CREATE USER school_admin WITH PASSWORD 'matkhaucuaban123';
GRANT ALL PRIVILEGES ON DATABASE school_dashboard TO school_admin;
```

### macOS/Linux:
```bash
# Khởi động PostgreSQL (nếu chưa chạy)
sudo service postgresql start

# Truy cập PostgreSQL
sudo -u postgres psql

# Trong psql console, chạy:
CREATE DATABASE school_dashboard;
CREATE USER school_admin WITH PASSWORD 'matkhaucuaban123';
GRANT ALL PRIVILEGES ON DATABASE school_dashboard TO school_admin;

# Thoát psql
\q
```

## ⚙️ Bước 3: Cài Đặt Backend

```bash
# Từ thư mục gốc, vào thư mục backend
cd backend

# Cài đặt các dependencies
npm install
```

### Cấu hình file .env cho Backend:

```bash
# Copy file mẫu
cp .env.example .env

# Mở file .env bằng text editor và chỉnh sửa
```

**Nội dung file `backend/.env`:**
```env
# ===== MÔI TRƯỜNG =====
NODE_ENV=development
PORT=5000
HOST=localhost

# ===== DATABASE POSTGRESQL =====
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_dashboard
DB_USER=postgres
DB_PASSWORD=postgres    # ⚠️ Thay bằng password PostgreSQL của bạn!

# ===== BẢO MẬT =====
# Tạo JWT_SECRET bằng lệnh: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=thay_bang_chuoi_ngau_nhien_dai_toi_thieu_32_ky_tu
JWT_EXPIRATION=24h

SESSION_SECRET=session_secret_ngau_nhien

# ===== CORS (Frontend URL) =====
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# ===== AI/ML (TÙY CHỌN - Để trống nếu không dùng) =====
OPENAI_API_KEY=
AI_SERVICE_URL=http://localhost:8000
```

### Tạo JWT Secret an toàn:
```bash
# Chạy lệnh này để tạo secret ngẫu nhiên
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy kết quả và paste vào JWT_SECRET trong file .env
```

### Test kết nối Database:
```bash
# Chạy script test
node test-db-connection.js
```

Nếu thành công bạn sẽ thấy:
```
✅ Kết nối database thành công!
✅ Database models đã được đồng bộ!
🎉 Mọi thứ hoạt động tốt!
```

## ⚙️ Bước 4: Cài Đặt Frontend

```bash
# Từ thư mục gốc, vào thư mục frontend
cd ../frontend

# Cài đặt dependencies
npm install
```

### Cấu hình file .env cho Frontend:

```bash
# Copy file mẫu
cp .env.example .env
```

**Nội dung file `frontend/.env`:**
```env
# URL của Backend API
REACT_APP_API_URL=http://localhost:5000/api

# Cấu hình ứng dụng
REACT_APP_ENV=development
REACT_APP_ENABLE_AI_FEATURES=true
```

## 🚀 Bước 5: Chạy Ứng Dụng

### Cách 1: Chạy riêng biệt (Khuyến nghị cho lần đầu)

**Mở Terminal/CMD thứ nhất - Chạy Backend:**
```bash
cd backend
npm run dev
```

**Kết quả mong đợi:**
```
🔌 Connecting to database...
✅ Database connection established successfully
✅ Database models synchronized
========================================
🎓 AI SCHOOL DASHBOARD API SERVER
========================================
📡 Server running on: http://localhost:5000
🌍 Environment: development
⏰ Started at: ...
========================================
```

**Mở Terminal/CMD thứ hai - Chạy Frontend:**
```bash
cd frontend
npm start
```

Trình duyệt sẽ tự động mở tại: **http://localhost:3000**

### Cách 2: Chạy đồng thời (Nâng cao)

```bash
# Cài đặt concurrently global (chỉ làm 1 lần)
npm install -g concurrently

# Từ thư mục gốc, chạy cả 2
concurrently "cd backend && npm run dev" "cd frontend && npm start"
```

## 🔐 Bước 6: Tạo Tài Khoản Admin

Sau khi chạy thành công, bạn cần tạo tài khoản admin đầu tiên:

### Sử dụng API (Postman, Thunder Client, hoặc curl):

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "Admin123!@#",
    "firstName": "Quản Trị",
    "lastName": "Viên",
    "role": "admin"
  }'
```

**Sau đó đăng nhập với:**
- Email: `admin@school.com`
- Password: `Admin123!@#`

## 🎯 Truy Cập Ứng Dụng

| Thành phần | URL | Mô tả |
|------------|-----|-------|
| Frontend | http://localhost:3000 | Giao diện người dùng |
| Backend API | http://localhost:5000/api | REST API endpoint |
| Health Check | http://localhost:5000/health | Kiểm tra server |

## 🔧 Các Lệnh Thường Dùng

### Backend:
```bash
cd backend

npm run dev        # Chạy development (auto-reload)
npm start          # Chạy production
npm test           # Chạy tests
npm run lint       # Kiểm tra code
```

### Frontend:
```bash
cd frontend

npm start          # Chạy development server
npm run build      # Build cho production
npm test           # Chạy tests
npm run lint       # Kiểm tra code
```

## ❗ Xử Lý Lỗi Thường Gặp

### 🔴 Lỗi: "Cannot connect to database"

**Nguyên nhân:** PostgreSQL chưa chạy hoặc cấu hình sai

**Giải pháp:**
```bash
# 1. Kiểm tra PostgreSQL có đang chạy không
# Windows: Mở Services → tìm "PostgreSQL" → Start
# macOS/Linux:
sudo service postgresql status
sudo service postgresql start   # Nếu chưa chạy

# 2. Kiểm tra lại thông tin trong backend/.env
# - DB_HOST=localhost
# - DB_PORT=5432
# - DB_NAME=school_dashboard
# - DB_USER=postgres
# - DB_PASSWORD=<mật khẩu PostgreSQL của bạn>

# 3. Test kết nối
cd backend
node test-db-connection.js
```

### 🔴 Lỗi: "Port 5000 already in use"

**Nguyên nhân:** Cổng 5000 đang bị chiếm bởi ứng dụng khác

**Giải pháp:**
```bash
# Cách 1: Tìm và dừng process đang dùng port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_number> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>

# Cách 2: Đổi port trong backend/.env
PORT=5001
```

### 🔴 Lỗi: "Module not found" hoặc "Cannot find module"

**Giải pháp:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install

# Hoặc trên Windows
rmdir /s /q node_modules
del package-lock.json
npm install
```

### 🔴 Lỗi: "CORS error" khi frontend gọi API

**Kiểm tra:**
1. Backend đang chạy tại `http://localhost:5000`
2. File `backend/.env` có `CORS_ORIGIN=http://localhost:3000`
3. Restart lại backend sau khi sửa .env

### 🔴 Lỗi: "Invalid credentials" khi đăng nhập

**Giải pháp:**
1. Kiểm tra bạn đã tạo tài khoản admin chưa (xem Bước 6)
2. Kiểm tra email và password nhập đúng
3. Xem logs ở terminal backend để biết chi tiết lỗi

### 🔴 Lỗi: "JWT_SECRET is not defined"

**Giải pháp:**
```bash
# Tạo JWT_SECRET mới
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy kết quả vào backend/.env
JWT_SECRET=<kết_quả_vừa_copy>
```

## 📊 Cấu Trúc Dự Án

```
ai-school-dashboard/
├── backend/                 # Backend (Node.js + Express + PostgreSQL)
│   ├── config/             # Cấu hình (database, auth, AI)
│   ├── controllers/        # Controllers (xử lý business logic)
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── middleware/         # Middleware (auth, validation)
│   ├── utils/              # Utility functions
│   ├── .env                # Environment variables (TỰ TẠO)
│   ├── .env.example        # Template cho .env
│   └── server.js           # Entry point
│
├── frontend/               # Frontend (React + Redux + Ant Design)
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store & slices
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── App.js          # Main App component
│   ├── .env                # Environment variables (TỰ TẠO)
│   └── .env.example        # Template cho .env
│
└── HUONG_DAN_CAI_DAT.md   # File này
```

## 🎓 Tính Năng Chính

- ✅ Quản lý học sinh (Students)
- ✅ Quản lý giáo viên (Teachers)
- ✅ Quản lý lớp học (Classes)
- ✅ Quản lý môn học (Courses)
- ✅ Điểm danh (Attendance)
- ✅ Quản lý điểm số (Grades)
- ✅ Dashboard thống kê
- ✅ Phân quyền (Admin, Teacher, Student, Parent)
- ✅ Xác thực JWT
- ✅ Tích hợp AI (OpenAI - tùy chọn)

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Đọc lại phần **Xử Lý Lỗi Thường Gặp**
2. Kiểm tra logs trong terminal/console
3. Đảm bảo đã làm đúng tất cả các bước
4. Kiểm tra phiên bản Node.js, npm, PostgreSQL

## 🚀 Tiếp Theo - Deploy Lên Production

Sau khi chạy thành công ở local, xem file `backend/.env.example` và `frontend/.env.example` để biết cách cấu hình cho production.

**Lưu ý khi deploy:**
- Đổi `NODE_ENV=production`
- Sử dụng database PostgreSQL production
- Tạo JWT_SECRET mạnh
- Cấu hình CORS cho domain thật
- Build frontend: `npm run build`
- Sử dụng process manager (PM2, Docker)

---

**Chúc bạn thành công! 🎉**
