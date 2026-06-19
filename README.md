# Audio Swiss Knife

Audio Swiss Knife is a client-side web app for audio engineering calculators and references. It covers room acoustics, signal conversion, music theory, mastering, codecs, telecom, psychoacoustics, and speaker design.

The app has no backend. All tools are designed to run locally in the browser, with future project persistence handled through IndexedDB.

## Stack

- Next.js + TypeScript
- CSS Modules
- Zustand for UI state
- Recharts for future visualizations
- Math.js for calculation utilities
- idb for local IndexedDB storage

## Run Locally

From PowerShell:

```powershell
cd C:\Users\salon\Documents\WORKSPACE\TOOLS\audio-swiss-knife
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://127.0.0.1:3000
```

If Next.js cache errors appear, clean the generated build cache and start again:

```powershell
npm.cmd run clean
npm.cmd run dev
```

## Scripts

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

## Visual Modes

- Normal: professional Floure interface for clear technical work.
- Corrupted: experimental `0xF10VR_E` interface inspired by cyber-grimoire, CRT, firmware, sigils, runes, and dense terminal systems.

Technical tool names remain stable in both modes. The corrupted mode adds atmospheric metadata and visual language without changing the functional identity of the calculators.

## Deployment

This project is configured for static export and can be deployed to GitHub Pages or Vercel.

For GitHub Pages, the included workflow builds with:

```text
GITHUB_PAGES=true
```

This sets the correct base path for:

```text
https://SebMunZ.github.io/audio-swiss-knife/
```
