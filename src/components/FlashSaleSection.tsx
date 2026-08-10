import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Zap, Clock, ChevronRight, ShoppingCart, Flame } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface FlashSaleSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const flashProducts = products.filter((p) => p.isFlashSale);

  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <section className="my-8 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl" id="flash-sale-section">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300">
            <Zap className="w-6 h-6 fill-amber-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                JUALAN KILAT WAKTU REHAT
              </h2>
              <span className="bg-amber-400 text-red-950 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full">
                FLASH SALE
              </span>
            </div>
            <p className="text-xs text-white/80">
              Harga istimewa terhad untuk tempahan sebelum jam rehat tengah hari
            </p>
          </div>
        </div>

        {/* Countdown Timer Blocks */}
        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-bold border border-white/10">
          <Clock className="w-3.5 h-3.5 text-amber-300 mr-1" />
          <span className="text-white/80 text-[11px] mr-1 hidden sm:inline">Tamat Dalam:</span>
          <span className="bg-red-900/80 px-2 py-1 rounded-lg text-white font-mono font-bold text-xs">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="font-bold text-amber-300">:</span>
          <span className="bg-red-900/80 px-2 py-1 rounded-lg text-white font-mono font-bold text-xs">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="font-bold text-amber-300">:</span>
          <span className="bg-red-900/80 px-2 py-1 rounded-lg text-white font-mono font-bold text-xs">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Flash Sale Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {flashProducts.map((product) => {
          const discountPercent = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 15;

          const percentSold = Math.min(
            95,
            Math.max(35, Math.round((product.soldCount / (product.soldCount + product.stock)) * 100))
          );

          return (
            <div
              key={product.id}
              id={`flash-product-card-${product.id}`}
              onClick={() => onSelectProduct(product)}
              className="bg-white text-gray-900 rounded-2xl p-3 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1 duration-200"
            >
              <div>
                {/* Image Container with Discount Badge */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>-{discountPercent}%</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-medium truncate">
                    📍 {product.sellerDepartment.split('(')[0].trim()}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-xs sm:text-sm text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {product.title}
                </h3>

                {/* Price */}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-red-600">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar and Quick Add */}
              <div className="mt-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold mb-1">
                  <span className="text-orange-700">🔥 Terjual {product.soldCount} unit</span>
                  <span>Tinggal {product.stock}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentSold}%` }}
                  />
                </div>

                <button
                  id={`flash-add-cart-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>+ Tambah Ke Troli</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
