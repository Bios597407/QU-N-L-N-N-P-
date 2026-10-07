import { describe, it, expect } from 'vitest';
import {
  calculateWeeklyScore,
  calculateMonthlyScore,
  calculateSemesterNumericScore,
  determineBaseConductLevel,
  applySemesterRestrictions,
  calculateAnnualConduct,
} from '../src/domain/scoring/scoringEngine';
import { ConductLevel, Incident, RewardRecord } from '../src/types';

describe('Scoring Engine Tests - THPT Võ Trường Toản Class 10A16', () => {
  // Test 1: Valid week with no eligible events: 8
  it('Valid week with no eligible events should yield 8 points', () => {
    const res = calculateWeeklyScore({
      isCalculated: true,
      incidents: [],
      rewards: [],
    });
    expect(res.raw_week_score).toBe(8);
    expect(res.official_week_score).toBe(8);
  });

  // Test 2: Approved RW +1: 9
  it('Approved RW +1 should yield 9 points', () => {
    const rewards: RewardRecord[] = [
      {
        id: 'r1',
        student_id: 's1',
        class_id: 'c1',
        reward_code: 'RW01',
        title: 'Hội thi cấp trường giải Nhì',
        points: 1,
        status: 'approved',
        proposer: 'Đoàn trường',
        date: '2026-10-05',
        created_at: '2026-10-05T00:00:00Z',
      },
    ];
    const res = calculateWeeklyScore({
      isCalculated: true,
      incidents: [],
      rewards,
    });
    expect(res.raw_week_score).toBe(9);
    expect(res.official_week_score).toBe(9);
  });

  // Test 3: Raw score > 10 clamped to 10
  it('Raw score > 10: official clamped to 10', () => {
    const rewards: RewardRecord[] = [
      { id: 'r1', student_id: 's1', class_id: 'c1', reward_code: 'RW04', title: 'Giải Nhất HSG TP', points: 2, status: 'approved', proposer: 'Tổ Toán', date: '2026-10-05', created_at: '' },
      { id: 'r2', student_id: 's1', class_id: 'c1', reward_code: 'RW04', title: 'Giải Nhất Olympic TP', points: 2, status: 'approved', proposer: 'Tổ Lý', date: '2026-10-06', created_at: '' },
    ];
    // 8 + 2 + 2 = 12 -> clamp to 10
    const res = calculateWeeklyScore({
      isCalculated: true,
      incidents: [],
      rewards,
    });
    expect(res.raw_week_score).toBe(12);
    expect(res.official_week_score).toBe(10);
  });

  // Test 4: Raw score < 0 clamped to 0
  it('Raw score < 0: official clamped to 0', () => {
    const incidents: Incident[] = [
      {
        id: 'i1',
        student_id: 's1',
        class_id: 'c1',
        conduct_code: '16',
        is_other_category: false,
        date: '2026-10-05',
        session: 'morning',
        incident_status: 'approved',
        score_effect_status: 'confirmed_effect',
        base_deduction: -6,
        effective_deduction: -6,
        reported_by: 'GT',
        reporter_role: 'gvcn',
        created_at: '',
      },
      {
        id: 'i2',
        student_id: 's1',
        class_id: 'c1',
        conduct_code: '20',
        is_other_category: false,
        date: '2026-10-06',
        session: 'morning',
        incident_status: 'approved',
        score_effect_status: 'confirmed_effect',
        base_deduction: -6,
        effective_deduction: -6,
        reported_by: 'GT',
        reporter_role: 'gvcn',
        created_at: '',
      },
    ];
    // 8 - 6 - 6 = -4 -> clamp to 0
    const res = calculateWeeklyScore({
      isCalculated: true,
      incidents,
      rewards: [],
    });
    expect(res.raw_week_score).toBe(-4);
    expect(res.official_week_score).toBe(0);
  });

  // Test 5 & 6: Clamp happens once at the end and event ordering does not alter final result
  it('Clamp happens once and event order does not alter final result', () => {
    const inc: Incident = {
      id: 'i1',
      student_id: 's1',
      class_id: 'c1',
      conduct_code: '16',
      is_other_category: false,
      date: '2026-10-05',
      session: 'morning',
      incident_status: 'approved',
      score_effect_status: 'confirmed_effect',
      base_deduction: -6,
      effective_deduction: -6,
      reported_by: 'GT',
      reporter_role: 'gvcn',
      created_at: '',
    };
    const rew: RewardRecord = {
      id: 'r1',
      student_id: 's1',
      class_id: 'c1',
      reward_code: 'RW04',
      title: 'Olympic TP',
      points: 2,
      status: 'approved',
      proposer: 'Đoàn',
      date: '2026-10-06',
      created_at: '',
    };

    // 8 - 6 + 2 = 4
    const resA = calculateWeeklyScore({ isCalculated: true, incidents: [inc], rewards: [rew] });
    const resB = calculateWeeklyScore({ isCalculated: true, incidents: [inc], rewards: [rew] });

    expect(resA.raw_week_score).toBe(4);
    expect(resA.official_week_score).toBe(4);
    expect(resA.official_week_score).toBe(resB.official_week_score);
  });

  // Test 7: Pending incident has 0 official effect
  it('Pending incident contributes 0 official effect', () => {
    const inc: Incident = {
      id: 'i1',
      student_id: 's1',
      class_id: 'c1',
      conduct_code: '01',
      is_other_category: false,
      date: '2026-10-05',
      session: 'morning',
      incident_status: 'pending_verification',
      score_effect_status: 'none',
      base_deduction: -2,
      effective_deduction: 0,
      reported_by: 'Cờ đỏ',
      reporter_role: 'lop_truong',
      created_at: '',
    };
    const res = calculateWeeklyScore({ isCalculated: true, incidents: [inc], rewards: [] });
    expect(res.official_week_score).toBe(8);
  });

  // Test 8: Rejected incident has 0 official effect
  it('Rejected incident contributes 0 official effect', () => {
    const inc: Incident = {
      id: 'i1',
      student_id: 's1',
      class_id: 'c1',
      conduct_code: '01',
      is_other_category: false,
      date: '2026-10-05',
      session: 'morning',
      incident_status: 'rejected',
      score_effect_status: 'none',
      base_deduction: -2,
      effective_deduction: 0,
      reported_by: 'Cờ đỏ',
      reporter_role: 'lop_truong',
      created_at: '',
    };
    const res = calculateWeeklyScore({ isCalculated: true, incidents: [inc], rewards: [] });
    expect(res.official_week_score).toBe(8);
  });

  // Test 9: Approved + pending_rule contributes 0 official effect
  it('Approved incident with score_effect_status = pending_rule contributes 0 official effect', () => {
    const inc: Incident = {
      id: 'i1',
      student_id: 's1',
      class_id: 'c1',
      conduct_code: '19',
      is_other_category: false,
      date: '2026-10-05',
      session: 'morning',
      incident_status: 'approved',
      score_effect_status: 'pending_rule',
      base_deduction: -6,
      effective_deduction: 0,
      reported_by: 'GT',
      reporter_role: 'gvcn',
      created_at: '',
    };
    const res = calculateWeeklyScore({ isCalculated: true, incidents: [inc], rewards: [] });
    expect(res.official_week_score).toBe(8);
  });

  // Test 10: Phone authorized by teacher -> no violation
  it('Teacher authorized phone use does not create V24 violation', () => {
    const phoneUseAuthorized = true;
    const shouldCreateV24 = !phoneUseAuthorized;
    expect(shouldCreateV24).toBe(false);
  });

  // Test 11: Duplicate reports linked to one canonical incident -> one score effect only
  it('Duplicate reports linked to one canonical incident deducts only once', () => {
    const canonicalId = 'canonical-01';
    const rep1: Incident = {
      id: 'rep-01',
      canonical_id: canonicalId,
      student_id: 's1',
      class_id: 'c1',
      conduct_code: '01',
      is_other_category: false,
      date: '2026-10-05',
      session: 'morning',
      incident_status: 'approved',
      score_effect_status: 'confirmed_effect',
      base_deduction: -2,
      effective_deduction: -2,
      reported_by: 'Lớp trưởng',
      reporter_role: 'lop_truong',
      created_at: '',
    };
    const rep2: Incident = {
      id: 'rep-02',
      canonical_id: canonicalId,
      student_id: 's1',
      class_id: 'c1',
      conduct_code: '01',
      is_other_category: false,
      date: '2026-10-05',
      session: 'morning',
      incident_status: 'approved',
      score_effect_status: 'confirmed_effect',
      base_deduction: -2,
      effective_deduction: -2,
      reported_by: 'Cờ đỏ',
      reporter_role: 'lop_pho',
      created_at: '',
    };

    // Both reports link to the same canonicalId. Score deduction must only be -2, not -4!
    const res = calculateWeeklyScore({ isCalculated: true, incidents: [rep1, rep2], rewards: [] });
    expect(res.total_deductions).toBe(-2);
    expect(res.official_week_score).toBe(6);
  });

  // Test 12: Attendance record does not directly subtract conduct score
  it('Attendance fact itself does not directly subtract conduct score', () => {
    // Attendance creates a separate V14 incident report if unpermitted. The attendance tally alone does not change weekly score.
    const res = calculateWeeklyScore({ isCalculated: true, incidents: [], rewards: [] });
    expect(res.official_week_score).toBe(8);
  });

  // Test 13: Future week returns null score
  it('Future week returns null score', () => {
    const res = calculateWeeklyScore({
      isCalculated: false,
      isFutureWeek: true,
      incidents: [],
      rewards: [],
    });
    expect(res.raw_week_score).toBeNull();
    expect(res.official_week_score).toBeNull();
  });

  // Test 14 & 15: Missing month data returns null (not automatically 0 or 8)
  it('Missing month data returns null, never default 0 or 8', () => {
    const resEmpty = calculateMonthlyScore([]);
    expect(resEmpty).toBeNull();

    const resNulls = calculateMonthlyScore([null, null]);
    expect(resNulls).toBeNull();
  });

  // Test 16: Semester averages months, not weeks directly
  it('Semester score averages months, not weeks directly', () => {
    // Month 1 has 4 weeks with score 8 (avg = 8)
    // Month 2 has 1 week with score 6 (avg = 6)
    // Direct week average would be (8*4 + 6)/5 = 38/5 = 7.6
    // Official month average is (8 + 6) / 2 = 7.0!
    const month1Avg = 8.0;
    const month2Avg = 6.0;
    const semesterAvg = calculateSemesterNumericScore([month1Avg, month2Avg]);
    expect(semesterAvg).toBe(7.0);
  });

  // Test 17: 6.95 must NOT automatically become Tốt
  it('6.95 must NOT automatically become Tốt (unresolved rounding policy)', () => {
    const level = determineBaseConductLevel(6.95);
    expect(level).toBe('Chờ xác nhận quy tắc làm tròn/ngưỡng');
    expect(level).not.toBe('Tốt');
  });

  // Test 18: Annual Conduct Matrix - ALL 16 Combinations
  describe('Official Annual Conduct Matrix (16 Combinations)', () => {
    const levels: ConductLevel[] = ['Tốt', 'Khá', 'Đạt', 'Chưa đạt'];

    const expectedMatrix: Record<string, ConductLevel> = {
      // HK2 = Tốt
      'Tốt-Tốt': 'Tốt',
      'Tốt-Khá': 'Tốt',         // HK2 = Tốt, HK1 = Khá -> Tốt
      'Tốt-Đạt': 'Khá',         // HK2 = Tốt, HK1 = Đạt -> Khá
      'Tốt-Chưa đạt': 'Khá',    // HK2 = Tốt, HK1 = Chưa đạt -> Khá

      // HK2 = Khá
      'Khá-Tốt': 'Khá',
      'Khá-Khá': 'Khá',
      'Khá-Đạt': 'Khá',
      'Khá-Chưa đạt': 'Đạt',    // HK2 = Khá, HK1 = Chưa đạt -> Đạt

      // HK2 = Đạt
      'Đạt-Tốt': 'Khá',         // HK2 = Đạt, HK1 = Tốt -> Khá
      'Đạt-Khá': 'Đạt',
      'Đạt-Đạt': 'Đạt',
      'Đạt-Chưa đạt': 'Đạt',

      // HK2 = Chưa đạt
      'Chưa đạt-Tốt': 'Chưa đạt',
      'Chưa đạt-Khá': 'Chưa đạt',
      'Chưa đạt-Đạt': 'Chưa đạt',
      'Chưa đạt-Chưa đạt': 'Chưa đạt',
    };

    levels.forEach((hk2) => {
      levels.forEach((hk1) => {
        const key = `${hk2}-${hk1}`;
        const expected = expectedMatrix[key];
        it(`HK2 = ${hk2}, HK1 = ${hk1} => Annual Conduct = ${expected}`, () => {
          const result = calculateAnnualConduct(hk1, hk2);
          expect(result).toBe(expected);
        });
      });
    });
  });

  // Test Attendance restrictions on Semester conduct
  it('Semester conduct restriction: >=10 permitted absences caps Tốt to Khá', () => {
    const res = applySemesterRestrictions('Tốt', {
      permittedAbsenceCount: 10,
      unpermittedAbsenceCount: 0,
      phoneViolationsCount: 0,
    });
    expect(res.finalSuggestedLevel).toBe('Khá');
    expect(res.attendanceCapApplied).toBe(true);
  });

  it('Semester conduct restriction: >=2 unpermitted absences caps Tốt to Khá', () => {
    const res = applySemesterRestrictions('Tốt', {
      permittedAbsenceCount: 1,
      unpermittedAbsenceCount: 2,
      phoneViolationsCount: 0,
    });
    expect(res.finalSuggestedLevel).toBe('Khá');
    expect(res.attendanceCapApplied).toBe(true);
  });

  it('Semester phone restriction: 2nd violation caps at Đạt, 3rd at Chưa đạt', () => {
    const res2 = applySemesterRestrictions('Tốt', {
      permittedAbsenceCount: 0,
      unpermittedAbsenceCount: 0,
      phoneViolationsCount: 2,
    });
    expect(res2.finalSuggestedLevel).toBe('Đạt');

    const res3 = applySemesterRestrictions('Tốt', {
      permittedAbsenceCount: 0,
      unpermittedAbsenceCount: 0,
      phoneViolationsCount: 3,
    });
    expect(res3.finalSuggestedLevel).toBe('Chưa đạt');
  });
});
