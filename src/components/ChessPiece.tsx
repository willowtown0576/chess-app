import React, { memo } from 'react';
import type { ChessPiece as ChessPieceType } from '../types/chess';
import { getPieceImage } from '../utils/pieceImages';

/**
 * ChessPieceコンポーネントのProps型定義
 * 
 * React学習ポイント:
 * - TypeScriptインターフェースの使用
 * - 明確な型定義による開発効率向上
 */
interface ChessPieceProps {
  /** チェスの駒のデータ（種類と色） */
  piece: ChessPieceType;
  /** この駒が選択されているかどうか */
  isSelected: boolean;
  /** クリック時のコールバック関数 */
  onClick: () => void;
}

/**
 * チェスの駒を表示するコンポーネント
 * 
 * React学習ポイント:
 * - React.memoによる最適化（propsが変わらない限り再レンダリングしない）
 * - 条件付きCSSクラスの適用
 * - イベントハンドリング
 * - レスポンシブデザイン（Tailwind CSS）
 * 
 * @param piece - 駒の種類と色の情報
 * @param isSelected - 選択状態
 * @param onClick - クリック時の処理
 */
export const ChessPiece: React.FC<ChessPieceProps> = memo(({ piece, isSelected, onClick }) => {
  // 駒の画像URLを取得
  const imageUrl = getPieceImage(piece);

  return (
    <div
      className={`
        w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
        cursor-pointer select-none transition-all duration-200 filter drop-shadow-lg
        ${isSelected ? 'scale-110 brightness-110' : 'hover:scale-105 active:scale-95'}
      `}
      onClick={onClick}
      // アクセシビリティの向上
      role="button"
      tabIndex={0}
      aria-label={`${piece.color} ${piece.type}`}
    >
      <img
        src={imageUrl}
        alt={`${piece.color} ${piece.type}`}
        className="w-full h-full object-contain"
        draggable={false} // ドラッグを無効化
      />
    </div>
  );
});

// React DevToolsでの表示名を設定
ChessPiece.displayName = 'ChessPiece';