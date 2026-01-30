'use client';

import React, { useState } from 'react';
import { FaCar, FaTshirt, FaCheckCircle, FaUsers, FaLightbulb, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function AboutPageUi() {
  const [view, setView] = useState<'cars' | 'fashion'>('cars');

  const locationData = {
    cars: {
      title: "Automotive Showroom",
      address: "Lekki Phase 1, Lagos, Nigeria",
      // Luxury car showroom image
      image: "https://cdn.businessday.ng/2019/10/car-selling-websites-nigeria-1280x720.jpg",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15858.46132714275!2d3.4682!3d6.4474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf452da6c2873%3A0x384160965e88410c!2sLekki%20Phase%201!5e0!3m2!1sen!2sng!4v1700000000000"
    },
    fashion: {
      title: "Fashion Design Studio",
      address: "Victoria Island, Lagos, Nigeria",
      // High-end fashion studio image
      image: "https://lh5.googleusercontent.com/proxy/ge7LjxnA-5GxftETYKNyeZGJxHkZh53eFQL-cxxM7Qu6_mJJ5mEycDVQAZ9wKuZF9_v1iIM1qWNBO8AzB6kcH_tkSDkPxYS4o4kgsGLQfA0ZdBM",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15858.74540243454!2d3.4245!3d6.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53280e8948d%3A0x4d05e4de6b61803d!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000"
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920" 
            alt="GC WAB Luxury" 
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4">
            GC <span className="text-emerald-500">WAB</span>
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl font-bold uppercase tracking-[0.3em]">
            Lifestyle • Luxury • Logistics
          </p>
        </div>
      </section>

      {/* The Story & Dynamic Location Section */}
      <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase mb-6 tracking-tight">
                Where Elegance <br /> <span className="text-emerald-600">Meets the Road</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                <strong>Founded in Nigeria January, 2019</strong>, GC WAB emerged from a simple vision:  From our curated fashion collections that define Nigerian elegance to our premium automobile

              fleet, we provide a 360-degree luxury experience. Whether you are dressing for a corporate

              event or seeking a vehicle that commands respect, GC WAB is your trusted partner.
              </p>
            </div>

            {/* DYNAMIC LOCATION BOX */}
            <div className="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-100 shadow-inner">
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setView('cars')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${view === 'cars' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-400'}`}
                >
                  Car Showroom
                </button>
                <button 
                  onClick={() => setView('fashion')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${view === 'fashion' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-400'}`}
                >
                  Fashion Studio
                </button>
              </div>

              <div className="space-y-4">
                <div className="h-48 rounded-xl overflow-hidden relative group border-2 border-white shadow-md">
                  <img 
                    src={locationData[view].image} 
                    alt={locationData[view].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>

                <div className="rounded-xl overflow-hidden h-56 border-2 border-white shadow-md">
                   <iframe 
                    src={locationData[view].mapUrl}
                    className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                  ></iframe>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700 px-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                    <FaMapMarkerAlt size={14} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight">{locationData[view].address}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-8 mt-10">
              <Link href="/cars" className="flex flex-col items-center group cursor-pointer">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                  <FaCar size={26} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-emerald-600">Automotive</span>
              </Link>
              
              <Link href="/shop" className="flex flex-col items-center group cursor-pointer">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:-rotate-6">
                  <FaTshirt size={26} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-emerald-600">Fashion</span>
              </Link>
            </div>
          </div>

          {/* CEO SECTION */}
          <div className="relative sticky top-24">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-emerald-500 z-10"></div>
            <div className="aspect-[4/5] bg-gray-200 rounded-xl overflow-hidden shadow-2xl relative border-4 border-white">
              <img 
                src="/ceo3.png" 
                alt="CEO of GC WAB" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent text-white">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Your Name</h3>
                <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.3em]">Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Our Core Pillars</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            { icon: <FaCheckCircle />, title: "Quality", desc: "We source only the finest fabrics and the most reliable automotive engineering." },
            { icon: <FaUsers />, title: "Community", desc: "Building lasting relationships with our Nigerian clients through exceptional service." },
            { icon: <FaLightbulb />, title: "Innovation", desc: "Constantly evolving to bring global trends in fashion and tech to the local market." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all text-center group border border-gray-100">
              <div className="text-emerald-600 text-3xl mb-6 flex justify-center group-hover:scale-110 transition-transform">{item.icon}</div>
              <h4 className="text-lg font-black text-gray-900 uppercase mb-4 tracking-tighter">{item.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight">Experience GC WAB Today</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/cars" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
            View Car Fleet
          </Link>
          <Link href="/shop" className="border-2 border-gray-900 text-gray-900 px-5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all shadow-lg active:scale-95">
            Fashion Collection  
          </Link>
        </div>
      </section>
    </div>
  );
}