'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FaPercentage, FaSave, FaCalculator } from 'react-icons/fa';
import { toast } from 'sonner';

export default function FinanceSettingsEditor() {
    const [updating, setUpdating] = useState(false);
    const [settings, setSettings] = useState({
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
                const data = docSnap.data();
                // Filter to only keep rate keys to prevent state pollution
                setSettings({
                    rate6m: data.rate6m || 1.10,
                    rate12m: data.rate12m || 1.15,
                    rate24m: data.rate24m || 1.25,
                    rate36m: data.rate36m || 1.35
                });
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setUpdating(true);
        try {
            await setDoc(doc(db, 'site_settings', 'engagement_config'), {
                ...settings,
                updatedAt: serverTimestamp()
            }, { merge: true });
            toast.success("Interest rate multipliers updated!");
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
                    <h2 className="text-white font-black text-sm uppercase tracking-tight">Finance Logic</h2>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Manage installment multipliers</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
                {/* Rates Grid */}
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2">
                        <FaPercentage className="text-emerald-500" /> Interest Multipliers
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
                                    className="w-full bg-gray-900 border border-white/10 p-2 rounded-lg text-xs text-emerald-400 outline-none focus:border-emerald-500/50 transition-all"
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