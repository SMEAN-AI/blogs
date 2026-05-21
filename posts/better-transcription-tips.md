---
title: "5 tips for getting better transcription results"
excerpt: "Small habits at the recording stage do more for accuracy than any model upgrade we can ship. Here's what we tell our users."
date: 2026-01-05
category: Tutorial
readingMin: 3
---

We get asked a lot about how to squeeze more accuracy out of SMEAN — usually right before someone uploads a two-hour meeting recorded on a phone left face-down on a table. The honest answer is that what happens *before* the file reaches us matters more than anything we do on the model side. A few small habits during recording move accuracy further than most model upgrades.

## 1. Record at 16kHz mono or higher

Phone defaults are fine for most situations. The trouble starts with heavy compression — anything below 64kbps and the model starts losing the high-frequency detail it needs to tell similar Khmer phonemes apart. If your recorder offers WAV or FLAC, prefer it over MP3 for anything you actually care about. The file is bigger; the transcript is better.

## 2. One microphone per speaker, when you can

Two laptops in the same room beat one in the middle. A boardroom mic on the ceiling sounds professional but flattens everyone into the same blurred channel, which makes diarization harder. If a single recorder is your only option, put it closer to the *quieter* speaker — the loud one will carry regardless.

## 3. Tell us how many speakers to expect

SMEAN auto-detects speakers, but if you set the speaker count in advance, the labels stay consistent across the meeting and you avoid the case where one person gets split into "Speaker 2" and "Speaker 4" after a long pause. For recurring meetings with the same team, this is the single highest-leverage setting.

## 4. Watch the background music

Subtitle-style overlays from a video are fine — they're in a separate channel and we handle them. What hurts is loud Khmer pop or a TV playing in the same room as the conversation. Music with vocals is the worst case because the model has to decide which voice to follow. If you can't control the environment, run the audio through a free noise-suppression tool before uploading.

## 5. Don't pre-translate code-switched meetings

Cambodian meetings switch between Khmer and English constantly, and that's fine — leave it. SMEAN is built for that boundary. Where people get into trouble is manually rewriting their English sentences into Khmer (or the reverse) before uploading, thinking it'll be "cleaner." It isn't. It confuses the language model, and it confuses whoever reads the transcript later, because it no longer matches what was actually said.

If you're hitting accuracy issues that none of the above fixes, send the file through anyway and flag the segment — we use those cases to improve the model for everyone.
