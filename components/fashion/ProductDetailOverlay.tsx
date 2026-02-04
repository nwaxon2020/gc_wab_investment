'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FaTimes, FaHeart, FaShoppingCart, FaTruck, FaShieldAlt, 
  FaChevronLeft, FaChevronRight, FaPaperPlane, FaUserCircle, 
  FaTrash, FaMagic 
} from 'react-icons/fa';
import { db, auth } from '@/lib/firebaseConfig';
import { doc, updateDoc, increment, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

// --- INTERFACES ---
interface Review {
  id: string;
  authorId: string;
  name: string;
  comment: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  likes: number;
  stock: number;
  tags?: string[] | string;
  colors: { name: string; code: string; imageUrl: string }[];
  sizes: { size: string; inStock: boolean }[];
  reviews?: Review[];
}

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
  onSelectProduct?: (product: Product) => void;
}

export default function ProductDetailOverlay({ product, onClose, onAddToCart, onSelectProduct }: Props) {
  
  /* 🔥 1. INTERNAL STATE MANAGEMENT */
  const [activeProduct, setActiveProduct] = useState<Product>(product);
  const hasUserNavigatedRef = useRef(false); // 🔥 Ref flag to lock control
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const allGalleryImages = activeProduct?.colors?.map(c => c.imageUrl) || [];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(activeProduct?.likes || 0);
  const [showReviews, setShowReviews] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  /* 🔥 SWIPE LOGIC REFS */
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const getFirstName = (fullName: string) => fullName ? fullName.split(' ')[0] : 'User';

  /* 2. AUTH & DATA SYNC */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsub();
  }, []);

  const handleSignIn = () => signInWithPopup(auth, new GoogleAuthProvider());

  // ✅ FIXED EFFECT: Prevents jump-back and flashing
  useEffect(() => {
    // If user has navigated inside the overlay, ignore parent prop updates
    if (hasUserNavigatedRef.current) return;

    if (product.id !== activeProduct.id) {
        setActiveProduct(product);
        setSelectedImage(0);
        setSelectedColorIndex(0);
        setLikeCount(product.likes || 0);
    } else {
        setLikeCount(product.likes);
    }
  }, [product, activeProduct.id]);

  const syncData = useCallback(() => {
    if (!activeProduct?.id) return;
    
    const likedProducts = JSON.parse(localStorage.getItem('gc_fashion_likes') || '{}');
    setIsLiked(!!likedProducts[activeProduct.id]);
    setLikeCount(activeProduct.likes || 0);

    const storedReviews = JSON.parse(localStorage.getItem('gc_product_reviews') || '{}');
    const localSaved = storedReviews[activeProduct.id] || [];
    setAllReviews([...localSaved, ...(activeProduct.reviews || [])]);
  }, [activeProduct]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    syncData();
    return () => { document.body.style.overflow = 'unset'; };
  }, [syncData]);

  /* 3. RECOMMENDATIONS */
  useEffect(() => {
    const fetchRecs = async () => {
      if (!activeProduct?.id) return;
      try {
        const productsRef = collection(db, 'fashion_products');
        let q = query(productsRef, where('category', '==', activeProduct.category), limit(10));
        let snap = await getDocs(q);
        let items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter(i => i.id !== activeProduct.id);

        if (items.length === 0) {
            const fallbackSnap = await getDocs(query(productsRef, limit(8)));
            items = fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter(i => i.id !== activeProduct.id);
        }
        setRecommendations(items.slice(0, 8));
      } catch (e) { console.error(e); }
    };
    fetchRecs();
  }, [activeProduct.id, activeProduct.category]);

  /* 4. ACTIONS (LIKE, REVIEW) */
  const toggleLike = async () => {
    if (!activeProduct?.id) return;
    const likedProducts = JSON.parse(localStorage.getItem('gc_fashion_likes') || '{}');
    const productRef = doc(db, 'fashion_products', activeProduct.id);
    const willBeLiked = !isLiked;

    setIsLiked(willBeLiked);
    setLikeCount(prev => willBeLiked ? prev + 1 : Math.max(0, prev - 1));

    try {
      await updateDoc(productRef, { likes: increment(willBeLiked ? 1 : -1) });
      if (willBeLiked) likedProducts[activeProduct.id] = true; else delete likedProducts[activeProduct.id];
      localStorage.setItem('gc_fashion_likes', JSON.stringify(likedProducts));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      setIsLiked(!willBeLiked);
      setLikeCount(prev => !willBeLiked ? prev + 1 : Math.max(0, prev - 1));
      toast.error("Failed to sync likes");
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    const review: Review = { id: `local_${Date.now()}`, authorId: user.uid, name: getFirstName(user.displayName), comment: newComment, date: new Date().toLocaleDateString() };
    const storedReviews = JSON.parse(localStorage.getItem('gc_product_reviews') || '{}');
    storedReviews[activeProduct.id] = [review, ...(storedReviews[activeProduct.id] || [])];
    localStorage.setItem('gc_product_reviews', JSON.stringify(storedReviews));
    setNewComment('');
    syncData();
  };

  /* 5. NAVIGATION */
  const scrollRecs = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - (clientWidth / 1.5) : scrollLeft + (clientWidth / 1.5);
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  /* 🔥 LIGHTBOX SWIPE HANDLERS */
  const nextLightboxImage = () => setSelectedImage((prev) => (prev + 1) % allGalleryImages.length);
  const prevLightboxImage = () => setSelectedImage((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) nextLightboxImage();
    if (touchStartX.current - touchEndX.current < -50) prevLightboxImage();
  };

  const hasUserReviewed = user && allReviews.some((rev) => rev.authorId === user.uid);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-[80] bg-white text-emerald-900 p-2.5 rounded-full shadow-lg active:scale-90 transition-transform"><FaTimes size={18} /></button>
        
        {/* LEFT GALLERY */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col shrink-0 overflow-hidden text-left">
          <div className="relative h-[40vh] md:h-full overflow-hidden cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
            <img 
              key={activeProduct.id + selectedImage} 
              src={allGalleryImages[selectedImage]} 
              alt={activeProduct.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="px-1 pb-2.5 bg-white border-t border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 p-4 overflow-x-auto overflow-y-hidden no-scrollbar">
                {allGalleryImages.map((image, index) => (
                <button key={index} onClick={() => setSelectedImage(index)} className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-emerald-600 scale-105' : 'border-transparent opacity-50'}`}><img src={image} alt="thumb" className="w-full h-full object-cover" /></button>
                ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white relative overflow-hidden text-left">
          <div id="main-scroll-pane" className="flex-1 overflow-y-auto custom-scrollbar p-4 py-8 pt-3 md:p-6 ">
            <div className="mb-2">
              <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-1">{activeProduct.category}</p>
              <h1 className="text-2xl font-black text-gray-900 leading-tight italic uppercase">{activeProduct.name}</h1>
              <div className="flex items-center gap-6 mt-4">
                <div className="text-2xl font-black text-emerald-900">₦{activeProduct.price.toLocaleString()}</div>
                <button onClick={toggleLike} className={`flex items-center gap-2 transition-transform active:scale-90 ${isLiked ? 'text-red-500' : 'text-gray-300'}`}>
                    <FaHeart size={18} /> 
                    <span className="text-sm font-bold text-gray-700">{likeCount.toLocaleString()}</span>
                </button>
              </div>
              <button onClick={() => setShowReviews(!showReviews)} className="text-[11px] font-bold text-pink-500 uppercase tracking-widest mt-2 hover:underline decoration-2">{showReviews ? 'Hide Reviews' : `See Reviews (${allReviews.length})`}</button>
            </div>

            {showReviews && (
              <div className="my-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                {user ? (!hasUserReviewed ? (<form onSubmit={handleAddReview} className="mb-4 flex gap-2"><input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={`Review...`} className="flex-1 text-xs p-2.5 rounded-xl border border-gray-200 outline-none bg-white" /><button type="submit" className="bg-emerald-600 text-white p-2.5 rounded-xl"><FaPaperPlane size={14} /></button></form>) : (<div className="mb-4 bg-white p-3 rounded-xl border border-gray-200 text-center text-[10px] font-bold text-emerald-700 uppercase">Reviewed</div>)) : (<div className="mb-4 bg-white p-3 rounded-xl flex justify-between items-center"><p className="text-[10px] font-bold text-gray-600 uppercase">Sign in to review</p><button onClick={handleSignIn} className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Login</button></div>)}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                  {allReviews.map((rev) => (<div key={rev.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm"><div className="flex justify-between items-start mb-1"><div className="flex items-center gap-2"><FaUserCircle className="text-gray-300" size={16} /><span className="text-[11px] font-black text-gray-800">{rev.name}</span></div></div><p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p><p className="text-[9px] text-gray-400 mt-1 font-bold uppercase">{rev.date}</p></div>))}
                </div>
              </div>
            )}

            <div className="my-6 space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Color</h4>
                <div className="flex gap-3">
                  {activeProduct.colors.map((color, index) => (
                    <button key={index} onClick={() => { setSelectedColorIndex(index); setSelectedImage(index); }} className={`p-1 rounded-full border-2 transition-all ${selectedColorIndex === index ? 'border-emerald-600 scale-110' : 'border-transparent'}`}><div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: color.code }} /></button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Available Size</h4>
                <div className="flex flex-wrap gap-2">
                    {activeProduct.sizes.map((sizeObj, index) => (
                        <button key={index} disabled={!sizeObj.inStock} className={`min-w-[42px] px-3 py-2 rounded-lg text-xs font-bold border ${!sizeObj.inStock ? 'opacity-30' : 'border-gray-200 hover:border-emerald-600 hover:text-emerald-600'}`}>{sizeObj.size}</button>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">About</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{activeProduct.description || "Premium fashion piece."}</p>
              </div>
            </div>

            {/* RECOMMENDATIONS */}
            {recommendations.length > 0 && (
              <div className="mt-4 pb-11 relative group/slider">
                <h4 className="text-[11px] font-black uppercase text-gray-900 tracking-widest flex items-center gap-2 mb-6">
                    <FaMagic className="text-emerald-500" /> You May Also Like
                </h4>
                <div className="relative px-2">
                    <button onClick={() => scrollRecs('left')} className="absolute -left-2 top-20 -translate-y-1/2 z-10 p-2 bg-white/90 shadow-lg rounded-full text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 hidden md:block"><FaChevronLeft size={12}/></button>
                    <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                    {recommendations.map((item) => (
                        <div key={item.id} 
                             onClick={() => {
                               hasUserNavigatedRef.current = true; // 🔥 LOCK OVERLAY CONTROL
                               setActiveProduct(item); 
                               onSelectProduct?.(item); 
                               document.getElementById('main-scroll-pane')?.scrollTo({ top: 0, behavior: 'smooth' });
                             }} 
                             className="w-28 md:w-32 shrink-0 group cursor-pointer snap-start">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-2 border border-gray-50">
                            <img src={item.colors[0]?.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h5 className="text-[9px] font-black text-gray-900 truncate uppercase">{item.name}</h5>
                        <p className="text-[10px] font-bold text-emerald-700">₦{item.price.toLocaleString()}</p>
                        </div>
                    ))}
                    </div>
                    <button onClick={() => scrollRecs('right')} className="absolute -right-2 top-20 -translate-y-1/2 z-10 p-2 bg-white/90 shadow-lg rounded-full text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 hidden md:block"><FaChevronRight size={12}/></button>
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:px-10 md:pb-3 bg-white/90 backdrop-blur-md border-t border-gray-50 z-50">
            <button onClick={onAddToCart} className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest active:scale-95 shadow-xl shadow-emerald-900/20">
              <FaShoppingCart className='inline mr-2' /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* LIGHTBOX WITH SWIPE SUPPORT */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center" 
          onClick={() => setIsLightboxOpen(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button className="absolute top-6 right-6 text-white z-[110] active:scale-90 transition-transform"><FaTimes size={32} /></button>
          
          {/* Slider Buttons for Desktop */}
          <button onClick={(e) => { e.stopPropagation(); prevLightboxImage(); }} className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-all z-[120] p-4 rounded-full active:scale-90 hidden sm:block"><FaChevronLeft size={36} /></button>
          
          <img 
            src={allGalleryImages[selectedImage]} 
            alt="Fullscreen" 
            className="max-w-full max-h-screen object-contain pointer-events-none select-none transition-transform duration-300" 
          />

          <button onClick={(e) => { e.stopPropagation(); nextLightboxImage(); }} className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-all z-[120] p-4 rounded-full active:scale-90 hidden sm:block"><FaChevronRight size={36} /></button>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 font-mono text-sm tracking-widest">
            {selectedImage + 1} / {allGalleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
}