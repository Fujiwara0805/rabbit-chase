"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TouchInteractiveZone } from '@/lib/hooks/use-touch-controls';

export default function GameControls() {
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);
  
  // Calculate the normalized direction vector for moving the player
  const direction = {
    x: joystickPosition.x / 50, // Normalize to a value between -1 and 1
    y: joystickPosition.y / 50  // Normalize to a value between -1 and 1
  };
  
  // Forward the movement direction to the touch controls handler
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('joystick-move', { 
      detail: { x: direction.x, y: direction.y } 
    }));
  }, [direction]);
  
  // Handle touch events for joystick
  const handleJoystickStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    const touch = e.touches[0];
    const joystickElement = e.currentTarget as HTMLDivElement;
    const rect = joystickElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    updateJoystickPosition(touch.clientX - centerX, touch.clientY - centerY);
  };
  
  const handleJoystickMove = (e: React.TouchEvent) => {
    if (!isTouching) return;
    
    const touch = e.touches[0];
    const joystickElement = e.currentTarget as HTMLDivElement;
    const rect = joystickElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    updateJoystickPosition(touch.clientX - centerX, touch.clientY - centerY);
  };
  
  const handleJoystickEnd = () => {
    setIsTouching(false);
    setJoystickPosition({ x: 0, y: 0 });
  };
  
  const updateJoystickPosition = (x: number, y: number) => {
    // Calculate distance from center
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 50; // Maximum joystick movement radius
    
    // If distance exceeds the max, normalize
    if (distance > maxDistance) {
      const angle = Math.atan2(y, x);
      x = Math.cos(angle) * maxDistance;
      y = Math.sin(angle) * maxDistance;
    }
    
    setJoystickPosition({ x, y });
  };
  
  return (
    <>
      {/* Virtual joystick for movement */}
      <TouchInteractiveZone>
        <motion.div 
          className="joystick-container"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.5 }}
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          onTouchCancel={handleJoystickEnd}
        >
          <div className="joystick-base">
            <motion.div 
              className="joystick-handle"
              animate={{ 
                x: joystickPosition.x, 
                y: joystickPosition.y,
                opacity: isTouching ? 1 : 0.7,
                scale: isTouching ? 1.1 : 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </div>
        </motion.div>
      </TouchInteractiveZone>
    </>
  );
}