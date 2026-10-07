import React from 'react';
import { appState } from '../services/appStateService';
import { ShieldCheck, CheckCheck, Award, RefreshCw, Zap } from 'lucide-react';

export const ModeBanner: React.FC = () => {
  const isLive = appState.isLiveSupabase();
  const canManage = appState.canManageConduct();
  const studentCount = appState.students.length;
  const isSyncing = appState.isSupabaseSyncing;

  if (isLive) {
    return (
      <div className="bg-emerald-800 text-white px-3 sm:px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs border-b border-emerald-900">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
          <span className="font-bold truncate">HỆ THỐNG SUPABASE PRODUCTION HOẠT ĐỘNG</span>
          <span className="text-emerald-200 hidden md:inline">· THPT Võ Trường Toản · Lớp 10A16 ({studentCount} HS)</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-100 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-600/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <Zap className="w-3 h-3 text-emerald-300" />
            Đồng bộ Realtime 2 chiều
          </span>

          <button
            type="button"
            onClick={() => appState.fetchFromSupabase()}
            disabled={isSyncing}
            title="Nhấn để tải lại dữ liệu mới nhất từ Supabase"
            className="flex items-center gap-1 text-[11px] bg-emerald-700/80 hover:bg-emerald-600 text-white px-2 py-0.5 rounded cursor-pointer transition font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Đang đồng bộ...' : 'Làm mới'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-100 px-3 sm:px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs border-b border-slate-800">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
        <span className="font-bold tracking-tight text-white truncate">
          SỔ NỀ NẾP CHÍNH THỨC · LỚP 10A16 · THPT VÕ TRƯỜNG TOẢN
        </span>
        <span className="text-slate-400 hidden md:inline">
          · {studentCount} học sinh thực tế (Năm học 2026-2027)
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
          <CheckCheck className="w-3 h-3" />
          Dữ liệu thực tế 100%
        </span>
        {canManage && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
            <Award className="w-3 h-3 text-blue-400" />
            Ban Cán sự & GVCN: Quyền điều chỉnh
          </span>
        )}
      </div>
    </div>
  );
};
