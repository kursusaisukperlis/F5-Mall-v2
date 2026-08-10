import React from 'react';
import { Seller, Order, AppNotification } from '../types';
import { 
  Bell, 
  Store, 
  Star, 
  QrCode, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency, formatDateTime, getOrderStatusBadge } from '../utils/formatters';

interface RightSidebarProps {
  sellers: Seller[];
  recentOrders: Order[];
  notifications: AppNotification[];
  onOpenSellerProfile: (seller: Seller) => void;
  onOpenOrders: () => void;
  onOpenNotifications: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  sellers,
  recentOrders,
  notifications,
  onOpenSellerProfile,
  onOpenOrders,
  onOpenNotifications,
}) => {
  return (
    <aside className="w-80 shrink-0 hidden xl:flex flex-col gap-6" id="app-right-sidebar">
      {/* Mini Widget 1: Notifikasi Pesanan Terkini */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Notifikasi Pesanan
          </h3>
          <button
            onClick={onOpenNotifications}
            className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
          >
            Lihat Semua
          </button>
        </div>

        <div className="space-y-3">
          {notifications.slice(0, 3).map((notif) => (
            <div
              key={notif.id}
              onClick={onOpenOrders}
              className="flex gap-3 text-xs items-start p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-bold text-slate-800 truncate">{notif.title}</p>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {formatDateTime(notif.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Widget 2: Dompet & Bayaran Warga */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
          <QrCode className="w-4 h-4" />
          <span>Bayaran Terus DuitNow QR</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Setiap penjual mempunyai QR DuitNow & akaun bank berasingan. 100% bayaran masuk terus ke akaun rakan sekerja tanpa sebarang komisen!
        </p>
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[11px] text-emerald-800 font-semibold">
            Transaksi Selamat Dalaman Jabatan
          </span>
        </div>
      </div>

      {/* Mini Widget 3: Gerai Pilihan Warga */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-indigo-600" />
            Gerai Pilihan Warga
          </h3>
        </div>

        <div className="space-y-3">
          {sellers.slice(0, 4).map((seller) => (
            <div
              key={seller.id}
              onClick={() => onOpenSellerProfile(seller)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 group-hover:ring-2 group-hover:ring-indigo-500/20"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">
                    {seller.shopName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{seller.department}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{seller.rating.toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {seller.totalSales} jualan
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
