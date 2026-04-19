# REBUILD F 报告

## 1. 改动文件列表

- `src/lib/site.ts`
- `src/components/Hero.astro`
- `src/pages/about.astro`
- `src/pages/rss.xml.js`

## 2. Hero tagline 新旧对照

- 旧：
  - `Hypoxanthine (Yunxiang He)`
- 新：
  - 第一行：`Hypoxanthine (Yunxiang He)`
  - 第二行：`ShanghaiTech · VSPLab · Cryo Computing × AI Acceleration`

## 3. About 新旧对照

- 旧版为占位型简介，内容以“旧 Hexo about stub + 轻量版介绍”为主，且包含过时研究描述与错误姓氏来源。
- 新版已整体替换为定稿正文，明确：
  - 中文姓名：`贺云翔`
  - 英文名：`Yunxiang He`
  - 实验室：`VSPLab`
  - 导师：`Xin Lou`
  - 研究轨迹：`NeRF / 3D Gaussian Splatting -> Cryo Computing × AI Acceleration`
  - 站点定位：研究与工程记录 + 随笔与练习 + Hypo-* 项目生态
- About 页底部新增「在哪里找到我」结构化块，共 5 条：
  - GitHub
  - 邮箱
  - 发表
  - 项目
  - RSS

## 4. 验证结果

### 命令验证

- `pnpm astro check`
  - 结果：`0 errors / 0 warnings`
  - 备注：仍有既有脚本文件的 hints，不影响本轮交付
- `pnpm build`
  - 结果：通过
  - 备注：`/rss.xml` 生成成功，未出现 XML 错误

### 本地路由校验

- `http://127.0.0.1:4321/` -> `200`
- `http://127.0.0.1:4321/about` -> `200`

### 本地内容命中校验

- 首页命中：
  - `Hypoxanthine (Yunxiang He)`
  - `ShanghaiTech · VSPLab · Cryo Computing × AI Acceleration`
- About 页命中：
  - `贺云翔`
  - `VSPLab`
  - `Xin Lou`
  - `Cryo Computing × AI Acceleration`
  - `在哪里找到我`
  - `HypoxanthineOvO`
  - `hyx021203@163.com`
  - `/publications`
  - `/projects`
  - `/rss.xml`

### cheerio 静态断言

- `dist/about/index.html`
  - 命中：`贺云翔`
  - 命中：`VSPLab`
  - 命中：`Xin Lou`
  - 命中：`Cryo Computing`
- `dist/index.html`
  - 命中：`ShanghaiTech · VSPLab · Cryo Computing × AI Acceleration`
- About 联系方式块
  - `contact-items=5`
- 全仓 grep
  - `何云翔`：未命中
  - `He Yunxiang`：未命中

## 5. 遗留待人工项

- None
