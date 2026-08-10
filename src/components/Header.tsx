import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Bell, 
  Store, 
  ClipboardList, 
  User, 
  MapPin, 
  Sparkles, 
  ChevronDown, 
  X, 
  PlusCircle,
  Settings,
  ShieldCheck,
  Package,
  Layers
} from 'lucide-react';
import { UserProfile, NotificationItem, CartItem, ProductCategory } from '../types';
import { PRESET_USERS } from '../data/initialData';

interface HeaderProps {
  user: UserProfile;
  cart: CartItem[];
  notifications: NotificationItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ProductCategory;
  onCategorySelect: (category: ProductCategory) => void;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenNotifications: () => void;
  onOpenSellerCenter: () => void;
  onOpenAdminCMS: () => void;
  onOpenAddProduct: () => void;
  onSwitchUser: (newUser: UserProfile) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  cart,
  notifications,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  onOpenCart,
  onOpenOrders,
  onOpenNotifications,
  onOpenSellerCenter,
  onOpenAdminCMS,
  onOpenAddProduct,
  onSwitchUser,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const popularSearches = [
    'Mangga Harum Manis',
    'Sambal Bilis Garing',
    'Kek Coklat Moist',
    'Nanas MD2',
    'Nasi Lemak Panas',
    'Brownies Nutella',
    'Kerepek Pisang',
  ];

  const isAdmin = user.role === 'admin';
  const isSeller = user.role === 'seller' || user.isSeller;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs" id="main-app-header">
      {/* Top Organization Announcement Ribbon */}
      <div className="bg-slate-900 text-slate-200 text-xs font-medium py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full font-semibold text-[10px] tracking-wide uppercase">
              Wisma Jabatan
            </span>
            <span className="hidden sm:inline text-slate-300">
              F5 MALL • Bazar & Jual Beli Warga Organisasi • DuitNow QR Terus & Hantar Ke Meja
            </span>
            <span className="sm:hidden text-[11px] text-slate-300">F5 MALL</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span className="truncate max-w-[160px]">{user.deskLocation || 'Wisma Jabatan'}</span>
            </div>

            {/* Quick CMS switch in Top Bar */}
            {isAdmin ? (
              <button 
                id="header-top-admin-cms-btn"
                onClick={onOpenAdminCMS}
                className="bg-indigo-600/40 hover:bg-indigo-600 text-indigo-200 hover:text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold text-[11px] border border-indigo-400/40 transition-colors cursor-pointer"
              >
                <Settings className="w-3 h-3 text-indigo-300" />
                <span>CMS Pentadbir (Admin)</span>
              </button>
            ) : isSeller ? (
              <button 
                id="header-top-seller-center-btn"
                onClick={onOpenSellerCenter}
                className="bg-emerald-600/40 hover:bg-emerald-600 text-emerald-200 hover:text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold text-[11px] border border-emerald-400/40 transition-colors cursor-pointer"
              >
                <Store className="w-3 h-3 text-emerald-300" />
                <span>CMS Gerai Saya</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 shrink-0 cursor-pointer" 
            onClick={() => onCategorySelect('Semua')}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-xs tracking-tighter">
              F5
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                F5 <span className="text-indigo-600">MALL</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 hidden sm:block">
                Pusat Jual Beli Warga Organisasi
              </p>
            </div>
          </div>

          {/* Search Bar - Sleek Style */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <input
                id="header-product-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setShowSearchSuggestions(true)}
                placeholder="Cari buah, kek, sambal, kraf atau staf penjual..."
                className="w-full pl-10 pr-24 py-2 bg-slate-100 hover:bg-slate-150 focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-full text-xs sm:text-sm text-slate-800 transition-all outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />

              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-20 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                id="header-search-submit-btn"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 rounded-full transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <span>Cari</span>
              </button>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {showSearchSuggestions && !searchQuery && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setShowSearchSuggestions(false)}
              >
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Carian Hangat Warga Jabatan
                  </span>
                  <span className="text-[10px] text-slate-400">Klik untuk cari</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        onSearchChange(tag);
                        setShowSearchSuggestions(false);
                      }}
                      className="text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ROLE-SPECIFIC CMS BUTTON */}
            {isAdmin ? (
              <button
                id="header-admin-cms-main-btn"
                onClick={onOpenAdminCMS}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Buka CMS Pentadbir untuk mengurus semua barang jualan & penjual"
              >
                <Settings className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">CMS Pentadbir</span>
                <span className="md:hidden">CMS</span>
              </button>
            ) : isSeller ? (
              <button
                id="header-seller-cms-main-btn"
                onClick={onOpenSellerCenter}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Buka CMS Penjual untuk mengurus barang jualan gerai anda"
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">CMS Gerai Saya</span>
                <span className="md:hidden">Gerai</span>
              </button>
            ) : (
              <button
                id="header-become-seller-btn"
                onClick={onOpenAddProduct}
                className="hidden lg:flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="Mula menjual di F5 MALL"
              >
                <PlusCircle className="w-4 h-4 text-slate-600" />
                <span>+ Jual Produk</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Notifikasi Pesanan & Hebahan"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Order History */}
            <button
              id="header-order-history-btn"
              onClick={onOpenOrders}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Rekod & Status Pesanan Saya"
            >
              <ClipboardList className="w-5 h-5" />
              <span className="text-xs font-semibold hidden md:inline text-slate-700">
                Pesanan
              </span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              id="header-cart-drawer-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Troli</span>
              {cartTotalCount > 0 && (
                <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* User Persona Profile */}
            <div className="relative">
              <button
                id="header-user-profile-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-1 sm:pl-2 pr-1.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <div className="flex items-center justify-end gap-1">
                    <p className="text-xs font-bold text-slate-800">{user.name}</p>
                    {isAdmin ? (
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 font-extrabold px-1 rounded">
                        Admin
                      </span>
                    ) : isSeller ? (
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 font-extrabold px-1 rounded">
                        Penjual
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate max-w-[110px]">
                    {user.department.split('(')[0].trim()}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-300 overflow-hidden bg-slate-200 shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Persona Switcher Dropdown */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-3 py-2.5 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                        Profil Semasa:
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isAdmin ? 'bg-indigo-100 text-indigo-800' : isSeller ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isAdmin ? '👑 Pentadbir Sistem' : isSeller ? '🏪 Penjual Gerai' : '🛍️ Pembeli Staf'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-1">{user.name}</p>
                    <p className="text-[11px] text-slate-500">{user.department}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-1">📍 {user.deskLocation}</p>
                  </div>

                  <p className="text-[10px] font-bold uppercase text-slate-400 px-3 py-1">
                    Tukar Peranan Pengguna (Role Switcher):
                  </p>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {PRESET_USERS.map((u) => {
                      const isCur = user.id === u.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            onSwitchUser(u);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                            isCur
                              ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate leading-tight">{u.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{u.department}</p>
                          </div>
                          {u.role === 'admin' ? (
                            <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md font-extrabold shrink-0">
                              Admin CMS
                            </span>
                          ) : u.role === 'seller' ? (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold shrink-0">
                              Penjual
                            </span>
                          ) : (
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium shrink-0">
                              Pembeli
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5">
                    {isAdmin ? (
                      <button
                        onClick={() => {
                          onOpenAdminCMS();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Buka CMS Pentadbir (Urus Sistem)</span>
                      </button>
                    ) : isSeller ? (
                      <button
                        onClick={() => {
                          onOpenSellerCenter();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Buka CMS Gerai Jualan Saya</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onOpenAddProduct();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Mula Jual Barang di Mall</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
