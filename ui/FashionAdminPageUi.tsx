'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { FaTshirt, FaPlus, FaArrowLeft, FaSignOutAlt, FaBoxes, FaAd, FaTimes, FaEdit, FaTrash, FaLayerGroup, FaUserTie, FaHome } from 'react-icons/fa';
import { toast } from 'sonner';
import FashionAdsEditor from '@/components/admin/fashion-admin/FashionAdsEditor';
import AddProductForm from '@/components/admin/fashion-admin/AddProductForm';
import FashionContactEditor from '@/components/admin/fashion-admin/ContactEditor';
import FashionHomeEditor from '@/components/admin/fashion-admin/FashionHomeEditor'; // Import new Home Editor

export default function FashionAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showAdsEditor, setShowAdsEditor] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showContactEditor, setShowContactEditor] = useState(false);
  const [showHomeEditor, setShowHomeEditor] = useState(false); // New Toggle State
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Sync Auth
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      const admin1 = process.env.NEXT_PUBLIC_ADMIN_ID_1;
      const admin2 = process.env.NEXT_PUBLIC_ADMIN_ID_2;
      if (user && (user.uid === admin1 || user.uid === admin2)) {
        setLoading(false);
      } else {
        router.push('/admin');
      }
    });
    return () => unsubAuth();
  }, [router]);

  // Sync Products List
  useEffect(() => {
    const q = query(collection(db, 'fashion_products'), orderBy('updatedAt', 'desc'));
    const unsubProducts = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubProducts();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowAddForm(true);
    setShowAdsEditor(false);
    setShowContactEditor(false);
    setShowHomeEditor(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteDoc(doc(db, 'fashion_products', id));
        toast.success("Product removed");
      } catch (e) {
        toast.error("Delete failed");
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-emerald-500 font-black uppercase tracking-widest animate-pulse">Opening Fashion Vault...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-6 pb-20">
      {/* TOP ACTION BAR */}
      <div className="flex justify-between items-center mb-8 pt-10">
        <button onClick={() => router.push('/admin')} className="group flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors font-bold uppercase text-[10px] tracking-widest">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>
        <button onClick={handleLogout} className="group flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold uppercase text-[10px] tracking-widest">
          Logout System <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Fashion <span className="text-emerald-500">Vault</span></h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Store & Stock Management</p>
        </div>
        
        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
          {/* Home Editor Toggle */}
          <button 
            onClick={() => { setShowHomeEditor(!showHomeEditor); setShowAdsEditor(false); setShowAddForm(false); setShowContactEditor(false); }} 
            className={`flex-1 md:flex-none justify-center items-center gap-3 px-2 md:px-6 py-4 rounded-xl font-black uppercase text-xs transition-all border ${showHomeEditor ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-amber-500 border-amber-500/30 hover:bg-amber-500/10'}`}
          >
            {showHomeEditor ? <><FaTimes className="inline mr-2" /> Close</> : <><FaHome className="inline mr-2" /> Home</>}
          </button>

          {/* Contact Toggle */}
          <button 
            onClick={() => { setShowContactEditor(!showContactEditor); setShowAdsEditor(false); setShowAddForm(false); setShowHomeEditor(false); }} 
            className={`flex-1 md:flex-none justify-center items-center gap-3 px-2 md:px-6 py-4 rounded-xl font-black uppercase text-xs transition-all border ${showContactEditor ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-transparent text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}
          >
            {showContactEditor ? <><FaTimes className="inline mr-2" /> Close</> : <><FaUserTie className="inline mr-2" /> Contacts</>}
          </button>

          {/* Hero Toggle */}
          <button 
            onClick={() => { setShowAdsEditor(!showAdsEditor); setShowAddForm(false); setShowContactEditor(false); setShowHomeEditor(false); }} 
            className={`flex-1 md:flex-none justify-center items-center gap-3 px-2 md:px-6 py-4 rounded-xl font-black uppercase text-xs transition-all border ${showAdsEditor ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-transparent text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}
          >
            {showAdsEditor ? <><FaTimes className="inline mr-2" /> Close</> : <><FaAd className="inline mr-2" /> Hero Banner</>}
          </button>

          {/* Add Product Toggle */}
          <button 
            onClick={() => { setShowAddForm(!showAddForm); setShowAdsEditor(false); setShowContactEditor(false); setShowHomeEditor(false); setEditingId(null); }} 
            className={`w-full md:w-55 hover:bg-emerald-500 text-white px-2 md:px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase text-xs transition-all active:scale-95 shadow-lg shadow-emerald-900/20 ${showAddForm ? 'bg-gray-700' : 'bg-emerald-600'}`}
          >
            {showAddForm ? <FaTimes /> : <FaPlus />} {showAddForm ? 'Close' : 'Add New Item'}
          </button>
        </div>
      </div>

      {/* RENDER EDITORS */}
      {showHomeEditor && <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-300"><FashionHomeEditor /></div>}
      {showContactEditor && <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-300"><FashionContactEditor /></div>}
      {showAdsEditor && <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-300"><FashionAdsEditor /></div>}

      {showAddForm && (
        <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-300">
          <AddProductForm editingId={editingId} onComplete={() => { setShowAddForm(false); setEditingId(null); }} />
        </div>
      )}

      {/* STOCK OVERVIEW & SNAPSHOT GRID */}
      {!showAdsEditor && !showAddForm && !showContactEditor && !showHomeEditor && (
        <div className="space-y-12">
          {/* STATS COUNT CARD */}
          <div className="bg-gray-900/50 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <FaLayerGroup size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold uppercase text-sm tracking-tight">Total Inventory</h3>
                <p className="text-gray-500 text-xs font-medium">{products.length} Items Live in Shop</p>
              </div>
            </div>
            <div className="text-sm md:text-xl font-black text-emerald-500">{products.length}</div>
          </div>

          {/* GRID SNAPSHOT */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-white font-black uppercase tracking-tighter text-xl">
              <FaBoxes className="text-emerald-500" /> Current <span className="text-emerald-500 italic">Inventory</span>
            </div>
            {products.length === 0 ? (
              <div className="mt-12 text-center py-20 border border-dashed border-white/10 rounded-xl">
                <FaTshirt className="mx-auto text-gray-800 mb-4" size={48} />
                <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">Vault is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-xl group relative flex flex-col hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(p.id)} className="bg-white p-2.5 rounded-lg text-emerald-800 shadow-xl hover:bg-emerald-800 hover:text-white transition-all">
                        <FaEdit size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="bg-white p-2.5 rounded-lg text-red-600 shadow-xl hover:bg-red-600 hover:text-white transition-all">
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <div className="h-48 overflow-hidden relative">
                      <img src={p.colors[0]?.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute bottom-2 left-2 flex -space-x-1.5">
                        {p.colors.slice(0, 3).map((c: any, i: number) => (
                          <div key={i} className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: c.code }} />
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                      <h4 className="text-[10px] font-black uppercase text-gray-900 truncate tracking-tight">{p.name}</h4>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs font-black text-emerald-800">₦{p.price.toLocaleString()}</span>
                        <span className="text-[7px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded font-black uppercase">{p.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}