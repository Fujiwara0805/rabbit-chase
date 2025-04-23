"use client";

import { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

export default function MedievalTown() {
  // In a full implementation, you would load detailed 3D models
  // Here we're creating a simple environment with primitives
  
  return (
    <group>
      {/* Ground plane */}
      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#90B974" /> {/* Bright grass color */}
        </mesh>
      </RigidBody>
      
      {/* Create simple buildings */}
      {/* Residential area */}
      <Building position={[5, 0, 5]} scale={[2, 3, 2]} color="#F5E6D3" />
      <Building position={[-6, 0, 3]} scale={[2, 2, 2]} color="#E6D5C3" />
      <Building position={[7, 0, -4]} scale={[2, 4, 3]} color="#F2D9C7" />
      <Building position={[-5, 0, -6]} scale={[3, 2, 2]} color="#DEC8B5" />
      <Building position={[3, 0, -8]} scale={[2, 2.5, 2]} color="#F5E6D3" />
      <Building position={[-8, 0, -2]} scale={[2.5, 3, 2]} color="#E6D5C3" />
      <Building position={[9, 0, 2]} scale={[2, 2, 2]} color="#F2D9C7" />
      <Building position={[-3, 0, 8]} scale={[2, 3, 2]} color="#DEC8B5" />
      
      {/* Park and nature elements */}
      <Park />
      <River />
      
      {/* Castle wall (boundary) */}
      <CastleWall />
    </group>
  );
}

function Park() {
  return (
    <group position={[0, 0, 0]}>
      {/* Park ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#A7D49B" />
      </mesh>
      
      {/* Trees */}
      {Array.from({ length: 8 }).map((_, i) => (
        <RigidBody key={i} type="fixed" position={[
          (i % 4 - 1.5) * 3,
          0,
          (Math.floor(i / 4) - 1) * 3
        ]}>
          {/* Tree trunk */}
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 1.5]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Tree crown */}
          <mesh position={[0, 1.8, 0]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#2D5A27" />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}

function River() {
  return (
    <group position={[10, 0.1, 0]}>
      {/* River bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 30]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      {/* River banks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.2, 0, 0]}>
        <planeGeometry args={[0.5, 30]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.2, 0, 0]}>
        <planeGeometry args={[0.5, 30]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
    </group>
  );
}

function Building({ position, scale, color }: { 
  position: [number, number, number]; 
  scale: [number, number, number];
  color: string;
}) {
  return (
    <RigidBody type="fixed" position={position}>
      <group>
        {/* Main building */}
        <mesh castShadow position={[0, scale[1] / 2, 0]}>
          <boxGeometry args={[scale[0], scale[1], scale[2]]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Roof */}
        <mesh castShadow position={[0, scale[1] + 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[Math.max(scale[0], scale[2]) / 1.5, 1, 4]} />
          <meshStandardMaterial color="#8B4513" /> {/* Dark brown */}
        </mesh>
        
        {/* Door */}
        <mesh position={[0, 0.6, scale[2] / 2 + 0.01]}>
          <planeGeometry args={[0.6, 1.2]} />
          <meshStandardMaterial color="#4E3B31" /> {/* Dark wood */}
        </mesh>
        
        {/* Windows */}
        <mesh position={[scale[0] / 3, scale[1] / 2, scale[2] / 2 + 0.01]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshStandardMaterial color="#ADD8E6" /> {/* Light blue */}
        </mesh>
        
        <mesh position={[-scale[0] / 3, scale[1] / 2, scale[2] / 2 + 0.01]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshStandardMaterial color="#ADD8E6" /> {/* Light blue */}
        </mesh>
      </group>
    </RigidBody>
  );
}

function StonePath() {
  return (
    <group position={[0, 0.01, 0]}>
      {/* Create a stone path pattern */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[
          (i % 5) * 2 - 4,
          0,
          Math.floor(i / 5) * 2 - 4
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.8, 1.8]} />
          <meshStandardMaterial color="#808080" /> {/* Gray stone */}
        </mesh>
      ))}
    </group>
  );
}

function CastleWall() {
  return (
    <RigidBody type="fixed">
      <group>
        {/* Outer walls to contain the play area */}
        {/* North wall */}
        <mesh castShadow position={[0, 1.5, -15]} scale={[30, 3, 1]}>
          <boxGeometry />
          <meshStandardMaterial color="#696969" /> {/* Dark gray */}
        </mesh>
        
        {/* South wall */}
        <mesh castShadow position={[0, 1.5, 15]} scale={[30, 3, 1]}>
          <boxGeometry />
          <meshStandardMaterial color="#696969" />
        </mesh>
        
        {/* East wall */}
        <mesh castShadow position={[15, 1.5, 0]} scale={[1, 3, 30]}>
          <boxGeometry />
          <meshStandardMaterial color="#696969" />
        </mesh>
        
        {/* West wall */}
        <mesh castShadow position={[-15, 1.5, 0]} scale={[1, 3, 30]}>
          <boxGeometry />
          <meshStandardMaterial color="#696969" />
        </mesh>
      </group>
    </RigidBody>
  );
}