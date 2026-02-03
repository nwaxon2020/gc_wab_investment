'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebaseConfig'
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'
import { FaCar, FaSave, FaCheckCircle, FaListUl } from 'react-icons/fa'
import { toast } from 'sonner'

export default function CarHomeEditor() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [cars, setCars] = useState<any[]>([])
    const [config, setConfig] = useState({
        heroTitle: 'Premium Automotive Division',
        heroDescription: 'Discover our curated collection of luxury vehicles, where performance meets elegance.',
        feature1: 'Premium Performance',
        feature2: 'Luxury Interiors',
        feature3: 'Exclusive Models',
        featuredIds: [] as string[]
    })

    useEffect(() => {
        const fetchData = async () => {
            const carSnap = await getDocs(collection(db, 'vehicles'))
            setCars(carSnap.docs.map(d => ({ id: d.id, ...d.data() })))

            const configSnap = await getDoc(doc(db, 'site_settings', 'home_car_config'))
            if (configSnap.exists()) {
                setConfig(prev => ({ ...prev, ...configSnap.data() }))
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const toggleFeatured = (id: string) => {
        setConfig(prev => {
            const isFeatured = prev.featuredIds.includes(id)
            if (isFeatured) return { ...prev, featuredIds: prev.featuredIds.filter(i => i !== id) }
            if (prev.featuredIds.length >= 3) {
                toast.error("Max 3 items allowed")
                return prev
            }
            return { ...prev, featuredIds: [...prev.featuredIds, id] }
        })
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await setDoc(doc(db, 'site_settings', 'home_car_config'), config)
            toast.success("Car Home Settings Updated!")
        } catch (e) {
            toast.error("Save failed")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-10 text-emerald-500 animate-pulse">Loading Car Editor...</div>

    return (
        <div className="mx-auto space-y-6 max-w-4xl bg-gray-900/50 p-6 rounded-xl border border-white/5">
            <h2 className="text-white font-bold flex items-center gap-2"><FaCar className="text-emerald-500"/> Car Home Editor</h2>
            
            <div className="grid gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Main Title</label>
                    <input className="w-full bg-black/40 p-3 rounded-xl border border-white/10 text-white outline-none focus:border-emerald-500" value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-bold uppercase">Description (Left Aligned)</label>
                    <textarea className="w-full bg-black/40 p-3 rounded-xl border border-white/10 text-white h-24 outline-none focus:border-emerald-500" value={config.heroDescription} onChange={(e) => setConfig({...config, heroDescription: e.target.value})} />
                </div>
            </div>

            <div className="bg-black/20 p-4 rounded-xl space-y-3">
                <p className="text-emerald-500 text-[10px] font-black uppercase flex items-center gap-2"><FaListUl /> Premium Features (Bullet Points)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input className="bg-gray-900 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-emerald-500" value={config.feature1} onChange={(e) => setConfig({...config, feature1: e.target.value})} placeholder="Feature 1" />
                    <input className="bg-gray-900 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-emerald-500" value={config.feature2} onChange={(e) => setConfig({...config, feature2: e.target.value})} placeholder="Feature 2" />
                    <input className="bg-gray-900 border border-white/10 p-2 rounded-lg text-xs text-white outline-none focus:border-emerald-500" value={config.feature3} onChange={(e) => setConfig({...config, feature3: e.target.value})} placeholder="Feature 3" />
                </div>
            </div>

            <div className="space-y-3">
                <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Select Featured Cars (Max 3)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {cars.map(car => (
                        <div key={car.id} onClick={() => toggleFeatured(car.id)} className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${config.featuredIds.includes(car.id) ? 'border-emerald-500 scale-[1.02]' : 'border-transparent opacity-60'}`}>
                            <img src={car.images?.[0]} className="w-full h-24 object-cover" />
                            <div className="p-2 bg-black/60 text-[10px] text-white truncate">{car.name}</div>
                            {config.featuredIds.includes(car.id) && <FaCheckCircle className="absolute top-2 right-2 text-emerald-500 bg-white rounded-full"/>}
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2">
                <FaSave/> {saving ? 'Saving...' : 'Update Car Home Page'}
            </button>
        </div>
    )
}