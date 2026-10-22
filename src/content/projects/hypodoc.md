---
name: "HypoDoc"
status: "active"
statusNote: "AI-first 文档系统"
cover: "/media/projects/hypodoc.webp"
githubUrl: "https://github.com/HypoxanthineOvO/HypoDoc"
period: "2026 — NOW"
category: "systems"
group: productivity
layer: ai-foundation
tier: stable
icon: "/media/icons/hypodoc.webp"
version: "v0.3.1"
order: 3
featured: true
tech: ["Agent Skill","Markdown","XeLaTeX","Beamer"]
description: "给 AI 用的专业文档排版 Skill：让 AI 直接调用现成的高审美版式体系，同一份 Markdown 同时输出精美网页、学术 PDF 与演示文稿。"
highlights:
  - { value: "3", label: "条命令出 Slides" }
  - { value: "3", label: "套 Slides 主题" }
  - { value: "v0.3", label: "LaTeX 专项版" }
---

HypoDoc 是一套面向中文写作的文档与演示文稿生成工具。作者只需撰写结构化的 Markdown，即可由同一份源文件生成排版规范的 PDF 文档、Beamer 演示文稿与网页，无需手工维护任何 LaTeX 代码。

工具在设计上考虑了与 AI 协作的场景：将仓库链接、素材与要求交给可执行终端命令的 AI，它即可按照文档完成环境准备、源文件撰写与构建。用户的工作集中在内容本身。

## 使用方式

```sh
hypolatex init slides.md --template slides --theme school
hypolatex doctor
hypolatex build slides.md
```

除演示文稿外，还提供长文（`document`）、短文（`article`）、课程笔记（`notes`）与技术报告（`report`）等模板。

## 演示文稿主题

- **`school`**：上海科技大学标识，完整章节导航与双层页脚，提供标准与斜切两种封面
- **`simple`**：浅色底、细线条，内容层级克制清晰
- **`nature`**：自然摄影封面，浅色几何正文背景

## 特点

- 源文件始终为可读、可编辑、可比对的 Markdown
- 一份源文件可输出文档、演示文稿与网页
- 内置环境检查，缺少依赖时给出明确的安装指引
