"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rabbit, RotateCcw, Trophy, Share2, Clock, PopcornIcon as Poop } from 'lucide-react';
import { useGameStore } from '@/lib/store/game-store';
import RankingScreen from '@/components/game/ranking-screen';

interface GameOverScreenProps {
  onRetry: () => void;
}

export default function GameOverScreen({ onRetry }: GameOverScreenProps) {
  const [showRanking, setShowRanking] = useState(false);
  const isVictory = useGameStore(state => state.isVictory);
  const droppingsCollected = useGameStore(state => state.droppingsCollected);
  const getElapsedTime = useGameStore(state => state.getElapsedTime);
  const resetGame = useGameStore(state => state.resetGame);
  
  // 経過時間を表示用にフォーマット (mm:ss)
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleRetry = () => {
    resetGame();
    onRetry();
  };
  
  const handleShowRanking = () => {
    setShowRanking(true);
  };
  
  return (
    <>
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 max-w-sm w-full mx-4"
          initial={{ scale: 0.8, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
        >
          <div className="flex justify-center mb-4 sm:mb-5">
            <div className={`rounded-full p-4 ${isVictory ? 'bg-green-100' : 'bg-red-100'}`}>
              <Rabbit size={32} className={`${isVictory ? 'text-green-600' : 'text-red-600'} sm:w-10 sm:h-10`} />
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4">
            {isVictory ? 'ウサギをつかまえた！' : 'タイムアップ！'}
          </h2>
          
          <div className="bg-gray-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-5 text-sm sm:text-base">
            {isVictory && (
              <div className="flex justify-between mb-2 items-center">
                <span className="text-gray-600 flex items-center">
                  <Clock className="mr-2 text-gray-500" size={20} />
                  捕まえるまでの時間
                </span>
                <span className="font-bold text-primary">{formatTime(getElapsedTime())}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <Poop className="mr-2 text-gray-500" size={20} />
                うんこの数
              </span>
              <span className="font-bold text-amber-600">{droppingsCollected}個</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90 gap-2"
              onClick={handleRetry}
            >
              <RotateCcw className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              もう一度遊ぶ
            </Button>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleShowRanking}
              >
                <Trophy className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                ランキング
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                シェア
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {showRanking && (
        <RankingScreen onClose={() => setShowRanking(false)} />
      )}
    </>
  );
}