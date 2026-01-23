'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CarHero = () => {
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for the parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-[35vh] md:h-[40vh] overflow-hidden flex items-center justify-center bg-[#061a13]">
      {/* 1. MOVING BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.15 }}
          animate={{ 
            scale: 1.05,
            transition: { 
              duration: 10, 
              repeat: Infinity, 
              repeatType: "reverse", 
              ease: "linear" 
            }
          }}
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            // High-quality automotive background
            backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600')`,
            y: scrollY * 0.3, // The Parallax effect
          }}
        />
        
        {/* 2. EMERALD GRADIENT OVERLAYS */}
        {/* Top-to-bottom depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b]/40 via-[#061a13]/20 to-gray-950" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(6,26,19,0.8)_100%)]" />
        
        {/* 3. FLOATING EMERALD PARTICLES (Multiple moving globs) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -120, 0],
                x: [0, Math.random() * 60 - 30, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              className="absolute w-40 h-40 bg-emerald-500/10 rounded-full blur-[100px]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 4. HERO TEXT CONTENT */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Title with Emerald Gradient */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tighter">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              PREMIUM COLLECTION
            </span>
          </h1>

          {/* Subtitle with decorative lines */}
          <div className="flex items-center justify-center gap-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "2rem" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-[1px] bg-emerald-500/50"
            />
            <p className="text-emerald-400/80 text-[10px] md:text-xs uppercase tracking-[0.4em] font-black">
              Elite Automotive Luxury
            </p>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "2rem" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-[1px] bg-emerald-500/50"
            />
          </div>
            <p className="text-gray-400 text-sm max-w-3xl mx-auto">
                Discover the world&apos;s most exclusive supercars. Hover for previews, click for details.
            </p>
        </motion.div>
      </div>

      {/* 5. BOTTOM FADE (Smooth transition to main content) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-950 to-transparent z-10" />
    </div>
  );
};

export default CarHero;