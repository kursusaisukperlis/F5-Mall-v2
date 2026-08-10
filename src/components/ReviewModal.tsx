import React, { useState } from 'react';
import { Product, Review } from '../types';
import { X, Star, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playNotificationSound } from '../utils/audio';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  orderId?: string;
  currentUser: {
    name: string;
    department: string;
  };
  onSubmitReview: (reviewData: Partial<Review>) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  orderId,
  currentUser,
  onSubmitReview,
}) => {
  if (!isOpen || !product) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sangat Sedap', 'Hantar Cepat ke Meja']);

  const availableTags = [
    'Sangat Sedap',
    'Manis Melekat',
    'Rangup & Fresh',
    'Hantar Cepat ke Meja',
    'Pembungkusan Kemas',
    'Harga Berpatutan',
    'Penjual Sangat Ramah',
    'Akan Re-order',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reviewData: Partial<Review> = {
      productId: product.id,
      productTitle: product.title,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      buyerName: currentUser.name,
      buyerDepartment: currentUser.department,
      orderId: orderId || `ORD-${Date.now().toString().slice(-4)}`,
      rating,
      comment: comment.trim() || 'Produk sangat memuaskan dan servis penghantaran ke kubikel pantas!',
      tags: selectedTags,
    };

    onSubmitReview(reviewData);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    playNotificationSound('success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div 
        id="review-modal-container"
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Beri Penilaian Warga</h2>
              <p className="text-[11px] text-slate-500">Bantu rakan sekerja jabatan berkembang!</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Product Quick Info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={product.image}
              alt={product.title}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-bold text-slate-800 line-clamp-1">{product.title}</h4>
              <p className="text-[11px] text-slate-400">Penjual: {product.sellerName}</p>
            </div>
          </div>

          {/* Star Rating Selector */}
          <div className="text-center py-2 space-y-1.5">
            <label className="font-bold text-slate-800 block text-xs">
              Kadar Kepuasan Keseluruhan:
            </label>
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-2xl transition-transform transform hover:scale-125 focus:outline-hidden"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] font-bold text-amber-600">
              {rating === 5 && '⭐⭐⭐⭐⭐ Luar Biasa! Sangat Puas Hati'}
              {rating === 4 && '⭐⭐⭐⭐ Sangat Bagus & Sedap'}
              {rating === 3 && '⭐⭐⭐ Memuaskan'}
              {rating === 2 && '⭐⭐ Boleh Diperbaiki'}
              {rating === 1 && '⭐ Kurang Memuaskan'}
            </p>
          </div>

          {/* Quick Tag Pills */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">Pilih Ciri-ciri Yang Menonjol:</label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Text Area */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">Ulasan & Komen Anda:</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Kongsi pengalaman rasa, saiz hidangan, atau kecepatan penghantaran ke meja..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-normal text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hantar Penilaian</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
