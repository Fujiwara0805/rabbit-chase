"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Instagram, Copy, X } from "lucide-react";
import { shareToSocial } from "@/lib/utils/share";
import { motion, AnimatePresence } from "framer-motion";

interface ShareDropdownProps {
  playerName: string;
  time: number;
  droppings: number;
  isVictory: boolean;
}

export default function ShareDropdown({ playerName, time, droppings, isVictory }: ShareDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const getShareText = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    if (isVictory) {
      return `${playerName}が「バニーチェイス」でウサギを捕まえました！タイム: ${formatTime(time)} うんこ獲得数: ${droppings}個 あなたも挑戦しよう！ ${baseUrl}`;
    } else {
      return `${playerName}が「バニーチェイス」でうんこを${droppings}個集めました！あなたも挑戦しよう！ ${baseUrl}`;
    }
  };
  
  const handleShare = (platform: 'twitter' | 'facebook' | 'line' | 'instagram') => {
    const text = getShareText();
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    
    shareToSocial(platform, {
      text,
      url
    });
    
    setIsOpen(false);
  };
  
  return (
    <div className="relative w-full">
      <Button 
        variant="outline" 
        className="gap-2 w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Share2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
        シェア
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 bottom-full mb-2 bg-white rounded-lg shadow-lg p-2 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="flex flex-col gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={() => handleShare('twitter')}
              >
                <X className="w-4 h-4" />
                <span>Xでシェア</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="w-4 h-4" />
                <span>Facebookでシェア</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={() => handleShare('instagram')}
              >
                <Instagram className="w-4 h-4" />
                <span>Instagramへコピー</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2"
                onClick={() => {
                  const text = getShareText();
                  navigator.clipboard.writeText(text);
                  alert('クリップボードにコピーしました');
                  setIsOpen(false);
                }}
              >
                <Copy className="w-4 h-4" />
                <span>テキストをコピー</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
