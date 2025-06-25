# チェスゲーム - React学習プロジェクト

本格的なチェスゲームをReact + TypeScript + Tailwind CSSで実装した学習用プロジェクトです。

![Chess Game Screenshot](https://via.placeholder.com/800x400/f8f9fa/343a40?text=Chess+Game+Screenshot)

## 🎯 プロジェクトの目的

このプロジェクトは、Reactの基礎から応用まで幅広く学習できるように設計されています。実際のプロダクト開発で使用される技術とベストプラクティスを体験できます。

## ✨ 主な機能

### 🏆 完全なチェスゲーム
- ✅ 全ての駒の移動ルール実装
- ✅ キャスリング（ロカード）
- ✅ アンパッサン
- ✅ ポーンプロモーション
- ✅ チェック・チェックメイト判定

### 🎨 プロフェッショナルなUI
- ✅ レスポンシブデザイン（PC・タブレット・スマホ対応）
- ✅ 美しいアニメーションとトランジション
- ✅ lichess/chess.com風のモダンなデザイン
- ✅ アクセシビリティ対応

### 📱 ユーザー体験
- ✅ 直感的な操作感
- ✅ 移動履歴の表示
- ✅ 取られた駒の表示
- ✅ ゲーム状態の表示

## 🛠️ 技術スタック

- **React 19** - 最新のReactフレームワーク
- **TypeScript** - 型安全性の確保
- **Tailwind CSS** - ユーティリティファーストCSS
- **Vite** - 高速ビルドツール

## 🚀 クイックスタート

### 必要な環境
- Node.js 18以上
- npm または yarn

### インストールと起動

```bash
# プロジェクトをクローン
git clone <repository-url>
cd chess-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバーが起動したら、ブラウザで http://localhost:5173 にアクセスしてください。

### その他のコマンド

```bash
# プロダクションビルド
npm run build

# ビルド結果をプレビュー
npm run preview

# コードリンティング
npm run lint
```

## ⚙️ Tailwind CSS セットアップ詳細

このプロジェクトではTailwind CSS v4を使用しています。セットアップが複雑なため、手順を詳しく説明します。

### 🔧 必要なパッケージ

```bash
# Tailwind CSS v4 と PostCSS プラグイン
npm install -D tailwindcss@4.1.10 @tailwindcss/postcss@4.1.10 autoprefixer postcss
```

### 📝 設定ファイル

**1. `tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**2. `postcss.config.js`**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},  // 重要：@tailwindcss/postcss を使用
    autoprefixer: {},
  },
}
```

**3. `src/index.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ⚠️ よくある問題と解決法

**問題1: スタイルが適用されない**
```bash
# 解決策: 正しいPostCSSプラグインを使用
npm uninstall tailwindcss-postcss  # 間違ったプラグインを削除
npm install -D @tailwindcss/postcss # 正しいプラグインをインストール
```

**問題2: TypeScript エラー**
```typescript
// tsconfig.json で verbatimModuleSyntax が有効な場合
import type { Config } from 'tailwindcss'  // type-only import を使用
```

**問題3: ビルドエラー**
```bash
# Vite キャッシュをクリア
rm -rf node_modules/.vite
npm run dev
```

### 🔍 トラブルシューティング

1. **依存関係を確認**
   ```bash
   npm list tailwindcss @tailwindcss/postcss
   ```

2. **設定ファイルの確認**
   - `postcss.config.js` で `@tailwindcss/postcss` を使用していることを確認
   - `tailwind.config.js` の content パスが正しいことを確認

3. **開発サーバーの再起動**
   ```bash
   npm run dev
   ```

### 📦 このプロジェクトで使用されている完全なパッケージ構成

```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.10",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.10"
  }
}
```

## 📚 React学習ガイド

### 🔰 初心者向け

まずは以下のファイルから読み始めることをおすすめします：

1. **src/components/ChessPiece.tsx** - 最もシンプルなコンポーネント
2. **src/components/ChessSquare.tsx** - 条件付きレンダリングの例
3. **src/components/PlayerCard.tsx** - データ表示コンポーネント

### 🎓 中級者向け

以下の概念を学習できます：

- **カスタムフック**: `src/hooks/useChessGame.ts`
- **状態管理**: useStateとuseReducerの使い分け
- **パフォーマンス最適化**: React.memo、useMemo、useCallback

### 🚀 上級者向け

以下の高度な技術を実装しています：

- **複雑な状態管理**: チェスゲームの状態管理
- **TypeScript統合**: 型安全なReact開発
- **アーキテクチャ設計**: 保守性の高いコード構造

## 📖 学習リソース

詳細な学習ガイドを用意しています：

- **[LEARNING_GUIDE.md](./LEARNING_GUIDE.md)** - 段階的な学習ガイド
- **[CLAUDE.md](./CLAUDE.md)** - プロジェクトの技術仕様

## 🏗️ プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── ChessPiece.tsx   # 駒コンポーネント
│   ├── ChessSquare.tsx  # マスコンポーネント
│   ├── ChessBoard*.tsx  # ボードコンポーネント
│   ├── PlayerCard.tsx   # プレイヤー情報
│   ├── MoveHistory.tsx  # 移動履歴
│   └── ...
├── hooks/               # カスタムフック
│   └── useChessGame.ts  # ゲーム状態管理
├── types/               # TypeScript型定義
│   └── chess.ts         # チェス関連の型
├── utils/               # ユーティリティ関数
│   ├── chessLogic.ts    # チェスルール実装
│   ├── specialMoves.ts  # 特殊移動
│   └── notation.ts      # チェス記譜法
└── assets/              # 静的リソース
    └── pieces/          # 駒の画像
```

## 🎨 カスタマイズ例

このプロジェクトを拡張して、以下の機能を追加することができます：

- **⏱️ タイマー機能**: 各プレイヤーの持ち時間管理
- **🤖 AI対戦**: 簡単なチェスエンジンの実装
- **🌐 オンライン対戦**: WebSocketを使った対戦機能
- **🎵 サウンド効果**: 駒の移動音や効果音
- **📊 統計機能**: ゲーム結果の記録と分析
- **🌙 テーマ機能**: ダークモード、カスタムテーマ

## 🤝 コントリビューション

このプロジェクトへの貢献を歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で配布されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 💡 学習のコツ

1. **段階的に学習**: 基礎から応用へと順序立てて進める
2. **実際に動かす**: コードを変更して結果を確認
3. **デバッグツールを活用**: React DevToolsを使って内部状態を確認
4. **型安全性を重視**: TypeScriptの恩恵を最大限活用
5. **パフォーマンスを意識**: 最適化の効果を測定

## 🔗 参考リンク

- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/)
- [Vite公式ドキュメント](https://vitejs.dev/)
- [GitHub Pages](https://willowtown0576.github.io/chess-app/)

---

**Happy Learning! 🎉**

このプロジェクトがあなたのReact学習の助けになることを願っています。質問や提案がありましたら、お気軽にIssueを作成してください。