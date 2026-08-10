import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  Seller, 
  Order, 
  Review, 
  NotificationItem, 
  UserProfile, 
  CartItem, 
  ProductCategory,
  OrderStatus
} from './types';
import { 
  getStoredProducts, 
  saveProducts, 
  getStoredSellers, 
  saveSellers, 
  getStoredOrders, 
  saveOrders, 
  getStoredReviews, 
  saveReviews, 
  getStoredNotifications, 
  saveNotifications, 
  getStoredUser, 
  saveUser, 
  getStoredCart, 
  saveCart,
  addProductToMall,
  updateProductInMall,
  deleteProductFromMall,
  updateSellerInMall,
  broadcastAdminNotification,
  updateOrderAdmin,
  updateOrderStatus,
  addReviewToProduct,
  addNotification,
  resetMallToDefaults
} from './utils/storage';
import { playNotificationSound } from './utils/audio';

// Components
import { Header } from './components/Header';
import { BannerSlider } from './components/BannerSlider';
import { FlashSaleSection } from './components/FlashSaleSection';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';

// Modals and Drawers
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AddProductModal } from './components/AddProductModal';
import { EditProductModal } from './components/EditProductModal';
import { SellerCenterModal } from './components/SellerCenterModal';
import { AdminCMSModal } from './components/AdminCMSModal';
import { SellerProfileModal } from './components/SellerProfileModal';
import { ReviewModal } from './components/ReviewModal';
import { NotificationModal } from './components/NotificationModal';

import { 
  SlidersHorizontal, 
  ShoppingBag, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowUpDown,
  RefreshCw,
  Package,
  Settings,
  Store
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Global App States from LocalStorage / Initial Data
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [sellers, setSellers] = useState<Seller[]>(getStoredSellers);
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);
  const [reviews, setReviews] = useState<Review[]>(getStoredReviews);
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredUser);
  const [cart, setCart] = useState<CartItem[]>(getStoredCart);

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Filters and Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'price-low' | 'price-high' | 'rating'>('popular');

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSellerCenterOpen, setIsSellerCenterOpen] = useState<boolean>(false);
  const [isAdminCMSOpen, setIsAdminCMSOpen] = useState<boolean>(false);
  const [selectedSellerForProfile, setSelectedSellerForProfile] = useState<Seller | null>(null);
  const [reviewModalData, setReviewModalData] = useState<{ product: Product; orderId: string } | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<{ title: string; body: string } | null>(null);

  // Sync with Storage on Event Listeners
  useEffect(() => {
    const handleProductsUpdate = (e: any) => setProducts(e.detail);
    const handleSellersUpdate = (e: any) => setSellers(e.detail);
    const handleOrdersUpdate = (e: any) => setOrders(e.detail);
    const handleReviewsUpdate = (e: any) => setReviews(e.detail);
    const handleNotifsUpdate = (e: any) => setNotifications(e.detail);
    const handleUserUpdate = (e: any) => setCurrentUser(e.detail);
    const handleCartUpdate = (e: any) => setCart(e.detail);

    window.addEventListener('pasarkita:products_updated', handleProductsUpdate);
    window.addEventListener('pasarkita:sellers_updated', handleSellersUpdate);
    window.addEventListener('pasarkita:orders_updated', handleOrdersUpdate);
    window.addEventListener('pasarkita:reviews_updated', handleReviewsUpdate);
    window.addEventListener('pasarkita:notifications_updated', handleNotifsUpdate);
    window.addEventListener('pasarkita:user_updated', handleUserUpdate);
    window.addEventListener('pasarkita:cart_updated', handleCartUpdate);

    return () => {
      window.removeEventListener('pasarkita:products_updated', handleProductsUpdate);
      window.removeEventListener('pasarkita:sellers_updated', handleSellersUpdate);
      window.removeEventListener('pasarkita:orders_updated', handleOrdersUpdate);
      window.removeEventListener('pasarkita:reviews_updated', handleReviewsUpdate);
      window.removeEventListener('pasarkita:notifications_updated', handleNotifsUpdate);
      window.removeEventListener('pasarkita:user_updated', handleUserUpdate);
      window.removeEventListener('pasarkita:cart_updated', handleCartUpdate);
    };
  }, []);

  const showToast = (title: string, body: string) => {
    setToastMessage({ title, body });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Cart Management Handlers
  const handleAddToCart = (product: Product, quantity: number = 1, specialNote?: string) => {
    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex((item) => item.productId === product.id);

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
      if (specialNote) updatedCart[existingIndex].specialNote = specialNote;
    } else {
      updatedCart.push({
        productId: product.id,
        sellerId: product.sellerId,
        quantity,
        specialNote,
      });
    }

    setCart(updatedCart);
    saveCart(updatedCart);
    if (soundEnabled) playNotificationSound('pop');
    showToast('🛒 Ditambah ke Troli', `${product.title} (${quantity} ${product.unit})`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const handleRemoveCartItem = (productId: string) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const handleUpdateItemNote = (productId: string, note: string) => {
    const updatedCart = cart.map((item) =>
      item.productId === productId ? { ...item, specialNote: note } : item
    );
    setCart(updatedCart);
    saveCart(updatedCart);
  };

  // Order Placement Handlers
  const handleCheckoutSuccess = (newOrders: Order[]) => {
    setCart([]);
    saveCart([]);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    if (soundEnabled) playNotificationSound('success');

    showToast('🎉 Pesanan Berjaya Dibuat!', `Sebanyak ${newOrders.length} pesanan telah dihantar ke penjual.`);

    // Automatically simulate seller progression in 8-15 seconds for interactive demo feel
    newOrders.forEach((ord, i) => {
      setTimeout(() => {
        updateOrderStatus(ord.id, 'delivering', `Penjual ${ord.sellerName} sedang bergerak menghantar ke ${ord.deliveryLocation.level}.`);
        if (soundEnabled) playNotificationSound('order');
        showToast('🚚 Pesanan Sedang Dihantar', `Runner ${ord.sellerName} sedang menuju ke ${ord.deliveryLocation.roomOrDesk}!`);
      }, 10000 + i * 5000);
    });
  };

  // Product Add Handler
  const handleAddProduct = (productData: Partial<Product>) => {
    const newProd = addProductToMall({
      title: productData.title || 'Produk Warga',
      description: productData.description || '',
      category: productData.category || 'Buah-buahan Segar',
      price: productData.price || 10,
      originalPrice: productData.originalPrice,
      stock: productData.stock || 10,
      unit: productData.unit || '1 unit',
      image: productData.image || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
      additionalImages: [],
      sellerId: currentUser.sellerId || currentUser.id,
      sellerName: currentUser.name,
      sellerDepartment: currentUser.department,
      deliveryOptions: productData.deliveryOptions || ['Hantar terus ke meja'],
      badge: productData.badge as any,
      tags: productData.tags || ['#WargaJabatan'],
      isFlashSale: productData.isFlashSale,
      flashSaleEndsAt: productData.isFlashSale
        ? new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
        : undefined,
    });

    if (!currentUser.isSeller && currentUser.role !== 'admin') {
      const updatedUser = {
        ...currentUser,
        role: 'seller' as const,
        isSeller: true,
        sellerId: currentUser.id,
      };
      setCurrentUser(updatedUser);
      saveUser(updatedUser);
    }

    showToast('✨ Produk Berjaya Diterbitkan', `"${newProd.title}" kini sedia ditempah oleh warga jabatan.`);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsEditProductOpen(true);
  };

  // Save Edited Product Handler
  const handleSaveEditedProduct = (updatedProduct: Product) => {
    const res = updateProductInMall(updatedProduct.id, updatedProduct);
    if (res) {
      showToast('✏️ Produk Dikemaskini', `Maklumat jualan "${updatedProduct.title}" berjaya dikemaskini.`);
      if (soundEnabled) playNotificationSound('success');
    }
  };

  // Delete product handler
  const handleDeleteProduct = (productId: string) => {
    const success = deleteProductFromMall(productId);
    if (success) {
      showToast('🗑️ Produk Dipadam', 'Produk telah dikeluarkan dari katalog mall.');
      if (soundEnabled) playNotificationSound('pop');
    }
  };

  // Stock update handler
  const handleUpdateProductStock = (productId: string, newStock: number) => {
    const updated = updateProductInMall(productId, { stock: Math.max(0, newStock) });
    if (updated) {
      showToast('📦 Stok Dikemaskini', `Baki stok kini: ${Math.max(0, newStock)} unit.`);
    }
  };

  // Toggle flash sale handler
  const handleToggleFlashSale = (productId: string, isFlashSale: boolean) => {
    updateProductInMall(productId, { isFlashSale });
    showToast('⚡ Jualan Kilat', isFlashSale ? 'Produk ditambah ke Jualan Kilat!' : 'Produk dikeluarkan dari Jualan Kilat.');
  };

  // Update seller info handler
  const handleUpdateSeller = (sellerId: string, updatedFields: Partial<Seller>) => {
    updateSellerInMall(sellerId, updatedFields);
    showToast('🏪 Maklumat Gerai Dikemaskini', 'Perubahan butiran penjual telah disimpan.');
  };

  // Broadcast Notification handler (Admin)
  const handleBroadcastNotification = (title: string, message: string, type: NotificationItem['type'] = 'promo') => {
    broadcastAdminNotification(title, message, type);
    showToast('📢 Hebahan Dihantar', 'Pengumuman berjaya disiarkan ke semua pengguna.');
  };

  // Reset Mall Data to Factory Defaults
  const handleResetMallDefaults = () => {
    resetMallToDefaults();
    showToast('🔄 Reset Selesai', 'Data F5 MALL telah dikembalikan kepada tetapan demo asal.');
    if (soundEnabled) playNotificationSound('success');
  };

  // Review Submit Handler
  const handleSubmitReview = (reviewData: Partial<Review>) => {
    if (!reviewData.productId || !reviewData.orderId) return;

    addReviewToProduct({
      productId: reviewData.productId,
      productTitle: reviewData.productTitle || '',
      orderId: reviewData.orderId,
      sellerId: reviewData.sellerId || '',
      buyerName: currentUser.name,
      buyerDepartment: currentUser.department,
      rating: reviewData.rating || 5,
      comment: reviewData.comment || '',
      tags: reviewData.tags || [],
    });

    showToast('⭐ Terima Kasih!', 'Penilaian anda telah direkodkan untuk rujukan warga jabatan.');
  };

  // Status updates from Seller Center / Admin CMS
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast('Status Pesanan Dikemaskini', `Pesanan #${orderId} kini berstatus: ${newStatus}`);
  };

  // Mark received by buyer
  const handleMarkOrderReceived = (orderId: string) => {
    updateOrderStatus(orderId, 'completed', `Pesanan telah disahkan terima oleh ${currentUser.name} di meja kerja.`);
    if (soundEnabled) playNotificationSound('success');
    showToast('✅ Pesanan Selesai', 'Terima kasih telah mengesahkan penerimaan pesanan!');
  };

  // User Switcher Handler
  const handleSwitchUser = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    saveUser(newUser);
    showToast('👤 Profil Ditukar', `Kini menggunakan profil: ${newUser.name} (${newUser.department})`);
  };

  // Notification actions
  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true, isRead: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  const handleSelectNotification = (notif: NotificationItem) => {
    if (notif.orderId) {
      setIsNotificationsOpen(false);
      setIsOrdersOpen(true);
    }
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sellerDepartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'popular':
        return list.sort((a, b) => b.soldCount - a.soldCount);
      case 'latest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ProductCategory, number> = {
      'Semua': products.length,
      'Buah-buahan Segar': 0,
      'Kek & Pastri': 0,
      'Sambal & Lauk Pauk': 0,
      'Kudapan & Minuman': 0,
      'Kraf & Keperluan Pejabat': 0,
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });
    return counts;
  }, [products]);

  // Flash sale products
  const flashSaleProducts = useMemo(() => {
    return products.filter((p) => p.isFlashSale || p.badge === 'HOT' || p.originalPrice);
  }, [products]);

  // Current active seller profile for Seller Center
  const activeSellerInfo: Seller = useMemo(() => {
    const found = sellers.find((s) => s.id === currentUser.sellerId || s.name.includes(currentUser.name));
    if (found) return found;
    return {
      id: currentUser.id,
      name: currentUser.name,
      shopName: `Gerai ${currentUser.name}`,
      avatar: currentUser.avatar,
      department: currentUser.department,
      phone: currentUser.phone,
      whatsapp: currentUser.phone.replace(/[^0-9]/g, ''),
      rating: 5.0,
      totalSales: 0,
      joinedDate: 'Hari Ini',
      paymentInfo: {
        bankName: 'Maybank',
        accountNumber: '1590 0000 1234',
        accountHolder: currentUser.name.toUpperCase(),
        acceptsCod: true,
      },
      deliveryLocations: ['Hantar ke Meja Kerja (Semua Aras)', 'Pantry Utama'],
      bio: `Gerai makanan & barangan khas warga ${currentUser.department}.`,
      isVerifiedStaff: true,
    };
  }, [sellers, currentUser]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" id="mall-app-root">
      {/* Toast Popups */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-70 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">{toastMessage.title}</h4>
            <p className="text-[11px] text-slate-300">{toastMessage.body}</p>
          </div>
        </div>
      )}

      {/* Global Header */}
      <Header
        user={currentUser}
        cart={cart}
        notifications={notifications}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSellerCenter={() => setIsSellerCenterOpen(true)}
        onOpenAdminCMS={() => setIsAdminCMSOpen(true)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Container Layout: LeftSidebar + Center Content + RightSidebar */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex-1 flex gap-8">
        {/* Left Column Navigation */}
        <LeftSidebar
          currentUser={currentUser}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onOpenOrders={() => setIsOrdersOpen(true)}
          onOpenSellerCenter={() => setIsSellerCenterOpen(true)}
          onOpenAdminCMS={() => setIsAdminCMSOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenAddProduct={() => setIsAddProductOpen(true)}
          ordersCount={orders.length}
          unreadNotificationsCount={notifications.filter((n) => !n.read && !n.isRead).length}
          categoryCounts={categoryCounts}
        />

        {/* Center Main Product Feed */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Hero Banner Carousel */}
          {!searchQuery && (
            <BannerSlider
              onSelectBanner={(bannerId) => {
                if (bannerId === 'harum-manis') {
                  setSearchQuery('Harum Manis');
                } else if (bannerId === 'sambal-bilis') {
                  setSearchQuery('Sambal');
                } else if (bannerId === 'open-store') {
                  setIsAddProductOpen(true);
                } else {
                  setSelectedCategory('Kek & Pastri');
                }
              }}
            />
          )}

          {/* Flash Sale Banner Section */}
          {!searchQuery && selectedCategory === 'Semua' && (
            <FlashSaleSection
              products={flashSaleProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Categories Pill Bar for mobile & quick jump */}
          <CategoryFilter
            categories={[
              'Semua',
              'Buah-buahan Segar',
              'Kek & Pastri',
              'Sambal & Lauk Pauk',
              'Kudapan & Minuman',
              'Kraf & Keperluan Pejabat',
            ]}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
            productsCount={products.length}
          />

          {/* Sorting & Filter Header Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800">
                {searchQuery ? `Hasil Carian: "${searchQuery}"` : selectedCategory === 'Semua' ? 'Semua Produk Gerai Warga' : selectedCategory}
              </h2>
              <span className="text-xs text-slate-400 font-semibold">
                ({sortedProducts.length} produk)
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-indigo-600 hover:underline font-bold ml-2 cursor-pointer"
                >
                  Padam carian
                </button>
              )}
            </div>

            {/* Sorting Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-slate-400 font-medium text-[11px] hidden sm:inline mr-1">
                Susun:
              </span>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  sortBy === 'popular'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Paling Popular
              </button>

              <button
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  sortBy === 'latest'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Terkini
              </button>

              <button
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  sortBy === 'rating'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Penilaian Tertinggi
              </button>

              <button
                onClick={() => setSortBy(sortBy === 'price-low' ? 'price-high' : 'price-low')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  sortBy === 'price-low' || sortBy === 'price-high'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Harga</span>
                <ArrowUpDown className="w-3 h-3" />
                {sortBy === 'price-low' && <span className="text-[10px]">(Rendah)</span>}
                {sortBy === 'price-high' && <span className="text-[10px]">(Tinggi)</span>}
              </button>
            </div>
          </div>

          {/* Product Grid Feed */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Tiada Produk Ditemui
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tiada produk yang sepadan dengan kata kunci carian atau kategori yang dipilih. Cuba tukar carian atau jadilah staf pertama yang menjual produk ini!
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                }}
                className="mt-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Lihat Semua Produk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onOpenSellerShop={(sellerId) => {
                    const seller = sellers.find((s) => s.id === sellerId || s.name === product.sellerName);
                    if (seller) setSelectedSellerForProfile(seller);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column Widgets */}
        <RightSidebar
          sellers={sellers}
          recentOrders={orders}
          notifications={notifications}
          onOpenSellerProfile={(seller) => setSelectedSellerForProfile(seller)}
          onOpenOrders={() => setIsOrdersOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />
      </main>

      {/* MODALS & DRAWERS */}

      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={(prod, qty, note) => {
          handleAddToCart(prod, qty, note);
          setSelectedProduct(null);
          setIsCartOpen(true);
        }}
        reviews={reviews.filter((r) => r.productId === selectedProduct?.id)}
        seller={sellers.find((s) => s.id === selectedProduct?.sellerId || s.name === selectedProduct?.sellerName) || null}
        onOpenSellerProfile={(seller) => {
          setSelectedProduct(null);
          setSelectedSellerForProfile(seller);
        }}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        products={products}
        sellers={sellers}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onUpdateNote={handleUpdateItemNote}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Checkout Modal with Individual Seller Payment Separation */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        products={products}
        sellers={sellers}
        currentUser={currentUser}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* 4. Order History & Official Receipt Modal */}
      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        sellers={sellers}
        onOpenReviewModal={(product, orderId) => {
          setReviewModalData({ product, orderId });
        }}
        onMarkOrderReceived={handleMarkOrderReceived}
      />

      {/* 5. Add / Promote Product Modal with AI Magic Generator */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
        currentUser={{
          name: currentUser.name,
          department: currentUser.department,
          phone: currentUser.phone,
        }}
      />

      {/* 6. Edit Product Modal (Accessible by Admin and Seller) */}
      <EditProductModal
        isOpen={isEditProductOpen}
        onClose={() => {
          setIsEditProductOpen(false);
          setProductToEdit(null);
        }}
        product={productToEdit}
        sellers={sellers}
        isAdmin={currentUser.role === 'admin'}
        onSaveProduct={handleSaveEditedProduct}
      />

      {/* 7. Seller Center CMS Modal (Penjual hanya mengurus jualan sendiri) */}
      <SellerCenterModal
        isOpen={isSellerCenterOpen}
        onClose={() => setIsSellerCenterOpen(false)}
        seller={activeSellerInfo}
        products={products}
        orders={orders}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onEditProduct={handleOpenEditProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteProduct={handleDeleteProduct}
        onUpdateProductStock={handleUpdateProductStock}
        onToggleFlashSale={handleToggleFlashSale}
        onUpdateSellerInfo={handleUpdateSeller}
      />

      {/* 8. Admin CMS Modal (Admin mengurus the whole system) */}
      <AdminCMSModal
        isOpen={isAdminCMSOpen}
        onClose={() => setIsAdminCMSOpen(false)}
        products={products}
        sellers={sellers}
        orders={orders}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onEditProduct={handleOpenEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateProductStock={handleUpdateProductStock}
        onToggleFlashSale={handleToggleFlashSale}
        onUpdateSeller={handleUpdateSeller}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onBroadcastNotification={handleBroadcastNotification}
        onResetDefaults={handleResetMallDefaults}
      />

      {/* 9. Seller Profile & Store View Modal */}
      <SellerProfileModal
        isOpen={!!selectedSellerForProfile}
        onClose={() => setSelectedSellerForProfile(null)}
        seller={selectedSellerForProfile}
        products={products}
        reviews={reviews}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* 10. Star Rating & Feedback Review Modal */}
      <ReviewModal
        isOpen={!!reviewModalData}
        onClose={() => setReviewModalData(null)}
        product={reviewModalData?.product || null}
        orderId={reviewModalData?.orderId}
        currentUser={{
          name: currentUser.name,
          department: currentUser.department,
        }}
        onSubmitReview={handleSubmitReview}
      />

      {/* 11. Real-time Notification Center Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearNotifications={handleClearNotifications}
        onSelectNotification={handleSelectNotification}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Sleek Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white font-black flex items-center justify-center text-[10px] tracking-tighter shadow-xs">
              F5
            </div>
            <span className="font-bold text-slate-800">F5 MALL</span>
            <span>• Komuniti Jual Beli Dalaman Warga Organisasi</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>DuitNow QR Terus ke Penjual</span>
            <span>•</span>
            <span>Penghantaran Terus ke Meja & Kubikel</span>
            <span>•</span>
            <span>Tanpa Caj Perkhidmatan (0% Komisen)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
