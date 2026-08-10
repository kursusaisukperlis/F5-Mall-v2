import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { 
  X, 
  Sparkles, 
  Upload, 
  Tag, 
  DollarSign, 
  Package, 
  Truck, 
  QrCode, 
  Store, 
  Image as ImageIcon,
  CheckCircle2,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playNotificationSound } from '../utils/audio';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productData: Partial<Product>) => void;
  currentUser: {
    name: string;
    department: string;
    phone: string;
  };
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  currentUser,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Buah-buahan Segar');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [unit, setUnit] = useState('1 kg');
  const [stock, setStock] = useState('15');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80');
  const [badge, setBadge] = useState('FRESH');
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [deliveryDesk, setDeliveryDesk] = useState(true);
  const [deliveryPantry, setDeliveryPantry] = useState(true);
  const [deliveryPickup, setDeliveryPickup] = useState(true);
  const [tags, setTags] = useState('Segar, Manis, Gred Super, DuitNow QR');

  // AI Generation state
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState(false);

  const presetImages = [
    { label: 'Mangga / Buah', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80' },
    { label: 'Durian / Buahan Tropika', url: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Kek / Brownies', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80' },
    { label: 'Sambal Garing / Lauk', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80' },
    { label: 'Kudapan / Biskut Pejabat', url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80' },
    { label: 'Minuman / Jus Segar', url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop&q=80' },
  ];

  const handleGenerateWithAI = async () => {
    if (!title && !category) {
      alert('Sila masukkan sekurang-kurangnya nama ringkas produk dahulu.');
      return;
    }

    setIsGeneratingAi(true);
    setAiGeneratedSuccess(false);

    try {
      const response = await fetch('/api/generate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || `Produk ${category}`,
          category,
          price: price || '15',
          sellerName: currentUser.name,
          sellerDepartment: currentUser.department,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.title && !title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.tags && Array.isArray(data.tags)) setTags(data.tags.join(', '));
        if (data.suggestedBadge) setBadge(data.suggestedBadge);
        setAiGeneratedSuccess(true);
      } else {
        throw new Error('AI API fallback');
      }
    } catch (err) {
      // High quality dynamic fallback for static deployment (GitHub Pages / Standalone)
      let dynamicDesc = '';
      let dynamicTags = '';
      let dynamicBadge: 'HOT' | 'FRESH' | 'ORGANIK' | 'HOMEMADE' | 'TERLARIS' = 'HOMEMADE';

      if (category === 'Buah-buahan Segar') {
        dynamicDesc = `🍓 [SEGAR DARI KEBUN] Dipetik segar khas untuk warga ${currentUser.department}! Buah gred terpilih yang manis, berjus, dan bersih. Sedia dihantar terus ke meja/kubikel anda pada waktu rehat. Sila tempah awal untuk elak kehabisan!`;
        dynamicTags = 'Segar, BuahKebun, GredSuper, HantarKeMeja, DuitNow';
        dynamicBadge = 'FRESH';
      } else if (category === 'Kek & Pastri') {
        dynamicDesc = `🧁 [HOMEMADE BAKED] Disediakan dengan bahan premium, kurang manis dan lembut gebu. Sangat sesuai untuk kudapan minum petang atau keraian bersama rakan sekerja ${currentUser.department}. Penghantaran pantas ke kubikel anda.`;
        dynamicTags = 'KekPastri, FreshBaked, Halal, KudapanPejabat, SapotWarga';
        dynamicBadge = 'HOT';
      } else if (category === 'Sambal & Lauk Pauk') {
        dynamicDesc = `🌶️ [RESIPOI ASLI] Dimasak perlahan dengan ramuan segar & pedas menyengat yang membangkitkan selera makan tengah hari warga jabatan. Tahan lama dan sedia dimakan bila-bila masa. Penghantaran ke meja kerja anda sebelum waktu makan tengah hari.`;
        dynamicTags = 'SambalPadu, LaukPauk, ResipiWarisan, Halal, Homemade';
        dynamicBadge = 'TERLARIS';
      } else if (category === 'Kudapan & Minuman') {
        dynamicDesc = `☕ [KUDAPAN PEJABAT] Pilihan terbaik untuk menemani waktu kerja anda di ${currentUser.department}. Sedap, rangup, dan segar. Jimat masa tanpa perlu keluar pejabat—pesan dan kami hantar terus ke meja anda!`;
        dynamicTags = 'Kudapan, MinumanSegar, SnekKerja, JimatMasa, DuitNow';
        dynamicBadge = 'HOT';
      } else {
        dynamicDesc = `📦 Dihasilkan & disediakan dengan teliti khas untuk rakan sekerja ${currentUser.department}. Kualiti terjamin, harga mesra warga jabatan, dan penghantaran mudah terus ke meja anda.`;
        dynamicTags = 'WargaJabatan, KrafPejabat, Halal, SapotKawan, DuitNow';
        dynamicBadge = 'HOMEMADE';
      }

      setDescription(dynamicDesc);
      setTags(dynamicTags);
      setBadge(dynamicBadge);
      setAiGeneratedSuccess(true);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Sila masukkan nama produk.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Sila masukkan harga yang sah.');
      return;
    }

    const deliveryOptions: string[] = [];
    if (deliveryDesk) deliveryOptions.push('Hantar Terus Ke Meja / Kubikel Anda');
    if (deliveryPantry) deliveryOptions.push('Ambil Di Pantry Aras');
    if (deliveryPickup) deliveryOptions.push(`Ambil di Meja Penjual (${currentUser.department})`);

    const newProductData: Partial<Product> = {
      title: title.trim(),
      category,
      description: description.trim() || `Produk istimewa dari ${currentUser.name} (${currentUser.department}).`,
      price: priceNum,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      unit: unit.trim() || '1 unit',
      stock: parseInt(stock, 10) || 10,
      image,
      badge: badge || undefined,
      isFlashSale,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      deliveryOptions,
      sellerName: currentUser.name,
      sellerDepartment: currentUser.department,
    };

    onAddProduct(newProductData);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });

    playNotificationSound('success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        id="add-product-modal-container"
        className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Buka Gerai & Jual Produk Baru
              </h2>
              <p className="text-xs text-slate-500">
                Promosikan buah kebun, kek moist, sambal homemade atau barangan kepada warga jabatan
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
          {/* Seller Banner */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-emerald-700" />
              <div>
                <p className="font-bold text-emerald-950">Penjual: {currentUser.name}</p>
                <p className="text-[11px] text-emerald-700">{currentUser.department}</p>
              </div>
            </div>
            <span className="text-[10px] bg-white text-emerald-800 font-bold px-2 py-1 rounded-lg border border-emerald-200">
              DuitNow QR Aktif
            </span>
          </div>

          {/* Product Name & AI Generator Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800">
                Nama Produk <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isGeneratingAi}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] px-3 py-1 rounded-xl transition-all border border-indigo-200 flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>{isGeneratingAi ? 'Menjana Iklan Menarik...' : 'Jana Info Iklan dengan AI'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cth: Mangga Harum Manis Gred Super A / Sambal Hitam Pahang"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Kategori Produk <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Buah-buahan Segar">🍎 Buah-buahan Segar</option>
                <option value="Kek & Pastri">🎂 Kek & Pastri</option>
                <option value="Sambal & Lauk Pauk">🌶️ Sambal & Lauk Pauk</option>
                <option value="Kudapan & Minuman">☕ Kudapan & Minuman</option>
                <option value="Kraf & Keperluan Pejabat">📦 Kraf & Keperluan Pejabat</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Lencana / Label Promosi
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="FRESH">FRESH (Petik Segar)</option>
                <option value="HOT">HOT (Pedas & Terhangat)</option>
                <option value="TERLARIS">TERLARIS (Pilihan Staf)</option>
                <option value="PROMO">PROMO (Harga Istimewa)</option>
                <option value="VIRAL">VIRAL (Paling Dicari)</option>
              </select>
            </div>
          </div>

          {/* Price, Original Price, Unit, Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Harga Jualan (RM) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25.00"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-indigo-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Harga Asal (RM)
              </label>
              <input
                type="number"
                step="0.5"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="30.00 (Pilihan)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-600 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Unit / Saiz <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="1 kg / 1 bekas"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Stok Tersedia <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="15"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Flash Sale Checkbox */}
          <div className="p-3 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-600 fill-red-600" />
              <div>
                <p className="font-bold text-red-950">Sertakan Dalam Jualan Kilat (Flash Sale)?</p>
                <p className="text-[10px] text-red-700">Produk akan dipaparkan di bahagian atas dengan countdown timer</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isFlashSale}
              onChange={(e) => setIsFlashSale(e.target.checked)}
              className="w-5 h-5 accent-red-600 rounded cursor-pointer"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span>Penerangan Produk & Rasa</span>
              {aiGeneratedSuccess && (
                <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                  ✨ Dijana oleh AI Pembantu Iklan
                </span>
              )}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan keistimewaan produk anda, cara penghantaran, ketahanan makanan, dll..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-normal text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Product Image Selection & Upload */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800">
              Gambar Produk
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {presetImages.map((pImg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImage(pImg.url)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                    image === pImg.url
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={pImg.url} alt={pImg.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold p-0.5 text-center truncate">
                    {pImg.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Muat Naik Foto Sendiri</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCustomImageUpload}
                />
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Atau masukkan URL imej"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Delivery Options within Department */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-800 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              Pilihan Penghantaran Dalam Bangunan
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliveryDesk}
                  onChange={(e) => setDeliveryDesk(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <span className="text-slate-700 font-medium">
                  Hantar terus ke meja kubikel pembeli (Aras 1 - 6)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliveryPantry}
                  onChange={(e) => setDeliveryPantry(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <span className="text-slate-700 font-medium">
                  Tinggalkan di Pantry Aras
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliveryPickup}
                  onChange={(e) => setDeliveryPickup(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
                <span className="text-slate-700 font-medium">
                  Ambil sendiri di meja penjual ({currentUser.department})
                </span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="font-bold text-slate-800">
              Kata Kunci Carian (Asingkan dengan koma)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Cth: Mangga, Harum Manis, Segar, Manis"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              id="publish-product-btn"
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Terbitkan Produk Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
