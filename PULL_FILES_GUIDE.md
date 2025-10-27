# 📥 Hướng Dẫn Pull Files Từ GitHub

## ⚠️ Vấn Đề Hiện Tại
Bạn chỉ thấy file `FIX_MERGE_INSTRUCTIONS.md` sau khi pull, nhưng thiếu:
- ❌ NETWORK_ACCESS_GUIDE.md
- ❌ setup-firewall.ps1

## ✅ Giải Pháp

### Cách 1: Reset Về Trạng Thái Remote (Khuyến Nghị)

Cách này đảm bảo code của bạn giống hệt với GitHub:

```bash
# Lưu các thay đổi của bạn (nếu có)
git stash

# Fetch tất cả từ remote
git fetch origin

# Reset về trạng thái remote
git reset --hard origin/claude/fix-seeding-error-011CUNaRbUDy5wK3cfV9sTyJ

# Kiểm tra files
ls -la NETWORK_ACCESS_GUIDE.md
ls -la setup-firewall.ps1
ls -la FIX_MERGE_INSTRUCTIONS.md
```

⚠️ **Lưu ý**: `git reset --hard` sẽ XÓA tất cả thay đổi chưa commit!

---

### Cách 2: Pull Lại Và Merge

Nếu bạn có thay đổi riêng muốn giữ lại:

```bash
# Bước 1: Commit các thay đổi hiện tại (nếu có)
git add .
git commit -m "My changes"

# Bước 2: Pull với merge strategy
git pull --no-rebase origin claude/fix-seeding-error-011CUNaRbUDy5wK3cfV9sTyJ

# Nếu có conflict, giải quyết conflict rồi:
git add .
git commit -m "Merge remote changes"

# Bước 3: Kiểm tra files
ls -la NETWORK_ACCESS_GUIDE.md
ls -la setup-firewall.ps1
```

---

### Cách 3: Checkout Files Cụ Thể

Chỉ pull 2 files thiếu mà không thay đổi gì khác:

```bash
# Checkout files từ remote
git fetch origin
git checkout origin/claude/fix-seeding-error-011CUNaRbUDy5wK3cfV9sTyJ -- NETWORK_ACCESS_GUIDE.md
git checkout origin/claude/fix-seeding-error-011CUNaRbUDy5wK3cfV9sTyJ -- setup-firewall.ps1

# Kiểm tra
ls -la NETWORK_ACCESS_GUIDE.md
ls -la setup-firewall.ps1

# Commit nếu cần
git add NETWORK_ACCESS_GUIDE.md setup-firewall.ps1
git commit -m "Add missing files"
```

---

## 🔍 Kiểm Tra Files Đã Pull Đúng Chưa

```bash
# Xem tất cả files trong thư mục gốc
ls -la *.md *.ps1

# Hoặc
dir *.md *.ps1  # Trên Windows
```

Bạn phải thấy:
```
FIX_MERGE_INSTRUCTIONS.md
NETWORK_ACCESS_GUIDE.md
setup-firewall.ps1
```

---

## 📋 Verify Files Trên GitHub

Để xác nhận files có trên GitHub, chạy:

```bash
git ls-tree -r origin/claude/fix-seeding-error-011CUNaRbUDy5wK3cfV9sTyJ --name-only | grep -E "(NETWORK|setup|FIX)"
```

Kết quả phải hiện:
```
FIX_MERGE_INSTRUCTIONS.md
NETWORK_ACCESS_GUIDE.md
setup-firewall.ps1
```

---

## 🎯 Khuyến Nghị

**Nếu bạn KHÔNG có thay đổi quan trọng chưa commit:**
→ Dùng **Cách 1** (Reset về remote) - Nhanh nhất và đảm bảo không lỗi

**Nếu bạn có code riêng chưa muốn mất:**
→ Dùng **Cách 2** (Pull và merge) - Giữ lại thay đổi của bạn

**Nếu chỉ muốn lấy 2 files thiếu:**
→ Dùng **Cách 3** (Checkout files cụ thể) - Ít ảnh hưởng nhất

---

## ❓ Nếu Vẫn Không Thấy Files

Kiểm tra `.gitignore`:

```bash
# Xem file có bị ignore không
git check-ignore -v NETWORK_ACCESS_GUIDE.md
git check-ignore -v setup-firewall.ps1

# Nếu có output → files bị ignore, cần bỏ ignore
# Nếu không output → files không bị ignore
```

Kiểm tra branch đúng chưa:

```bash
# Xem branch hiện tại
git branch

# Phải thấy dấu * ở dòng:
# * claude/fix-seeding-error-011CUNaRbUDy5wK3cfV9sTyJ
```

---

## 📞 Liên Hệ

Nếu vẫn gặp vấn đề sau khi làm theo, hãy gửi output của các lệnh sau:

```bash
git status
git branch
git log --oneline -5
ls -la *.md *.ps1
```

Để tôi hỗ trợ debug thêm! 🚀
