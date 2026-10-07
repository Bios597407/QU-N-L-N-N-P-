import React from 'react';
import { appState } from '../services/appStateService';
import { History, ShieldCheck, Lock } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const auditLogs = appState.auditLogs;
  const isOfficer = appState.currentUser.isAuthenticatedOfficer;

  if (!isOfficer) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm max-w-lg mx-auto text-center space-y-4 my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-xs">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900">
          Khu vực Bảo mật Ban Quản lý Lớp
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Nhật ký kiểm toán ghi vết sự kiện hệ thống chỉ dành cho Ban Cán sự & GVCN tra cứu. Vui lòng đăng nhập để mở khóa xem nhật ký.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Nhật ký Kiểm toán Hệ thống (Audit Logs)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
              {auditLogs.length} sự kiện
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Lưu vết bất biến toàn bộ hành vi: tạo sự việc, duyệt điểm, hiệu chỉnh, khóa kỳ và nạp dữ liệu
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Nguyên tắc: Chỉ ghi thêm (Append-only), Không thể xóa</span>
        </div>
      </div>

      {/* Mobile Card Feed */}
      <div className="md:hidden space-y-2.5">
        {auditLogs.map((log) => (
          <div key={log.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                {log.entity_type}:{log.entity_id}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{log.actor_name}</span>
              <span className="text-blue-700 font-semibold">{log.action}</span>
            </div>
            {log.reason && (
              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {log.reason}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Audit Logs Table (Desktop) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Người thực hiện</th>
                <th className="py-3 px-4">Hành động</th>
                <th className="py-3 px-4">Đối tượng</th>
                <th className="py-3 px-4">Chi tiết / Lý do giải trình</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{log.actor_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">({log.actor_role})</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-700">{log.action}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {log.entity_type}:{log.entity_id}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{log.reason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
