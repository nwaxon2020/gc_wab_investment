'use client';

import React, { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';
import { FaUserTie, FaPhoneAlt, FaEnvelope, FaImage, FaSave, FaUpload, FaLink } from 'react-icons/fa';

export default function FashionContactEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    ceoName: "",
    ceoImage: "",
    phoneNumber: "",
    email: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // SAVING TO A UNIQUE DOCUMENT: 'fashion_contact'
        const docSnap = await getDoc(doc(db, 'site_settings', 'fashion_contact'));

        if (docSnap.exists()) {
          setFormData({
            ceoName: docSnap.data().ceoName || "",
            ceoImage: docSnap.data().ceoImage || "",
            phoneNumber: docSnap.data().phoneNumber || "",
            email: docSnap.data().email || ""
          });
        }
      } catch (error) {
        toast.error("Failed to load contact settings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    let finalImageUrl = formData.ceoImage;

    try {
      // Handle File Upload if in upload mode and a file exists
      if (imageMode === 'upload' && uploadFile) {
        const storageRef = ref(storage, `admin/fashion_lead/${Date.now()}_${uploadFile.name}`);
        const snapshot = await uploadBytes(storageRef, uploadFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      // SAVE DATA TO UNIQUE FASHION CONTACT DOCUMENT
      await setDoc(doc(db, 'site_settings', 'fashion_contact'), {
        ceoName: formData.ceoName,
        ceoImage: finalImageUrl,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setFormData(prev => ({ ...prev, ceoImage: finalImageUrl }));
      setUploadFile(null);
      toast.success("Fashion Contact updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-emerald-500 animate-pulse font-bold p-8">Loading Editor...</div>;

  return (
    <div className="bg-gray-900 border border-white/10 rounded-xl px-3 py-4 md:p-10 max-w-xl mx-auto space-y-8">
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <FaUserTie className="text-emerald-500" /> Fashion Studio Lead
        </h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Manage your specific fashion contact details</p>
      </div>

      <div className="grid gap-6">
        {/* Lead Name */}
        <div>
          <label className="text-gray-500 text-[9px] uppercase font-black block mb-2 ml-1">Studio Lead Name</label>
          <div className="relative">
            <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input 
              value={formData.ceoName}
              onChange={(e) => setFormData({...formData, ceoName: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-white text-sm outline-none focus:border-emerald-500 transition-all"
              placeholder="Full Name"
            />
          </div>
        </div>

        {/* Lead Image Logic */}
        <div>
          <div className="flex justify-between items-center mb-2 ml-1">
            <label className="text-gray-500 text-[9px] uppercase font-black">Lead Photo</label>
            <div className="flex gap-2">
              <button onClick={() => setImageMode('url')} className={`text-[8px] uppercase font-bold px-2 py-1 rounded ${imageMode === 'url' ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                <FaLink className="inline mr-1" /> URL
              </button>
              <button onClick={() => setImageMode('upload')} className={`text-[8px] uppercase font-bold px-2 py-1 rounded ${imageMode === 'upload' ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'}`}>
                <FaUpload className="inline mr-1" /> Upload
              </button>
            </div>
          </div>

          <div className="relative">
            {imageMode === 'url' ? (
              <>
                <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input value={formData.ceoImage} onChange={(e) => setFormData({...formData, ceoImage: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="https://..." />
              </>
            ) : (
              <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-2 pl-4 transition-all">
                <FaUpload className="text-gray-600" />
                <input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)} className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-emerald-500 file:text-black hover:file:bg-emerald-400 cursor-pointer w-full" />
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label className="text-gray-500 text-[9px] uppercase font-black block mb-2 ml-1">WhatsApp/Phone</label>
            <div className="relative">
              <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="+234..." />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-500 text-[9px] uppercase font-black block mb-2 ml-1">Business Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-white text-sm outline-none focus:border-emerald-500 transition-all" placeholder="fashion@mail.com" />
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50">
        <FaSave /> {saving ? "Saving Changes..." : "Update Fashion Contact"}
      </button>
    </div>
  );
}