'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { FaTshirt, FaSave, FaCheckCircle, FaListUl, FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';

export default function FashionHomeEditor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [config, setConfig] = useState({
        heroTitle: 'Elite Fashion Brand',
        heroDescription: 'Explore our exclusive fashion line where contemporary style meets timeless elegance.',
        feature1: 'Premium Materials',
        feature2: 'Artisanal Craftsmanship',
        feature3: 'Limited Editions',
        featuredIds: [] as string[]
    });

    useEffect(() => {
        const fetchData = async () => {
            const prodSnap = await getDocs(collection(db, 'fashion_products'));
            setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            const configSnap = await getDoc(doc(db, 'site_settings', 'home_fashion_config'));
            if (configSnap.exists()) {
                setConfig(prev => ({ ...prev, ...configSnap.data() }));
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const toggleFeatured = (id: string) => {
        setConfig(prev => {
            const isFeatured = prev.featuredIds.includes(id);
            if (isFeatured) return { ...prev, featuredIds: prev.featuredIds.filter(i => i !== id) };
            if (prev.featuredIds.length >= 3) {
                toast.error("Max 3 items allowed");
                return prev;
            }
            return { ...prev, featuredIds: [...prev.featuredIds, id] };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'site_settings', 'home_fashion_config'), { ...config, updatedAt: serverTimestamp() }, { merge: true });
            toast.success("Fashion Home Settings Updated!");
        } catch (e) {
            toast.error("Save failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-pink-500 animate-pulse">Loading Fashion Editor...</div>

    return (
        <div className="space-y-6 max-w-4xl bg-gray-900/80 border border-white/5 p-6 rounded-2xl shadow-2xl mx-auto">
            <h2 className="text-white font-bold flex items-center gap-2"><FaTshirt className="text-pink-500"/> Fashion Home Editor</h2>
            
            <div className="grid gap-4">
                <input className="bg-black/40 p-3 rounded-xl border border-white/10 text-white outline-none focus:border-pink-500" value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} placeholder="Section Title" />
                <textarea className="bg-black/40 p-3 rounded-xl border border-white/10 text-white h-24 outline-none focus:border-pink-500" value={config.heroDescription} onChange={(e) => setConfig({...config, heroDescription: e.target.value})} placeholder="Section Description (Left Aligned)" />
            </div>

            <div className="bg-black/20 p-4 rounded-xl space-y-3">
                <p className="text-pink-500 text-[10px] font-black uppercase flex items-center gap-2"><FaListUl /> Brand Features</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input className="bg-gray-900 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-pink-500" value={config.feature1} onChange={(e) => setConfig({...config, feature1: e.target.value})} placeholder="Feature 1" />
                    <input className="bg-gray-900 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-pink-500" value={config.feature2} onChange={(e) => setConfig({...config, feature2: e.target.value})} placeholder="Feature 2" />
                    <input className="bg-gray-900 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-pink-500" value={config.feature3} onChange={(e) => setConfig({...config, feature3: e.target.value})} placeholder="Feature 3" />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map(product => (
                    <div key={product.id} onClick={() => toggleFeatured(product.id)} className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${config.featuredIds.includes(product.id) ? 'border-pink-500 scale-[1.02]' : 'border-transparent opacity-60'}`}>
                        <img src={product.colors?.[0]?.imageUrl} className="w-full h-24 object-cover" />
                        <div className="p-2 bg-black/80 text-[9px] text-white truncate">{product.name}</div>
                        {config.featuredIds.includes(product.id) && <FaCheckCircle className="absolute top-2 right-2 text-pink-500 bg-white rounded-full"/>}
                    </div>
                ))}
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full bg-pink-600 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2">
                <FaSave/> {saving ? 'Saving...' : 'Update Fashion Home Page'}
            </button>
        </div>
    );
}