import React, { memo, useMemo } from 'react';
import type { ChessPiece } from '../types/chess';
import { getPieceImage } from '../utils/pieceImages';

/**
 * CapturedPiecesコンポーネントのProps型定義
 */
interface CapturedPiecesProps {
  /** 取られた駒の配列 */
  pieces: ChessPiece[];
}

/**
 * 駒の価値を表す定数オブジェクト
 * 
 * React学習ポイント:
 * - 定数の定義とエクスポート
 * - オブジェクトのキー型安全性
 */
const PIECE_VALUES = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0, // キングは取られることがないので0
} as const;

/**
 * 取られた駒を表示するコンポーネント
 * 
 * React学習ポイント:
 * - React.memoによる最適化
 * - useMemoによる計算結果のメモ化
 * - 配列のmap処理とkey属性
 * - 条件付きレンダリング
 * - レスポンシブな画像サイズ
 * 
 * @param pieces - 取られた駒の配列
 */
export const CapturedPieces: React.FC<CapturedPiecesProps> = memo(({ pieces }) => {
  // useMemoで取られた駒の合計価値を計算（piecesが変更された時のみ再計算）
  const totalValue = useMemo(() => {
    return pieces.reduce((sum, piece) => sum + PIECE_VALUES[piece.type], 0);
  }, [pieces]);

  // useMemoで駒のリスト表示をメモ化
  const pieceElements = useMemo(() => {
    return pieces.map((piece, index) => (
      <div
        key={`${piece.color}-${piece.type}-${index}`} // より具体的なkey
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 opacity-70 
                   transition-opacity hover:opacity-100"
        title={`${piece.color} ${piece.type}`}
      >
        <img
          src={getPieceImage(piece)}
          alt={`Captured ${piece.color} ${piece.type}`}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>
    ));
  }, [pieces]);

  return (
    <div 
      className="flex flex-wrap items-center gap-0.5 sm:gap-1 min-h-[1.5rem] sm:min-h-[2rem]"
      role="region"
      aria-label={`Captured pieces, total value: ${totalValue}`}
    >
      {/* 取られた駒の表示 */}
      {pieceElements}
      
      {/* 合計価値の表示（価値がある場合のみ） */}
      {totalValue > 0 && (
        <span 
          className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2 font-medium"
          aria-label={`Total piece value: ${totalValue} points`}
        >
          +{totalValue}
        </span>
      )}
      
      {/* 駒がない場合のメッセージ */}
      {pieces.length === 0 && (
        <span className="text-xs text-gray-400 italic">
          No pieces captured
        </span>
      )}
    </div>
  );
});

// React DevToolsでの表示名を設定
CapturedPieces.displayName = 'CapturedPieces';