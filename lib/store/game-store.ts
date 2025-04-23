import { create } from 'zustand';

export interface GameState {
  score: number;
  timeRemaining: number;
  rabbitsCaught: number;
  droppingsCollected: number;
  isGameActive: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  playerPosition: { x: number; z: number };
  rabbitPosition: { x: number; z: number };
  gameStartTime: number;
  playerName: string;
  
  // Actions
  startGame: () => void;
  endGame: (isVictory: boolean) => void;
  resetGame: () => void;
  updateTimeRemaining: (time: number) => void;
  addScore: (points: number) => void;
  collectDropping: () => void;
  catchRabbit: () => void;
  updatePlayerPosition: (x: number, z: number) => void;
  updateRabbitPosition: (x: number, z: number) => void;
  getElapsedTime: () => number;
  setPlayerName: (name: string) => void;
}

// ローカルストレージからプレイヤー名を取得
const getStoredPlayerName = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('rabbit-chase-player-name') || '';
  }
  return '';
};

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  timeRemaining: 60, // 60 seconds
  rabbitsCaught: 0,
  droppingsCollected: 0,
  isGameActive: false,
  isGameOver: false,
  isVictory: false,
  playerPosition: { x: 0, z: 0 },
  rabbitPosition: { x: 10, z: 10 },
  gameStartTime: 0,
  playerName: getStoredPlayerName(),
  
  startGame: () => set({ 
    isGameActive: true, 
    isGameOver: false,
    isVictory: false,
    timeRemaining: 60,
    gameStartTime: Date.now()
  }),
  
  endGame: (isVictory) => set({ 
    isGameActive: false, 
    isGameOver: true,
    isVictory 
  }),
  
  resetGame: () => set({ 
    score: 0,
    timeRemaining: 60,
    rabbitsCaught: 0,
    droppingsCollected: 0,
    isGameActive: false,
    isGameOver: false,
    isVictory: false,
    playerPosition: { x: 0, z: 0 },
    rabbitPosition: { x: 10, z: 10 },
    gameStartTime: 0
  }),
  
  updateTimeRemaining: (time) => set({ timeRemaining: time }),
  
  addScore: (points) => set((state) => ({ 
    score: state.score + points 
  })),
  
  collectDropping: () => set((state) => ({ 
    droppingsCollected: state.droppingsCollected + 1,
    timeRemaining: state.timeRemaining + 2 // +2 seconds bonus
  })),
  
  catchRabbit: () => set((state) => ({ 
    rabbitsCaught: state.rabbitsCaught + 1,
  })),
  
  updatePlayerPosition: (x, z) => set({ 
    playerPosition: { x, z } 
  }),
  
  updateRabbitPosition: (x, z) => set({
    rabbitPosition: { x, z }
  }),
  
  getElapsedTime: () => {
    const state = get();
    if (state.gameStartTime === 0) return 0;
    return Math.floor((Date.now() - state.gameStartTime) / 1000);
  },
  
  setPlayerName: (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rabbit-chase-player-name', name);
    }
    set({ playerName: name });
  }
}));