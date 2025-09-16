# Nuxt 3 + Vitest テストメモ

Nuxt 3 と Vitest を使った実例とハマりどころのメモです。`nuxt3-sample/` に最小構成の Nuxt アプリを置き、`tests/` にテストを配置しています。

- 本番 URL（例: `https://sample.com`）から取得した HTML と、テストでレンダリングした結果を比較
- 比較対象は主に `body` の中身と、`meta`（特に `robots` の `noindex` 判定）
- 実行にはネットワークアクセスと依存関係のインストールが必要です

## セットアップ

```
cd vitest
# 依存をインストール（pnpm / npm / yarn のいずれか）
pnpm i

# テスト実行
pnpm test
```

> 注意: 本メモはサンプルです。実プロジェクトの `pages/index.vue` に合わせてテスト内のパスや期待値を調整してください。

## ハマりどころメモ

- head/meta のテスト: Nuxt 3 は `@unhead` を使います。`useHead()` で設定した meta を SSR で検証するには、`@nuxt/test-utils` で実アプリを起動し、`renderPage('/')` から HTML を取得してパースすると安定します。
- 文字列比較の正規化: HTML 比較時は空白や改行、動的スクリプト（`#__NUXT` など）を除去してから比較するのが安全です。
- 本番 HTML との差分: 解析用タグ、A/B テスト、広告スクリプトなどで差分が出やすいです。`normalizeHtml()` で影響の大きい差を吸収し、クリティカルな要素（`body` テキスト、title/description、robots）を重点比較する方針にすると壊れにくいです。
- jsdom/happy-dom: シンプルなユニットは `jsdom` で十分ですが、Nuxt の SSR 比較は `@nuxt/test-utils` で SSR した HTML を扱うのが簡単です。
- ネットワーク依存: 本番比較系のテストは E2E に近いので、CI ではスキップか、モックモードを併用すると安定します。

## 構成

- `nuxt3-sample/`: 最小の Nuxt 3 アプリ（`pages/index.vue` で meta を設定）
- `tests/meta-and-body-compare.spec.ts`: 本番 HTML とローカル SSR HTML を比較するテスト
- `vitest.config.ts`: `jsdom` 環境やエイリアス設定
- `package.json`: テスト用依存とスクリプト

