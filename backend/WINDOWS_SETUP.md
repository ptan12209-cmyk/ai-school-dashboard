# 🪟 Windows Setup Guide - PostgreSQL Password Fix

## ❌ Lỗi: password authentication failed for user "postgres"

Lỗi này xảy ra khi password trong file `.env` không khớp với password thực tế của PostgreSQL.

---

## 🔧 GIẢI PHÁP 1: Tìm Password PostgreSQL (Nếu nhớ)

### **Bước 1: Kiểm tra file .env**

Mở file `backend/.env` và kiểm tra:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_dashboard
DB_USER=postgres
DB_PASSWORD=postgres    ← Đây là password hiện tại trong .env
```

### **Bước 2: Nhớ lại password PostgreSQL**

Password PostgreSQL là password bạn đã nhập khi **cài đặt PostgreSQL lần đầu**.

**Thường là:**
- `postgres`
- `admin`
- `12345678`
- Hoặc password khác bạn đã đặt

### **Bước 3: Cập nhật .env với password đúng**

```env
DB_PASSWORD=your_actual_password_here
```

### **Bước 4: Test lại**

```bash
npm run db:test
```

---

## 🔧 GIẢI PHÁP 2: Reset Password PostgreSQL (Nếu quên)

### **Cách 1: Sử dụng pgAdmin**

1. **Mở pgAdmin 4**
   - Start Menu → pgAdmin 4

2. **Kết nối với server**
   - Nếu pgAdmin yêu cầu password → nhập password bạn nhớ
   - Nếu không nhớ → dùng Cách 2 bên dưới

3. **Reset password**
   - Right-click trên `PostgreSQL 15` (hoặc version của bạn)
   - Chọn `Properties`
   - Tab `Connection`
   - Đặt lại password mới

4. **Cập nhật .env**

```env
DB_PASSWORD=new_password_here
```

---

### **Cách 2: Sử dụng Command Line (Khuyến nghị)**

#### **Bước 1: Tìm thư mục PostgreSQL bin**

Mở File Explorer, tìm đường dẫn (thường là một trong các đường dẫn sau):

```
C:\Program Files\PostgreSQL\15\bin
C:\Program Files\PostgreSQL\14\bin
C:\PostgreSQL\bin
```

#### **Bước 2: Sửa file pg_hba.conf (tạm thời trust)**

1. Tìm file `pg_hba.conf`:
   ```
   C:\Program Files\PostgreSQL\15\data\pg_hba.conf
   ```

2. **Backup file gốc** (quan trọng!):
   - Copy `pg_hba.conf` → `pg_hba.conf.backup`

3. **Mở pg_hba.conf bằng Notepad** (Run as Administrator)

4. **Tìm dòng này:**
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

5. **Đổi `scram-sha-256` thành `trust`:**
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            trust
   ```

6. **Lưu file**

#### **Bước 3: Restart PostgreSQL service**

1. **Mở Services** (Win + R → `services.msc`)

2. **Tìm service PostgreSQL**:
   - `postgresql-x64-15` (hoặc version của bạn)

3. **Right-click → Restart**

#### **Bước 4: Reset password**

Mở **Command Prompt** (không cần Administrator):

```bash
# Di chuyển đến thư mục PostgreSQL bin
cd "C:\Program Files\PostgreSQL\15\bin"

# Kết nối PostgreSQL (không cần password vì đã set trust)
psql -U postgres

# Trong psql shell, reset password:
ALTER USER postgres PASSWORD 'new_password_123';

# Thoát
\q
```

#### **Bước 5: Khôi phục pg_hba.conf**

1. Mở lại `pg_hba.conf`

2. **Đổi lại `trust` thành `scram-sha-256`:**
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

3. Lưu file

4. **Restart PostgreSQL service lần nữa**

#### **Bước 6: Cập nhật .env**

```env
DB_PASSWORD=new_password_123
```

#### **Bước 7: Test connection**

```bash
npm run db:test
```

---

## 🔧 GIẢI PHÁP 3: Cài lại PostgreSQL (Nếu các cách trên không được)

### **Gỡ cài đặt PostgreSQL cũ:**

1. Control Panel → Programs and Features
2. Tìm PostgreSQL → Uninstall
3. Xóa thư mục: `C:\Program Files\PostgreSQL`
4. Xóa thư mục: `C:\Users\[YourName]\AppData\Roaming\postgresql`

### **Cài đặt lại:**

1. **Download PostgreSQL**:
   - https://www.postgresql.org/download/windows/
   - Tải **PostgreSQL 15** (khuyến nghị)

2. **Chạy installer**:
   - Next → Next
   - **Đặt password mới** (ghi nhớ password này!)
   - Port: 5432 (mặc định)
   - Next → Install

3. **Sau khi cài xong:**

```bash
# Tạo database
createdb -U postgres school_dashboard

# Nhập password bạn vừa đặt
```

4. **Cập nhật .env:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_dashboard
DB_USER=postgres
DB_PASSWORD=password_you_just_set
```

---

## 🧪 KIỂM TRA KẾT NỐI

### **Test 1: Sử dụng script test**

```bash
cd backend
npm run db:test
```

**Output mong muốn:**
```
🔍 Testing PostgreSQL Connection...

📋 Current Configuration:
   Host:     localhost
   Port:     5432
   Database: school_dashboard
   User:     postgres
   Password: ***123

✅ PostgreSQL connection successful!
✅ Database is ready to use.
```

### **Test 2: Sử dụng psql**

```bash
psql -U postgres -h localhost -p 5432 -d school_dashboard
```

Nếu kết nối thành công, bạn sẽ thấy:
```
school_dashboard=#
```

---

## 📝 TẠO DATABASE (Nếu chưa có)

### **Cách 1: pgAdmin**

1. Mở pgAdmin
2. Right-click `Databases` → Create → Database
3. Name: `school_dashboard`
4. Owner: `postgres`
5. Save

### **Cách 2: Command Line**

```bash
# Option 1: Sử dụng createdb
createdb -U postgres school_dashboard

# Option 2: Sử dụng psql
psql -U postgres
CREATE DATABASE school_dashboard;
\q
```

---

## 🚀 SAU KHI FIX XONG

### **1. Test connection:**
```bash
npm run db:test
```

### **2. Chạy seed data:**
```bash
npm run seed
```

### **3. Start backend:**
```bash
npm start
```

---

## 🆘 VẪN GẶP LỖI?

### **Lỗi: "database does not exist"**

```bash
# Tạo database
createdb -U postgres school_dashboard
```

### **Lỗi: "ECONNREFUSED"**

PostgreSQL chưa chạy:

1. Win + R → `services.msc`
2. Tìm `postgresql-x64-15`
3. Right-click → Start

### **Lỗi: "role postgres does not exist"**

```bash
# Trong psql (kết nối với database template1)
psql -U postgres template1
CREATE USER postgres WITH SUPERUSER PASSWORD 'your_password';
\q
```

### **Lỗi: "permission denied"**

Chạy Command Prompt **as Administrator**

---

## 📞 Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, cung cấp:
1. Version PostgreSQL (chạy: `psql --version`)
2. Nội dung file `.env` (ẩn password)
3. Error message đầy đủ

---

**Good luck! 🍀**
