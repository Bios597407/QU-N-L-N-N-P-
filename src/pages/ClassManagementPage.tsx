import React, { useState } from 'react';
import { appState, ClassInfo } from '../services/appStateService';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Edit3,
  Check,
  X,
  Phone,
  Mail,
  Award,
  BookOpen,
  Sparkles,
  Lock,
  ArrowRight,
  School,
  AlertCircle,
  HelpCircle,
  Flag,
} from 'lucide-react';
import { NavTab } from '../components/Sidebar';

interface Props {
  onNavigate?: (tab: NavTab) => void;
  onOpenAuthModal?: () => void;
}

export const ClassManagementPage: React.FC<Props> = ({ onNavigate, onOpenAuthModal }) => {
  const currentUser = appState.currentUser;
  const students = appState.students;
  const groups = appState.groups;
  const classInfo = appState.classInfo;

  // Permission: GVCN, Lớp phó, Lớp trưởng có toàn quyền điều chỉnh nội dung quản lý lớp học
  const canManageClass =
    currentUser.role === 'gvcn' ||
    currentUser.role === 'lop_truong' ||
    currentUser.role === 'lop_pho';

  if (!currentUser.isAuthenticatedOfficer) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm max-w-lg mx-auto text-center space-y-4 my-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 shadow-xs">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900">
          Khu vực Quản lý Lớp & Ban Cán sự
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Hồ sơ ban cán sự và thông tin liên lạc nội bộ của giáo viên/cán bộ lớp chỉ dành riêng cho Ban Quản lý. Vui lòng đăng nhập để mở khóa truy cập.
        </p>
        {onOpenAuthModal && (
          <button
            onClick={onOpenAuthModal}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Đăng nhập Cán sự / GVCN</span>
          </button>
        )}
      </div>
    );
  }

  // Edit Class Info Modal
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState<ClassInfo>({ ...classInfo });

  // Edit Officers Modal
  const [isEditingOfficers, setIsEditingOfficers] = useState(false);
  const [officerForm, setOfficerForm] = useState({
    gvcn_name: classInfo.gvcn_name,
    gvcn_email: classInfo.gvcn_email,
    gvcn_phone: classInfo.gvcn_phone,
    class_president_name: classInfo.class_president_name,
    class_vice_discipline_name: classInfo.class_vice_discipline_name,
    class_vice_academic_name: classInfo.class_vice_academic_name,
    secretary_name: classInfo.secretary_name,
  });

  const handleOpenEditInfo = () => {
    setEditForm({ ...appState.classInfo });
    setIsEditingInfo(true);
  };

  const handleSaveEditInfo = (e: React.FormEvent) => {
    e.preventDefault();
    appState.updateClassInfo(editForm);
    appState.showToast('Đã lưu thay đổi thông tin quản lý Lớp 10A16 thành công!', 'success');
    setIsEditingInfo(false);
  };

  const handleOpenEditOfficers = () => {
    setOfficerForm({
      gvcn_name: classInfo.gvcn_name,
      gvcn_email: classInfo.gvcn_email,
      gvcn_phone: classInfo.gvcn_phone,
      class_president_name: classInfo.class_president_name,
      class_vice_discipline_name: classInfo.class_vice_discipline_name,
      class_vice_academic_name: classInfo.class_vice_academic_name,
      secretary_name: classInfo.secretary_name,
    });
    setIsEditingOfficers(true);
  };

  const handleSaveOfficers = (e: React.FormEvent) => {
    e.preventDefault();
    appState.updateClassInfo(officerForm);
    appState.showToast('Đã cập nhật danh sách Ban Cán Sự Lớp 10A16!', 'success');
    setIsEditingOfficers(false);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Quản lý Lớp học & Ban Cán sự
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
              {classInfo.class_name} · Sĩ số {students.length}
            </span>
            {canManageClass ? (
              <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800 hidden sm:inline">
                GVCN: Toàn quyền điều chỉnh
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-amber-100 text-amber-900 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Học sinh: Chỉ xem</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {classInfo.school_name} • Năm học {classInfo.academic_year} • Phòng: {classInfo.room_number} • GVCN: {classInfo.gvcn_name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageClass ? (
            <button
              onClick={handleOpenEditInfo}
              className="px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa thông tin lớp</span>
            </button>
          ) : (
            onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>Đăng nhập để điều chỉnh</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Permission Reminder for Students */}
      {!canManageClass && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Chế độ Học sinh (Chỉ xem):</strong> Bạn không có quyền chỉnh sửa nội dung này. Chỉ GVCN (Thầy Tân), Lớp trưởng và Lớp phó mới có quyền thay đổi thông tin lớp học và nề nếp.
            </span>
          </div>
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shrink-0 cursor-pointer text-xs"
            >
              Đăng nhập Cán bộ
            </button>
          )}
        </div>
      )}

      {/* Grid: Overview & Officers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Class Profile Card */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Hồ sơ Thông tin Lớp học</h3>
              </div>
              {canManageClass && (
                <button
                  onClick={handleOpenEditInfo}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa thông tin</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Trường THPT</span>
                <span className="font-bold text-slate-800 text-sm">{classInfo.school_name}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Lớp & Niên khóa</span>
                <span className="font-bold text-slate-800 text-sm">
                  {classInfo.class_name} · Năm học {classInfo.academic_year}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Phòng học cố định</span>
                <span className="font-bold text-slate-800 text-sm">{classInfo.room_number}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[11px] block">Sĩ số học sinh chính thức</span>
                <span className="font-bold text-blue-700 text-sm">
                  {students.length} học sinh (100% hồ sơ thực tế)
                </span>
              </div>
            </div>

            {/* Slogan & Goals */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-xl border border-blue-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-blue-950">
                <Flag className="w-4 h-4 text-blue-700" />
                <span>Khẩu hiệu & Phương châm rèn luyện Lớp 10A16:</span>
              </div>
              <p className="text-blue-900 font-semibold italic text-sm">
                &ldquo;{classInfo.slogan}&rdquo;
              </p>
              <div className="pt-2 border-t border-blue-200/60 text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                <span>Chỉ tiêu điểm rèn luyện tuần tối thiểu: <strong>{classInfo.target_conduct_points}/10 điểm</strong></span>
                <span className="text-emerald-700 font-semibold">Áp dụng QĐ 525/QĐ-THPT.VTT</span>
              </div>
            </div>

            {/* Teacher Directive */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700 block">Định hướng rèn luyện của GVCN:</span>
              <p className="text-slate-600 leading-relaxed">{classInfo.notes}</p>
            </div>
          </div>

          {/* Quick Sub-navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => onNavigate && onNavigate('students')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Danh sách học sinh</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-black text-slate-900">{students.length} HS</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Quản lý 43 hồ sơ</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>

            <div
              onClick={() => onNavigate && onNavigate('groups')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Tổ học tập tự quản</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-black text-slate-900">{groups.length} Tổ</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Phân công nề nếp</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>

            <div
              onClick={() => onNavigate && onNavigate('seating')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Sơ đồ chỗ ngồi</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-slate-900">24 Bàn học</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Bố trí 2 dãy</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Class Officers Card */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Ban Cán Sự Lớp 10A16</h3>
              </div>
              {canManageClass && (
                <button
                  onClick={handleOpenEditOfficers}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉ định</span>
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {/* GVCN */}
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                    Giáo viên Chủ nhiệm (GVCN)
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{classInfo.gvcn_name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {classInfo.gvcn_email}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-600 text-white rounded-md">
                  Toàn quyền
                </span>
              </div>

              {/* Lớp trưởng */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Lớp trưởng
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {classInfo.class_president_name}
                  </div>
                  <div className="text-[10px] text-slate-400">Phụ trách chung toàn lớp</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                  Ban Cán Sự
                </span>
              </div>

              {/* Lớp phó Kỷ luật */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    Lớp phó Kỷ luật & Nề nếp
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {classInfo.class_vice_discipline_name}
                  </div>
                  <div className="text-[10px] text-slate-400">Quản lý vi phạm & chấm điểm nề nếp</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                  Ban Cán Sự
                </span>
              </div>

              {/* Lớp phó Học tập */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Lớp phó Học tập
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {classInfo.class_vice_academic_name}
                  </div>
                  <div className="text-[10px] text-slate-400">Theo dõi học vụ & bài tập</div>
                </div>
              </div>

              {/* Bí thư */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Bí thư Chi đoàn
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {classInfo.secretary_name}
                  </div>
                  <div className="text-[10px] text-slate-400">Phong trào Đoàn thanh niên</div>
                </div>
              </div>

              {/* 4 Tổ trưởng */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  4 Tổ trưởng Tự quản:
                </div>
                {groups.map((g) => {
                  const leader = students.find((s) => s.id === g.leader_student_id);
                  return (
                    <div key={g.id} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 last:border-0">
                      <span className="font-semibold text-slate-700">Tổ {g.group_number}:</span>
                      <span className="font-bold text-slate-900">{leader ? leader.full_name : 'Chưa gán'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Edit Class Info */}
      {isEditingInfo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Chỉnh sửa Thông tin Lớp học</h3>
                <p className="text-xs text-slate-300">GVCN có toàn quyền điều chỉnh nội dung</p>
              </div>
              <button
                onClick={() => setIsEditingInfo(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditInfo} className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên trường</label>
                  <input
                    type="text"
                    required
                    value={editForm.school_name}
                    onChange={(e) => setEditForm({ ...editForm, school_name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tên lớp</label>
                  <input
                    type="text"
                    required
                    value={editForm.class_name}
                    onChange={(e) => setEditForm({ ...editForm, class_name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Năm học</label>
                  <input
                    type="text"
                    required
                    value={editForm.academic_year}
                    onChange={(e) => setEditForm({ ...editForm, academic_year: e.target.value })}
                    className="w-full p-2.5 border rounded-xl border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phòng học</label>
                  <input
                    type="text"
                    required
                    value={editForm.room_number}
                    onChange={(e) => setEditForm({ ...editForm, room_number: e.target.value })}
                    className="w-full p-2.5 border rounded-xl border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Khẩu hiệu / Slogan lớp</label>
                <input
                  type="text"
                  required
                  value={editForm.slogan}
                  onChange={(e) => setEditForm({ ...editForm, slogan: e.target.value })}
                  className="w-full p-2.5 border rounded-xl border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chỉ tiêu điểm rèn luyện bình quân tuần</label>
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="10"
                  required
                  value={editForm.target_conduct_points}
                  onChange={(e) => setEditForm({ ...editForm, target_conduct_points: parseFloat(e.target.value) || 8.0 })}
                  className="w-full p-2.5 border rounded-xl border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Định hướng & Ghi chú rèn luyện</label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full p-2.5 border rounded-xl border-slate-300"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu thông tin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Officers */}
      {isEditingOfficers && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Chỉ định Ban Cán Sự Lớp 10A16</h3>
                <p className="text-xs text-slate-300">Phân công nhân sự điều hành lớp</p>
              </div>
              <button
                onClick={() => setIsEditingOfficers(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOfficers} className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 space-y-2">
                <div className="font-bold text-xs">Thông tin GVCN:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Họ và tên GVCN</label>
                    <input
                      type="text"
                      required
                      value={officerForm.gvcn_name}
                      onChange={(e) => setOfficerForm({ ...officerForm, gvcn_name: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Email GVCN (Gmail)</label>
                    <input
                      type="email"
                      required
                      value={officerForm.gvcn_email}
                      onChange={(e) => setOfficerForm({ ...officerForm, gvcn_email: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white border-slate-300 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lớp trưởng</label>
                <select
                  value={officerForm.class_president_name}
                  onChange={(e) => setOfficerForm({ ...officerForm, class_president_name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl border-slate-300"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.full_name}>
                      {s.student_code} - {s.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lớp phó Kỷ luật & Nề nếp</label>
                <select
                  value={officerForm.class_vice_discipline_name}
                  onChange={(e) => setOfficerForm({ ...officerForm, class_vice_discipline_name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl border-slate-300"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.full_name}>
                      {s.student_code} - {s.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lớp phó Học tập</label>
                <select
                  value={officerForm.class_vice_academic_name}
                  onChange={(e) => setOfficerForm({ ...officerForm, class_vice_academic_name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl border-slate-300"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.full_name}>
                      {s.student_code} - {s.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bí thư Chi đoàn</label>
                <select
                  value={officerForm.secretary_name}
                  onChange={(e) => setOfficerForm({ ...officerForm, secretary_name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl border-slate-300"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.full_name}>
                      {s.student_code} - {s.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingOfficers(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Ban Cán Sự</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
