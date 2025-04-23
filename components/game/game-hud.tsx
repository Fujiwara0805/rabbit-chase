"use client";

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useGameStore } from '@/lib/store/game-store';

export default function GameHUD() {
  const timeRemaining = useGameStore(state => state.timeRemaining);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <>
      {/* Timer */}
      <motion.div 
        className="game-timer"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Clock className="inline-block mr-2" size={20} />
        {formatTime(timeRemaining)}
      </motion.div>
    </>
  );
}