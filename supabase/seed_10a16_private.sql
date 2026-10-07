-- SEED ARTIFACT (PRIVATE ROSTER - CLASS 10A16, THPT VÕ TRƯỜNG TOẢN)
-- Academic Year: 2026-2027 | GVCN: Thầy Trần Duy Tân
-- Total: 43 Students | is_demo = FALSE
-- Notice: No invented gender, dob, phone, address, or parent names.

INSERT INTO academic_years (id, name, start_date, end_date, is_current)
VALUES ('ay-2026-2027', 'Năm học 2026–2027', '2026-09-01', '2027-05-31', true)
ON CONFLICT (id) DO UPDATE SET is_current = true;

INSERT INTO classes (id, name, grade, academic_year_id, gvcn_name)
VALUES ('class-10a16', '10A16', 10, 'ay-2026-2027', 'Trần Duy Tân')
ON CONFLICT (id) DO NOTHING;

-- 43 Real Students of 10A16
INSERT INTO students (id, student_code, last_name, first_name, full_name, class_id, is_demo, status)
VALUES
  ('stu-10a16-01', '10A16.01', 'Trần Đức', 'Anh', 'Trần Đức Anh', 'class-10a16', false, 'active'),
  ('stu-10a16-02', '10A16.02', 'Lê Thiên', 'Bảo', 'Lê Thiên Bảo', 'class-10a16', false, 'active'),
  ('stu-10a16-03', '10A16.03', 'Nguyễn Gia', 'Bảo', 'Nguyễn Gia Bảo', 'class-10a16', false, 'active'),
  ('stu-10a16-04', '10A16.04', 'Bùi Trịnh Hoàng', 'Các', 'Bùi Trịnh Hoàng Các', 'class-10a16', false, 'active'),
  ('stu-10a16-05', '10A16.05', 'Đinh Thanh Bảo', 'Châu', 'Đinh Thanh Bảo Châu', 'class-10a16', false, 'active'),
  ('stu-10a16-06', '10A16.06', 'Nguyễn Lê Minh', 'Châu', 'Nguyễn Lê Minh Châu', 'class-10a16', false, 'active'),
  ('stu-10a16-07', '10A16.07', 'Nguyễn Hữu', 'Công', 'Nguyễn Hữu Công', 'class-10a16', false, 'active'),
  ('stu-10a16-08', '10A16.08', 'Thái Trần Thanh', 'Danh', 'Thái Trần Thanh Danh', 'class-10a16', false, 'active'),
  ('stu-10a16-09', '10A16.09', 'Nguyễn Thùy', 'Dung', 'Nguyễn Thùy Dung', 'class-10a16', false, 'active'),
  ('stu-10a16-10', '10A16.10', 'Hoàng Mạnh', 'Dũng', 'Hoàng Mạnh Dũng', 'class-10a16', false, 'active'),
  ('stu-10a16-11', '10A16.11', 'Văn Tấn', 'Duy', 'Văn Tấn Duy', 'class-10a16', false, 'active'),
  ('stu-10a16-12', '10A16.12', 'Nguyễn Ngọc Gia', 'Hân', 'Nguyễn Ngọc Gia Hân', 'class-10a16', false, 'active'),
  ('stu-10a16-13', '10A16.13', 'Nguyễn Ngọc Diệu', 'Hiền', 'Nguyễn Ngọc Diệu Hiền', 'class-10a16', false, 'active'),
  ('stu-10a16-14', '10A16.14', 'Bùi Trung', 'Hiếu', 'Bùi Trung Hiếu', 'class-10a16', false, 'active'),
  ('stu-10a16-15', '10A16.15', 'Ngô Khải', 'Hoàn', 'Ngô Khải Hoàn', 'class-10a16', false, 'active'),
  ('stu-10a16-16', '10A16.16', 'Nguyễn Minh', 'Kha', 'Nguyễn Minh Kha', 'class-10a16', false, 'active'),
  ('stu-10a16-17', '10A16.17', 'Phạm Huỳnh Quang', 'Khải', 'Phạm Huỳnh Quang Khải', 'class-10a16', false, 'active'),
  ('stu-10a16-18', '10A16.18', 'Thân Gia', 'Kiệt', 'Thân Gia Kiệt', 'class-10a16', false, 'active'),
  ('stu-10a16-19', '10A16.19', 'Hồ Tường', 'Lân', 'Hồ Tường Lân', 'class-10a16', false, 'active'),
  ('stu-10a16-20', '10A16.20', 'Lưu Ngọc', 'Linh', 'Lưu Ngọc Linh', 'class-10a16', false, 'active'),
  ('stu-10a16-21', '10A16.21', 'Phạm Trần Gia', 'Lộc', 'Phạm Trần Gia Lộc', 'class-10a16', false, 'active'),
  ('stu-10a16-22', '10A16.22', 'Nguyễn Hoàng Bảo', 'Long', 'Nguyễn Hoàng Bảo Long', 'class-10a16', false, 'active'),
  ('stu-10a16-23', '10A16.23', 'Hoàng Trọng', 'Minh', 'Hoàng Trọng Minh', 'class-10a16', false, 'active'),
  ('stu-10a16-24', '10A16.24', 'Ngô Hùng', 'Minh', 'Ngô Hùng Minh', 'class-10a16', false, 'active'),
  ('stu-10a16-25', '10A16.25', 'Vũ Hoàng Nhật', 'Minh', 'Vũ Hoàng Nhật Minh', 'class-10a16', false, 'active'),
  ('stu-10a16-26', '10A16.26', 'Khưu Hoàng', 'Nam', 'Khưu Hoàng Nam', 'class-10a16', false, 'active'),
  ('stu-10a16-27', '10A16.27', 'Nguyễn Thanh Kỳ', 'Nam', 'Nguyễn Thanh Kỳ Nam', 'class-10a16', false, 'active'),
  ('stu-10a16-28', '10A16.28', 'Nguyễn Huỳnh', 'Nguyên', 'Nguyễn Huỳnh Nguyên', 'class-10a16', false, 'active'),
  ('stu-10a16-29', '10A16.29', 'Trần Minh', 'Nhật', 'Trần Minh Nhật', 'class-10a16', false, 'active'),
  ('stu-10a16-30', '10A16.30', 'Nguyễn Hòa', 'Phát', 'Nguyễn Hòa Phát', 'class-10a16', false, 'active'),
  ('stu-10a16-31', '10A16.31', 'Phạm Thành', 'Phát', 'Phạm Thành Phát', 'class-10a16', false, 'active'),
  ('stu-10a16-32', '10A16.32', 'Kim Trần Hoàng', 'Phúc', 'Kim Trần Hoàng Phúc', 'class-10a16', false, 'active'),
  ('stu-10a16-33', '10A16.33', 'Nguyễn Gia', 'Phúc', 'Nguyễn Gia Phúc', 'class-10a16', false, 'active'),
  ('stu-10a16-34', '10A16.34', 'Nguyễn Hoàng', 'Phúc', 'Nguyễn Hoàng Phúc', 'class-10a16', false, 'active'),
  ('stu-10a16-35', '10A16.35', 'Nguyễn Thái', 'Sơn', 'Nguyễn Thái Sơn', 'class-10a16', false, 'active'),
  ('stu-10a16-36', '10A16.36', 'Bùi Lê Minh', 'Tâm', 'Bùi Lê Minh Tâm', 'class-10a16', false, 'active'),
  ('stu-10a16-37', '10A16.37', 'Lê Minh', 'Tâm', 'Lê Minh Tâm', 'class-10a16', false, 'active'),
  ('stu-10a16-38', '10A16.38', 'Vũ Viết', 'Thành', 'Vũ Viết Thành', 'class-10a16', false, 'active'),
  ('stu-10a16-39', '10A16.39', 'Trần Thái', 'Thịnh', 'Trần Thái Thịnh', 'class-10a16', false, 'active'),
  ('stu-10a16-40', '10A16.40', 'Nguyễn Anh', 'Thư', 'Nguyễn Anh Thư', 'class-10a16', false, 'active'),
  ('stu-10a16-41', '10A16.41', 'Nguyễn Trọng', 'Tín', 'Nguyễn Trọng Tín', 'class-10a16', false, 'active'),
  ('stu-10a16-42', '10A16.42', 'Nguyễn Trọng', 'Tùng', 'Nguyễn Trọng Tùng', 'class-10a16', false, 'active'),
  ('stu-10a16-43', '10A16.43', 'Lý Tú', 'Uyên', 'Lý Tú Uyên', 'class-10a16', false, 'active')
ON CONFLICT (student_code) DO NOTHING;
