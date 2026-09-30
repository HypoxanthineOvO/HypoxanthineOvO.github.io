---
title: "我们组的研究生李宇轩开源了他本科四年积累的 LaTeX 库"
date: 2026-05-20
description: "我们组的研究生李宇轩开源了他本科四年积累的 LaTeX 库，项目名叫 LumosLaTeX。"
column: "研究与工程笔记"
status: archive
featured: true
cover: "/media/wechat/articles/lumoslatex-engineering/cover-v5-cn.png"
source: hypo-writer
platform: wechat
---
我们组的研究生李宇轩开源了他本科四年积累的 LaTeX 库，项目名叫 **LumosLaTeX**。

项目地址：

https://github.com/liyuxuan3003/LumosLaTeX

LumosLaTeX 不是单个 `.tex` 模板文件，而是一组围绕 LaTeX 写作整理出来的工程库。它把李宇轩在本科期间写课程笔记、技术文章、展示汇报和图表时反复使用的配置、文档类、宏包和构建脚本拆分成多个仓库，再通过一个主仓库统一索引。

主仓库中的 README 将这些子仓库分成几类：文档类、宏包、构建系统和模板。这样的组织方式使不同类型的 LaTeX 项目可以共享一套基础设施，而不是每次新建文档都重新复制前言区、字体设置、参考文献配置和编译规则。

更直观地说，这套库不是只停留在模板层面。李宇轩公开的其他 LaTeX 笔记仓库里，已经能看到它所服务的实际写作场景：计算机体系结构笔记中的 RISC-V 数据通路图、Cache 和内存结构图，固体物理笔记中的晶体结构和能态密度图，量子力学笔记中的势阱和谐振子波函数图。这些内容都不是截图拼贴，而是由 LaTeX/TikZ 或相关脚本生成并纳入笔记工程。

![RISC-V 流水线数据通路图](/media/wechat/articles/lumoslatex-engineering/ca-riscv-pipeline.png)

上图来自李宇轩的 ComputerArchitecture 笔记仓库。这个仓库是《计算机体系结构》的 LaTeX 笔记，README 中注明其内容基于 *Digital Design and Computer Architecture RISC-V Edition*。RISC-V 数据通路图这类内容很适合说明 LumosLaTeX 的使用背景：它需要同时管理文字说明、代码、公式、结构图和构建依赖，单纯复制一个模板很难长期维护。

## 项目包含什么

LumosLaTeX 的第一部分是文档类。它目前整理了面向不同写作场景的 LaTeX class，例如用于长文档和笔记的 `NotebookNeon`，用于文章的 `ArticleArgon`，用于幻灯片的 `BeamerBismuth`，以及用于独立图片编译的 `StandaloneSilicon`。这些文档类对中文写作中常见的字体、页边距、页眉页脚、标题样式、目录和超链接等内容做了预配置。

第二部分是宏包集合 `Minimus`。这是作者把长期写 LaTeX 时常用的命令和环境整理出来形成的宏包组，覆盖章节、正文、数学、浮动体、代码、彩色盒子、引用和参考文献等模块。对经常写理工科文档的人来说，这些模块可以减少反复维护前言区的工作量，也能让不同文档之间保持较一致的写作习惯。

第三部分是构建系统 `MakefileLaTeX`。它将主文档编译、图片编译和输出清理统一到 Makefile 中。除了常规 LaTeX 编译外，它也考虑了由 LaTeX、Python、Octave、Mathematica 等来源生成图表的情况，适合包含公式、代码、实验图和示意图的技术文档。

第四部分是面向使用者的模板仓库，例如 `NotebookNeonTemplate`、`ArticleArgonTemplate`、`BeamerBismuthTemplate`、`IEEETranTemplate` 和 `SI200MiniReviewTemplate`。这些模板提供了从空项目开始的目录结构和初始化脚本，使用者可以从一个具体模板启动自己的文档项目。

![内存结构图](/media/wechat/articles/lumoslatex-engineering/ca-memory-structure.png)

![Cache 映射示意图](/media/wechat/articles/lumoslatex-engineering/ca-cache-memory-map.png)

这些图同样来自 ComputerArchitecture 笔记。内存层级、Cache 映射这类示意图如果作为普通图片手工维护，后续修改会比较麻烦；用独立的 `.fig.tex` 文件维护，则可以和正文一起进入构建流程。LumosLaTeX 中的 `StandaloneSilicon` 和 `MakefileLaTeX` 正是服务于这类需求：图可以单独编译，也可以作为主文档的一部分被统一管理。

## 它提高了哪些环节的效率

首先是新建项目的效率。以文章模板为例，使用者可以克隆模板仓库，执行初始化脚本生成自己的项目目录。初始化过程会完成项目重命名、子模块加载和远程引用调整。之后进入项目目录运行 `make -j` 即可编译。这个流程减少了手动搭建 LaTeX 项目结构的重复工作。

其次是配置复用的效率。字体、目录、页眉页脚、代码块、定理环境、参考文献等配置如果散落在不同项目中，后续维护会比较困难。LumosLaTeX 将这些内容分别放在文档类和宏包中，使多个模板能够复用同一套基础配置。

第三是图文协同的效率。技术文档中经常需要同时维护正文、公式、代码和图表。`MakefileLaTeX` 将图表生成纳入构建流程，有助于减少“正文已经更新但图没有重新生成”这类问题。对于课程笔记、实验报告和研究文档，这种统一构建方式会更稳定。

第四是长期维护的效率。LumosLaTeX 采用多个子仓库拆分不同职责，模板、文档类、宏包和构建脚本可以分别更新。对于持续写作的人来说，这种结构比在每个项目里复制一份配置更容易维护。

## 从笔记里能看到的实际效果

除了计算机体系结构，李宇轩还公开了固体物理、量子力学、大学物理等 LaTeX 笔记仓库。这些仓库能更具体地展示他本科阶段的整理方式：不是只记文字，而是把推导、图像和排版都放进同一个文档系统。

![固体物理晶胞示意图](/media/wechat/articles/lumoslatex-engineering/solid-crystal-cell.png)

![固体物理能态密度图](/media/wechat/articles/lumoslatex-engineering/solid-density-of-states.png)

固体物理笔记中的晶胞、能态密度等图示，体现的是另一类需求：公式和物理图像需要紧密配合。用 LaTeX/TikZ 或绘图脚本生成图，可以让符号、字体、标注方式和正文保持一致，也方便在后续复习或修改笔记时重新生成。

![量子力学无限深势阱波函数图](/media/wechat/articles/lumoslatex-engineering/qm-infinite-well.png)

![量子力学谐振子波函数图](/media/wechat/articles/lumoslatex-engineering/qm-harmonic-oscillator.png)

量子力学笔记中的势阱、谐振子波函数图，也说明这套工具并不限于计算机方向。只要文档中需要大量公式、图示和编号引用，统一的宏包和构建方式就会减少重复劳动。LumosLaTeX 可以看作是这些笔记经验进一步整理后的结果。

## 适合哪些使用场景

如果需要写长期课程笔记或研究笔记，可以从 `NotebookNeonTemplate` 开始。它更适合章节较多、需要目录、图表目录、代码目录和参考文献的长文档。

如果需要写课程报告、技术文章或短篇论文式文档，可以使用 `ArticleArgonTemplate`。它的结构相对轻，适合中短篇中文技术写作。

如果需要做中文技术汇报，可以使用 `BeamerBismuthTemplate`。它基于 Beamer 整理了标题页、目录页、章节内容和参考文献等常用结构。

如果文档中需要维护独立编译的示意图或技术图，可以结合 `StandaloneSilicon` 和 `MakefileLaTeX` 使用，将图的生成也纳入项目构建。

## 从哪里开始

第一次使用时，不需要一次理解所有子仓库。可以先根据写作场景选择一个模板仓库，例如文章模板或笔记模板，按照 README 中的说明初始化项目，再逐步查看它依赖的文档类、宏包和构建脚本。

LumosLaTeX 的主要价值在于，它把一个长期 LaTeX 使用者在笔记、文章、幻灯片和图表写作中积累下来的配置和流程整理成了可复用的开源工程。对于需要经常写 LaTeX 文档的同学，尤其是理工科写作者，这个项目可以作为直接使用的模板，也可以作为整理个人 LaTeX 写作系统的参考。

项目地址：

https://github.com/liyuxuan3003/LumosLaTeX
