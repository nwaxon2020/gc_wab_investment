'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { db } from '@/lib/firebaseConfig'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'

export default function SplitFeature({ activeTab }: { activeTab: 'cars' | 'fashion' }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [contact, setContact] = useState({ phone: '', email: '' })
  
  const [dynamicCarImages, setDynamicCarImages] = useState<string[]>([])
  const [dynamicFashionImages, setDynamicFashionImages] = useState<string[]>([])

  // 1. DYNAMIC IMAGES LOGIC
  useEffect(() => {
    const unsubCarConfig = onSnapshot(doc(db, 'site_settings', 'home_car_config'), async (snap) => {
      if (snap.exists()) {
        const ids = snap.data().featuredIds || []
        const imageUrls = await Promise.all(ids.map(async (id: string) => {
          const carDoc = await getDoc(doc(db, 'vehicles', id))
          return carDoc.exists() ? carDoc.data().images?.[0] : null
        }))
        setDynamicCarImages(imageUrls.filter(url => url !== null))
      }
    })

    const unsubFashConfig = onSnapshot(doc(db, 'site_settings', 'home_fashion_config'), async (snap) => {
      if (snap.exists()) {
        const ids = snap.data().featuredIds || []
        const imageUrls = await Promise.all(ids.map(async (id: string) => {
          const fashDoc = await getDoc(doc(db, 'fashion_products', id))
          return fashDoc.exists() ? fashDoc.data().colors?.[0]?.imageUrl : null
        }))
        setDynamicFashionImages(imageUrls.filter(url => url !== null))
      }
    })

    return () => { unsubCarConfig(); unsubFashConfig(); }
  }, [])

  // 2. IMAGE SWITCHING TIMER
  useEffect(() => {
    const activeImages = activeTab === 'cars' ? dynamicCarImages : dynamicFashionImages;
    if (activeImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeImages.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [dynamicCarImages, dynamicFashionImages, activeTab])

  // 3. FIXED DYNAMIC CONTACT LOGIC
  useEffect(() => {
    const docName = activeTab === 'cars' ? 'about_page' : 'fashion_contact'
    
    const unsub = onSnapshot(doc(db, 'site_settings', docName), (d) => {
      if (d.exists()) {
        const data = d.data()
        setContact({
          phone: data.phoneNumber || data.phone || '+2347034632037',
          email: data.email || 'info@gcwab.com'
        })
      }
    })
    return () => unsub()
  }, [activeTab])

  const sections = [
    {
      title: 'Luxury Cars',
      description: 'Explore our curated collection of premium vehicles, where performance meets elegance.',
      images: dynamicCarImages.length > 0 ? dynamicCarImages : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800'],
      href: '/cars'
    },
    {
      title: 'Fashion Collection',
      description: 'Discover trendsetting fashion with timeless elegance and exclusive designs.',
      images: dynamicFashionImages.length > 0 ? dynamicFashionImages : ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800'],
      href: '/shop'
    }
  ]

  // --- LOGIC FOR WHATSAPP LINK FORMATTING ---
  const formatWhatsAppNumber = (num: string) => {
    let cleaned = num.replace(/\D/g, ''); // Remove all non-digits
    if (cleaned.startsWith('0')) {
        cleaned = '234' + cleaned.substring(1); // Replace leading 0 with 234
    } else if (!cleaned.startsWith('234') && cleaned.length <= 11) {
        cleaned = '234' + cleaned; // Prepend 234 if missing
    }
    return cleaned;
  };

  const cleanPhoneForLink = formatWhatsAppNumber(contact.phone); 
  const whatsappMsg = encodeURIComponent(`Hello GC WAB, I'm interested in your ${activeTab === 'cars' ? 'Automobile' : 'Fashion'} services.`);

  return (
    <div className="relative mx-auto max-w-[1000px] px-3 md:px-6 my-16">
      
      {/* Dynamic WhatsApp Link */}
      <div className='text-center mb-8'>
        <a 
          href={`https://wa.me/${cleanPhoneForLink}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-bold tracking-widest uppercase text-sm transition-all duration-300 text-[#DAA520] hover:text-white"
          style={{ textShadow: '0 0 10px rgba(218, 165, 32, 0.6), 0 0 20px rgba(218, 165, 32, 0.4)' }}
        >
          <i className="fab fa-whatsapp mr-2"></i> 
          Contact via WhatsApp ({activeTab === 'cars' ? 'Auto' : 'Fashion'})
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="relative rounded-3xl overflow-hidden shadow-2xl group h-64 md:h-80 flex flex-col justify-end">
            {section.images.map((img, imgIdx) => (
              <img
                key={imgIdx}
                src={img}
                alt={section.title}
                className={`absolute inset-0 w-full h-full object-cover transform transition-opacity duration-1000 ease-in-out ${
                  imgIdx === currentIdx ? 'opacity-100 scale-105' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
            <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
              <h3 className="text-2xl font-bold mb-2">{section.title}</h3>
              <p className="text-sm md:text-base mb-4 opacity-90">{section.description}</p>
              <Link href={section.href} className="self-start px-8 py-2 rounded-full bg-amber-400 text-white font-bold hover:bg-amber-600 transition-all shadow-lg uppercase text-xs tracking-widest">
                Explore
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Email Link */}
      <div className='text-center mt-12'>
        <a 
          href={`mailto:${contact.email}`}
          className="inline-block border border-amber-400/30 p-2 rounded-lg font-bold tracking-widest uppercase text-[10px] transition-all duration-300 text-[#DAA520] hover:text-white hover:bg-amber-400/10"
          style={{ textShadow: '0 0 10px rgba(218, 165, 32, 0.6), 0 0 20px rgba(218, 165, 32, 0.4)' }}
        >
          Email {activeTab === 'cars' ? 'Automobile' : 'Fashion'}: {contact.email}
        </a>
      </div>
    </div>
  )
}