'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import CarCard from '@/components/cars/CarCard';
import CarHero from '@/components/cars/CarHero';
import { FaSearch, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import EngagementSectionUi from '@/components/cars/EngagementSection';
import News from '@/components/News';

interface Car {
  id: number;
  name: string;
  model: string;
  price: number;
  images: string[];
  specs: string[];
  description: string;
  videoUrl: string;
  externalLink: string;
}

const carsData: Car[] = [
  {
    id: 1,
    name: "Toyota",
    model: "Camry (Muscle)",
    price: 4500000,
    images: [
      "https://hips.hearstapps.com/hmg-prod/images/2026-toyota-camry-se-hybrid-nightshade-fwd-155-695bf27312d0c.jpg?crop=0.766xw:0.643xh;0.161xw,0.260xh&resize=1200:*",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800",
    ],
    specs: ["2012", "V8" , "Tokunbo", "Auto", "Yes", "Silver", "Grey", "XLE"],
    description: "Very clean Tokunbo Toyota Camry Muscle with full customs duty paid.",
    videoUrl: "",
    externalLink: ""
  },
  {
    id: 2,
    name: "Honda",
    model: "Accord (Evil Spirit)",
    price: 3800000,
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfVK-e56gp2cu8L7zZ61b1JPq5WIDV2WL2aA&s",
      "https://pbs.twimg.com/media/EJ1ebLwXUAEGRwO.jpg"
    ],
    specs: ["2010", "4P", "Nig. Used", "Manual", "Yes", "Black", "Leather", "EX-L"],
    description: "Well maintained Nigerian used Honda Accord. Buy and drive.",
    videoUrl: "",
    externalLink: ""
  },
  {
    id: 3,
    name: "Mercedes-Benz",
    model: "C300",
    price: 8500000,
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800"
    ],
    specs: ["2015", "V6", "Tokunbo", "Auto", "Yes", "White", " Black", "Sport"],
    description: "Premium Mercedes-Benz C300 Sport Edition with panoramic roof.",
    videoUrl: "",
    externalLink: ""
  },
  {
    id: 4,
    name: "Lexus",
    model: "ES 350",
    price: 6200000,
    images: [
      "https://hips.hearstapps.com/hmg-prod/images/2023-lexus-rx-350-premium-nightfall-105-660af2a02d54e.jpg?crop=0.761xw:0.641xh;0.112xw,0.291xh&resize=1200:*",
      "https://i.ytimg.com/vi/g-epZO7V4ds/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBvHAgJL5Vc-7OgD8cmI10J_8yEQQ"
    ],
    specs: ["2013", "V6", "Tokunbo", "Auto", "Yes", "Wine", "Cream", "Limited"],
    description: "Luxury Lexus ES 350, full option with thumbstart.",
    videoUrl: "",
    externalLink: ""
  },
  {
    id: 5,
    name: "Volkswagen",
    model: "Golf 4",
    price: 2200000,
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800"
    ],
    specs: ["2004", "4P", "Nig. Used", "Auto", "Yes", "Blue", "Fabric", "LE"],
    description: "Fuel efficient VW Golf 4, perfect for daily shuttle.",
    videoUrl: "",
    externalLink: ""
  },
  {
    id: 6,
    name: "Toyota",
    model: "Corolla",
    price: 45000000,
    images: [
      "https://i0.motionx.ie/carx-cms/2025-03/719_tchy_14.JPG",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800"
    ],
    specs: ["2010", "4P", "Brand New", "Manual", "Yes", "Gold", "Grey", "LE"],
    description: "Clean Tokunbo Toyota Corolla. Very fuel efficient and reliable.",
    videoUrl: "",
    externalLink: ""
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [isUnder5M, setIsUnder5M] = useState(false);
  const [likedCount, setLikedCount] = useState(0);

  const engagementBg = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920'

  const syncLikes = () => {
    const savedLikes = JSON.parse(localStorage.getItem('user_liked_cars') || '{}');
    setLikedCount(Object.keys(savedLikes).length);
  };

  useEffect(() => {
    syncLikes();
    window.addEventListener('likesUpdated', syncLikes);
    return () => window.removeEventListener('likesUpdated', syncLikes);
  }, []);

  const nigerianPopularBrands = [
    "All", "Toyota", "Honda", "Volkswagen", "Mercedes-Benz", 
    "BMW", "Audi", "Mazda", "Peugeot", "Nissan", "Mitsubishi", "Volvo"
  ];

  const filteredCars = useMemo(() => {
    return carsData.filter((car) => {
      const matchesSearch = 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBrand = selectedBrand === "All" || car.name.toLowerCase().includes(selectedBrand.toLowerCase());
      const matchesPrice = isUnder5M ? car.price < 5000000 : true;

      return matchesSearch && matchesBrand && matchesPrice;
    });
  }, [searchTerm, selectedBrand, isUnder5M]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedBrand('All');
    setIsUnder5M(false);
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white py-14 md:px-10 ">
        <div className='md:px-2 relative'>
          <CarHero />

          <div className="z-30 absolute bottom-0 right-3 max-w-7xl mx-auto mb-2 flex justify-end items-center">
            <span className="text-[10px] md:text-xs font-medium text-emerald-400">
              Cars you like : <span className="text-amber-400 font-bold">{likedCount}</span>
            </span>
          </div>
        </div>

        <div className="px-2 max-w-7xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-900/50 backdrop-blur-sm rounded-lg px-3 md:px-6 py-3 border border-gray-800">
            <div className="relative flex-1 w-full text-white">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by brand or model..."
                className="w-full pl-12 pr-10 py-2 bg-gray-800 rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none transition-all text-white placeholder:text-gray-500"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <FaTimes />
                </button>
              )}
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={() => setIsUnder5M(!isUnder5M)}
                className={`w-full md:w-40 flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all duration-300 border ${
                  isUnder5M 
                  ? "bg-emerald-800 border-emerald-600 text-white shadow-lg" 
                  : "bg-gray-900 border-gray-700 text-gray-300 hover:bg-emerald-600"
                }`}
              >
                <FaMoneyBillWave />
                Under 5M
              </button>

              <button onClick={handleReset} className="w-full md:w-40 px-6 py-2 bg-gray-900 border border-gray-700 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300">
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {nigerianPopularBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedBrand === brand 
                    ? "bg-blue-600 border-blue-500 text-white" 
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className="px-1.5 md:px-3 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-6">
            <Suspense fallback={<div className="text-white">Loading Inventory...</div>}>
               {filteredCars.map((car) => (
                 <div key={car.id} className='my-2'><CarCard car={car} /></div>
               ))}
            </Suspense>
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-dashed border-gray-800 text-gray-500 italic">
              No cars found matching your search.
            </div>
          )}
        </div>
      </main>

      <div className="px-2 relative w-full py-8 md:py-12 md:py-20 mb-8 md:mb-16 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${engagementBg})`,
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-emerald-950/95 via-gray-950/90 to-emerald-900/95 mix-blend-multiply" />
        <div className="relative z-20 container mx-auto ">
          <EngagementSectionUi />
        </div>
      </div>

      <div className='px-2'>
        <News/>
      </div>
    </>
  );
}