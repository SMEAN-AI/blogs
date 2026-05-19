---
title: "Introducing Smean 2.0: faster, more accurate Khmer transcription"
excerpt: "We're excited to announce the next generation of our Khmer speech-to-text engine with 30% improved accuracy."
date: 2026-01-15
category: Product
readingMin: 4
---

Smean 2.0 retrains our acoustic and language models on **12,000 hours**
of Cambodian audio — meetings, interviews, clinic visits, and street
recordings across every major dialect.

## What changed

The result: word error rate drops from **4.2%** to **1.8%** on clean
audio, and from **11%** to ~**6%** on noisy field recordings. Latency
is down 40% thanks to a redesigned decoder.

- New acoustic model trained on Phnom Penh, Battambang, Siem Reap,
  Kampot, and Khmer Surin dialects
- Word-error rate benchmarked against a held-out corpus of 200 hours
  spanning news, meetings, and clinical interviews
- Decoder rewritten in Rust — same model, half the latency

## Rolling out

We're rolling this out to all paid plans today; free-tier users will
see it next week. No action required — your existing transcripts will
re-process at the higher accuracy on next access if you opt in.
