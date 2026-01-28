// components/fashion/ProductDetailOverlay.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaHeart, FaShoppingCart, FaTruck, FaShieldAlt, FaChevronLeft, FaChevronRight, FaPaperPlane, FaUserCircle, FaTrash } from 'react-icons/fa';
import type { Product, Review } from '@/components/fashion/Products';
import { auth } from '@/lib/firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

interface ProductDetailOverlayProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

export default function ProductDetailOverlay({ product, onClose, onAddToCart }: ProductDetailOverlayProps) {
  // Logic updated: Gallery now exclusively pulls from the colors array
  const allGalleryImages = product.colors.map(c => c.imageUrl);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.likes || 0);
  const [showReviews, setShowReviews] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<any>(null);

  const getFirstName = (fullName: string) => fullName ? fullName.split(' ')[0] : 'User';

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsub();
  }, []);

  const handleSignIn = () => signInWithPopup(auth, new GoogleAuthProvider());

  const syncData = useCallback(() => {
    const likedProducts = JSON.parse(localStorage.getItem('gc_wab_likes') || '{}');
    if (likedProducts[product.id]) {
      setIsLiked(true);
      setLikeCount(product.likes + 1);
    } else {
      setIsLiked(false);
      setLikeCount(product.likes);
    }
    const storedReviews = JSON.parse(localStorage.getItem('gc_product_reviews') || '{}');
    const localSaved = storedReviews[product.id] || [];
    setAllReviews([...localSaved, ...product.reviews]);
  }, [product.id, product.likes, product.reviews]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    syncData();
    window.addEventListener('storage', syncData);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('storage', syncData);
    };
  }, [syncData]);

  const toggleLike = () => {
    const likedProducts = JSON.parse(localStorage.getItem('gc_wab_likes') || '{}');
    if (isLiked) delete likedProducts[product.id];
    else likedProducts[product.id] = true;
    localStorage.setItem('gc_wab_likes', JSON.stringify(likedProducts));
    syncData();
    window.dispatchEvent(new Event('storage'));
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

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % allGalleryImages.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.targetTouches[0].clientX;
    if (touchStart - touchEnd > 70) { nextImage(); setTouchStart(null); }
    if (touchStart - touchEnd < -70) { prevImage(); setTouchStart(null); }
  };

  const hasUserReviewed = user && allReviews.some((rev: any) => rev.authorId === user.uid);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative bg-white w-full h-full md:h-auto md:max-h-[95vh] md:max-w-5xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-[80] bg-white/90 text-emerald-900 p-3 rounded-full shadow-lg hover:bg-emerald-50 transition-colors"><FaTimes size={20} /></button>
        <div className="w-full md:w-1/2 bg-gray-50 flex flex-col shrink-0 border-none outline-none">
          <div className="relative h-[40vh] md:h-full overflow-hidden cursor-zoom-in min-h-[300px]" onClick={() => setIsLightboxOpen(true)} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
            <img src={allGalleryImages[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            <div className="hidden md:flex absolute inset-0 items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="p-2 bg-white/80 rounded-full hover:bg-white text-emerald-900"><FaChevronLeft /></button>
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="p-2 bg-white/80 rounded-full hover:bg-white text-emerald-900"><FaChevronRight /></button>
            </div>
          </div>
          <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar bg-white">
            {allGalleryImages.map((image, index) => (
              <button key={index} onClick={() => setSelectedImage(index)} className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-emerald-600' : 'border-transparent opacity-70'}`}><img src={image} alt="thumb" className="w-full h-full object-cover" /></button>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white border-none outline-none overflow-hidden">
          <div className="flex-1 overflow-y-auto pl-4 pr-2 md:p-10 custom-scrollbar border-none outline-none">
            <div className="mb-1">
              <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-1">{product.category}</p>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className='flex items-center gap-6'>
                    <button onClick={toggleLike} className="text-xl md:text-2xl flex items-center text-red-500 gap-1.5 transition-transform active:scale-90"><FaHeart className={isLiked ? 'text-red-500' : 'text-gray-300'} /><span className="text-sm font-bold text-gray-700">{likeCount.toLocaleString()}</span></button>
                    <div className="hidden md:block"><span className="text-2xl font-black text-emerald-900">₦{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">In Stock</span>
              </div>
              <button onClick={() => setShowReviews(!showReviews)} className="text-[11px] font-bold text-pink-500 uppercase tracking-widest mt-2 hover:underline">{showReviews ? 'Hide Reviews' : `See Reviews (${allReviews.length})`}</button>
            </div>
            {showReviews && (
              <div className="mb-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                {user ? (!hasUserReviewed ? (<form onSubmit={handleAddReview} className="mb-4 flex gap-2"><input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={`Review as ${getFirstName(user.displayName)}...`} className="flex-1 text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 bg-white" /><button type="submit" className="bg-emerald-600 text-white p-2.5 rounded-xl transition-colors hover:bg-emerald-700"><FaPaperPlane size={14} /></button></form>) : (<div className="mb-4 bg-white p-3 rounded-xl border border-gray-200 text-center"><p className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">You have already reviewed this product</p></div>)) : (<div className="mb-4 bg-white p-3 rounded-xl border border-emerald-100 flex justify-between items-center"><p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Sign in to add a review</p><button onClick={handleSignIn} className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform">Google Sign In</button></div>)}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                  {allReviews.map((rev) => (<div key={rev.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm"><div className="flex justify-between items-start mb-1"><div className="flex items-center gap-2"><FaUserCircle className="text-gray-300" size={16} /><span className="text-[11px] font-black text-gray-800">{rev.name}</span></div>{user && rev.authorId === user.uid && (<button onClick={() => deleteReview(rev.id)} className="text-gray-400 hover:text-red-500"><FaTrash size={10} /></button>)}</div><p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p><p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">{rev.date}</p></div>))}
                  {allReviews.length === 0 && <p className="text-xs text-center text-gray-400 py-4 italic">No reviews yet.</p>}
                </div>
              </div>
            )}
            <div className="md:hidden mb-4 text-2xl font-black text-emerald-900">₦{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="mb-4">
              <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Color: {product.colors[selectedColorIndex].name}</h4>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button key={index} onClick={() => { setSelectedColorIndex(index); setSelectedImage(index); }} className={`p-1 rounded-full border-1 transition-colors ${selectedColorIndex === index ? 'border-emerald-600' : 'border-transparent'}`}><div className="w-5 h-5 rounded-full shadow-inner border border-black/5" style={{ backgroundColor: color.code }} /></button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Available Size</h4>
              <div className="flex flex-wrap gap-2">{product.sizes.map((sizeObj, index) => (<button key={index} disabled={!sizeObj.inStock} className={`min-w-[42px] px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${!sizeObj.inStock ? 'bg-gray-50 text-gray-300' : 'border-gray-200 hover:border-emerald-600 hover:text-emerald-600 text-gray-700'}`}>{sizeObj.size}</button>))}</div>
            </div>
            <div className="mb-4">
              <h4 className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Description</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-6 md:pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase"><FaTruck className="text-emerald-600" /> Fast Delivery</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase"><FaShieldAlt className="text-emerald-600" /> Secure Payment</div>
            </div>
          </div>
          <div className="sticky bottom-0 left-0 right-0 p-4 md:px-10 md:pb-8 md:pt-2 bg-white border-none z-50">
            <button onClick={onAddToCart} className="w-full bg-emerald-700 text-white py-4 rounded-xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-3 font-bold uppercase text-xs tracking-widest active:scale-95 shadow-lg shadow-emerald-900/20"><FaShoppingCart /> Add to Cart</button>
          </div>
        </div>
      </div>
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
          <button className="absolute top-6 right-6 text-white z-[110]"><FaTimes size={32} /></button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 md:left-10 text-white/50 hover:text-white"><FaChevronLeft size={48} /></button>
          <img src={allGalleryImages[selectedImage]} alt="Fullscreen" className="max-w-full max-h-screen object-contain" />
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 md:right-10 text-white/50 hover:text-white"><FaChevronRight size={48} /></button>
        </div>
      )}
    </div>
  );
}