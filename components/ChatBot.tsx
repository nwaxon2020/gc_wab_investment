'use client'

import { useState, useEffect, useRef } from 'react'
import { auth, db } from '@/lib/firebaseConfig'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  increment,
  deleteDoc,
  getDocs
} from 'firebase/firestore'
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth'
import { isMasterAdmin } from '@/lib/admin'
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  LockClosedIcon,
  XMarkIcon,
  ChevronLeftIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [chats, setChats] = useState<any[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      const adminStatus = isMasterAdmin(u?.uid)
      setIsAdmin(adminStatus)
      setMobileView('list')
      if (u && !adminStatus) {
        setActiveChatId(u.uid)
      }
    })
  }, [])

  useEffect(() => {
    if (!isAdmin || !isOpen || !user) return
    const q = query(collection(db, 'chats'), orderBy('updatedAt', 'desc'))
    return onSnapshot(q, (snap) => {
      setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [isAdmin, isOpen, user])

  useEffect(() => {
    const chatId = isAdmin ? activeChatId : user?.uid
    if (!chatId || !isOpen || !user) return

    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'))
    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    })
  }, [activeChatId, user, isAdmin, isOpen])

  const deleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    if (!window.confirm("Delete this conversation permanently?")) return
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages')
      const messagesSnap = await getDocs(messagesRef)
      const deletePromises = messagesSnap.docs.map(m => deleteDoc(m.ref))
      await Promise.all(deletePromises)
      await deleteDoc(doc(db, 'chats', chatId))
      if (activeChatId === chatId) {
        setActiveChatId(null)
        setMessages([])
      }
    } catch (error) {
      console.error("Error deleting chat:", error)
    }
  }

  const send = async (e: any) => {
    e.preventDefault()
    if (!text.trim() || !user) return
    const chatId = isAdmin ? activeChatId : user.uid
    if (!chatId) return

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId: user.uid,
      senderName: user.displayName,
      senderEmail: user.email, 
      isAdmin,
      createdAt: serverTimestamp()
    })

    await setDoc(doc(db, 'chats', chatId), {
        userName: isAdmin ? (chats.find(c => c.id === chatId)?.userName || "User") : user.displayName,
        userEmail: isAdmin ? (chats.find(c => c.id === chatId)?.userEmail || "User") : user.email,
        lastMessage: text,
        updatedAt: serverTimestamp(),
        unreadCount: isAdmin ? 0 : increment(1)
      }, { merge: true }
    )
    setText('')
  }

  const closeChat = () => {
    setIsOpen(false)
    setMobileView('list')
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform active:scale-95">
        <ChatBubbleLeftRightIcon className="w-7 h-7" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-2 md:right-6 top-7 md:top-auto md:bottom-20 z-[200] w-[95vw] md:w-[720px] h-[85vh] md:h-[500px] bg-[#0f3d2e] rounded-3xl shadow-2xl overflow-hidden flex flex-row">
      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0f3d2e] p-8 text-center relative text-white">
          <button onClick={closeChat} className="absolute top-6 right-6 text-emerald-400"><XMarkIcon className="w-6 h-6" /></button>
          <div className="w-20 h-20 bg-emerald-800/50 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
            <LockClosedIcon className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Login Required</h2>
          <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="flex items-center gap-3 bg-white text-[#0f3d2e] px-8 py-3 rounded-xl font-bold">
            <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" /> Sign in with Google
          </button>
        </div>
      ) : (
        <>
          <div className={`w-full md:w-64 bg-[#0b2f23] border-r-2 border-gray-200 flex-col shrink-0 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 bg-emerald-800 text-white font-bold flex justify-between items-center shrink-0">
              <span className="text-xs uppercase tracking-widest">{isAdmin ? "Client Inquiries" : "Support"}</span>
              <button onClick={closeChat} className="md:hidden"><XMarkIcon className="w-6 h-6 text-white" /></button>
            </div>

            <div className="mt-8 bg-green-50 flex-1 overflow-y-auto relative">
              {!isAdmin ? (
                <div 
                  onClick={() => { setActiveChatId(user.uid); setMobileView('chat'); }}
                  className="p-4 cursor-pointer border-b border-emerald-900/10 bg-emerald-100 flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-[#0f3d2e] rounded-full flex items-center justify-center text-white font-bold text-xs">GC</div>
                  <div>
                    <p className="font-bold text-xs text-[#0f3d2e]">Concierge Service</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter italic">Online</p>
                  </div>
                </div>
              ) : (
                <>
                  {chats.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none p-4 text-center">
                      <ChatBubbleLeftRightIcon className="w-12 h-12 text-[#0f3d2e] mb-2" />
                      <p className="text-[10px] font-black text-[#0f3d2e] uppercase tracking-widest">No Active Inquiries</p>
                    </div>
                  )}
                  {chats.map(c => (
                    <div
                      key={c.id}
                      onClick={() => { setActiveChatId(c.id); setMobileView('chat'); }}
                      className={`p-4 cursor-pointer border-b border-emerald-900/10 hover:bg-emerald-100 relative group flex justify-between items-center ${activeChatId === c.id ? 'bg-emerald-200 border-l-4 border-emerald-600' : ''}`}
                    >
                      <div className="truncate pr-2">
                        <p className="font-bold text-sm text-[#0f3d2e] truncate">{c.userName || c.userEmail}</p>
                        <p className="text-[10px] text-emerald-700 truncate">{c.lastMessage}</p>
                      </div>
                      <button onClick={(e) => deleteChat(e, c.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-all">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
            
          {/* Chat Message Ui */}
          <div className={`flex-1 flex flex-col min-w-0 ${isAdmin && mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-white">
                <button className="md:hidden" onClick={() => setMobileView('list')}><ChevronLeftIcon className="w-6 h-6 text-white" /></button>
                <span className="font-bold text-sm">
                  {isAdmin ? (chats.find(c => c.id === activeChatId)?.userName || 'Select Client') : 'Concierge Chat'}
                </span>
              </div>
              <button onClick={closeChat}><XMarkIcon className="w-6 h-6 text-white" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-green-50 space-y-4 relative">
              {messages.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
                   <ChatBubbleLeftRightIcon className="w-20 h-20 text-[#0f3d2e] mb-2" />
                   <p className="text-sm font-bold text-[#0f3d2e] uppercase tracking-widest">No Messages Yet</p>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.isAdmin ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${m.isAdmin ? 'bg-emerald-600 text-white rounded-tr-none shadow-md' : 'bg-white text-[#0f3d2e] border border-emerald-100 rounded-tl-none shadow-sm'}`}>
                    {m.text}
                  </div>
                  {/* Metadata Logic */}
                  {m.isAdmin && isAdmin && (
                    <span className="text-[7px] text-emerald-800/60 font-black mt-1 mr-1 uppercase tracking-widest">
                      {m.senderId === user.uid ? 'You' : m.senderEmail}
                    </span>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={send} className="p-4 bg-[#0f3d2e] border-t border-emerald-900/30 flex gap-2 shrink-0">
              <input value={text} onChange={e => setText(e.target.value)} className="flex-1 rounded-xl bg-white border border-emerald-900/40 px-4 py-3 text-sm text-[#0f3d2e] outline-none" placeholder="Type your message..." />
              <button className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-500 transition-colors"><PaperAirplaneIcon className="w-5 h-5" /></button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}