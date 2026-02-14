import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: { time: number; string: string }
}

declare const data: Record<string, Post[]>
export { data }

export default createContentLoader('**/*.md', {
  includeSrc: true, 
  transform(raw): Record<string, Post[]> {
    const posts: Record<string, Post[]> = {
      'tech-tutorials': [],
      'thinking': []
    }

    raw
      .filter(({ url }) => url !== '/' && !url.endsWith('/') && !url.endsWith('/index.html'))
      .forEach(({ url, frontmatter, src }) => {
        let category = 'other'
        if (url.includes('/tech-tutorials/')) category = 'tech-tutorials'
        else if (url.includes('/thinking/')) category = 'thinking'

        if (category === 'other') return

        // Try to get title from frontmatter or first # line
        let title = frontmatter.title
        if (!title && src) {
          const match = src.match(/^#\s+(.*)$/m)
          if (match) {
            title = match[1]
          }
        }
        if (!title) {
            title = url.split('/').pop()?.replace(/.html$/, '') || 'Untitled'
        }

        posts[category].push({
          title,
          url,
          date: {
            time: frontmatter.date ? +new Date(frontmatter.date) : 0,
            string: frontmatter.date ? new Date(frontmatter.date).toLocaleDateString() : ''
          }
        })
      })

    return posts
  }
})
