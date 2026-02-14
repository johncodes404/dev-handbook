import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vitepress'

type SidebarLinkItem = {
  text: string
  link: string
}

function getMarkdownTitle(filePath: string, fallback: string): string {
  try {
    const content = readFileSync(filePath, 'utf8')
    const titleMatch = content.match(/^#\s+(.+)$/m)
    return titleMatch?.[1]?.trim() || fallback
  } catch {
    return fallback
  }
}

function collectSectionItems(sectionDir: string): SidebarLinkItem[] {
  const docsRoot = join(process.cwd(), 'docs')
  const sectionRoot = join(docsRoot, sectionDir)
  const items: SidebarLinkItem[] = []

  function walk(currentDir: string, relativeDir: string): void {
    const entries = readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue
      }

      if (entry.isDirectory()) {
        const nextRelative = relativeDir ? `${relativeDir}/${entry.name}` : entry.name
        walk(join(currentDir, entry.name), nextRelative)
        continue
      }

      if (!entry.isFile() || !entry.name.endsWith('.md')) {
        continue
      }

      const rawName = entry.name.slice(0, -3)
      const rawSlug = relativeDir ? `${relativeDir}/${rawName}` : rawName

      if (rawSlug === 'index') {
        continue
      }

      const encodedSlug = rawSlug
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/')
      const filePath = join(currentDir, entry.name)
      const fallbackTitle = rawName.replace(/[-_]/g, ' ')
      const title = getMarkdownTitle(filePath, fallbackTitle)

      items.push({
        text: title,
        link: `/${sectionDir}/${encodedSlug}`
      })
    }
  }

  walk(sectionRoot, '')

  return items.sort((a, b) => a.text.localeCompare(b.text, 'zh-Hans-CN'))
}

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
        {
          text: '技术教程',
          items: [{ text: '索引', link: '/tech-tutorials/' }, ...collectSectionItems('tech-tutorials')]
        }
      ],
      '/thinking/': [
        {
          text: '思考',
          items: [{ text: '索引', link: '/thinking/' }, ...collectSectionItems('thinking')]
        }
      ]
    }
  }
})
