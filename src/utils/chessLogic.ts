import type { ChessPiece, PieceColor, PieceType, Square, GameState } from '../types/chess';

export const createInitialBoard = (): (ChessPiece | null)[][] => {
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

  // Place pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }

  // Place other pieces
  const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: pieceOrder[col], color: 'black' };
    board[7][col] = { type: pieceOrder[col], color: 'white' };
  }

  return board;
};

export const createInitialGameState = (): GameState => ({
  board: createInitialBoard(),
  currentPlayer: 'white',
  selectedSquare: null,
  validMoves: [],
  isCheck: false,
  isCheckmate: false,
  gameOver: false,
  moves: [],
  capturedPieces: {
    white: [],
    black: [],
  },
  players: {
    white: { name: 'White Player', color: 'white', rating: 1200 },
    black: { name: 'Black Player', color: 'black', rating: 1200 },
  },
  castlingRights: {
    whiteKingSide: true,
    whiteQueenSide: true,
    blackKingSide: true,
    blackQueenSide: true,
  },
  enPassantTarget: null,
  promotionPending: null,
});

export const isSquareOnBoard = ([row, col]: Square): boolean => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

export const isSameSquare = (square1: Square, square2: Square): boolean => {
  return square1[0] === square2[0] && square1[1] === square2[1];
};

export const isValidMove = (
  from: Square, 
  to: Square, 
  board: (ChessPiece | null)[][], 
  gameState?: GameState
): boolean => {
  const piece = board[from[0]][from[1]];
  if (!piece) return false;

  const targetPiece = board[to[0]][to[1]];
  if (targetPiece && targetPiece.color === piece.color) return false;

  // Basic move validation by piece type
  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(from, to, piece.color, board, gameState);
    case 'rook':
      return isValidRookMove(from, to, board);
    case 'knight':
      return isValidKnightMove(from, to);
    case 'bishop':
      return isValidBishopMove(from, to, board);
    case 'queen':
      return isValidQueenMove(from, to, board);
    case 'king':
      return isValidKingMove(from, to, board, gameState);
    default:
      return false;
  }
};

const isValidPawnMove = (
  from: Square, 
  to: Square, 
  color: PieceColor, 
  board: (ChessPiece | null)[][], 
  gameState?: GameState
): boolean => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;

  // Forward move
  if (fromCol === toCol) {
    if (toRow === fromRow + direction && !board[toRow][toCol]) {
      return true;
    }
    // Two squares from start
    if (fromRow === startRow && toRow === fromRow + 2 * direction && !board[toRow][toCol]) {
      return true;
    }
  }

  // Diagonal capture
  if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
    // Regular capture
    if (board[toRow][toCol]) {
      return true;
    }
    // En passant capture
    if (gameState?.enPassantTarget && isSameSquare(to, gameState.enPassantTarget)) {
      return true;
    }
  }

  return false;
};

const isValidRookMove = (from: Square, to: Square, board: (ChessPiece | null)[][]): boolean => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  if (fromRow !== toRow && fromCol !== toCol) return false;

  // Check path is clear
  const rowDir = fromRow === toRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
  const colDir = fromCol === toCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);

  let currentRow = fromRow + rowDir;
  let currentCol = fromCol + colDir;

  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowDir;
    currentCol += colDir;
  }

  return true;
};

const isValidKnightMove = (from: Square, to: Square): boolean => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);

  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};

const isValidBishopMove = (from: Square, to: Square, board: (ChessPiece | null)[][]): boolean => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;

  // Check path is clear
  const rowDir = (toRow - fromRow) / Math.abs(toRow - fromRow);
  const colDir = (toCol - fromCol) / Math.abs(toCol - fromCol);

  let currentRow = fromRow + rowDir;
  let currentCol = fromCol + colDir;

  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol]) return false;
    currentRow += rowDir;
    currentCol += colDir;
  }

  return true;
};

const isValidQueenMove = (from: Square, to: Square, board: (ChessPiece | null)[][]): boolean => {
  return isValidRookMove(from, to, board) || isValidBishopMove(from, to, board);
};

const isValidKingMove = (from: Square, to: Square, board: (ChessPiece | null)[][], gameState?: GameState): boolean => {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);

  // Regular king move
  if (rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0)) {
    return true;
  }

  // Castling
  if (gameState && rowDiff === 0 && colDiff === 2) {
    const piece = board[fromRow][fromCol];
    if (!piece || piece.type !== 'king') return false;

    const color = piece.color;
    const kingRow = color === 'white' ? 7 : 0;
    
    if (fromRow !== kingRow || fromCol !== 4) return false;

    // King side castling
    if (toCol === 6) {
      if (!gameState.castlingRights[color === 'white' ? 'whiteKingSide' : 'blackKingSide']) return false;
      // Check if squares between king and rook are empty
      if (board[kingRow][5] || board[kingRow][6]) return false;
      // Check if rook is in position
      const rook = board[kingRow][7];
      if (!rook || rook.type !== 'rook' || rook.color !== color) return false;
      return true;
    }

    // Queen side castling
    if (toCol === 2) {
      if (!gameState.castlingRights[color === 'white' ? 'whiteQueenSide' : 'blackQueenSide']) return false;
      // Check if squares between king and rook are empty
      if (board[kingRow][1] || board[kingRow][2] || board[kingRow][3]) return false;
      // Check if rook is in position
      const rook = board[kingRow][0];
      if (!rook || rook.type !== 'rook' || rook.color !== color) return false;
      return true;
    }
  }

  return false;
};