"use client";

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useTouchControls } from '@/lib/hooks/use-touch-controls';
import { useGameStore } from '@/lib/store/game-store';

interface PlayerProps {
  position: [number, number, number];
  onMove: (x: number, z: number) => void;
}

// 操作ガイド用の別コンポーネント（game-canvas.tsxで使用）
export function ControlsGuide() {
  const isGameActive = useGameStore(state => state.isGameActive);
  const [showControls, setShowControls] = useState(true);

  // ゲームがアクティブになって3秒後に操作ガイドを非表示にする
  useEffect(() => {
    if (isGameActive) {
      // ゲームが開始されたら3秒後に消す
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      // ゲームが非アクティブになったら再表示する
      setShowControls(true);
    }
  }, [isGameActive]);

  if (!showControls) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black/70 text-white p-2 sm:p-4 rounded-lg text-center max-w-[90vw] sm:max-w-md">
      <p className="text-base sm:text-lg font-bold mb-1 sm:mb-2">操作方法</p>
      <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs sm:text-sm">
        <p className="flex items-center justify-center">
          <span className="inline-block w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full mr-2 flex items-center justify-center">↑</span>
          <span>上に移動</span>
        </p>
        <p className="flex items-center justify-center">
          <span className="inline-block w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full mr-2 flex items-center justify-center">↓</span>
          <span>下に移動</span>
        </p>
        <p className="flex items-center justify-center">
          <span className="inline-block w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full mr-2 flex items-center justify-center">←</span>
          <span>左に移動</span>
        </p>
        <p className="flex items-center justify-center">
          <span className="inline-block w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full mr-2 flex items-center justify-center">→</span>
          <span>右に移動</span>
        </p>
      </div>
      <p className="text-xs sm:text-sm text-yellow-300 mt-1 sm:mt-2">タッチ操作：左下のスティックで移動</p>
    </div>
  );
}

export default function Player({ position, onMove }: PlayerProps) {
  const group = useRef<THREE.Group>(null);
  const rigidBody = useRef(null);
  const { moveDirection } = useTouchControls();
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const isGameActive = useGameStore(state => state.isGameActive);
  const isGameOver = useGameStore(state => state.isGameOver);
  
  // 向きを記憶する変数
  const lastDirection = useRef({ x: 0, z: 1 });
  
  useFrame(() => {
    if (!rigidBody.current) return;
    
    // ゲームが終了したら画面中央に戻る
    if (isGameOver) {
      const rbody = rigidBody.current as any;
      const centerPos = new THREE.Vector3(0, position[1], 0);
      rbody.setTranslation(centerPos, true);
      onMove(0, 0);
      return;
    }
    
    // ゲームがアクティブではない場合は動かさない
    if (!isGameActive) return;
    
    // Clamp position within bounds
    const maxBounds = 14; // Slightly less than wall distance
    const clampedX = Math.max(-maxBounds, Math.min(maxBounds, position[0]));
    const clampedZ = Math.max(-maxBounds, Math.min(maxBounds, position[2]));
    
    // 矢印キーとプレイヤーの動きを一致させる
    // x: 左右の移動、y: 上下の移動に対応
    const speed = 0.075; // うさぎの1/2の速度
    const newPos = new THREE.Vector3(
      clampedX + moveDirection.x * speed, // 左右移動
      position[1],
      clampedZ + moveDirection.y * speed  // 上下移動
    );
    
    // 移動方向が有意な場合のみ向きを更新
    if (Math.abs(moveDirection.x) > 0.1 || Math.abs(moveDirection.y) > 0.1) {
      lastDirection.current = {
        x: moveDirection.x,
        z: moveDirection.y
      };
    }
    
    // Update position
    const rbody = rigidBody.current as any;
    rbody.setTranslation(newPos, true);
    
    // 体は移動方向に向ける（頭は固定）
    if (bodyRef.current && Math.abs(lastDirection.current.x) + Math.abs(lastDirection.current.z) > 0.1) {
      const angle = Math.atan2(lastDirection.current.x, lastDirection.current.z);
      bodyRef.current.rotation.y = angle;
    }
    
    // Notify store of position change
    onMove(newPos.x, newPos.z);
  });
  
  return (
    <RigidBody ref={rigidBody} type="dynamic" colliders="ball" position={position}>
      <group ref={group}>
        {/* Box-shaped body - 回転するようにbodyRefを割り当て */}
        <mesh ref={bodyRef} castShadow>
          <boxGeometry args={[1, 1.5, 1]} />
          <meshStandardMaterial color="#1B8A4C" /> {/* Forest green for better visibility */}
        </mesh>
        
        {/* Player head - 回転しない */}
        <mesh ref={headRef} castShadow position={[0, 1.1, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial color="#FFE4B5" /> {/* Moccasin color for better contrast */}
        </mesh>
        
        {/* Backpack for depth perception - bodyに含める */}
        <mesh castShadow position={[0, 0.7, -0.4]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.3]} />
          <meshStandardMaterial color="#4A5D23" /> {/* Darker green for the backpack */}
        </mesh>
      </group>
    </RigidBody>
  );
}