import React, { useState, useMemo } from 'react';
import { Product, Seller, Order, ProductCategory, OrderStatus, NotificationItem } from '../types';
import { 
  X, 
  Settings, 
  Package, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Bell, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Search, 
  Filter, 
  ShieldCheck, 
  Store, 
  DollarSign, 
  Send, 
  RefreshCw,
  Eye,
  ExternalLink,
  Phone,
  FileSpreadsheet,
  Check,
  Clock,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDateTime, getOrderStatusBadge } from '../utils/formatters';
import { playNotificationSound } from '../utils/audio';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  sellers: Seller[];
  orders: Order[];
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onToggleFlashSale: (productId: string, isFlashSale: boolean) => void;
  onUpdateSeller: (sellerId: string, updatedFields: Partial<Seller>) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onBroadcastNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  onResetDefaults: () => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  products,
  sellers,
  orders,
  onOpenAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateProductStock,
  onToggleFlashSale,
  onUpdateSeller,
  onUpdateOrderStatus,
  onBroadcastNotification,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'products' | 'sellers' | 'orders' | 'broadcast' | 'analytics'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('Semua');
  const [productSellerFilter, setProductSellerFilter] = useState<string>('Semua');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('Semua');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<NotificationItem['type']>('promo');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Quick seller add/edit state
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = productSearch === '' || 
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(productSearch.toLowerCase())));
      const matchCat = productCategoryFilter === 'Semua' || p.category === productCategoryFilter;
      const matchSeller = productSellerFilter === 'Semua' || p.sellerId === productSellerFilter;
      return matchQuery && matchCat && matchSeller;
    });
  }, [products, productSearch, productCategoryFilter, productSellerFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = orderStatusFilter === 'Semua' || o.status === orderStatusFilter;
      const matchSearch = orderSearch === '' ||
        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.buyerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.sellerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.deliveryLocation.roomOrDesk.toLowerCase().includes(orderSearch.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Calculations
  const totalGMV = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const pendingOrders = orders.filter((o) => o.status === 'preparing' || o.status === 'pending').length;

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    onBroadcastNotification(broadcastTitle.trim(), broadcastMessage.trim(), broadcastType);
    playNotificationSound('order');
    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  const handleToggleVerified = (seller: Seller) => {
    onUpdateSeller(seller.id, { isVerifiedStaff: !seller.isVerifiedStaff });
    playNotificationSound('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div 
        id="admin-cms-modal-container"
        className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full h-[94vh] flex flex-col border border-slate-200 overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  CMS Pentadbir F5 MALL
                </h2>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  Kawalan Penuh Sistem
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pusat Pengurusan Produk, Penjual, Pesanan Jabatan & Hebahan Pengumuman
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Adakah anda pasti mahu set semula seluruh data demo mall kepada asal?')) {
                  onResetDefaults();
                }
              }}
              title="Reset data demo"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Data
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-5 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
              Jumlah Nilai Jualan (GMV)
            </p>
            <p className="text-base sm:text-xl font-black text-indigo-600 mt-0.5">
              {formatCurrency(totalGMV)}
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-emerald-600" />
              Jumlah Produk Aktif
            </p>
            <p className="text-base sm:text-xl font-black text-slate-800 mt-0.5">
              {products.length} Produk
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-amber-600" />
              Gerai Warga Berdaftar
            </p>
            <p className="text-base sm:text-xl font-black text-slate-800 mt-0.5">
              {sellers.length} Penjual
            </p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />
              Jumlah Pesanan Masuk
            </p>
            <p className="text-base sm:text-xl font-black text-slate-800 mt-0.5">
              {orders.length} Pesanan <span className="text-xs font-semibold text-amber-600">({pendingOrders} proses)</span>
            </p>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white shrink-0 overflow-x-auto">
          {[
            { id: 'products', label: 'Urus Semua Produk', icon: <Package className="w-4 h-4" />, count: products.length },
            { id: 'sellers', label: 'Urus Penjual & Gerai', icon: <Store className="w-4 h-4" />, count: sellers.length },
            { id: 'orders', label: 'Audit Semua Pesanan', icon: <ShoppingBag className="w-4 h-4" />, count: orders.length },
            { id: 'broadcast', label: 'Hebahan Pengumuman', icon: <Bell className="w-4 h-4" /> },
            { id: 'analytics', label: 'Statistik & Laporan', icon: <TrendingUp className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon}
                {tab.label}
                {typeof tab.count === 'number' && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50">
          {/* TAB 1: URUS SEMUA PRODUK */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Cari nama produk, penjual, tag..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Buah-buahan Segar">Buah-buahan Segar</option>
                    <option value="Kek & Pastri">Kek & Pastri</option>
                    <option value="Sambal & Lauk Pauk">Sambal & Lauk Pauk</option>
                    <option value="Kudapan & Minuman">Kudapan & Minuman</option>
                    <option value="Kraf & Keperluan Pejabat">Kraf & Keperluan Pejabat</option>
                  </select>

                  {/* Seller Filter */}
                  <select
                    value={productSellerFilter}
                    onChange={(e) => setProductSellerFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
                  >
                    <option value="Semua">Semua Penjual</option>
                    {sellers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shopName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add Product Button */}
                <button
                  onClick={onOpenAddProduct}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Produk Baru
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Produk</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Penjual / Gerai</th>
                        <th className="py-3 px-4">Harga Jualan</th>
                        <th className="py-3 px-4">Baki Stok</th>
                        <th className="py-3 px-4">Flash Sale</th>
                        <th className="py-3 px-4 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-slate-400 font-medium">
                            Tiada produk dijumpai bagi kriteria carian ini.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => {
                          return (
                            <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.image}
                                    alt={p.title}
                                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                  />
                                  <div>
                                    <p className="font-bold text-slate-800 line-clamp-1">
                                      {p.title}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        {p.unit}
                                      </span>
                                      {p.badge && (
                                        <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded">
                                          {p.badge}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                                  {p.category}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <p className="font-semibold text-slate-800">{p.sellerName}</p>
                                <p className="text-[10px] text-slate-400">{p.sellerDepartment}</p>
                              </td>

                              <td className="py-3 px-4 font-bold text-indigo-600">
                                {formatCurrency(p.price)}
                                {p.originalPrice && (
                                  <span className="block text-[10px] text-slate-400 line-through">
                                    {formatCurrency(p.originalPrice)}
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : 'text-slate-800'}`}>
                                    {p.stock}
                                  </span>
                                  <div className="flex flex-col gap-0.5">
                                    <button
                                      onClick={() => onUpdateProductStock(p.id, p.stock + 5)}
                                      className="text-[9px] px-1 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-600 cursor-pointer"
                                      title="Tambah 5"
                                    >
                                      +5
                                    </button>
                                  </div>
                                </div>
                                {p.stock === 0 && (
                                  <span className="text-[9px] text-rose-500 font-bold block">Habis Stok</span>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                <button
                                  onClick={() => onToggleFlashSale(p.id, !p.isFlashSale)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                                    p.isFlashSale
                                      ? 'bg-amber-500 text-white shadow-2xs'
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                  }`}
                                >
                                  <Zap className="w-3 h-3" />
                                  {p.isFlashSale ? 'Aktif' : 'Tidak'}
                                </button>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => onEditProduct(p)}
                                    className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Produk"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Adakah anda pasti mahu memadam produk "${p.title}"?`)) {
                                        onDeleteProduct(p.id);
                                      }
                                    }}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title="Padam Produk"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
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
          )}

          {/* TAB 2: URUS PENJUAL & GERAI */}
          {activeTab === 'sellers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Senarai Penjual Berdaftar</h3>
                  <p className="text-xs text-slate-500">Urus status pengesahan staf, butiran bayaran DuitNow & lokasi gerai</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sellers.map((s) => {
                  const sellerProductsCount = products.filter((p) => p.sellerId === s.id).length;
                  const sellerOrdersCount = orders.filter((o) => o.sellerId === s.id).length;

                  return (
                    <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-sm text-slate-800">{s.shopName}</h4>
                              {s.isVerifiedStaff && (
                                <ShieldCheck className="w-4 h-4 text-indigo-600" title="Staf Disahkan" />
                              )}
                            </div>
                            <p className="text-xs text-slate-600 font-medium">{s.name}</p>
                            <p className="text-[11px] text-slate-400">{s.department}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleVerified(s)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                            s.isVerifiedStaff
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {s.isVerifiedStaff ? '✓ Staf Sah' : '+ Sahkan Staf'}
                        </button>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center text-xs">
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Produk</p>
                          <p className="font-bold text-slate-800 mt-0.5">{sellerProductsCount} Item</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Pesanan</p>
                          <p className="font-bold text-slate-800 mt-0.5">{sellerOrdersCount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-semibold">Penilaian</p>
                          <p className="font-bold text-amber-600 mt-0.5">⭐ {s.rating.toFixed(1)}</p>
                        </div>
                      </div>

                      {/* Payment info */}
                      <div className="text-xs text-slate-600 space-y-1 border-t border-slate-100 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">DuitNow / Bank:</span>
                          <span className="font-semibold text-slate-800">{s.paymentInfo.bankName} ({s.paymentInfo.accountNumber})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">WhatsApp:</span>
                          <a 
                            href={`https://wa.me/${s.whatsapp}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {s.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT SEMUA PESANAN */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Cari no. pesanan, pembeli, meja..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="pending">Menunggu Bayaran / Diterima</option>
                    <option value="preparing">Sedang Disediakan</option>
                    <option value="delivering">Sedang Dihantar ke Meja</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">No. Pesanan</th>
                        <th className="py-3 px-4">Pembeli (Staf)</th>
                        <th className="py-3 px-4">Gerai Penjual</th>
                        <th className="py-3 px-4">Item & Nilai</th>
                        <th className="py-3 px-4">Lokasi Penghantaran</th>
                        <th className="py-3 px-4">Status & Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-slate-400 font-medium">
                            Tiada rekod pesanan dijumpai.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => {
                          const badge = getOrderStatusBadge(o.status);
                          return (
                            <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-mono font-bold text-slate-900 block">
                                  #{o.orderNumber}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {formatDateTime(o.createdAt)}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <p className="font-semibold text-slate-800">{o.buyerName}</p>
                                <p className="text-[10px] text-slate-400">{o.buyerDepartment}</p>
                              </td>

                              <td className="py-3 px-4">
                                <p className="font-semibold text-slate-800">{o.sellerName}</p>
                              </td>

                              <td className="py-3 px-4">
                                <p className="font-black text-indigo-600 text-sm">
                                  {formatCurrency(o.totalAmount)}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                  {o.items.length} item • {o.paymentMethod.toUpperCase()}
                                </p>
                              </td>

                              <td className="py-3 px-4">
                                <p className="font-medium text-slate-700">{o.deliveryLocation.level}</p>
                                <p className="text-[10px] text-slate-400">{o.deliveryLocation.roomOrDesk}</p>
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.color}`}>
                                    {badge.label}
                                  </span>

                                  {/* Quick Status Override Selector */}
                                  <select
                                    value={o.status}
                                    onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                                    className="text-[10px] border border-slate-200 rounded px-1.5 py-0.5 bg-white font-medium text-slate-700"
                                  >
                                    <option value="pending">Menunggu</option>
                                    <option value="preparing">Disediakan</option>
                                    <option value="delivering">Dihantar</option>
                                    <option value="completed">Selesai</option>
                                    <option value="cancelled">Batal</option>
                                  </select>
                                </div>
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
          )}

          {/* TAB 4: HEBAHAN PENGUMUMAN */}
          {activeTab === 'broadcast' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <Bell className="w-5 h-5" />
                  <h3 className="font-bold text-base text-slate-900">Hebahan & Notifikasi Admin</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Hantar mesej pengumuman langsung kepada semua staf dan penjual di dalam F5 MALL.
                </p>
              </div>

              {broadcastSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Pengumuman berjaya dihantar ke peti notifikasi semua staf!
                </div>
              )}

              <form onSubmit={handleBroadcastSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tajuk Pengumuman <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    required
                    placeholder="Contoh: ⚡ Jualan Kilat Hari Gaji Bermula!"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Jenis Mesej
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'promo', label: '🏷️ Promosi / Jualan' },
                      { type: 'order_status', label: '📢 Makluman Sistem' },
                      { type: 'new_order', label: '⚡ Acara Khas' },
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setBroadcastType(item.type as any)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          broadcastType === item.type
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kandungan Mesej Hebahan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                    placeholder="Tulis makluman kepada warga jabatan di sini..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    Hantar Hebahan Kepada Semua
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: STATISTIK & LAPORAN */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Popular Categories */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    Pecahan Produk Mengikut Kategori
                  </h3>
                  <div className="space-y-2 text-xs">
                    {[
                      'Buah-buahan Segar',
                      'Kek & Pastri',
                      'Sambal & Lauk Pauk',
                      'Kudapan & Minuman',
                      'Kraf & Keperluan Pejabat',
                    ].map((cat) => {
                      const count = products.filter((p) => p.category === cat).length;
                      const percent = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-slate-700 font-medium">
                            <span>{cat}</span>
                            <span className="font-bold">{count} Item ({percent}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Sellers Leaderboard */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-500" />
                    Gerai Paling Laris (Jualan Tertinggi)
                  </h3>
                  <div className="space-y-2">
                    {sellers
                      .slice()
                      .sort((a, b) => b.totalSales - a.totalSales)
                      .map((s, idx) => (
                        <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <p className="font-bold text-slate-800">{s.shopName}</p>
                              <p className="text-[10px] text-slate-400">{s.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-indigo-600">{s.totalSales} unit</span>
                            <p className="text-[10px] text-amber-500 font-bold">⭐ {s.rating.toFixed(1)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
