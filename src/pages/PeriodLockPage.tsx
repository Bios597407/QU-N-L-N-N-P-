import React, { useState } from 'react';
import { appState } from '../services/appStateService';
import { StatusBadge } from '../components/StatusBadge';
import { Lock, Unlock, AlertTriangle, ShieldCheck, CheckCircle2, History } from 'lucide-react';

export const PeriodLockPage: React.FC = () => {
  const currentUser = appState.currentUser;
  const isOfficer = currentUser.isAuthenticatedOfficer;

  if (!isOfficer) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm max-w-lg mx-auto text-center space-y-4 my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900">
          Chốt sổ & Khóa kỳ đánh giá (Chỉ GVCN)
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Thao tác khóa kỳ và niêm phong điểm rèn luyện chỉ dành cho Giáo viên Chủ nhiệm (GVCN). Vui lòng đăng nhập tài khoản GVCN để truy cập.
        </p>
      </div>
    );
  }

  const canManageLock =
    currentUser.role === 'gvcn' ||
    currentUser.role === 'lop_truong' ||
    currentUser.role === 'lop_pho';

  const [periodType, setPeriodType] = useState<'week' | 'month' | 'semester'>('week');
  const [periodId, setPeriodId] = useState('W01');
  const [reopenReason, setReopenReason] = useState('');
  const [showReopenModal, setShowReopenModal] = useState(false);

  const lockKey = `${periodType}-${periodId}`;
  const isCurrentlyLocked = Boolean(appState.periodLocks[lockKey]?.is_locked);

  const checkResult = appState.canLockPeriod(periodType, periodId);

  const handleLock = () => {
    const res = appState.lockPeriod(periodType, periodId);
    if (!res.success) {
      appState.showToast(res.message, 'error');
    } else {
      appState.showToast(res.message, 'success');
    }
  };

  const handleReopen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;

    const res = appState.reopenPeriod(periodType, periodId, reopenReason.trim());
    appState.showToast(res.message, res.success ? 'success' : 'error');
    setShowReopenModal(false);
    setReopenReason('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Khóa & Mở Kỳ Đánh giá Nề nếp
          </h2>
          <p className="text-xs text-slate-500">
            Chốt dữ liệu chính thức ngăn chặn chỉnh sửa tùy tiện • Ghi vết sự kiện đầy đủ
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
          Thẩm quyền: Chỉ GVCN được phép thực hiện
        </div>
      </div>

      {/* Control Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 max-w-xl">
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">Chọn Kỳ cần kiểm soát:</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Loại kỳ</span>
              <select
                value={periodType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setPeriodType(val);
                  setPeriodId(val === 'week' ? 'W01' : val === 'month' ? 'M09' : 'HK1');
                }}
                className="w-full text-xs p-2.5 border rounded-xl border-slate-300 font-semibold"
              >
                <option value="week">Theo Tuần</option>
                <option value="month">Theo Tháng</option>
                <option value="semester">Theo Học kỳ</option>
              </select>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Mã kỳ</span>
              <select
                value={periodId}
                onChange={(e) => setPeriodId(e.target.value)}
                className="w-full text-xs p-2.5 border rounded-xl border-slate-300 font-semibold text-blue-700 font-mono"
              >
                {periodType === 'week' ? (
                  [1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                    <option key={w} value={`W${w.toString().padStart(2, '0')}`}>
                      Tuần {w} (W{w.toString().padStart(2, '0')})
                    </option>
                  ))
                ) : periodType === 'month' ? (
                  ['M09', 'M10', 'M11', 'M12'].map((m) => (
                    <option key={m} value={m}>
                      Tháng {m.slice(1)} ({m})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="HK1">Học kỳ I (HK1)</option>
                    <option value="HK2">Học kỳ II (HK2)</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Current status display */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-medium">Trạng thái hiện tại của [{lockKey}]</div>
            <div className="text-base font-black text-slate-900 mt-0.5">
              {isCurrentlyLocked ? 'ĐÃ KHÓA DỮ LIỆU CHÍNH THỨC' : 'ĐANG MỞ (CHO PHÉP CẬP NHẬT)'}
            </div>
          </div>
          <StatusBadge type={isCurrentlyLocked ? 'locked' : 'Đã duyệt'} label={isCurrentlyLocked ? 'Đã khóa' : 'Đang mở'} />
        </div>

        {/* Check blockers before lock */}
        {!isCurrentlyLocked && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700">Điều kiện kiểm tra an toàn trước khi khóa:</div>
            {checkResult.canLock ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đủ điều kiện: Không còn sự việc, khen thưởng hay quy tắc nào đang treo dở dang.</span>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Chặn thao tác khóa vì tồn tại dữ liệu chưa giải quyết:
                </div>
                {checkResult.blockers.map((b, idx) => (
                  <div key={idx} className="text-[11px] ml-5">• {b}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action button */}
        <div className="pt-2">
          {isCurrentlyLocked ? (
            <button
              onClick={() => setShowReopenModal(true)}
              disabled={!canManageLock}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center gap-2 shadow-sm transition active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              Mở khóa lại kỳ này (Yêu cầu giải trình)
            </button>
          ) : (
            <button
              onClick={handleLock}
              disabled={!checkResult.canLock || !canManageLock}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-sm transition active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              Tiến hành khóa chính thức
            </button>
          )}
        </div>
      </div>

      {/* Reopen Modal */}
      {showReopenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Mở khóa lại kỳ đánh giá [{lockKey}]</h3>
            <p className="text-xs text-slate-600">
              Hành động mở khóa sẽ được lưu vĩnh viễn vào nhật ký kiểm toán (Audit Logs) kèm lý do giải trình.
            </p>
            <form onSubmit={handleReopen} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lý do mở khóa lại (Bắt buộc)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi rõ căn cứ (Ví dụ: Tiếp nhận đơn khiếu nại có xác nhận của phụ huynh; Hiệu chỉnh sai sót điểm danh...)"
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  className="w-full p-2.5 border rounded-xl border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReopenModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-lg shadow-sm"
                >
                  Xác nhận mở khóa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
