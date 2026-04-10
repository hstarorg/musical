import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Musical',
  description: '你的私人音乐空间',
  base: '/musical/',
  head: [['link', { rel: 'icon', type: 'image/png', href: '/musical/logo.png' }]],
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
