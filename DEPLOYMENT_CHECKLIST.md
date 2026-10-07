# DEPLOYMENT CHECKLIST: NỀ NẾP LỚP 10 – VTT PRO

Tài liệu hướng dẫn triển khai hệ thống lên hạ tầng Supabase và máy chủ Production cho Lớp 10A16 – Trường THPT Võ Trường Toản.

---

## 1. Chuẩn bị Hạ tầng Supabase

- [ ] Tạo dự án Supabase mới (Khu vực Đông Nam Á / Singapore `ap-southeast-1` để tối ưu độ trễ tại Việt Nam).
- [ ] Lấy `SUPABASE_URL` và `SUPABASE_ANON_KEY` điền vào cấu hình biến môi trường.
- [ ] Không bao giờ đặt `service_role` key vào mã nguồn client hoặc các biến bắt đầu bằng `VITE_`.

---

## 2. Thực thi Di chuyển Cơ sở Dữ liệu (Migrations)

Chạy tuần tự các tệp SQL trong thư mục `supabase/`:

1. `supabase/migrations/20261006000001_initial_schema.sql`
   - Khởi tạo 40+ bảng dữ liệu chuẩn hóa, quan hệ khóa ngoại (Foreign Keys an toàn với quy tắc `RESTRICT` / `NO ACTION` bảo vệ provenance).
   - Thiết lập chỉ mục duy nhất một phần `WHERE is_current = true` cho các snapshot điểm tuần, tháng, học kỳ và cả năm.
2. `supabase/migrations/20261006000002_rls_policies.sql`
   - Bật Row Level Security (RLS) trên toàn bộ các bảng nghiệp vụ.
   - Thiết lập hàm giải quyết vai trò an toàn `auth.get_user_class_role` và `auth.get_user_student_id` với `SECURITY DEFINER` và `SET search_path = public, pg_temp`.
   - Cấm hoàn toàn quyền `UPDATE` và `DELETE` trên bảng `audit_logs`.
3. `supabase/policies/storage_policies.sql`
   - Khởi tạo private storage bucket `incident-evidence`.
   - Thiết lập chính sách kiểm tra quyền thành viên lớp học có xác thực.
4. `supabase/seed_10a16_private.sql`
   - Nạp danh sách 43 học sinh chính thức lớp 10A16 (`is_demo = false`).

---

## 3. Xác thực Kiểm thử Môi trường Live

- [ ] Đăng nhập tài khoản GVCN (Thầy Trần Duy Tân) và kiểm tra quyền duyệt sự việc.
- [ ] Đăng nhập tài khoản Học sinh và kiểm tra chính sách RLS: xác nhận Học sinh A không thể truy vấn điểm hay sự việc của Học sinh B.
- [ ] Tải lên ảnh minh chứng sự việc vào Private Storage và kiểm tra quyền truy cập thông qua Signed URLs.
- [ ] Thực hiện thử nghiệm khóa kỳ đánh giá khi còn sự việc treo (xác nhận hệ thống chặn khóa thành công).

---

## 4. Trạng thái Thực tế Hiện tại

- MÃ NGUỒN: ĐÃ XÂY DỰNG HOÀN CHỈNH
- KIỂM THỬ ĐỘNG CƠ ĐIỂM SỐ: ĐÃ CHẠY VÀ VƯỢT QUA 42/42 TEST
- MÔI TRƯỜNG LIVE SUPABASE: CHƯA KẾT NỐI (MIGRATIONS NOT EXECUTED AGAINST LIVE SUPABASE)
- TRIỂN KHAI PRODUCTION: CHƯA XÁC NHẬN
