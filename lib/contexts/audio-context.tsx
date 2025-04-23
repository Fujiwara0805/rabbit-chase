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
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  // WebAudioAPI の初期化とユーザーインタラクション後の自動再生ポリシー対応
  useEffect(() => {
    // ユーザーインタラクション時に音声を有効化するヘルパー関数
    const unlockAudio = () => {
      if (!isInitialized) {
        setIsInitialized(true);
        
        // WebAudioAPI のコンテキスト作成（モバイルブラウザ対応）
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!audioContext && AudioContextClass) {
            const newContext = new AudioContextClass();
            setAudioContext(newContext);
            
            // サイレントバッファを再生して自動再生ポリシーをロック解除
            const buffer = newContext.createBuffer(1, 1, 22050);
            const source = newContext.createBufferSource();
            source.buffer = buffer;
            source.connect(newContext.destination);
            source.start(0);
            
            console.log('Audio context initialized successfully');
          }
        } catch (e) {
          console.error('WebAudio API initialization failed:', e);
        }
        
        // 事前にオーディオをプリロードしておく
        const preloadAudio = (src: string) => {
          const audio = new Audio();
          audio.src = src;
          audio.preload = 'auto';
          
          // モバイルデバイス向けにタッチ後に一度再生を試みる
          // （ボリュームを0にして非可聴状態で）
          audio.volume = 0;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Success - immediately pause to keep it silent
                audio.pause();
                audio.volume = 1.0; // Restore volume for later actual playback
              })
              .catch(e => {
                console.log('Preload play attempt failed (expected):', e);
              });
          }
        };
        
        // BGMと効果音をプリロード
        preloadAudio(BGM_PATH);
        Object.values(SFX_PATHS).forEach(preloadAudio);
        
        // イベントリスナーを削除
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('touchend', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
      }
    };
    
    // タッチイベントを特に重視（スマホ向け）
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('touchend', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    
    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('touchend', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
    };
  }, [isInitialized, audioContext]);
  
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
