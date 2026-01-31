'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'; // Added serverTimestamp
import { useParams, useRouter } from 'next/navigation';
import { FaCar, FaVideo, FaPlus, FaTimes, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'sonner';

export default function EditVehiclePageUi() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [imageMode, setImageMode] = useState<'file' | 'url'>('url');
    const [videoMode, setVideoMode] = useState<'file' | 'url'>('url');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreview, setVideoPreview] = useState('');
    const [urlImages, setUrlImages] = useState<string[]>(['']);

    const [formData, setFormData] = useState({
        name: '', model: '', price: '', year: '', type: 'Sedan',
        transmission: 'Automatic', condition: 'Tokunbo', engine: 'V6',
        trim: 'LE', papers: 'Yes', interior: '', exterior: '',
        description: '', videoSource: '',
    });

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const docRef = doc(db, 'vehicles', id as string);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        ...formData,
                        name: data.name, model: data.model, price: data.price,
                        year: data.specs[0], engine: data.specs[1], condition: data.specs[2],
                        transmission: data.specs[3], papers: data.specs[4], exterior: data.specs[5],
                        interior: data.specs[6], trim: data.specs[7],
                        description: data.description, videoSource: data.videoUrl
                    });
                    setImagePreviews(data.images || []);
                    setUrlImages(data.images?.length > 0 ? data.images : ['']);
                    setVideoPreview(data.videoUrl || '');
                } else {
                    toast.error("Vehicle not found");
                    router.push('/admin/cars');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'videoSource' && videoMode === 'url') setVideoPreview(value);
    };

    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...urlImages];
        newUrls[index] = value;
        setUrlImages(newUrls);
        setImagePreviews(newUrls.filter(url => url.trim() !== ''));
    };

    const addUrlField = () => { if (urlImages.length < 10) setUrlImages([...urlImages, '']); };

    const removeUrlField = (index: number) => {
        const newUrls = urlImages.filter((_, i) => i !== index);
        setUrlImages(newUrls);
        setImagePreviews(newUrls.filter(url => url.trim() !== ''));
    };

    const removeImagePreview = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        if (imageMode === 'url') removeUrlField(index);
    };

    const removeVideo = () => {
        setVideoPreview('');
        setFormData(prev => ({ ...prev, videoSource: '' }));
        const vidInput = document.getElementById('vidFile') as HTMLInputElement;
        if (vidInput) vidInput.value = "";
    };

    const handleFileChange = (e: any, type: 'image' | 'video') => {
        if (type === 'image') {
            const files = Array.from(e.target.files).slice(0, 10);
            const urls = (files as File[]).map(file => URL.createObjectURL(file));
            setImagePreviews(urls);
        } else {
            const file = e.target.files?.[0];
            if (file) setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let finalImageUrls = imagePreviews; 
            let finalVideoUrl = videoPreview;

            // Optional: Re-upload logic if imageMode === 'file' could go here

            const vehicleRef = doc(db, 'vehicles', id as string);
            await updateDoc(vehicleRef, {
                ...formData,
                price: Number(formData.price),
                images: finalImageUrls,
                videoUrl: finalVideoUrl,
                createdAt: serverTimestamp(), // Refreshing the timestamp bumps it to the top
                specs: [
                    formData.year, formData.engine, formData.condition,
                    formData.transmission, formData.papers, formData.exterior,
                    formData.interior, formData.trim
                ],
            });

            toast.success("Vehicle Updated Successfully!");
            router.push('/admin/cars');
        } catch (error) {
            toast.error("Error updating vehicle");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center text-emerald-500 font-black">FETCHING VEHICLE DATA...</div>;

    return (
        <div className="max-w-6xl mx-auto px-3 md:px-6 py-10">
            <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-emerald-500 font-bold uppercase text-xs">
                <FaArrowLeft /> Back to Inventory
            </button>

            <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-white/5 p-2 md:p-6 md:p-10 rounded-xl shadow-2xl">
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="bg-black/40 p-4 md:p-6 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
                                    <FaCar /> Edit Images ({imagePreviews.length}/10)
                                </span>
                                <div className="flex bg-gray-900 rounded-lg p-1 text-[9px] font-bold">
                                    <button type="button" onClick={() => setImageMode('file')} className={`text-white font-semibold px-3 py-1 rounded-md ${imageMode === 'file' ? 'bg-emerald-600' : ''}`}>FILE</button>
                                    <button type="button" onClick={() => setImageMode('url')} className={`text-white font-semibold px-3 py-1 rounded-md ${imageMode === 'url' ? 'bg-emerald-600' : ''}`}>URL</button>
                                </div>
                            </div>

                            {imageMode === 'file' ? <input type="file" id="imgFile" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="text-xs text-gray-500 w-full" /> : 
                            <div className="space-y-2">
                                {urlImages.map((url, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input value={url} onChange={(e) => handleUrlChange(idx, e.target.value)} placeholder={`Image URL ${idx + 1}`} className="text-white flex-1 bg-transparent border-b border-white/10 py-2 text-sm outline-none focus:border-emerald-500 transition-all" />
                                        {idx > 0 && <button type="button" onClick={() => removeUrlField(idx)} className="text-red-500"><FaTimes /></button>}
                                    </div>
                                ))}
                                <button type="button" onClick={addUrlField} className="text-[10px] text-emerald-500 font-bold uppercase mt-2 flex items-center gap-1"><FaPlus /> Add URL</button>
                            </div>}

                            <div className="grid grid-cols-5 gap-2 mt-4">
                                {imagePreviews.map((src, i) => (
                                    <div key={i} className="relative group aspect-video">
                                        <img src={src} className="h-full w-full object-cover rounded-md border border-white/10" />
                                        <button type="button" onClick={() => removeImagePreview(i)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><FaTimes size={8} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-black/40 p-4 md:p-6 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-black uppercase text-red-500 tracking-widest flex items-center gap-2"><FaVideo /> Video</span>
                                <div className="flex bg-gray-900 rounded-lg p-1 text-[9px] font-bold">
                                    <button type="button" onClick={() => setVideoMode('file')} className={`text-white font-semibold px-3 py-1 rounded-md ${videoMode === 'file' ? 'bg-red-600' : ''}`}>FILE</button>
                                    <button type="button" onClick={() => setVideoMode('url')} className={`text-white font-semibold px-3 py-1 rounded-md ${videoMode === 'url' ? 'bg-red-600' : ''}`}>URL</button>
                                </div>
                            </div>
                            {videoMode === 'file' ? <input type="file" id="vidFile" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="text-xs text-gray-500 w-full" /> : <input name="videoSource" value={formData.videoSource} onChange={handleInputChange} placeholder="Paste Video URL" className="text-white w-full bg-transparent border-b border-white/10 py-2 text-sm outline-none focus:border-red-500 transition-all" />}
                            {videoPreview && (
                                <div className="relative mt-4 group">
                                    <video src={videoPreview} controls className="h-40 w-full object-cover rounded-xl border border-white/10" />
                                    <button type="button" onClick={removeVideo} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"><FaTrash size={12} /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 text-gray-600">
                        <div className="grid grid-cols-2 gap-4">
                            <select name="name" value={formData.name} onChange={handleInputChange} required className="bg-black/80 text-gray-300 font-semibold border border-white/10 p-3 rounded-xl text-xs font-bold uppercase">
                                <option value="">Select Brand</option>
                                {["Toyota", "Honda", "Volkswagen", "Mercedes-Benz", "BMW", "Audi", "Mazda", "Peugeot", "Nissan", "Mitsubishi", "Volvo", "Others"].map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <input name="model" value={formData.model} placeholder="Model" onChange={handleInputChange} className="text-white bg-black/80 border border-white/10 p-3 rounded-xl text-xs font-bold uppercase" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="year" value={formData.year} placeholder="Year" onChange={handleInputChange} className="text-white bg-black/80 border border-white/10 p-3 rounded-xl text-xs font-bold uppercase" />
                            <select name="type" value={formData.type} onChange={handleInputChange} className="bg-black/80 text-gray-300 font-semibold border border-white/10 p-3 rounded-xl text-xs font-bold uppercase">
                                {["Sedan", "SUV", "Bus", "Jeep", "Truck", "Cycles", "Others"].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <select name="trim" value={formData.trim} onChange={handleInputChange} className="bg-black/80 text-gray-300 font-semibold border border-white/10 p-3 rounded-xl text-xs font-bold uppercase">
                                {["LE", "XLE", "Sports", "SE", "Premium"].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <input name="price" value={formData.price} type="number" placeholder="Price" onChange={handleInputChange} className="bg-black/80 border border-white/10 p-3 rounded-xl text-xs font-bold uppercase text-[goldenrod]" />
                        </div>
                        <textarea name="description" value={formData.description} placeholder="Description..." onChange={handleInputChange} className="w-full bg-black/80 border border-white/10 p-4 rounded-xl text-sm text-gray-300 h-20" />
                        <button disabled={saving} className="text-white w-full bg-emerald-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all">
                            {saving ? 'Updating Fleet...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}