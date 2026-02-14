import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/dev-handbook/',
  title: "Jayden's LogicLoom",
  description: '深度思考，终身学习',
  themeConfig: {
    nav: [
      { text: '技术教程', link: '/tech-tutorials/' },
      { text: '思考', link: '/thinking/' }
    ],
    sidebar: {
      '/tech-tutorials/': [
        { text: '技术教程', items: [{ text: '索引', link: '/tech-tutorials/' }] }
      ],
      '/thinking/': [
        { text: '思考', items: [{ text: '索引', link: '/thinking/' }] }
      ]
    }
  }
})
