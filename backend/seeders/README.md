# 🌱 Seed Data - AI School Dashboard

Tạo dữ liệu ảo (demo data) cho hệ thống AI School Dashboard - phục vụ demo, presentation và testing.

---

## 📊 Dữ liệu được tạo

### 👥 **Users & Profiles**
- **1 Admin** - Quản trị hệ thống
- **12 Teachers** - Giáo viên các bộ môn
- **120 Students** - Học sinh từ lớp 10-12

### 🏫 **Classes & Courses**
- **12 Classes** - Lớp 10A1-10A4, 11A1-11A4, 12A1-12A4
- **~100 Courses** - Các môn học (Toán, Lý, Hóa, Sinh, Văn, Anh, Sử, Địa, Tin, GDCD)

### 📚 **Academic Records**
- **~1500+ Grades** - Điểm số các loại (miệng, 15 phút, 1 tiết, giữa kỳ, cuối kỳ)
- **~3000+ Attendance** - Điểm danh 30 ngày gần đây
- **~300 Assignments** - Bài tập, kiểm tra, thi
- **~1500 Questions** - Câu hỏi cho quiz/homework
- **~200+ Submissions** - Bài làm của học sinh đã nộp

### 🔔 **System**
- **Notifications** - Thông báo hệ thống và bài tập

---

## 🚀 Cách sử dụng

### **Bước 1: Đảm bảo PostgreSQL đang chạy**

```bash
# Kiểm tra PostgreSQL
psql -U postgres -h localhost -p 5432 -l

# Nếu chưa chạy, start PostgreSQL
# Docker:
docker start postgres-school

# Ubuntu/Debian:
sudo systemctl start postgresql

# macOS:
brew services start postgresql@15
```

### **Bước 2: Cấu hình .env**

Đảm bảo file `.env` có thông tin database:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_dashboard
DB_USER=postgres
DB_PASSWORD=postgres
```

### **Bước 3: Chạy seed script**

```bash
cd backend

# Cách 1: Sử dụng npm script
npm run seed

# Cách 2: Chạy trực tiếp
node seeders/seed.js
```

### **Bước 4: Kiểm tra kết quả**

Script sẽ hiển thị output như sau:

```
🌱 Starting seed process...
🗄️  Syncing database...
✅ Database synced

👤 Creating admin user...
✅ Admin created: admin@school.edu.vn / Admin@123

👨‍🏫 Creating teachers...
✅ Created 12 teachers (Password: Teacher@123)

👨‍🎓 Creating students...
✅ Created 120 students (Password: Student@123)

...

╔════════════════════════════════════════╗
║   🎉 SEED DATA CREATED SUCCESSFULLY!   ║
╚════════════════════════════════════════╝
```

---

## 🔑 Tài khoản đăng nhập

### **Admin**
```
Email: admin@school.edu.vn
Password: Admin@123
```

### **Teacher (Giáo viên)**
```
Email: (xem trong output sau khi chạy seed)
Password: Teacher@123

Ví dụ: nguyenanh1@school.edu.vn
```

### **Student (Học sinh)**
```
Email: (xem trong output sau khi chạy seed)
Password: Student@123

Ví dụ: tranminh1@student.edu.vn
```

---

## 📋 Dữ liệu chi tiết

### **Classes (Lớp học)**
- Lớp 10: 10A1, 10A2, 10A3, 10A4
- Lớp 11: 11A1, 11A2, 11A3, 11A4
- Lớp 12: 12A1, 12A2, 12A3, 12A4

Mỗi lớp có:
- ~10 học sinh
- 1 giáo viên chủ nhiệm
- 8-10 môn học

### **Courses (Môn học)**
1. **Toán học** (MATH) - 4 tín chỉ
2. **Vật lý** (PHYS) - 3 tín chỉ
3. **Hóa học** (CHEM) - 3 tín chỉ
4. **Sinh học** (BIO) - 2 tín chỉ
5. **Ngữ văn** (LIT) - 3 tín chỉ
6. **Tiếng Anh** (ENG) - 3 tín chỉ
7. **Lịch sử** (HIST) - 2 tín chỉ
8. **Địa lý** (GEO) - 2 tín chỉ
9. **Tin học** (IT) - 2 tín chỉ
10. **Giáo dục công dân** (CIVIC) - 1 tín chỉ

### **Grades (Điểm số)**
Mỗi học sinh có 3-5 điểm cho mỗi môn:
- **Điểm miệng** (hệ số 1)
- **Kiểm tra 15 phút** (hệ số 1)
- **Kiểm tra 1 tiết** (hệ số 2)
- **Thi giữa kỳ** (hệ số 2)
- **Thi cuối kỳ** (hệ số 3)

Điểm số: **6.5 - 9.5** (realistic distribution)

### **Attendance (Điểm danh)**
30 ngày học gần đây (bỏ qua cuối tuần):
- **90%** - Có mặt (present)
- **5%** - Vắng có phép (absent_excused)
- **5%** - Vắng không phép (absent_unexcused)

### **Assignments (Bài tập)**
Mỗi môn có 3-5 bài tập:
- **Homework** - Bài tập về nhà (10 điểm)
- **Quiz** - Kiểm tra nhanh (50 điểm, 15-45 phút)
- **Exam** - Thi (100 điểm, 60-120 phút)
- **Project** - Đồ án (200 điểm)

### **Questions (Câu hỏi)**
Quiz và Homework có 5-10 câu hỏi:
- **Multiple Choice** - Trắc nghiệm 4 đáp án
- **True/False** - Đúng/Sai
- **Short Answer** - Tự luận ngắn

### **Submissions (Bài nộp)**
- **80%** học sinh nộp bài
- Điểm số: **50-90%** tổng điểm
- Một số bài nộp trễ (có phạt điểm)

---

## ⚠️ Lưu ý quan trọng

### **🔴 CẢNH BÁO: Seed sẽ XÓA TOÀN BỘ dữ liệu cũ!**

Script seed sử dụng `sequelize.sync({ force: true })` - điều này sẽ:
1. **DROP** tất cả các bảng
2. **Tạo lại** các bảng mới
3. **Xóa** toàn bộ dữ liệu cũ

### **Để tránh mất dữ liệu:**

```bash
# 1. Backup database trước khi seed
pg_dump -U postgres school_dashboard > backup_$(date +%Y%m%d).sql

# 2. Hoặc dùng database riêng cho demo
# Tạo database mới:
createdb -U postgres school_dashboard_demo

# Cập nhật .env:
DB_NAME=school_dashboard_demo

# Sau đó chạy seed
npm run seed
```

---

## 🔧 Tùy chỉnh dữ liệu

### **Thay đổi số lượng dữ liệu**

Mở file `seeders/seed.js` và chỉnh sửa:

```javascript
// Số lượng giáo viên
for (let i = 1; i <= 12; i++) { // Thay 12 thành số khác

// Số lượng học sinh
for (let i = 1; i <= 120; i++) { // Thay 120 thành số khác

// Số lượng bài tập mỗi môn
const numAssignments = randomInt(3, 5); // Thay đổi range
```

### **Thêm môn học**

```javascript
const SUBJECTS = [
  { name: 'Toán học', code: 'MATH', credits: 4 },
  { name: 'Thể dục', code: 'PE', credits: 1 }, // Thêm môn mới
  // ...
];
```

---

## 🐛 Troubleshooting

### **Lỗi: connect ECONNREFUSED 127.0.0.1:5432**
```bash
# PostgreSQL chưa chạy
# Giải pháp: Start PostgreSQL (xem Bước 1)
```

### **Lỗi: database "school_dashboard" does not exist**
```bash
# Tạo database
createdb -U postgres school_dashboard

# Hoặc trong psql:
psql -U postgres
CREATE DATABASE school_dashboard;
\q
```

### **Lỗi: password authentication failed**
```bash
# Kiểm tra password trong .env
# Hoặc reset password:
sudo -u postgres psql
ALTER USER postgres PASSWORD 'postgres';
\q
```

### **Script chạy quá lâu**
```bash
# Giảm số lượng dữ liệu:
# - Ít học sinh hơn (120 → 50)
# - Ít ngày điểm danh hơn (30 → 10)
# - Ít bài tập hơn (3-5 → 2-3)
```

---

## 📈 Thống kê Performance

Trên máy tính trung bình:
- **Thời gian chạy**: ~30-60 giây
- **Số lượng queries**: ~5000+
- **Database size**: ~10-20 MB

---

## 🎯 Use Cases

### **1. Demo/Presentation**
```bash
npm run seed
# → Có ngay dữ liệu đầy đủ để trình bày
```

### **2. Development Testing**
```bash
npm run seed
# → Test các tính năng với dữ liệu realistic
```

### **3. UI/UX Testing**
```bash
npm run seed
# → Kiểm tra giao diện với nhiều dữ liệu
```

### **4. Performance Testing**
```bash
# Tăng số lượng dữ liệu lên 10x
# Test hiệu năng với dataset lớn
```

---

## 📚 Tài liệu liên quan

- [Database Schema](../docs/DATABASE.md)
- [API Documentation](../docs/API.md)
- [Setup Guide](../README.md)

---

## 👨‍💻 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra PostgreSQL đang chạy
2. Kiểm tra file `.env` đúng cấu hình
3. Kiểm tra logs khi chạy seed
4. Thử chạy lại với database mới

---

**Good luck với presentation! 🚀**
