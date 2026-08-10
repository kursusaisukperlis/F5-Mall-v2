import React, { useState } from 'react';
import { Order, OrderStatus, Product, Seller } from '../types';
import { 
  X, 
  ShoppingBag, 
  Store, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Star, 
  AlertCircle,
  FileText,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatDateTime, getOrderStatusBadge, getPaymentMethodLabel } from '../utils/formatters';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  sellers: Seller[];
  onOpenReviewModal: (product: Product, orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onMarkOrderReceived?: (orderId: string) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  sellers,
  onOpenReviewModal,
  onCancelOrder,
  onMarkOrderReceived,
}) => {
  if (!isOpen) return null;

  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const filterTabs = [
    { id: 'all', label: 'Semua Pesanan', count: orders.length },
    { id: 'preparing', label: 'Sedang Disediakan', count: orders.filter((o) => o.status === 'preparing').length },
    { id: 'delivering', label: 'Sedang Dihantar', count: orders.filter((o) => o.status === 'delivering').length },
    { id: 'completed', label: 'Selesai', count: orders.filter((o) => o.status === 'completed').length },
  ];

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusTab === 'all') return true;
    return o.status === selectedStatusTab;
  });

  const getSellerInfo = (sellerId: string) => {
    return sellers.find((s) => s.id === sellerId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        id="order-history-modal-container"
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Rekod & Sejarah Belian Saya
              </h2>
              <p className="text-xs text-slate-500">
                Pantau status penyediaan makanan dan penghantaran ke kubikel anda
              </p>
            </div>
          </div>

          <button
            id="close-order-history-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="px-6 pt-3 border-b border-slate-100 flex gap-2 overflow-x-auto bg-white">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatusTab === tab.id
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedStatusTab === tab.id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List Body */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1 bg-slate-50/50">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-slate-200">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Tiada Rekod Pesanan</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Anda belum mempunyai pesanan dalam kategori ini. Layari gerai maya rakan sekerja untuk membuat pesanan baru!
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const seller = getSellerInfo(order.sellerId);
              const statusBadge = getOrderStatusBadge(order.status);

              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Card Header */}
                  <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Store className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900">
                          {order.sellerName}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-2">
                          ({order.sellerDepartment})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusBadge.bg} ${statusBadge.color} ${statusBadge.border}`}
                      >
                        {statusBadge.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        #{order.id}
                      </span>
                    </div>
                  </div>

                  {/* Order Progress Stepper */}
                  <div className="px-5 py-3 border-b border-slate-100 bg-white">
                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      {/* Step 1 */}
                      <div className="space-y-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center mx-auto">
                          ✓
                        </div>
                        <p className="text-[10px] font-bold text-slate-800">Dipesan</p>
                      </div>

                      {/* Step 2 */}
                      <div className="space-y-1">
                        <div
                          className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center mx-auto ${
                            order.status !== 'pending' && order.status !== 'cancelled'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {order.status !== 'pending' && order.status !== 'cancelled' ? '✓' : '2'}
                        </div>
                        <p className="text-[10px] font-bold text-slate-800">Disediakan</p>
                      </div>

                      {/* Step 3 */}
                      <div className="space-y-1">
                        <div
                          className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center mx-auto ${
                            order.status === 'delivering' || order.status === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {order.status === 'completed' ? '✓' : '3'}
                        </div>
                        <p className="text-[10px] font-bold text-slate-800">Dihantar ke Meja</p>
                      </div>

                      {/* Step 4 */}
                      <div className="space-y-1">
                        <div
                          className={`w-6 h-6 rounded-full font-bold text-[10px] flex items-center justify-center mx-auto ${
                            order.status === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {order.status === 'completed' ? '✓' : '4'}
                        </div>
                        <p className="text-[10px] font-bold text-slate-800">Selesai</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 divide-y divide-slate-100">
                    {order.items.map((item, i) => (
                      <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.productImage}
                            alt={item.productTitle}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {item.productTitle}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {formatCurrency(item.unitPrice)} x {item.quantity} {item.unit}
                            </p>
                            {item.specialNote && (
                              <p className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-sm mt-0.5 inline-block">
                                Nota: {item.specialNote}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location & Timeline details */}
                  <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">
                        Hantar ke: <strong>{order.deliveryLocation.level}, {order.deliveryLocation.roomOrDesk}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600 sm:justify-end">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px] text-slate-500">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Footer with Actions */}
                  <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Jumlah Bayaran:</span>
                      <span className="text-base font-extrabold text-indigo-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {/* WhatsApp Seller */}
                      {seller && (
                        <a
                          href={`https://wa.me/${seller.whatsapp}?text=Hai%20${encodeURIComponent(
                            seller.name
                          )},%20saya%20ingin%20bertanya%20mengenai%20pesanan%20F5%20MALL%20%23${
                            order.id
                          }`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Penjual</span>
                        </a>
                      )}

                      {/* View Receipt */}
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Resit</span>
                      </button>

                      {/* Confirm Received Button if delivering */}
                      {order.status === 'delivering' && onMarkOrderReceived && (
                        <button
                          onClick={() => onMarkOrderReceived(order.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1 active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sahkan Terima di Meja</span>
                        </button>
                      )}

                      {/* Rate / Review Button if completed */}
                      {order.status === 'completed' && (
                        <button
                          onClick={() => {
                            const firstItem = order.items[0];
                            const dummyProduct: Product = {
                              id: firstItem.productId,
                              title: firstItem.productTitle,
                              description: '',
                              price: firstItem.unitPrice,
                              category: 'Kek & Pastri',
                              sellerId: order.sellerId,
                              sellerName: order.sellerName,
                              sellerDepartment: order.sellerDepartment,
                              image: firstItem.productImage,
                              rating: 5,
                              reviewCount: 1,
                              soldCount: 1,
                              stock: 10,
                              unit: firstItem.unit,
                              deliveryOptions: ['Hantar ke Meja'],
                              tags: [],
                              createdAt: new Date().toISOString(),
                            };
                            onOpenReviewModal(dummyProduct, order.id);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>Beri Penilaian</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Resit Rasmi */}
        {selectedReceiptOrder && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-xs tracking-tighter flex items-center justify-center shadow-xs">
                    F5
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">F5 MALL</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Resit Belian Warga Rasmi</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <p className="text-[10px] text-slate-400">No. Pesanan:</p>
                    <p className="font-bold font-mono text-slate-800">{selectedReceiptOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Tarikh & Masa:</p>
                    <p className="font-medium text-slate-800">
                      {formatDateTime(selectedReceiptOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Penjual:</p>
                    <p className="font-bold text-slate-800">{selectedReceiptOrder.sellerName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Pembeli:</p>
                    <p className="font-bold text-slate-800">{selectedReceiptOrder.buyerName}</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {selectedReceiptOrder.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{it.productTitle}</p>
                        <p className="text-[10px] text-slate-400">
                          {formatCurrency(it.unitPrice)} x {it.quantity} {it.unit}
                        </p>
                      </div>
                      <span className="font-bold text-slate-800">
                        {formatCurrency(it.unitPrice * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <span className="font-bold text-indigo-950">Jumlah Keseluruhan:</span>
                  <span className="text-base font-extrabold text-indigo-700">
                    {formatCurrency(selectedReceiptOrder.totalAmount)}
                  </span>
                </div>

                <p className="text-[10px] text-center text-slate-400">
                  Terima kasih kerana menyokong perniagaan sesama rakan sekerja jabatan!
                </p>
              </div>

              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl"
              >
                Tutup Resit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
