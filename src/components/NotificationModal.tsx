import React from 'react';
import { AppNotification } from '../types';
import { 
  X, 
  Bell, 
  CheckCheck, 
  ShoppingBag, 
  Truck, 
  Sparkles, 
  Star, 
  Clock, 
  Volume2, 
  VolumeX,
  Trash2
} from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onSelectNotification: (notification: AppNotification) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onSelectNotification,
  soundEnabled,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_status':
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case 'new_order':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'promo':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        id="notification-modal-container"
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pemberitahuan & Notifikasi Pesanan
              </h2>
              <p className="text-[11px] text-slate-500">
                Kemas kini status penyediaan dan penghantaran pesanan jabatan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Bunyi Notifikasi Aktif' : 'Bunyi Dimatikan'}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                soundEnabled
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            {notifications.filter((n) => !n.isRead).length} Belum Dibaca
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onMarkAllAsRead}
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tanda Semua Dibaca</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={onClearNotifications}
              className="text-slate-400 hover:text-rose-600 font-medium flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
          </div>
        </div>

        {/* Notification List Body */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1 bg-slate-50/50">
          {notifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Tiada Notifikasi</p>
              <p className="text-xs text-slate-400">
                Pemberitahuan pesanan baru dan promosi kilat akan dipaparkan di sini.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNotification(n)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.isRead
                    ? 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
                    : 'bg-indigo-50/60 border-indigo-200 text-indigo-950 font-medium shadow-2xs'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="text-xs font-bold truncate">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDateTime(n.timestamp)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
