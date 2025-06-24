import React, { memo, useMemo } from 'react';
import type { Player } from '../types/chess';

/**
 * PlayerCardコンポーネントのProps型定義
 * 
 * React学習ポイント:
 * - オプショナルプロパティ（isTop?: boolean）
 * - デフォルト値の設定
 */
interface PlayerCardProps {
  /** プレイヤーの情報 */
  player: Player;
  /** 現在のアクティブプレイヤーかどうか */
  isActive: boolean;
  /** 上部に表示されるプレイヤーかどうか（レイアウト調整用） */
  isTop?: boolean;
}

/**
 * プレイヤー情報を表示するカードコンポーネント
 * 
 * React学習ポイント:
 * - React.memoによる最適化
 * - useMemoによる計算のメモ化
 * - 条件付きレンダリング
 * - デフォルトプロパティの使用
 * - 複雑な条件付きスタイリング
 * 
 * @param player - プレイヤー情報
 * @param isActive - アクティブ状態
 * @param isTop - 上部表示かどうか
 */
export const PlayerCard: React.FC<PlayerCardProps> = memo(({ 
  player, 
  isActive, 
  isTop = false 
}) => {
  // useMemoで時間表示の計算をメモ化
  const timeDisplay = useMemo(() => {
    if (!player.timeRemaining) return null;
    
    const minutes = Math.floor(player.timeRemaining / 60);
    const seconds = player.timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [player.timeRemaining]);

  // プレイヤーアイコンの表示をメモ化
  const playerIcon = useMemo(() => {
    return player.color === 'white' ? '♔' : '♚';
  }, [player.color]);

  return (
    <div 
      className={`
        flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border-2 
        transition-all duration-200
        ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
        ${isTop ? 'flex-row-reverse' : ''}
      `}
      // アクセシビリティの向上
      role="region"
      aria-label={`Player: ${player.name}`}
    >
      {/* プレイヤーアイコン */}
      <div 
        className={`
          w-10 h-10 sm:w-12 sm:h-12 rounded-full 
          flex items-center justify-center text-lg sm:text-2xl font-bold
          ${player.color === 'white' 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-gray-800 text-white'
          }
        `}
        aria-label={`${player.color} player icon`}
      >
        {playerIcon}
      </div>
      
      {/* プレイヤー情報 */}
      <div className={`flex-1 ${isTop ? 'text-right' : ''}`}>
        {/* プレイヤー名 */}
        <div className="font-semibold text-gray-800 text-sm sm:text-base">
          {player.name}
        </div>
        
        {/* レーティング表示（存在する場合のみ） */}
        {player.rating && (
          <div className="text-xs sm:text-sm text-gray-600">
            Rating: {player.rating}
          </div>
        )}
        
        {/* 残り時間表示（存在する場合のみ） */}
        {timeDisplay && (
          <div className="text-xs sm:text-sm font-mono text-blue-600">
            {timeDisplay}
          </div>
        )}
      </div>
    </div>
  );
});

// React DevToolsでの表示名を設定
PlayerCard.displayName = 'PlayerCard';