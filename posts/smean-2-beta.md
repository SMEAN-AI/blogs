---
title: "Smean 2.0 is in beta — new design, faster transcription, and a redesigned workspace"
excerpt: "We're opening Smean 2.0 to early users. A redrawn design system, a workspace built around how you actually work, and accuracy improvements across every Khmer dialect."
date: 2026-05-20
category: Product
readingMin: 5
---

Today we're opening **Smean 2.0 beta** to early users.

It's not just a model update. The whole product has been redrawn around what we've learned from a year of running the service in production — what people actually do with transcripts, where the old UI got in the way, and what was missing for teams larger than two or three people.

## What's new

### A new design system

The 2.0 surface is built on a refreshed design system: editorial type pairings, a 4px grid, semantic color tokens that swap cleanly across light/dark and across our product slots (Scribe, Studio). Every surface — onboarding, the workspace, the marketing site — speaks the same visual language now.

If you want the long version, skim our landing page. If you want the short version: things are quieter, more readable, and the buttons finally line up.

### A redesigned workspace

Notes used to be a list. In 2.0 the workspace is a real working surface — search across every transcript, pin the ones you're actively using, jump from a quote in a summary back to the exact timestamp in the audio. The redesigned right-side panel keeps your audio context next to whatever you're writing so you don't lose your place.

### Updated features

- **Speaker diarization** that doesn't get confused by code-switching between Khmer and English in the same sentence
- **AI summaries** with per-section anchors back to the underlying audio
- **Exports** in Word, PDF, and court-ready XML, plus a clean Markdown export for blog drafting
- **Workspaces** for teams — shared transcripts, role-based access, audit logs
- **Mobile recording** that uploads in the background and recovers cleanly from spotty connectivity
- **Khmer–English mixed audio** handled natively — no need to pick a language

### Still in-country

Data residency is unchanged. Servers stay in Phnom Penh, audio never leaves Cambodia, keys are rotated quarterly. SOC 2 Type II audit is in progress.

## How to join the beta

The 2.0 beta is rolling out to all existing accounts this week. Free-tier users will see it next week. No action required — your existing transcripts will reprocess at the higher accuracy on next access if you opt in.

If you're new to Smean, sign up at [smean.ai](https://smean.ai) and you'll land on 2.0 by default. Your first 15 minutes are on us, no card required.

## What's coming

A handful of things didn't make the beta cut and are scheduled for the GA release:

- A public REST API for transcription and summarization
- Native Zoom and Google Meet integrations
- On-device redaction for clinical workflows
- A desktop app for offline recording

We'll write about each of these as they ship. Subscribe to the [blog](/blog) for updates, or send beta feedback to feedback@smean.ai — we read everything.
