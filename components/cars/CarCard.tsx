'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  externalLink: string;
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const searchParams = useSearchParams();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>(car.images[0]);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalLikes = useMemo(() => Math.floor(Math.random() * 500) + 1, []);
  const whatsappNumber = "+2347034632037";
  const whatsappMessage = `Hello! I'm interested in the ${car.name} ${car.model}. Please provide more details.`;

  // NEW LOGIC: Check URL for ID and auto-open details
  useEffect(() => {
    const viewId = searchParams.get('view');
    if (viewId && viewId === car.id.toString()) {
      setShowDetails(true);
      // Optional: Scroll to card
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }, [searchParams, car.id]);

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem('user_liked_cars') || '{}');
    if (savedLikes[car.id]) {
      setIsLiked(true);
    }
    window.dispatchEvent(new Event('likesUpdated'));
  }, [car.id]);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const savedLikes = JSON.parse(localStorage.getItem('user_liked_cars') || '{}');
    if (isLiked) {
      delete savedLikes[car.id];
      setIsLiked(false);
    } else {
      savedLikes[car.id] = true;
      setIsLiked(true);
    }
    localStorage.setItem('user_liked_cars', JSON.stringify(savedLikes));
    window.dispatchEvent(new Event('likesUpdated'));
  };

  const handleVideoPlay = () => { setIsVideoPlaying(true); videoRef.current?.play(); };
  const handleVideoClose = () => { setIsVideoPlaying(false); videoRef.current?.pause(); };
  const openWhatsApp = () => { window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank'); };

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
            className="w-full h-[10rem] md:h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          <div className="absolute top-2 left-1 md:top-4 md:left-4 z-10 flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={toggleLike}
              className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 transition-colors"
            >
              {isLiked ? <FaHeart className="text-red-500 text-sm" /> : <FaRegHeart className="text-white text-sm" />}
            </motion.button>
            <span className="text-[9px] font-bold text-pink-200 mt-1 drop-shadow-md">
              {isLiked ? totalLikes + 1 : totalLikes}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
                <small className="md:hidden font-medium text-gray-400 text-[11px] md:text-sm">{car.model}</small>
              </h3>
              <p className="hidden md:block text-gray-400 text-sm">{car.model}</p>
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openWhatsApp}
              className="col-span-2 md:col-span-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-1 md:py-2 rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="text-xl" /> <span className='text-sm hidden md:flex'>Contact Us</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVideoPlay}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-1 md:py-2 rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <FaPlay />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={handleVideoClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button onClick={handleVideoClose} className="absolute -top-12 right-0 text-white text-2xl hover:text-red-500 transition-colors">
                <FaTimes />
              </button>
              <video ref={videoRef} src={car.videoUrl} controls className="w-full rounded-2xl shadow-2xl" onEnded={() => setIsVideoPlaying(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 overflow-y-auto p-1.5"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-3xl max-w-6xl mx-auto my-4 overflow-hidden border border-gray-800"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-8 p-3 md:p-6 lg:p-10">
                <div>
                  <div className="relative h-70 md:h-96 rounded-2xl overflow-hidden mb-4">
                    <img src={selectedImage} alt={car.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {car.images.map((image, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImage(image)}
                        className={`rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === image ? 'border-blue-500 scale-105' : 'border-gray-700 hover:border-gray-500'}`}
                      >
                        <img src={image} alt={`View ${index + 1}`} className="w-full h-14 md:h-18 object-cover" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="text-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{car.name}</h2>
                        <p className="text-xl text-gray-400">{car.model}</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleLike}
                        className={`p-3 rounded-2xl border transition-all ${isLiked ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 text-white'}`}
                      >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                      </motion.button>
                    </div>
                    <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-white text-2xl transition-colors"><FaTimes /></button>
                  </div>

                  <div className="mb-4">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-2 rounded-full text-sm font-bold inline-block">
                      ₦{car.price.toLocaleString()}
                    </span>
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
                    <h3 className="text-lg font-bold mb-3 text-gray-300">Description</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{car.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={car.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm"
                    >
                      <FaExternalLinkAlt /> View Online
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openWhatsApp}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm"
                    >
                      <FaWhatsapp className="text-xl" /> WhatsApp
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CarCard;