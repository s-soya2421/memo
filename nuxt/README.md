## Nuxt 3 Starter (memo)

- Dev server: `pnpm dev` or `npm run dev`
- Build: `pnpm build`
- Preview: `pnpm preview`
- Static generate: `pnpm generate`

### Test (Vitest)

- 実行: `pnpm test`（ウォッチは `pnpm test:watch`）
- 設定: `vitest.config.ts` は `@nuxt/test-utils/config` を使用
- サンプル: `tests/ssr.spec.ts` は SSR HTML を検証（`$fetch('/')`）
  - DOM レベル: `tests/dom/index.dom.spec.ts` は `@vue/test-utils` + `jsdom` でページをマウント

### テスト状態フラグ（isTest）

- 目的: テスト時のみログ無効化などの分岐に利用
- 参照方法:
  - `useRuntimeConfig().public.isTest`（boolean）
  - `const { $isTest } = useNuxtApp()`（プラグイン `plugins/flags.ts` が提供）
- 判定基準: `process.env.VITEST` または `process.env.NUXT_TEST` が真
- 例（ロガー）:
  ```ts
  const { $isTest } = useNuxtApp()
  const log = (...args: any[]) => { if (!$isTest) console.log('[app]', ...args) }
  ```

### Setup

1. Node.js 18+ 推奨（`.nvmrc` 参照）
2. 依存をインストール
   - pnpm: `pnpm i`
   - npm: `npm i`
3. 開発サーバ起動: `pnpm dev`

### 仕様メモ

- Nuxt 3 を最小構成で導入（追加モジュールなし）
- `app.vue` で簡易レイアウト、`pages/index.vue` をトップページとして作成
- `runtimeConfig.public.appName` をヘッダに表示

### よくある追加

- Tailwind CSS: `@nuxtjs/tailwindcss` を `modules` に追加
- ESLint/Prettier: ルートの設定に合わせて導入
- テスト: `@nuxt/test-utils`, `vitest` など
