import React, { useState } from 'react';
import { appState } from '../services/appStateService';
import { StatusBadge } from '../components/StatusBadge';
import { tallyAttendance, OFFICIAL_SESSIONS, ABSENCE_PROCEDURES } from '../domain/attendance/attendanceRules';
import {
  CalendarCheck,
  Plus,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  FileText,
} from 'lucide-react';

interface Props {
  onOpenQuickAttendance: () => void;
}

export const AttendancePage: React.FC<Props> = ({ onOpenQuickAttendance }) => {
  const attendance = appState.attendance;
  const students = appState.students;

  const [dateFilter, setDateFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = attendance.filter((a) => {
    if (dateFilter && a.date !== dateFilter) return false;
    if (sessionFilter !== 'all' && a.session !== sessionFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const tally = tallyAttendance(attendance);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Quản lý Điểm danh & Theo dõi VnEdu
          </h2>
          <p className="text-xs text-slate-500">
            Hồ sơ sự thật chuyên cần lớp 10A16 • Căn cứ theo QĐ số 525/QĐ-THPT.VTT
          </p>
        </div>
        <button
          onClick={onOpenQuickAttendance}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Điểm danh buổi học
        </button>
      </div>

      {/* KPI Tally Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Tổng buổi vắng thực tế</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{tally.actualTotalAbsenceSessions}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Số liệu thực tế ghi nhận</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Vắng có phép (VnEdu)</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{tally.permittedAbsenceCount}</div>
          <div className="text-[10px] text-blue-700 mt-0.5">Trần khống chế Tốt: &ge; 10 buổi</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Vắng không phép</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{tally.unpermittedAbsenceCount}</div>
          <div className="text-[10px] text-rose-700 mt-0.5">Trần khống chế Tốt: &ge; 2 buổi</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Đi học trễ mốc quy định</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{tally.lateCount}</div>
          <div className="text-[10px] text-amber-700 mt-0.5">Sau 06:50 / Sau 12:50</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Cảnh báo quy tắc 45 buổi</div>
          <div className="text-2xl font-black text-purple-600 mt-1">
            {tally.warning45RuleCount} <span className="text-xs text-slate-400 font-normal">/ 45</span>
          </div>
          <div className="text-[10px] text-purple-700 mt-0.5">Theo dõi cảnh báo độc lập</div>
        </div>
      </div>

      {/* Official Procedures Warning Box */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          Quy định thủ tục xin phép & Nguyên tắc an toàn dữ liệu chuyên cần
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600 text-[11px]">
          <div>
            • <strong>Vắng 1–3 ngày:</strong> Phụ huynh nộp đơn xin phép có minh chứng trên VnEdu. Ứng dụng này theo dõi tiến trình và đối chiếu, <em>không thay thế VnEdu</em>.
          </div>
          <div>
            • <strong>Vắng 4 ngày trở lên:</strong> Bắt buộc phụ huynh phải đến làm việc trực tiếp tại trường.
          </div>
          <div>
            • <strong>Tính điểm rèn luyện:</strong> Điểm danh là hồ sơ sự thật chuyên cần, <em>tuyệt đối không tự động trừ điểm trực tiếp</em>. Vắng không phép sẽ đề xuất lập vi phạm Mã 14 để GVCN xem xét.
          </div>
          <div>
            • <strong>Miễn trừ chính đáng:</strong> Nằm viện, tang chế gia đình, thi IELTS, thi ĐGNL được trừ khỏi bộ đếm khống chế xếp loại Tốt.
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
          <Filter className="w-3.5 h-3.5" />
          Bộ lọc:
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded-lg px-2.5 py-1.5 text-xs border-slate-300"
        />
        <select
          value={sessionFilter}
          onChange={(e) => setSessionFilter(e.target.value)}
          className="border rounded-lg px-2.5 py-1.5 text-xs border-slate-300"
        >
          <option value="all">Tất cả buổi học</option>
          <option value="morning">Buổi sáng</option>
          <option value="afternoon">Buổi chiều</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-2.5 py-1.5 text-xs border-slate-300"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="permitted_absence">Vắng có phép</option>
          <option value="unpermitted_absence">Vắng không phép</option>
          <option value="late">Đi học trễ</option>
          <option value="absence_pending_verification">Chờ xác minh phép</option>
        </select>
        {(dateFilter || sessionFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setDateFilter('');
              setSessionFilter('all');
              setStatusFilter('all');
            }}
            className="text-blue-600 hover:underline font-semibold ml-auto"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Attendance Mobile Card Feed */}
      <div className="md:hidden space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            Không có bản ghi điểm danh nào phù hợp với bộ lọc.
          </div>
        ) : (
          filtered.map((record) => {
            const student = students.find((s) => s.id === record.student_id);
            return (
              <div
                key={record.id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{student?.full_name || 'N/A'}</span>
                    <span className="font-mono text-[11px] text-blue-700 font-semibold ml-1.5">
                      ({student?.student_code || record.student_id})
                    </span>
                  </div>
                  <StatusBadge
                    type={
                      record.status === 'permitted_absence'
                        ? 'tot'
                        : record.status === 'unpermitted_absence'
                        ? 'rejected'
                        : record.status === 'late'
                        ? 'dat'
                        : 'pending_verification'
                    }
                    label={
                      record.status === 'permitted_absence'
                        ? 'Vắng có phép'
                        : record.status === 'unpermitted_absence'
                        ? 'Vắng K.phép'
                        : record.status === 'late'
                        ? 'Đi trễ'
                        : record.status === 'truancy'
                        ? 'Trốn tiết'
                        : 'Chờ xác minh'
                    }
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>
                    {record.date} · {record.session === 'morning' ? 'Sáng' : 'Chiều'}
                  </span>
                  <span>
                    {record.arrival_time ? `Đến: ${record.arrival_time}` : record.reason || '—'}
                  </span>
                </div>

                {record.vnedu_ref_number && (
                  <div className="text-[10px] text-slate-400 font-mono">
                    Mã VnEdu: {record.vnedu_ref_number}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Attendance History Table (Desktop) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Ngày</th>
                <th className="py-3 px-4">Buổi</th>
                <th className="py-3 px-4">Mã số</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Trạng thái chuyên cần</th>
                <th className="py-3 px-4">Giờ đến / Chi tiết</th>
                <th className="py-3 px-4">Mã VnEdu</th>
                <th className="py-3 px-4">Miễn trừ Tốt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    Không có bản ghi điểm danh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => {
                  const student = students.find((s) => s.id === record.student_id);
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{record.date}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">
                          {record.session === 'morning' ? 'Sáng' : 'Chiều'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {student?.student_code || record.student_id}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{student?.full_name || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          type={
                            record.status === 'permitted_absence'
                              ? 'tot'
                              : record.status === 'unpermitted_absence'
                              ? 'rejected'
                              : record.status === 'late'
                              ? 'dat'
                              : 'pending_verification'
                          }
                          label={
                            record.status === 'permitted_absence'
                              ? 'Vắng có phép'
                              : record.status === 'unpermitted_absence'
                              ? 'Vắng K.phép'
                              : record.status === 'late'
                              ? 'Đi trễ'
                              : record.status === 'truancy'
                              ? 'Trốn tiết'
                              : 'Chờ xác minh'
                          }
                        />
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {record.arrival_time && (
                          <span className="font-mono font-semibold text-amber-700 mr-2">
                            Lúc {record.arrival_time}
                          </span>
                        )}
                        <span>{record.reason || '—'}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {record.vnedu_ref_number || '—'}
                      </td>
                      <td className="py-3 px-4">
                        {record.is_legitimate_exception ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Miễn trừ ({record.exception_reason || 'Hợp lệ'})
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
