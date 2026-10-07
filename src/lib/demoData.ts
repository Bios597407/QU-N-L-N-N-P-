// Isolated Demo Mode Data Fixtures
// IMPORTANT PRIVACY COMPLIANCE: Real 10A16 names are NEVER placed in demo fixtures.
// All records here have is_demo = true and use synthetic placeholder names.

import { Student, Group, Incident, RewardRecord, AttendanceRecord, Task, PositiveNote } from '../types';

export const DEMO_STUDENTS: Student[] = Array.from({ length: 12 }, (_, i) => {
  const indexStr = (i + 1).toString().padStart(2, '0');
  const demoSurnames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ'];
  const demoMiddles = ['Văn', 'Thị', 'Gia', 'Minh', 'Ngọc', 'Đức', 'Thanh', 'Bảo', 'Hữu', 'Anh', 'Quang', 'Hải'];
  const demoFirstNames = ['An', 'Bình', 'Cường', 'Dung', 'Em', 'Giang', 'Hương', 'Khánh', 'Linh', 'Minh', 'Nam', 'Oanh'];

  const sur = demoSurnames[i % demoSurnames.length];
  const mid = demoMiddles[i % demoMiddles.length];
  const first = demoFirstNames[i % demoFirstNames.length];
  const last = `${sur} ${mid}`;

  return {
    id: `demo-stu-${indexStr}`,
    student_code: `DEMO.${indexStr}`,
    last_name: last,
    first_name: first,
    full_name: `${last} ${first} (Demo)`,
    class_id: 'class-demo',
    is_demo: true,
    group_id: `demo-group-${(i % 4) + 1}`,
    seat_number: `Bàn ${Math.floor(i / 2) + 1} - Vị trí ${(i % 2) + 1}`,
    status: 'active',
  };
});

export const DEMO_GROUPS: Group[] = [
  { id: 'demo-group-1', class_id: 'class-demo', group_number: 1, group_name: 'Tổ 1 (Demo)', leader_student_id: 'demo-stu-01' },
  { id: 'demo-group-2', class_id: 'class-demo', group_number: 2, group_name: 'Tổ 2 (Demo)', leader_student_id: 'demo-stu-04' },
  { id: 'demo-group-3', class_id: 'class-demo', group_number: 3, group_name: 'Tổ 3 (Demo)', leader_student_id: 'demo-stu-07' },
  { id: 'demo-group-4', class_id: 'class-demo', group_number: 4, group_name: 'Tổ 4 (Demo)', leader_student_id: 'demo-stu-10' },
];

export const DEMO_INCIDENTS: Incident[] = [
  {
    id: 'demo-inc-01',
    student_id: 'demo-stu-02',
    class_id: 'class-demo',
    conduct_code: '01',
    is_other_category: false,
    date: '2026-10-05',
    session: 'morning',
    period: 1,
    incident_status: 'approved',
    score_effect_status: 'confirmed_effect',
    base_deduction: -2,
    effective_deduction: -2,
    reported_by: 'Sao đỏ tuần 5',
    reporter_role: 'lop_truong',
    notes: 'Quên mang thẻ phù hiệu học sinh',
    created_at: '2026-10-05T07:15:00Z',
  },
  {
    id: 'demo-inc-02',
    student_id: 'demo-stu-05',
    class_id: 'class-demo',
    conduct_code: '08',
    is_other_category: false,
    date: '2026-10-06',
    session: 'morning',
    time: '06:55',
    incident_status: 'approved',
    score_effect_status: 'confirmed_effect',
    base_deduction: -2,
    effective_deduction: -2,
    reported_by: 'Cổng giám thị',
    reporter_role: 'gvcn',
    notes: 'Đến trường lúc 06:55 (sau mốc 06:50)',
    created_at: '2026-10-06T07:00:00Z',
  },
  {
    id: 'demo-inc-03',
    student_id: 'demo-stu-08',
    class_id: 'class-demo',
    conduct_code: null,
    is_other_category: true,
    other_category_description: 'Sử dụng tai nghe không dây trong giờ sinh hoạt chuyên đề',
    date: '2026-10-06',
    session: 'morning',
    incident_status: 'pending_verification',
    score_effect_status: 'none',
    base_deduction: 0,
    effective_deduction: 0,
    reported_by: 'Tổ trưởng tổ 3',
    reporter_role: 'to_truong',
    notes: 'Chờ GVCN xem xét phân loại sự việc',
    created_at: '2026-10-06T08:00:00Z',
  },
];

export const DEMO_REWARDS: RewardRecord[] = [
  {
    id: 'demo-rew-01',
    student_id: 'demo-stu-01',
    class_id: 'class-demo',
    reward_code: 'RW01',
    title: 'Giải Nhì cuộc thi Kể chuyện Bác Hồ cấp trường',
    points: 1,
    status: 'approved',
    proposer: 'Đoàn trường',
    approver: 'GVCN Thầy Tân',
    date: '2026-10-02',
    created_at: '2026-10-02T10:00:00Z',
  },
];

export const DEMO_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'demo-att-01',
    student_id: 'demo-stu-03',
    class_id: 'class-demo',
    date: '2026-10-06',
    session: 'morning',
    status: 'permitted_absence',
    reason: 'Sốt xuất huyết nằm viện Nhi Đồng',
    is_legitimate_exception: true,
    exception_reason: 'Nằm viện có giấy xuất viện xác nhận',
    vnedu_ref_number: 'VNEDU-2026-8831',
  },
  {
    id: 'demo-att-02',
    student_id: 'demo-stu-09',
    class_id: 'class-demo',
    date: '2026-10-06',
    session: 'morning',
    status: 'late',
    arrival_time: '06:55',
    reason: 'Kẹt xe đường Lê Văn Khương',
    is_legitimate_exception: false,
  },
];

export const DEMO_TASKS: Task[] = [
  {
    id: 'demo-task-01',
    class_id: 'class-demo',
    title: 'Kê 40 ghế nhựa sinh hoạt dưới cờ thứ Hai',
    description: 'Tổ 1 chịu trách nhiệm lấy và sắp xếp ghế tại sân trường trước 06:40',
    assigned_to_type: 'group',
    assigned_student_ids: ['demo-stu-01', 'demo-stu-02', 'demo-stu-03'],
    due_date: '2026-10-12',
    status: 'pending',
    created_by: 'GVCN Thầy Tân',
    created_at: '2026-10-06T07:30:00Z',
  },
];

export const DEMO_POSITIVE_NOTES: PositiveNote[] = [
  {
    id: 'demo-pos-01',
    student_id: 'demo-stu-04',
    class_id: 'class-demo',
    teacher_name: 'Thầy Tân (GVCN)',
    note_content: 'Chủ động nhặt rác và quét dọn bục giảng trước giờ vào lớp. Rất đáng biểu dương tinh thần tự giác!',
    date: '2026-10-05',
    category: 'helping_others',
    created_at: '2026-10-05T08:00:00Z',
  },
];
