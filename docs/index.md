---
layout: doc
---

<script setup>
import { data as posts } from './posts.data.ts'
import { withBase } from 'vitepress'
</script>

# LogicLoom

只专注写作，其余自动化完成。

## 🛠️ 技术教程

<ul v-if="posts['tech-tutorials'] && posts['tech-tutorials'].length">
  <li v-for="post in posts['tech-tutorials']" :key="post.url">
    <a :href="withBase(post.url)">{{ post.title }}</a>
  </li>
</ul>
<div v-else>暂无文章</div>

## 💡 思考

<ul v-if="posts['thinking'] && posts['thinking'].length">
  <li v-for="post in posts['thinking']" :key="post.url">
    <a :href="withBase(post.url)">{{ post.title }}</a>
  </li>
</ul>
<div v-else>暂无文章</div>
