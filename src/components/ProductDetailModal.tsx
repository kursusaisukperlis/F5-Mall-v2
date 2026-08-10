import React, { useState } from 'react';
import { Product, Seller, Review } from '../types';
import { 
  X, 
  Star, 
  Store, 
  Truck, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  ShoppingCart, 
  Check, 
  Clock, 
  Tag, 
  UserCheck, 
  Sparkles,
  Minus,
  Plus
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  seller: Seller | null;
  reviews: Review[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, note?: string) => void;
  onBuyNow: (product: Product, quantity: number, note?: string) => void;
  onOpenSellerProfile: (sellerId: string) => void;
  onOpenReviewModal: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  seller,
  reviews,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenSellerProfile,
  onOpenReviewModal,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [specialNote, setSpecialNote] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'seller'>('details');

  const allImages = [product.image, ...(product.additionalImages || [])];
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        id="product-detail-modal-container"
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-gray-100"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
              {product.category}
            </span>
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
              ID: {product.id}
            </span>
          </div>

          <button
            id="close-product-detail-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Top Main Section (Gallery + Summary) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs relative">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === img
                          ? 'border-orange-500 ring-2 ring-orange-500/20 scale-105'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Summary Column */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug">
                  {product.title}
                </h1>

                {/* Rating & Sold count */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 font-semibold">{productReviews.length} Ulasan Pembeli</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 font-semibold">{product.soldCount} Terjual</span>
                </div>

                {/* Price Box */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100/80">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-orange-600">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-gray-600 ml-1">
                      / {product.unit}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Bayaran terus kepada penjual (DuitNow QR / COD)
                  </p>
                </div>

                {/* Seller Quick Card */}
                {seller && (
                  <div className="mt-4 p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={seller.avatar}
                        alt={seller.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-400 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-gray-900 truncate">{seller.shopName}</p>
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-sm shrink-0">
                            Staf Sah
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{seller.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`https://wa.me/${seller.whatsapp}?text=Hai%20${encodeURIComponent(
                          seller.name
                        )},%20saya%20berminat%20dengan%20produk%20"${encodeURIComponent(
                          product.title
                        )}"%20di%20F5%20MALL.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        title="Chat WhatsApp Penjual"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => onOpenSellerProfile(seller.id)}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-xl transition-colors"
                      >
                        Lihat Gerai
                      </button>
                    </div>
                  </div>
                )}

                {/* Delivery Options */}
                <div className="mt-4 space-y-1.5">
                  <p className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-orange-500" /> Pilihan Penghantaran Jabatan:
                  </p>
                  <div className="space-y-1 pl-4">
                    {product.deliveryOptions.map((opt, i) => (
                      <p key={i} className="text-xs text-gray-600 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600" /> {opt}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity & Actions Bar */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Kuantiti Pesanan:</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        id="qty-decrease-btn"
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-200 text-gray-700 disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-extrabold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        id="qty-increase-btn"
                        onClick={handleIncrease}
                        disabled={quantity >= product.stock}
                        className="p-2 hover:bg-gray-200 text-gray-700 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      Baki: <strong className="text-gray-800">{product.stock}</strong> unit
                    </span>
                  </div>
                </div>

                {/* Special Note */}
                <input
                  type="text"
                  placeholder="Nota khas (cth: hantar sebelum jam 12.30 tengah hari / ekstra pedas)"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-gray-50"
                />

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    id="add-to-cart-modal-btn"
                    onClick={() => {
                      onAddToCart(product, quantity, specialNote);
                    }}
                    className="flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs sm:text-sm py-3 rounded-2xl transition-all border border-orange-200 active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Tambah Ke Troli</span>
                  </button>

                  <button
                    id="buy-now-modal-btn"
                    onClick={() => {
                      onBuyNow(product, quantity, specialNote);
                    }}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm py-3 rounded-2xl transition-all shadow-md shadow-orange-500/20 active:scale-95"
                  >
                    <span>Beli Terus</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Penerangan, Ulasan Penilaian, Info Penjual) */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Penerangan Produk
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>Penilaian & Ulasan Warga</span>
                <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.2 rounded-full">
                  {productReviews.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className={`py-2.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
                  activeTab === 'seller'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Maklumat Penjual & DuitNow
              </button>
            </div>

            {/* Tab 1: Product Description */}
            {activeTab === 'details' && (
              <div className="py-4 space-y-3 animate-in fade-in">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>

                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {product.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Reviews */}
            {activeTab === 'reviews' && (
              <div className="py-4 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between bg-orange-50/60 p-4 rounded-2xl border border-orange-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-orange-600">{product.rating.toFixed(1)}</span>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= Math.round(product.rating) ? 'fill-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Berdasarkan {productReviews.length} ulasan kakitangan jabatan
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenReviewModal(product)}
                    className="text-xs font-bold bg-white hover:bg-orange-50 text-orange-700 border border-orange-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    + Tulis Ulasan
                  </button>
                </div>

                {productReviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    Belum ada ulasan untuk produk ini. Jadilah yang pertama membeli & memberi ulasan!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productReviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-orange-200 text-orange-800 font-bold text-xs flex items-center justify-center">
                              {rev.buyerName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800">{rev.buyerName}</p>
                              <p className="text-[10px] text-gray-400">{rev.buyerDepartment}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <div className="flex text-amber-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400 ml-1">
                              {formatDate(rev.createdAt)}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

                        {rev.tags && rev.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {rev.tags.map((t, idx) => (
                              <span key={idx} className="text-[10px] bg-white text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-100">
                                ✓ {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {rev.sellerReply && (
                          <div className="mt-2 p-2.5 rounded-xl bg-orange-100/50 border border-orange-200/60 text-xs">
                            <p className="font-bold text-orange-900 text-[11px] flex items-center gap-1">
                              <Store className="w-3 h-3" /> Respon Penjual:
                            </p>
                            <p className="text-orange-950 mt-0.5 text-[11px]">{rev.sellerReply.message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Seller info */}
            {activeTab === 'seller' && seller && (
              <div className="py-4 space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{seller.name}</h4>
                      <p className="text-xs text-gray-600">{seller.shopName}</p>
                      <p className="text-xs text-emerald-700 font-semibold">{seller.department}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600">{seller.bio}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-200 text-xs">
                    <div className="p-2 bg-white rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400">Rating Penjual</p>
                      <p className="font-bold text-gray-800 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {seller.rating} / 5.0
                      </p>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400">Jumlah Jualan</p>
                      <p className="font-bold text-gray-800">{seller.totalSales} Pesanan</p>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400">DuitNow QR</p>
                      <p className="font-bold text-emerald-600">Tersedia & Aktif</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
