// Import all piece images
import whiteKing from '../assets/pieces/white-king.svg';
import blackKing from '../assets/pieces/black-king.svg';
import whiteQueen from '../assets/pieces/white-queen.svg';
import blackQueen from '../assets/pieces/black-queen.svg';
import whiteRook from '../assets/pieces/white-rook.svg';
import blackRook from '../assets/pieces/black-rook.svg';
import whiteBishop from '../assets/pieces/white-bishop.svg';
import blackBishop from '../assets/pieces/black-bishop.svg';
import whiteKnight from '../assets/pieces/white-knight.svg';
import blackKnight from '../assets/pieces/black-knight.svg';
import whitePawn from '../assets/pieces/white-pawn.svg';
import blackPawn from '../assets/pieces/black-pawn.svg';

import type { ChessPiece } from '../types/chess';

const PIECE_IMAGES = {
  white: {
    king: whiteKing,
    queen: whiteQueen,
    rook: whiteRook,
    bishop: whiteBishop,
    knight: whiteKnight,
    pawn: whitePawn,
  },
  black: {
    king: blackKing,
    queen: blackQueen,
    rook: blackRook,
    bishop: blackBishop,
    knight: blackKnight,
    pawn: blackPawn,
  },
};

export const getPieceImage = (piece: ChessPiece): string => {
  return PIECE_IMAGES[piece.color][piece.type];
};