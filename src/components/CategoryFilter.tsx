import React from 'react';
import { ProductCategory } from '../types';
import { 
  Layers, 
  Apple, 
  Cake, 
  Flame, 
  Coffee, 
  Briefcase
} from 'lucide-react';

interface CategoryFilterProps {
  categories?: ProductCategory[];
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  categoryCounts?: Partial<Record<ProductCategory, number>>;
  productsCount?: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
  productsCount,
}) => {
  const categoryItems: { name: ProductCategory; icon: React.ReactNode; color: string; desc: string }[] = [
    {
      name: 'Semua',
      icon: <Layers className="w-4 h-4" />,
      color: 'from-indigo-600 to-violet-600',
      desc: 'Semua Pilihan',
    },
    {
      name: 'Buah-buahan Segar',
      icon: <Apple className="w-4 h-4" />,
      color: 'from-emerald-500 to-teal-600',
      desc: 'Harum Manis & Nanas',
    },
    {
      name: 'Kek & Pastri',
      icon: <Cake className="w-4 h-4" />,
      color: 'from-pink-500 to-rose-500',
      desc: 'Brownies & Kek Moist',
    },
    {
      name: 'Sambal & Lauk Pauk',
      icon: <Flame className="w-4 h-4" />,
      color: 'from-amber-500 to-red-500',
      desc: 'Sambal Garing & Lauk',
    },
    {
      name: 'Kudapan & Minuman',
      icon: <Coffee className="w-4 h-4" />,
      color: 'from-cyan-500 to-blue-600',
      desc: 'Kerepek & Kopi Panas',
    },
    {
      name: 'Kraf & Keperluan Pejabat',
      icon: <Briefcase className="w-4 h-4" />,
      color: 'from-purple-500 to-indigo-600',
      desc: 'Alat Tulis & Meja',
    },
  ];

  return (
    <div className="my-3" id="product-categories-section">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            Kategori Pilihan Warga Jabatan
          </h2>
          <p className="text-[11px] text-slate-500">
            Pilih kategori makanan, buah atau keperluan pejabat
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {categoryItems.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const count = categoryCounts?.[cat.name] ?? (cat.name === 'Semua' && productsCount ? productsCount : 0);

          return (
            <button
              key={cat.name}
              id={`category-btn-${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onSelectCategory(cat.name)}
              className={`relative text-left p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${cat.color} shadow-2xs`}
                >
                  {cat.icon}
                </div>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </div>

              <div>
                <p
                  className={`text-xs font-bold leading-tight truncate ${
                    isSelected ? 'text-indigo-900' : 'text-slate-800'
                  }`}
                >
                  {cat.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {cat.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
