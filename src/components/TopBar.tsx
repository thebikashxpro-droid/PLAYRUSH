import React from 'react';
import { Bell, User } from 'lucide-react';

interface TopBarProps {
  onNotificationsClick: () => void;
  onProfileClick: () => void;
  unreadNotificationsCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onNotificationsClick,
  onProfileClick,
  unreadNotificationsCount = 2,
}) => {
  return (
    <header id="playrush-topbar" className="px-5 pt-5 pb-4 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-[21px] font-black tracking-[1.2px] text-white leading-tight">
          PLAYRUSH
        </h1>
        <p className="text-white/55 text-[12px] font-normal tracking-wide mt-0.5">
          Play. Earn. Repeat.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          id="btn-topbar-notifications"
          onClick={onNotificationsClick}
          aria-label="Notifications"
          className="relative w-11 h-11 rounded-[14px] bg-[#151821] hover:bg-[#1C212E] active:scale-95 transition-all flex items-center justify-center border border-white/[0.04] text-white cursor-pointer"
        >
          <Bell className="w-[21px] h-[21px] text-white" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#151821]" />
          )}
        </button>

        <button
          type="button"
          id="btn-topbar-profile"
          onClick={onProfileClick}
          aria-label="Profile"
          className="w-11 h-11 rounded-[14px] bg-[#151821] hover:bg-[#1C212E] active:scale-95 transition-all flex items-center justify-center border border-white/[0.08] text-white cursor-pointer"
        >
          <User className="w-[21px] h-[21px] text-white" />
        </button>
      </div>
    </header>
  );
};
