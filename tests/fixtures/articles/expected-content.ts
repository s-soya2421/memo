/**
 * 記事コンテンツのテスト用定数
 * SSRテストで期待値として使用
 */

export interface ExpectedArticleMeta {
  title: string
  description: string
  author: string
  keywords: string
  robots: string
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogType: string
  articlePublishedTime: string
  articleAuthor: string
}

export interface ExpectedArticleContent {
  title: string
  author: string
  publishedDate: string
  tags: string[]
  paragraphs: string[]
}

/**
 * 記事ID: sample-article の期待されるメタ情報
 */
export const expectedSampleArticleMeta: ExpectedArticleMeta = {
  title: 'Nuxt 3のSSRテストベストプラクティス',
  description:
    'Nuxt 3でSSRのテストを書く際には、@nuxt/test-utilsとVitestを組み合わせることで効率的なテストが可能です。',
  author: '山田太郎',
  keywords: 'Nuxt3, SSR, Testing, Vitest',
  robots: 'index, follow',
  canonicalUrl: 'https://example.com/articles/sample-article',
  ogTitle: 'Nuxt 3のSSRテストベストプラクティス',
  ogDescription:
    'Nuxt 3でSSRのテストを書く際には、@nuxt/test-utilsとVitestを組み合わせることで効率的なテストが可能です。',
  ogType: 'article',
  articlePublishedTime: '2025-10-05',
  articleAuthor: '山田太郎',
}

/**
 * 記事ID: sample-article の期待されるコンテンツ
 */
export const expectedSampleArticleContent: ExpectedArticleContent = {
  title: 'Nuxt 3のSSRテストベストプラクティス',
  author: '山田太郎',
  publishedDate: '2025年10月5日',
  tags: ['Nuxt3', 'SSR', 'Testing', 'Vitest'],
  paragraphs: [
    'Nuxt 3でSSRのテストを書く際には、@nuxt/test-utilsとVitestを組み合わせることで効率的なテストが可能です。',
    'この記事では、meta情報のテストとbodyコンテンツの検証方法について解説します。',
    'テストデータは定数ファイルとして管理することで、メンテナンス性が向上します。',
  ],
}

/**
 * 複数記事のテストケースを追加する場合の例
 */
export const expectedArticles = {
  'sample-article': {
    meta: expectedSampleArticleMeta,
    content: expectedSampleArticleContent,
  },
  // 他の記事を追加する場合
  // 'another-article': {
  //   meta: expectedAnotherArticleMeta,
  //   content: expectedAnotherArticleContent,
  // },
} as const

/**
 * 記事IDの型
 */
export type ArticleId = keyof typeof expectedArticles
