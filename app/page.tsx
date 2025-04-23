"use client";

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import GameTitle from '@/components/game/game-title';
import LoadingScreen from '@/components/game/loading-screen';
import { useGameStore } from '@/lib/store/game-store';

// Dynamically import GameScreen with SSR disabled to prevent hydration issues
const GameScreen = dynamic(() => import('@/components/game/game-screen'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <LoadingScreen />
    </div>
  ),
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const resetGame = useGameStore(state => state.resetGame);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Reset game state on initial load
    resetGame();
    
    return () => clearTimeout(timer);
  }, [resetGame]);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-neutral-800 to-neutral-900">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : !gameStarted ? (
          <GameTitle key="title" onStartGame={handleStartGame} />
        ) : (
          <GameScreen key="game" onGameEnd={() => setGameStarted(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}