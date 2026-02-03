'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { FaSave, FaInfoCircle, FaMapMarkerAlt, FaImage, FaLink, FaUpload, FaShieldAlt, FaFileContract, FaPhoneAlt, FaEnvelope, FaTiktok, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function AboutSettingsEditor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Toggle modes for Hero and CEO images
    const [heroMode, setHeroMode] = useState<'file' | 'url'>('url');
    const [ceoMode, setCeoMode] = useState<'file' | 'url'>('url');

    const [data, setData] = useState({
        heroImage: '',
        subHeadline: 'Lifestyle • Luxury • Logistics', // Added this field
        mainTitle: '',
        mainDescription: '',
        ceoName: '',
        ceoImage: '',
        phoneNumber: '', 
        email: '',       
        tiktok: '',      // Added field
        facebook: '',    // Added field
        instagram: '',   // Added field
        carsLocation: { title: '', address: '', image: '', mapUrl: '' },
        fashionLocation: { title: '', address: '', image: '', mapUrl: '' },
        // New Legal Fields
        termsOfService: '',
        privacyPolicy: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, 'site_settings', 'about_page');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData(docSnap.data() as any);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        
        // Auto-format the Sub-Headline: "Lifestyle Luxury Logistics" -> "Lifestyle • Luxury • Logistics"
        const formattedSubHeadline = data.subHeadline
            .split(/[\s•]+/) // Split by spaces or existing dots
            .filter(word => word.length > 0) // Remove empty strings
            .join(' • '); // Join with the professional dot

        const finalData = {
            ...data,
            subHeadline: formattedSubHeadline
        };

        try {
            await setDoc(doc(db, 'site_settings', 'about_page'), finalData);
            setData(finalData); // Update local state with the dots
            toast.success("About page updated with proper formatting!");
        } catch (error) {
            toast.error("Failed to update");
        } finally {
            setSaving(false);
        }
    };

    // Simple preview for local file uploads
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'ceoImage') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData({ ...data, [field]: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="text-emerald-500 animate-pulse font-bold">Loading Editor...</div>;

    return (
        <div className="bg-gray-900 border border-white/5 rounded-xl p-2 md:p-6 shadow-2xl space-y-8">
            <div className="flex flex-col md:flex-row   gap-3 md:items-center md:justify-between border-b border-white/5 pb-4">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                    <FaInfoCircle className="text-emerald-500" /> About Page Content
                </h2>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold uppercase text-[10px] flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {/* HERO & STORY SECTION */}
                <div className="space-y-6">
                    <h3 className="text-emerald-500 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                        <FaImage /> Hero & Story
                    </h3>
                    
                    {/* Hero Image Selector */}
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-gray-500 text-[10px] uppercase font-bold">Hero Background</label>
                            <div className="flex bg-gray-900 rounded-lg p-1 text-[9px] font-bold">
                                <button type="button" onClick={() => setHeroMode('file')} className={`px-3 py-1 rounded-md ${heroMode === 'file' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>FILE</button>
                                <button type="button" onClick={() => setHeroMode('url')} className={`px-3 py-1 rounded-md ${heroMode === 'url' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>URL</button>
                            </div>
                        </div>
                        {heroMode === 'file' ? (
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'heroImage')} className="text-xs text-gray-400 w-full" />
                        ) : (
                            <input 
                                value={data.heroImage} 
                                onChange={(e) => setData({...data, heroImage: e.target.value})}
                                placeholder="Paste Hero Image URL"
                                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm outline-none focus:border-emerald-500"
                            />
                        )}
                    </div>

                    <div>
                        <label className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Sub-Headline (Lifestyle • Luxury • Logistics)</label>
                        <input 
                            value={data.subHeadline}
                            onChange={(e) => setData({...data, subHeadline: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
                            placeholder="e.g. Lifestyle • Luxury • Logistics"
                        />
                    </div>

                    <div>
                        <label className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Main Heading</label>
                        <input 
                            value={data.mainTitle}
                            onChange={(e) => setData({...data, mainTitle: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Story Description</label>
                        <textarea 
                            rows={4}
                            value={data.mainDescription}
                            onChange={(e) => setData({...data, mainDescription: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500 resize-none"
                        />
                    </div>
                </div>

                {/* CEO SECTION */}
                <div className="space-y-6">
                    <h3 className="text-emerald-500 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                        <FaImage /> CEO Settings
                    </h3>
                    
                    <div>
                        <label className="text-gray-500 text-[10px] uppercase font-bold block mb-1">CEO Name</label>
                        <input 
                            value={data.ceoName}
                            onChange={(e) => setData({...data, ceoName: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
                        />
                    </div>

                    {/* CEO Image Selector */}
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-gray-500 text-[10px] uppercase font-bold">CEO Profile Picture</label>
                            <div className="flex bg-gray-900 rounded-lg p-1 text-[9px] font-bold">
                                <button type="button" onClick={() => setCeoMode('file')} className={`px-3 py-1 rounded-md ${ceoMode === 'file' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>FILE</button>
                                <button type="button" onClick={() => setCeoMode('url')} className={`px-3 py-1 rounded-md ${ceoMode === 'url' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>URL</button>
                            </div>
                        </div>
                        {ceoMode === 'file' ? (
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'ceoImage')} className="text-xs text-gray-400 w-full" />
                        ) : (
                            <input 
                                value={data.ceoImage} 
                                onChange={(e) => setData({...data, ceoImage: e.target.value})}
                                placeholder="Paste CEO Image URL"
                                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm outline-none focus:border-emerald-500"
                            />
                        )}
                        {data.ceoImage && (
                            <img src={data.ceoImage} alt="CEO Preview" className="mt-4 h-20 w-16 object-cover rounded-lg border border-white/10" />
                        )}
                    </div>

                    {/* CONTACT & SOCIAL INPUTS */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-500 text-[10px] uppercase font-bold block mb-1 flex items-center gap-2">
                                    <FaPhoneAlt className="text-emerald-500" size={10} /> CEO Phone
                                </label>
                                <input 
                                    value={data.phoneNumber}
                                    onChange={(e) => setData({...data, phoneNumber: e.target.value})}
                                    placeholder="+234..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="text-gray-500 text-[10px] uppercase font-bold block mb-1 flex items-center gap-2">
                                    <FaEnvelope className="text-emerald-500" size={10} /> CEO Email
                                </label>
                                <input 
                                    value={data.email}
                                    onChange={(e) => setData({...data, email: e.target.value})}
                                    placeholder="ceo@company.com"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-gray-500 text-[10px] uppercase font-bold block mb-1 flex items-center gap-2">
                                    <FaTiktok className="text-emerald-500" size={10} /> TikTok URL
                                </label>
                                <input 
                                    value={data.tiktok}
                                    onChange={(e) => setData({...data, tiktok: e.target.value})}
                                    placeholder="https://tiktok.com/@username"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="text-gray-500 text-[10px] uppercase font-bold block mb-1 flex items-center gap-2">
                                    <FaFacebook className="text-emerald-500" size={10} /> Facebook URL
                                </label>
                                <input 
                                    value={data.facebook}
                                    onChange={(e) => setData({...data, facebook: e.target.value})}
                                    placeholder="https://facebook.com/username"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="text-gray-500 text-[10px] uppercase font-bold block mb-1 flex items-center gap-2">
                                    <FaInstagram className="text-emerald-500" size={10} /> Instagram URL
                                </label>
                                <input 
                                    value={data.instagram}
                                    onChange={(e) => setData({...data, instagram: e.target.value})}
                                    placeholder="https://instagram.com/username"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                {/* CARS LOCATION */}
                <div className="space-y-4">
                    <h3 className="text-emerald-500 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                        <FaMapMarkerAlt /> Automotive Location
                    </h3>
                    <input placeholder="Address" value={data.carsLocation.address} onChange={(e) => setData({...data, carsLocation: {...data.carsLocation, address: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500" />
                    <input placeholder="Showroom Image URL" value={data.carsLocation.image} onChange={(e) => setData({...data, carsLocation: {...data.carsLocation, image: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500" />
                    <input placeholder="Google Maps iframe URL" value={data.carsLocation.mapUrl} onChange={(e) => setData({...data, carsLocation: {...data.carsLocation, mapUrl: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500" />
                </div>

                {/* FASHION LOCATION */}
                <div className="space-y-4">
                    <h3 className="text-emerald-500 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                        <FaMapMarkerAlt /> Fashion Location
                    </h3>
                    <input placeholder="Address" value={data.fashionLocation.address} onChange={(e) => setData({...data, fashionLocation: {...data.fashionLocation, address: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500" />
                    <input placeholder="Studio Image URL" value={data.fashionLocation.image} onChange={(e) => setData({...data, fashionLocation: {...data.fashionLocation, image: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500" />
                    <input placeholder="Google Maps iframe URL" value={data.fashionLocation.mapUrl} onChange={(e) => setData({...data, fashionLocation: {...data.fashionLocation, mapUrl: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500" />
                </div>
            </div>

            {/* POLICY & TERMS SECTION - ADDED BELOW */}
            <div className="pt-8 border-t border-white/5 space-y-6">
                <h3 className="text-emerald-500 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                    <FaShieldAlt /> Policies & Terms
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-2">
                            <FaFileContract className="text-blue-500" /> Terms of Service
                        </label>
                        <textarea 
                            rows={8}
                            value={data.termsOfService}
                            onChange={(e) => setData({...data, termsOfService: e.target.value})}
                            placeholder="Detail your refund and service terms..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-emerald-500 resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-500 text-[10px] uppercase font-bold flex items-center gap-2">
                            <FaShieldAlt className="text-emerald-500" /> Privacy Policy
                        </label>
                        <textarea 
                            rows={8}
                            value={data.privacyPolicy}
                            onChange={(e) => setData({...data, privacyPolicy: e.target.value})}
                            placeholder="Explain your Google data usage..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-emerald-500 resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}