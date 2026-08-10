import React from 'react';
import { CartItem, Product, Seller } from '../types';
import { 
  X, 
  Trash2, 
  Store, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  sellers: Seller[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedCheckout: (selectedItems: { item: CartItem; product: Product; seller: Seller }[]) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  sellers,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  // Group cart items by sellerId
  const cartWithDetails = cart
    .map((c) => {
      const product = products.find((p) => p.id === c.productId);
      const seller = sellers.find((s) => s.id === (product?.sellerId || c.sellerId));
      if (!product || !seller) return null;
      return { item: c, product, seller };
    })
    .filter(Boolean) as { item: CartItem; product: Product; seller: Seller }[];

  const groupedBySeller: { [sellerId: string]: { seller: Seller; items: typeof cartWithDetails } } = {};

  cartWithDetails.forEach((entry) => {
    if (!groupedBySeller[entry.seller.id]) {
      groupedBySeller[entry.seller.id] = {
        seller: entry.seller,
        items: [],
      };
    }
    groupedBySeller[entry.seller.id].items.push(entry);
  });

  const totalAmount = cartWithDetails.reduce(
    (acc, curr) => acc + curr.product.price * curr.item.quantity,
    0
  );

  const handleCheckoutSeller = (sellerId: string) => {
    const sellerItems = groupedBySeller[sellerId]?.items || [];
    if (sellerItems.length > 0) {
      onProceedCheckout(sellerItems);
    }
  };

  const handleCheckoutAll = () => {
    if (cartWithDetails.length > 0) {
      onProceedCheckout(cartWithDetails);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        id="cart-drawer-container"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900">
                Troli Belian Saya ({cart.length})
              </h2>
              <p className="text-[11px] text-gray-500">
                Item disusun mengikut gerai penjual jabatan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
                title="Kosongkan troli"
              >
                Kosongkan
              </button>
            )}
            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {cartWithDetails.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Troli Anda Masih Kosong</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Terokai buah-buahan segar, kek moist, dan aneka sambal sedap dari rakan sekerja sekarang!
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
              >
                Mula Membeli-belah
              </button>
            </div>
          ) : (
            Object.values(groupedBySeller).map(({ seller, items }) => {
              const sellerSubtotal = items.reduce(
                (sum, it) => sum + it.product.price * it.item.quantity,
                0
              );

              return (
                <div
                  key={seller.id}
                  className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xs"
                >
                  {/* Seller Group Header */}
                  <div className="p-3 bg-gradient-to-r from-orange-50/70 to-amber-50/70 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Store className="w-4 h-4 text-orange-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {seller.shopName}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-medium truncate">
                          📍 {seller.department}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCheckoutSeller(seller.id)}
                      className="text-[11px] font-bold text-orange-700 hover:text-orange-800 bg-white hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                    >
                      Bayar Gerai Ini ({formatCurrency(sellerSubtotal)})
                    </button>
                  </div>

                  {/* Seller Items List */}
                  <div className="divide-y divide-gray-100">
                    {items.map(({ item, product }) => (
                      <div key={product.id} className="p-3 flex items-start gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-800 line-clamp-1">
                            {product.title}
                          </h4>
                          <p className="text-[10px] text-gray-400">{product.unit}</p>

                          {item.specialNote && (
                            <p className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-sm mt-1 truncate">
                              Nota: {item.specialNote}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-extrabold text-orange-600">
                              {formatCurrency(product.price * item.quantity)}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(product.id, Math.max(1, item.quantity - 1))
                                  }
                                  className="p-1 hover:bg-gray-200 text-gray-700"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 text-center text-xs font-bold text-gray-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(
                                      product.id,
                                      Math.min(product.stock, item.quantity + 1)
                                    )
                                  }
                                  className="p-1 hover:bg-gray-200 text-gray-700"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => onRemoveItem(product.id)}
                                className="text-gray-400 hover:text-rose-600 p-1 transition-colors"
                                title="Buang item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Bottom Checkout Footer */}
        {cartWithDetails.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Jumlah Keseluruhan ({cart.length} item):</span>
              <span className="text-lg font-extrabold text-orange-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-500 bg-white p-2.5 rounded-xl border border-gray-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Pembayaran berasingan mengikut DuitNow QR setiap rakan sekerja.
              </span>
            </div>

            <button
              id="proceed-checkout-btn"
              onClick={handleCheckoutAll}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm py-3.5 rounded-2xl transition-all shadow-md shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Teruskan Pembayaran ({formatCurrency(totalAmount)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
