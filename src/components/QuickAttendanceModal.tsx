import React, { useState } from 'react';
import { appState } from '../services/appStateService';
import { AttendanceStatus } from '../types';
import { X, CheckCircle, Clock, AlertTriangle, ShieldCheck, Users, User, Check, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAttendanceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const students = appState.students;
  const [mode, setMode] = useState<'batch' | 'single'>('batch');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState<'morning' | 'afternoon'>('morning');

  // Single mode state
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [status, setStatus] = useState<AttendanceStatus>('present');
  const [arrivalTime, setArrivalTime] = useState('');
  const [reason, setReason] = useState('');
  const [isLegitimate, setIsLegitimate] = useState(false);
  const [exceptionReason, setExceptionReason] = useState('');
  const [vneduRef, setVneduRef] = useState('');

  // Batch mode state: studentId -> AttendanceStatus
  const [batchStatus, setBatchStatus] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      initial[s.id] = 'present';
    });
    return initial;
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warn' } | null>(null);

  if (!isOpen) return null;

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      updated[s.id] = 'present';
    });
    setBatchStatus(updated);
  };

  const handleToggleStudentStatus = (studentId: string) => {
    const current = batchStatus[studentId] || 'present';
    const cycle: AttendanceStatus[] = ['present', 'permitted_absence', 'unpermitted_absence', 'late'];
    const nextIdx = (cycle.indexOf(current) + 1) % cycle.length;
    setBatchStatus((prev) => ({ ...prev, [studentId]: cycle[nextIdx] }));
  };

  const handleBatchSave = () => {
    let savedCount = 0;
    const classId = 'class-10a16';

    students.forEach((s) => {
      const st = batchStatus[s.id] || 'present';
      appState.recordAttendance({
        student_id: s.id,
        class_id: classId,
        date,
        session,
        status: st,
        is_legitimate_exception: false,
      });
      savedCount++;
    });

    setNotification({
      message: `Đã lưu điểm danh buổi ${session === 'morning' ? 'Sáng' : 'Chiều'} cho toàn bộ ${savedCount} học sinh!`,
      type: 'success',
    });

    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 1200);
  };

  const handleSingleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    let lateWarning = '';
    if (status === 'late' && arrivalTime) {
      const threshold = session === 'morning' ? '06:50' : '12:50';
      if (arrivalTime > threshold) {
        lateWarning = ` (Đến sau mốc ${threshold}: vi phạm quy định giờ học)`;
      }
    }

    appState.recordAttendance({
      student_id: selectedStudentId,
      class_id: 'class-10a16',
      date,
      session,
      status,
      arrival_time: arrivalTime || undefined,
      reason: reason || undefined,
      is_legitimate_exception: isLegitimate,
      exception_reason: isLegitimate ? exceptionReason : undefined,
      vnedu_ref_number: vneduRef || undefined,
    });

    setNotification({
      message: `Đã ghi nhận điểm danh cho học sinh!${lateWarning}`,
      type: 'success',
    });

    setTimeout(() => {
      setNotification(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-sm sm:text-base">Điểm danh Lớp 10A16</h3>
            <p className="text-[11px] text-slate-300">Khung giờ QĐ 525 • Mốc trễ 06:50 / 12:50</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {notification && (
          <div
            className={`p-3 text-xs font-semibold flex items-center gap-2 shrink-0 ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-b border-amber-200'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            {notification.message}
          </div>
        )}

        {/* Date, Session & Mode Selector */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Ngày học</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border rounded-lg border-slate-300 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Buổi học</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value as any)}
                className="w-full text-xs px-2.5 py-1.5 border rounded-lg border-slate-300 bg-white font-semibold text-slate-800"
              >
                <option value="morning">Buổi sáng (06:45–10:40)</option>
                <option value="afternoon">Buổi chiều (12:45–16:40)</option>
              </select>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('batch')}
              className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition ${
                mode === 'batch' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Điểm danh cả lớp 1-chạm ({students.length} HS)
            </button>
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition ${
                mode === 'single' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Ghi chú chi tiết 1 học sinh
            </button>
          </div>
        </div>

        {/* Content Body */}
        {mode === 'batch' ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Quick action bar */}
            <div className="px-4 py-2 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-600 text-[11px]">
                Nhấn vào từng học sinh để chuyển: <strong>Có mặt &rarr; Phép &rarr; K.Phép &rarr; Trễ</strong>
              </span>
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-blue-700 font-bold rounded-lg border border-blue-200 text-[11px] shadow-2xs transition"
              >
                ✓ Đánh dấu tất cả Có mặt
              </button>
            </div>

            {/* Students fast-tick roster */}
            <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100">
              {students.map((stu, i) => {
                const st = batchStatus[stu.id] || 'present';
                let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                let label = 'Có mặt';
                if (st === 'permitted_absence') {
                  badgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
                  label = 'Vắng phép';
                } else if (st === 'unpermitted_absence') {
                  badgeClass = 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
                  label = 'Vắng K.phép';
                } else if (st === 'late') {
                  badgeClass = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
                  label = 'Đi trễ';
                }

                return (
                  <div
                    key={stu.id}
                    onClick={() => handleToggleStudentStatus(stu.id)}
                    className="min-h-[48px] py-2 px-2.5 flex items-center justify-between hover:bg-slate-50 rounded-xl cursor-pointer transition select-none active:bg-blue-50/60"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-slate-400 font-mono text-[11px] w-6 text-right tabular-nums">{i + 1}</span>
                      <div>
                        <div className="font-bold text-slate-800 text-xs">{stu.full_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{stu.student_code}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md border transition font-semibold ${badgeClass}`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer Save */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleBatchSave}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm transition active:scale-95"
              >
                Lưu điểm danh cả lớp
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSingleSave} className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Học sinh</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300 font-semibold"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.student_code} - {s.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái chuyên cần</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'present', label: 'Có mặt đầy đủ', color: 'border-emerald-300 text-emerald-800' },
                  { id: 'late', label: 'Đi học trễ', color: 'border-amber-300 text-amber-800' },
                  { id: 'permitted_absence', label: 'Vắng có phép', color: 'border-blue-300 text-blue-800' },
                  { id: 'unpermitted_absence', label: 'Vắng không phép', color: 'border-rose-300 text-rose-800' },
                  { id: 'absence_pending_verification', label: 'Chờ xác minh phép', color: 'border-purple-300 text-purple-800' },
                  { id: 'truancy', label: 'Trốn tiết / bỏ buổi', color: 'border-red-400 text-red-900' },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setStatus(opt.id as any)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition cursor-pointer min-h-[44px] flex items-center ${
                      status === opt.id
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-600/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {status === 'late' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giờ vào lớp (Mốc trễ: {session === 'morning' ? '06:50' : '12:50'})
                </label>
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300"
                />
              </div>
            )}

            {status === 'permitted_absence' && (
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-950">
                  <input
                    type="checkbox"
                    checked={isLegitimate}
                    onChange={(e) => setIsLegitimate(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  Miễn trừ chính đáng (Không tính trần khống chế Tốt)
                </label>
                <p className="text-[11px] text-blue-800">
                  Áp dụng: Nằm viện điều trị, tang chế gia đình, thi IELTS, thi ĐGNL hoặc lý do chính đáng GVCN xác nhận.
                </p>
                {isLegitimate && (
                  <input
                    type="text"
                    placeholder="Lý do miễn trừ cụ thể..."
                    value={exceptionReason}
                    onChange={(e) => setExceptionReason(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 border bg-white rounded-lg border-blue-300"
                  />
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mã hồ sơ xin phép VnEdu (nếu có)
              </label>
              <input
                type="text"
                placeholder="VD: VNEDU-2026-9042"
                value={vneduRef}
                onChange={(e) => setVneduRef(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú lý do</label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ghi chú thêm..."
                className="w-full text-xs px-3 py-2 border rounded-xl border-slate-300"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm transition active:scale-95"
              >
                Lưu điểm danh
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
