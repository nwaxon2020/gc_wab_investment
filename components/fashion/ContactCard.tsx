'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaUserTie } from 'react-icons/fa';

export default function FashionContactUi() {
  // HARDCODED DEFAULTS (Used if DB is empty)
  const defaultValues = {
    ceoName: "Abidex Lead",
    ceoImage: "/ceo2_gcwab.jpeg", 
    phoneNumber: "+2347034632037",
    email: "fashion@gcwab.com"
  };

  const [config, setConfig] = useState(defaultValues);

  useEffect(() => {
    // UPDATED: Now listens to the unique 'fashion_contact' document
    const unsub = onSnapshot(doc(db, 'site_settings', 'fashion_contact'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig({
          ceoName: data.ceoName || defaultValues.ceoName,
          ceoImage: data.ceoImage || defaultValues.ceoImage,
          phoneNumber: data.phoneNumber || defaultValues.phoneNumber,
          email: data.email || defaultValues.email,
        });
      }
    });

    return () => unsub();
  }, []);

  const openWhatsApp = () => {
    // 1. Remove all non-numeric characters (strips +, spaces, dashes)
    let cleanNumber = config.phoneNumber.replace(/\D/g, '');
    
    // 2. Safety check: If number starts with '0', replace with '234' (for Nigeria)
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '234' + cleanNumber.substring(1);
    }

    const message = encodeURIComponent("Hello! I'm interested in your fashion collection.");
    
    // 3. Using wa.me is the most modern and reliable way to open the specific chat page
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="max-w-4xl mx-auto my-16 px-3 md:px-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-emerald-500/20 shadow-2xl flex flex-col md:flex-row items-stretch">
        
        {/* LEFT: IMAGE */}
        <div className="md:w-1/3 relative min-h-[350px] md:min-h-auto overflow-hidden bg-gray-800">
          <img 
            src={config.ceoImage} 
            alt={config.ceoName} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        {/* RIGHT: INFO */}
        <div className="md:w-2/3 p-4 md:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
              <FaUserTie /> Fashion Studio Lead
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
              {config.ceoName}
            </h2>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-md">
              Ready to redefine your style? Reach out to our design lead for custom measurements, bulk orders, or premium style consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href={`tel:${config.phoneNumber}`} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-all group">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <FaPhoneAlt size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Call Directly</p>
                <p className="text-white text-xs font-bold">{config.phoneNumber}</p>
              </div>
            </a>

            <a href={`mailto:${config.email}`} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 transition-all group">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <FaEnvelope size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Email Us</p>
                <p className="text-white text-xs font-bold truncate max-w-[140px]">{config.email}</p>
              </div>
            </a>
          </div>

          <button onClick={openWhatsApp} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95">
            <FaWhatsapp className="text-xl" /> Chat on WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
}