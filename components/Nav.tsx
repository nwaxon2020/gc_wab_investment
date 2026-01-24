'use client'
import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebaseConfig'
import { isMasterAdmin } from '@/lib/admin'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function Nav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsAdmin(!!(currentUser && isMasterAdmin(currentUser.uid)))
    })
    return () => unsub()
  }, [])

  const handleGoogleLogin = () => signInWithPopup(auth, new GoogleAuthProvider())
  const handleLogout = () => {
    signOut(auth)
    setIsProfileOpen(false)
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Cars', href: '/cars' },
    { name: 'Fashion', href: '/fashion' },
    { name: 'About', href: '/about' },
  ]

  const adminPlaceholder = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-[#f0fdf4] shadow-md">
      <nav className="container mx-auto px-3 h-22 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 bg-[#16a34a]"></div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tighter text-[#14532d]">GC WAB</h1>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest leading-none">Investments</span>
          </div>
        </Link>

        {/* DESKTOP NAV & PROFILE */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={`text-xs uppercase font-bold tracking-widest ${pathname === link.href ? 'text-[#16a34a]' : 'text-gray-500 hover:text-[#14532d]'}`}>
              {link.name}
            </Link>
          ))}
          
          {!user ? (
            <button onClick={handleGoogleLogin} className="bg-[#14532d] text-white px-7 py-3 rounded-2xl text-xs font-bold uppercase shadow-lg">Sign In</button>
          ) : (
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-4 pl-6 border-l-2 border-gray-100 group">
                <div className="text-right hidden xl:block leading-tight">
                  <p className="text-[10px] font-bold text-[#14532d] uppercase">{isAdmin ? 'Admin' : user.displayName?.split(' ')[0]}</p>
                </div>
                <img 
                  src={isAdmin ? adminPlaceholder : user.photoURL} 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border-2 border-[#16a34a] object-cover" 
                  alt="avatar"
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-[100]">
                    <div className="pb-4 border-b mb-3">
                      <p className="font-bold text-[#14532d] text-sm truncate">{isAdmin ? 'Admin Panel' : user.displayName}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 w-full p-3 text-sm font-bold text-[#16a34a] hover:bg-green-50 rounded-xl mb-1 transition-colors">
                        Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex md:hidden items-center gap-2">
            {user && (
                <div className="flex items-center gap-2 mr-1">
                  <span className="text-[10px] font-black text-[#14532d] uppercase">
                    {isAdmin ? 'Admin' : user.displayName?.split(' ')[0]}
                  </span>
                  <img 
                    src={isAdmin ? adminPlaceholder : user.photoURL} 
                    referrerPolicy="no-referrer" 
                    className="w-7 h-7 rounded-full border border-[#16a34a] object-cover" 
                    alt="user" 
                  />
                </div>
            )}
            <button className="p-2.5 rounded-xl bg-gray-50 text-[#14532d]" onClick={() => setIsMobileMenuOpen(true)}>
                <i className="fas fa-bars text-lg"></i>
            </button>
        </div>
      </nav>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="z-50 md:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.4 }} className="fixed top-0 right-0 h-screen w-[85%] bg-[#14532d] z-[120] flex flex-col shadow-2xl">
              <div className="p-8 flex justify-between items-center border-b border-white/10 text-white">
                <span className="font-black uppercase text-sm">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white"><i className="fas fa-times text-2xl"></i></button>
              </div>
              <div className="p-8 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`py-4 text-xl font-bold border-b border-white/5 ${pathname === link.href ? 'text-[#16a34a]' : 'text-white/80'}`}>
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="text-center mt-auto p-8 border-t border-white/10 bg-black/20 text-white">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm truncate">{user.displayName}</p>
                      <p className="text-[10px] text-white/50 truncate font-medium">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-white text-[#14532d] font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button onClick={handleGoogleLogin} className="w-full py-4 bg-[#16a34a] text-white rounded-2xl font-black uppercase text-[10px]">
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}