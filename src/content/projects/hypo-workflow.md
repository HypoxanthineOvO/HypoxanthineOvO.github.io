---
name: "Hypo-Workflow"
status: "active"
githubUrl: "https://github.com/HypoxanthineOvO/Hypo-Workflow"
period: "2026 — NOW"
category: "systems"
description: "文档和代码，一直对得上。一套给 Agent 项目的文档约定，加一个只读检查工具 hw：改了代码忘改文档，当场报警。"
group: productivity
tier: stable
icon: "/media/icons/hypo-workflow.webp"
version: "v3.0.0"
order: 3
featured: true
tech: ["Python","零依赖","7 种宿主"]
highlights:
  - { value: "4", label: "个文件管住全部文档" }
  - { value: "7", label: "种 Agent 宿主互相交接" }
  - { value: "0", label: "依赖" }
---

Hypo-Workflow 3.0 是一套面向 Agent 项目的文档约定，配合一个只读的检查工具 `hw`。它不规定 Agent 如何工作，只约束文档最终的形态，目标是让文档与代码始终保持一致。

使用 Agent 开发时，常见几类问题：每出一次错就在 AGENTS.md 中追加一条规则，文件越来越长、越来越少被遵守；文档命名不一、分散在多个目录，难以判断哪份为准；会话中断或额度耗尽后上下文丢失，更换模型又需重写总结；Agent 修改代码后遗漏同步文档。3.0 版本的判断是：模型已经足够强，约束不应继续增加。

## 六项设计

- **一张地图，四个文件**：`AGENTS.md` 记录通用工作方式，`RULES.md` 记录本项目的文档地图与规范，`STATUS.md` 记录进度，`BOARD.md` 供正在工作的 Agent 互相留言。`README.md` 只面向用户。
- **规则就近放置**：目录自身的规则写在该目录的 `AGENTS.md` 中，Agent 读到哪个目录就读到哪条规则。
- **只记录现在**：需求按功能分文件，规则变化时直接改写，历史交给 git。
- **提交即记录**：提交信息包含 `Feature`、`Code`、`Docs`、`Verified` 四个字段，`hw log` 可按功能检索全部历史。
- **BOARD 即交接**：额度用尽后，下一个 Agent 读取 BOARD 即可继续；`hw handoff` 能从 Codex、Claude、VSPi、Kimi Code、OpenCode、ZCode、DSH 七种宿主中找回最近的会话。
- **hw check**：机械地检查代码改动是否同步了文档，并检查提交格式、防御性表述、失效链接、混入 README 的进度与误提交的密钥文件。

## 安装

需要 Python 3.10+，无第三方依赖。

```bash
uv tool install git+https://github.com/HypoxanthineOvO/Hypo-Workflow
```

将 `skills/init/` 复制到 Agent 宿主的 skills 目录，然后在项目中说“用 Hypo-Workflow 接入这个项目”。Agent 会先扫描项目并给出接入方案，确认后再执行。

## 版本演进

| 代 | 时间 | 思路 |
|---|---|---|
| 1.x | 2026-04 至 05 | 提示词驱动的计划流水线 |
| 2.x | 2026-05 至 08 | runtime、manifest、hooks 门禁 |
| **3.0** | 2026-10 | 只管结果：文档和代码一直对得上 |
