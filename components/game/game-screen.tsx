"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GameCanvas from '@/components/game/game-canvas';
import GameHUD from '@/components/game/game-hud';
import GameControls from '@/components/game/game-controls';
import GameOverScreen from '@/components/game/game-over-screen';
import { useGameStore } from '@/lib/store/game-store';

interface GameScreenProps {
  onGameEnd: () => void;
}

export default function GameScreen({ onGameEnd }: GameScreenProps) {
  const isGameActive = useGameStore(state => state.isGameActive);
  const isGameOver = useGameStore(state => state.isGameOver);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const updateTimeRemaining = useGameStore(state => state.updateTimeRemaining);
  const endGame = useGameStore(state => state.endGame);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isGameActive && !isGameOver) {
      // Start the countdown timer
      timerRef.current = setInterval(() => {
        updateTimeRemaining(timeRemaining - 1);
        
        // Check if time is up
        if (timeRemaining <= 1) {
          clearInterval(timerRef.current!);
          endGame(false); // Game over due to time up
        }
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameActive, isGameOver, timeRemaining, updateTimeRemaining, endGame]);
  
  return (
    <motion.div 
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 3D Game Canvas */}
      <GameCanvas />
      
      {/* Game HUD - Timer, Score, etc. */}
      <GameHUD />
      
      {/* Mobile Controls */}
      <GameControls />
      
      {/* Game Over Screen */}
      {isGameOver && (
        <GameOverScreen onRetry={() => onGameEnd()} />
      )}
    </motion.div>
  );
}