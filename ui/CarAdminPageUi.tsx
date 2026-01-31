'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, deleteDoc, query, orderBy, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FaCar, FaPlus, FaArrowLeft, FaSignOutAlt, FaTrash, FaEdit, FaExclamationTriangle, FaTimes, FaImage, FaCalculator, FaWhatsapp, FaEnvelope, FaSave } from 'react-icons/fa';
import AddVehicleForm from '@/components/admin/car-admin/AddVehicleForm';
import { toast } from 'sonner';
import HeroSettingsEditor from '@/components/admin/car-admin/HeroSettingsEditor';
import FinanceSettingsEditor from '@/components/admin/car-admin/FinanceSettingsEditor';

export default function CarAdminUi() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false); 
  const [showHeroEditor, setShowHeroEditor] = useState(false); 
  const [showFinanceEditor, setShowFinanceEditor] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New states for Contact Info
  const [contactInfo, setContactInfo] = useState({ whatsapp: '', email: '' });
  const [savingContact, setSavingContact] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = auth.currentUser;
      const admin1 = process.env.NEXT_PUBLIC_ADMIN_ID_1;
      if (user) {
        if (user.uid !== admin1) router.push('/admin');
        else setLoading(false);
      }
    };
    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [router]);

  // Fetch Vehicles and Contact Info
  useEffect(() => {
    const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
    const unsubVehicles = onSnapshot(q, (snapshot) => {
      setVehicles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const fetchContacts = async () => {
      const docRef = doc(db, 'site_settings', 'contacts');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setContactInfo(docSnap.data() as any);
    };
    fetchContacts();

    return () => unsubVehicles();
  }, []);

 
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'vehicles', deleteId));
      toast.success("Vehicle deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-emerald-500 font-black uppercase tracking-widest animate-pulse">Opening Vault...</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <div className="flex justify-between items-center mb-8 pt-10">
        <button onClick={() => router.push('/admin')} className="group flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors font-bold uppercase text-[10px] tracking-widest">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <button onClick={handleLogout} className="group flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold uppercase text-[10px] tracking-widest">
          Logout System <FaSignOutAlt />
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Fleet <span className="text-emerald-500">Inventory</span></h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Premium Automobile Management</p>
        </div>
        
        <div className="flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-auto">
          <div className='flex justify-center items-center gap-3 w-full md:w-auto'>
            <button onClick={() => { setShowFinanceEditor(!showFinanceEditor); setShowHeroEditor(false); setShowAddForm(false); }} className={`flex flex-1 md:flex-none justify-center items-center gap-3 px-3 md:px-5 py-4 rounded-xl font-black uppercase text-xs transition-all border ${showFinanceEditor ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-transparent text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}>
              {showFinanceEditor ? <><FaTimes /> Close</> : <><FaCalculator /> Finance Rates</>}
            </button>
            <button onClick={() => { setShowHeroEditor(!showHeroEditor); setShowFinanceEditor(false); setShowAddForm(false); }} className={`flex flex-1 md:flex-none justify-center items-center gap-3 px-3 md:px-5 py-4 rounded-xl font-black uppercase text-xs transition-all border ${showHeroEditor ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-transparent text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}>
              {showHeroEditor ? <><FaTimes /> Close</> : <><FaImage />Car Hero Pg</>}
            </button>
          </div>
          <button onClick={() => { setShowAddForm(!showAddForm); setShowHeroEditor(false); setShowFinanceEditor(false); }} className={`flex flex-1 md:flex-none justify-center items-center gap-3 px-8 py-4 rounded-xl font-black uppercase text-xs transition-all ${showAddForm ? 'bg-gray-700 text-white' : 'bg-emerald-500 text-white'}`}>
            {showAddForm ? <FaTimes /> : <FaPlus />} {showAddForm ? 'Close' : 'Add Car'}
          </button>
        </div>
      </div>

      {showFinanceEditor && <div className="mb-16"><FinanceSettingsEditor /></div>}
      {showHeroEditor && <div className="mb-16"><HeroSettingsEditor /></div>}
      {showAddForm && <div className="mb-16"><AddVehicleForm onSuccess={() => setShowAddForm(false)} /></div>}

      {/* SYSTEM STATUS CARD WITH CONTACT INPUTS */}
      <div className="grid gap-4">
        <div className="bg-gray-900 border border-white/5 p-2 py-4 md:p-6 rounded-xl flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-emerald-500/30 transition-all shadow-2xl">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
              <FaCar size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold uppercase text-sm tracking-tight">Fleet Status</h3>
              <p className="text-gray-500 text-xs font-medium">Database Sync Active ({vehicles.length} Units)</p>
            </div>
          </div>

          <span className="hidden lg:block text-[10px] bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full font-black uppercase tracking-tighter">Live</span>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        {vehicles.map((car) => (
          <div key={car.id} className="bg-gray-900 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-4 w-full">
              <div className="w-20 h-14 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                <img src={car.images?.[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold uppercase text-xs tracking-tight">{car.name} {car.model}</h3>
                <p className="text-emerald-500 text-[10px] font-black">₦{Number(car.price).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => router.push(`/admin/cars/edit/${car.id}`)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"><FaEdit /> Edit</button>
              <button onClick={() => setDeleteId(car.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f0f] w-full max-w-sm rounded-3xl p-8 border border-white/10 shadow-2xl text-center">
            <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">Delete Car?</h2>
            <div className="flex gap-4">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-black uppercase text-[10px]">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px]">{isDeleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}