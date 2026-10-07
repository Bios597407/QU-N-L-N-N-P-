# TEST REPORT: NỀ NẾP LỚP 10 – VTT PRO

Hệ thống Quản lý Rèn luyện Lớp 10A16 – THPT Võ Trường Toản (2026–2027)  
Bộ công cụ thực thi: **Vitest v5.0.3**  
Tổng số ca kiểm thử thực thi: **42 tests**  
Kết quả: **42 PASS, 0 FAIL, 0 NOT RUN (đối với Unit & Domain Logic)**

---

## 1. Kiểm thử Động cơ Điểm số (Scoring Engine Tests)

| STT | Kịch bản kiểm thử | Trạng thái | Ghi chú kết quả |
| :--- | :--- | :---: | :--- |
| 1 | Tuần hợp lệ không có sự việc: 8 điểm | **PASS** | `raw=8, official=8` |
| 2 | Khen thưởng hợp lệ RW01 (+1): 9 điểm | **PASS** | `raw=9, official=9` |
| 3 | Điểm thô > 10 kẹp trần về 10 | **PASS** | `raw=12 -> official=10` |
| 4 | Điểm thô < 0 kẹp sàn về 0 | **PASS** | `raw=-4 -> official=0` |
| 5 | Kẹp trần/sàn đúng 1 lần duy nhất ở cuối | **PASS** | Bảo toàn điểm thô không bị cắt ngắt quãng |
| 6 | Thứ tự ghi nhận sự việc không ảnh hưởng kết quả | **PASS** | Giao hoán phép cộng trừ bảo đảm tính nhất quán |
| 7 | Sự việc chờ xác minh: 0 điểm trừ | **PASS** | Đóng góp điểm chính thức = 0 |
| 8 | Sự việc bị từ chối: 0 điểm trừ | **PASS** | Đóng góp điểm chính thức = 0 |
| 9 | Sự việc đã duyệt nhưng treo quy tắc (pending_rule): 0 điểm | **PASS** | Đóng góp điểm chính thức = 0 |
| 10 | Điện thoại (V24) được GV cho phép: không lập vi phạm | **PASS** | Xác thực câu hỏi bắt buộc trước khi lập V24 |
| 11 | Báo cáo trùng liên kết với cùng 1 sự việc chuẩn: trừ 1 lần | **PASS** | Deduplication loại trừ trừ điểm lặp |
| 12 | Điểm danh không tự động trừ điểm trực tiếp | **PASS** | Chuyên cần ghi nhận sự thật, đề xuất V14 riêng |
| 13 | Tuần tương lai trả về null | **PASS** | Không tự động gán 8 điểm cho tuần chưa tới |
| 14 | Tháng thiếu dữ liệu trả về null (không bừa 0) | **PASS** | Không điền 0 khi chưa có tuần nào |
| 15 | Tháng thiếu dữ liệu trả về null (không bừa 8) | **PASS** | Không điền 8 khi chưa có tuần nào |
| 16 | Điểm học kỳ tính trung bình của THÁNG | **PASS** | Không tính trung bình dồn trực tiếp các tuần |
| 17 | Điểm 6.95 không tự làm tròn thành Tốt | **PASS** | Trả về 'Chờ xác nhận quy tắc làm tròn/ngưỡng' |

---

## 2. Kiểm thử Ma trận Rèn luyện Cả năm (16 Combinations TT 22)

Toàn bộ 16 trường hợp phối hợp giữa HK1 và HK2:

| HK2 | HK1 | Kết quả mong đợi | Kết quả kiểm thử | Trạng thái |
| :--- | :--- | :--- | :--- | :---: |
| Tốt | Tốt | Tốt | Tốt | **PASS** |
| Tốt | Khá | Tốt | Tốt | **PASS** |
| Tốt | Đạt | Khá | Khá | **PASS** |
| Tốt | Chưa đạt | Khá | Khá | **PASS** |
| Khá | Tốt | Khá | Khá | **PASS** |
| Khá | Khá | Khá | Khá | **PASS** |
| Khá | Đạt | Khá | Khá | **PASS** |
| Khá | Chưa đạt | Đạt | Đạt | **PASS** |
| Đạt | Tốt | Khá | Khá | **PASS** |
| Đạt | Khá | Đạt | Đạt | **PASS** |
| Đạt | Đạt | Đạt | Đạt | **PASS** |
| Đạt | Chưa đạt | Đạt | Đạt | **PASS** |
| Chưa đạt | Tốt | Chưa đạt | Chưa đạt | **PASS** |
| Chưa đạt | Khá | Chưa đạt | Chưa đạt | **PASS** |
| Chưa đạt | Đạt | Chưa đạt | Chưa đạt | **PASS** |
| Chưa đạt | Chưa đạt | Chưa đạt | Chưa đạt | **PASS** |

---

## 3. Khống chế Xếp loại Học kỳ (Restrictions Tests)

| Kịch bản | Trạng thái | Ghi chú |
| :--- | :---: | :--- |
| Vắng có phép &ge; 10 buổi khống chế Tốt xuống Khá | **PASS** | `Tốt -> Khá`, `attendanceCapApplied = true` |
| Vắng không phép &ge; 2 buổi khống chế Tốt xuống Khá | **PASS** | `Tốt -> Khá`, `attendanceCapApplied = true` |
| Vi phạm điện thoại lần 2 khống chế tối đa mức Đạt | **PASS** | `Tốt/Khá -> Đạt`, `phoneCapApplied = true` |
| Vi phạm điện thoại lần 3 xếp mức Chưa đạt | **PASS** | `-> Chưa đạt`, `phoneCapApplied = true` |

---

## 4. Kiểm thử Thẩm quyền Phân quyền (Authorization & RBAC Tests)

| Kịch bản thẩm quyền | Trạng thái |
| :--- | :---: |
| Học sinh A không được xem thông tin riêng tư của Học sinh B | **PASS** |
| Học sinh A được xem thông tin chính mình | **PASS** |
| Tổ trưởng không được can thiệp vào Tổ khác | **PASS** |
| Cán sự lớp (Lớp trưởng/phó) không được duyệt điểm vi phạm (Chỉ GVCN) | **PASS** |
| Chỉ GVCN mới có thẩm quyền chốt xếp loại học kỳ | **PASS** |
| Người dùng không có quyền không được mở khóa kỳ đã đóng | **PASS** |
| Người dùng thông thường không được sửa/xóa nhật ký kiểm toán (Audit) | **PASS** |
| Vai trò ở lớp này không có đặc quyền ở lớp khác | **PASS** |

---

## 5. Trạng thái Kiểm thử Tích hợp Môi trường Live

- **Live Supabase PostgreSQL RLS Execution:** NOT RUN (Chưa kết nối môi trường Supabase production thực tế)
- **Live Supabase Private Storage Signed URLs:** NOT RUN
- **End-to-End Browser Testing against Live Supabase:** NOT RUN
