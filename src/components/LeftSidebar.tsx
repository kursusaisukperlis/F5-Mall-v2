import React from 'react';
import { ProductCategory, UserProfile } from '../types';
import { 
  Apple, 
  Cake, 
  Flame, 
  Coffee, 
  Package, 
  LayoutGrid, 
  ShoppingBag, 
  Store, 
  Bell, 
  PlusCircle, 
  Sparkles,
  ChevronRight,
  MapPin,
  Settings,
  ShieldCheck
} from 'lucide-react';

interface LeftSidebarProps {
  currentUser: UserProfile;
  selectedCategory: ProductCategory;
  onCategorySelect: (category: ProductCategory) => void;
  onOpenOrders: () => void;
  onOpenSellerCenter: () => void;
  onOpenAdminCMS: () => void;
  onOpenNotifications: () => void;
  onOpenAddProduct: () => void;
  ordersCount: number;
  unreadNotificationsCount: number;
  categoryCounts?: Partial<Record<ProductCategory, number>>;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentUser,
  selectedCategory,
  onCategorySelect,
  onOpenOrders,
  onOpenSellerCenter,
  onOpenAdminCMS,
  onOpenNotifications,
  onOpenAddProduct,
  ordersCount,
  unreadNotificationsCount,
  categoryCounts,
}) => {
  const categories: { name: ProductCategory; icon: React.ReactNode }[] = [
    { name: 'Semua', icon: <LayoutGrid className="w-4 h-4" /> },
    { name: 'Buah-buahan Segar', icon: <Apple className="w-4 h-4" /> },
    { name: 'Kek & Pastri', icon: <Cake className="w-4 h-4" /> },
    { name: 'Sambal & Lauk Pauk', icon: <Flame className="w-4 h-4" /> },
    { name: 'Kudapan & Minuman', icon: <Coffee className="w-4 h-4" /> },
    { name: 'Kraf & Keperluan Pejabat', icon: <Package className="w-4 h-4" /> },
  ];

  const isAdmin = currentUser.role === 'admin';
  const isSeller = currentUser.role === 'seller' || currentUser.isSeller;

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-5" id="app-left-sidebar">
      {/* Category Navigation Menu */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
          Kategori Produk
        </h3>
        <nav className="space-y-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            const count = categoryCounts?.[cat.name];
            return (
              <button
                key={cat.name}
                onClick={() => onCategorySelect(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                    {cat.icon}
                  </span>
                  <span className="truncate">{cat.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {typeof count === 'number' && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role CMS Management Box */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pengurusan (CMS)
          </h3>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
            isAdmin ? 'bg-indigo-100 text-indigo-800' : isSeller ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {isAdmin ? 'Admin' : isSeller ? 'Penjual' : 'Pembeli'}
          </span>
        </div>

        <div className="space-y-1">
          {isAdmin ? (
            <button
              onClick={onOpenAdminCMS}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-bold transition-all border border-indigo-200 cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-indigo-600" />
                <span>CMS Pentadbir Sistem</span>
              </div>
              <span className="text-[10px] bg-indigo-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                Penuh
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenSellerCenter}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold transition-all border border-emerald-200 cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>CMS Gerai Jualan Saya</span>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                Gerai
              </span>
            </button>
          )}

          <button
            onClick={onOpenOrders}
            className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              <span>Rekod Pesanan</span>
            </div>
            {ordersCount > 0 && (
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {ordersCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenNotifications}
            className="w-full flex items-center justify-between px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-slate-400" />
              <span>Notifikasi</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Promo Callout Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 relative overflow-hidden shadow-md">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
        <h4 className="font-bold text-sm relative z-10">Jual Di F5 MALL</h4>
        <p className="text-[11px] text-slate-300 mt-1 mb-4 leading-relaxed relative z-10">
          Promosikan hasil tanaman, pastri, makanan tengah hari atau kraf kepada rakan sekerja.
        </p>
        <button
          onClick={onOpenAddProduct}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm relative z-10 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Tambah Jualan Baru</span>
        </button>
      </div>
    </aside>
  );
};
