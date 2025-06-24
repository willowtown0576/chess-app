import type { GameState, Square, ChessPiece, Move } from '../types/chess';
import { isSameSquare } from './chessLogic';

export const isCastlingMove = (from: Square, to: Square, piece: ChessPiece): boolean => {
  if (piece.type !== 'king') return false;
  
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  
  return fromRow === toRow && Math.abs(fromCol - toCol) === 2;
};

export const isEnPassantMove = (from: Square, to: Square, piece: ChessPiece, gameState: GameState): boolean => {
  if (piece.type !== 'pawn') return false;
  if (!gameState.enPassantTarget) return false;
  
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const direction = piece.color === 'white' ? -1 : 1;
  
  return Math.abs(fromCol - toCol) === 1 && 
         toRow === fromRow + direction && 
         isSameSquare(to, gameState.enPassantTarget);
};

export const isPromotionMove = (from: Square, to: Square, piece: ChessPiece): boolean => {
  if (piece.type !== 'pawn') return false;
  
  const [, ] = from;
  const [toRow, ] = to;
  
  return (piece.color === 'white' && toRow === 0) || 
         (piece.color === 'black' && toRow === 7);
};

export const executeCastling = (board: (ChessPiece | null)[][], from: Square, to: Square): (ChessPiece | null)[][] => {
  const newBoard = board.map(row => [...row]);
  const [fromRow, fromCol] = from;
  const [, toCol] = to;
  
  const king = newBoard[fromRow][fromCol];
  if (!king) return newBoard;
  
  // Move king
  newBoard[fromRow][fromCol] = null;
  newBoard[fromRow][toCol] = king;
  
  // Move rook
  if (toCol === 6) { // King side
    const rook = newBoard[fromRow][7];
    newBoard[fromRow][7] = null;
    newBoard[fromRow][5] = rook;
  } else if (toCol === 2) { // Queen side
    const rook = newBoard[fromRow][0];
    newBoard[fromRow][0] = null;
    newBoard[fromRow][3] = rook;
  }
  
  return newBoard;
};

export const executeEnPassant = (board: (ChessPiece | null)[][], from: Square, to: Square, piece: ChessPiece): {
  newBoard: (ChessPiece | null)[][];
  capturedPiece: ChessPiece | null;
} => {
  const newBoard = board.map(row => [...row]);
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  
  // Move pawn
  newBoard[fromRow][fromCol] = null;
  newBoard[toRow][toCol] = piece;
  
  // Remove captured pawn
  const capturedPawnRow = piece.color === 'white' ? toRow + 1 : toRow - 1;
  const capturedPiece = newBoard[capturedPawnRow][toCol];
  newBoard[capturedPawnRow][toCol] = null;
  
  return { newBoard, capturedPiece };
};

export const updateCastlingRights = (gameState: GameState, move: Move): GameState['castlingRights'] => {
  const newRights = { ...gameState.castlingRights };
  const { from, piece } = move;
  const [fromRow, fromCol] = from;
  
  // King moves disable all castling for that color
  if (piece.type === 'king') {
    if (piece.color === 'white') {
      newRights.whiteKingSide = false;
      newRights.whiteQueenSide = false;
    } else {
      newRights.blackKingSide = false;
      newRights.blackQueenSide = false;
    }
  }
  
  // Rook moves disable castling on that side
  if (piece.type === 'rook') {
    if (piece.color === 'white' && fromRow === 7) {
      if (fromCol === 0) newRights.whiteQueenSide = false;
      if (fromCol === 7) newRights.whiteKingSide = false;
    } else if (piece.color === 'black' && fromRow === 0) {
      if (fromCol === 0) newRights.blackQueenSide = false;
      if (fromCol === 7) newRights.blackKingSide = false;
    }
  }
  
  return newRights;
};

export const updateEnPassantTarget = (move: Move): Square | null => {
  const { from, to, piece } = move;
  const [fromRow, ] = from;
  const [toRow, toCol] = to;
  
  // Pawn moves two squares forward sets en passant target
  if (piece.type === 'pawn' && Math.abs(fromRow - toRow) === 2) {
    const targetRow = piece.color === 'white' ? fromRow - 1 : fromRow + 1;
    return [targetRow, toCol];
  }
  
  return null;
};