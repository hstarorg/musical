import { defineConfig } from 'vitepress';

const base = process.env.DOCS_BASE || '/';

export default defineConfig({
  title: 'Musical',
  description: '你的私人音乐空间',
  base,
  head: [['link', { rel: 'icon', type: 'image/png', href: `${base}logo.png` }]],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '下载', link: '/download' },
      { text: 'GitHub', link: 'https://github.com/hstarorg/musical' },
    ],
    footer: {
      message: '基于 MIT 许可发布',
      copyright: '© 2026 Musical',
    },
  },
});
