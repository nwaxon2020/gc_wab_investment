"use client";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useLikes() {
  const [likes, setLikes] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gc-wab-likes');
    if (saved) setLikes(JSON.parse(saved));
  }, []);

  const toggleLike = (carId: string) => {
    const newLikes = likes.includes(carId)
      ? likes.filter(id => id !== carId)
      : [...likes, carId];
    
    setLikes(newLikes);
    localStorage.setItem('gc-wab-likes', JSON.stringify(newLikes));
    
    // Trigger your toast here!
    toast.info(likes.includes(carId) ? "Removed from likes" : "Saved to likes");
  };

  return { likes, toggleLike };
}