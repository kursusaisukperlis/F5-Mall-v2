import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Truck, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BannerSliderProps {
  onPromoClick: (query: string) => void;
  onOpenAddProduct: () => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ onPromoClick, onOpenAddProduct }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-1',
      title: 'Musim Mangga Harum Manis Perlis Gred Super A!',
      subtitle: 'Petik Segar Dari Kebun Abang Lan (Khidmat Pengurusan, Aras 4)',
      badge: 'PROMO HARI INI',
      description: 'Manis beraroma, isi tebal keemasan. Tempah sekarang, sedia dihantar terus ke meja kubikel anda sebelum waktu rehat.',
      bgGradient: 'from-amber-600 via-orange-600 to-yellow-600',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
      actionText: 'Beli Harum Manis',
      searchTarget: 'Mangga Harum Manis',
      highlights: ['Gred Super A', 'Hantar Ke Meja', 'DuitNow QR'],
    },
    {
      id: 'slide-2',
      title: 'Sambal Bilis Garing & Sambal Hitam Kak Nor',
      subtitle: 'Dapur Sambal Kak Nor (Bahagian Kewangan, Aras 2)',
      badge: 'TERLARIS DI JABATAN',
      description: 'Super rangup dengan bilis mata biru Pangkor. Tak berminyak, tahan 3 bulan & teman sejati makan tengah hari.',
      bgGradient: 'from-rose-700 via-red-600 to-orange-600',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      actionText: 'Pesan Sambal Bilis',
      searchTarget: 'Sambal Bilis',
      highlights: ['Rangup Krup Krap', 'Homemade Halal', 'Sedia Panas'],
    },
    {
      id: 'slide-3',
      title: 'Tea Time Pejabat? Kek Coklat Moist & Brownies Nutella',
      subtitle: 'Dapur Pastri & Bakes Kak Ida (Unit HR, Aras 3)',
      badge: 'FRESHLY BAKED',
      description: 'Bakar segar pagi ini sebelum jam 8.00 pagi. Coklat belgian melimpah & cheese leleh untuk santapan minum petang.',
      bgGradient: 'from-amber-900 via-stone-800 to-amber-700',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      actionText: 'Lihat Kek & Pastri',
      searchTarget: 'Kek',
      highlights: ['Bakar Pagi', 'Mesra Jamuan', 'Sos Coklat Leleh'],
    },
    {
      id: 'slide-4',
      title: 'Ada Produk Hendak Dijual Kepada Warga Jabatan?',
      subtitle: 'Buka Gerai Maya Anda Dalam 1 Minit Sahaja!',
      badge: 'PELUANG WARGA',
      description: 'Jual buah, kuih muih, lauk makan tengah hari atau kraf. Bayaran terus ke DuitNow QR anda tanpa caj tersembunyi.',
      bgGradient: 'from-emerald-700 via-teal-700 to-cyan-800',
      image: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&auto=format&fit=crop&q=80',
      actionText: '+ Jual Produk Sekarang',
      isSellerAction: true,
      highlights: ['100% Percuma', 'DuitNow QR Sendiri', 'Notifikasi Live'],
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden rounded-3xl shadow-lg border border-gray-100 my-4" id="home-hero-banner">
      <div className="relative min-h-[320px] sm:min-h-[360px] md:min-h-[380px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} flex items-center`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Text Left Column */}
              <div className="md:col-span-7 text-white space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                    {slide.badge}
                  </span>
                  <span className="text-white/80 text-xs font-medium">
                    {slide.subtitle}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-xs">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl font-normal">
                  {slide.description}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {slide.highlights.map((hl, i) => (
                    <span key={i} className="text-[11px] bg-black/20 text-white/90 px-2.5 py-1 rounded-lg backdrop-blur-xs font-medium">
                      ✓ {hl}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <div className="pt-2 flex items-center gap-3">
                  {slide.isSellerAction ? (
                    <button
                      id="banner-open-seller-action-btn"
                      onClick={onOpenAddProduct}
                      className="bg-white hover:bg-amber-50 text-emerald-800 font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                    >
                      <span>{slide.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      id="banner-shop-now-btn"
                      onClick={() => onPromoClick(slide.searchTarget || '')}
                      className="bg-white hover:bg-amber-50 text-orange-700 font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                    >
                      <span>{slide.actionText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Image Right Column */}
              <div className="md:col-span-5 hidden md:flex justify-center items-center">
                <div className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/30 transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 text-gray-800 shadow-md">
                    <p className="text-xs font-bold truncate">{slide.title}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <Truck className="w-3 h-3" /> Hantar terus ke meja kubikel anda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Buttons */}
        <button
          id="banner-prev-slide-btn"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md flex items-center justify-center transition-colors z-10"
          aria-label="Slide sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          id="banner-next-slide-btn"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md flex items-center justify-center transition-colors z-10"
          aria-label="Slide seterusnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Pergi ke slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Workplace Trust Pillars Footer Ribbon */}
      <div className="bg-gray-900 text-gray-200 px-6 py-3 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-orange-400 shrink-0" />
          <div>
            <p className="font-bold text-white text-[11px]">Hantar Terus Ke Meja</p>
            <p className="text-[10px] text-gray-400">Aras 1 - Aras 6 Wisma</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-white text-[11px]">Bayaran DuitNow Terus</p>
            <p className="text-[10px] text-gray-400">Bayar ke akaun rakan sekerja</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-white text-[11px]">Penilaian & Ulasan Sah</p>
            <p className="text-[10px] text-gray-400">100% daripada staf jabatan</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="font-bold text-white text-[11px]">Notifikasi Pesanan Live</p>
            <p className="text-[10px] text-gray-400">Kemas kini masa nyata</p>
          </div>
        </div>
      </div>
    </section>
  );
};
