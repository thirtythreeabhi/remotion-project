import {Config} from '@remotion/cli/config';
// Keep enough Chromium workers for crisp 1080p renders without exhausting 16GB RAM.
// This controls parallel browsers, not the CPU/RAM available to the host.
Config.setConcurrency(2);
