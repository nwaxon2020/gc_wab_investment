'use client'

import { Dispatch, SetStateAction } from 'react'
import Link from 'next/link'

interface HeroProps {
  activeTab: 'cars' | 'fashion'
  isLoaded: boolean
  setActiveTab: (tab: 'cars' | 'fashion') => void
}

export default function Hero({ activeTab, isLoaded, setActiveTab }: HeroProps) {
  const bg = {
    cars: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  }

  const isCars = activeTab === 'cars'

  return (
    <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        {/* Cars Side */}
        <div
          className="absolute top-0 left-0 bottom-0 w-[55%] overflow-hidden"
          style={{ clipPath: 'polygon(0 0, 82% 0, 100% 100%, 0 100%)' }}
        >
          <img
            src={bg.cars}
            alt="Cars"
            loading="lazy"
            className="w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: isCars ? 1 : 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14532d]/75 to-transparent" />
        </div>

        {/* Fashion Side */}
        <div
          className="absolute top-0 right-0 bottom-0 w-[55%] overflow-hidden"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 18% 100%)' }}
        >
          <img
            src={bg.fashion}
            alt="Fashion"
            className="w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: !isCars ? 1.5 : 0.7 }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-white/70 to-transparent" />
        </div>
      </div>

      {/* CONTENT */}
      <div
        className={`relative z-10 h-full container mx-auto px-5 md:px-8 flex items-center transition-all duration-700 ${
          isCars ? 'justify-start' : 'justify-end'
        }`}
      >
        <div
          className={`mt-20 max-w-[34rem] transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } ${isCars ? 'text-left' : 'text-right'}`}
        >
          <h1
            className={`text-3xl md:text-5xl font-bold leading-tight ${
              isCars ? 'text-white' : 'text-gray-900'
            }`}
          >
            GC WAB <span className="block text-[#16a34a] uppercase">
                {isCars ? 'Premium Automobile' : 'Trending Outfits'}
            </span>
          </h1>

          {isCars ? (
            <p className="text-sm md:text-base mt-4 mb-6 leading-relaxed font-medium text-white/85">
              Driving excellence through premium automobile sourcing, smart vehicle investments,
              and trusted automotive solutions built for performance, comfort, and long-term value.
            </p>
          ) : (
            <p className="text-sm md:text-base mt-4 mb-6 leading-relaxed font-medium text-gray-800">
              Redefining modern fashion with carefully curated styles, premium fabrics,
              and trend-forward designs that express confidence, class, and individuality.
            </p>
          )}

          {/* BUTTON LINKS */}
          <div
            className={`mt-6 flex gap-3 ${
              isCars ? 'justify-start' : 'justify-end'
            }`}
          >
            <Link href="/cars">
              <button
                onClick={() => setActiveTab('cars')}
                className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/40 transition-all text-sm font-semibold uppercase tracking-wider"
              >
                Explore Automotive
              </button>
            </Link>

            <Link href="/shop">
              <button
                onClick={() => setActiveTab('fashion')}
                className={`px-6 py-2 rounded-full backdrop-blur-md border transition-all text-sm font-semibold uppercase tracking-wider ${
                  isCars
                    ? 'bg-white/20 text-gray-500 border-white/30 hover:bg-black/40'
                    : 'bg-black/10 text-gray-900 border-black/20 hover:bg-black/20'
                }`}
              >
                Discover Fashion
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}