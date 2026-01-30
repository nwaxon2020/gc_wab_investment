'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaEdit, FaImage, FaHeading, FaParagraph, FaSave, FaLink, FaUpload, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';

export default function HeroSettingsEditor() {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [imageMode, setImageMode] = useState<'file' | 'url'>('url');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const [settings, setSettings] = useState({
        title: '',
        subtitle: '',
        description: '',
        bgImage: ''
    });

    useEffect(() => {
        const fetchCurrentSettings = async () => {
            try {
                const docRef = doc(db, 'site_settings', 'car_hero');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as any;
                    setSettings(data);
                    setPreviewUrl(data.bgImage || '');
                }
            } catch (error) {
                console.error("Error loading hero settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentSettings();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setUpdating(true);
        try {
            let finalImageUrl = settings.bgImage;

            if (imageMode === 'file' && selectedFile) {
                const storageRef = ref(storage, `hero/car_hero_bg_${Date.now()}`);
                await uploadBytes(storageRef, selectedFile);
                finalImageUrl = await getDownloadURL(storageRef);
            }

            const docRef = doc(db, 'site_settings', 'car_hero');
            await setDoc(docRef, {
                ...settings,
                bgImage: finalImageUrl,
                updatedAt: serverTimestamp()
            }, { merge: true });

            setSettings(prev => ({ ...prev, bgImage: finalImageUrl }));
            toast.success("Hero Section Updated Live!");
        } catch (error) {
            toast.error("Failed to update hero settings");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="animate-pulse text-emerald-500 text-[10px] font-bold">LOADING SETTINGS...</div>;

    return (
        <div className="bg-gray-900/80 border border-white/5 p-2 md:p-6 rounded-xl shadow-xl space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <FaEdit size={18} />
                </div>
                <div>
                    <h2 className="text-white font-black text-sm uppercase tracking-tight">Hero Customizer</h2>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Single Grid Management</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
                {/* Title - Forced Uppercase */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2">
                        <FaHeading className="text-emerald-500" /> Main Title
                    </label>
                    <input 
                        value={settings.title}
                        // .toUpperCase() ensures data is saved in caps
                        onChange={(e) => setSettings({...settings, title: e.target.value.toUpperCase()})}
                        // uppercase class ensures visual caps while typing
                        className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition-all uppercase"
                        placeholder="E.G. PREMIUM COLLECTION"
                    />
                </div>

                {/* Subtitle - Forced Uppercase */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2">
                        <FaParagraph className="text-emerald-500" /> Subtitle
                    </label>
                    <input 
                        value={settings.subtitle}
                        onChange={(e) => setSettings({...settings, subtitle: e.target.value.toUpperCase()})}
                        className="w-full bg-black/50 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition-all uppercase"
                        placeholder="E.G. ELITE AUTOMOTIVE LUXURY"
                    />
                </div>

                {/* Background Image Toggle & Input */}
                <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2">
                            <FaImage className="text-emerald-500" /> Background Image
                        </label>
                        <div className="flex bg-gray-900 rounded-lg p-1 text-[9px] font-bold">
                            <button type="button" onClick={() => setImageMode('file')} className={`px-3 py-1 rounded-md transition-all ${imageMode === 'file' ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}>FILE</button>
                            <button type="button" onClick={() => setImageMode('url')} className={`px-3 py-1 rounded-md transition-all ${imageMode === 'url' ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}>URL</button>
                        </div>
                    </div>

                    {imageMode === 'file' ? (
                        <div className="flex items-center gap-3">
                            <label className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 border border-dashed border-emerald-500/30 p-3 rounded-xl cursor-pointer hover:bg-emerald-500/20 transition-all">
                                <FaUpload className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-500 uppercase">{selectedFile ? selectedFile.name : 'Upload New Background'}</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            {selectedFile && <button onClick={() => {setSelectedFile(null); setPreviewUrl(settings.bgImage)}} className="text-red-500 p-2"><FaTimes /></button>}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 bg-black/50 border border-white/10 p-1 rounded-xl">
                            <div className="p-2 text-emerald-500"><FaLink size={12} /></div>
                            <input 
                                value={settings.bgImage}
                                onChange={(e) => {setSettings({...settings, bgImage: e.target.value}); setPreviewUrl(e.target.value)}}
                                className="w-full bg-transparent p-2 text-xs text-white outline-none"
                                placeholder="Paste Image Link Here..."
                            />
                        </div>
                    )}

                    {/* Preview Area */}
                    <div className="relative aspect-[21/9] rounded-lg overflow-hidden border border-white/10 mt-2">
                        {previewUrl ? (
                            <img src={previewUrl} className="w-full h-full object-cover opacity-60" alt="Hero Preview" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-700 text-[10px] font-bold">NO BACKGROUND SET</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                            <span className="text-white/30 font-black text-xs uppercase italic tracking-tighter">Live Preview Window</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Main Description</label>
                    <textarea 
                        value={settings.description}
                        onChange={(e) => setSettings({...settings, description: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition-all h-24"
                        placeholder="Describe the collection in detail..."
                    />
                </div>
            </div>

            {/* Save Button */}
            <button 
                onClick={handleSave}
                disabled={updating}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
            >
                <FaSave /> {updating ? 'Syncing...' : 'Push Updates Live'}
            </button>
        </div>
    );
}