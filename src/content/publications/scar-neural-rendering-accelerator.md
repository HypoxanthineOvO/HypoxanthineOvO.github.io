---
title: "SCAR: A Neural Rendering Accelerator with Sparse-Aware Sampling and Conflict-Free Encoding"
authors:
  - Yunxiang He
  - Yongzhi Zhang
  - Quanyu Chen
  - Chaofan Li
  - Qihan Ding
  - Xin Lou
venue: ISCAS
year: 2026
pdfUrl: /files/SCAR-ISCAS2026.pdf
featured: true
---

SCAR is a specialized accelerator for implicit neural representation-based neural rendering, targeting the deployment bottlenecks on resource-constrained devices. We propose two key innovations: (1) a **sparse-aware sampling scheduler** that combines iterative preprocessing with projection-based sampling to boost ray–scene intersection efficiency; and (2) a **renumbered block-based memory access strategy** that eliminates bank conflicts during feature encoding to maximize memory throughput. SCAR is implemented in Verilog HDL with host-side scheduling and evaluated on a 40nm CMOS process. It achieves a **36× speedup** over the Jetson Xavier NX baseline, and delivers state-of-the-art energy efficiency with superior rendering speed compared to existing neural rendering accelerators.

Accepted as a Lecture presentation at **IEEE ISCAS 2026**, Shanghai, China, May 24–27, 2026.

**Keywords:** neural rendering, implicit representation, ray casting, hash encoding, real-time rendering