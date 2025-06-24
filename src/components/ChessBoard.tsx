import { useState } from 'react';
import { ChessSquare } from './ChessSquare';
import type { GameState, Square } from '../types/chess';
import { createInitialGameState, isValidMove, isSameSquare } from '../utils/chessLogic';

export const ChessBoard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const handleSquareClick = (square: Square) => {
    const [row, col] = square;
    const piece = gameState.board[row][col];

    if (gameState.selectedSquare) {
      // If clicking on the same square, deselect
      if (isSameSquare(gameState.selectedSquare, square)) {
        setGameState(prev => ({
          ...prev,
          selectedSquare: null,
          validMoves: [],
        }));
        return;
      }

      // If it's a valid move, make the move
      if (isValidMove(gameState.selectedSquare, square, gameState.board)) {
        const newBoard = gameState.board.map(row => [...row]);
        const movingPiece = newBoard[gameState.selectedSquare[0]][gameState.selectedSquare[1]];
        
        newBoard[gameState.selectedSquare[0]][gameState.selectedSquare[1]] = null;
        newBoard[row][col] = movingPiece;

        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white',
          selectedSquare: null,
          validMoves: [],
        }));
        return;
      }

      // If clicking on a piece of the current player, select it
      if (piece && piece.color === gameState.currentPlayer) {
        const validMoves = getValidMovesForPiece(square, gameState.board);
        setGameState(prev => ({
          ...prev,
          selectedSquare: square,
          validMoves,
        }));
        return;
      }

      // Otherwise, deselect
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        validMoves: [],
      }));
    } else {
      // If no piece is selected and clicking on a piece of the current player
      if (piece && piece.color === gameState.currentPlayer) {
        const validMoves = getValidMovesForPiece(square, gameState.board);
        setGameState(prev => ({
          ...prev,
          selectedSquare: square,
          validMoves,
        }));
      }
    }
  };

  const getValidMovesForPiece = (from: Square, board: (typeof gameState.board)): Square[] => {
    const validMoves: Square[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const to: Square = [row, col];
        if (isValidMove(from, to, board)) {
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl font-bold">
        Current Player: <span className="capitalize">{gameState.currentPlayer}</span>
      </div>
      
      <div className="grid grid-cols-8 grid-rows-8 gap-0 border-2 border-gray-800 w-fit">
        {gameState.board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const square: Square = [rowIndex, colIndex];
            const isLight = (rowIndex + colIndex) % 2 === 0;
            
            return (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
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
    </div>
  );
};