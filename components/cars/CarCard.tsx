'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebaseConfig';
import { doc, updateDoc, increment, onSnapshot, getDoc } from 'firebase/firestore';
import { 
  FaPlay, FaTimes, FaWhatsapp, FaExternalLinkAlt, 
  FaCalendarAlt, FaCogs, FaHandshake, FaFileAlt,
  FaPalette, FaCouch, FaAward, FaHeart, FaRegHeart,
} from 'react-icons/fa';
import { GiGearStickPattern } from "react-icons/gi";

interface Car {
  id: number | string;
  name: string;
  model: string;
  price: number;
  images: string[];
  specs: string[];
  description: string;
  videoUrl: string;
  externalLink?: string;
  likes?: number; 
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const searchParams = useSearchParams();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showFullImage, setShowFullImage] = useState<boolean>(false);
  const [imgIndex, setImgIndex] = useState(0); 
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [dbLikes, setDbLikes] = useState<number>(car.likes || 0); 
  const [contactInfo, setContactInfo] = useState({ whatsapp: "07034632037" });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const docRef = doc(db, 'site_settings', 'contacts');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContactInfo(docSnap.data() as { whatsapp: string });
        }
      } catch (e) {
        console.error("Error loading contacts:", e);
      }
    };
    fetchContactInfo();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'vehicles', String(car.id)), (docSnap) => {
      if (docSnap.exists()) {
        setDbLikes(docSnap.data().likes || 0);
      }
    });
    return () => unsub();
  }, [car.id]);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('user_liked_cars') || '{}');
    if (savedLikes[car.id]) {
      setIsLiked(true);
    }
  }, [car.id]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const carRef = doc(db, 'vehicles', String(car.id));
    const savedLikes = JSON.parse(localStorage.getItem('user_liked_cars') || '{}');

    try {
      if (isLiked) {
        delete savedLikes[car.id];
        setIsLiked(false);
        await updateDoc(carRef, { likes: increment(-1) });
      } else {
        savedLikes[car.id] = true;
        setIsLiked(true);
        await updateDoc(carRef, { likes: increment(1) });
      }
      localStorage.setItem('user_liked_cars', JSON.stringify(savedLikes));
      window.dispatchEvent(new Event('likesUpdated'));
    } catch (error) {
      console.error("Like update failed:", error);
    }
  };

  const technicalDbUrl = useMemo(() => {
    if (car.externalLink && car.externalLink.startsWith('http')) return car.externalLink;
    return `https://www.auto-data.net/en/results?search=${encodeURIComponent(car.name + " " + car.model)}`;
  }, [car.name, car.model, car.externalLink]);

  const selectedImage = car.images[imgIndex];

  useEffect(() => {
    const viewId = searchParams.get('view');
    if (viewId && viewId === car.id.toString()) {
      setShowDetails(true);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }, [searchParams, car.id]);

  const handleVideoPlay = () => { setIsVideoPlaying(true); videoRef.current?.play(); };
  const handleVideoClose = () => { setIsVideoPlaying(false); videoRef.current?.pause(); };
  
  const openWhatsApp = () => { 
    const message = `Hello! I'm interested in the ${car.name} ${car.model}. Please provide more details.`;
    let digits = contactInfo.whatsapp.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = digits.substring(1);
    const finalPhone = digits.startsWith('234') ? digits : `234${digits}`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, '_blank'); 
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -100 && imgIndex < car.images.length - 1) {
      setImgIndex(imgIndex + 1);
    } else if (info.offset.x > 100 && imgIndex > 0) {
      setImgIndex(imgIndex - 1);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-lg md:rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-38 md:h-48 overflow-hidden">
          <motion.img
            src={isHovered && car.images[1] ? car.images[1] : car.images[0]}
            alt={car.name}
            loading="lazy"
            className="w-full h-[10rem] md:h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          <div className="absolute top-2 left-1 md:top-4 md:left-4 z-10 flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.6 }}
              onClick={toggleLike}
              className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 transition-colors"
            >
              {isLiked ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-white text-sm" />}
            </motion.button>
            <span className="text-[9px] font-bold text-pink-200 mt-1 drop-shadow-md">
              {dbLikes}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => setShowDetails(true)}
            className="absolute top-2 right-1 md:top-4 md:right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 py-1 md:px-3 rounded-xl md:rounded-full font-semibold text-xs hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <div className='flex hidden md:block'>View Details</div>
            <span className='md:hidden'>View</span>
          </motion.button>
        </div>

        <div className="p-2 px-1.5 md:p-4">
          <div className="relative flex justify-between items-start mb-1 md:mb-3.5">
            <div>
              <span className="md:hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 md:px-3 py-1 rounded-lg md:rounded-full text-[10px] md:text-sm md:font-bold">
                ₦{car.price.toLocaleString()}
              </span>
              <h3 className="text-sm md:text-lg font-semibold md:font-bold text-white pb-1 md:pb-0">
                {car.name} {" "}
                <small className="md:hidden font-medium text-gray-400 text-[11px] md:text-sm">{car.model} {" "}<span className='text-yellow-500 text-[11px]'>{car.specs[7]}</span></small>
              </h3>
              <p className="hidden md:block text-gray-400 text-sm">{car.model} {" "}<span className='text-yellow-500 text-xs'>{car.specs[7]}</span></p>
            </div>
            <span className="hidden md:block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 md:px-3 py-1 rounded-lg md:rounded-full text-[10px] md:text-sm md:font-bold">
              ₦{car.price.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 md:gap-2 mb-1 md:mb-4">
            {car.specs.slice(0, 4).map((spec, index) => (
              <div key={index} className="flex items-center gap-1 md:gap-2 text-gray-300">
                {index === 0 && <><FaCalendarAlt className="text-blue-400" /><span className='hidden md:block text-[10px] md:text-sm'>Year:</span></>}
                {index === 1 && <><FaCogs className="text-green-400" /><span className='hidden md:block text-[10px] md:text-sm'>Engine:</span></>}
                {index === 2 && <><FaHandshake className="text-amber-400" /><span className='hidden text-[10px] md:text-sm'>Con:</span></>}
                {index === 3 && <><GiGearStickPattern className="text-cyan-400" /><span className='hidden md:block text-[10px] md:text-sm'>Type:</span></>}
                <span className="text-[goldenrod] md:text-white text-[10.5px] md:text-sm truncate">{spec}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
            <button
              onClick={openWhatsApp}
              className="col-span-2 md:col-span-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-1 md:py-2 rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="text-xl" /> <span className='text-sm hidden md:flex'>Contact Us</span>
            </button>
            <button
              onClick={handleVideoPlay}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-1 md:py-2 rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <FaPlay />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isVideoPlaying && (
          <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={handleVideoClose}>
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button onClick={handleVideoClose} className="absolute -top-12 right-0 text-white text-2xl hover:text-red-500 transition-colors"><FaTimes /></button>
              <video ref={videoRef} src={car.videoUrl} controls className="w-full rounded-2xl shadow-2xl" onEnded={() => setIsVideoPlaying(false)} />
            </div>
          </div>
        )}

        {showFullImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/98 z-[110] flex flex-col items-center justify-center touch-none" onClick={() => setShowFullImage(false)}>
            <button className="absolute top-8 right-8 text-white text-3xl z-[120]"><FaTimes /></button>
            <motion.div key={imgIndex} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleDragEnd} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
              <img src={car.images[imgIndex]} className="max-w-full max-h-[85vh] object-contain pointer-events-none" />
            </motion.div>
          </motion.div>
        )}

        {showDetails && (
          <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto p-1.5" onClick={() => setShowDetails(false)}>
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl max-w-6xl mx-auto my-4 overflow-hidden border border-gray-800" onClick={(e) => e.stopPropagation()}>
              <div className="grid md:grid-cols-2 gap-8 p-3 md:p-6">
                <div className="flex flex-col gap-2 md:gap-4 overflow-hidden">
                  <div className="relative h-70 md:h-96 rounded-xl overflow-hidden cursor-zoom-in" onClick={() => setShowFullImage(true)}>
                    <img src={selectedImage} alt={car.name} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Updated Thumbnail Div with Padding and No Border */}
                  <div className="w-full flex gap-3 overflow-x-auto p-3 md:p-4 snap-x scrollbar-hide">
                    {car.images.map((image, index) => (
                      <button 
                        key={index} 
                        onClick={() => setImgIndex(index)} 
                        className={`flex-shrink-0 snap-start w-20 h-16 md:w-24 md:h-18 rounded-xl overflow-hidden transition-all duration-300 border-none ${imgIndex === index ? 'scale-110 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                      >
                        <img src={image} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{car.name}</h2>
                        <p className="text-xl text-gray-400">{car.model}{" "}{car.specs[7]}</p>
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleLike} className={`p-3 rounded-2xl border transition-all ${isLiked ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 text-white'}`}>
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                      </motion.button>
                    </div>
                    <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-white text-2xl transition-colors"><FaTimes /></button>
                  </div>
                  <div className="mb-4">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-2 rounded-full text-sm font-bold inline-block">₦{car.price.toLocaleString()}</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-4 text-gray-300">Specifications</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {car.specs.map((spec, index) => (
                        <div key={index} className="flex flex-col gap-1 bg-gray-800/40 p-1.5 rounded-xl border border-gray-700/50">
                          <div className="flex items-center gap-2 opacity-60 text-[10px] uppercase font-bold tracking-wider">
                            {index === 0 && <><FaCalendarAlt />Year: </>}
                            {index === 1 && <><FaCogs />Engine: </>}
                            {index === 2 && <><GiGearStickPattern />Condition: </>}
                            {index === 3 && <><FaHandshake />Transmition: </>}
                            {index === 4 && <><FaFileAlt />Custom: </>}
                            {index === 5 && <><FaPalette />Exterior: </>}
                            {index === 6 && <><FaCouch />Interior: </>}
                            {index === 7 && <><FaAward />Trim: </>}
                          </div>
                          <span className="text-xs md:text-sm font-bold text-blue-100">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-1 text-gray-300">Description</h3>
                    <p className="text-gray-400 leading-relaxed text-sm mb-2">{car.description}</p>
                    <a href={technicalDbUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-[11px] font-bold hover:underline flex items-center gap-1">
                      <FaFileAlt className="text-blue-400" /> Verify details on Auto-Data <FaExternalLinkAlt className="text-[9px]" />
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={handleVideoPlay} className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm"><FaPlay /> Watch Review Video</button>
                    <button onClick={openWhatsApp} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm"><FaWhatsapp className="text-xl" /> WhatsApp Agent</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CarCard;