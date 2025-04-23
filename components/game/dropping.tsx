"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DroppingProps {
  position: [number, number, number];
}

export default function Dropping({ position }: DroppingProps) {
  const droppingRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Animate the dropping to bounce and pulse
  useFrame(({ clock }) => {
    if (!droppingRef.current) return;
    
    // Enhanced bounce effect
    const bounce = Math.sin(clock.getElapsedTime() * 3) * 0.1;
    droppingRef.current.position.y = 0.3 + bounce;
    
    // Rotate slightly
    droppingRef.current.rotation.y += 0.01;
    
    // Pulsing glow effect
    if (glowRef.current) {
      const pulseScale = 0.8 + Math.sin(clock.getElapsedTime() * 4) * 0.2;
      glowRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      
      // Change opacity for pulsing effect
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 4) * 0.3;
    }
  });
  
  return (
    <group position={position}>
      {/* 目立つように上下するうんこ */}
      <group ref={droppingRef}>
        {/* Main dropping shape - サイズアップ */}
        <mesh castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color="#663300"
            roughness={0.7}
            metalness={0.2}
            emissive="#331A00"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Small details to make it look more like a dropping */}
        <mesh castShadow position={[0.15, 0.05, 0]}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#502900" roughness={0.7} />
        </mesh>
        
        <mesh castShadow position={[-0.15, 0.02, 0]}>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color="#502900" roughness={0.7} />
        </mesh>
        
        {/* Enhance the glow effect */}
        <pointLight
          color="#FFDD33"
          intensity={1.5}
          distance={4}
          decay={2}
        />
        
        {/* 目立つ光のオーラエフェクト */}
        <mesh ref={glowRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial 
            color="#FFDD33" 
            transparent={true} 
            opacity={0.5}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* 目立つ上向き矢印 */}
        <mesh position={[0, 0.7, 0]}>
          <coneGeometry args={[0.15, 0.3, 8]} />
          <meshBasicMaterial color="#FFDD33" />
        </mesh>
      </group>
      
      {/* 地面に影を落とす */}
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <shadowMaterial opacity={0.5} />
      </mesh>
    </group>
  );
}