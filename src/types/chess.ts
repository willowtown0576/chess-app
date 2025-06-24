export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';
export type Square = [number, number]; // [row, col]

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export interface Move {
  from: Square;
  to: Square;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  notation: string;
  timestamp: number;
  isCastling?: boolean;
  isEnPassant?: boolean;
  isPromotion?: boolean;
  promotedTo?: PieceType;
}

export interface Player {
  name: string;
  color: PieceColor;
  rating?: number;
  timeRemaining?: number;
}

export interface GameState {
  board: (ChessPiece | null)[][];
  currentPlayer: PieceColor;
  selectedSquare: Square | null;
  validMoves: Square[];
  isCheck: boolean;
  isCheckmate: boolean;
  gameOver: boolean;
  moves: Move[];
  capturedPieces: {
    white: ChessPiece[];
    black: ChessPiece[];
  };
  players: {
    white: Player;
    black: Player;
  };
  castlingRights: {
    whiteKingSide: boolean;
    whiteQueenSide: boolean;
    blackKingSide: boolean;
    blackQueenSide: boolean;
  };
  enPassantTarget: Square | null;
  promotionPending: {
    square: Square;
    color: PieceColor;
  } | null;
}