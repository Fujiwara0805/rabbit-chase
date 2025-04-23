"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  PopcornIcon as Poop, 
  X, 
  Medal, 
  Trophy,
  Calendar,
  Award
} from 'lucide-react';
import {
  RankingEntry,
  getTimeRanking,
  getDroppingRanking,
  formatTimeForRanking,
  formatDate,
  addTimeScore,
  addDroppingScore
} from '@/lib/services/ranking-service';
import { useGameStore } from '@/lib/store/game-store';

interface RankingScreenProps {
  onClose: () => void;
}

export default function RankingScreen({ onClose }: RankingScreenProps) {
  const [activeTab, setActiveTab] = useState<string>('time');
  const [timeRanking, setTimeRanking] = useState<RankingEntry[]>([]);
  const [droppingRanking, setDroppingRanking] = useState<RankingEntry[]>([]);
  const [timeRank, setTimeRank] = useState<number>(-1);
  const [droppingRank, setDroppingRank] = useState<number>(-1);
  
  const isVictory = useGameStore(state => state.isVictory);
  const droppingsCollected = useGameStore(state => state.droppingsCollected);
  const getElapsedTime = useGameStore(state => state.getElapsedTime);
  const playerName = useGameStore(state => state.playerName);
  
  useEffect(() => {
    // ランキングデータの読み込み
    setTimeRanking(getTimeRanking());
    setDroppingRanking(getDroppingRanking());
    
    // 勝利した場合のみスコア登録
    if (isVictory) {
      const time = getElapsedTime();
      const droppings = droppingsCollected;
      
      const newTimeRank = addTimeScore(playerName, time, droppings);
      const newDroppingRank = addDroppingScore(playerName, time, droppings);
      
      setTimeRank(newTimeRank);
      setDroppingRank(newDroppingRank);
      
      // 更新されたランキングを再読み込み
      setTimeRanking(getTimeRanking());
      setDroppingRanking(getDroppingRanking());
      
      // 自動的に良い方のランキングタブを表示
      if (newTimeRank >= 0 && newTimeRank < 3) {
        setActiveTab('time');
      } else if (newDroppingRank >= 0 && newDroppingRank < 3) {
        setActiveTab('droppings');
      }
    }
  }, [isVictory, getElapsedTime, droppingsCollected, playerName]);
  
  // メダルの色
  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0: return 'text-yellow-500';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-700';
      default: return 'text-gray-500';
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-[90vw] max-w-md mx-4 max-h-[85vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary" />
            ランキング
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
            <span className="sr-only">閉じる</span>
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="time" className="flex-1 flex gap-1 items-center justify-center">
              <Clock className="w-4 h-4 mr-1" />
              捕獲タイム
            </TabsTrigger>
            <TabsTrigger value="droppings" className="flex-1 flex gap-1 items-center justify-center">
              <Poop className="w-4 h-4 mr-1" />
              うんこ獲得
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="time" className="flex-1 overflow-y-auto data-[state=active]:flex-1">
            <AnimatePresence mode="wait">
              <div className="space-y-1">
                {timeRanking.length > 0 ? (
                  timeRanking.map((entry, index) => (
                    <motion.div
                      key={`time-${index}`}
                      className={`p-3 rounded-lg flex items-center ${index === timeRank ? 'bg-blue-50 border border-blue-200' : (index % 2 === 0 ? 'bg-gray-50' : 'bg-white')}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-center w-8">
                        {index < 3 ? (
                          <Medal className={`w-5 h-5 ${getMedalColor(index)}`} />
                        ) : (
                          <span className="text-gray-600 font-mono">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="ml-2 flex-1">
                        <div className="font-medium">{entry.playerName}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(entry.date)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="font-bold text-primary flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 opacity-70" />
                          {formatTimeForRanking(entry.time)}
                        </div>
                        <div className="text-xs text-amber-600 flex items-center">
                          <Poop className="w-3 h-3 mr-1 opacity-70" />
                          {entry.droppings}個
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>まだ記録がありません</p>
                  </div>
                )}
              </div>
            </AnimatePresence>
          </TabsContent>
          
          <TabsContent value="droppings" className="flex-1 overflow-y-auto data-[state=active]:flex-1">
            <AnimatePresence mode="wait">
              <div className="space-y-1">
                {droppingRanking.length > 0 ? (
                  droppingRanking.map((entry, index) => (
                    <motion.div
                      key={`dropping-${index}`}
                      className={`p-3 rounded-lg flex items-center ${index === droppingRank ? 'bg-amber-50 border border-amber-200' : (index % 2 === 0 ? 'bg-gray-50' : 'bg-white')}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-center w-8">
                        {index < 3 ? (
                          <Medal className={`w-5 h-5 ${getMedalColor(index)}`} />
                        ) : (
                          <span className="text-gray-600 font-mono">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="ml-2 flex-1">
                        <div className="font-medium">{entry.playerName}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(entry.date)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="font-bold text-amber-600 flex items-center">
                          <Poop className="w-3.5 h-3.5 mr-1 opacity-70" />
                          {entry.droppings}個
                        </div>
                        <div className="text-xs text-primary flex items-center">
                          <Clock className="w-3 h-3 mr-1 opacity-70" />
                          {formatTimeForRanking(entry.time)}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>まだ記録がありません</p>
                  </div>
                )}
              </div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-3 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClose}
          >
            閉じる
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
