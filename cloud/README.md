# Cloud harness: the same benchmark on a real $12 droplet

Runs the benchmark on DigitalOcean instead of the Mac: the stack on a Basic droplet with 1 vCPU and 2 GB (the "$12 box"), and k6, Prometheus and Grafana on a second, bigger droplet in the same data centre.

**The Mac harness is not changed.** Everything here only prepares the droplets so that `harness/bin/run` and `harness/bin/batch` run on them as they are. The k6 scripts, stacks, contract, Postgres and Nginx configs are the same files for both. You can run on the Mac, in the cloud, or both.

## How it fits together

| | Mac | Cloud |
| --- | --- | --- |
| Server under test | Colima VM, 1 vCPU, 2 GB, arm64 | Droplet `one-cpu-bench`, 1 shared vCPU, 2 GB, x86 |
| k6, Prometheus, Grafana | the Mac and a monitor VM | droplet `one-cpu-loadgen`, 8 vCPU, 16 GB |
| Load goes to | the bench VM's IP (`BASE_URL`) | the bench droplet's private IP (`BASE_URL`) |
| Docker on the server | context `colima-bench` (Colima) | context `colima-bench` (SSH to the droplet) |
| Results | `results/` | `results-cloud/` |

`harness/bin/common.sh` reads `BASE_URL` and `PROM_URL` from the environment when they're set, and talks to the server's Docker through the context named `colima-bench`. On loadgen that context points at the bench droplet over SSH, so the harness never knows the difference.

## One-time setup on the Mac

1. Create a DigitalOcean account at https://cloud.digitalocean.com.
2. Install the command-line tools: `brew install doctl jq`
3. Create an API token: in the control panel, API, then Generate New Token, with read and write scope. Copy it.
4. Log in: `doctl auth init`, and paste the token when asked. Check with `doctl account get`.
5. Add your SSH key, so the droplets accept your Mac: `doctl compute ssh-key import mac --public-key-file ~/.ssh/id_ed25519.pub` (no key yet? `ssh-keygen -t ed25519` first).

## A test session

Push the branch and tags first: loadgen clones them from GitHub.

```
git push origin <branch> --tags
cloud/bin/create                         # both droplets, about 1 minute; billing starts
cloud/bin/setup                          # waits for installs, connects them, starts monitoring
cloud/bin/start spring none --quick      # one run, same options as harness/bin/run
cloud/bin/start-batch harness/batches/spring-final.txt   # or a batch
cloud/bin/status                         # follow it; Ctrl-B then D leaves it running
cloud/bin/tunnel                         # Grafana at http://localhost:3000 while it runs
cloud/bin/collect                        # results into results-cloud/
cloud/bin/destroy                        # delete both droplets: billing stops
```

Runs go on in a `tmux` session on loadgen, so the Mac can sleep or disconnect.

## Cost

Billed per second while the droplets exist, whether or not a run is going.

| Droplet | Size | Per month | Per hour |
| --- | --- | --- | --- |
| `one-cpu-bench` | `s-1vcpu-2gb` | $12 | about $0.018 |
| `one-cpu-loadgen` | `s-8vcpu-16gb` | $96 | about $0.143 |

A 12-hour batch costs about $2. Check current prices on DigitalOcean's pricing page; `BENCH_SIZE`, `LOADGEN_SIZE` and `REGION` (default `ams3`) override the defaults.

## How cloud results differ

- **A separate dataset.** x86 instead of arm64, a shared vCPU instead of dedicated cores, a real network. Compare stacks within the cloud runs, never a cloud number with a Mac number.
- **The calibration warning doesn't apply.** The runner compares each run's CPU benchmark with `harness/calibration-reference`, the Mac's score. In the cloud it may warn or stay quiet for the wrong reason. Compare cloud runs' `calibration_seconds` with each other instead; a shared vCPU can vary, so a run far off the others is worth repeating.
- **The "Mac" metrics are loadgen's.** The runner's check that k6 isn't short of CPU reads the Prometheus job named `mac`; in the cloud that job scrapes loadgen. The Mac-only checks (firewall, memory compression, sleep) are skipped off macOS.
- **The droplet's own CPU, disk and network are recorded.** A shared vCPU can lose time to other customers on the same host, the disk is network storage, and the containers' numbers show neither. The bench droplet runs node_exporter (cpu, load, pressure, disk, network and memory only, well under 1% of the core). `cloud/bin/collect` writes two files next to each run's `result.json` and prints a one-line summary per run: `steal.json` (average steal, the worst minute, one value per minute) and `bench.json` (every 15 s: CPU by mode including iowait and steal, disk busy share and throughput, CPU, disk and memory pressure, network bytes, TCP retransmits, listen-queue overflows, available memory). High steal points at a noisy neighbour, high iowait or disk busy at the network disk, retransmits or overflows at the network: not a slow stack. Every run also gets `panels.json`: the Grafana dashboard's own queries every 5 s (p95, p99, requests/s and errors by endpoint, CPU and memory per container, virtual users, the DB pool) and when each k6 test started and ended, which is what the post charts are drawn from. All three are saved before `destroy`, because Prometheus lives on loadgen and goes with it.
- **The bench droplet runs almost nothing else.** Automatic updates are off and DigitalOcean's monitoring agent is not installed. The one extra is the minimal node_exporter for steal, a fraction of a percent of the core.

## What the cloud runs showed

The full batch (`results-cloud/batches/20261104-161056`: every stack and setup, 3 interleaved rounds, 33 runs, all valid) and a diagnosis run (`results-cloud/spring/none/20261105-195947`) on a `s-1vcpu-2gb` bench droplet with a `s-4vcpu-8gb` load generator, in ams3.

**The droplet is CPU-bound, and far slower than the Mac.** Without a cache, every stack held about 90 to 150 req/s, against 1,200 to 2,400 on the Mac: about 20 times less, not the 4 times the CPU benchmark suggests. During the diagnosis run's 5-minute hold at 106 sessions/s, the droplet's core was 81 to 86% busy, and processes waited for CPU 58 to 67% of the time:

| Share of the one core | Diagnosis hold |
| --- | --- |
| Kernel (system + softirq), mostly network packet handling | 33 to 35% |
| The apps (user: Spring, Postgres, Nginx) | 37 to 41% |
| Steal (the host's other customers) | 5 to 9% |
| Idle | 14 to 19% |

A third of the one core goes to the kernel moving packets, on top of a slower shared core and steal. That's what this $12 droplet is like, not a fault in the setup.

**Disk and network were checked and are not the limit.** Disk busy 12 to 22%, iowait 2 to 5%, TCP retransmits and listen-queue overflows about zero (`bench.json`).

**Steal was recorded for every run.** 1 to 10% on average per run, up to about 26% in the worst minute, higher in the batch's last round. Low on its own, but it varies minute to minute, and with it what each run gets.

**Runs vary up to 3 times for the same configuration** (tuned Spring without a cache: 44, 100, 138 req/s; the diagnosis run 148). The shared host is the cause, and the setup can't remove it. Every stack ran interleaved on the same droplets, so the noise hit all of them equally; the batch's medians and ranges are the result.

**The harness's "server CPU" undercounts on a droplet.** It comes from the containers' own CPU accounting (cAdvisor), which misses kernel work not charged to a container and steal. In the batch it showed 50 to 70% at failing steps while the droplet was over 80% busy. On a droplet, read `bench.json` for the real CPU. (On the Mac's VM this gap is small: dedicated cores, no steal.)

**What the batch supports.** With a cache the ranking is clear and the same as on the Mac: Spring (app 430, Nginx 590 req/s) ahead of Node (224, 358) ahead of Rails (99, 239). Spring never ran out of memory in the cloud, at these much lower loads. Without a cache all five configurations sit at 92 to 128 req/s with overlapping ranges: a tie, and tuning made no visible difference. Recovery after overload: Node 11 of 12 runs, Spring 10 of 12, Rails 3 of 9.

## Files

| File | Runs on | Does |
| --- | --- | --- |
| `bin/create`, `bin/destroy` | Mac | Create or delete both droplets and their firewall |
| `bin/setup` | Mac | Connects loadgen to the bench droplet, clones the repo, starts monitoring |
| `bin/start`, `bin/start-batch`, `bin/status`, `bin/tunnel`, `bin/collect` | Mac | Start, follow, view and fetch runs |
| `bin/steal-report` | loadgen | Writes each run's CPU steal (`steal.json`), the bench droplet's CPU, disk and network (`bench.json`) and the dashboard's time series (`panels.json`), called by `collect` |
| `bin/sync-bench` | loadgen | Keeps a copy of the repo on the bench droplet at the same path and commit: the harness's compose file mounts repo files, and Docker looks for them on the machine running the containers |
| `bin/remote-run`, `bin/monitoring-up` | loadgen | Call the harness with the cloud addresses; start Prometheus and Grafana |
| `init/bench.sh`, `init/loadgen.sh` | droplets, at creation | Install Docker, k6 and the kernel settings |
| `monitoring/` | loadgen | The Prometheus config aimed at the bench droplet |
