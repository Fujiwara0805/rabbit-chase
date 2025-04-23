"use client";

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useGameStore } from '@/lib/store/game-store';

interface RabbitProps {
  position: [number, number, number];
  onMove: (x: number, z: number) => void;
}

export default function Rabbit({ position, onMove }: RabbitProps) {
  const rabbitRef = useRef<THREE.Group>(null);
  const rigidBody = useRef(null);
  const playerPosition = useGameStore(state => state.playerPosition);
  
  // AI state
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3());
  const [aiTimer, setAiTimer] = useState(0);
  const [isEscaping, setIsEscaping] = useState(false);
  
  // Update AI behavior
  useFrame((_, delta) => {
    if (!rigidBody.current || !rabbitRef.current) return;
    
    // Update AI timer
    setAiTimer(prev => prev + delta);
    
    // Calculate distance to player
    const distToPlayer = Math.sqrt(
      Math.pow(position[0] - playerPosition.x, 2) +
      Math.pow(position[2] - playerPosition.z, 2)
    );
    
    // Rabbit AI logic
    const rbody = rigidBody.current as any;
    const currentPosition = new THREE.Vector3(position[0], position[1], position[2]);
    
    // Check if rabbit needs to choose a new target
    if (aiTimer > 3 || (isEscaping && distToPlayer > 8)) {
      // Pick a new random target within the play area
      const maxBounds = 13; // Keep away from walls
      const randomX = (Math.random() - 0.5) * 2 * maxBounds;
      const randomZ = (Math.random() - 0.5) * 2 * maxBounds;
      setTargetPosition(new THREE.Vector3(randomX, 0, randomZ));
      setAiTimer(0);
      setIsEscaping(false);
    }
    
    // Escape from player if too close
    if (distToPlayer < 5 && !isEscaping) {
      // Set target position away from player
      const escapeVector = new THREE.Vector3(
        position[0] - playerPosition.x,
        0,
        position[2] - playerPosition.z
      ).normalize().multiplyScalar(10);
      
      setTargetPosition(new THREE.Vector3(
        position[0] + escapeVector.x,
        0,
        position[2] + escapeVector.z
      ));
      
      setIsEscaping(true);
      setAiTimer(0);
    }
    
    // Move towards target
    const direction = new THREE.Vector3().subVectors(targetPosition, currentPosition).normalize();
    const speed = isEscaping ? 0.12 : 0.07; // Faster when escaping
    
    // Clamp position within bounds
    const maxBounds = 14;
    const clampedX = Math.max(-maxBounds, Math.min(maxBounds, position[0] + direction.x * speed));
    const clampedZ = Math.max(-maxBounds, Math.min(maxBounds, position[2] + direction.z * speed));
    
    const newPos = new THREE.Vector3(
      clampedX,
      position[1],
      clampedZ
    );
    
    // Calculate rotation angle
    let angle = 0;
    if (direction.length() > 0.1) {
      angle = Math.atan2(direction.x, direction.z);
    }
    
    // Update position and rotation
    rbody.setTranslation(newPos, true);
    rbody.setRotation({ x: 0, y: angle, z: 0 }, true);
    
    // Notify parent of position change
    onMove(newPos.x, newPos.z);
  });
  
  return (
    <RigidBody ref={rigidBody} type="dynamic" colliders="ball" position={position}>
      <group ref={rabbitRef}>
        {/* Box-shaped body */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#D2691E" /> {/* Caramel color */}
        </mesh>
        
        {/* Rabbit head */}
        <mesh castShadow position={[0, 0.6, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#D2691E" /> {/* Caramel color */}
        </mesh>
        
        {/* Rabbit ears */}
        <mesh castShadow position={[0.1, 0.9, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#DEB887" /> {/* Lighter caramel for ears */}
        </mesh>
        
        <mesh castShadow position={[-0.1, 0.9, 0]}>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#DEB887" /> {/* Lighter caramel for ears */}
        </mesh>
        
        {/* Rabbit tail */}
        <mesh castShadow position={[0, 0.2, -0.3]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#F5DEB3" /> {/* Wheat color for tail */}
        </mesh>
      </group>
    </RigidBody>
  );
}