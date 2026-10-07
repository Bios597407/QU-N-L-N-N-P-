import { describe, it, expect } from 'vitest';
import { AuthorizationEngine, AuthContext } from '../src/domain/auth/authorizationEngine';

describe('Authorization Engine Tests - Role Based Access Control', () => {
  const gvcnUser: AuthContext = {
    userId: 'u-gvcn',
    classId: 'class-10a16',
    role: 'gvcn',
  };

  const studentA: AuthContext = {
    userId: 'u-stu-01',
    classId: 'class-10a16',
    studentId: 'stu-10a16-01',
    role: 'hoc_sinh',
  };

  const studentBId = 'stu-10a16-02';

  const toTruongGroup1: AuthContext = {
    userId: 'u-to-01',
    classId: 'class-10a16',
    studentId: 'stu-10a16-01',
    role: 'to_truong',
    groupId: 'group-01',
  };

  const lopTruong: AuthContext = {
    userId: 'u-lt',
    classId: 'class-10a16',
    role: 'lop_truong',
  };

  it('Student A cannot read Student B private information', () => {
    const canView = AuthorizationEngine.canViewStudentPrivateDetails(studentA, studentBId, 'class-10a16');
    expect(canView).toBe(false);
  });

  it('Student A CAN read Student A own information', () => {
    const canView = AuthorizationEngine.canViewStudentPrivateDetails(studentA, studentA.studentId!, 'class-10a16');
    expect(canView).toBe(true);
  });

  it('Tổ trưởng cannot modify another group', () => {
    const canManageGroup2 = AuthorizationEngine.canManageGroup(toTruongGroup1, 'group-02');
    expect(canManageGroup2).toBe(false);

    const canManageGroup1 = AuthorizationEngine.canManageGroup(toTruongGroup1, 'group-01');
    expect(canManageGroup1).toBe(true);
  });

  it('GVCN, Lớp trưởng, and Lớp phó can approve incident score effect (Students and Tổ trưởng cannot)', () => {
    const lopPho: AuthContext = { userId: 'u-lp', classId: 'class-10a16', role: 'lop_pho' };
    expect(AuthorizationEngine.canApproveIncident(lopTruong, 'class-10a16')).toBe(true);
    expect(AuthorizationEngine.canApproveIncident(lopPho, 'class-10a16')).toBe(true);
    expect(AuthorizationEngine.canApproveIncident(gvcnUser, 'class-10a16')).toBe(true);
    expect(AuthorizationEngine.canApproveIncident(studentA, 'class-10a16')).toBe(false);
    expect(AuthorizationEngine.canApproveIncident(toTruongGroup1, 'class-10a16')).toBe(false);
  });

  it('GVCN, Lớp trưởng, and Lớp phó can finalize semester conduct', () => {
    expect(AuthorizationEngine.canFinalizeSemester(lopTruong, 'class-10a16')).toBe(true);
    expect(AuthorizationEngine.canFinalizeSemester(studentA, 'class-10a16')).toBe(false);
    expect(AuthorizationEngine.canFinalizeSemester(toTruongGroup1, 'class-10a16')).toBe(false);
    expect(AuthorizationEngine.canFinalizeSemester(gvcnUser, 'class-10a16')).toBe(true);
  });

  it('Unauthorized user (Students and Tổ trưởng) cannot reopen locked period, while GVCN, Lớp trưởng, Lớp phó can', () => {
    expect(AuthorizationEngine.canReopenPeriod(studentA, 'class-10a16')).toBe(false);
    expect(AuthorizationEngine.canReopenPeriod(toTruongGroup1, 'class-10a16')).toBe(false);
    expect(AuthorizationEngine.canReopenPeriod(lopTruong, 'class-10a16')).toBe(true);
    expect(AuthorizationEngine.canReopenPeriod(gvcnUser, 'class-10a16')).toBe(true);
  });

  it('Normal users cannot update or delete audit history', () => {
    expect(AuthorizationEngine.canMutateAuditLogs()).toBe(false);
  });

  it('Role in one class gives no privilege in another class', () => {
    const canApproveOtherClass = AuthorizationEngine.canApproveIncident(gvcnUser, 'class-10a17');
    expect(canApproveOtherClass).toBe(false);
  });

  it('Gmail and PIN Authentication controls officer access and student view-only mode', async () => {
    const { appState } = await import('../src/services/appStateService');

    // Default or logout puts user in student mode
    appState.logoutToStudentMode();
    expect(appState.currentUser.role).toBe('hoc_sinh');
    expect(appState.canManageConduct()).toBe(false);

    // Authentication with unknown email fails
    const failRes = appState.authenticateWithGmail('unknown_student@gmail.com');
    expect(failRes.success).toBe(false);
    expect(appState.currentUser.role).toBe('hoc_sinh');

    // Authentication with GVCN authorized Gmail succeeds
    const gvcnRes = appState.authenticateWithGmail('tranduytan.gvcn@gmail.com');
    expect(gvcnRes.success).toBe(true);
    expect(appState.currentUser.role).toBe('gvcn');
    expect(appState.canManageConduct()).toBe(true);

    // Logout locks back to Student mode
    appState.logoutToStudentMode();
    expect(appState.currentUser.role).toBe('hoc_sinh');
    expect(appState.canManageConduct()).toBe(false);

    // Authentication with Lớp trưởng PIN succeeds
    const ltPinRes = appState.authenticateWithPin('lop_truong', '10A16lt');
    expect(ltPinRes.success).toBe(true);
    expect(appState.currentUser.role).toBe('lop_truong');
    expect(appState.canManageConduct()).toBe(true);

    // Wrong PIN fails
    const wrongPin = appState.authenticateWithPin('lop_pho', 'sai_mat_khau');
    expect(wrongPin.success).toBe(false);
  });
});
