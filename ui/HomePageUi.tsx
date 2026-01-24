'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/home/Hero'
import Link from 'next/link'
import News from '@/components/News'
import SplitFeature from '@/components/home/SplitFeature'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'cars' | 'fashion'>('cars')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const carImages = [
    "https://hips.hearstapps.com/hmg-prod/images/2026-toyota-camry-se-hybrid-nightshade-fwd-155-695bf27312d0c.jpg?crop=0.766xw:0.643xh;0.161xw,0.260xh&resize=1200:*",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfVK-e56gp2cu8L7zZ61b1JPq5WIDV2WL2aA&s",
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800",
  ]

  const fashionImages = [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ]

  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-[#16a34a]/10 to-transparent blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-tr from-[#14532d]/5 to-transparent blur-3xl animate-float-reverse" />
      </div>

      <Hero activeTab={activeTab} isLoaded={isLoaded} setActiveTab={setActiveTab} />

      <main className="relative z-10 container mx-auto sm:px-6 lg:px-8 pt-8 pb-6 md:pb-16">
        <div className="px-3 flex justify-center mb-12">
          <div className="inline-flex rounded-2xl p-1 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('cars')}
              className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${activeTab === 'cars' ? 'text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'}`}
              style={{ backgroundColor: activeTab === 'cars' ? '#14532d' : 'transparent' }}
            >
              <span className='hidden md:block'><i className="fas fa-car mr-3"></i> Luxury Cars</span>
              <span className='md:hidden'><i className="fas fa-car mr-3"></i> Cars</span>
            </button>
            <button
              onClick={() => setActiveTab('fashion')}
              className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${activeTab === 'fashion' ? 'text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'}`}
              style={{ backgroundColor: activeTab === 'fashion' ? '#14532d' : 'transparent' }}
            >
              <span className='hidden md:block'><i className="fas fa-tshirt mr-3"></i> Fashion Collection</span>
              <span className='md:hidden'><i className="fas fa-tshirt mr-3"></i> Fashion</span>
            </button>
          </div>
        </div>

        <div className="px-4 grid lg:grid-cols-2 gap-12 mb-16">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 h-full">
              <h2 className="text-center text-2xl md:text-4xl font-bold mb-6 text-[#14532d]">
                {activeTab === 'cars' ? 'Premium Automotive Division' : 'Elite Fashion Brand'}
              </h2>
              <p className="text-gray-700 text-lg mb-4 md:mb-8 leading-relaxed">
                {activeTab === 'cars' 
                  ? 'Discover our curated collection of luxury vehicles, where performance meets elegance.'
                  : 'Explore our exclusive fashion line where contemporary style meets timeless elegance.'}
              </p>
              <ul className="text-sm md:text-base space-y-1 md:space-y-2 mb-2 md:mb-8">
                {(activeTab === 'cars' 
                  ? ['Premium Performance', 'Luxury Interiors', 'Exclusive Models']
                  : ['Premium Materials', 'Artisanal Craftsmanship', 'Limited Editions']
                ).map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700 font-medium">
                    <i className="fas fa-check mr-3 text-[#16a34a]"></i> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="grid grid-cols-2 gap-4 h-full">
              {(activeTab === 'cars' ? carImages : fashionImages).map((src, index) => (
                <div key={index} className={`relative overflow-hidden rounded-2xl ${index === 0 ? 'col-span-2 h-64' : 'h-48'}`}>
                  {/* Logic: Click image to go to cars page and auto-open details for ID 1, 2, or 3 */}
                  <Link href={activeTab === 'cars' ? `/cars?view=${index + 1}` : `/shop/${index}`}>
                    <img src={src} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700 cursor-pointer" alt="Item" />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                    <Link 
                      href={activeTab === 'cars' ? `/cars?view=${index + 3}` : `/shop/${index}`}
                      className="bg-white text-[#14532d] px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-2 hover:translate-y-0 transition-transform"
                    >
                      {activeTab === 'cars' ? 'View More' : 'Pick Up'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 mx-auto mt-auto max-w-xs text-center">
            <Link 
                href={activeTab === 'cars' ? '/cars' : '/fashion'}
                className="inline-flex items-center px-10 py-4 rounded-2xl text-white text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                style={{ backgroundColor: '#14532d' }}
            >
                {activeTab === 'cars' ? 'Explore Inventory' : 'Visit Store'}
                <i className="fas fa-arrow-right ml-3 text-sm"></i>
            </Link>
        </div>
      </main>

      <div className="mb-16 border-t border-gray-200">
          <News category={activeTab} />
      </div>

      <div className='bg-gray-900 py-4'>
          <SplitFeature/>
          <div></div>
      </div>
    </div>
  )
}