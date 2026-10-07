import React from 'react';
import { NavTab } from './Sidebar';
import {
  LayoutDashboard,
  CalendarCheck,
  AlertTriangle,
  Calculator,
  Menu,
  Plus,
  Users,
} from 'lucide-react';

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickIncident: () => void;
  onOpenMobileMenu: () => void;
  pendingIncidentsCount: number;
}

export const MobileBottomNav: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  onOpenQuickIncident,
  onOpenMobileMenu,
  pendingIncidentsCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1 flex items-center justify-around shadow-2xl safe-area-pb">
      {/* 1. Tổng quan */}
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer ${
          activeTab === 'dashboard' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Tổng quan"
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Tổng quan</span>
      </button>

      {/* 2. Điểm danh */}
      <button
        onClick={() => onSelectTab('attendance')}
        className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer ${
          activeTab === 'attendance' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Điểm danh"
      >
        <CalendarCheck className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Điểm danh</span>
      </button>

      {/* 3. Center Highlight: Báo vi phạm Nhanh (FAB Thumb Zone) */}
      <div className="relative -top-2 flex items-center justify-center">
        <button
          onClick={onOpenQuickIncident}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-90 transition border-2 border-slate-900 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-400"
          title="Báo sự việc nhanh"
          aria-label="Báo sự việc nhanh"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* 4. Bảng điểm */}
      <button
        onClick={() => onSelectTab('scoring')}
        className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer ${
          activeTab === 'scoring' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
        aria-label="Điểm số"
      >
        <Calculator className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Điểm số</span>
      </button>

      {/* 5. Menu mở rộng */}
      <button
        onClick={onOpenMobileMenu}
        className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 relative transition cursor-pointer"
        aria-label="Mở tất cả chức năng"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight">Menu</span>
        {pendingIncidentsCount > 0 && (
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        )}
      </button>
    </nav>
  );
};
