'use client';

import { auth } from '@/lib/firebaseConfig';
import { FaCar, FaTshirt, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
import { signOut } from 'firebase/auth';

export default function AdminDashboardUi() {
  const user = auth.currentUser;
  
  // Logic: Identify which admin is logged in
  const isMaster = user?.uid === process.env.NEXT_PUBLIC_ADMIN_ID_1;
  const isFashionAdmin = user?.uid === process.env.NEXT_PUBLIC_ADMIN_ID_2;

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div className="h-[100vh] overflow-y-auto p-4 md:p-6 md:p-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
            GC WAB <span className="text-emerald-500">Control Center</span>
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            Access Level: {isMaster ? 'Master Administrator' : 'Department Manager'}
          </p>
        </div>
        <button onClick={handleLogout} className="flex  gap-2 p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
          <FaSignOutAlt size={20} />
          <span className='text-xs'>Log Out</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CAR MANAGEMENT CARD (Admin 1 Only) */}
        {isMaster && (
          <Link href="/admin/cars" className="group">
            <div className="bg-gray-900 border border-white/5 p-8 rounded-xl hover:border-emerald-500/50 transition-all shadow-2xl relative overflow-hidden h-64 flex flex-col justify-end">
              <div className="absolute top-8 right-8 text-white/5 group-hover:text-emerald-500/10 transition-colors">
                <FaCar size={120} />
              </div>
              <FaCar className="text-emerald-500 mb-4" size={32} />
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Automotive Fleet</h3>
              <p className="text-gray-500 text-sm mt-2">Manage car inventory, specs, and pricing.</p>
              <div className="mt-4 inline-block text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-lg">
                Enter Car Admin
              </div>
            </div>
          </Link>
        )}

        {/* FASHION MANAGEMENT CARD (Admin 1 & Admin 2) */}
        {(isMaster || isFashionAdmin) && (
          <Link href="/admin/fashion" className="group">
            <div className="bg-gray-900 border border-white/5 p-8 rounded-xl hover:border-emerald-500/50 transition-all shadow-2xl relative overflow-hidden h-64 flex flex-col justify-end">
              <div className="absolute top-8 right-8 text-white/5 group-hover:text-emerald-500/10 transition-colors">
                <FaTshirt size={120} />
              </div>
              <FaTshirt className="text-emerald-500 mb-4" size={32} />
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Fashion Store</h3>
              <p className="text-gray-500 text-sm mt-2">Manage products, stock levels, and colors.</p>
              <div className="mt-4 inline-block text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-lg">
                Enter Fashion Admin
              </div>
            </div>
          </Link>
        )}
      </div>

      {!isMaster && !isFashionAdmin && (
        <div className="text-center py-20 bg-red-500/5 rounded-3xl border border-dashed border-red-500/20">
          <FaUserShield className="mx-auto text-red-500 mb-4" size={40} />
          <p className="text-red-500 font-bold uppercase text-xs">Unauthorized Staff Access</p>
        </div>
      )}
    </div>
  );
}