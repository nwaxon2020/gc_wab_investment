'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { FaTshirt, FaPlus, FaArrowLeft, FaSignOutAlt, FaBoxes } from 'react-icons/fa';

export default function FashionAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = auth.currentUser;
      const admin1 = process.env.NEXT_PUBLIC_ADMIN_ID_1;
      const admin2 = process.env.NEXT_PUBLIC_ADMIN_ID_2;

      if (user) {
        // Allow access if user is EITHER Admin 1 or Admin 2
        if (user.uid === admin1 || user.uid === admin2) {
          setLoading(false);
        } else {
          router.push('/admin');
        }
      }
    };

    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-emerald-500 font-black uppercase tracking-widest animate-pulse">
          Opening Fashion Vault...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* TOP ACTION BAR */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => router.push('/admin')}
          className="group flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <button 
          onClick={handleLogout}
          className="group flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          Logout System
          <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
            Fashion <span className="text-emerald-500">Inventory</span>
          </h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
            Store & Stock Management
          </p>
        </div>
        
        <button className="w-full md:w-55 md:flex justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl flex items-center gap-3 font-black uppercase text-xs transition-all active:scale-95 shadow-lg shadow-emerald-900/20">
          <FaPlus /> Add New Item
        </button>
      </div>

      {/* STOCK OVERVIEW CARD */}
      <div className="grid gap-4">
        <div className="bg-gray-900 border border-white/5 p-6 rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <FaBoxes size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold uppercase text-sm tracking-tight">Collection Status</h3>
              <p className="text-gray-500 text-xs font-medium">Global Store Sync Active</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full font-black uppercase tracking-tighter">
            Live
          </span>
        </div>
      </div>

      {/* Placeholder for the List of Products */}
      <div className="mt-12 text-center py-20 border border-dashed border-white/10 rounded-xl">
         <FaTshirt className="mx-auto text-gray-800 mb-4" size={48} />
         <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">No products uploaded yet</p>
      </div>
    </div>
  );
}