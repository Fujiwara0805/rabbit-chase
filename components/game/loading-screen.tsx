"use client";

import { motion } from 'framer-motion';
import { Rabbit } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-primary z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-white mb-8"
      >
        <Rabbit size={80} />
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-6xl text-white mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        バニーチェイス
      </motion.h1>
      
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-white rounded-full loading-dot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 + (i * 0.1) }}
          />
        ))}
      </div>
    </motion.div>
  );
}