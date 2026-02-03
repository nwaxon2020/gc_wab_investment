'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/home/Hero'
import Link from 'next/link'
import News from '@/components/News'
import SplitFeature from '@/components/home/SplitFeature'
import { db } from '@/lib/firebaseConfig'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'cars' | 'fashion'>('cars')
  const [isLoaded, setIsLoaded] = useState(false)
  const [carData, setCarData] = useState<any[]>([])
  const [fashionData, setFashionData] = useState<any[]>([])
  const [homeConfig, setHomeConfig] = useState<any>({ cars: {}, fashion: {} })

  useEffect(() => {
    const savedTab = localStorage.getItem('gc-wab-active-tab') as 'cars' | 'fashion'
    if (savedTab) setActiveTab(savedTab)
    setIsLoaded(true)

    const unsubCar = onSnapshot(doc(db, 'site_settings', 'home_car_config'), async (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setHomeConfig((prev: any) => ({ ...prev, cars: data }))
        
        const ids = data.featuredIds || []
        const items = await Promise.all(ids.map(async (id: string) => {
          const d = await getDoc(doc(db, 'vehicles', id))
          return d.exists() ? { id: d.id, src: d.data().images?.[0] } : null
        }))
        setCarData(items.filter(Boolean))
      }
    })

    const unsubFash = onSnapshot(doc(db, 'site_settings', 'home_fashion_config'), async (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setHomeConfig((prev: any) => ({ ...prev, fashion: data }))
        
        const ids = data.featuredIds || []
        const items = await Promise.all(ids.map(async (id: string) => {
          const d = await getDoc(doc(db, 'fashion_products', id))
          return d.exists() ? { id: d.id, src: d.data().colors?.[0]?.imageUrl } : null
        }))
        setFashionData(items.filter(Boolean))
      }
    })

    return () => { unsubCar(); unsubFash(); }
  }, [])

  const handleTabChange = (tab: 'cars' | 'fashion') => {
    setActiveTab(tab)
    localStorage.setItem('gc-wab-active-tab', tab)
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-[#16a34a]/10 to-transparent blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-tr from-[#14532d]/5 to-transparent blur-3xl animate-float-reverse" />
      </div>

      <Hero activeTab={activeTab} isLoaded={isLoaded} setActiveTab={handleTabChange} />

      <main className="relative z-10 container mx-auto sm:px-6 lg:px-8 pt-8 pb-6 md:pb-16">
        <div className="px-3 flex justify-center mb-12">
          <div className="hidden md:block inline-flex rounded-xl p-1 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
            <button
              onClick={() => handleTabChange('cars')}
              className={`p-4 md:px-8 rounded-xl text-sm md:text-lg font-semibold transition-all duration-300 ${activeTab === 'cars' ? 'text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'}`}
              style={{ backgroundColor: activeTab === 'cars' ? '#14532d' : 'transparent' }}
            >
              <i className="fas fa-car mr-3"></i> {activeTab === 'cars' ? 'Luxury Cars' : 'Cars'}
            </button>
            <button
              onClick={() => handleTabChange('fashion')}
              className={`px-4 md:px-8 py-4 rounded-xl text-sm md:text-lg font-semibold transition-all duration-300 ${activeTab === 'fashion' ? 'text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'}`}
              style={{ backgroundColor: activeTab === 'fashion' ? '#14532d' : 'transparent' }}
            >
              <i className="fas fa-tshirt mr-3"></i> {activeTab === 'fashion' ? 'Fashion Collection' : 'Fashion'}
            </button>
          </div>
        </div>

        <div className="px-3 grid lg:grid-cols-2 gap-12 mb-16">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* ADJUSTED TO TEXT-LEFT */}
            <div className="bg-white rounded-xl p-8 shadow-2xl border border-gray-100 h-full flex flex-col justify-center text-left">
              <h2 className="text-2xl md:text-4xl font-bold mb-6 text-[#14532d] leading-tight">
                {activeTab === 'cars' 
                  ? (homeConfig.cars?.heroTitle || 'Premium Automotive Division') 
                  : (homeConfig.fashion?.heroTitle || 'Elite Fashion Brand')}
              </h2>
              <p className="text-gray-700 text-lg mb-4 md:mb-8 leading-relaxed">
                {activeTab === 'cars' 
                  ? (homeConfig.cars?.heroDescription || 'Discover our curated collection of luxury vehicles.')
                  : (homeConfig.fashion?.heroDescription || 'Explore our exclusive fashion line.')}
              </p>
              {/* REMOVED ITEMS-CENTER TO KEEP LIST LEFT ALIGNED */}
              <ul className="text-sm md:text-base space-y-3 mb-8 flex flex-col items-start">
                {(activeTab === 'cars' 
                  ? [
                      homeConfig.cars?.feature1 || 'Premium Performance', 
                      homeConfig.cars?.feature2 || 'Luxury Interiors', 
                      homeConfig.cars?.feature3 || 'Exclusive Models'
                    ]
                  : [
                      homeConfig.fashion?.feature1 || 'Premium Materials', 
                      homeConfig.fashion?.feature2 || 'Artisanal Craftsmanship', 
                      homeConfig.fashion?.feature3 || 'Limited Editions'
                    ]
                ).map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700 font-bold tracking-tight">
                    <i className="fas fa-check mr-3 text-[#16a34a]"></i> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="grid grid-cols-2 gap-4 h-full">
              {(activeTab === 'cars' ? carData : fashionData).map((item, index) => (
                <div key={item.id} className={`relative overflow-hidden rounded-xl ${index === 0 ? 'col-span-2 h-64' : 'h-48'}`}>
                  <Link href={activeTab === 'cars' ? `/cars?view=${item.id}` : `/shop#shophere`}>
                    <img 
                      src={item.src} 
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700 cursor-pointer" 
                      alt="Featured Item" 
                    />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                    <Link 
                      href={activeTab === 'cars' ? `/cars?view=${item.id}` : `/shop#shophere`}
                      className="text-xs bg-white text-[#14532d] px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-2 hover:translate-y-0 transition-transform"
                    >
                      {activeTab === 'cars' ? 'View Details' : 'Explore More Options'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 mx-auto mt-auto max-w-xs text-center">
            <Link 
                href={activeTab === 'cars' ? '/cars' : '/shop'}
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
          <SplitFeature activeTab={activeTab}/>
      </div>
    </div>
  )
}