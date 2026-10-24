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

The headline number of a run is in `summary.md` under **Result**: the highest rate that held the pass criteria for 5 minutes. The numbers come from k6's own summary of the 5-minute confirm, not from Grafana.
