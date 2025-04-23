"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useSound } from '@/lib/hooks/use-sound';

// コンテキストの型定義
type AudioContextType = ReturnType<typeof useSound> & {
  BGM_PATH: string; // 共通のBGMパスを追加
};

// Cloudinaryから直接音源URLを指定
// 例: "https://res.cloudinary.com/your-cloud-name/video/upload/v1234567890/rabbit-chase/audio/game-bgm.mp3"
// 実際のCloudinary URLに置き換えてください
const BGM_PATH = "https://res.cloudinary.com/dz9trbwma/video/upload/v1745405704/game-bgm_mamcs8.mp3";
const SFX_PATHS = {
  collectDropping: "https://res.cloudinary.com/dz9trbwma/video/upload/v1745405703/collect_v1fycv.mp3",
  gameOver: "https://res.cloudinary.com/dz9trbwma/video/upload/v1745405703/game-over_uoznsy.mp3",
  gameComplete: "https://res.cloudinary.com/dz9trbwma/video/upload/v1745405703/game-complete_vrwv0m.mp3"
};

// デフォルト値
const defaultContext: AudioContextType = {
  playSfx: () => {},
  playBgm: () => {},
  stopBgm: () => {},
  toggleBgm: () => {},
  toggleSound: () => {},
  isBgmPlaying: false,
  isSoundEnabled: true,
  BGM_PATH
};

// コンテキストの作成
const AudioContext = createContext<AudioContextType>(defaultContext);

// コンテキストのプロバイダー
export function AudioProvider({ children }: { children: ReactNode }) {
  const audioFunctions = useSound();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // ユーザーインタラクション後にオーディオを初期化
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!isInitialized) {
        setIsInitialized(true);
        
        // 事前にオーディオをプリロードしておく
        const preloadAudio = (src: string) => {
          const audio = new Audio();
          audio.src = src;
          audio.preload = 'auto';
        };
        
        // BGMと効果音をプリロード
        preloadAudio(BGM_PATH);
        Object.values(SFX_PATHS).forEach(preloadAudio);
        
        // イベントリスナーを削除
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isInitialized]);
  
  return (
    <AudioContext.Provider value={{ ...audioFunctions, BGM_PATH }}>
      {children}
    </AudioContext.Provider>
  );
}

// カスタムフック
export const useAudio = () => useContext(AudioContext);

// オーディオパスのエクスポート
export { SFX_PATHS };
