'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import CarCard from '@/components/cars/CarCard';
import CarHero from '@/components/cars/CarHero';
import { FaSearch, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import EngagementSectionUi from '@/components/cars/EngagementSection';
import News from '@/components/News';

// THE INTERFACE - Optimized for Backend + Frontend parity
interface Car {
  id: string | number;
  name: string;
  model: string;
  price: number;
  images: string[];
  specs: string[];
  description: string;
  videoUrl: string;
  externalLink?: string; 
  createdAt?: any;
}

// 1. MOCK DATA KEPT AT TOP (As requested, though we only render DB values now)
const carsData: Car[] = [
  {
    id: 1,
    name: "Toyota",
    model: "Camry (Muscle)",
    price: 4500000,
    images: ["https://hips.hearstapps.com/hmg-prod/images/2026-toyota-camry-se-hybrid-nightshade-fwd-155-695bf27312d0c.jpg?crop=0.766xw:0.643xh;0.161xw,0.260xh&resize=1200:*", "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800"],
    specs: ["2012", "V8" , "Tokunbo", "Auto", "Yes", "Silver", "Grey", "XLE"],
    description: "Very clean Tokunbo Toyota Camry Muscle with full customs duty paid.",
    videoUrl: "",
    externalLink: ""
  },
  // ... rest of your mock cars
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [isUnder5M, setIsUnder5M] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const [dbCars, setDbCars] = useState<Car[]>([]); // Values coming from Backend
  const [loading, setLoading] = useState(true);

  const engagementBg = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920'

  // FETCH LIVE DATA
  useEffect(() => {
    const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Car[];
      setDbCars(fetched);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const syncLikes = () => {
    const savedLikes = JSON.parse(localStorage.getItem('user_liked_cars') || '{}');
    setLikedCount(Object.keys(savedLikes).length);
  };

  useEffect(() => {
    syncLikes();
    window.addEventListener('likesUpdated', syncLikes);
    return () => window.removeEventListener('likesUpdated', syncLikes);
  }, []);

  // ORIGINAL NIGERIAN POPULAR BRANDS LIST
  const nigerianPopularBrands = [
    "All", "Toyota", "Honda", "Volkswagen", "Mercedes-Benz", 
    "BMW", "Audi", "Mazda", "Peugeot", "Nissan", "Mitsubishi", "Volvo"
  ];

  // FILTERING LOGIC - Only using Backend Values (dbCars)
  const filteredCars = useMemo(() => {
    return dbCars.filter((car) => {
      const matchesSearch = 
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBrand = selectedBrand === "All" || car.name.toLowerCase() === selectedBrand.toLowerCase();
      const matchesPrice = isUnder5M ? car.price < 5000000 : true;

      return matchesSearch && matchesBrand && matchesPrice;
    });
  }, [searchTerm, selectedBrand, isUnder5M, dbCars]);

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

        {/* SEARCH BAR SECTION - EXACT ORIGINAL UI */}
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

          {/* BRAND TABS - EXACT ORIGINAL UI */}
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

        {/* INVENTORY LIST - VALUES FROM BACKEND */}
        <div className="px-1.5 md:px-3 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-6">
             {filteredCars.map((car) => (
               <div key={String(car.id)} className='my-2'><CarCard car={car} /></div>
             ))}
          </div>

          {!loading && filteredCars.length === 0 && (
            <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-dashed border-gray-800 text-gray-500 italic">
              No cars found matching your search.
            </div>
          )}
        </div>
      </main>

      {/* ENGAGEMENT SECTION */}
      <div className="px-2 relative w-full py-8 md:py-12 md:py-20 mb-8 md:mb-16 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${engagementBg})` }}
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