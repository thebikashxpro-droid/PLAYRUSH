import React from 'react';
import { X, Bell, CheckCheck, Sparkles, Award } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="modal-notifications"
        className="w-full max-w-sm bg-[#151821] border border-white/10 rounded-[24px] p-5 shadow-2xl relative text-white"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] text-white/50 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-xs">
              No new notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border transition-all ${
                  n.read
                    ? 'bg-[#181D29]/60 border-white/5 text-white/70'
                    : 'bg-[#1E2433] border-white/10 text-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {n.type === 'reward' ? (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    <h4 className="text-xs font-bold leading-tight">{n.title}</h4>
                  </div>
                  <span className="text-[10px] text-white/40 shrink-0">{n.time}</span>
                </div>
                <p className="text-[11px] text-white/50 mt-1 pl-5.5 leading-normal">
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
