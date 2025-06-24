import { ChessSquare } from './ChessSquare';
import type { GameState, Square, PieceType, ChessPiece } from '../types/chess';
import { isValidMove, isSameSquare } from '../utils/chessLogic';
import { generateMoveNotation } from '../utils/notation';
import { 
  isCastlingMove, 
  isEnPassantMove, 
  isPromotionMove, 
  executeCastling, 
  executeEnPassant, 
  updateCastlingRights, 
  updateEnPassantTarget 
} from '../utils/specialMoves';

interface ChessBoardWithCoordinatesProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
  flipped?: boolean;
}

export const ChessBoardWithCoordinates: React.FC<ChessBoardWithCoordinatesProps> = ({
  gameState,
  onGameStateChange,
  flipped = false,
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const handleSquareClick = (square: Square) => {
    const [row, col] = square;
    const piece = gameState.board[row][col];

    if (gameState.selectedSquare) {
      if (isSameSquare(gameState.selectedSquare, square)) {
        onGameStateChange({
          ...gameState,
          selectedSquare: null,
          validMoves: [],
        });
        return;
      }

      if (isValidMove(gameState.selectedSquare, square, gameState.board, gameState)) {
        const movingPiece = gameState.board[gameState.selectedSquare[0]][gameState.selectedSquare[1]];
        if (!movingPiece) return;

        // Check for promotion
        if (isPromotionMove(gameState.selectedSquare, square, movingPiece)) {
          onGameStateChange({
            ...gameState,
            promotionPending: {
              square,
              color: movingPiece.color,
            },
          });
          return;
        }

        executeMove(gameState.selectedSquare, square, movingPiece);
        return;
      }

      if (piece && piece.color === gameState.currentPlayer) {
        const validMoves = getValidMovesForPiece(square, gameState.board);
        onGameStateChange({
          ...gameState,
          selectedSquare: square,
          validMoves,
        });
        return;
      }

      onGameStateChange({
        ...gameState,
        selectedSquare: null,
        validMoves: [],
      });
    } else {
      if (piece && piece.color === gameState.currentPlayer) {
        const validMoves = getValidMovesForPiece(square, gameState.board);
        onGameStateChange({
          ...gameState,
          selectedSquare: square,
          validMoves,
        });
      }
    }
  };

  const executeMove = (from: Square, to: Square, movingPiece: ChessPiece, promotedTo?: PieceType) => {
    let newBoard = gameState.board.map(row => [...row]);
    let capturedPiece = newBoard[to[0]][to[1]];
    const newCapturedPieces = { ...gameState.capturedPieces };

    // Handle special moves
    const isCastling = isCastlingMove(from, to, movingPiece);
    const isEnPassant = isEnPassantMove(from, to, movingPiece, gameState);

    if (isCastling) {
      newBoard = executeCastling(newBoard, from, to);
    } else if (isEnPassant) {
      const result = executeEnPassant(newBoard, from, to, movingPiece);
      newBoard = result.newBoard;
      capturedPiece = result.capturedPiece;
    } else {
      // Regular move
      newBoard[from[0]][from[1]] = null;
      newBoard[to[0]][to[1]] = movingPiece;

      // Handle promotion
      if (promotedTo) {
        newBoard[to[0]][to[1]] = { type: promotedTo, color: movingPiece.color };
      }
    }

    // Update captured pieces
    if (capturedPiece) {
      newCapturedPieces[capturedPiece.color === 'white' ? 'black' : 'white'].push(capturedPiece);
    }

    // Generate notation
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

    // Update game state
    const newCastlingRights = updateCastlingRights(gameState, newMove);
    const newEnPassantTarget = updateEnPassantTarget(newMove);

    onGameStateChange({
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white',
      selectedSquare: null,
      validMoves: [],
      moves: [...gameState.moves, newMove],
      capturedPieces: newCapturedPieces,
      castlingRights: newCastlingRights,
      enPassantTarget: newEnPassantTarget,
      promotionPending: null,
    });
  };

  const getValidMovesForPiece = (from: Square, board: (typeof gameState.board)): Square[] => {
    const validMoves: Square[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const to: Square = [row, col];
        if (isValidMove(from, to, board, gameState)) {
          validMoves.push(to);
        }
      }
    }
    
    return validMoves;
  };

  const isSquareSelected = (square: Square): boolean => {
    return gameState.selectedSquare ? isSameSquare(gameState.selectedSquare, square) : false;
  };

  const isSquareValidMove = (square: Square): boolean => {
    return gameState.validMoves.some(move => isSameSquare(move, square));
  };

  const displayFiles = flipped ? [...files].reverse() : files;
  const displayRanks = flipped ? [...ranks].reverse() : ranks;

  return (
    <div className="relative">
      {/* Board with coordinates */}
      <div className="relative">
        {/* Top file labels */}
        <div className="flex justify-center mb-1">
          <div className="w-4 sm:w-5 md:w-6"></div> {/* Space for rank labels */}
          {displayFiles.map((file) => (
            <div key={file} className="w-12 sm:w-14 md:w-16 h-3 sm:h-4 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-600">
              {file}
            </div>
          ))}
        </div>

        {/* Board with side rank labels */}
        <div className="flex">
          {/* Left rank labels */}
          <div className="flex flex-col">
            {displayRanks.map((rank) => (
              <div key={rank} className="w-4 sm:w-5 md:w-6 h-12 sm:h-14 md:h-16 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-600">
                {rank}
              </div>
            ))}
          </div>

          {/* Chess board */}
          <div className="grid grid-cols-8 grid-rows-8 gap-0 border border-gray-800 sm:border-2 shadow-lg">
            {(flipped ? [...gameState.board].reverse() : gameState.board).map((row, rowIndex) =>
              (flipped ? [...row].reverse() : row).map((piece, colIndex) => {
                const actualRow = flipped ? 7 - rowIndex : rowIndex;
                const actualCol = flipped ? 7 - colIndex : colIndex;
                const square: Square = [actualRow, actualCol];
                const isLight = (actualRow + actualCol) % 2 === 0;
                
                return (
                  <ChessSquare
                    key={`${actualRow}-${actualCol}`}
                    piece={piece}
                    square={square}
                    isLight={isLight}
                    isSelected={isSquareSelected(square)}
                    isValidMove={isSquareValidMove(square)}
                    onClick={handleSquareClick}
                  />
                );
              })
            )}
          </div>

          {/* Right rank labels */}
          <div className="flex flex-col">
            {displayRanks.map((rank) => (
              <div key={rank} className="w-4 sm:w-5 md:w-6 h-12 sm:h-14 md:h-16 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-600">
                {rank}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom file labels */}
        <div className="flex justify-center mt-1">
          <div className="w-4 sm:w-5 md:w-6"></div> {/* Space for rank labels */}
          {displayFiles.map((file) => (
            <div key={file} className="w-12 sm:w-14 md:w-16 h-3 sm:h-4 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-600">
              {file}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};