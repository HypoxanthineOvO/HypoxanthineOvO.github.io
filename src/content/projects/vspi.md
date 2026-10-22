---
name: "VSPi"
status: "active"
statusNote: "自维护 agent core，每天在用"
githubUrl: "https://github.com/HypoxanthineOvO/VSPi"
period: "2026 — NOW"
category: "systems"
group: productivity
layer: ai-foundation
tier: stable
icon: "/media/icons/vspi.webp"
version: "v3.0-pre"
order: 1
featured: true
tech: ["TypeScript","Agent Core","Multi-Model","Goal"]
description: "深入研究 Agent 实现机制、融合各家模型特性打造的终端编码底座：规划、执行、审查各派最合适的模型，后台常驻随时续接。"
highlights:
  - { value: "1800+", label: "次提交" }
  - { value: "47", label: "个发布版本" }
  - { value: "5 个月", label: "从零到 v2.8" }
---

VSPi 是一款终端编码助手，基于 Kimi Code 引擎演进而来。它的核心设计是**前后端分离**：会话、模型配置与后台任务由常驻进程统一承载，终端界面与非交互命令仅通过本机 IPC 接入。因此，关闭终端不会中断正在执行的任务，用户可在任意时刻、任意终端续接原有会话。

在此基础上，VSPi 支持**多模型协作**。一个任务可以拆分给若干 subagent 并行处理，每个 subagent 独立配置模型：规划能力强的模型负责拆解，编码能力强的模型负责实现，审查严格的模型负责把关。各子对话与后台任务均可单独查看。

项目自 2026 年 5 月启动，至今累计提交 1800 余次、发布 47 个版本，是作者日常科研、写作与开发的主要工具。

## 主要功能

- **后台常驻**：任务在后台进程中持续运行，终端仅作为交互前端；`vspi continue` 可随时续接最近的会话。
- **Subagent 协作**：子任务可配置独立模型，子对话与后台任务状态分别可见。
- **长程目标**：通过 `/goal` 设定可验收的目标，由系统自行规划、定时自检并持续推进。
- **模型接入**：支持内置服务商、任意兼容端点，以及 VSPLab 中转站的动态模型目录。
- **脚本集成**：`vspi exec` 以非交互方式执行，支持文本、JSON 与 JSONL 输出。

## 快速开始

需要 Node.js ≥ 22.19.0，从 [Releases](https://github.com/HypoxanthineOvO/VSPi/releases) 下载安装包后：

```sh
vspi init      # 配置服务商与默认模型
vspi           # 启动
vspi continue  # 继续最近的会话
vspi exec "说明当前仓库的测试入口"   # 非交互执行
```
