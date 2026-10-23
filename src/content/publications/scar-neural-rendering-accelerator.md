---
title: "SCAR: A Neural Rendering Accelerator with Sparse-Aware Sampling and Conflict-Free Encoding"
description: "面向神经渲染的硬件加速器，通过稀疏感知采样和无冲突编码，提高渲染速度与能效。"
authors:
  - Yunxiang He
  - Chaofan Li
  - Yongzhi Zhang
  - Qihan Ding
  - Quanyu Chen
  - Xin Lou
venue: "IEEE International Symposium on Circuits and Systems (ISCAS)"
year: 2026
# pdf 文件尚未入库，拿到正式版后补 /files/Papers/SCAR-ISCAS2026.pdf
featured: true
---

SCAR is a specialized accelerator for implicit neural representation-based neural rendering, targeting the deployment bottlenecks on resource-constrained devices. We propose two key innovations: (1) a **sparse-aware sampling scheduler** that combines iterative preprocessing with density-aware sampling to boost ray casting efficiency; and (2) a **renumbered block-based memory access strategy** that eliminates bank conflicts during feature encoding to maximize memory throughput. SCAR is implemented in Verilog HDL with host-side scheduling and evaluated on a 40nm CMOS process. It achieves a **36× speedup** over the Jetson Xavier NX baseline, and delivers state-of-the-art energy efficiency with superior rendering speed compared to existing neural rendering accelerators.

Accepted as a Lecture presentation at **IEEE ISCAS 2026**, Shanghai, China, May 24–27, 2026.

**Keywords:** neural rendering, implicit representation, ray casting, hash encoding, real-time rendering
