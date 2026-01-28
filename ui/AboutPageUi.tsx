'use client';

import React from 'react';
import { FaCar, FaTshirt, FaCheckCircle, FaUsers, FaLightbulb } from 'react-icons/fa';
import Link from 'next/link';

export default function AboutPageUi() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - The Brand Identity */}
      <section className="relative h-[50vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Car" 
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

      {/* The Story Section */}
      <section className="py-20 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase mb-6 tracking-tight">
              Where Elegance <br /> <span className="text-emerald-600">Meets the Road</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Founded in Nigeria, GC WAB emerged from a simple vision: Luxury shouldn't be fragmented. 
              We believe that how you look and how you move are the ultimate expressions of status and comfort.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From our curated fashion collections that define Nigerian elegance to our premium automotive 
              fleet, we provide a 360-degree luxury experience. Whether you are dressing for a corporate 
              gala or seeking a vehicle that commands respect, GC WAB is your trusted partner.
            </p>
            
            <div className="flex gap-8 mt-10">
              {/* Automotive Link */}
              <Link href="/cars" className="flex flex-col items-center group cursor-pointer">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <FaCar size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-emerald-600 transition-colors">Automotive</span>
              </Link>
              
              {/* Fashion Link */}
              <Link href="/shop" className="flex flex-col items-center group cursor-pointer">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <FaTshirt size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-emerald-600 transition-colors">Fashion</span>
              </Link>
            </div>
          </div>

          {/* CEO SECTION */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-emerald-500 z-10"></div>
            <div className="aspect-[4/5] bg-gray-200 rounded-2xl overflow-hidden shadow-2xl relative">
              <img 
                src="/ceo3.png" 
                alt="CEO of GC WAB" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Your Name</h3>
                <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Founder & CEO</p>
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
            <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="text-emerald-600 text-3xl mb-6 flex justify-center">{item.icon}</div>
              <h4 className="text-lg font-bold text-gray-900 uppercase mb-4">{item.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight">Experience GC WAB Today</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/shop" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all">
            View Car Fleet
          </Link>
          <Link href="/cars" className="border-2 border-gray-900 text-gray-900 px-3 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-50 transition-all">
            Fashion Collection  
          </Link>
        </div>
      </section>
    </div>
  );
}