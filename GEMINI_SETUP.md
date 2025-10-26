# 🤖 Hướng Dẫn Setup Google Gemini API

## 📋 Tổng Quan

Dự án đã được chuyển từ OpenAI sang **Google Gemini** vì:
- ✅ **MIỄN PHÍ** cho personal use
- ✅ 60 requests/phút, 1500 requests/ngày
- ✅ Chất lượng tương đương GPT-4
- ✅ API đơn giản, dễ sử dụng
- ✅ Không cần thẻ tín dụng

---

## 🔑 Cách Lấy Gemini API Key (Miễn Phí)

### Bước 1: Truy Cập Google AI Studio

Mở trình duyệt và vào: **https://makersuite.google.com/app/apikey**

Hoặc: **https://aistudio.google.com/app/apikey**

### Bước 2: Đăng Nhập Google Account

- Dùng Gmail của bạn để đăng nhập
- Chấp nhận Terms of Service

### Bước 3: Tạo API Key

1. Click nút **"Create API Key"**
2. Chọn **"Create API key in new project"** hoặc chọn project có sẵn
3. API key sẽ được tạo ngay lập tức

**Ví dụ API key**: `AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz`

### Bước 4: Copy API Key

- Click icon **Copy** để sao chép
- Lưu lại ở nơi an toàn

---

## ⚙️ Cấu Hình Backend

### Cách 1: Thêm Vào File `.env`

Mở file `backend/.env` và thêm dòng sau:

```env
# Google Gemini AI Configuration
GEMINI_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz
GEMINI_MODEL=gemini-pro
GEMINI_MAX_TOKENS=2048
```

**Thay thế** `AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz` bằng API key thật của bạn!

### Cách 2: Set Environment Variable (Windows)

```cmd
set GEMINI_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz
```

### Cách 3: Set Environment Variable (Linux/Mac)

```bash
export GEMINI_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz
```

---

## 🚀 Khởi Động Ứng Dụng

### 1. Restart Backend

```cmd
cd backend
npm start
```

Bạn sẽ thấy log:
```
📡 Server running on: http://0.0.0.0:5000
✅ AI Features enabled with Gemini
```

### 2. Restart Frontend

```cmd
cd frontend
npm start
```

---

## 🧪 Test AI Features

### 1. Test AI Chatbot

1. Login vào hệ thống
2. Click menu **"AI Chatbot"** bên trái
3. Gõ câu hỏi: `"Làm thế nào để học tốt môn Toán?"`
4. Nhận phản hồi từ Gemini AI

### 2. Test API Endpoints

#### Chat với AI
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello AI!"}'
```

#### Gợi Ý Học Tập
```bash
curl http://localhost:5000/api/ai/recommendations/study/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Dự Đoán Hiệu Suất
```bash
curl http://localhost:5000/api/ai/predict/performance/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📊 Giới Hạn API (Free Tier)

| Metric | Limit |
|--------|-------|
| **Requests/phút** | 60 |
| **Requests/ngày** | 1500 |
| **Tokens/request** | Không giới hạn |
| **Chi phí** | **MIỄN PHÍ** 🎉 |

### Xử Lý Rate Limit

Nếu vượt quá 60 requests/phút, bạn sẽ nhận lỗi `429 Too Many Requests`.

Code đã xử lý tự động:
```javascript
if (error.response?.status === 429) {
  throw new Error('Đã vượt quá giới hạn API. Vui lòng thử lại sau vài phút.');
}
```

---

## 🔒 Bảo Mật API Key

### ❌ KHÔNG BAO GIỜ:

- Commit file `.env` lên GitHub
- Share API key công khai
- Hard-code API key vào source code
- Để API key trong frontend

### ✅ NÊN:

- Lưu API key trong `.env`
- Thêm `.env` vào `.gitignore`
- Chỉ dùng API key từ backend
- Rotate API key định kỳ

---

## 🐛 Troubleshooting

### Lỗi: "Không thể kết nối với AI assistant"

**Nguyên nhân**: API key không hợp lệ hoặc chưa được set

**Giải pháp**:
1. Kiểm tra `backend/.env` có `GEMINI_API_KEY`
2. Verify API key tại Google AI Studio
3. Restart backend sau khi thêm key

### Lỗi: "Đã vượt quá giới hạn API"

**Nguyên nhân**: Vượt quá 60 requests/phút

**Giải pháp**:
- Đợi 1 phút rồi thử lại
- Implement caching cho responses
- Tạo thêm API keys và rotate

### Lỗi: "Yêu cầu không hợp lệ"

**Nguyên nhân**: Prompt quá dài hoặc format sai

**Giải pháp**:
- Rút ngắn prompt
- Kiểm tra format JSON
- Xem logs để debug

---

## 📚 Tài Liệu Tham Khảo

- **Google AI Studio**: https://aistudio.google.com
- **Gemini API Docs**: https://ai.google.dev/docs
- **API Pricing**: https://ai.google.dev/pricing (Free tier)
- **Quickstart Guide**: https://ai.google.dev/tutorials/web_quickstart

---

## 💡 Tips & Best Practices

### 1. Optimize Prompts

Prompts ngắn gọn = Ít tokens = Nhanh hơn

❌ Tệ:
```
Bạn có thể giúp tôi với câu hỏi này không? Tôi đang gặp khó khăn...
```

✅ Tốt:
```
Giải thích khái niệm X một cách đơn giản
```

### 2. Use Caching

Cache responses phổ biến để tiết kiệm API calls:

```javascript
const cache = new Map();
if (cache.has(prompt)) {
  return cache.get(prompt);
}
```

### 3. Handle Errors Gracefully

Luôn có fallback cho user:

```javascript
try {
  return await geminiAPI.call(prompt);
} catch (error) {
  return "Xin lỗi, AI đang bận. Vui lòng thử lại sau.";
}
```

### 4. Monitor Usage

Theo dõi số requests để không vượt limit:

```javascript
console.log(`API calls today: ${dailyCount}/1500`);
```

---

## 🎉 Kết Quả Mong Đợi

Sau khi setup xong, bạn sẽ có:

- ✅ AI Chatbot hoạt động đầy đủ
- ✅ Gợi ý học tập thông minh
- ✅ Dự đoán hiệu suất học sinh
- ✅ Gợi ý khóa học cá nhân hóa
- ✅ Tạo báo cáo tự động
- ✅ **HOÀN TOÀN MIỄN PHÍ** 🎊

---

## 📞 Support

Nếu gặp vấn đề, check:
1. Console logs của backend
2. Network tab trong browser DevTools
3. Google AI Studio để verify API key

**Happy coding with Gemini AI!** 🚀
