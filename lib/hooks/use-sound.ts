"use client";

import { useEffect, useRef, useState } from 'react';

type SoundOptions = {
  volume?: number;
  loop?: boolean;
};

export function useSound() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [isSoundEnabled, setSoundEnabled] = useState(true);

  // 効果音を再生
  const playSfx = (src: string, options: SoundOptions = {}) => {
    if (!isSoundEnabled) return;
    
    try {
      // 既存のオーディオ要素を再利用して初期化の問題を軽減
      if (!sfxRef.current) {
        sfxRef.current = new Audio();
      }
      
      // 新しいソースを設定
      sfxRef.current.src = src;
      sfxRef.current.volume = options.volume ?? 0.5;
      sfxRef.current.loop = options.loop ?? false;

      // モバイルデバイスでの再生問題に対応するため、Promise処理を適切に行う
      const playPromise = sfxRef.current.play();
      
      // play()はPromiseを返すため、適切に処理
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // 再生成功
            console.log('効果音の再生に成功しました');
          })
          .catch(err => {
            // 再生失敗 - おそらくユーザーインタラクションがない
            console.error('効果音の再生に失敗しました:', err);
            
            // 自動再生ポリシーへの対応
            // 再生に失敗した場合は、ユーザーインタラクションを待つためのフラグなどを設定できる
          });
      }
    } catch (err) {
      console.error('効果音の再生中にエラーが発生しました:', err);
    }
  };

  // BGMを再生
  const playBgm = (src: string, options: SoundOptions = {}) => {
    if (!isSoundEnabled) return;
    
    if (!bgmRef.current) {
      bgmRef.current = new Audio(src);
    } else {
      bgmRef.current.src = src;
    }
    
    bgmRef.current.loop = options.loop ?? true;
    bgmRef.current.volume = options.volume ?? 0.3;
    
    bgmRef.current.play().then(() => {
      setIsBgmPlaying(true);
    }).catch(err => {
      console.error('BGMの再生に失敗しました:', err);
      setIsBgmPlaying(false);
    });
  };

  // BGMを停止
  const stopBgm = () => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
      setIsBgmPlaying(false);
    }
  };

  // BGMの一時停止/再開
  const toggleBgm = () => {
    if (bgmRef.current) {
      if (bgmRef.current.paused) {
        bgmRef.current.play().then(() => {
          setIsBgmPlaying(true);
        }).catch(console.error);
      } else {
        bgmRef.current.pause();
        setIsBgmPlaying(false);
      }
    }
  };

  // サウンド全体の有効/無効の切り替え
  const toggleSound = () => {
    setSoundEnabled(!isSoundEnabled);
    
    if (!isSoundEnabled) {
      // サウンドを有効にする場合、BGMを再開
      if (bgmRef.current && isBgmPlaying) {
        bgmRef.current.play().catch(console.error);
      }
    } else {
      // サウンドを無効にする場合、BGMを一時停止
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
    }
  };

  // コンポーネントのアンマウント時にオーディオリソースをクリーンアップ
  useEffect(() => {
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  return {
    playSfx,
    playBgm,
    stopBgm,
    toggleBgm,
    toggleSound,
    isBgmPlaying,
    isSoundEnabled
  };
}
