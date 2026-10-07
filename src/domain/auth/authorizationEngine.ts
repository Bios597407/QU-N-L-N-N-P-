// Authorization Policy Engine
// Strictly models the security boundaries required by the application
// School: THPT Võ Trường Toản - Lớp 10A16 (2026-2027)
// Ban Cán Sự: GVCN, Lớp trưởng, Lớp phó có toàn quyền điều chỉnh tất cả nội dung trong bản nề nếp.

import { RoleType } from '../../types';

export interface AuthContext {
  userId: string;
  classId: string;
  studentId?: string; // If the user is a student
  role: RoleType;
  groupId?: string;   // If the user is a tổ trưởng
}

export class AuthorizationEngine {
  /**
   * Helper: Check if user has class management privileges (GVCN, Lớp trưởng, Lớp phó).
   */
  static isClassManager(role: RoleType): boolean {
    return role === 'gvcn' || role === 'lop_truong' || role === 'lop_pho';
  }

  /**
   * Check if user can approve an incident and confirm score effect.
   * GVCN, Lớp trưởng, Lớp phó có thẩm quyền duyệt sự việc và chốt hiệu lực điểm.
   */
  static canApproveIncident(ctx: AuthContext, incidentClassId: string): boolean {
    if (ctx.classId !== incidentClassId) return false;
    return this.isClassManager(ctx.role);
  }

  /**
   * Check if user can approve rewards and add commendation points.
   * GVCN, Lớp trưởng, Lớp phó có thẩm quyền duyệt khen thưởng.
   */
  static canApproveReward(ctx: AuthContext, rewardClassId: string): boolean {
    if (ctx.classId !== rewardClassId) return false;
    return this.isClassManager(ctx.role);
  }

  /**
   * Check if user can view student private details.
   * Student can only view their own private details. Student A cannot view Student B.
   * GVCN, Lớp trưởng, Lớp phó can view for class management.
   */
  static canViewStudentPrivateDetails(ctx: AuthContext, targetStudentId: string, studentClassId: string): boolean {
    if (ctx.classId !== studentClassId) return false;
    if (this.isClassManager(ctx.role)) return true;
    return ctx.studentId === targetStudentId;
  }

  /**
   * Check if user can modify group assignments or reviews.
   * GVCN, Lớp trưởng, Lớp phó can manage all groups; Tổ trưởng can manage their own group.
   */
  static canManageGroup(ctx: AuthContext, targetGroupId: string): boolean {
    if (this.isClassManager(ctx.role)) return true;
    if (ctx.role === 'to_truong' && ctx.groupId === targetGroupId) return true;
    return false;
  }

  /**
   * Check if user can finalize semester conduct.
   * GVCN, Lớp trưởng, Lớp phó có quyền chốt xếp loại rèn luyện học kỳ.
   */
  static canFinalizeSemester(ctx: AuthContext, classId: string): boolean {
    if (ctx.classId !== classId) return false;
    return this.isClassManager(ctx.role);
  }

  /**
   * Check if user can lock or reopen a period.
   * GVCN, Lớp trưởng, Lớp phó có quyền khóa và mở kỳ đánh giá.
   */
  static canReopenPeriod(ctx: AuthContext, classId: string): boolean {
    if (ctx.classId !== classId) return false;
    return this.isClassManager(ctx.role);
  }

  /**
   * Check if user can configure pending rules (PENDING-01 .. PENDING-09).
   * GVCN, Lớp trưởng, Lớp phó có quyền điều chỉnh và xác nhận quy tắc nề nếp.
   */
  static canConfigurePendingRules(ctx: AuthContext, classId: string): boolean {
    if (ctx.classId !== classId) return false;
    return this.isClassManager(ctx.role);
  }

  /**
   * Normal users can NEVER delete or edit audit logs (Append-only).
   */
  static canMutateAuditLogs(): boolean {
    return false;
  }
}
