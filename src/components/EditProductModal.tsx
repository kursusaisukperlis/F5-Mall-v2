import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, Seller } from '../types';
import { 
  X, 
  Save, 
  Image as ImageIcon, 
  Tag, 
  DollarSign, 
  Layers, 
  Check, 
  Zap, 
  Sparkles,
  Truck,
  Box,
  FileText
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  sellers: Seller[];
  isAdmin: boolean;
  onSaveProduct: (updatedProduct: Product) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Buah-buahan Segar',
  'Kek & Pastri',
  'Sambal & Lauk Pauk',
  'Kudapan & Minuman',
  'Kraf & Keperluan Pejabat',
];

const PRESET_IMAGES = [
  { label: 'Mangga Harum Manis', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sambal Garing Bilis', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Kek Coklat Fudge', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80' },
  { label: 'Nanas Madu MD2', url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&auto=format&fit=crop&q=80' },
  { label: 'Nasi Lemak Daun Pisang', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80' },
  { label: 'Kopi Kampung Latte', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Donut Susu Gebu', url: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Kerepek Pisang Salai', url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Puding Karamel', url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80' },
  { label: 'Buah Campur Segar', url: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Organizer Meja Kayu', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80' },
];

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  sellers,
  isAdmin,
  onSaveProduct,
}) => {
  if (!isOpen || !product) return null;

  const [title, setTitle] = useState(product.title);
  const [category, setCategory] = useState<ProductCategory>(product.category);
  const [price, setPrice] = useState<number>(product.price);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(product.originalPrice);
  const [stock, setStock] = useState<number>(product.stock);
  const [unit, setUnit] = useState(product.unit);
  const [image, setImage] = useState(product.image);
  const [description, setDescription] = useState(product.description);
  const [badge, setBadge] = useState<string>(product.badge || '');
  const [isFlashSale, setIsFlashSale] = useState<boolean>(product.isFlashSale || false);
  const [sellerId, setSellerId] = useState(product.sellerId);
  const [tagsInput, setTagsInput] = useState(product.tags ? product.tags.join(', ') : '');
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>(product.deliveryOptions || ['Hantar ke Meja Kerja']);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setCategory(product.category);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice);
      setStock(product.stock);
      setUnit(product.unit);
      setImage(product.image);
      setDescription(product.description);
      setBadge(product.badge || '');
      setIsFlashSale(product.isFlashSale || false);
      setSellerId(product.sellerId);
      setTagsInput(product.tags ? product.tags.join(', ') : '');
      setDeliveryOptions(product.deliveryOptions || ['Hantar ke Meja Kerja']);
    }
  }, [product]);

  const handleDeliveryToggle = (opt: string) => {
    if (deliveryOptions.includes(opt)) {
      if (deliveryOptions.length > 1) {
        setDeliveryOptions(deliveryOptions.filter((d) => d !== opt));
      }
    } else {
      setDeliveryOptions([...deliveryOptions, opt]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedSeller = sellers.find((s) => s.id === sellerId);

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const updated: Product = {
      ...product,
      title: title.trim(),
      category,
      price: Number(price) || 0,
      originalPrice: originalPrice && Number(originalPrice) > Number(price) ? Number(originalPrice) : undefined,
      stock: Math.max(0, Number(stock) || 0),
      unit: unit.trim() || '1 Unit',
      image: image.trim() || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      description: description.trim(),
      badge: (badge as any) || undefined,
      isFlashSale,
      tags: tagsArray.length > 0 ? tagsArray : ['#ProdukF5Mall'],
      deliveryOptions: deliveryOptions.length > 0 ? deliveryOptions : ['Hantar ke Meja'],
      sellerId: matchedSeller ? matchedSeller.id : product.sellerId,
      sellerName: matchedSeller ? matchedSeller.shopName : product.sellerName,
      sellerDepartment: matchedSeller ? matchedSeller.department : product.sellerDepartment,
    };

    onSaveProduct(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        id="edit-product-modal-container"
        className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Kemaskini Maklumat Produk
              </h2>
              <p className="text-xs text-slate-500">
                {isAdmin ? 'Mod Pentadbir: Pengurusan Penuh' : `Gerai: ${product.sellerName}`}
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

        {/* Content Form */}
        <form onSubmit={handleFormSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Produk / Jualan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                placeholder="Contoh: Sambal Bilis Garing Meletop Kak Nor"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kategori Produk <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Admin Seller Assignment */}
          {isAdmin && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <label className="block text-xs font-bold text-indigo-900 mb-1.5">
                Pemilik / Gerai Penjual (Admin CMS)
              </label>
              <select
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-semibold text-slate-800"
              >
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shopName} ({s.name} - {s.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pricing & Stock Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Harga Jualan (RM) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">RM</span>
                <input
                  type="number"
                  step="0.10"
                  min="0.50"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Harga Asal (RM) <span className="text-slate-400 text-[10px]">(Pilihan)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">RM</span>
                <input
                  type="number"
                  step="0.10"
                  min="0"
                  value={originalPrice || ''}
                  onChange={(e) => setOriginalPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-500"
                  placeholder="e.g. 18.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Baki Stok <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
                />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <button
                  type="button"
                  onClick={() => setStock((prev) => Math.max(0, prev - 1))}
                  className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => setStock((prev) => prev + 5)}
                  className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => setStock((prev) => prev + 10)}
                  className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                >
                  +10
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Unit / Saiz Pakej <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                placeholder="e.g. 1 Balang 220g"
              />
            </div>
          </div>

          {/* Badges & Flash Sale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Lencana Produk (Badge)
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
              >
                <option value="">(Tiada Lencana)</option>
                <option value="HOT">🔥 HOT (Paling Hangat)</option>
                <option value="FRESH">🌱 FRESH (Segar Dari Ladang/Dapur)</option>
                <option value="VIRAL">✨ VIRAL (Pilihan Ramai)</option>
                <option value="TERLARIS">👑 TERLARIS (Top Seller)</option>
                <option value="PROMO">🏷️ PROMO (Diskaun Khas)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 sm:pt-0">
              <div>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Sertakan Dalam Jualan Kilat (Flash Sale)
                </p>
                <p className="text-[11px] text-slate-500">
                  Akan dipaparkan pada baris Jualan Kilat utama
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFlashSale}
                  onChange={(e) => setIsFlashSale(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Gambar Produk (URL atau Pilih Daripada Preset)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                placeholder="https://..."
              />
            </div>

            {/* Quick Image Presets */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Pilihan Gambar Contoh Cepat:</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                {PRESET_IMAGES.map((preset, idx) => {
                  const isSelected = image === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                        isSelected ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                        <span className="text-[9px] text-white font-semibold leading-tight line-clamp-1">
                          {preset.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Penerangan / Info Produk
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              placeholder="Terangkan tentang keistimewaan produk, ramuan, dan cara penghantaran..."
            />
          </div>

          {/* Delivery Options & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pilihan Penghantaran
              </label>
              <div className="space-y-1.5">
                {['Hantar terus ke Meja Kerja', 'Ambil di Meja/Bilik Penjual', 'Ambil di Pantry Utama', 'Kaunter Lobi Wisma'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliveryOptions.includes(opt)}
                      onChange={() => handleDeliveryToggle(opt)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tags Carian (Asingkan dengan koma)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                placeholder="#Homemade, #Sedap, #MakanTengahari"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Memudahkan staf mencari produk melalui kotak carian atas.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
