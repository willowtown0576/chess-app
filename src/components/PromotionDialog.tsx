import React, { memo, useCallback, useMemo } from 'react';
import type { PieceColor, PieceType } from '../types/chess';
import { getPieceImage } from '../utils/pieceImages';

/**
 * PromotionDialogコンポーネントのProps型定義
 */
interface PromotionDialogProps {
  /** プロモーションする駒の色 */
  color: PieceColor;
  /** プロモーション選択時のコールバック関数 */
  onPromotion: (pieceType: PieceType) => void;
  /** キャンセル時のコールバック関数 */
  onCancel: () => void;
}

/**
 * プロモーションで選択可能な駒の種類
 * 
 * React学習ポイント:
 * - 定数配列の定義
 * - as constによる型の厳密化
 */
const PROMOTION_PIECES: readonly PieceType[] = ['queen', 'rook', 'bishop', 'knight'] as const;

/**
 * ポーンのプロモーション選択ダイアログコンポーネント
 * 
 * React学習ポイント:
 * - React.memoによる最適化
 * - useCallbackによるイベントハンドラーの最適化
 * - useMemoによる要素リストのメモ化
 * - モーダルダイアログの実装
 * - キーボードアクセシビリティ
 * - フォーカス管理
 * 
 * @param color - プロモーションする駒の色
 * @param onPromotion - プロモーション選択時の処理
 * @param onCancel - キャンセル時の処理
 */
export const PromotionDialog: React.FC<PromotionDialogProps> = memo(({ 
  color, 
  onPromotion, 
  onCancel 
}) => {
  // useCallbackでキャンセル処理をメモ化
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  // useCallbackで背景クリック時の処理をメモ化
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    // イベントのターゲットが背景の場合のみキャンセル
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  // useMemoでプロモーション選択ボタンをメモ化
  const promotionButtons = useMemo(() => {
    return PROMOTION_PIECES.map((pieceType) => (
      <button
        key={pieceType}
        onClick={() => onPromotion(pieceType)}
        className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-300 
                   hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 
                   active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Promote to ${pieceType}`}
      >
        <div className="w-12 h-12 mb-2">
          <img
            src={getPieceImage({ type: pieceType, color })}
            alt={`${color} ${pieceType}`}
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 capitalize">
          {pieceType}
        </span>
      </button>
    ));
  }, [color, onPromotion]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promotion-title"
    >
      <div 
        className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 
                   transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()} // ダイアログ内のクリックでキャンセルしない
      >
        {/* ダイアログタイトル */}
        <h3 
          id="promotion-title"
          className="text-lg font-semibold text-gray-800 mb-4 text-center"
        >
          Choose promotion piece
        </h3>
        
        {/* プロモーション選択ボタン群 */}
        <div 
          className="grid grid-cols-2 gap-4 mb-6"
          role="group"
          aria-label="Promotion piece options"
        >
          {promotionButtons}
        </div>
        
        {/* キャンセルボタン */}
        <button
          onClick={handleCancel}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium 
                     py-2 px-4 rounded-lg transition-colors
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Cancel promotion"
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

// React DevToolsでの表示名を設定
PromotionDialog.displayName = 'PromotionDialog';