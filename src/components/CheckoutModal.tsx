import React, { useState } from 'react';
import { Product, Seller, CartItem, PaymentMethodType, DeliveryLocation } from '../types';
import { 
  X, 
  Store, 
  ShieldCheck, 
  QrCode, 
  Building2, 
  MapPin, 
  Phone, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Copy,
  Check,
  CreditCard,
  Banknote
} from 'lucide-react';
import { formatCurrency, getPaymentMethodLabel } from '../utils/formatters';
import confetti from 'canvas-confetti';
import { playNotificationSound } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemsToCheckout: { item: CartItem; product: Product; seller: Seller }[];
  buyerName: string;
  buyerDepartment: string;
  buyerPhone: string;
  buyerDeskLocation: string;
  onConfirmOrders: (ordersCreated: any[]) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  itemsToCheckout,
  buyerName,
  buyerDepartment,
  buyerPhone,
  buyerDeskLocation,
  onConfirmOrders,
}) => {
  if (!isOpen || itemsToCheckout.length === 0) return null;

  // Group by seller since each seller has distinct DuitNow / Bank / Payment
  const groupedBySeller: { [sellerId: string]: { seller: Seller; items: typeof itemsToCheckout } } = {};
  itemsToCheckout.forEach((entry) => {
    if (!groupedBySeller[entry.seller.id]) {
      groupedBySeller[entry.seller.id] = {
        seller: entry.seller,
        items: [],
      };
    }
    groupedBySeller[entry.seller.id].items.push(entry);
  });

  const sellerList = Object.values(groupedBySeller);
  const [currentSellerIndex, setCurrentSellerIndex] = useState(0);
  const currentSellerGroup = sellerList[currentSellerIndex] || sellerList[0];

  // Delivery details state
  const [level, setLevel] = useState('Aras 3');
  const [roomOrDesk, setRoomOrDesk] = useState(buyerDeskLocation || 'Unit IT, Kubikel IT-14');
  const [phone, setPhone] = useState(buyerPhone || '012-3456789');
  const [deliveryType, setDeliveryType] = useState<'hantar_ke_meja' | 'ambil_sendiri'>('hantar_ke_meja');
  const [notes, setNotes] = useState('');

  // Payment states per seller
  const [paymentMethods, setPaymentMethods] = useState<{ [sellerId: string]: PaymentMethodType }>({
    [currentSellerGroup.seller.id]: 'duitnow_qr',
  });
  const [paymentProofs, setPaymentProofs] = useState<{ [sellerId: string]: string }>({});
  const [copiedBank, setCopiedBank] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const currentSeller = currentSellerGroup.seller;
  const currentItems = currentSellerGroup.items;
  const currentSubtotal = currentItems.reduce(
    (sum, it) => sum + it.product.price * it.item.quantity,
    0
  );

  const selectedPaymentMethod = paymentMethods[currentSeller.id] || 'duitnow_qr';

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSimulateUploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPaymentProofs((prev) => ({
          ...prev,
          [currentSeller.id]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // Default sample receipt image
      setPaymentProofs((prev) => ({
        ...prev,
        [currentSeller.id]: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
      }));
    }
  };

  const handleCompleteAllOrders = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const deliveryLocation: DeliveryLocation = {
        building: 'Wisma Utama Jabatan',
        level,
        roomOrDesk,
        contactPhone: phone,
        notes,
        deliveryType,
      };

      const createdOrders = sellerList.map((group) => {
        const subtotal = group.items.reduce(
          (sum, it) => sum + it.product.price * it.item.quantity,
          0
        );
        const method = paymentMethods[group.seller.id] || 'duitnow_qr';
        const proof = paymentProofs[group.seller.id];

        return {
          buyerId: 'user-001',
          buyerName,
          buyerDepartment,
          buyerPhone: phone,
          sellerId: group.seller.id,
          sellerName: group.seller.shopName,
          sellerDepartment: group.seller.department,
          items: group.items.map((it) => ({
            productId: it.product.id,
            productTitle: it.product.title,
            productImage: it.product.image,
            unitPrice: it.product.price,
            quantity: it.item.quantity,
            unit: it.product.unit,
            specialNote: it.item.specialNote,
          })),
          subtotal,
          discount: 0,
          totalAmount: subtotal,
          paymentMethod: method,
          paymentStatus: method === 'cod' ? 'pending' : (proof ? 'paid' : 'pending'),
          paymentProofUrl: proof,
          paymentProofTime: proof ? new Date().toISOString() : undefined,
          deliveryLocation,
          status: 'preparing' as const,
        };
      });

      setIsSubmitting(false);
      setOrderSuccess(true);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
      });

      playNotificationSound('success');

      setTimeout(() => {
        onConfirmOrders(createdOrders);
      }, 1800);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        id="checkout-modal-container"
        className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pengesahan Pesanan & Bayaran Terus
              </h2>
              <p className="text-xs text-slate-500">
                Pembayaran dibuat terus ke akaun DuitNow rakan sekerja yang menjual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {orderSuccess ? (
            <div className="text-center py-12 space-y-4 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Pesanan Berjaya Dihantar!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Penjual telah menerima notifikasi pesanan anda. Makanan / barangan akan disediakan dan dihantar terus ke meja anda mengikut aras yang ditetapkan.
              </p>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl max-w-sm mx-auto text-xs text-indigo-900 font-medium">
                📍 Penghantaran: {level}, {roomOrDesk}
              </div>
            </div>
          ) : (
            <>
              {/* Step Tabs for Multiple Sellers */}
              {sellerList.length > 1 && (
                <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1.5 overflow-x-auto">
                  {sellerList.map((g, idx) => (
                    <button
                      key={g.seller.id}
                      onClick={() => setCurrentSellerIndex(idx)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        currentSellerIndex === idx
                          ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>{g.seller.shopName.split('-')[0].trim()}</span>
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] px-1.5 py-0.2 rounded-md">
                        {formatCurrency(
                          g.items.reduce((s, it) => s + it.product.price * it.item.quantity, 0)
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Delivery Desk / Room Form */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Lokasi Penghantaran Dalam Bangunan Jabatan
                  </h3>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('hantar_ke_meja')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        deliveryType === 'hantar_ke_meja'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Hantar ke Meja
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('ambil_sendiri')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        deliveryType === 'ambil_sendiri'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Ambil Sendiri di Gerai
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Aras Bangunan
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option>Aras Bawah (Lobi Utama)</option>
                      <option>Aras 1 (Korporat & Khidmat Pelanggan)</option>
                      <option>Aras 2 (Bahagian Kewangan & Akaun)</option>
                      <option>Aras 3 (Unit IT & Sumber Manusia)</option>
                      <option>Aras 4 (Khidmat Pengurusan & Pentadbiran)</option>
                      <option>Aras 5 (Bahagian Perancang & Audit)</option>
                      <option>Aras 6 (Bilik Pengarah & Mesyuarat)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nama Bahagian / No. Kubikel
                    </label>
                    <input
                      type="text"
                      value={roomOrDesk}
                      onChange={(e) => setRoomOrDesk(e.target.value)}
                      placeholder="Cth: Unit IT, Meja 14"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      No. Telefon (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="012-XXXXXXX"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nota tambahan kepada runner/penjual (cth: letak atas meja tepi tingkap jika tiada di tempat)"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Items in Current Seller Order */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-indigo-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {currentSeller.shopName}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {currentSeller.name} ({currentSeller.department})
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-indigo-600">
                    Jumlah: {formatCurrency(currentSubtotal)}
                  </span>
                </div>

                <div className="space-y-2">
                  {currentItems.map(({ item, product }) => (
                    <div key={product.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate max-w-xs">
                            {product.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {formatCurrency(product.price)} x {item.quantity} {product.unit}
                          </p>
                        </div>
                      </div>

                      <span className="font-bold text-slate-800">
                        {formatCurrency(product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Specific Payment Mode (DuitNow QR / Bank Transfer / COD) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-indigo-600" />
                    Kaedah Pembayaran Penjual ({currentSeller.name})
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Akaun Sah Penjual
                  </span>
                </div>

                {/* Payment Method Selector Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethods((prev) => ({ ...prev, [currentSeller.id]: 'duitnow_qr' }))
                    }
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex flex-col gap-1 ${
                      selectedPaymentMethod === 'duitnow_qr'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-sm">📱</span>
                    <span>DuitNow QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethods((prev) => ({ ...prev, [currentSeller.id]: 'bank_transfer' }))
                    }
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex flex-col gap-1 ${
                      selectedPaymentMethod === 'bank_transfer'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-sm">🏦</span>
                    <span>Pindahan Bank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethods((prev) => ({ ...prev, [currentSeller.id]: 'tng_ewallet' }))
                    }
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex flex-col gap-1 ${
                      selectedPaymentMethod === 'tng_ewallet'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-sm">💳</span>
                    <span>TNG eWallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMethods((prev) => ({ ...prev, [currentSeller.id]: 'cod' }))
                    }
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex flex-col gap-1 ${
                      selectedPaymentMethod === 'cod'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-sm">💵</span>
                    <span>Tunai (COD)</span>
                  </button>
                </div>

                {/* Detail based on payment method */}
                {selectedPaymentMethod === 'duitnow_qr' && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-4 flex flex-col items-center">
                      <div className="w-36 h-36 bg-white p-2 rounded-2xl border-2 border-pink-500 shadow-sm flex items-center justify-center relative">
                        <img
                          src={currentSeller.paymentInfo.duitNowQrUrl}
                          alt="DuitNow QR Code"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute -bottom-2 bg-pink-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                          DuitNow QR Pay
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-3">Imbas guna mana-mana bank</p>
                    </div>

                    <div className="sm:col-span-8 space-y-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <p className="text-[10px] text-slate-400">Penerima Bayaran:</p>
                        <p className="font-bold text-slate-900">{currentSeller.paymentInfo.accountHolder}</p>
                        <p className="text-[11px] text-indigo-700 font-semibold">{currentSeller.shopName}</p>
                      </div>

                      <div className="flex items-center justify-between bg-indigo-50/70 p-2.5 rounded-xl">
                        <div>
                          <p className="text-[10px] text-indigo-900">Jumlah Perlu Dibayar:</p>
                          <p className="text-base font-extrabold text-indigo-700">
                            {formatCurrency(currentSubtotal)}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-500">Ruj: No. Pesanan / Nama Anda</span>
                      </div>

                      {currentSeller.paymentInfo.paymentInstructions && (
                        <p className="text-[11px] text-slate-500 italic">
                          💡 &quot;{currentSeller.paymentInfo.paymentInstructions}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'bank_transfer' && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                        <p className="text-[10px] text-slate-400 font-medium">Nama Bank:</p>
                        <p className="font-bold text-slate-900">{currentSeller.paymentInfo.bankName}</p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                        <p className="text-[10px] text-slate-400 font-medium">Nama Pemegang Akaun:</p>
                        <p className="font-bold text-slate-900">{currentSeller.paymentInfo.accountHolder}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-indigo-50/80 p-3 rounded-xl border border-indigo-100">
                      <div>
                        <p className="text-[10px] text-indigo-900">Nombor Akaun Bank:</p>
                        <p className="font-mono font-bold text-sm text-indigo-800">
                          {currentSeller.paymentInfo.accountNumber}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(currentSeller.paymentInfo.accountNumber)}
                        className="bg-white hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBank ? 'Disalin!' : 'Salin No. Akaun'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'tng_ewallet' && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <p className="text-[11px] text-slate-500">
                      Sila pindahkan bayaran ke nombor telefon Touch &apos;n Go eWallet penjual:
                    </p>
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <div>
                        <p className="text-[10px] text-blue-900">No. TNG Penjual:</p>
                        <p className="font-mono font-bold text-sm text-blue-800">
                          {currentSeller.paymentInfo.tngPhone || currentSeller.phone}
                        </p>
                        <p className="text-[10px] text-blue-700">{currentSeller.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyAccount(currentSeller.paymentInfo.tngPhone || currentSeller.phone)
                        }
                        className="bg-white text-blue-700 font-bold px-3 py-1.5 rounded-lg border border-blue-200 text-[11px]"
                      >
                        Salin No. TNG
                      </button>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'cod' && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      Bayaran Tunai Semasa Terima di Meja (COD)
                    </p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Sediakan wang tunai berjumlah{' '}
                      <strong className="text-slate-900">{formatCurrency(currentSubtotal)}</strong>{' '}
                      semasa runner atau penjual menyerahkan pesanan ke meja/kubikel anda.
                    </p>
                  </div>
                )}

                {/* Upload Receipt Proof (Optional for DuitNow/Bank/TNG) */}
                {selectedPaymentMethod !== 'cod' && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Lampirkan Bukti Pembayaran / Resit (Pilihan):
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-white hover:bg-slate-50 border border-dashed border-slate-300 hover:border-indigo-400 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors">
                        <Upload className="w-4 h-4 text-indigo-600" />
                        <span>Pilih Fail / Screenshot Resit</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleSimulateUploadProof}
                        />
                      </label>

                      {paymentProofs[currentSeller.id] ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Resit Berjaya Dilampirkan</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          *Boleh juga terus WhatsApp resit kepada penjual selepas ini.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Actions */}
        {!orderSuccess && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-slate-500">Jumlah Keseluruhan:</p>
              <p className="text-lg sm:text-xl font-extrabold text-indigo-600">
                {formatCurrency(
                  itemsToCheckout.reduce((s, it) => s + it.product.price * it.item.quantity, 0)
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>

              <button
                id="submit-confirm-orders-btn"
                type="button"
                disabled={isSubmitting}
                onClick={handleCompleteAllOrders}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Memproses Pesanan...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sahkan & Hantar Pesanan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
