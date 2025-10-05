import { describe, it, expect, beforeAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import { parse } from '../../utils/html'
import {
  expectedSampleArticleMeta,
  expectedSampleArticleContent,
} from '../../fixtures/articles/expected-content'

/**
 * 記事ページのSSRテスト
 *
 * このテストでは以下を検証します：
 * 1. meta情報が正しく設定されているか
 * 2. bodyのコンテンツが期待値と一致するか
 *
 * 期待値は tests/fixtures/articles/expected-content.ts で定義
 */

// Nuxtサーバーを一度だけ起動（SSRモード）
await setup({ server: true })

describe('記事ページ (/articles/sample-article) SSRテスト', () => {
  let html: string
  let $: ReturnType<typeof parse>

  beforeAll(async () => {
    // テスト対象のページを取得
    html = await $fetch<string>('/articles/sample-article')
    $ = parse(html)
  })

  describe('基本的なHTML構造', () => {
    it('SSRでHTMLが正しくレンダリングされている', () => {
      expect($('html').length).toBeGreaterThan(0)
      expect($('body').length).toBeGreaterThan(0)
      expect(($('body').text() || '').length).toBeGreaterThan(0)
    })

    it('articleタグが存在する', () => {
      expect($('article.article').length).toBe(1)
    })
  })

  describe('メタ情報のテスト', () => {
    it('titleタグが期待値と一致する', () => {
      const title = $('title').text()
      expect(title).toBe(expectedSampleArticleMeta.title)
    })

    it('meta[name="description"]が期待値と一致する', () => {
      const description = $('meta[name="description"]').attr('content') || ''
      expect(description).toBe(expectedSampleArticleMeta.description)
    })

    it('meta[name="author"]が期待値と一致する', () => {
      const author = $('meta[name="author"]').attr('content') || ''
      expect(author).toBe(expectedSampleArticleMeta.author)
    })

    it('meta[name="keywords"]が期待値と一致する', () => {
      const keywords = $('meta[name="keywords"]').attr('content') || ''
      expect(keywords).toBe(expectedSampleArticleMeta.keywords)
    })

    it('meta[name="robots"]が期待値と一致する', () => {
      const robots = $('meta[name="robots"]').attr('content') || ''
      expect(robots).toBe(expectedSampleArticleMeta.robots)
    })

    it('canonical URLが期待値と一致する', () => {
      const canonical = $('link[rel="canonical"]').attr('href') || ''
      expect(canonical).toBe(expectedSampleArticleMeta.canonicalUrl)
    })

    it('OGP meta[property="og:title"]が期待値と一致する', () => {
      const ogTitle = $('meta[property="og:title"]').attr('content') || ''
      expect(ogTitle).toBe(expectedSampleArticleMeta.ogTitle)
    })

    it('OGP meta[property="og:description"]が期待値と一致する', () => {
      const ogDescription = $('meta[property="og:description"]').attr('content') || ''
      expect(ogDescription).toBe(expectedSampleArticleMeta.ogDescription)
    })

    it('OGP meta[property="og:type"]が期待値と一致する', () => {
      const ogType = $('meta[property="og:type"]').attr('content') || ''
      expect(ogType).toBe(expectedSampleArticleMeta.ogType)
    })

    it('Article meta[property="article:published_time"]が期待値と一致する', () => {
      const publishedTime =
        $('meta[property="article:published_time"]').attr('content') || ''
      expect(publishedTime).toBe(expectedSampleArticleMeta.articlePublishedTime)
    })

    it('Article meta[property="article:author"]が期待値と一致する', () => {
      const articleAuthor = $('meta[property="article:author"]').attr('content') || ''
      expect(articleAuthor).toBe(expectedSampleArticleMeta.articleAuthor)
    })
  })

  describe('コンテンツのテスト', () => {
    it('記事タイトル（h1）が期待値と一致する', () => {
      const title = $('.article-title').text().trim()
      expect(title).toBe(expectedSampleArticleContent.title)
    })

    it('著者名が期待値と一致する', () => {
      const author = $('.article-author').text().trim()
      expect(author).toBe(expectedSampleArticleContent.author)
    })

    it('公開日が期待値と一致する（フォーマット済み）', () => {
      const publishedDate = $('time').text().trim()
      expect(publishedDate).toBe(expectedSampleArticleContent.publishedDate)
    })

    it('datetime属性が正しい形式で設定されている', () => {
      const datetime = $('time').attr('datetime') || ''
      expect(datetime).toBe('2025-10-05')
    })

    it('記事の段落数が期待値と一致する', () => {
      const paragraphs = $('.article-paragraph')
      expect(paragraphs.length).toBe(expectedSampleArticleContent.paragraphs.length)
    })

    it('各段落のテキストが期待値と一致する', () => {
      const paragraphs = $('.article-paragraph')
      paragraphs.each((index, element) => {
        const text = $(element).text().trim()
        expect(text).toBe(expectedSampleArticleContent.paragraphs[index])
      })
    })

    it('タグの数が期待値と一致する', () => {
      const tags = $('.tag')
      expect(tags.length).toBe(expectedSampleArticleContent.tags.length)
    })

    it('各タグのテキストが期待値と一致する', () => {
      const tags = $('.tag')
      const tagTexts = tags
        .map((_, element) => $(element).text().trim())
        .get()
      expect(tagTexts).toEqual(expectedSampleArticleContent.tags)
    })
  })

  describe('コンテンツ全体の整合性チェック', () => {
    it('記事全体のテキストに全ての段落が含まれている', () => {
      const articleText = $('.article-content').text()
      expectedSampleArticleContent.paragraphs.forEach((paragraph) => {
        expect(articleText).toContain(paragraph)
      })
    })

    it('記事フッターにタグセクションが存在する', () => {
      const tagsSection = $('.article-footer .article-tags')
      expect(tagsSection.length).toBe(1)
    })
  })
})
