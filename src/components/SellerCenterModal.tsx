import React, { useState, useMemo } from 'react';
import { Product, Order, Seller, OrderStatus } from '../types';
import { 
  X, 
  Store, 
  Package, 
  TrendingUp, 
  ShoppingBag, 
  Edit3, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  QrCode, 
  DollarSign,
  AlertCircle,
  Search,
  Zap,
  ExternalLink,
  Save,
  MessageCircle,
  FileText,
  Check
} from 'lucide-react';
import { formatCurrency, formatDateTime, getOrderStatusBadge } from '../utils/formatters';
import { playNotificationSound } from '../utils/audio';

interface SellerCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: Seller;
  products: Product[];
  orders: Order[];
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onToggleFlashSale: (productId: string, isFlashSale: boolean) => void;
  onUpdateSellerInfo?: (sellerId: string, updatedFields: Partial<Seller>) => void;
}

export const SellerCenterModal: React.FC<SellerCenterModalProps> = ({
  isOpen,
  onClose,
  seller,
  products,
  orders,
  onOpenAddProduct,
  onEditProduct,
  onUpdateOrderStatus,
  onDeleteProduct,
  onUpdateProductStock,
  onToggleFlashSale,
  onUpdateSellerInfo,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'payment' | 'analytics'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('Semua');

  // Filter products and orders belonging ONLY to this seller
  const sellerProducts = useMemo(() => {
    return products.filter((p) => p.sellerId === seller.id || p.sellerName === seller.name || p.sellerName === seller.shopName);
  }, [products, seller]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return sellerProducts;
    return sellerProducts.filter((p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(productSearch.toLowerCase())))
    );
  }, [sellerProducts, productSearch]);

  const sellerOrders = useMemo(() => {
    return orders.filter((o) => o.sellerId === seller.id || o.sellerName === seller.shopName || o.sellerName === seller.name);
  }, [orders, seller]);

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'Semua') return sellerOrders;
    return sellerOrders.filter((o) => o.status === orderStatusFilter);
  }, [sellerOrders, orderStatusFilter]);

  const totalEarnings = sellerOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = sellerOrders.filter((o) => o.status === 'preparing' || o.status === 'pending').length;

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    onUpdateOrderStatus(orderId, newStatus);
    playNotificationSound('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div 
        id="seller-center-modal-container"
        className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[92vh] overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  CMS Penjual: {seller.shopName}
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Gerai Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {seller.name} • {seller.department} (Pengurusan Jualan Sendiri)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-4 sm:p-5 bg-slate-100/60 border-b border-slate-200 shrink-0">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400">Jumlah Pendapatan</p>
            <p className="text-base sm:text-lg font-black text-indigo-600 mt-0.5">
              {formatCurrency(totalEarnings)}
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400">Pesanan Masuk</p>
            <p className="text-base sm:text-lg font-black text-slate-800 mt-0.5">
              {sellerOrders.length} Pesanan
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400">Perlu Disediakan</p>
            <p className="text-base sm:text-lg font-black text-amber-600 mt-0.5">
              {pendingOrdersCount} Pesanan Baru
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <p className="text-[10px] font-bold text-slate-400">Produk Gerai Anda</p>
            <p className="text-base sm:text-lg font-black text-emerald-600 mt-0.5">
              {sellerProducts.length} Item Aktif
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex gap-4 bg-white shrink-0 overflow-x-auto">
          {[
            { id: 'products', label: 'Urus Produk Jualan Saya', icon: <Package className="w-4 h-4" />, count: sellerProducts.length },
            { id: 'orders', label: 'Pesanan Masuk', icon: <ShoppingBag className="w-4 h-4" />, count: pendingOrdersCount > 0 ? pendingOrdersCount : undefined, countAlert: pendingOrdersCount > 0 },
            { id: 'payment', label: 'Info DuitNow & Bank', icon: <QrCode className="w-4 h-4" /> },
            { id: 'analytics', label: 'Prestasi Gerai', icon: <TrendingUp className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    tab.countAlert ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 bg-slate-50/50">
          {/* TAB 1: MANAGE OWN PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Cari produk dalam gerai anda..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <button
                  onClick={onOpenAddProduct}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Produk Baru</span>
                </button>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">Tiada Produk Dijumpai</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {productSearch ? 'Cuba kata kunci carian yang lain.' : 'Mulakan jualan dengan menambah produk pertama gerai anda.'}
                  </p>
                  <button
                    onClick={onOpenAddProduct}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Produk Sekarang
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                              {p.category}
                            </span>
                            {p.badge && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded">
                                {p.badge}
                              </span>
                            )}
                            {p.isFlashSale && (
                              <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <Zap className="w-2.5 h-2.5 fill-white" /> Kilat
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{p.title}</h4>
                          <p className="text-xs text-indigo-600 font-extrabold mt-0.5">
                            {formatCurrency(p.price)} <span className="text-[10px] text-slate-400 font-normal">/ {p.unit}</span>
                            {p.originalPrice && (
                              <span className="ml-1.5 text-[10px] text-slate-400 line-through">
                                {formatCurrency(p.originalPrice)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Stock Controller & Action Buttons */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-500 font-medium">Baki Stok:</span>
                          <span className={`font-extrabold text-xs px-2 py-0.5 rounded-lg ${
                            p.stock <= 3 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {p.stock}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => onUpdateProductStock(p.id, Math.max(0, p.stock - 1))}
                              className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                              title="Tolak 1"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => onUpdateProductStock(p.id, p.stock + 5)}
                              className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                              title="Tambah 5"
                            >
                              +5
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onToggleFlashSale(p.id, !p.isFlashSale)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                              p.isFlashSale ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                            title="Togol Jualan Kilat"
                          >
                            <Zap className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onEditProduct(p)}
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors cursor-pointer"
                            title="Kemaskini Produk"
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INCOMING ORDERS FOR SELLER */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-600 font-semibold">
                  Tapis Pesanan:
                </p>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="pending">Menunggu Bayaran / Baru</option>
                  <option value="preparing">Sedang Disediakan</option>
                  <option value="delivering">Sedang Dihantar ke Meja</option>
                  <option value="completed">Selesai Dihantar</option>
                </select>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <Package className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">Tiada Pesanan Dijumpai</p>
                  <p className="text-xs text-slate-400">
                    Sebaik sahaja rakan sekerja menempah produk anda, pesanan akan muncul di sini.
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusBadge = getOrderStatusBadge(order.status);

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              Pembeli: {order.buyerName}
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                              {order.buyerDepartment}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {formatDateTime(order.createdAt)} • No: #{order.orderNumber || order.id}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusBadge.bg} ${statusBadge.color} ${statusBadge.border}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs bg-slate-50/70 p-3 rounded-xl">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-slate-700">
                            <span>
                              • <strong>{item.quantity}x</strong> {item.productTitle} ({item.unit})
                              {item.specialNote && (
                                <span className="text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-sm ml-1 text-[10px] font-medium">
                                  Nota: &quot;{item.specialNote}&quot;
                                </span>
                              )}
                            </span>
                            <span className="font-bold text-slate-900">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery target & WhatsApp buyer */}
                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>
                            Lokasi Meja: <strong>{order.deliveryLocation.level} ({order.deliveryLocation.roomOrDesk})</strong>
                          </span>
                        </div>

                        <a
                          href={`https://wa.me/${order.buyerPhone.replace(/[^0-9]/g, '')}?text=Hai%20${encodeURIComponent(
                            order.buyerName
                          )},%20pesanan%20anda%20#${order.orderNumber || order.id}%20di%20F5%20MALL%20sedang%20diproses.`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp Pembeli ({order.buyerPhone})
                        </a>
                      </div>

                      {/* Action status controller */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <div className="text-xs">
                          <span className="text-slate-400">Jumlah Bayaran: </span>
                          <span className="font-extrabold text-indigo-600 text-sm">
                            {formatCurrency(order.totalAmount)}
                          </span>
                          <span className="text-[10px] text-slate-500 ml-1.5">
                            ({order.paymentMethod === 'duitnow_qr' ? 'DuitNow QR' : 'Bayar Waktu Terima (COD)'})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'preparing')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Sahkan & Mula Sediakan</span>
                            </button>
                          )}

                          {order.status === 'preparing' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'delivering')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Mula Hantar Ke Meja</span>
                            </button>
                          )}

                          {order.status === 'delivering' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'completed')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Tandakan Selesai Serah</span>
                            </button>
                          )}

                          {order.status === 'completed' && (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Pesanan Selesai Diserah
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: PAYMENT DETAILS & SETTINGS */}
          {activeTab === 'payment' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Maklumat Akaun Penerima Bayaran Gerai</h3>
                <p className="text-slate-500 text-[11px]">
                  Pembeli akan imbas DuitNow QR ini atau pindahkan terus ke akaun bank anda tanpa sebarang komisen pihak ketiga.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">Nama Pemegang Akaun:</label>
                  <p className="font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {seller.paymentInfo.accountHolder}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">Nama Bank:</label>
                  <p className="font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {seller.paymentInfo.bankName}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">Nombor Akaun Bank:</label>
                  <p className="font-mono font-bold text-indigo-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {seller.paymentInfo.accountNumber}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-500 font-semibold">No. Telefon WhatsApp Gerai:</label>
                  <p className="font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {seller.whatsapp}
                  </p>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-slate-500 font-semibold">Zon & Lokasi Penghantaran Yang Disediakan:</label>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-slate-700 font-medium">
                  {seller.deliveryLocations.map((loc, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{loc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Status Gerai: Disahkan aktif. Wang bayaran masuk 100% ke akaun anda.</span>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-400">Jumlah Unit Terjual</p>
                  <p className="text-lg font-black text-slate-800 mt-1">
                    {seller.totalSales} Unit
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-400">Purata Penilaian Pelanggan</p>
                  <p className="text-lg font-black text-amber-500 mt-1">
                    ⭐ {seller.rating.toFixed(1)} / 5.0
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-400">Kadar Pesanan Selesai</p>
                  <p className="text-lg font-black text-emerald-600 mt-1">
                    100% Tepat Masa
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
