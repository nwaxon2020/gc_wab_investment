'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';
import { FaSave, FaPlus, FaTrash, FaAd, FaSearch, FaExclamationTriangle, FaCheckCircle, FaChevronDown } from 'react-icons/fa';

// --- DELETE CONFIRMATION MODAL ---
const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaExclamationTriangle size={24} />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter text-black">Remove Slide?</h3>
                <p className="text-gray-500 text-xs mt-2 font-medium">This banner will be removed from your active slides.</p>
                <div className="flex gap-3 mt-6">
                    <button onClick={onCancel} className="flex-1 py-3 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-red-200">Remove</button>
                </div>
            </div>
        </div>
    );
};

export default function FashionAdsEditor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [slides, setSlides] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // --- NEW STATE FOR "ONE AT A TIME" SELECTION ---
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [slideDraft, setSlideDraft] = useState<any>(null);

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, index: -1 });

    useEffect(() => {
        const fetchAds = async () => {
            const docRef = doc(db, 'site_settings', 'fashion_hero');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setSlides(docSnap.data().slides || []);
            setLoading(false);
        };

        const q = query(collection(db, 'fashion_products'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setInventory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        fetchAds();
        return () => unsub();
    }, []);

    // 1. SELECT PRODUCT (Ticking one at a time)
    const handlePickProduct = (product: any) => {
        // Prevent double selecting the same product already in the list
        if (slides.some(s => s.buttonLink === product.id)) {
            return toast.error("This product is already in your slides.");
        }

        setSelectedProduct(product);
        setSlideDraft({
            title: product.name,
            subtitle: "New Collection",
            description: "Premium items curated for you.",
            image: product.colors[0]?.imageUrl || "",
            buttonText: "Shop Now",
            buttonLink: product.id 
        });
    };

    // 2. CONFIRM DRAFT (Add to bottom list and clear picker)
    const confirmSlide = () => {
        if (slides.length >= 5) {
            return toast.error("Maximum 5 slides allowed.");
        }
        setSlides([...slides, slideDraft]);
        setSelectedProduct(null);
        setSlideDraft(null);
        toast.success("Slide added to the pending list!");
    };

    const handleSaveToDB = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'site_settings', 'fashion_hero'), { slides });
            toast.success("Website Banners Updated Successfully!");
        } catch (e) {
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-pink-500 animate-pulse font-bold p-8">Loading Inventory...</div>;

    return (
        <div className="grid lg:grid-cols-3 gap-4 md:gap-8 p-1 md:p-4 bg-gray-950 min-h-screen text-white">
            <ConfirmDeleteModal 
                isOpen={deleteModal.isOpen} 
                onConfirm={() => {
                    setSlides(slides.filter((_, i) => i !== deleteModal.index));
                    setDeleteModal({ isOpen: false, index: -1 });
                }}
                onCancel={() => setDeleteModal({ isOpen: false, index: -1 })}
            />

            {/* LEFT SIDE: THE DRAFTING FORM & LIVE SLIDES */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <FaAd className="text-pink-500" /> Hero Ad Manager
                        </h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{slides.length}/5 Banners Live</p>
                    </div>
                    <button onClick={handleSaveToDB} disabled={saving || slides.length === 0} className="bg-pink-600 hover:bg-pink-500 disabled:opacity-30 transition-all text-white px-10 py-4 rounded-2xl text-xs font-black uppercase shadow-xl">
                        {saving ? 'Syncing...' : 'Publish to Site'}
                    </button>
                </div>

                {/* --- DRAFTING SECTION (Shows only when product is ticked) --- */}
                {slideDraft ? (
                    <div className="bg-white p-3 md:p-8 rounded-3xl border-4 border-pink-500/20 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="text-black font-black uppercase italic tracking-tighter text-xl">Drafting Banner</h3>
                            <button onClick={() => {setSelectedProduct(null); setSlideDraft(null);}} className="text-gray-400 text-xs underline font-bold">Cancel Selection</button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <input 
                                    placeholder="Main Title"
                                    value={slideDraft.title}
                                    onChange={(e) => setSlideDraft({...slideDraft, title: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-black font-bold outline-none focus:border-pink-500"
                                />
                                <input 
                                    placeholder="Subtitle"
                                    value={slideDraft.subtitle}
                                    onChange={(e) => setSlideDraft({...slideDraft, subtitle: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-black font-bold outline-none focus:border-pink-500"
                                />
                                <textarea 
                                    placeholder="Description"
                                    value={slideDraft.description}
                                    onChange={(e) => setSlideDraft({...slideDraft, description: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-black font-medium outline-none focus:border-pink-500 h-24 resize-none"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-900 rounded-2xl p-4 flex gap-4 items-center">
                                    <img src={slideDraft.image} className="w-20 h-20 object-cover rounded-lg border-2 border-pink-500" alt="Preview" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Selected Image</p>
                                        <p className="text-[9px] text-gray-400 truncate">ID: {slideDraft.buttonLink}</p>
                                    </div>
                                </div>
                                <input 
                                    placeholder="Button Text"
                                    value={slideDraft.buttonText}
                                    onChange={(e) => setSlideDraft({...slideDraft, buttonText: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-black font-bold outline-none focus:border-pink-500"
                                />
                                <button onClick={confirmSlide} className="w-full bg-black text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                                    <FaPlus /> Confirm Slide
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-xl bg-white/5">
                        <FaAd className="mx-auto text-2xl md:text-4xl text-white/10 mb-2" />
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Tick a product on the right to start drafting a banner</p>
                    </div>
                )}

                {/* --- LIVE PREVIEW LIST --- */}
                <div className="space-y-4 pt-8">
                    <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em] flex items-center gap-2">
                        <FaChevronDown /> Current Queue
                    </h4>
                    {slides.map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-2 rounded-2xl flex items-center gap-6 group">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                <img src={s.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h5 className="font-black text-sm uppercase italic">{s.title}</h5>
                                <p className="text-[10px] text-gray-500">{s.subtitle}</p>
                            </div>
                            <button onClick={() => setDeleteModal({ isOpen: true, index: i })} className="p-3 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl transition-all">
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE: INVENTORY PICKER */}
            <div className="bg-black/60 p-3 md:p-6 rounded-xl border border-white/5 space-y-4 h-[85vh] sticky top-4 overflow-y-auto no-scrollbar">
                <div className="sticky top-0 bg-black/80 backdrop-blur-md pb-4 z-10">
                    <h3 className="font-black text-xs uppercase tracking-widest text-pink-500 mb-4">Select Product</h3>
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input 
                            placeholder="Search store..." 
                            className="w-full bg-gray-900 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs outline-none focus:border-pink-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    {inventory
                        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(product => {
                            const isTicked = selectedProduct?.id === product.id;
                            const isUsed = slides.some(s => s.buttonLink === product.id);
                            
                            return (
                                <div 
                                    key={product.id} 
                                    onClick={() => !isUsed && handlePickProduct(product)}
                                    className={`group cursor-pointer rounded-2xl p-3 border transition-all flex items-center gap-4 ${
                                        isTicked ? 'bg-pink-600 border-pink-500 shadow-lg' : 
                                        isUsed ? 'opacity-30 cursor-not-allowed border-white/5 bg-white/5' : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                                        <img src={product.colors[0]?.imageUrl} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[10px] font-black uppercase truncate">{product.name}</h4>
                                        <p className="text-[8px] font-bold text-gray-500 uppercase">{product.category}</p>
                                    </div>
                                    {isTicked && <FaCheckCircle className="text-white" />}
                                    {isUsed && <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded">USED</span>}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}