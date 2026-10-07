// Official Attendance Rules & Times (QĐ 525/QĐ-THPT.VTT)

import { AttendanceStatus } from '../../types';

export interface SchoolSessionConfig {
  session: 'morning' | 'afternoon';
  session_start_time: string; // 06:45 or 12:45
  late_threshold_time: string; // 06:50 or 12:50
  session_end_time: string; // 10:40 or 16:40
}

export const OFFICIAL_SESSIONS: SchoolSessionConfig[] = [
  {
    session: 'morning',
    session_start_time: '06:45',
    late_threshold_time: '06:50',
    session_end_time: '10:40',
  },
  {
    session: 'afternoon',
    session_start_time: '12:45',
    late_threshold_time: '12:50',
    session_end_time: '16:40',
  },
];

export interface AbsenceProcedureRule {
  durationDaysMin: number;
  durationDaysMax?: number;
  procedureType: 'vnedu_app_with_evidence' | 'direct_school_procedure';
  description: string;
}

export const ABSENCE_PROCEDURES: AbsenceProcedureRule[] = [
  {
    durationDaysMin: 1,
    durationDaysMax: 3,
    procedureType: 'vnedu_app_with_evidence',
    description: 'Nghỉ từ 1 - 3 ngày: Phụ huynh xin phép trên ứng dụng VnEdu ngay trong buổi/ngày nghỉ học; kèm minh chứng (giấy khám, đơn thuốc,...). Ứng dụng chỉ theo dõi, không thay thế VnEdu.',
  },
  {
    durationDaysMin: 4,
    procedureType: 'direct_school_procedure',
    description: 'Nghỉ từ 4 ngày trở lên: Phụ huynh phải đến xin phép trực tiếp tại trường.',
  },
];

export interface AttendanceTally {
  actualTotalAbsenceSessions: number;
  permittedAbsenceCount: number;
  unpermittedAbsenceCount: number;
  totCapRelevantPermittedAbsenceCount: number; // excluding legitimate exceptions
  totCapRelevantUnpermittedAbsenceCount: number;
  warning45RuleCount: number;
  lateCount: number;
  isOver45WarningTriggered: boolean;
}

export function tallyAttendance(records: {
  status: AttendanceStatus;
  is_legitimate_exception?: boolean;
}[]): AttendanceTally {
  let permitted = 0;
  let unpermitted = 0;
  let legitimateExcused = 0;
  let late = 0;

  for (const r of records) {
    if (r.status === 'permitted_absence') {
      permitted++;
      if (r.is_legitimate_exception) {
        legitimateExcused++;
      }
    } else if (r.status === 'unpermitted_absence' || r.status === 'truancy') {
      unpermitted++;
    } else if (r.status === 'late') {
      late++;
    }
  }

  const actualTotal = permitted + unpermitted;
  const totCapRelevantPermitted = Math.max(0, permitted - legitimateExcused);
  const totCapRelevantUnpermitted = unpermitted;
  const warning45Count = actualTotal;

  return {
    actualTotalAbsenceSessions: actualTotal,
    permittedAbsenceCount: permitted,
    unpermittedAbsenceCount: unpermitted,
    totCapRelevantPermittedAbsenceCount: totCapRelevantPermitted,
    totCapRelevantUnpermittedAbsenceCount: totCapRelevantUnpermitted,
    warning45RuleCount: warning45Count,
    lateCount: late,
    isOver45WarningTriggered: warning45Count >= 45,
  };
}
