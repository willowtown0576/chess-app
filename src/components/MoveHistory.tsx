import React, { memo, useMemo } from 'react';
import type { Move } from '../types/chess';

/**
 * MoveHistoryコンポーネントのProps型定義
 */
interface MoveHistoryProps {
  /** 移動履歴の配列 */
  moves: Move[];
}

/**
 * グループ化された移動データの型定義
 * 
 * React学習ポイント:
 * - 内部で使用する型の定義
 * - null許容型の使用
 */
interface GroupedMove {
  moveNumber: number;
  white: Move;
  black: Move | null;
}

/**
 * チェスの移動履歴を表示するコンポーネント
 * 
 * React学習ポイント:
 * - React.memoによる最適化
 * - useMemoによる計算結果のメモ化
 * - 配列のグループ化処理
 * - 条件付きレンダリング
 * - スクロール可能なコンテナの実装
 * 
 * @param moves - 移動履歴の配列
 */
export const MoveHistory: React.FC<MoveHistoryProps> = memo(({ moves }) => {
  // useMemoで移動をペアにグループ化する処理をメモ化
  // movesが変更された時のみ再計算される
  const groupedMoves = useMemo((): GroupedMove[] => {
    const result: GroupedMove[] = [];
    
    // 白と黒の移動を2つずつペアにして処理
    for (let i = 0; i < moves.length; i += 2) {
      result.push({
        moveNumber: Math.floor(i / 2) + 1, // 移動番号（1から開始）
        white: moves[i], // 白の移動
        black: moves[i + 1] || null, // 黒の移動（ない場合はnull）
      });
    }
    
    return result;
  }, [moves]);

  return (
    <div 
      className="bg-white rounded-lg border border-gray-300 p-3 sm:p-4 h-48 sm:h-64 overflow-y-auto"
      role="region"
      aria-label="Move history"
    >
      {/* ヘッダー */}
      <h3 className="font-semibold mb-2 sm:mb-3 text-gray-800 text-sm sm:text-base">
        Move History
      </h3>
      
      {/* 移動履歴の表示 */}
      {groupedMoves.length === 0 ? (
        // 移動がない場合のメッセージ
        <p className="text-gray-500 text-xs sm:text-sm">
          No moves yet
        </p>
      ) : (
        // 移動履歴のリスト
        <div className="space-y-1">
          {groupedMoves.map((group) => (
            <div 
              key={group.moveNumber} 
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              {/* 移動番号 */}
              <span className="text-gray-600 w-4 sm:w-6">
                {group.moveNumber}.
              </span>
              
              {/* 白の移動 */}
              <span className="font-mono w-12 sm:w-16">
                {group.white.notation}
              </span>
              
              {/* 黒の移動（存在する場合のみ） */}
              {group.black && (
                <span className="font-mono w-12 sm:w-16">
                  {group.black.notation}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// React DevToolsでの表示名を設定
MoveHistory.displayName = 'MoveHistory';