# NỀ NẾP LỚP 10 – VTT PRO

Hệ thống quản lý nề nếp và rèn luyện học sinh Lớp **10A16** – Trường **THPT Võ Trường Toản** (Năm học 2026–2027)  
Giáo viên chủ nhiệm (GVCN): **Thầy Trần Duy Tân**  
Căn cứ văn bản nguồn: **Quyết định số 525/QĐ-THPT.VTT** (ngày 24/09/2026) & **Điều 8 Thông tư số 22/2021/TT-BGDĐT** (ngày 20/07/2021).

---

## 1. Kiến trúc Hệ thống (Architecture)

Ứng dụng được thiết kế theo cấu trúc modular, tách biệt lớp nghiệp vụ (Domain Logic) thuần túy với giao diện người dùng:

```
src/
  domain/
    scoring/          # Bộ động cơ tính điểm (Scoring Engine, Pending Rules, Clamping, Matrix)
    attendance/       # Khung giờ học, mốc trễ, quy trình VnEdu và bộ đếm 45 buổi
    incidents/        # Danh mục lỗi 01–24 QĐ 525, phân loại an toàn phần mềm
    rewards/          # Danh mục khen thưởng chính thức RW01–RW04
    auth/             # Ma trận thẩm quyền phân quyền lớp học (RBAC)
  components/         # Component UI tái sử dụng, modal điểm danh nhanh, báo vi phạm, nhập Excel
  pages/              # 15 phân hệ điều hành lớp học
  services/           # App state store, Excel parser & exporter (.xlsx)
  lib/                # Client Supabase, Demo data, Roster loader
  types/              # Định nghĩa dữ liệu TypeScript chuẩn hóa
supabase/
  migrations/         # DDL khởi tạo schema PostgreSQL và RLS policies
  policies/           # Chính sách bảo mật Private Storage
  seed_10a16_private.sql # Dữ liệu seed 43 học sinh chính thức lớp 10A16
tests/                # Bộ kiểm thử tự động Vitest (Scoring & Authorization)
docs/                 # Báo cáo trạng thái chi tiết
```

---

## 2. Quy tắc Phân loại Nguồn (Categories of Rules)

Hệ thống phân định nghiêm ngặt 3 nhóm quy tắc:

- **A. NGUỒN NỘI QUY CHÍNH THỨC (Official School Source Rule):**
  - Khung giờ học: Sáng 06:45–10:40 (Trễ sau 06:50); Chiều 12:45–16:40 (Trễ sau 12:50).
  - Điểm rèn luyện tuần: Gốc 8 điểm, tối đa 10 điểm, tối thiểu 0 điểm. Kẹp trần đúng 1 lần duy nhất ở cuối.
  - Danh mục vi phạm: Chính xác chỉ từ Mã 01 đến Mã 24 (không có mã OTHER).
  - Quy trình xin phép vắng: 1–3 ngày qua VnEdu; 4 ngày trở lên trực tiếp tại trường.
  - Ma trận cả năm: Căn cứ mức xếp loại đã chốt của HK1 và HK2 (16 trường hợp theo TT 22, không cộng trung bình số học).
- **B. THIẾT KẾ AN TOÀN PHẦN MỀM (Software Design / Safety Rule):**
  - "Sự việc khác — chờ xem xét": Là danh mục an toàn tạm thời (conduct_code = null, điểm = 0), không phải mã 25.
  - Nhiệm vụ lớp học: Trạng thái chưa xong hoặc trễ hạn TUYỆT ĐỐI KHÔNG tự động phát sinh vi phạm Mã 09 (V09).
  - Cảnh báo trùng lặp: Phát hiện vi phạm/thưởng trùng thời điểm chỉ hiển thị Cảnh báo, không tự động gộp dữ liệu.
- **C. QUY TẮC CHƯA XÁC NHẬN (Unresolved Rule — Requires GVCN Confirmation):**
  - Gồm 9 điểm (PENDING-01 đến PENDING-09) về mâu thuẫn lũy tiến lỗi 01-18, phạm vi đếm, phân bổ RW03, quy đổi 45 buổi, làm tròn 6.95.
  - Mặc định trạng thái `unresolved` đóng góp 0 điểm cho tới khi GVCN chính thức lựa chọn và ban hành căn cứ.

---

## 3. Danh sách Học sinh 10A16 & Bảo vệ Riêng tư

- Danh sách 43 học sinh chính thức được lưu giữ trong `supabase/seed_10a16_private.sql` và nạp bảo mật (`is_demo = false`).
- Tuyệt đối không đưa tên thật vào các fixture demo công cộng trên trình duyệt.
- Môi trường chạy độc lập hiển thị thông báo: `DEMO — CHƯA KẾT NỐI DATABASE PRODUCTION`.

---

## 4. Biến Môi trường (.env)

Xem tệp `.env.example`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 5. Hướng dẫn Chạy Kiểm thử (Testing)

```bash
# Chạy bộ test tính điểm và thẩm quyền
npm test
```

Tất cả 42 kịch bản kiểm thử (toàn bộ 16 trường hợp ma trận cả năm, kẹp trần, xử lý V24, RBAC) đã được xác minh thành công.
