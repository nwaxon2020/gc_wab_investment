'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { FaPlus, FaTrash, FaSave, FaPalette, FaRulerCombined, FaLayerGroup, FaEdit, FaHashtag, FaTimes, FaLink, FaUpload, FaLeaf, FaExclamationTriangle } from 'react-icons/fa';

// --- CUSTOM CONFIRMATION MODAL ---
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-emerald-50">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full text-red-500">
          <FaExclamationTriangle size={20} />
        </div>
        <h3 className="text-lg font-black text-center text-gray-900 uppercase tracking-tighter">{title}</h3>
        <p className="mt-2 text-sm text-center text-gray-500 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 px-4 py-3 text-xs font-black uppercase bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-3 text-xs font-black uppercase bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all">Confirm</button>
        </div>
      </div>
    </div>
  );
};

// ADDED PROPS TO COLLECT FROM FASHION ADMIN
export default function FashionProductManager({ editingId: editingIdProp, onComplete }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(editingIdProp || null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, type: '', id: '', message: '' });

  const coreCategories = [
    'Dresses', 'Suits', 'Shirts', 'Trousers', 'Shoes', 'Ankara / Lace', 'Agbada', 'Kaftans', 'Kente', 
    'Bangles', 'Eyeglasses', 'Belts', 'Hats', 'Scarves', 'Bra', 'Boxers', 'Pants', 'G-Strings', 'Lingerie', 
    'Bags', 'Wrist Watch', 'Jewelry', 'Cosmetics'
  ];

  const [categories, setCategories] = useState(coreCategories);
  const [newCat, setNewCat] = useState('');
  const [sizeType, setSizeType] = useState<'cloth' | 'shoe' | 'waist' | 'none'>('cloth');

  const initialForm = {
    name: '',
    price: 0,
    description: '',
    category: 'Dresses',
    stock: 0,
    tags: '',
    colors: [{ name: '', code: '#064e3b', imageUrl: '', mode: 'url' as 'url' | 'file' }],
    sizes: [] as { size: string, inStock: boolean }[]
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const q = query(collection(db, 'fashion_products'), orderBy('createdAt', 'desc'));
    const unsubProducts = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubCats = onSnapshot(doc(db, 'site_settings', 'fashion_categories'), (docSnap) => {
      if (docSnap.exists()) {
        const savedCats = docSnap.data().list || [];
        setCategories(Array.from(new Set([...coreCategories, ...savedCats])));
      }
    });

    // LOAD DATA IF EDITING
    if (editingId) {
        const fetchItem = async () => {
            const docSnap = await getDoc(doc(db, 'fashion_products', editingId));
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFormData({ ...data, tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags } as any);
            }
        };
        fetchItem();
    }

    return () => { unsubProducts(); unsubCats(); };
  }, [editingId]);

  const saveCategoriesToDB = async (newList: string[]) => {
    const customOnly = newList.filter(c => !coreCategories.includes(c));
    await setDoc(doc(db, 'site_settings', 'fashion_categories'), { list: customOnly });
  };

  const handleAddCategory = async () => {
    if (newCat.trim()) {
      const updated = [...categories, newCat.trim()];
      setCategories(updated);
      await saveCategoriesToDB(updated);
      setNewCat('');
      toast.success("Category saved");
    }
  };

  // ADDED FILE CHANGE HANDLER
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newColors = [...formData.colors];
        newColors[index].imageUrl = reader.result as string;
        setFormData({ ...formData, colors: newColors });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (editingId) return; // Prevent overwriting existing sizes on edit
    let defaultSizes: string[] = [];
    
    if (sizeType === 'cloth') {
      defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    } else if (sizeType === 'waist') {
      defaultSizes = ['28', '30', '32', '34', '36', '38', '40', '42'];
    } else if (sizeType === 'shoe') {
      defaultSizes = ['37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
    } else {
      defaultSizes = ['One Size'];
    }

    setFormData(prev => ({
      ...prev,
      sizes: defaultSizes.map(s => ({ size: s, inStock: true }))
    }));
  }, [sizeType, editingId]);

  const handleSubmit = async () => {
    if (!formData.name || formData.price <= 0) return toast.error("Please fill Name & Price");
    setLoading(true);
    const tagsArray = typeof formData.tags === 'string' ? formData.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== "") : formData.tags;
    const submissionData = { ...formData, price: Number(formData.price), stock: Number(formData.stock), tags: tagsArray, updatedAt: serverTimestamp() };

    try {
      if (editingId) { await updateDoc(doc(db, 'fashion_products', editingId), submissionData); } 
      else { await addDoc(collection(db, 'fashion_products'), { ...submissionData, createdAt: serverTimestamp(), likes: 0, reviews: [] }); }
      setFormData(initialForm); 
      setEditingId(null); 
      toast.success("Success!");
      if (onComplete) onComplete(); // CLOSE FORM ON COMPLETION
    } catch (e) { toast.error("Failed"); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-12 pb-24 text-gray-900">
      <ConfirmModal isOpen={confirmState.isOpen} title="Confirm Removal" message={confirmState.message} onConfirm={async () => {
          if (confirmState.type === 'product') await deleteDoc(doc(db, 'fashion_products', confirmState.id));
          else if (confirmState.type === 'category') {
              const filtered = categories.filter(c => c !== formData.category);
              setCategories(filtered); await saveCategoriesToDB(filtered);
              setFormData({...formData, category: filtered[0]});
          }
          setConfirmState({ isOpen: false, type: '', id: '', message: '' });
      }} onCancel={() => setConfirmState({ isOpen: false, type: '', id: '', message: '' })} />

      <div className="bg-white border border-emerald-100 rounded-xl shadow-2xl p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-emerald-50 pb-8 font-black uppercase tracking-tighter italic">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-emerald-800 rounded-xl flex items-center justify-center text-white"><FaLeaf size={24} /></div>
             <h2 className="text-2xl text-gray-900">{editingId ? "Edit" : "New"} <span className="text-emerald-700">Apparel</span></h2>
          </div>
          <div className="flex gap-3">
             {editingId && <button onClick={() => {setEditingId(null); setFormData(initialForm); if(onComplete) onComplete();}} className="px-6 py-4 bg-gray-50 text-gray-400 rounded-xl text-[10px]">Cancel</button>}
             <button onClick={handleSubmit} disabled={loading} className="bg-emerald-800 text-white px-10 py-4 rounded-xl text-xs flex items-center gap-2 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all">
                <FaSave /> {loading ? "Syncing..." : "Save to Shop"}
             </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Details */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-2 tracking-widest px-2"><FaLayerGroup /> Details</h3>
            <input placeholder="Item Name" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none font-bold text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <div className="space-y-1">
                <div className="flex gap-2">
                    <select className="flex-1 bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none font-bold text-gray-600 text-xs" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex items-center gap-1 bg-emerald-50/50 p-1 rounded-xl border border-emerald-100">
                        <input placeholder="New..." className="w-16 bg-white border border-emerald-100 p-2 rounded-lg text-[9px]" value={newCat} onChange={e => setNewCat(e.target.value)} />
                        <button onClick={handleAddCategory} className="p-2.5 bg-emerald-800 text-white rounded-lg shadow-sm"><FaPlus size={10}/></button>
                        <button onClick={() => { if (!coreCategories.includes(formData.category)) setConfirmState({ isOpen: true, type: 'category', id: '', message: `Delete "${formData.category}"?` }); else toast.error("Protected"); }} className={`p-2.5 rounded-lg ${!coreCategories.includes(formData.category) ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-200'}`}><FaTrash size={10}/></button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-800 font-black">₦</span><input type="number" placeholder="Price" className="w-full bg-emerald-50/20 border border-emerald-50 p-4 rounded-xl pl-8 font-black text-emerald-800 outline-none" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} /></div>
                <input type="number" placeholder="Stock" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl font-bold outline-none" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
            </div>
            
            {/* ADDED DESCRIPTION FIELD */}
            <textarea 
              placeholder="Product Description" 
              className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none font-medium text-xs h-32 resize-none" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
            />

            <input placeholder="Tags (men, luxury...)" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none text-xs font-medium" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
          </div>

          {/* Sizing Section */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-2 tracking-widest px-2"><FaRulerCombined /> Sizing System</h3>
            <div className="flex bg-emerald-50 p-1 rounded-xl border border-emerald-100 gap-1">
                {[
                    { id: 'cloth', label: 'Cloth', icon: '👔' },
                    { id: 'shoe', label: 'Shoes', icon: '👟' },
                    { id: 'waist', label: 'Waist', icon: '👖' },
                    { id: 'none', label: 'N/A', icon: '✖' }
                ].map((btn) => (
                    <button 
                        key={btn.id}
                        onClick={() => setSizeType(btn.id as any)}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${sizeType === btn.id ? 'bg-emerald-800 text-white shadow-md scale-105' : 'text-emerald-800/40 hover:text-emerald-800'}`}
                    >
                        <span className="block mb-0.5 text-xs">{btn.icon}</span>
                        {btn.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-4 gap-2 p-5 bg-gray-50/50 rounded-xl border border-gray-100 shadow-inner min-h-[150px]">
              {formData.sizes.map((s, i) => (
                <button key={i} onClick={() => {
                  const newSizes = [...formData.sizes]; newSizes[i].inStock = !newSizes[i].inStock; setFormData({...formData, sizes: newSizes});
                }} className={`max-h-15 py-3 rounded-xl border text-[10px] font-black transition-all ${s.inStock ? 'bg-white border-emerald-400 text-emerald-800 shadow-sm' : 'bg-transparent border-gray-200 text-gray-300'}`}>{s.size}</button>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="space-y-6 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-4">
               <h3 className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-2 tracking-widest"><FaPalette /> Photo Gallery</h3>
               <button onClick={() => setFormData({...formData, colors: [...formData.colors, { name: '', code: '#064e3b', imageUrl: '', mode: 'url' }]})} className="bg-emerald-800 text-white font-black text-[9px] uppercase px-4 py-2 rounded-xl">Add Photo</button>
            </div>
            {formData.colors.map((color, i) => (
              <div key={i} className="p-5 bg-gray-50/50 rounded-xl border border-gray-100 relative space-y-4">
                <button onClick={() => setFormData({...formData, colors: formData.colors.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"><FaTimes size={12}/></button>
                <div className="flex gap-2 items-center">
                  <input type="color" className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none" value={color.code} onChange={e => { const c = [...formData.colors]; c[i].code = e.target.value; setFormData({...formData, colors: c}); }} />
                  <input placeholder="Color Name" className="flex-1 bg-white border border-gray-200 px-3 py-2.5 rounded-xl text-xs font-bold focus:border-emerald-600 outline-none" value={color.name} onChange={e => { const c = [...formData.colors]; c[i].name = e.target.value; setFormData({...formData, colors: c}); }} />
                </div>
                
                <div className="flex bg-white rounded-xl p-1 text-[8px] font-black gap-1 border border-gray-100">
                    <button onClick={() => {const c = [...formData.colors]; c[i].mode = 'url'; setFormData({...formData, colors: c});}} className={`flex-1 py-2 rounded-lg transition-all ${color.mode === 'url' ? 'bg-emerald-800 text-white shadow-md' : 'text-gray-400'}`}>
                        <FaLink className="inline mr-1" /> URL
                    </button>
                    <button onClick={() => {const c = [...formData.colors]; c[i].mode = 'file'; setFormData({...formData, colors: c});}} className={`flex-1 py-2 rounded-lg transition-all ${color.mode === 'file' ? 'bg-emerald-800 text-white shadow-md' : 'text-gray-400'}`}>
                        <FaUpload className="inline mr-1" /> FILE
                    </button>
                </div>

                {color.mode === 'url' ? (
                  <input placeholder="Image Link" className="w-full bg-white border border-gray-100 p-3 rounded-xl text-[10px] outline-none" value={color.imageUrl} onChange={e => { const c = [...formData.colors]; c[i].imageUrl = e.target.value; setFormData({...formData, colors: c}); }} />
                ) : (
                  <input type="file" accept="image/*" className="text-[10px] w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" onChange={(e) => handleFileChange(e, i)} />
                )}

                {color.imageUrl && <img src={color.imageUrl} className="w-full h-32 object-cover rounded-xl mt-2 border border-white shadow-sm" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8 px-2">
        <h2 className="text-xl font-black text-white uppercase flex items-center gap-3 italic"><FaLayerGroup className="text-emerald-700" /> Inventory Snapshot</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-xl border border-emerald-50 group relative hover:-translate-y-2 transition-all duration-500">
              <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => { setEditingId(p.id); setFormData({...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags}); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="bg-white p-3 rounded-xl text-emerald-800 shadow-2xl hover:bg-emerald-800 hover:text-white transition-all"><FaEdit size={12}/></button>
                 <button onClick={() => setConfirmState({ isOpen: true, type: 'product', id: p.id, message: `Delete "${p.name}"?` })} className="bg-white p-3 rounded-xl text-red-600 shadow-2xl hover:bg-red-600 hover:text-white transition-all"><FaTrash size={12}/></button>
              </div>
              <img src={p.colors[0]?.imageUrl} className="w-full h-48 object-cover transition-transform group-hover:scale-110" />
              <div className="p-4">
                <h4 className="text-[10px] font-black uppercase text-gray-900 truncate tracking-tight">{p.name}</h4>
                <div className="flex justify-between items-center mt-3"><span className="text-xs font-black text-emerald-800">₦{p.price.toLocaleString()}</span><span className="text-[7px] bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-black">{p.category}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}