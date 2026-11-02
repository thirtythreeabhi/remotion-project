# TalentStream AI — Local Remotion project

This is the dedicated host-side video workspace, separate from the TalentStream application and the public `mcp-workspace` server.

## Contents

- `src/talentstream.tsx`: editable React/Remotion animation compositions
- `src/root.tsx`: registers `TalentStreamOpening` (10s) and `TalentStreamV4` (62s)
- `public/narration.mp3`: 61.04s ElevenLabs recording
- `public/instrumental.wav`: original TalentStream instrumental score
- `out/`: generated renders (the render MCP rejects overwrites)

The 10-second opening is an initial implementation. The 62-second composition is **only a draft placeholder**, not a finished film.

## Start on native Ubuntu

The remotion MCP host-install tool (`video_remotion_install_start`) installs the exact declared packages into this project when the installed MCP server is restarted with `MCP_WORKSPACE_REMOTION_HOST_ENABLED=1`. The tool is separate from the offline nanosandbox and returns a persistent job ID.

Alternatively, from a regular Ubuntu terminal that can reach npm:

```bash
cd ~/Downloads/remotion-project
npm install --ignore-scripts --no-audit --no-fund
npm run studio
```

Render the opening locally:

```bash
npx remotion render src/index.ts TalentStreamOpening out/talentstream-opening.mp4 --browser-executable=/usr/bin/google-chrome --codec=h264 --crf=17
```

Remotion package version: 4.0.539 (pinned in package.json). No per-job CPU, memory, Node heap, concurrency, or render-duration flags are passed by the host worker. Ubuntu still governs scheduling, real RAM and process resources. **The offline terminal sandbox has separate provider-enforced limits.**

The audio and candidate profiles are fictional/sample assets for promotional visualization; no private production data was used.

Remotion may require a paid license for some commercial organizations: https://www.remotion.dev/license
