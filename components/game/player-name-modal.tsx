"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/lib/store/game-store';
import { UserCircle } from 'lucide-react';

interface PlayerNameModalProps {
  onSubmit: () => void;
}

export default function PlayerNameModal({ onSubmit }: PlayerNameModalProps) {
  const playerName = useGameStore(state => state.playerName);
  const setPlayerName = useGameStore(state => state.setPlayerName);
  const [name, setName] = useState(playerName || '');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('名前を入力してください');
      return;
    }
    
    setPlayerName(name.trim());
    
    onSubmit();
  };
  
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6 w-[90vw] max-w-sm mx-4"
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <UserCircle className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1">プレイヤー名を入力</h2>
          <p className="text-sm text-gray-500">入力した名前はランキングに表示されます</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="プレイヤー名"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              maxLength={10}
              className={`h-12 text-lg ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <p className="text-xs text-gray-500 mt-1">※10文字まで</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-base"
          >
            決定
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}
