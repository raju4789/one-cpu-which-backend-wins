# Cloud results

Runs on DigitalOcean droplets (cloud/README.md), kept apart from the Mac's `results/`. A separate dataset: compare stacks within these runs, never a cloud number with a Mac number. Every folder is raw and unedited, as `cloud/bin/collect` copied it.

| What | Where |
| --- | --- |
| **The full cloud batch**: 11 configurations x 3 runs, interleaved, 4 to 5 November 2026 | `batches/20261104-161056/summary.md` and the 33 run folders it lists |
| **The diagnosis run**: tuned Spring, no cache, with the droplet's disk and network recorded, 5 November | `spring/none/20261105-195947` (its `bench.json`) |
| Smoke tests before the batch (quick runs, not results) | `node/none/*-quick`, `rails/none/*-quick`, `spring/none/*-quick`, `batches/20261104-054709` |
| A batch stopped by accident after 3 minutes (Ctrl-C), not a result | `batches/20261104-160550`, `node/none/20261104-160550` |

Each run folder has `steal.json` (CPU steal per minute). Runs from the diagnosis on also have `bench.json`: the bench droplet's own CPU by mode, disk, network and memory, every 15 s. Findings: cloud/README.md, "What the cloud runs showed".
