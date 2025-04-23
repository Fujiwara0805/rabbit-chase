"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rabbit, Play, Trophy } from 'lucide-react';
import { useGameStore } from '@/lib/store/game-store';
import HowToPlay from './how-to-play';
import PlayerNameModal from './player-name-modal';
import RankingScreen from './ranking-screen';
import { useAudio } from '@/lib/contexts/audio-context';

interface GameTitleProps {
  onStartGame: () => void;
}

export default function GameTitle({ onStartGame }: GameTitleProps) {
  const startGame = useGameStore(state => state.startGame);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const { playBgm, stopBgm, BGM_PATH } = useAudio();
  
  const handleStartClick = () => {
    setShowNameModal(true);
  };
  
  const handleNameSubmit = () => {
    setShowNameModal(false);
    startGame();
    onStartGame();
  };
  
  const handleShowRanking = () => {
    setShowRanking(true);
  };
  
  useEffect(() => {
    playBgm(BGM_PATH, { volume: 0.3, loop: true });
    
    return () => {
      // タイトル画面からゲーム画面に移行する際はBGMを停止せず継続させるため、
      // ここでstopBgmを呼び出さない
    };
  }, [playBgm, BGM_PATH]);
  
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-primary/90 to-primary z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.div
        className="mb-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.2
        }}
      >
        <div className="bg-white p-6 rounded-full">
          <Rabbit className="w-12 h-12 sm:w-[60px] sm:h-[60px] text-primary" />
        </div>
      </motion.div>
      
      <motion.div
        className="text-center mb-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-2">バニーチェイス</h1>
        <p className="text-white/80 text-lg sm:text-xl">ウサギを捕まえろ！</p>
      </motion.div>
      
      <motion.div 
        className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-xs px-4 sm:px-0"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button 
          className="w-full h-12 sm:h-14 text-base sm:text-lg gap-2 bg-red-600 hover:bg-red-700 text-white"
          onClick={handleStartClick}
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6" />
          ゲームスタート
        </Button>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
          <Button 
            variant="outline" 
            className="bg-yellow-500/80 backdrop-blur-sm text-white border-yellow-500/40 hover:bg-yellow-500/90"
            onClick={handleShowRanking}
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            ランキング
          </Button>
          <HowToPlay />
        </div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-2 sm:bottom-4 text-white/60 text-xs sm:text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        © 2025 Bunny Chase Game
      </motion.div>
      
      <AnimatePresence>
        {showNameModal && (
          <PlayerNameModal onSubmit={handleNameSubmit} />
        )}
        
        {showRanking && (
          <RankingScreen onClose={() => setShowRanking(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}