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

interface ProductDetailOverlayProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
  onSelectProduct?: (product: Product) => void;
}

export default function ProductDetailOverlay({ product, onClose, onAddToCart, onSelectProduct }: ProductDetailOverlayProps) {
  const allGalleryImages = product?.colors?.map(c => c.imageUrl) || [];
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(product?.likes || 0);
  const [showReviews, setShowReviews] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  const getFirstName = (fullName: string) => fullName ? fullName.split(' ')[0] : 'User';

  // 1. Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsub();
  }, []);

  const handleSignIn = () => signInWithPopup(auth, new GoogleAuthProvider());

  // 2. Data Sync (Likes & Reviews)
  const syncData = useCallback(() => {
    if (!product?.id) return;
    const likedProducts = JSON.parse(localStorage.getItem('gc_fashion_likes') || '{}');
    setIsLiked(!!likedProducts[product.id]);
    setLikeCount(likedProducts[product.id] ? product.likes + 1 : product.likes);

    const storedReviews = JSON.parse(localStorage.getItem('gc_product_reviews') || '{}');
    const localSaved = storedReviews[product.id] || [];
    setAllReviews([...localSaved, ...(product.reviews || [])]);
  }, [product]);

  // 3. Recommendation Logic
  useEffect(() => {
    const fetchRecs = async () => {
      if (!product?.id) return;
      try {
        const productsRef = collection(db, 'fashion_products');
        let q = query(productsRef, where('category', '==', product.category), limit(10));
        let snap = await getDocs(q);
        let items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter(i => i.id !== product.id);

        if (items.length === 0) {
            const fallbackQ = query(productsRef, limit(8));
            const fallbackSnap = await getDocs(fallbackQ);
            items = fallbackSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter(i => i.id !== product.id);
        }
        setRecommendations(items.slice(0, 8));
      } catch (e) { console.error(e); }
    };
    fetchRecs();
  }, [product.id, product.category]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    syncData();
    return () => { document.body.style.overflow = 'unset'; };
  }, [product.id, syncData]);

  // 4. Firestore Actions
  const toggleLike = async () => {
    if (!product?.id) return;
    const likedProducts = JSON.parse(localStorage.getItem('gc_fashion_likes') || '{}');
    const productRef = doc(db, 'fashion_products', product.id);

    try {
      if (isLiked) {
        delete likedProducts[product.id];
        await updateDoc(productRef, { likes: increment(-1) });
        setLikeCount((prev) => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        likedProducts[product.id] = true;
        await updateDoc(productRef, { likes: increment(1) });
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
      localStorage.setItem('gc_fashion_likes', JSON.stringify(likedProducts));
      window.dispatchEvent(new Event('storage'));
    } catch (e) { toast.error("Action failed"); }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    const review: Review = { id: `local_${Date.now()}`, authorId: user.uid, name: getFirstName(user.displayName), comment: newComment, date: new Date().toLocaleDateString() };
    const storedReviews = JSON.parse(localStorage.getItem('gc_product_reviews') || '{}');
    storedReviews[product.id] = [review, ...(storedReviews[product.id] || [])];
    localStorage.setItem('gc_product_reviews', JSON.stringify(storedReviews));
    setNewComment('');
    syncData();
    window.dispatchEvent(new Event('storage'));
  };

  const deleteReview = (id: string) => {
    const storedReviews = JSON.parse(localStorage.getItem('gc_product_reviews') || '{}');
    storedReviews[product.id] = (storedReviews[product.id] || []).filter((r: Review) => r.id !== id);
    localStorage.setItem('gc_product_reviews', JSON.stringify(storedReviews));
    syncData();
    window.dispatchEvent(new Event('storage'));
  };

  // 5. Navigation
  const nextImage = () => setSelectedImage((prev) => (prev + 1) % allGalleryImages.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - (clientWidth / 1.5) : scrollLeft + (clientWidth / 1.5);
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const hasUserReviewed = user && allReviews.some((rev) => rev.authorId === user.uid);

  if (!product || !product.colors) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-[80] bg-white text-emerald-900 p-2.5 rounded-full shadow-lg active:scale-90 transition-transform"><FaTimes size={18} /></button>
        
        {/* LEFT GALLERY */}
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col shrink-0 overflow-hidden">
          <div className="relative h-[40vh] md:h-full overflow-hidden cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
            <img src={allGalleryImages[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 bg-white border-t border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden no-scrollbar pb-1">
                {allGalleryImages.map((image, index) => (
                <button key={index} onClick={() => setSelectedImage(index)} className={`w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-emerald-600 scale-105 shadow-sm' : 'border-transparent opacity-50'}`}><img src={image} alt="thumb" className="w-full h-full object-cover" /></button>
                ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white relative overflow-hidden">
          
          <div id="main-scroll-pane" className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 pb-32">
            <div className="mb-2 text-left">
              <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-1">{product.category}</p>
              <h1 className="text-2xl font-black text-gray-900 leading-tight italic uppercase">{product.name}</h1>
              <div className="flex items-center gap-6 mt-4">
                <div className="text-2xl font-black text-emerald-900">₦{product.price.toLocaleString()}</div>
                <button onClick={toggleLike} className="flex items-center gap-2 text-red-500 active:scale-90"><FaHeart className={isLiked ? 'text-red-500' : 'text-gray-300'} /> <span className="text-sm font-bold text-gray-700">{likeCount.toLocaleString()}</span></button>
              </div>
              <button onClick={() => setShowReviews(!showReviews)} className="text-[11px] font-bold text-pink-500 uppercase tracking-widest mt-2 hover:underline decoration-2">{showReviews ? 'Hide Reviews' : `See Reviews (${allReviews.length})`}</button>
            </div>

            {/* RESTORED REVIEWS */}
            {showReviews && (
              <div className="my-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                {user ? (!hasUserReviewed ? (<form onSubmit={handleAddReview} className="mb-4 flex gap-2"><input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={`Review as ${getFirstName(user.displayName)}...`} className="flex-1 text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 bg-white" /><button type="submit" className="bg-emerald-600 text-white p-2.5 rounded-xl"><FaPaperPlane size={14} /></button></form>) : (<div className="mb-4 bg-white p-3 rounded-xl border border-gray-200 text-center"><p className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">You have already reviewed this product</p></div>)) : (<div className="mb-4 bg-white p-3 rounded-xl border border-emerald-100 flex justify-between items-center"><p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Sign in to add a review</p><button onClick={handleSignIn} className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95">Login</button></div>)}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                  {allReviews.map((rev) => (<div key={rev.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm"><div className="flex justify-between items-start mb-1"><div className="flex items-center gap-2"><FaUserCircle className="text-gray-300" size={16} /><span className="text-[11px] font-black text-gray-800">{rev.name}</span></div>{user && rev.authorId === user.uid && (<button onClick={() => deleteReview(rev.id)} className="text-gray-400 hover:text-red-500"><FaTrash size={10} /></button>)}</div><p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p><p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">{rev.date}</p></div>))}
                  {allReviews.length === 0 && <p className="text-xs text-center text-gray-400 py-4 italic">No reviews yet.</p>}
                </div>
              </div>
            )}

            <div className="my-6 space-y-6">
              <div className="text-left">
                <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Color</h4>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <button key={index} onClick={() => { setSelectedColorIndex(index); setSelectedImage(index); }} className={`p-1 rounded-full border-2 transition-all ${selectedColorIndex === index ? 'border-emerald-600 scale-110' : 'border-transparent'}`}><div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: color.code }} /></button>
                  ))}
                </div>
              </div>

              <div className="text-left">
                <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Available Size</h4>
                <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sizeObj, index) => (
                        <button key={index} disabled={!sizeObj.inStock} className={`min-w-[42px] px-3 py-2 rounded-lg text-xs font-bold border ${!sizeObj.inStock ? 'opacity-30' : 'border-gray-200 hover:border-emerald-600 hover:text-emerald-600'}`}>{sizeObj.size}</button>
                    ))}
                </div>
              </div>

              <div className="text-left">
                <h4 className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">About</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{product.description || "Premium fashion piece curated for luxury and comfort."}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100 mb-10">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase"><FaTruck className="text-emerald-600" /> Fast Delivery</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase"><FaShieldAlt className="text-emerald-600" /> Secure Payment</div>
            </div>

            {/* RECOMMENDATIONS WITH SIDE BUTTONS */}
            {recommendations.length > 0 && (
              <div className="mt-4 pb-10 relative group/slider">
                <h4 className="text-[11px] font-black uppercase text-gray-900 tracking-widest flex items-center gap-2 mb-6 text-left">
                    <FaMagic className="text-emerald-500" /> You May Also Like
                </h4>
                
                <div className="relative px-2">
                    <button onClick={() => scroll('left')} className="absolute -left-2 top-20 -translate-y-1/2 z-10 p-2 bg-white/90 shadow-lg rounded-full text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 hidden md:block">
                        <FaChevronLeft size={12}/>
                    </button>

                    <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                    {recommendations.map((item) => (
                        <div key={item.id} onClick={() => { if (onSelectProduct) onSelectProduct(item); document.getElementById('main-scroll-pane')?.scrollTo(0,0); }} className="w-28 md:w-32 shrink-0 group cursor-pointer snap-start">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-2 border border-gray-50">
                            <img src={item.colors[0]?.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h5 className="text-[9px] font-black text-gray-900 truncate uppercase text-left">{item.name}</h5>
                        <p className="text-[10px] font-bold text-emerald-700 text-left">₦{item.price.toLocaleString()}</p>
                        </div>
                    ))}
                    </div>

                    <button onClick={() => scroll('right')} className="absolute -right-2 top-20 -translate-y-1/2 z-10 p-2 bg-white/90 shadow-lg rounded-full text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 hidden md:block">
                        <FaChevronRight size={12}/>
                    </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:px-10 md:pb-8 bg-white/90 backdrop-blur-md border-t border-gray-50 z-50">
            <button onClick={onAddToCart} className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest active:scale-95 shadow-xl shadow-emerald-900/20">
              <FaShoppingCart className='inline mr-2' /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* LIGHTBOX / FULLSCREEN RESTORED */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
          <button className="absolute top-6 right-6 text-white z-[110] active:scale-90 transition-transform"><FaTimes size={32} /></button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-colors"><FaChevronLeft size={48} /></button>
          <img src={allGalleryImages[selectedImage]} alt="Fullscreen" loading="lazy" className="max-w-full max-h-screen object-contain" />
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-colors"><FaChevronRight size={48} /></button>
        </div>
      )}
    </div>
  );
}