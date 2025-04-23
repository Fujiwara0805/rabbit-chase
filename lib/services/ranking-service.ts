"use client";

// ランキングの型定義
export interface RankingEntry {
  playerName: string;
  time: number; // 捕まえるまでの秒数
  droppings: number; // 獲得したうんこの数
  date: string; // 記録した日付（ISO文字列）
}

// ローカルストレージのキー
const TIME_RANKING_KEY = 'rabbit-chase-time-ranking';
const DROPPING_RANKING_KEY = 'rabbit-chase-dropping-ranking';


// ランキングデータの取得
export const getTimeRanking = (): RankingEntry[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(TIME_RANKING_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load time ranking:', error);
    return [];
  }
};

export const getDroppingRanking = (): RankingEntry[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(DROPPING_RANKING_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load dropping ranking:', error);
    return [];
  }
};

// ランキングデータの保存
export const saveTimeRanking = (ranking: RankingEntry[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TIME_RANKING_KEY, JSON.stringify(ranking));
  } catch (error) {
    console.error('Failed to save time ranking:', error);
  }
};

export const saveDroppingRanking = (ranking: RankingEntry[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(DROPPING_RANKING_KEY, JSON.stringify(ranking));
  } catch (error) {
    console.error('Failed to save dropping ranking:', error);
  }
};

// 新しいスコアの追加と順位の決定
export const addTimeScore = (playerName: string, time: number, droppings: number): number => {
  if (!time) return -1; // スコアがない場合は追加しない
  
  const name = playerName || 'ゲスト';
  const ranking = getTimeRanking();
  
  // 日付を現在に設定
  const newEntry: RankingEntry = {
    playerName: name,
    time,
    droppings,
    date: new Date().toISOString()
  };
  
  // 同じプレイヤー名の場合は最新のスコアのみ保持
  let existingEntryIndex = -1;
  
  // 既存のエントリーを探す
  for (let i = 0; i < ranking.length; i++) {
    if (ranking[i].playerName === name) {
      existingEntryIndex = i;
      break;
    }
  }
  
  // 既存のエントリーがある場合は削除
  if (existingEntryIndex >= 0) {
    ranking.splice(existingEntryIndex, 1);
  }
  
  // 新しいランキングを作成
  const newRanking = [...ranking, newEntry].sort((a, b) => a.time - b.time);
  
  // 最大5件に制限
  const trimmedRanking = newRanking.slice(0, 5);
  saveTimeRanking(trimmedRanking);
  
  // 順位を返す（0-indexed）
  return trimmedRanking.findIndex(entry => entry === newEntry);
};

export const addDroppingScore = (playerName: string, time: number, droppings: number): number => {
  if (!droppings) return -1; // スコアがない場合は追加しない
  
  const name = playerName || 'ゲスト';
  const ranking = getDroppingRanking();
  
  const newEntry: RankingEntry = {
    playerName: name,
    time,
    droppings,
    date: new Date().toISOString()
  };
  
  // 同じプレイヤー名の場合は最新のスコアのみ保持
  let existingEntryIndex = -1;
  
  // 既存のエントリーを探す
  for (let i = 0; i < ranking.length; i++) {
    if (ranking[i].playerName === name) {
      existingEntryIndex = i;
      break;
    }
  }
  
  // 既存のエントリーがある場合は削除
  if (existingEntryIndex >= 0) {
    ranking.splice(existingEntryIndex, 1);
  }
  
  // 新しいランキングを作成
  const newRanking = [...ranking, newEntry].sort((a, b) => b.droppings - a.droppings);
  
  // 最大5件に制限
  const trimmedRanking = newRanking.slice(0, 5);
  saveDroppingRanking(trimmedRanking);
  
  // 順位を返す（0-indexed）
  return trimmedRanking.findIndex(entry => entry === newEntry);
};

// ランキング表示用のユーティリティ関数
export const formatTimeForRanking = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '不明な日付';
  }
};
