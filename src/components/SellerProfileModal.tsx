import React from 'react';
import { Seller, Product, Review } from '../types';
import { 
  X, 
  Star, 
  Store, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Package, 
  ShieldCheck, 
  Truck,
  Plus
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SellerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: Seller | null;
  products: Product[];
  reviews: Review[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SellerProfileModal: React.FC<SellerProfileModalProps> = ({
  isOpen,
  onClose,
  seller,
  products,
  reviews,
  onSelectProduct,
  onAddToCart,
}) => {
  if (!isOpen || !seller) return null;

  const sellerProducts = products.filter((p) => p.sellerId === seller.id || p.sellerName === seller.name);
  const sellerReviews = reviews.filter((r) => r.sellerId === seller.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        id="seller-profile-modal-container"
        className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header with Cover */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap items-center gap-4">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30 shadow-lg"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold">{seller.shopName}</h2>
                <span className="bg-emerald-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Staf Sah
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium">
                {seller.name} • 📍 {seller.department}
              </p>
              <div className="flex items-center gap-3 text-xs pt-1">
                <span className="flex items-center gap-1 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  {seller.rating.toFixed(1)} / 5.0
                </span>
                <span>•</span>
                <span>{seller.totalSales} Pesanan Berjaya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Actions Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="text-slate-600 italic max-w-md">
            &quot;{seller.bio}&quot;
          </p>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${seller.whatsapp}?text=Hai%20${encodeURIComponent(
                seller.name
              )},%20saya%20melihat%20gerai%20anda%20di%20F5%20MALL.`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Penjual</span>
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-slate-50/40">
          {/* Products from this seller */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-600" />
              <span>Produk Gerai Ini ({sellerProducts.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sellerProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600">
                      {product.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">{product.unit}</p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-600">
                      {formatCurrency(product.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white flex items-center justify-center transition-colors"
                      title="Tambah ke troli"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Reviews */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Ulasan Pembeli ({sellerReviews.length})</span>
            </h3>

            {sellerReviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Belum ada ulasan untuk gerai ini.</p>
            ) : (
              <div className="space-y-2.5">
                {sellerReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{rev.buyerName}</span>
                        <span className="text-[10px] text-slate-400">({rev.buyerDepartment})</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
