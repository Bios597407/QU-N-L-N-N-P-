// Official Reward Catalog (Quy định 525/QĐ-THPT.VTT)

export interface RewardCatalogItem {
  code: 'RW01' | 'RW02' | 'RW03' | 'RW04';
  title: string;
  points: number;
  periodUnit: 'lần' | 'tháng';
  description: string;
}

export const OFFICIAL_REWARD_CATALOG: RewardCatalogItem[] = [
  {
    code: 'RW01',
    title: 'Hội thi cấp Trường / Đoàn / Tổ chuyên môn',
    points: 1,
    periodUnit: 'lần',
    description: 'Tham gia hội thi do trường, tổ chuyên môn, đoàn thanh niên tổ chức có giải: +1 điểm/lần.',
  },
  {
    code: 'RW02',
    title: 'Việc tốt được ghi nhận bằng văn bản',
    points: 1,
    periodUnit: 'lần',
    description: 'Làm việc tốt được trường ghi nhận bằng văn bản: +1 điểm/lần.',
  },
  {
    code: 'RW03',
    title: 'Cán bộ lớp, cán bộ Đoàn xuất sắc',
    points: 1,
    periodUnit: 'tháng',
    description: 'Cán bộ lớp, cán bộ Đoàn hoàn thành xuất sắc nhiệm vụ (chủ nhiệm đánh giá bằng văn bản vào cuối học kỳ): +1 điểm/tháng. (PENDING-03: cơ chế phân bổ/thời điểm áp dụng).',
  },
  {
    code: 'RW04',
    title: 'Giải thi cấp Thành phố',
    points: 2,
    periodUnit: 'lần',
    description: 'Đạt giải trong các kỳ thi cấp thành phố (Học sinh giỏi, Olympic, NCKH, Văn nghệ, TDTT,…): +2 điểm/lần.',
  },
];
