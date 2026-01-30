'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaCar, FaVideo, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';

// Define props to fix the TS error
interface AddVehicleProps {
    onSuccess?: () => void;
}

export default function AddVehicleForm({ onSuccess }: AddVehicleProps) {
    const [loading, setLoading] = useState(false);
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

    const addUrlField = () => {
        if (urlImages.length < 10) setUrlImages([...urlImages, '']);
    };

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
            const urls = files.map(file => URL.createObjectURL(file as File));
            setImagePreviews(urls);
        } else {
            const file = e.target.files?.[0];
            if (file) setVideoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalImageUrls: string[] = [];
            let finalVideoUrl = formData.videoSource;

            if (imageMode === 'file') {
                const imgFiles = (document.getElementById('imgFile') as HTMLInputElement)?.files;
                if (imgFiles) {
                    const uploadPromises = Array.from(imgFiles).slice(0, 10).map(async (file) => {
                        const r = ref(storage, `cars/${Date.now()}_${file.name}`);
                        await uploadBytes(r, file);
                        return getDownloadURL(r);
                    });
                    finalImageUrls = await Promise.all(uploadPromises);
                }
            } else {
                finalImageUrls = urlImages.filter(url => url.trim() !== '');
            }

            const vidFile = (document.getElementById('vidFile') as HTMLInputElement)?.files?.[0];
            if (videoMode === 'file' && vidFile && videoPreview) {
                const r = ref(storage, `videos/${Date.now()}_${vidFile.name}`);
                await uploadBytes(r, vidFile);
                finalVideoUrl = await getDownloadURL(r);
            }

            await addDoc(collection(db, 'vehicles'), {
                ...formData,
                price: Number(formData.price),
                images: finalImageUrls, 
                videoUrl: videoPreview ? finalVideoUrl : "",
                specs: [
                    formData.year, formData.engine, formData.condition,
                    formData.transmission, formData.papers, formData.exterior,
                    formData.interior, formData.trim
                ],
                createdAt: serverTimestamp(), // Puts the latest at the top
            });

            toast.success("Vehicle Added Successfully!");
            setImagePreviews([]); setVideoPreview(''); setUrlImages(['']);
            if (onSuccess) onSuccess(); 
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            toast.error("Error saving vehicle");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-white/5 p-2 md:p-10 rounded-xl shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6 cursor-pointer">
                    <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
                                <FaCar /> Images ({imagePreviews.length}/10)
                            </span>
                            <div className="flex bg-gray-900 rounded-lg p-1 text-[9px] font-bold">
                                <button type="button" onClick={() => setImageMode('file')} className={`text-white font-semibold px-3 py-1 rounded-md ${imageMode === 'file' ? 'bg-emerald-600' : ''}`}>FILE</button>
                                <button type="button" onClick={() => setImageMode('url')} className={`text-white font-semibold px-3 py-1 rounded-md ${imageMode === 'url' ? 'bg-emerald-600' : ''}`}>URL</button>
                            </div>
                        </div>

                        {imageMode === 'file' ? (
                            <input type="file" id="imgFile" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="text-xs text-gray-500 w-full" />
                        ) : (
                            <div className="space-y-2">
                                {urlImages.map((url, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input value={url} onChange={(e) => handleUrlChange(idx, e.target.value)} placeholder={`Image URL ${idx + 1}`} className="text-white flex-1 bg-transparent border-b border-white/10 py-2 text-sm outline-none focus:border-emerald-500 transition-all placeholder:text-gray-600" />
                                        {idx > 0 && <button type="button" onClick={() => removeUrlField(idx)} className="text-red-500"><FaTimes /></button>}
                                    </div>
                                ))}
                                {urlImages.length < 10 && (
                                    <button type="button" onClick={addUrlField} className="text-[10px] text-emerald-500 font-bold uppercase mt-2 flex items-center gap-1">
                                        <FaPlus /> Add Another URL
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-5 gap-2 mt-4">
                            {imagePreviews.map((src, i) => (
                                <div key={i} className="relative group aspect-video">
                                    <img src={src} className="h-full w-full object-cover rounded-md border border-white/10" alt="preview" />
                                    <button type="button" onClick={() => removeImagePreview(i)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FaTimes size={8} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black uppercase text-red-500 tracking-widest flex items-center gap-2"><FaVideo /> Video</span>
                            <div className="flex bg-gray-900 rounded-lg p-1 text-[9px] font-bold">
                                <button type="button" onClick={() => setVideoMode('file')} className={`text-white font-semibold px-3 py-1 rounded-md ${videoMode === 'file' ? 'bg-red-600' : ''}`}>FILE</button>
                                <button type="button" onClick={() => setVideoMode('url')} className={`text-white font-semibold px-3 py-1 rounded-md ${videoMode === 'url' ? 'bg-red-600' : ''}`}>URL</button>
                            </div>
                        </div>
                        {videoMode === 'file' ? <input type="file" id="vidFile" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="text-xs text-gray-500 w-full" /> : <input name="videoSource" value={formData.videoSource} onChange={handleInputChange} placeholder="Paste Video URL" className="text-white w-full bg-transparent border-b border-white/10 py-2 text-sm outline-none focus:border-red-500 transition-all placeholder:text-gray-600" />}
                        {videoPreview && (
                            <div className="relative mt-4 group">
                                <video src={videoPreview} controls className="h-40 w-full object-cover rounded-xl border border-white/10" />
                                <button type="button" onClick={removeVideo} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors">
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 text-gray-600">
                    <div className="grid grid-cols-2 gap-4">
                        <select name="name" onChange={handleInputChange} required className="bg-black/80 text-gray-300 font-semibold border border-white/10 p-3 rounded-xl text-xs font-bold uppercase outline-none focus:border-emerald-500 transition-all">
                            <option value="">Select Brand</option>
                            {["Toyota", "Honda", "Volkswagen", "Mercedes-Benz", "BMW", "Audi", "Mazda", "Peugeot", "Nissan", "Mitsubishi", "Volvo", "Others"].map(b => <option className='text-gray-300 font-semibold' key={b} value={b}>{b}</option>)}
                        </select>
                        <input name="model" placeholder="Model (e.g. Camry)" onChange={handleInputChange} className="text-white bg-black/80 border border-white/10 p-3 rounded-xl text-xs font-bold uppercase placeholder:text-gray-600 outline-none focus:border-emerald-500 transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input name="year" placeholder="Year (2022)" onChange={handleInputChange} className="text-white bg-black/80 border border-white/10 p-3 rounded-xl text-xs font-bold uppercase placeholder:text-gray-600 outline-none focus:border-emerald-500 transition-all" />
                        <select name="type" onChange={handleInputChange} className="bg-black/80 text-gray-300 font-semibold border border-white/10 p-3 rounded-xl text-xs font-bold uppercase outline-none focus:border-emerald-500 transition-all">
                            {["Sedan", "SUV", "Bus", "Jeep", "Truck", "Cycles", "Others"].map(t => <option className='text-gray-300 font-semibold' key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <select name="transmission" onChange={handleInputChange} className="bg-black/80 text-gray-300 font-semibold border border-white/10 p-2 rounded-xl uppercase outline-none focus:border-emerald-500 transition-all">
                            <option value="Auto">Auto</option>
                            <option value="Manual">Manual</option>
                        </select>
                        <select name="condition" onChange={handleInputChange} className="bg-black/80 text-gray-300 font-semibold border border-white/10 p-2 rounded-xl uppercase outline-none focus:border-emerald-500 transition-all">
                            <option value="Tokunbo">Tokunbo</option>
                            <option value="Brand New">Brand New</option>
                            <option value="Nig. Used">Nig. Used</option>
                        </select>
                        <select name="engine" onChange={handleInputChange} className="bg-black/80 text-gray-300 font-semibold border border-white/10 p-2 rounded-xl uppercase outline-none focus:border-emerald-500 transition-all">
                            {["4p", "V6", "V8", "Trailer Eng"].map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select name="trim" onChange={handleInputChange} className="bg-black/80 text-gray-300 font-semibold border border-white/10 p-3 rounded-xl text-xs font-bold uppercase outline-none focus:border-emerald-500 transition-all">
                            {["LE", "XLE", "Sports", "SE", "Premium"].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input name="price" type="number" placeholder="Price (₦)" onChange={handleInputChange} className="text-white bg-black/80 border border-white/10 p-3 rounded-xl text-xs font-bold uppercase text-[goldenrod] placeholder:text-gray-600 outline-none focus:border-emerald-500 transition-all" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <select name="papers" onChange={handleInputChange} className="bg-black/80 text-gray-300 font-semibold border border-white/10 p-2 rounded-xl text-xs uppercase outline-none focus:border-emerald-500 transition-all">
                            <option value="Yes">Papers: Yes</option>
                            <option value="No">Papers: No</option>
                        </select>
                        <input name="exterior" placeholder="Exterior Color" onChange={handleInputChange} className="text-white bg-black/80 border border-white/10 p-2 rounded-xl text-xs uppercase placeholder:text-gray-600 outline-none focus:border-emerald-500 transition-all" />
                        <input name="interior" placeholder="Interior Color" onChange={handleInputChange} className="text-white bg-black/80 border border-white/10 p-2 rounded-xl text-xs uppercase placeholder:text-gray-600 outline-none focus:border-emerald-500 transition-all" />
                    </div>
                    <textarea name="description" placeholder="Description..." onChange={handleInputChange} className="w-full bg-black/80 border border-white/10 p-4 rounded-xl text-sm text-gray-300 h-20 placeholder:text-gray-600 outline-none focus:border-emerald-500 transition-all" />
                    <button disabled={loading} className="text-white w-full bg-emerald-600 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50">
                        {loading ? 'Adding to Fleet...' : 'Save Vehicle'}
                    </button>
                </div>
            </div>
        </form>
    );
}