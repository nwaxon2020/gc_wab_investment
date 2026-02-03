'use client';

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { db } from '@/lib/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

// FALLBACK DATA: Used if the backend is empty
const defaultSlides = [
  {
    title: "Summer Collection 2024",
    subtitle: "Discover the Latest Trends",
    description: "Up to 50% off on premium dresses",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop",
    buttonText: "Shop Now",
    buttonLink: "#"
  },
  {
    title: "Elegant Evenings",
    subtitle: "Formal Wear Collection",
    description: "Perfect gowns for special occasions",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1920&h=600&fit=crop",
    buttonText: "Explore",
    buttonLink: "#"
  },
  {
    title: "Casual Comfort",
    subtitle: "Everyday Essentials",
    description: "Comfort meets style in our casual collection",
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1920&h=600&fit=crop",
    buttonText: "View Collection",
    buttonLink: "#"
  }
];

interface HeroSectionProps {
  onProductClick: (productId: string) => void;
}

export default function HeroSection({ onProductClick }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSlides, setActiveSlides] = useState<any[]>(defaultSlides);

  // 1. DYNAMIC FETCH LOGIC
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_settings', 'fashion_hero'), (docSnap) => {
      if (docSnap.exists()) {
        const fetched = docSnap.data().slides || [];
        setActiveSlides(fetched.length > 0 ? fetched : defaultSlides);
      } else {
        setActiveSlides(defaultSlides);
      }
    });
    return () => unsub();
  }, []);

  // 2. SLIDE AUTO-PLAY LOGIC
  useEffect(() => {
    if (activeSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <div className="relative h-[48vh] md:h-[68vh] overflow-hidden group">
      {activeSlides.map((slide, index) => {
        const isActive = index === currentSlide;

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isActive 
                ? 'opacity-100 z-10 pointer-events-auto' 
                : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image Layer */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            
            {/* Content Layer */}
            <div className="pt-14 relative h-full flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className={`max-w-3xl text-white transition-all duration-1000 transform ${
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  <p className="text-fashion-pink font-semibold mb-2 animate-pulse-slow">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-xl mb-8 opacity-90">
                    {slide.description}
                  </p>
                  
                  <button 
                    onClick={() => {
                      if (slide.buttonLink && slide.buttonLink !== "#") {
                        onProductClick(slide.buttonLink);
                      }
                    }}
                    className="bg-fashion-pink hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold active:scale-95 transition-all duration-300 shadow-lg"
                  >
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation buttons - Fixed Z-Index to stay above slides */}
      <button
        onClick={prevSlide}
        className="z-20 hidden md:block absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <FaChevronLeft className="text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="z-20 hidden md:block absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <FaChevronRight className="text-white" />
      </button>

      {/* Dots indicator - Fixed Z-Index to stay above slides */}
      <div className="z-20 absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {activeSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-fashion-pink w-8' 
                : 'bg-white/60 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}