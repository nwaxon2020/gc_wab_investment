'use client'
import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebaseConfig'
import { isMasterAdmin } from '@/lib/admin'
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
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
    { name: 'Fashion', href: '/shop' },
    { name: 'About', href: '/about' },
  ]

  const adminPlaceholder = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-[#f0fdf4] shadow-md">
      {/* Adjusted max-width to reduce that "empty padding" look on wide screens */}
      <nav className=" mx-auto px-6 h-15 md:h-18 flex justify-between items-center relative z-[150] bg-white">
        
        {/* LOGO */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 bg-emerald-700"></div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tighter text-emerald-700 leading-none">GC WAB</h1>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Investments</span>
            </div>
          </Link>
        </div>

        {/* CENTER LINKS */}
        <div className="hidden md:flex items-center space-x-10 lg:space-x-14">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-xs uppercase font-bold tracking-widest transition-colors duration-300 ${pathname === link.href ? 'text-emerald-700' : 'text-gray-500 hover:text-[#14532d]'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* PROFILE & AUTH */}
        <div className="flex items-center justify-end">
          {/* DESKTOP PROFILE */}
          <div className="hidden md:flex items-center">
            {!user ? (
              <button onClick={handleGoogleLogin} className="bg-emerald-700 text-white px-7 py-3 rounded-2xl text-xs font-bold uppercase shadow-lg hover:bg-[#1b6639] transition-all">Sign In</button>
            ) : (
              <div className="flex items-center gap-6">
                {/* ADMIN LABELS NEXT TO AVATAR */}
                {isAdmin && (
                  <div className="flex items-center gap-4 border-r border-gray-100 pr-6">
                    <button onClick={() => router.push('/admin')} className="text-[10px] font-black text-emerald-600 uppercase hover:text-emerald-800 transition-colors">Car Admin</button>
                    <button onClick={() => router.push('/admin/fashion')} className="text-[10px] font-black text-amber-600 uppercase hover:text-amber-700 transition-colors">Fashion Admin</button>
                  </div>
                )}

                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 group">
                    <p className="text-[10px] font-bold text-gray-400 uppercase group-hover:text-emerald-700 transition-colors">
                      {user.displayName?.split(' ')[0]}
                    </p>
                    <img 
                      src={isAdmin ? adminPlaceholder : user.photoURL} 
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full border-2 border-emerald-700 object-cover group-hover:scale-105 transition-transform" 
                      alt="avatar"
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-[100]">
                        <div className="pb-4 border-b mb-3">
                          <p className="font-bold text-[#14532d] text-sm truncate">{user.displayName}</p>
                          <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left">
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE CONTROLS */}
          <div className="flex md:hidden items-center gap-3">
              {user && (
                <div className="flex items-center gap-2">
                   {isAdmin && (
                     <button onClick={() => router.push('/admin')} className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md uppercase">Admin</button>
                   )}
                   <img 
                    src={isAdmin ? adminPlaceholder : user.photoURL} 
                    referrerPolicy="no-referrer" 
                    className="w-8 h-8 rounded-full border border-[#16a34a] object-cover" 
                    alt="user" 
                  />
                </div>
              )}
              <button 
                className="p-2.5 rounded-xl bg-gray-50 text-[#14532d]" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg w-5`}></i>
              </button>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV DROPDOWN (FLUSH UNDER HEADER) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden" />
            
            <motion.div 
              initial={{ y: '-100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '-100%' }} 
              transition={{ type: 'tween', duration: 0.3 }} 
              className="fixed top-15 left-0 right-0 bg-[#14532d] z-[120] pb-8 px-6 shadow-2xl md:hidden"
            >
              <div className="flex flex-col pt-4">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-white/5 flex justify-between items-center ${pathname === link.href ? 'text-emerald-400' : 'text-white/90'}`}>
                    {link.name}
                    {pathname === link.href && <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />}
                  </Link>
                ))}

                {isAdmin && (
                  <div className="flex flex-col py-2">
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="py-4 text-sm font-black text-emerald-400 uppercase tracking-widest flex items-center gap-3">
                      <i className="fas fa-car"></i> Car Admin
                    </Link>
                    <Link href="/admin/fashion" onClick={() => setIsMobileMenuOpen(false)} className="py-4 text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-3">
                      <i className="fas fa-tshirt"></i> Fashion Admin
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-6 border-t border-white/10 flex items-center justify-between">
                {user ? (
                  <>
                    <div>
                      <p className="mb-2 font-bold text-yellow-400 text-sm">Welcome {user.displayName?.split(' ')[0]}</p>
                      <button onClick={handleLogout} className="bg-red-700 py-1 px-3 text-sm text-white rounded-lg font-bold uppercase mt-1">Log Out</button>
                    </div>
                    <img src={isAdmin ? adminPlaceholder : user.photoURL} className="w-10 h-10 rounded-full border border-white/20" alt="" />
                  </>
                ) : (
                  <button onClick={handleGoogleLogin} className="w-full py-4 bg-white text-emerald-800 rounded-xl font-black uppercase text-[10px]">Sign In</button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}