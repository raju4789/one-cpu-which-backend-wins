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
- **The droplet's own CPU, disk and network are recorded.** A shared vCPU can lose time to other customers on the same host, the disk is network storage, and the containers' numbers show neither. The bench droplet runs node_exporter (cpu, load, pressure, disk, network and memory only, well under 1% of the core). `cloud/bin/collect` writes two files next to each run's `result.json` and prints a one-line summary per run: `steal.json` (average steal, the worst minute, one value per minute) and `bench.json` (every 15 s: CPU by mode including iowait and steal, disk busy share and throughput, CPU, disk and memory pressure, network bytes, TCP retransmits, listen-queue overflows, available memory). High steal points at a noisy neighbour, high iowait or disk busy at the network disk, retransmits or overflows at the network: not a slow stack. They're saved before `destroy`, because Prometheus lives on loadgen and goes with it.
- **The bench droplet runs almost nothing else.** Automatic updates are off and DigitalOcean's monitoring agent is not installed. The one extra is the minimal node_exporter for steal, a fraction of a percent of the core.

## Files

| File | Runs on | Does |
| --- | --- | --- |
| `bin/create`, `bin/destroy` | Mac | Create or delete both droplets and their firewall |
| `bin/setup` | Mac | Connects loadgen to the bench droplet, clones the repo, starts monitoring |
| `bin/start`, `bin/start-batch`, `bin/status`, `bin/tunnel`, `bin/collect` | Mac | Start, follow, view and fetch runs |
| `bin/steal-report` | loadgen | Writes each run's CPU steal (`steal.json`) and the bench droplet's CPU, disk and network (`bench.json`), called by `collect` |
| `bin/sync-bench` | loadgen | Keeps a copy of the repo on the bench droplet at the same path and commit: the harness's compose file mounts repo files, and Docker looks for them on the machine running the containers |
| `bin/remote-run`, `bin/monitoring-up` | loadgen | Call the harness with the cloud addresses; start Prometheus and Grafana |
| `init/bench.sh`, `init/loadgen.sh` | droplets, at creation | Install Docker, k6 and the kernel settings |
| `monitoring/` | loadgen | The Prometheus config aimed at the bench droplet |
