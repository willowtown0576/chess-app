import { useState, useCallback, useMemo } from 'react';
import type { GameState, Square, PieceType, ChessPiece } from '../types/chess';
import { createInitialGameState, isValidMove } from '../utils/chessLogic';
import { 
  isCastlingMove, 
  isEnPassantMove, 
  executeCastling, 
  executeEnPassant, 
  updateCastlingRights, 
  updateEnPassantTarget 
} from '../utils/specialMoves';
import { generateMoveNotation } from '../utils/notation';

/**
 * カスタムフック: チェスゲームの状態管理
 * 
 * React学習ポイント:
 * - カスタムフックによるロジックの分離
 * - useCallbackによる関数のメモ化
 * - useMemoによる計算結果のメモ化
 * - 複雑な状態管理のベストプラクティス
 */
export const useChessGame = () => {
  // ゲーム状態の管理（useState フック）
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [boardFlipped, setBoardFlipped] = useState<boolean>(false);

  /**
   * 新しいゲームを開始する関数
   * useCallbackでメモ化することで、不要な再レンダリングを防ぐ
   */
  const handleNewGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  /**
   * ボードを反転させる関数
   * useCallbackでメモ化
   */
  const handleFlipBoard = useCallback(() => {
    setBoardFlipped(prev => !prev);
  }, []);

  /**
   * 駒の移動を実行する関数
   * この関数は複雑なロジックを含むため、useCallbackでメモ化する
   */
  const executeMove = useCallback((from: Square, to: Square, movingPiece: ChessPiece, promotedTo?: PieceType) => {
    // 新しいボード状態を作成（イミュータブルな更新）
    let newBoard = gameState.board.map(row => [...row]);
    let capturedPiece = newBoard[to[0]][to[1]];
    const newCapturedPieces = { ...gameState.capturedPieces };

    // 特殊な移動の判定
    const isCastling = isCastlingMove(from, to, movingPiece);
    const isEnPassant = isEnPassantMove(from, to, movingPiece, gameState);

    // 移動タイプに応じた処理
    if (isCastling) {
      newBoard = executeCastling(newBoard, from, to);
    } else if (isEnPassant) {
      const result = executeEnPassant(newBoard, from, to, movingPiece);
      newBoard = result.newBoard;
      capturedPiece = result.capturedPiece;
    } else {
      // 通常の移動
      newBoard[from[0]][from[1]] = null;
      newBoard[to[0]][to[1]] = movingPiece;

      // プロモーションの処理
      if (promotedTo) {
        newBoard[to[0]][to[1]] = { type: promotedTo, color: movingPiece.color };
      }
    }

    // 取られた駒の管理
    if (capturedPiece) {
      newCapturedPieces[capturedPiece.color === 'white' ? 'black' : 'white'].push(capturedPiece);
    }

    // 棋譜記号の生成
    const notation = generateMoveNotation(
      from,
      to,
      movingPiece,
      capturedPiece || undefined,
      isCastling,
      isEnPassant,
      !!promotedTo,
      promotedTo
    );

    // 移動データの作成
    const newMove = {
      from,
      to,
      piece: movingPiece,
      capturedPiece: capturedPiece || undefined,
      notation,
      timestamp: Date.now(),
      isCastling,
      isEnPassant,
      isPromotion: !!promotedTo,
      promotedTo,
    };

    // ゲーム状態の更新
    const newCastlingRights = updateCastlingRights(gameState, newMove);
    const newEnPassantTarget = updateEnPassantTarget(newMove);

    setGameState(prevState => ({
      ...prevState,
      board: newBoard,
      currentPlayer: prevState.currentPlayer === 'white' ? 'black' : 'white',
      selectedSquare: null,
      validMoves: [],
      moves: [...prevState.moves, newMove],
      capturedPieces: newCapturedPieces,
      castlingRights: newCastlingRights,
      enPassantTarget: newEnPassantTarget,
      promotionPending: null,
    }));
  }, [gameState]);

  /**
   * プロモーション処理
   * useCallbackでメモ化し、依存関係を明確にする
   */
  const handlePromotion = useCallback((pieceType: PieceType) => {
    if (!gameState.promotionPending || !gameState.selectedSquare) return;

    const movingPiece = gameState.board[gameState.selectedSquare[0]][gameState.selectedSquare[1]];
    if (!movingPiece) return;

    executeMove(gameState.selectedSquare, gameState.promotionPending.square, movingPiece, pieceType);
  }, [gameState.promotionPending, gameState.selectedSquare, gameState.board, executeMove]);

  /**
   * プロモーションキャンセル処理
   */
  const handlePromotionCancel = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      selectedSquare: null,
      validMoves: [],
      promotionPending: null,
    }));
  }, []);

  /**
   * 指定した駒の有効な移動先を計算
   * useMemoで計算結果をメモ化して最適化
   */
  const getValidMovesForSquare = useCallback((from: Square): Square[] => {
    const validMoves: Square[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const to: Square = [row, col];
        if (isValidMove(from, to, gameState.board, gameState)) {
          validMoves.push(to);
        }
      }
    }
    
    return validMoves;
  }, [gameState]);

  /**
   * ゲーム状態の更新
   */
  const updateGameState = useCallback((newState: GameState) => {
    setGameState(newState);
  }, []);

  // 戻り値をuseMemoでメモ化（オブジェクトの再作成を防ぐ）
  return useMemo(() => ({
    gameState,
    boardFlipped,
    handleNewGame,
    handleFlipBoard,
    executeMove,
    handlePromotion,
    handlePromotionCancel,
    getValidMovesForSquare,
    updateGameState,
  }), [
    gameState,
    boardFlipped,
    handleNewGame,
    handleFlipBoard,
    executeMove,
    handlePromotion,
    handlePromotionCancel,
    getValidMovesForSquare,
    updateGameState,
  ]);
};