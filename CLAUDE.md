# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle (runs TypeScript check first)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Project Architecture

This is a React+TypeScript chess application built with Vite and styled with Tailwind CSS.

### Key Components Structure
- `src/types/chess.ts` - Core type definitions for chess pieces, game state, and moves
- `src/utils/chessLogic.ts` - Chess game logic including move validation and board initialization
- `src/components/ChessBoard.tsx` - Main game board component handling game state and user interactions
- `src/components/ChessSquare.tsx` - Individual square component with visual states
- `src/components/ChessPiece.tsx` - Chess piece component using Unicode symbols

### Game Logic Flow
1. Game state is managed in `ChessBoard` component using React hooks
2. Piece selection and move validation happens through `handleSquareClick`
3. Valid moves are calculated by iterating through all possible squares
4. Move validation uses piece-specific logic in `chessLogic.ts`

### Styling Approach
- Uses Tailwind CSS utility classes for all styling
- Chess board uses alternating amber colors for light/dark squares
- Visual feedback for selected pieces (blue ring) and valid moves (green indicators)
- Responsive design with container classes

### Chess Piece Representation
- Uses Unicode chess symbols (♔♕♖♗♘♙ for white, ♚♛♜♝♞♟ for black)
- Pieces are rendered as text with hover/selection animations