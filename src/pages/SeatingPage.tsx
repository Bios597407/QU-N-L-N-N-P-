import React, { useState } from 'react';
import { appState } from '../services/appStateService';
import { Student, Seat } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  MapPin,
  User,
  Info,
  X,
  CalendarCheck,
  Award,
  AlertTriangle,
  ArrowRightLeft,
  UserPlus,
  Trash2,
  Check,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';

export const SeatingPage: React.FC = () => {
  const seats = appState.seats;
  const students = appState.students;
  const currentUser = appState.currentUser;

  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // Seat Action Modal mode: 'inspect' | 'assign' | 'swap'
  const [seatActionTab, setSeatActionTab] = useState<'inspect' | 'assign' | 'swap'>('inspect');

  // Form states
  const [selectedStudentForSeat, setSelectedStudentForSeat] = useState<string>('');
  const [targetSwapSeatId, setTargetSwapSeatId] = useState<string>('');

  // Permission: GVCN, Lớp phó, Lớp trưởng có toàn quyền điều chỉnh sơ đồ chỗ ngồi
  const canManageSeating =
    currentUser.role === 'gvcn' ||
    currentUser.role === 'lop_truong' ||
    currentUser.role === 'lop_pho';

  const handleOpenSeat = (seat: Seat) => {
    setSelectedSeat(seat);
    const stu = students.find((s) => s.id === seat.student_id);
    if (stu) {
      setSeatActionTab('inspect');
    } else {
      setSeatActionTab('assign');
    }
    // Default pick an unseated student or first student
    const unseated = students.find((s) => !seats.some((st) => st.student_id === s.id));
    setSelectedStudentForSeat(unseated?.id || students[0]?.id || '');
    // Default swap target
    const otherSeat = seats.find((s) => s.id !== seat.id);
    setTargetSwapSeatId(otherSeat?.id || '');
  };

  const handleAssignStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat) return;

    appState.assignStudentToSeat(selectedSeat.id, selectedStudentForSeat || undefined);
    const stu = students.find((s) => s.id === selectedStudentForSeat);
    appState.showToast(
      selectedStudentForSeat
        ? `Đã xếp học sinh ${stu?.full_name} vào Bàn ${selectedSeat.table_number}!`
        : `Đã làm trống Bàn ${selectedSeat.table_number}!`,
      'success'
    );
    setSelectedSeat(null);
  };

  const handleSwapSeats = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat || !targetSwapSeatId) return;

    const targetSeat = seats.find((s) => s.id === targetSwapSeatId);
    appState.swapSeats(selectedSeat.id, targetSwapSeatId);
    appState.showToast(
      `Đã hoán đổi vị trí giữa Bàn ${selectedSeat.table_number} và Bàn ${targetSeat?.table_number}!`,
      'success'
    );
    setSelectedSeat(null);
  };

  const handleVacateSeat = () => {
    if (!selectedSeat) return;
    appState.assignStudentToSeat(selectedSeat.id, undefined);
    appState.showToast(`Đã hủy xếp chỗ tại Bàn ${selectedSeat.table_number}!`, 'info');
    setSelectedSeat(null);
  };

  const handleAutoArrange = (method: 'by_group' | 'by_roster') => {
    if (confirm(`Bạn có chắc muốn tự động sắp xếp lại chỗ ngồi ${method === 'by_group' ? 'theo Tổ học tập' : 'theo STT Danh sách'} không?`)) {
      appState.autoArrangeSeats(method);
      appState.showToast(
        `Đã tự động sắp xếp lại sơ đồ chỗ ngồi ${method === 'by_group' ? 'theo 4 Tổ' : 'theo danh sách 43 HS'}!`,
        'success'
      );
    }
  };

  const seatStudent = selectedSeat ? students.find((s) => s.id === selectedSeat.student_id) : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Sơ đồ Chỗ ngồi Lớp 10A16</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
              6 Dãy bàn · 24 Chỗ
            </span>
            {canManageSeating && (
              <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-100 text-emerald-800 hidden sm:inline">
                GVCN: Toàn quyền điều chỉnh
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sơ đồ bố trí chỗ ngồi phục vụ kỷ luật nề nếp (Mã lỗi V06: Ngồi sai sơ đồ) • THPT Võ Trường Toản
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManageSeating && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAutoArrange('by_group')}
                className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
                title="Sắp xếp học sinh theo tổ 1, 2, 3, 4"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Xếp theo Tổ</span>
              </button>
              <button
                onClick={() => handleAutoArrange('by_roster')}
                className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
                title="Sắp xếp học sinh theo thứ tự STT"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Xếp theo STT</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Click vào bàn để {canManageSeating ? 'điều chỉnh' : 'xem'}</span>
          </div>
        </div>
      </div>

      {/* Classroom Teacher Podium */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="max-w-md mx-auto py-2.5 bg-slate-900 text-white rounded-xl text-center text-xs font-bold uppercase tracking-widest shadow-inner border border-slate-800 flex items-center justify-center gap-2">
          <span>BỤC GIẢNG & BẢNG LỚP HỌC (GV BỘ MÔN / GVCN)</span>
        </div>

        {/* Seating Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {seats.map((seat) => {
            const student = students.find((s) => s.id === seat.student_id);
            const snap = student
              ? appState.weeklySnapshots.find((s) => s.student_id === student.id && s.is_current)
              : null;
            const group = student ? appState.groups.find((g) => g.id === student.group_id) : null;

            return (
              <div
                key={seat.id}
                onClick={() => handleOpenSeat(seat)}
                className={`p-3 sm:p-3.5 rounded-xl border transition text-xs flex flex-col justify-between min-h-[100px] cursor-pointer active:scale-[0.98] ${
                  student
                    ? 'bg-blue-50/40 border-blue-200 hover:border-blue-400 hover:shadow-xs'
                    : 'bg-slate-50/60 border-dashed border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                  <span>H.{seat.row_number} - D.{seat.col_number <= 2 ? 1 : 2}</span>
                  <span className="font-bold text-slate-600 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                    Bàn {seat.table_number}
                  </span>
                </div>

                {student ? (
                  <div>
                    <div className="font-bold text-slate-900 text-xs truncate">{student.full_name}</div>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="font-mono text-blue-700 font-semibold">{student.student_code}</span>
                      <span className="text-slate-500 font-medium">
                        {group ? `Tổ ${group.group_number}` : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 text-center py-2 italic text-[11px] flex items-center justify-center gap-1">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Chỗ trống</span>
                  </div>
                )}

                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{canManageSeating ? 'Chạm để sửa' : 'Chạm xem'}</span>
                  {student && snap && (
                    <span className="font-bold text-blue-700 font-mono">{snap.official_week_score}đ</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-center">
          <strong>Nội quy QĐ 525 Mã 06:</strong> Học sinh ngồi sai vị trí sơ đồ lớp trong giờ học khi chưa được phép của giáo viên sẽ bị xem xét vi phạm nề nếp (-2 điểm). GVCN có toàn quyền sắp xếp lại chỗ ngồi.
        </div>
      </div>

      {/* Seat Inspector / Edit Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  Bàn học số {selectedSeat.table_number} (Hàng {selectedSeat.row_number})
                </h3>
                <p className="text-xs text-slate-300">
                  {seatStudent ? `Hiện tại: ${seatStudent.full_name}` : 'Bàn đang để trống'}
                </p>
              </div>
              <button
                onClick={() => setSelectedSeat(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs for GVCN / Managers */}
            {canManageSeating && (
              <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-bold">
                {seatStudent && (
                  <button
                    type="button"
                    onClick={() => setSeatActionTab('inspect')}
                    className={`pb-2.5 px-3 border-b-2 transition cursor-pointer ${
                      seatActionTab === 'inspect'
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Xem hồ sơ
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSeatActionTab('assign')}
                  className={`pb-2.5 px-3 border-b-2 transition cursor-pointer ${
                    seatActionTab === 'assign'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {seatStudent ? 'Đổi học sinh' : 'Xếp học sinh vào bàn'}
                </button>
                {seatStudent && (
                  <button
                    type="button"
                    onClick={() => setSeatActionTab('swap')}
                    className={`pb-2.5 px-3 border-b-2 transition cursor-pointer flex items-center gap-1 ${
                      seatActionTab === 'swap'
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Hoán đổi chỗ</span>
                  </button>
                )}
              </div>
            )}

            {/* TAB 1: Inspect (view student status) */}
            {seatActionTab === 'inspect' && seatStudent && (
              <div className="p-5 space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{seatStudent.full_name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">Mã số: {seatStudent.student_code}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-blue-700 text-base font-mono">
                      {appState.weeklySnapshots.find((s) => s.student_id === seatStudent.id && s.is_current)?.official_week_score ?? 8.0}đ
                    </span>
                    <div className="text-[10px] text-slate-400">Điểm tuần này</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 bg-rose-50 text-rose-900 rounded-xl border border-rose-200">
                    <div className="text-[10px] text-rose-600 font-semibold">Vi phạm</div>
                    <div className="font-bold text-sm">
                      {appState.incidents.filter((i) => i.student_id === seatStudent.id).length} vụ
                    </div>
                  </div>
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
                    <div className="text-[10px] text-emerald-600 font-semibold">Khen thưởng</div>
                    <div className="font-bold text-sm">
                      {appState.rewards.filter((r) => r.student_id === seatStudent.id).length} lần
                    </div>
                  </div>
                </div>

                {canManageSeating && (
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleVacateSeat}
                      className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hủy gán (Làm trống bàn)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeatActionTab('assign')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Đổi học sinh ngồi bàn này
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Assign Student to this Seat */}
            {seatActionTab === 'assign' && canManageSeating && (
              <form onSubmit={handleAssignStudent} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Chọn học sinh xếp vào Bàn {selectedSeat.table_number}:
                  </label>
                  <select
                    value={selectedStudentForSeat}
                    onChange={(e) => setSelectedStudentForSeat(e.target.value)}
                    className="w-full p-2.5 border rounded-xl border-slate-300 text-xs"
                  >
                    <option value="">-- Để trống bàn này --</option>
                    {students.map((stu) => {
                      const curSeat = seats.find((s) => s.student_id === stu.id);
                      return (
                        <option key={stu.id} value={stu.id}>
                          {stu.student_code} - {stu.full_name} {curSeat ? `(Đang ở Bàn ${curSeat.table_number})` : '(Chưa có bàn)'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedSeat(null)}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Lưu xếp chỗ</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: Swap Seats with Another Seat */}
            {seatActionTab === 'swap' && canManageSeating && (
              <form onSubmit={handleSwapSeats} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Hoán đổi Bàn {selectedSeat.table_number} ({seatStudent?.full_name}) với:
                  </label>
                  <select
                    value={targetSwapSeatId}
                    onChange={(e) => setTargetSwapSeatId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl border-slate-300 text-xs"
                  >
                    {seats
                      .filter((s) => s.id !== selectedSeat.id)
                      .map((s) => {
                        const targetStu = students.find((st) => st.id === s.student_id);
                        return (
                          <option key={s.id} value={s.id}>
                            Bàn {s.table_number} - {targetStu ? targetStu.full_name : '(Chỗ trống)'}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedSeat(null)}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Xác nhận hoán đổi chỗ</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
