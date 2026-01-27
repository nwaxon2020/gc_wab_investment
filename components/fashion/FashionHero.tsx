// components/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
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

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="pt-14 relative h-full flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className={`max-w-3xl text-white transition-all duration-1000 transform ${
                index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
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
                <button className="bg-fashion-pink text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-all duration-300"
      >
        <FaChevronLeft className="text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full transition-all duration-300"
      >
        <FaChevronRight className="text-white" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
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