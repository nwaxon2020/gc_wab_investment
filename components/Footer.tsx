'use client'
import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebaseConfig'
import { isMasterAdmin } from '@/lib/admin'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import Link from 'next/link'

export default function Footer() {
    const [user, setUser] = useState<any>(null)
    const [showAdminOverlay, setShowAdminOverlay] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    // 1. SYNC LOGIC: Listen for auth changes from anywhere in the app
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsub()
    }, [])

    // 2. GOOGLE LOGIN: Direct trigger for the Footer button
    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider()
            provider.setCustomParameters({ prompt: 'select_account' })
            await signInWithPopup(auth, provider)
            toast.success("Signed in successfully")
        } catch (error: any) {
            console.error(error)
            toast.error("Sign in failed")
        }
    }

    // 3. ADMIN EMAIL/PASS LOGIN
    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const uid = userCredential.user.uid

            if (isMasterAdmin(uid)) {
                const adminRef = doc(db, "admins", uid)
                const snap = await getDoc(adminRef)
                
                if (!snap.exists()) {
                    await setDoc(adminRef, { 
                        email: userCredential.user.email,
                        isAdmin: true,
                        role: 'Master Admin',
                        createdAt: new Date().toISOString()
                    })
                }

                toast.success("Welcome back, Boss.")
                setShowAdminOverlay(false)

                // --- REDIRECTION LOGIC ---Admin 1 (Cars) & Admin 2 (Fashion)
                if (uid === process.env.NEXT_PUBLIC_ADMIN_ID_1) {
                    window.location.href = '/car'
                } else if (uid === process.env.NEXT_PUBLIC_ADMIN_ID_2) {
                    window.location.href = '/shop'
                } else {
                    // Default fallback if it's a master admin not specified above
                    window.location.href = '/'
                }
                // -------------------------

            } else {
                toast.error("Access Denied.")
                await signOut(auth)
            }
        } catch (error: any) {
            toast.error("Invalid credentials.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <footer className="relative z-10 py-16 bg-[#0a0a0a] border-t border-white/5 text-gray-400">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand & Socials */}
                    <div className="md:col-span-1">
                        <h3 className="text-3xl font-black text-[#16a34a] mb-4 tracking-tighter">GC WAB</h3>
                        <p className="text-sm font-medium leading-relaxed mb-6">
                            Redefining the standard of luxury investments in automotive and fashion.
                        </p>
                        <div className="flex space-x-4">
                            {['instagram', 'tiktok', 'twitter'].map((icon) => (
                                <a key={icon} href="#" className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#16a34a] hover:text-white transition-all duration-300 shadow-inner group">
                                    <i className={`fab fa-${icon} text-lg group-hover:scale-110`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-[10px] font-black text-[#16a34a] uppercase tracking-[0.3em] mb-2">Explore</h4>
                        <Link href="/" className="text-sm font-bold hover:text-white transition-colors">Home</Link>
                        <Link href="/cars" className="text-sm font-bold hover:text-white transition-colors">Luxury Cars</Link>
                        <Link href="/shop" className="text-sm font-bold hover:text-white transition-colors">Fashion Store</Link>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h4 className="text-[10px] font-black text-[#16a34a] uppercase tracking-[0.3em] mb-2">Company</h4>
                        <Link href="/about" className="text-sm font-bold hover:text-white transition-colors">About Us</Link>
                        <a href="mailto:princenwachuwu308@yahoo.com" className="text-sm font-bold hover:text-white transition-colors">Contact Support</a>
                    </div>

                    {/* Auth & Staff Portal */}
                    <div className="text-left md:text-right flex flex-col gap-12 md:gap-3 justify-between md:items-end">
                        <div className="space-y-4">
                            {!user ? (
                                <button 
                                    onClick={handleGoogleLogin} 
                                    className="text-xs font-black text-[#16a34a] uppercase tracking-widest border border-[#16a34a]/30 px-6 py-3 rounded-xl hover:bg-[#16a34a] hover:text-white transition-all shadow-lg active:scale-95"
                                >
                                    Sign In
                                </button>
                            ) : (
                                <button 
                                    onClick={() => signOut(auth)} 
                                    className="text-xs font-black text-red-500 uppercase tracking-widest border border-red-500/30 px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                                >
                                    Sign Out
                                </button>
                            )}
                        </div>
                        
                        <button 
                            onClick={() => setShowAdminOverlay(true)}
                            className="text-left text-[10px] font-bold text-gray-600 hover:text-[#16a34a] transition-colors uppercase tracking-[0.2em]"
                        >
                            Staff Access Only
                        </button>
                    </div>
                </div>

                {/* Base Footer */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black text-[#16a34a] uppercase tracking-widest">
                        princenwachuwu308@yahoo.com
                    </p>
                    <div className='flex gap-5 md:gap-10 font-semibold text-xs md:text-sm uppercase tracking-wider'>
                        <a href="/terms" className="hover:text-white transition-colors">Terms </a>
                        <p>&</p>
                        <a href="/policy" className="hover:text-white transition-colors">Policy</a>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase">
                        <p>© {new Date().getFullYear()} GC WAB</p>
                        <div className="h-1 w-1 rounded-full bg-gray-700"></div>
                        <p className="tracking-tighter">Premium Quality</p>
                    </div>
                </div>
            </div>

            {/* ADMIN OVERLAY */}
            {showAdminOverlay && (
                <div className="mt-18 fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-3">
                    <div className="bg-[#0f0f0f] w-full max-w-md rounded-[3rem] p-6 md:p-10 border border-white/10 shadow-[0_0_50px_rgba(22,163,74,0.1)] relative">
                        <button 
                            onClick={() => setShowAdminOverlay(false)} 
                            className="absolute top-8 right-8 text-gray-500 hover:text-white"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-[#16a34a]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#16a34a]/20">
                                <i className="fas fa-user-shield text-[#16a34a] text-3xl"></i>
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Admin Portal</h2>
                        </div>
                        <form onSubmit={handleAdminLogin} className="space-y-6">
                            <input 
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 outline-none focus:border-[#16a34a] text-white transition-all font-medium"
                                placeholder="Email Address" required
                            />
                            <input 
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3 outline-none focus:border-[#16a34a] text-white transition-all font-medium"
                                placeholder="Password" required
                            />
                            <button 
                                type="submit" disabled={loading}
                                className="w-full bg-[#16a34a] text-white font-black py-3 rounded-2xl shadow-[0_10px_30px_rgba(22,163,74,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
                            >
                                {loading ? 'Authorizing...' : 'Enter System'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </footer>
    )
}