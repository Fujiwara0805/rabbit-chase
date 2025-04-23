"use client";

import { useState, useEffect } from 'react';
import React from 'react';

interface Direction {
  x: number;
  y: number;
}

export function useTouchControls() {
  const [moveDirection, setMoveDirection] = useState<Direction>({ x: 0, y: 0 });
  
  useEffect(() => {
    // Listen for joystick movement events from virtual controls
    const handleJoystickMove = (event: CustomEvent) => {
      setMoveDirection(event.detail as Direction);
    };
    
    // Add event listener
    window.addEventListener('joystick-move', handleJoystickMove as EventListener);
    
    // 矢印キー操作を改善（押しっぱなしを検出）
    const keysPressed = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      s: false,
      a: false,
      d: false
    };
    
    // キー入力の処理を統合する関数
    const updateDirectionFromKeys = () => {
      // 各方向の計算
      const y = (keysPressed.ArrowUp || keysPressed.w ? -1 : 0) + 
               (keysPressed.ArrowDown || keysPressed.s ? 1 : 0);
      const x = (keysPressed.ArrowLeft || keysPressed.a ? -1 : 0) + 
               (keysPressed.ArrowRight || keysPressed.d ? 1 : 0);
      
      // 斜め移動時の速度を正規化
      if (x !== 0 && y !== 0) {
        const factor = 0.7071; // 1/√2 ≈ 0.7071
        setMoveDirection({ x: x * factor, y: y * factor });
      } else {
        setMoveDirection({ x, y });
      }
    };
    
    // キーダウンイベントハンドラ
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key in keysPressed) {
        keysPressed[event.key as keyof typeof keysPressed] = true;
        updateDirectionFromKeys();
      }
    };
    
    // キーアップイベントハンドラ
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key in keysPressed) {
        keysPressed[event.key as keyof typeof keysPressed] = false;
        updateDirectionFromKeys();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // ウィンドウがフォーカスを失ったときに全てのキー入力をリセット
    const handleBlur = () => {
      Object.keys(keysPressed).forEach(key => {
        keysPressed[key as keyof typeof keysPressed] = false;
      });
      setMoveDirection({ x: 0, y: 0 });
    };
    
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('joystick-move', handleJoystickMove as EventListener);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
  
  return { moveDirection };
}

// Component to create an interactive touch zone
export const TouchInteractiveZone: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="touch-none">
      {children}
      {/* 操作ガイド - モバイル向け */}
      <div className="absolute bottom-32 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-xs pointer-events-none z-20 animate-pulse">
        スティックで移動
      </div>
    </div>
  );
};