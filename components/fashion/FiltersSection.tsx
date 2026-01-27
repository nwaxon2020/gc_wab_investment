// components/FiltersSection.tsx
'use client';

import { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const categories = ['All', 'Dresses', 'Jackets', 'Shirts', 'Shoes'];
const priceRanges = [
  { label: 'Under ₦50k', min: 0, max: 50000 },
  { label: '₦50k - ₦150k', min: 50000, max: 150000 },
  { label: '₦150k - ₦300k', min: 150000, max: 300000 },
  { label: 'Over ₦300k', min: 300000, max: Infinity },
];

export default function FiltersSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <>
      <div className="bg-gray-900 text-white px-2 md:px-12 py-3 mb-8 fade-in">
        {/* Search and Filter Bar */}
        <div className="flex flex-row gap-2 md:gap-4 mb-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for dresses, jackets, accessories..."
              className="text-black bg-white w-full pl-12 pr-4 py-2 placeholder:text-gray-400 border border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2 border rounded-xl md:hover:bg-gray-50"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex flex-wrap gap-3">
          {/* Category Filters */}
          <div className="flex-1">
            <h3 className="font-bold mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2 py-2 text-xs rounded-full transition-all ${
                    selectedCategory === category
                      ? 'w-18 bg-emerald-500 text-white'
                      : 'w-18 bg-gray-900 border hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filters */}
          <div>
            <h3 className="font-bold mb-2">Price Range</h3>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPrice(range.label)}
                  className={`text-xs px-2 py-2 rounded-full transition-all ${
                    selectedPrice === range.label
                      ? 'w-25 bg-emerald-500 text-white'
                      : 'w-25 bg-gray-900 border hover:bg-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(selectedCategory !== 'All' || selectedPrice) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedPrice(null);
                }}
                className="px-4 py-2 text-fashion-pink hover:bg-pink-50 rounded-full transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowMobileFilters(false)}
            />
            <div className="text-emerald-100 absolute right-0 top-0 h-full w-80 bg-emerald-900/85 p-6 slide-in overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button
                        onClick={() => setShowMobileFilters(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Category Filters */}
                <div className="mb-8">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-emerald-900 text-sm text-left px-4 py-2.5 rounded-lg transition-all ${
                        selectedCategory === category
                            ? 'bg-emerald-500 text-white font-semibold'
                            : 'bg-gray-100'
                        }`}
                    >
                        {category}
                    </button>
                    ))}
                </div>
                </div>

                {/* Price Filters */}
                <div className="mb-8">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                    {priceRanges.map((range) => (
                    <button
                        key={range.label}
                        onClick={() => setSelectedPrice(range.label)}
                        className={`block w-full text-emerald-900 text-sm text-left px-4 py-3 rounded-lg transition-all ${
                        selectedPrice === range.label
                            ? 'bg-emerald-500 text-white font-semibold'
                            : 'bg-gray-100'
                        }`}
                    >
                        {range.label}
                    </button>
                    ))}
                </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                <button
                    onClick={() => {
                    setSelectedCategory('All');
                    setSelectedPrice(null);
                    }}
                    className="font-bold w-full border border-fashion-pink text-fashion-pink py-3 rounded-lg hover:bg-pink-50"
                >
                    Clear Filters
                </button>
                <button
                    onClick={() => setShowMobileFilters(false)}
                    className="font-bold w-full bg-fashion-pink text-white py-3 rounded-lg hover:bg-pink-600"
                >
                    Apply Filters
                </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}