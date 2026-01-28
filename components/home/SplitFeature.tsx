'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SplitFeature() {
  const [currentIdx, setCurrentIdx] = useState(0)

  const carImages = [
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ]

  const fashionImages = [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ]

  const sections = [
    {
      title: 'Luxury Cars',
      description: 'Explore our curated collection of premium vehicles, where performance meets elegance.',
      images: carImages,
      href: '/cars'
    },
    {
      title: 'Fashion Collection',
      description: 'Discover trendsetting fashion with timeless elegance and exclusive designs.',
      images: fashionImages,
      href: '/fashion'
    }
  ]

  // LOGIC: Image Switching Timer (Every 8 Seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % carImages.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [carImages.length])

  const contact = [
    { phone: '+2347034632037' }, 
    { email: 'princenwachukwu308@yahoo.com' }
  ]

  const rawPhone = contact[0]?.phone || '';
  const cleanPhoneForLink = rawPhone.replace(/\D/g, ''); 
  const whatsappMsg = encodeURIComponent("Hello GC WAB, I visited your website and would like to learn more about your luxury services.");

  return (
    <div className="relative mx-auto max-w-[1000px] px-3 md:px-6 my-16">
      
      {/* WhatsApp Link */}
      <div className='text-center mb-8'>
        <a 
          href={`https://wa.me/${cleanPhoneForLink}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-bold tracking-widest uppercase text-sm transition-all duration-300 text-[#DAA520] hover:text-white"
          style={{ 
            textShadow: '0 0 10px rgba(218, 165, 32, 0.6), 0 0 20px rgba(218, 165, 32, 0.4)' 
          }}
        >
          <i className="fab fa-whatsapp mr-2"></i> Contact us via WhatsApp
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="relative rounded-3xl overflow-hidden shadow-2xl group h-64 md:h-80 flex flex-col justify-end"
          >
            {/* Background Images with Fade Transition */}
            {section.images.map((img, imgIdx) => (
              <img
                key={imgIdx}
                src={img}
                alt={section.title}
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transform transition-opacity duration-1000 ease-in-out ${
                  imgIdx === currentIdx ? 'opacity-100 scale-105' : 'opacity-0'
                }`}
              />
            ))}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
              <h3 className="text-2xl font-bold mb-2">{section.title}</h3>
              <p className="text-sm md:text-base mb-4 opacity-90">{section.description}</p>
              <Link
                href={section.href}
                className="self-start px-8 py-2 rounded-full bg-amber-400 text-white font-bold hover:bg-amber-600 transition-all shadow-lg uppercase text-xs tracking-widest"
              >
                Explore
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Email Link */}
      <div className='text-center mt-12'>
        <a 
          href={`mailto:${contact[1]?.email || ''}`}
          className="inline-block border border-amber-400/30 p-2 rounded-lg font-bold tracking-widest uppercase text-[10px] transition-all duration-300 text-[#DAA520] hover:text-white hover:bg-amber-400/10"
          style={{ 
            textShadow: '0 0 10px rgba(218, 165, 32, 0.6), 0 0 20px rgba(218, 165, 32, 0.4)', 
          }}
        >
          Email Us: {contact[1]?.email || ''}
        </a>
      </div>

    </div>
  )
}