# テストディレクトリ構成ガイド

Nuxt 3 SSRアプリケーションのテストディレクトリ構成と、vitest + @nuxt/test-utils を使ったテストのベストプラクティスをまとめています。

## ディレクトリ構成

```
tests/
├── fixtures/           # テスト用の定数・モックデータ
│   └── articles/      # 記事関連のフィクスチャ
│       └── expected-content.ts  # 期待されるコンテンツ定義
├── pages/             # ページ単位のSSRテスト
│   ├── articles/      # 記事ページのテスト
│   │   └── article.ssr.spec.ts
│   └── top.ssr.spec.ts
├── e2e/               # E2Eテスト（フルブラウザ等）
│   ├── canonical.spec.ts
│   └── cheerio.spec.ts
├── smoke/             # スモークテスト（本番環境との比較等）
│   └── ssr-compare.spec.ts
└── utils/             # テスト用ユーティリティ
    └── html.ts        # HTML解析・正規化関数
```

## 各ディレクトリの役割

### `fixtures/`
テストで使用する定数データやモックデータを格納します。

**メリット:**
- テストコードから期待値を分離し、可読性が向上
- 複数のテストで同じ期待値を再利用できる
- 期待値の変更が一箇所で済む（メンテナンス性向上）
- 型定義により、期待値の構造を明確化

**命名規則:**
- `expected-*.ts` - 期待される値を定義
- `mock-*.ts` - モックデータを定義

**例:**
```typescript
// tests/fixtures/articles/expected-content.ts
export const expectedSampleArticleMeta = {
  title: '記事タイトル',
  description: '記事の説明',
  // ...
}
```

### `pages/`
ページ単位のSSRテストを格納します。主にメタ情報とコンテンツの検証を行います。

**テストの種類:**
- メタタグ（title, description, OGP等）の検証
- Bodyコンテンツの検証
- 構造的な要素（h1, article等）の存在確認

**命名規則:**
- `*.ssr.spec.ts` - SSRモードでのテスト
- ページのディレクトリ構造に合わせる
  - `pages/articles/[id].vue` → `tests/pages/articles/article.ssr.spec.ts`

**例:**
```typescript
// tests/pages/articles/article.ssr.spec.ts
import { setup, $fetch } from '@nuxt/test-utils'
import { parse } from '../../utils/html'
import { expectedSampleArticleMeta } from '../../fixtures/articles/expected-content'

await setup({ server: true })

describe('記事ページSSRテスト', () => {
  it('titleが期待値と一致する', async () => {
    const html = await $fetch<string>('/articles/sample-article')
    const $ = parse(html)
    expect($('title').text()).toBe(expectedSampleArticleMeta.title)
  })
})
```

### `e2e/`
エンドツーエンドテストを格納します。複数ページにまたがる検証や、ユーザーフロー全体のテストを行います。

**使用例:**
- フォーム送信からリダイレクトまでのフロー
- ナビゲーションの動作確認
- 外部サービスとの連携テスト

### `smoke/`
スモークテスト（基本的な動作確認）を格納します。

**使用例:**
- 本番環境とローカル環境の比較
- 重要なページが正しくレンダリングされるか
- ビルド後の基本動作確認

### `utils/`
テスト全般で使用するユーティリティ関数を格納します。

**既存ユーティリティ:**
- `parse(html)` - cheerioでHTMLをパースし、不要な要素を削除
- `normalizeHtml(html)` - HTML文字列を正規化（本番との比較用）

## テストの書き方ガイド

### 1. 基本的なSSRテストの構造

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import { parse } from '../../utils/html'

// Nuxtサーバーを起動（SSRモード）
await setup({ server: true })

describe('ページ名 SSRテスト', () => {
  let html: string
  let $: ReturnType<typeof parse>

  // 全テストの前に一度だけHTML取得
  beforeAll(async () => {
    html = await $fetch<string>('/path/to/page')
    $ = parse(html)
  })

  describe('メタ情報', () => {
    it('titleが正しい', () => {
      expect($('title').text()).toBe('期待値')
    })
  })

  describe('コンテンツ', () => {
    it('h1が正しい', () => {
      expect($('h1').text()).toBe('期待値')
    })
  })
})
```

### 2. fixturesを使った期待値管理

**Step 1: fixturesファイルを作成**
```typescript
// tests/fixtures/your-page/expected-content.ts
export interface ExpectedMeta {
  title: string
  description: string
}

export const expectedPageMeta: ExpectedMeta = {
  title: 'ページタイトル',
  description: 'ページの説明',
}
```

**Step 2: テストでfixturesをインポート**
```typescript
// tests/pages/your-page/page.ssr.spec.ts
import { expectedPageMeta } from '../../fixtures/your-page/expected-content'

it('titleが期待値と一致する', () => {
  expect($('title').text()).toBe(expectedPageMeta.title)
})
```

### 3. メタ情報のテストパターン

```typescript
describe('メタ情報', () => {
  it('title', () => {
    expect($('title').text()).toBe(expected.title)
  })

  it('meta[name="description"]', () => {
    expect($('meta[name="description"]').attr('content')).toBe(expected.description)
  })

  it('canonical URL', () => {
    expect($('link[rel="canonical"]').attr('href')).toBe(expected.canonicalUrl)
  })

  it('OGP og:title', () => {
    expect($('meta[property="og:title"]').attr('content')).toBe(expected.ogTitle)
  })

  it('robots', () => {
    expect($('meta[name="robots"]').attr('content')).toBe(expected.robots)
  })
})
```

### 4. コンテンツのテストパターン

```typescript
describe('コンテンツ', () => {
  it('タイトル（h1）', () => {
    expect($('h1').text().trim()).toBe(expected.title)
  })

  it('段落数', () => {
    expect($('.paragraph').length).toBe(expected.paragraphs.length)
  })

  it('各段落の内容', () => {
    $('.paragraph').each((index, element) => {
      expect($(element).text().trim()).toBe(expected.paragraphs[index])
    })
  })

  it('特定のテキストが含まれる', () => {
    expect($('.content').text()).toContain('キーワード')
  })
})
```

## ベストプラクティス

### ✅ DO（推奨）

1. **fixturesで期待値を管理**
   - テストコードと期待値を分離
   - 型定義で構造を明確化

2. **beforeAllでHTML取得を一度だけ実行**
   - パフォーマンス向上
   - テスト間の依存を減らす

3. **セレクタにクラス名を使用**
   - ページ構造の変更に強い
   - `.article-title` など意味のある名前を使用

4. **describeでグループ化**
   - メタ情報、コンテンツなどカテゴリ別に整理
   - テスト結果が読みやすくなる

5. **trim()で空白を削除**
   - `.text().trim()` で前後の空白を除去
   - 空白の差分でテストが落ちるのを防ぐ

### ❌ DON'T（非推奨）

1. **期待値をテストコードにハードコード**
   - メンテナンス性が低下
   - 複数箇所で同じ値を重複定義

2. **各テストでHTML取得**
   - パフォーマンスが悪化
   - 不要なサーバーリクエスト

3. **脆弱なセレクタの使用**
   - `:nth-child(2)` など位置ベースのセレクタ
   - ページ構造の変更で壊れやすい

4. **一つのテストで複数の検証**
   - どこで失敗したか分かりにくい
   - テストの意図が不明確

## 実行コマンド

```bash
# 全テスト実行
npm test

# Watchモード（開発時）
npm run test:watch

# 特定のテストファイルのみ実行
npx vitest run tests/pages/articles/article.ssr.spec.ts

# 特定のdescribeブロックのみ実行
npx vitest run -t "メタ情報"
```

## トラブルシューティング

### テストが落ちる場合

1. **空白の問題**
   - `text().trim()` を使用しているか確認
   - `parse()` 関数が空白を正規化しているか確認

2. **セレクタの問題**
   - ブラウザの開発者ツールで実際のHTMLを確認
   - クラス名が正しいか、typoがないか確認

3. **SSRとCSRの違い**
   - `setup({ server: true })` でSSRモードになっているか確認
   - クライアントサイドでのみ動作するコードはテストできない

### パフォーマンスの問題

1. **beforeAllを活用**
   - HTML取得は各describeで1回だけ

2. **並列実行**
   - vitestはデフォルトで並列実行
   - `--no-threads` で無効化可能

## 参考リソース

- [Nuxt Test Utils 公式ドキュメント](https://nuxt.com/docs/getting-started/testing)
- [Vitest 公式ドキュメント](https://vitest.dev/)
- [Cheerio 公式ドキュメント](https://cheerio.js.org/)
