'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { FaSave, FaPlus, FaTrash, FaImage, FaLink, FaAd, FaUpload } from 'react-icons/fa';

export default function FashionAdsEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  
  // Track 'file' vs 'url' mode for each slide index
  const [imageModes, setImageModes] = useState<Record<number, 'file' | 'url'>>({});

  useEffect(() => {
    const fetchAds = async () => {
      const docRef = doc(db, 'site_settings', 'fashion_hero');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedSlides = docSnap.data().slides || [];
        setSlides(fetchedSlides);
        
        // Default all existing slides to URL mode
        const initialModes: Record<number, 'file' | 'url'> = {};
        fetchedSlides.forEach((_: any, i: number) => { initialModes[i] = 'url'; });
        setImageModes(initialModes);
      }
      setLoading(false);
    };
    fetchAds();
  }, []);

  const handleAddSlide = () => {
    if (slides.length >= 5) {
      toast.error("Maximum 5 slides allowed");
      return;
    }
    const newIndex = slides.length;
    setSlides([...slides, {
      title: "New Collection",
      subtitle: "Discover Now",
      description: "Short description here",
      image: "",
      buttonText: "Shop Now",
      buttonLink: "#"
    }]);
    setImageModes({ ...imageModes, [newIndex]: 'url' });
  };

  const handleRemoveSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
    // Re-index image modes
    const newModes: Record<number, 'file' | 'url'> = {};
    slides.filter((_, i) => i !== index).forEach((_, i) => {
      newModes[i] = imageModes[i] || 'url';
    });
    setImageModes(newModes);
  };

  const updateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSlide(index, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleImageMode = (index: number, mode: 'file' | 'url') => {
    setImageModes({ ...imageModes, [index]: mode });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_settings', 'fashion_hero'), { slides });
      toast.success("Fashion Ads updated successfully!");
    } catch (error) {
      toast.error("Failed to update ads");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-pink-500 animate-pulse font-bold">Loading Fashion Ads...</div>;

  return (
    <div className="bg-gray-900 border border-white/5 rounded-2xl p-4 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <FaAd className="text-pink-500" /> Fashion Hero Banner
          </h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            Manage up to 5 slides ({slides.length}/5)
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAddSlide}
            disabled={slides.length >= 5}
            className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold uppercase text-[10px] flex items-center gap-2 transition-all disabled:opacity-30"
          >
            <FaPlus /> Add Slide
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-xl font-bold uppercase text-[10px] flex items-center gap-2 transition-all"
          >
            <FaSave /> {saving ? 'Saving...' : 'Save All Ads'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={index} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden group">
            <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
              <span className="text-white font-black uppercase text-[10px] tracking-widest">Slide #{index + 1}</span>
              <button onClick={() => handleRemoveSlide(index)} className="text-gray-500 hover:text-red-500 transition-colors">
                <FaTrash size={14} />
              </button>
            </div>
            
            <div className="p-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                    <label className="text-gray-500 text-[9px] uppercase font-black block mb-1">Main Title</label>
                    <input 
                        value={slide.title}
                        onChange={(e) => updateSlide(index, 'title', e.target.value)}
                        className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-pink-500"
                    />
                </div>
                <div>
                  <label className="text-gray-500 text-[9px] uppercase font-black block mb-1">Subtitle (Pink Text)</label>
                  <input 
                    value={slide.subtitle}
                    onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-[9px] uppercase font-black block mb-1">Description</label>
                  <textarea 
                    value={slide.description}
                    onChange={(e) => updateSlide(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-pink-500 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Image Selection Section */}
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-gray-500 text-[9px] uppercase font-black">Slide Image</label>
                    <div className="flex bg-gray-900 rounded-lg p-1 text-[8px] font-bold">
                      <button 
                        type="button" 
                        onClick={() => toggleImageMode(index, 'file')} 
                        className={`px-2 py-1 rounded-md transition-all ${imageModes[index] === 'file' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}
                      >
                        <FaUpload className="inline mr-1" /> FILE
                      </button>
                      <button 
                        type="button" 
                        onClick={() => toggleImageMode(index, 'url')} 
                        className={`px-2 py-1 rounded-md transition-all ${imageModes[index] === 'url' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}
                      >
                        <FaLink className="inline mr-1" /> URL
                      </button>
                    </div>
                  </div>

                  {imageModes[index] === 'file' ? (
                    <div className="flex flex-col gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, index)} 
                        className="text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-pink-600 file:text-white hover:file:bg-pink-500" 
                      />
                      {slide.image && (
                         <div className="mt-2 text-[8px] text-gray-500 italic truncate">File selected</div>
                      )}
                    </div>
                  ) : (
                    <input 
                      value={slide.image}
                      onChange={(e) => updateSlide(index, 'image', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-pink-500"
                    />
                  )}
                  
                  {slide.image && (
                    <div className="mt-3 relative h-12 w-24 rounded-lg overflow-hidden border border-white/10">
                      <img src={slide.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-500 text-[9px] uppercase font-black block mb-1">Btn Text</label>
                    <input 
                      value={slide.buttonText}
                      onChange={(e) => updateSlide(index, 'buttonText', e.target.value)}
                      className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-[9px] uppercase font-black block mb-1">Btn Link</label>
                    <input 
                      value={slide.buttonLink}
                      onChange={(e) => updateSlide(index, 'buttonLink', e.target.value)}
                      className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {slides.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl">
            <FaAd className="text-gray-700 text-5xl mx-auto mb-4" />
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">No slides configured</p>
          </div>
        )}
      </div>
    </div>
  );
}