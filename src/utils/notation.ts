import type { Square, ChessPiece } from '../types/chess';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const squareToNotation = ([row, col]: Square): string => {
  return `${FILES[col]}${RANKS[row]}`;
};

export const generateMoveNotation = (
  from: Square,
  to: Square,
  piece: ChessPiece,
  capturedPiece?: ChessPiece,
  isCastling?: boolean,
  isEnPassant?: boolean,
  isPromotion?: boolean,
  promotedTo?: string
): string => {
  // Castling notation
  if (isCastling) {
    const [, fromCol] = from;
    const [, toCol] = to;
    return toCol > fromCol ? 'O-O' : 'O-O-O';
  }
  
  const toNotation = squareToNotation(to);
  let notation = '';
  
  // Add piece symbol (except for pawns)
  if (piece.type !== 'pawn') {
    notation += piece.type.charAt(0).toUpperCase();
  }
  
  // Add capture notation
  if (capturedPiece || isEnPassant) {
    if (piece.type === 'pawn') {
      notation += FILES[from[1]]; // Add file for pawn captures
    }
    notation += 'x';
  }
  
  // Add destination square
  notation += toNotation;
  
  // Add en passant notation
  if (isEnPassant) {
    notation += ' e.p.';
  }
  
  // Add promotion notation
  if (isPromotion && promotedTo) {
    notation += '=' + promotedTo.charAt(0).toUpperCase();
  }
  
  return notation;
};