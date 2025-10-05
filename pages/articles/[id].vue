<template>
  <article class="article">
    <header class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <time :datetime="article.publishedAt">{{ formatDate(article.publishedAt) }}</time>
        <span class="article-author">{{ article.author }}</span>
      </div>
    </header>

    <div class="article-content">
      <p v-for="(paragraph, index) in article.content" :key="index" class="article-paragraph">
        {{ paragraph }}
      </p>
    </div>

    <footer class="article-footer">
      <div class="article-tags">
        <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const articleId = route.params.id as string

// 実際のプロジェクトではAPIから取得するが、ここではサンプルデータを使用
const article = ref({
  id: articleId,
  title: 'Nuxt 3のSSRテストベストプラクティス',
  author: '山田太郎',
  publishedAt: '2025-10-05',
  tags: ['Nuxt3', 'SSR', 'Testing', 'Vitest'],
  content: [
    'Nuxt 3でSSRのテストを書く際には、@nuxt/test-utilsとVitestを組み合わせることで効率的なテストが可能です。',
    'この記事では、meta情報のテストとbodyコンテンツの検証方法について解説します。',
    'テストデータは定数ファイルとして管理することで、メンテナンス性が向上します。',
  ],
})

// メタタグの設定
useHead({
  title: article.value.title,
  meta: [
    { name: 'description', content: article.value.content[0] },
    { name: 'author', content: article.value.author },
    { name: 'keywords', content: article.value.tags.join(', ') },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.content[0] },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: article.value.publishedAt },
    { property: 'article:author', content: article.value.author },
  ],
  link: [
    { rel: 'canonical', href: `https://example.com/articles/${articleId}` },
  ],
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.article {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.article-header {
  margin-bottom: 2rem;
}

.article-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.article-content {
  line-height: 1.8;
  margin-bottom: 2rem;
}

.article-paragraph {
  margin-bottom: 1rem;
}

.article-footer {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
}
</style>
