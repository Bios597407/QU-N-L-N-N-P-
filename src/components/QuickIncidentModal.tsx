import React, { useState } from 'react';
import { appState } from '../services/appStateService';
import { OFFICIAL_CONDUCT_CATALOG } from '../domain/incidents/conductCatalog';
import { X, AlertCircle, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickIncidentModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const students = appState.students;
  const currentUser = appState.currentUser;

  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [selectedCode, setSelectedCode] = useState<string>('01'); // '01'..'24' or 'OTHER'
  const [otherDescription, setOtherDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState<'morning' | 'afternoon'>('morning');
  const [period, setPeriod] = useState<number>(1);
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // Special checks
  const [phoneTeacherAllowed, setPhoneTeacherAllowed] = useState<boolean | null>(null);
  const [v15TeacherAllowed, setV15TeacherAllowed] = useState<boolean | null>(null);

  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'warn' | 'error' } | null>(null);

  if (!isOpen) return null;

  const isOther = selectedCode === 'OTHER';
  const isV24 = selectedCode === '24';
  const isV15 = selectedCode === '15';
  const isV09 = selectedCode === '09';

  const selectedCatalogItem = OFFICIAL_CONDUCT_CATALOG.find((c) => c.code === selectedCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // V24 Telephone check
    if (isV24) {
      if (phoneTeacherAllowed === null) {
        setFeedback({
          message: 'BẮT BUỘC: Hãy trả lời câu hỏi "Giáo viên có cho phép sử dụng không?" trước khi tiếp tục.',
          type: 'error',
        });
        return;
      }
      if (phoneTeacherAllowed === true) {
        setFeedback({
          message: 'KHÔNG THỂ LẬP VI PHẠM: Học sinh được giáo viên cho phép sử dụng điện thoại phục vụ tiết học theo quy định!',
          type: 'warn',
        });
        return;
      }
    }

    // V15 Sale check
    if (isV15 && v15TeacherAllowed === true) {
      setFeedback({
        message: 'KHÔNG THỂ LẬP VI PHẠM: Giáo viên đã cho phép theo kế hoạch dạy học/hoạt động.',
        type: 'warn',
      });
      return;
    }

    if (isOther && !otherDescription.trim()) {
      setFeedback({
        message: 'Vui lòng mô tả chi tiết sự việc khác cần xem xét.',
        type: 'error',
      });
      return;
    }

    // Determine default status: GVCN, Lớp phó, and Lớp trưởng can directly approve
    const canDirectApprove =
      currentUser.role === 'gvcn' ||
      currentUser.role === 'lop_truong' ||
      currentUser.role === 'lop_pho';
    const incidentStatus = canDirectApprove ? 'approved' : 'pending_verification';
    const scoreStatus = canDirectApprove ? (isOther ? 'none' : 'confirmed_effect') : 'none';

    const result = appState.submitIncident({
      student_id: studentId,
      class_id: 'class-10a16',
      conduct_code: isOther ? null : selectedCode,
      is_other_category: isOther,
      other_category_description: isOther ? otherDescription : undefined,
      date,
      session,
      period,
      time: time || undefined,
      teacher_permission: (isV24 ? phoneTeacherAllowed : (isV15 ? v15TeacherAllowed : undefined)) ?? undefined,
      incident_status: incidentStatus,
      score_effect_status: scoreStatus,
      base_deduction: isOther ? 0 : (selectedCatalogItem?.defaultPoints ?? 0),
      reported_by: currentUser.name,
      reporter_role: currentUser.role,
      notes: notes || undefined,
    });

    if (result.warning) {
      setFeedback({
        message: `${result.warning} Đã gửi báo cáo vào hàng chờ kiểm tra!`,
        type: 'warn',
      });
    } else {
      setFeedback({
        message: `Đã gửi báo cáo sự việc thành công (${canDirectApprove ? 'Đã duyệt chính thức' : 'Đang chờ Ban Cán sự xác minh'})!`,
        type: 'success',
      });
    }

    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="font-bold text-base">Báo cáo sự việc vi phạm</h3>
              <p className="text-xs text-slate-300">Quy chuẩn theo danh mục nội quy QĐ 525 (Mã 01–24)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div
            className={`p-3 text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : feedback.type === 'warn'
                ? 'bg-amber-50 text-amber-900 border-b border-amber-200'
                : 'bg-rose-50 text-rose-800 border-b border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Student picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Học sinh vi phạm</label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full text-xs px-3 py-2 border rounded-lg border-slate-300 focus:ring-1 focus:ring-blue-500 font-medium"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.student_code} - {s.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Conduct Code Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Mã vi phạm nội quy</label>
              <span className="text-[11px] text-slate-400">Chỉ gồm mã 01–24</span>
            </div>
            <select
              value={selectedCode}
              onChange={(e) => {
                setSelectedCode(e.target.value);
                setPhoneTeacherAllowed(null);
                setV15TeacherAllowed(null);
              }}
              className="w-full text-xs px-3 py-2 border rounded-lg border-slate-300 focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <optgroup label="Danh mục chính thức (QĐ 525)">
                {OFFICIAL_CONDUCT_CATALOG.map((item) => (
                  <option key={item.code} value={item.code}>
                    Mã {item.code}: {item.shortTitle} ({item.defaultPoints}đ)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Danh mục an toàn phần mềm">
                <option value="OTHER">Sự việc khác — chờ xem xét (0 điểm / GVCN duyệt)</option>
              </optgroup>
            </select>

            {selectedCatalogItem && !isOther && (
              <div className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Mô tả đầy đủ: </span>
                {selectedCatalogItem.description}
              </div>
            )}
          </div>

          {/* Special Safety Notice for V09 */}
          {isV09 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                Lưu ý quan trọng về Mã 09 (Nhiệm vụ GVCN giao)
              </div>
              Nhiệm vụ chưa hoàn thành trên hệ thống công việc <strong>tuyệt đối KHÔNG</strong> tự động sinh mã V09. Chỉ lập báo cáo khi học sinh có biểu hiện cố tình không chấp hành theo xác nhận cụ thể của GVCN.
            </div>
          )}

          {/* Special Question for Phone V24 */}
          {isV24 && (
            <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-2">
              <div className="font-bold text-sm text-purple-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-purple-700" />
                Câu hỏi bắt buộc theo Nội quy V24:
              </div>
              <p className="font-semibold">
                &ldquo;Giáo viên có cho phép sử dụng điện thoại không?&rdquo;
              </p>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setPhoneTeacherAllowed(true)}
                  className={`flex-1 py-2 rounded-lg font-bold border transition ${
                    phoneTeacherAllowed === true
                      ? 'bg-purple-700 text-white border-purple-800'
                      : 'bg-white text-purple-800 border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  CÓ (Giáo viên cho phép)
                </button>
                <button
                  type="button"
                  onClick={() => setPhoneTeacherAllowed(false)}
                  className={`flex-1 py-2 rounded-lg font-bold border transition ${
                    phoneTeacherAllowed === false
                      ? 'bg-rose-700 text-white border-rose-800'
                      : 'bg-white text-rose-800 border-rose-300 hover:bg-rose-100'
                  }`}
                >
                  KHÔNG (Sử dụng trái phép)
                </button>
              </div>
              {phoneTeacherAllowed === true && (
                <div className="text-emerald-700 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
                  ✓ Giáo viên cho phép: Không tạo vi phạm V24.
                </div>
              )}
            </div>
          )}

          {/* Other category description */}
          {isOther && (
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <label className="block text-xs font-bold text-amber-950">
                Mô tả chi tiết sự việc khác (Chưa phân loại)
              </label>
              <textarea
                rows={3}
                required
                value={otherDescription}
                onChange={(e) => setOtherDescription(e.target.value)}
                placeholder="Mô tả hoàn cảnh, sự việc thực tế... (Mặc định trừ 0 điểm cho tới khi GVCN xem xét)"
                className="w-full text-xs px-3 py-2 border rounded-lg border-amber-300 bg-white"
              />
              <p className="text-[11px] text-amber-800">
                * Đây là phân loại an toàn phần mềm, không phải Mã 25 chính thức.
              </p>
            </div>
          )}

          {/* Time, Session, Period */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày vi phạm</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-2.5 py-2 border rounded-lg border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Buổi</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value as any)}
                className="w-full text-xs px-2 py-2 border rounded-lg border-slate-300"
              >
                <option value="morning">Sáng</option>
                <option value="afternoon">Chiều</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tiết học</label>
              <input
                type="number"
                min={1}
                max={10}
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-full text-xs px-2.5 py-2 border rounded-lg border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú / Nhân chứng</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi chú hoàn cảnh, người làm chứng hoặc chi tiết..."
              className="w-full text-xs px-3 py-2 border rounded-lg border-slate-300"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center justify-center"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isV24 && phoneTeacherAllowed === true}
              className={`min-h-[44px] px-5 py-2 text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center ${
                isV24 && phoneTeacherAllowed === true
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer'
              }`}
            >
              Gửi báo cáo sự việc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
