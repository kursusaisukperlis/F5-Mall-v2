import React from 'react';
import { Product } from '../types';
import { Star, Plus, Truck, Store, Flame, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenSellerShop?: (sellerId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onOpenSellerShop,
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'HOT':
        return 'bg-rose-500 text-white';
      case 'FRESH':
        return 'bg-emerald-600 text-white';
      case 'VIRAL':
        return 'bg-purple-600 text-white';
      case 'TERLARIS':
        return 'bg-amber-500 text-slate-900 font-extrabold';
      case 'PROMO':
        return 'bg-indigo-600 text-white';
      default:
        return 'bg-indigo-600 text-white';
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group"
    >
      {/* Top Image Section */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Promo / Hot Badge */}
        {product.badge && (
          <div
            className={`absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 ${getBadgeStyle(
              product.badge
            )}`}
          >
            {product.badge === 'HOT' && <Flame className="w-3 h-3 fill-white" />}
            {product.badge === 'FRESH' && <Sparkles className="w-3 h-3" />}
            <span>{product.badge}</span>
          </div>
        )}

        {/* Discount % Pill */}
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-amber-400 text-amber-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
            -{discountPercent}%
          </div>
        )}

        {/* Unit Info Tag at bottom */}
        <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
          {product.unit}
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Seller / Department Location Tag */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
            <Store className="w-3 h-3 text-indigo-600 shrink-0" />
            <span
              onClick={(e) => {
                if (onOpenSellerShop) {
                  e.stopPropagation();
                  onOpenSellerShop(product.sellerId);
                }
              }}
              className="font-semibold text-slate-700 hover:text-indigo-600 hover:underline truncate"
            >
              {product.sellerName.split('-')[0].trim()}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>

          {/* Delivery to Desk Badge */}
          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
            <Truck className="w-3 h-3 shrink-0" />
            <span className="truncate">Hantar ke Meja / Pantry</span>
          </div>
        </div>

        {/* Price & Rating & Add to Cart Footer */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-baseline justify-between gap-1 mb-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-extrabold text-indigo-600">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Quick Add To Cart Button */}
            <button
              id={`quick-add-cart-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white flex items-center justify-center transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer"
              title="Tambah ke troli"
            >
              <Plus className="w-4 h-4 font-bold" />
            </button>
          </div>

          {/* Rating & Sold count */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400">({product.reviewCount})</span>
            </div>
            <span className="text-slate-500 font-medium">
              {product.soldCount} terjual
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
