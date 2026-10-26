# Results

Raw output of every benchmark run, written by [`harness/bin/run`](../harness/README.md#run-the-benchmark). Nothing here is edited by hand.

```
results/<stack>/<phase>/<timestamp>/
├── summary.md              the run at a glance: result, ramp, overload, server usage
├── result.json             every number in summary.md, and more
├── env.json                laptop, macOS, Colima, k6 and image digests
├── k6-<test>.log           k6 output for each part of the run
└── k6-<test>-summary.json  k6's own end-of-test numbers for each part
```

Each `summary.md` also has a **Validity checks** table: every check with its measured value, so you can see why a run counts. Unattended batches add `results/batches/<timestamp>/` with `summary.md` (every run, medians and checks per run) and `SHA256SUMS`, committed straight after the batch. Check nothing changed since with `shasum -a 256 -c results/batches/<timestamp>/SHA256SUMS`.

The headline number of a run is in `summary.md` under **Result**: the highest rate that held the pass criteria for 5 minutes. The numbers come from k6's own summary of the 5-minute confirm, not from Grafana.
