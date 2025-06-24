import { ChessBoardWithCoordinates } from './components/ChessBoardWithCoordinates';
import { PlayerCard } from './components/PlayerCard';
import { MoveHistory } from './components/MoveHistory';
import { CapturedPieces } from './components/CapturedPieces';
import { GameControls } from './components/GameControls';
import { PromotionDialog } from './components/PromotionDialog';
import { useChessGame } from './hooks/useChessGame';

/**
 * メインのAppコンポーネント
 * 
 * React学習ポイント:
 * - カスタムフックの使用（useChessGame）
 * - コンポーネント合成による複雑なUIの構築
 * - レスポンシブデザインの実装
 * - 条件付きレンダリング
 * - プロップスの適切な受け渡し
 * - 状態管理の分離（ロジックをカスタムフックに移譲）
 * 
 * このコンポーネントは、チェスゲーム全体のレイアウトとコンポーネントの配置を担当する。
 * ゲームロジックはuseChessGameカスタムフックに分離されている。
 */
function App() {
  // カスタムフックからゲーム状態と操作関数を取得
  const {
    gameState,
    boardFlipped,
    handleNewGame,
    handleFlipBoard,
    handlePromotion,
    handlePromotionCancel,
    updateGameState,
  } = useChessGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-1 sm:mb-2">Chess Game</h1>
          <p className="text-sm sm:text-base text-slate-600">Professional chess interface</p>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Top Player (Black) - Mobile */}
          <div className="mb-4">
            <PlayerCard
              player={gameState.players.black}
              isActive={gameState.currentPlayer === 'black'}
              isTop={true}
            />
          </div>

          {/* Chess Board - Mobile */}
          <div className="flex justify-center mb-4">
            <ChessBoardWithCoordinates
              gameState={gameState}
              onGameStateChange={updateGameState}
              flipped={boardFlipped}
            />
          </div>

          {/* Bottom Player (White) - Mobile */}
          <div className="mb-4">
            <PlayerCard
              player={gameState.players.white}
              isActive={gameState.currentPlayer === 'white'}
            />
          </div>

          {/* Mobile Controls & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Game Controls */}
            <GameControls
              onNewGame={handleNewGame}
              onFlipBoard={handleFlipBoard}
              gameOver={gameState.gameOver}
              isCheck={gameState.isCheck}
              isCheckmate={gameState.isCheckmate}
            />

            {/* Move History */}
            <MoveHistory moves={gameState.moves} />
          </div>

          {/* Captured Pieces - Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg border border-gray-300 p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Captured by White</h4>
              <CapturedPieces pieces={gameState.capturedPieces.white} />
            </div>
            <div className="bg-white rounded-lg border border-gray-300 p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Captured by Black</h4>
              <CapturedPieces pieces={gameState.capturedPieces.black} />
            </div>
          </div>

          {/* Game Info - Mobile */}
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Game Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Turn:</span>
                <div className="font-semibold capitalize">{gameState.currentPlayer}</div>
              </div>
              <div>
                <span className="text-gray-600">Moves:</span>
                <div className="font-semibold">{gameState.moves.length}</div>
              </div>
              <div>
                <span className="text-gray-600">Material:</span>
                <div className="font-semibold">Equal</div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="font-semibold">
                  {gameState.isCheckmate ? 'Checkmate' :
                   gameState.isCheck ? 'Check' :
                   gameState.gameOver ? 'Game Over' : 'Playing'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Left Sidebar */}
            <div className="col-span-1 space-y-4">
              {/* Top Player (Black) */}
              <PlayerCard
                player={gameState.players.black}
                isActive={gameState.currentPlayer === 'black'}
                isTop={true}
              />
              
              {/* Captured by White */}
              <div className="bg-white rounded-lg border border-gray-300 p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Captured by White</h4>
                <CapturedPieces pieces={gameState.capturedPieces.white} />
              </div>
            </div>

            {/* Chess Board */}
            <div className="col-span-2 flex justify-center">
              <ChessBoardWithCoordinates
                gameState={gameState}
                onGameStateChange={updateGameState}
                flipped={boardFlipped}
              />
            </div>

            {/* Right Sidebar */}
            <div className="col-span-1 space-y-4">
              {/* Game Controls */}
              <GameControls
                onNewGame={handleNewGame}
                onFlipBoard={handleFlipBoard}
                gameOver={gameState.gameOver}
                isCheck={gameState.isCheck}
                isCheckmate={gameState.isCheckmate}
              />

              {/* Move History */}
              <MoveHistory moves={gameState.moves} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="max-w-7xl mx-auto mt-6">
            <div className="grid grid-cols-4 gap-6">
              {/* Bottom Player (White) */}
              <div className="col-span-1">
                <PlayerCard
                  player={gameState.players.white}
                  isActive={gameState.currentPlayer === 'white'}
                />
                
                {/* Captured by Black */}
                <div className="bg-white rounded-lg border border-gray-300 p-3 mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Captured by Black</h4>
                  <CapturedPieces pieces={gameState.capturedPieces.black} />
                </div>
              </div>

              {/* Game Info */}
              <div className="col-span-3">
                <div className="bg-white rounded-lg border border-gray-300 p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Game Information</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Turn:</span>
                      <div className="font-semibold capitalize">{gameState.currentPlayer}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Moves:</span>
                      <div className="font-semibold">{gameState.moves.length}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Material:</span>
                      <div className="font-semibold">Equal</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <div className="font-semibold">
                        {gameState.isCheckmate ? 'Checkmate' :
                         gameState.isCheck ? 'Check' :
                         gameState.gameOver ? 'Game Over' : 'Playing'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Dialog */}
      {gameState.promotionPending && (
        <PromotionDialog
          color={gameState.promotionPending.color}
          onPromotion={handlePromotion}
          onCancel={handlePromotionCancel}
        />
      )}
    </div>
  );
}

export default App
