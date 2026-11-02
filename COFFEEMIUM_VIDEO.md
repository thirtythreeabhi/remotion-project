# Coffeemium — Fiverr Portfolio Video

This video is a portfolio demonstration of Abhijeet's custom e-commerce development skills. Coffeemium is not a real coffee company or a commercial product.

## Generated artifacts
- Final render: out/Coffeemium-Fiverr-Abhijeet-Final.mp4
- Source: src/coffeemium-fiverr.tsx
- Narration: public/coffeemium/narration.mp3 (Samar ElevenLabs, 49.319125s)
- Transcript draft: coffeemium-transcript.txt (unverified against the recording)
- Alignment script: coffeemium_align.py
- Timing data: out/Coffeemium-voice-alignment.json

## Rendering
Composition ID: CoffeemiumFiverr, 1920 × 1080, 30 FPS, 1480 frames.

Run from the remotion-project folder:
    ./node_modules/.bin/remotion studio src/index.ts
    ./node_modules/.bin/remotion render src/index.ts CoffeemiumFiverr out/Coffeemium-Fiverr-v2.mp4 --browser-executable=/usr/bin/google-chrome --codec=h264 --crf=17

The original TalentStream compositions are preserved and registered separately.

## Timing
Exact rendered scene frame cuts: [0, 109, 326, 533, 722, 908, 1041, 1246, 1375, 1480].
The scene boundaries are near detected speech pauses, not exact spoken-word timestamps.
The maximum offset between an internal scene boundary and the nearest detected silence midpoint is approximately 0.16 seconds.
FFmpeg silence thresholds are -33 dB, with minimum silence duration 0.18 seconds.

## Getting actual word-level timestamps
ElevenLabs Forced Alignment requires API credentials. With credentials available in the host environment:
    ELEVENLABS_API_KEY=... python3 coffeemium_align.py
The script stores the returned word alignment in out/Coffeemium-voice-alignment.json.
Without that key, the script uses FFmpeg pause detection and correctly marks word-level alignment unavailable.

## Design
Uses imagery from the original Coffeemium repository; animated storefront UI recreations, product matching, personalization, bundle/cart concepts, administration and original Abhijeet CTA.
Demo checkout is explicitly labeled test mode; no real orders or payments are implied.
