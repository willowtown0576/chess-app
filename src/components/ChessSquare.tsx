import React, { memo, useCallback } from 'react';
import { ChessPiece } from './ChessPiece';
import type { ChessPiece as ChessPieceType, Square } from '../types/chess';

/**
 * ChessSquareコンポーネントのProps型定義
 * 
 * React学習ポイント:
 * - null許容型の使用（piece: ChessPieceType | null）
 * - 関数型のprops定義
 */
interface ChessSquareProps {
  /** このマスに配置されている駒（ない場合はnull） */
  piece: ChessPieceType | null;
  /** マスの座標 */
  square: Square;
  /** 明るいマス（白）かどうか */
  isLight: boolean;
  /** このマスが選択されているかどうか */
  isSelected: boolean;
  /** このマスが有効な移動先かどうか */
  isValidMove: boolean;
  /** クリック時のコールバック関数 */
  onClick: (square: Square) => void;
}

/**
 * チェスボードの1つのマスを表示するコンポーネント
 * 
 * React学習ポイント:
 * - React.memoによるパフォーマンス最適化
 * - useCallbackによるイベントハンドラーの最適化
 * - 条件付きレンダリング（piece && ...）
 * - 複雑な条件付きスタイリング
 * - コンポーネント合成（ChessPieceを内包）
 * 
 * @param piece - マスに配置されている駒
 * @param square - マスの座標
 * @param isLight - 明るいマスかどうか
 * @param isSelected - 選択されているかどうか
 * @param isValidMove - 有効な移動先かどうか
 * @param onClick - クリック時の処理
 */
export const ChessSquare: React.FC<ChessSquareProps> = memo(({
  piece,
  square,
  isLight,
  isSelected,
  isValidMove,
  onClick,
}) => {
  // useCallbackでクリックハンドラーをメモ化
  // 依存関係はsquareとonClickのみ
  const handleClick = useCallback(() => {
    onClick(square);
  }, [square, onClick]);

  return (
    <div
      className={`
        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
        flex items-center justify-center relative cursor-pointer 
        transition-all duration-200
        ${isLight ? 'bg-stone-200' : 'bg-stone-600'}
        ${isSelected ? 'ring-2 sm:ring-4 ring-yellow-400 ring-inset' : ''}
        ${isValidMove ? 'ring-1 sm:ring-2 ring-green-400 ring-inset' : ''}
        hover:brightness-110 active:scale-95
      `}
      onClick={handleClick}
      // アクセシビリティの向上
      role="button"
      tabIndex={0}
      aria-label={`Square ${String.fromCharCode(97 + square[1])}${8 - square[0]}${piece ? `, ${piece.color} ${piece.type}` : ', empty'}`}
    >
      {/* 駒が存在する場合のみレンダリング（条件付きレンダリング） */}
      {piece && (
        <div className="flex items-center justify-center w-full h-full">
          <ChessPiece
            piece={piece}
            isSelected={isSelected}
            onClick={handleClick}
          />
        </div>
      )}
      
      {/* 有効な移動先で駒がない場合は緑の丸を表示 */}
      {isValidMove && !piece && (
        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-400 rounded-full opacity-70" />
      )}
      
      {/* 有効な移動先で駒がある場合は緑の枠を表示 */}
      {isValidMove && piece && (
        <div className="absolute inset-0 border-2 sm:border-4 border-green-400 rounded-sm opacity-70" />
      )}
    </div>
  );
});

// React DevToolsでの表示名を設定
ChessSquare.displayName = 'ChessSquare';