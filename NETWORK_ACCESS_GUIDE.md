# 🌐 Hướng Dẫn Truy Cập Từ Máy Khác Trong Mạng LAN

## 📋 Vấn Đề
Chỉ máy chạy server mới truy cập được ứng dụng. Máy khác trong cùng WiFi không thể login hoặc tạo account.

## ✅ Giải Pháp

### Bước 1: Lấy Địa Chỉ IP Của Máy Chủ

**Trên Windows:**
```cmd
ipconfig
```
Tìm dòng `IPv4 Address` trong phần `Wireless LAN adapter Wi-Fi`, ví dụ: `192.168.1.100`

**Trên Linux/Mac:**
```bash
ifconfig
# hoặc
ip addr show
```
Tìm địa chỉ IP của interface wifi (ví dụ: `192.168.1.100`)

### Bước 2: Cấu Hình Backend (Máy Chủ)

Backend `.env` đã được cấu hình:
- ✅ `HOST=0.0.0.0` - Bind tất cả network interfaces
- ✅ `CORS_ORIGIN=*` - Allow tất cả origins (development only)

**Khởi động lại backend:**
```bash
cd backend
npm start
```

Bạn sẽ thấy:
```
📡 Server running on: http://0.0.0.0:5000
```

### Bước 3: Kiểm Tra Firewall

**Windows Firewall:**
1. Mở `Windows Defender Firewall`
2. Click `Allow an app or feature through Windows Defender Firewall`
3. Click `Change settings`
4. Tìm `Node.js` hoặc click `Allow another app...`
5. Browse đến `node.exe` (thường ở `C:\Program Files\nodejs\node.exe`)
6. ✅ Check cả `Private` và `Public` networks
7. Click `OK`

**Hoặc tạm tắt Firewall để test:**
```powershell
# Chạy PowerShell với quyền Administrator
netsh advfirewall set allprofiles state off
```
⚠️ **Lưu ý:** Nhớ bật lại sau khi test!

### Bước 4: Truy Cập Từ Máy Khác

**Cách 1: Dùng Frontend Trên Máy Chủ (Khuyến Nghị)**

Từ máy khác, mở browser và truy cập:
```
http://192.168.1.100:3000
```
(Thay `192.168.1.100` bằng IP thực của máy chủ)

Frontend sẽ tự động kết nối đến backend qua network.

**Cách 2: Chạy Frontend Trên Máy Khác**

Nếu muốn mỗi máy chạy frontend riêng:

1. Clone/copy code sang máy khác
2. Tạo file `frontend/.env.local` (không commit file này):
   ```env
   REACT_APP_API_URL=http://192.168.1.100:5000/api
   ```
   (Thay `192.168.1.100` bằng IP máy chủ)

3. Install và start:
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Bước 5: Test Kết Nối

**Từ máy khác, test API:**
```bash
# Test health endpoint
curl http://192.168.1.100:5000/health

# Test API
curl http://192.168.1.100:5000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

**Hoặc mở browser:**
```
http://192.168.1.100:5000/health
```
Nếu thấy response JSON → Backend accessible ✅

## 🔧 Troubleshooting

### Vấn Đề 1: "Cannot connect to server"

**Nguyên nhân:** Firewall block port 5000

**Giải pháp:**
```powershell
# Windows - Allow port 5000
netsh advfirewall firewall add rule name="Node.js Port 5000" dir=in action=allow protocol=TCP localport=5000
```

### Vấn Đề 2: "CORS error"

**Nguyên nhân:** CORS chưa allow origin

**Giải pháp:** Backend `.env` đã set `CORS_ORIGIN=*`

### Vấn Đề 3: Frontend không kết nối được backend

**Nguyên nhân:** Frontend vẫn trỏ đến localhost

**Giải pháp:** Tạo `frontend/.env.local`:
```env
REACT_APP_API_URL=http://YOUR_IP:5000/api
```

### Vấn Đề 4: Database connection errors trên máy khác

**Nguyên nhân:** PostgreSQL chỉ accept localhost connections

**Giải pháp:** Chỉ máy chủ cần connect database. Máy khác chỉ cần connect đến backend API.

## 📱 Truy Cập Từ Điện Thoại

Điện thoại cũng có thể truy cập nếu cùng WiFi:
```
http://192.168.1.100:3000
```

## 🔒 Bảo Mật Cho Production

⚠️ **Chú ý:** Cấu hình hiện tại chỉ dùng cho development!

Khi deploy production:
1. Thay `CORS_ORIGIN=*` bằng specific domains
2. Bật HTTPS
3. Sử dụng environment variables riêng
4. Cấu hình firewall strict hơn

## ✅ Checklist

- [ ] Lấy IP của máy chủ: `ipconfig` hoặc `ifconfig`
- [ ] Backend `.env` có `HOST=0.0.0.0`
- [ ] Backend `.env` có `CORS_ORIGIN=*`
- [ ] Restart backend: `npm start`
- [ ] Allow Node.js qua Windows Firewall
- [ ] Test từ máy khác: `http://YOUR_IP:3000`
- [ ] Nếu cần, tạo `frontend/.env.local` với `REACT_APP_API_URL`

## 🎯 Kết Quả Mong Đợi

Sau khi làm theo hướng dẫn:
- ✅ Máy chủ: `http://localhost:3000` hoặc `http://192.168.1.100:3000`
- ✅ Máy khác: `http://192.168.1.100:3000`
- ✅ Điện thoại: `http://192.168.1.100:3000`
- ✅ Tất cả đều login được và tạo account được

## 💡 Tips

1. **Pin IP tĩnh** cho máy chủ trong router settings để IP không đổi
2. **Sử dụng hostname**: Thay IP bằng hostname (ví dụ: `DESKTOP-ABC123`)
3. **Dùng ngrok** nếu muốn share qua internet (không chỉ LAN)

## 📞 Nếu Vẫn Không Được

Kiểm tra log backend xem có request từ máy khác không:
```
📡 POST /api/auth/login from 192.168.1.105
```

Nếu không thấy request → Firewall vẫn block
Nếu thấy request nhưng lỗi → Check CORS hoặc authentication
