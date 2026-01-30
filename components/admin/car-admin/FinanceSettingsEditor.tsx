'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FaPercentage, FaPhoneAlt, FaSave, FaCalculator } from 'react-icons/fa';
import { toast } from 'sonner';

export default function FinanceSettingsEditor() {
    const [updating, setUpdating] = useState(false);
    const [settings, setSettings] = useState({
        phoneNumber: '+2347034632037',
        rate6m: 1.10,
        rate12m: 1.15,
        rate24m: 1.25,
        rate36m: 1.35
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const docRef = doc(db, 'site_settings', 'engagement_config');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data() as any);
            }
        };
        fetchSettings();
    }, []);

    // --- LOGIC: AUTO-FORMAT PHONE NUMBER ---
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        
        // Remove everything except numbers
        val = val.replace(/\D/g, '');

        // If user pasted/typed 234 at the start, remove it
        if (val.startsWith('234')) {
            val = val.substring(3);
        }

        // If user typed 0 at the start (e.g. 070...), remove it
        if (val.startsWith('0')) {
            val = val.substring(1);
        }

        setSettings({ ...settings, phoneNumber: `+234${val}` });
    };

    const handleSave = async () => {
        // Simple validation to ensure the number isn't just "+234"
        if (settings.phoneNumber.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }

        setUpdating(true);
        try {
            await setDoc(doc(db, 'site_settings', 'engagement_config'), {
                ...settings,
                updatedAt: serverTimestamp()
            }, { merge: true });
            toast.success("Finance & Contact settings updated!");
        } catch (error) {
            toast.error("Failed to update settings");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="bg-gray-900/80 border border-white/5 p-2 md:p-6 rounded-xl shadow-xl space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <FaCalculator size={18} />
                </div>
                <div>
                    <h2 className="text-white font-black text-sm uppercase tracking-tight">Finance & Contact</h2>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Manage rates and support line</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
                {/* Phone Number */}
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2">
                        <FaPhoneAlt className="text-emerald-500" /> Support Phone Number
                    </label>
                    <div className="relative flex items-center">
                        {/* Static Prefix Visual */}
                        <span className="absolute left-4 text-emerald-500 font-bold text-xs select-none">
                            +234
                        </span>
                        <input 
                            type="text"
                            // Show only the part after +234 in the input for cleaner UX
                            value={settings.phoneNumber.replace('+234', '')}
                            onChange={handlePhoneChange}
                            className="w-full bg-black/50 border border-white/10 p-3 pl-14 rounded-xl text-xs text-white outline-none focus:border-emerald-500 transition-all"
                            placeholder="7034632037"
                        />
                    </div>
                    <p className="text-[9px] text-gray-600 italic px-1">Number will be saved as: {settings.phoneNumber}</p>
                </div>

                {/* Rates Grid */}
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2">
                        <FaPercentage className="text-emerald-500" /> Interest Multipliers (Term Rates)
                    </label>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "6 Months", key: "rate6m" },
                            { label: "12 Months", key: "rate12m" },
                            { label: "24 Months", key: "rate24m" },
                            { label: "36 Months", key: "rate36m" }
                        ].map((rate) => (
                            <div key={rate.key} className="space-y-1">
                                <span className="text-[9px] text-gray-400 font-bold uppercase">{rate.label}</span>
                                <input 
                                    type="number"
                                    step="0.01"
                                    value={settings[rate.key as keyof typeof settings]}
                                    onChange={(e) => setSettings({...settings, [rate.key]: parseFloat(e.target.value)})}
                                    className="w-full bg-gray-900 border border-white/10 p-2 rounded-lg text-xs text-emerald-400 outline-none focus:border-emerald-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSave}
                disabled={updating}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                <FaSave /> {updating ? 'Saving...' : 'Update Finance Logic'}
            </button>
        </div>
    );
}