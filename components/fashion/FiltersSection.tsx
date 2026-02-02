'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

// Standardized categories to match your Firestore data
const categories = ['All', 'Dresses', 'Jackets', 'Shirts', 'Shoes', 'Bags', 'Suits', 'Wrist Watch', 'Bra'];

export const priceRanges = [
  { label: 'Under ₦50k', min: 0, max: 50000 },
  { label: '₦50k - ₦150k', min: 50000, max: 150000 },
  { label: '₦150k - ₦300k', min: 150000, max: 300000 },
  { label: 'Over ₦300k', min: 300000, max: Infinity },
];

interface FiltersSectionProps {
  onSearch: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onPriceChange: (rangeLabel: string | null) => void;
}

export default function FiltersSection({ onSearch, onCategoryChange, onPriceChange }: FiltersSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Trigger search dynamically
  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const handleCategoryClick = (cat: string) => {
    // We update the local UI state
    setSelectedCategory(cat);
    // We immediately pass the category to the parent (ShopPageUi)
    // Parent then passes it to ProductGrid which handles the .filter()
    onCategoryChange(cat);
  };

  const handlePriceClick = (label: string) => {
    const newVal = selectedPrice === label ? null : label;
    setSelectedPrice(newVal);
    onPriceChange(newVal);
  };

  const clearAll = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedPrice(null);
    onSearch('');
    onCategoryChange('All');
    onPriceChange(null);
  };

  return (
    <>
      <div className="bg-gray-900 text-white px-2 md:px-12 py-3 md:py-4 mb-8">
        <div className="flex flex-row gap-2 md:gap-4 mb-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category or tags..."
              className="text-black bg-white w-full pl-12 pr-10 py-2 border border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <FaTimes className="text-gray-400 hover:text-red-500" />
              </button>
            )}
          </div>

          <button onClick={() => setShowMobileFilters(true)} className="md:hidden flex items-center justify-center gap-2 px-4 py-2 border rounded-xl bg-gray-800 border-gray-700">
            <FaFilter /> Filters
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="mt-2 hidden md:flex flex-wrap gap-6 items-end">
          <div className="flex-1">
            <h3 className="font-bold mb-2 text-xs uppercase text-emerald-400 tracking-widest">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-full border transition-all duration-300 ${
                    selectedCategory === cat 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2 text-xs uppercase text-emerald-400 tracking-widest">Price Range</h3>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handlePriceClick(range.label)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-full border transition-all duration-300 ${
                    selectedPrice === range.label 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-400'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {(selectedCategory !== 'All' || selectedPrice || searchTerm) && (
            <button onClick={clearAll} className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 transition-colors pb-2 tracking-tighter">
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[150] md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-gray-900 p-6 shadow-xl flex flex-col border-l border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-emerald-500 tracking-tighter italic">FILTERS</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-800 rounded-full"><FaTimes className="text-white" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
              <div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Category</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`py-2 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                        selectedCategory === cat ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-800 text-gray-400 bg-gray-800/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handlePriceClick(range.label)}
                      className={`w-full py-3 px-4 text-[10px] font-bold rounded-lg border text-left transition-all ${
                        selectedPrice === range.label ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-800 text-gray-400 bg-gray-800/50'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setShowMobileFilters(false)} className="mt-6 w-full bg-emerald-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}