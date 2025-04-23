"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useGameStore } from '@/lib/store/game-store';
import { useAudio, SFX_PATHS } from '@/lib/contexts/audio-context';

// Dynamically import game components to prevent SSR issues
const MedievalTown = dynamic(() => import('@/components/game/medieval-town'), { ssr: false });
const Player = dynamic(() => import('@/components/game/player'), { ssr: false });
const Rabbit = dynamic(() => import('@/components/game/rabbit'), { ssr: false });
const Dropping = dynamic(() => import('@/components/game/dropping'), { ssr: false });
// 操作ガイドをインポート
const ControlsGuide = dynamic(() => import('@/components/game/player').then(mod => mod.ControlsGuide), { ssr: false });

export default function GameCanvas() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Simulate asset loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isMounted || !isLoaded) return null;
  
  return (
    <div className="canvas-container">
      {/* 操作ガイドをCanvasの外に配置 */}
      <ControlsGuide />
      {/* キーボード操作ガイドは削除 */}
      <Canvas shadows>
        <GameScene />
      </Canvas>
    </div>
  );
}

function GameScene() {
  const playerPosition = useGameStore(state => state.playerPosition);
  const updatePlayerPosition = useGameStore(state => state.updatePlayerPosition);
  const updateRabbitPosition = useGameStore(state => state.updateRabbitPosition);
  const isGameActive = useGameStore(state => state.isGameActive);
  const catchRabbit = useGameStore(state => state.catchRabbit);
  const collectDropping = useGameStore(state => state.collectDropping);
  const endGame = useGameStore(state => state.endGame);
  const isGameOver = useGameStore(state => state.isGameOver);
  
  // Track rabbit position and dropping positions
  const [rabbitPosition, setRabbitPosition] = useState({ x: 10, z: 10 });
  const [droppings, setDroppings] = useState<Array<{id: number, x: number, z: number}>>([]);
  const nextDroppingId = useRef(1);
  const lastDroppingTime = useRef(0);
  
  const { playSfx, playBgm, stopBgm, BGM_PATH, isBgmPlaying } = useAudio();
  
  // デバッグ用：初期状態でうんこを追加
  useEffect(() => {
    // 初期状態でいくつかのうんこを追加
    if (droppings.length === 0) {
      const initialDroppings = [
        { id: 1000, x: 5, z: 5 },
        { id: 1001, x: -5, z: 5 },
        { id: 1002, x: 0, z: -5 }
      ];
      setDroppings(initialDroppings);
      nextDroppingId.current = 1003;
    }
  }, [droppings.length]);
  
  // Create a new dropping every 5 seconds along rabbit's path
  useFrame((_, delta) => {
    if (!isGameActive) return;
    
    lastDroppingTime.current += delta;
    
    if (lastDroppingTime.current >= 5) { // 5秒ごとにうんこを生成
      // Add a new dropping at the rabbit's current position
      setDroppings(prev => [...prev, {
        id: nextDroppingId.current,
        x: rabbitPosition.x,
        z: rabbitPosition.z
      }]);
      
      nextDroppingId.current += 1;
      lastDroppingTime.current = 0; // Reset timer
    }
  });
  
  // ゲーム開始時にBGMを確認（タイトル画面から継続している可能性があるため）
  useEffect(() => {
    if (isGameActive && !isGameOver && !isBgmPlaying) {
      // BGMが再生されていない場合のみ再生開始
      playBgm(BGM_PATH, { volume: 0.3, loop: true });
    } else if (isGameOver) {
      // ゲームオーバー時はBGMを停止
      stopBgm();
    }
    
    return () => {
      // コンポーネントのアンマウント時にBGMを停止
      stopBgm();
    };
  }, [isGameActive, isGameOver, playBgm, stopBgm, BGM_PATH, isBgmPlaying]);
  
  // うんこ獲得時の効果音再生部分
  useEffect(() => {
    if (!isGameActive) return;
    
    // Check for dropping collection - うんこ獲得時に効果音を再生
    setDroppings(prev => {
      const remainingDroppings = prev.filter(dropping => {
        const playerDroppingDist = Math.sqrt(
          Math.pow(playerPosition.x - dropping.x, 2) + 
          Math.pow(playerPosition.z - dropping.z, 2)
        );
        
        if (playerDroppingDist < 1) {
          collectDropping();
          // モバイル対応: タッチした場合のユーザーインタラクションとして効果音を再生
          try {
            playSfx(SFX_PATHS.collectDropping, { volume: 0.7 });
          } catch (err) {
            console.error('うんこ獲得音の再生に失敗:', err);
          }
          return false; // Remove this dropping
        }
        return true; // Keep this dropping
      });
      
      return remainingDroppings;
    });
    
    // 勝利時の処理（ウサギ捕獲）
    const playerRabbitDist = Math.sqrt(
      Math.pow(playerPosition.x - rabbitPosition.x, 2) + 
      Math.pow(playerPosition.z - rabbitPosition.z, 2)
    );
    
    if (playerRabbitDist < 1.5) {
      catchRabbit();
      endGame(true); // Victory!
      stopBgm(); // BGMを停止
      // Victory音はゲームオーバー画面で再生
    }
  }, [
    isGameActive, 
    playerPosition, 
    rabbitPosition, 
    catchRabbit, 
    collectDropping, 
    endGame,
    playSfx,
    stopBgm
  ]);
  
  // Update rabbit position based on AI movement
  const handleRabbitMove = (x: number, z: number) => {
    setRabbitPosition({ x, z });
    updateRabbitPosition(x, z);
  };
  
  // コンソールでうんこの数を表示（デバッグ用）
  console.log("Current droppings:", droppings.length, droppings);
  
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 10, 10]} />
      <CameraFollower />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[10, 10, 10]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
      />
      <Environment preset="city" />
      
      {/* Physics world */}
      <Physics debug={false}>
        {/* Medieval town environment */}
        <MedievalTown />
        
        {/* Player character */}
        <Player 
          position={[playerPosition.x, 0, playerPosition.z]} 
          onMove={updatePlayerPosition} 
        />
        
        {/* Rabbit */}
        <Rabbit 
          position={[rabbitPosition.x, 0, rabbitPosition.z]} 
          onMove={handleRabbitMove}
        />
        
        {/* Droppings - うんこの表示 */}
        {droppings.map(dropping => (
          <Dropping 
            key={dropping.id} 
            position={[dropping.x, 0, dropping.z]} 
          />
        ))}
      </Physics>
      
      {/* Controls */}
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

function CameraFollower() {
  const { camera } = useThree();
  const playerPosition = useGameStore(state => state.playerPosition);
  
  useFrame(() => {
    // Camera follows the player with some offset
    camera.position.x = playerPosition.x;
    camera.position.z = playerPosition.z + 8;
    camera.position.y = 5;
    camera.lookAt(playerPosition.x, 0, playerPosition.z);
  });
  
  return null;
}