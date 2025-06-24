# React学習ガイド - チェスゲームプロジェクト

このドキュメントは、チェスゲームプロジェクトを通じてReactを学習するための詳細なガイドです。

## 📚 学習の進め方

### 1. 基礎編：コンポーネントの理解

#### 最初に読むべきファイル
1. `src/components/ChessPiece.tsx` - 最もシンプルなコンポーネント
2. `src/components/ChessSquare.tsx` - 条件付きレンダリングの例
3. `src/components/PlayerCard.tsx` - データ表示コンポーネント

#### 学習ポイント
```typescript
// Props の型定義
interface ChessPieceProps {
  piece: ChessPieceType;
  isSelected: boolean;
  onClick: () => void;
}

// 関数コンポーネントの基本形
export const ChessPiece: React.FC<ChessPieceProps> = ({ piece, isSelected, onClick }) => {
  // JSXの返却
  return <div>...</div>;
};
```

### 2. 中級編：状態管理とフック

#### フォーカスファイル
1. `src/hooks/useChessGame.ts` - カスタムフック
2. `src/components/MoveHistory.tsx` - useMemoの活用
3. `src/components/GameControls.tsx` - 複雑な状態管理

#### 重要な概念

**useState の使用**
```typescript
const [gameState, setGameState] = useState<GameState>(initialState);
```

**useCallback による最適化**
```typescript
const handleMove = useCallback((from: Square, to: Square) => {
  // 移動処理
}, [gameState]); // 依存関係配列
```

**useMemo による計算の最適化**
```typescript
const validMoves = useMemo(() => {
  return calculateValidMoves(selectedPiece, board);
}, [selectedPiece, board]);
```

### 3. 上級編：パフォーマンス最適化

#### 最適化の技法

**React.memo によるコンポーネントの最適化**
```typescript
export const ChessSquare = memo(({ piece, isSelected, onClick }) => {
  // コンポーネントロジック
});
```

**適切な key 属性の使用**
```typescript
{moves.map((move, index) => (
  <div key={`${move.from}-${move.to}-${index}`}>
    {move.notation}
  </div>
))}
```

## 🔍 コードリーディングガイド

### データフローの追跡

1. **App.tsx** - トップレベルの状態管理
2. **useChessGame.ts** - ビジネスロジックの分離
3. **ChessBoardWithCoordinates.tsx** - UIとロジックの連携

### 型安全性の理解

```typescript
// 型の定義
interface GameState {
  board: (ChessPiece | null)[][];
  currentPlayer: PieceColor;
  // ...
}

// 型の使用
const [gameState, setGameState] = useState<GameState>(initialState);
```

## 🛠️ 実践演習

### 初級演習

1. **新しいコンポーネント作成**
   - `src/components/Timer.tsx` を作成
   - プレイヤーの残り時間を表示

2. **スタイルの変更**
   - チェスボードの色を変更
   - 駒のホバーエフェクトを追加

### 中級演習

1. **状態の追加**
   - ゲームの開始時間を記録
   - 経過時間の表示機能

2. **カスタムフックの作成**
   - `useTimer.ts` で時間管理
   - `useLocalStorage.ts` でゲーム保存

### 上級演習

1. **新機能の実装**
   - Undo/Redo機能
   - ゲームのリプレイ機能

2. **パフォーマンス最適化**
   - 大きなデータセットでの最適化
   - 仮想化の実装

## 🧪 デバッグとテスト

### React DevTools の活用

1. **コンポーネントツリーの確認**
   - プロップスの流れを追跡
   - 状態の変化を観察

2. **Profiler の使用**
   - レンダリング時間の測定
   - 最適化の効果確認

### 一般的な問題と解決法

**無限ループの回避**
```typescript
// ❌ 間違い
useEffect(() => {
  setCount(count + 1);
}); // 依存関係配列なし

// ✅ 正しい
useEffect(() => {
  setCount(prev => prev + 1);
}, [trigger]); // 適切な依存関係
```

**メモリリークの防止**
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    // 処理
  }, 1000);

  return () => clearInterval(timer); // クリーンアップ
}, []);
```

## 📖 推奨学習リソース

### 公式ドキュメント
- [React 公式ドキュメント](https://react.dev/)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/)

### 追加学習トピック
- Context API (グローバル状態管理)
- React Router (SPA ルーティング)
- React Query (サーバー状態管理)
- Testing Library (コンポーネントテスト)

## 🎯 学習チェックリスト

### 基礎レベル
- [ ] 関数コンポーネントの書き方を理解している
- [ ] Props の型定義ができる
- [ ] useState の基本的な使い方を知っている
- [ ] イベントハンドリングができる

### 中級レベル
- [ ] useEffect の使い方を理解している
- [ ] カスタムフックを作成できる
- [ ] 条件付きレンダリングを適切に使える
- [ ] 配列の map を使ったレンダリングができる

### 上級レベル
- [ ] React.memo の使いどころを理解している
- [ ] useMemo と useCallback の違いを説明できる
- [ ] TypeScript と React の連携を理解している
- [ ] パフォーマンス最適化の手法を知っている

## 💡 学習のコツ

1. **小さく始める**: 一つのコンポーネントから理解を深める
2. **実際に動かす**: コードを変更して結果を確認
3. **デバッグツールを活用**: React DevTools で内部状態を確認
4. **型安全性を重視**: TypeScript の恩恵を最大限活用
5. **パフォーマンスを意識**: 最適化の効果を測定

このプロジェクトを通じて、実践的なReact開発スキルを身につけることができます。段階的に学習を進め、理解を深めていってください。