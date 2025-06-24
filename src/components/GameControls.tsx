import React, { memo, useMemo } from 'react';

/**
 * GameControlsコンポーネントのProps型定義
 * 
 * React学習ポイント:
 * - 関数型propsの定義
 * - boolean型の状態プロパティ
 */
interface GameControlsProps {
  /** 新しいゲームを開始する関数 */
  onNewGame: () => void;
  /** ボードを反転させる関数 */
  onFlipBoard: () => void;
  /** ゲームが終了しているかどうか */
  gameOver: boolean;
  /** チェック状態かどうか */
  isCheck: boolean;
  /** チェックメイト状態かどうか */
  isCheckmate: boolean;
}

/**
 * ゲーム操作とステータス表示を行うコンポーネント
 * 
 * React学習ポイント:
 * - React.memoによる最適化
 * - useMemoによる条件分岐の最適化
 * - 複雑な条件付きレンダリング
 * - ボタンコンポーネントの実装
 * - ステータス表示の条件付きスタイリング
 * 
 * @param onNewGame - 新ゲーム開始関数
 * @param onFlipBoard - ボード反転関数
 * @param gameOver - ゲーム終了状態
 * @param isCheck - チェック状態
 * @param isCheckmate - チェックメイト状態
 */
export const GameControls: React.FC<GameControlsProps> = memo(({
  onNewGame,
  onFlipBoard,
  gameOver,
  isCheck,
  isCheckmate,
}) => {
  // useMemoでゲームステータスの表示内容をメモ化
  const gameStatus = useMemo(() => {
    if (isCheckmate) {
      return {
        text: 'Checkmate!',
        className: 'bg-red-100 text-red-800',
      };
    }
    
    if (isCheck) {
      return {
        text: 'Check!',
        className: 'bg-yellow-100 text-yellow-800',
      };
    }
    
    if (gameOver) {
      return {
        text: 'Game Over',
        className: 'bg-gray-100 text-gray-800',
      };
    }
    
    return {
      text: 'Game in progress',
      className: 'bg-green-100 text-green-800',
    };
  }, [isCheckmate, isCheck, gameOver]);

  return (
    <div 
      className="bg-white rounded-lg border border-gray-300 p-3 sm:p-4 space-y-2 sm:space-y-3"
      role="region"
      aria-label="Game controls"
    >
      {/* ヘッダー */}
      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
        Game Controls
      </h3>
      
      {/* 操作ボタン群 */}
      <div className="space-y-2">
        <button
          onClick={onNewGame}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 
                     text-white font-medium py-2 px-3 sm:px-4 rounded-lg 
                     transition-all text-sm sm:text-base
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Start a new chess game"
        >
          New Game
        </button>
        
        <button
          onClick={onFlipBoard}
          className="w-full bg-gray-600 hover:bg-gray-700 active:scale-95 
                     text-white font-medium py-2 px-3 sm:px-4 rounded-lg 
                     transition-all text-sm sm:text-base
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Flip the chess board view"
        >
          Flip Board
        </button>
      </div>
      
      {/* ゲームステータス表示 */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
          Status
        </h4>
        
        <div 
          className={`${gameStatus.className} px-2 sm:px-3 py-1 sm:py-2 
                      rounded-lg text-xs sm:text-sm font-medium`}
          role="status"
          aria-live="polite"
        >
          {gameStatus.text}
        </div>
      </div>
    </div>
  );
});

// React DevToolsでの表示名を設定
GameControls.displayName = 'GameControls';