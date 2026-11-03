# Shared helpers for the cloud scripts, run on the Mac. Sourced, not run.
# The Mac harness (harness/) is not touched: the cloud scripts set up two
# droplets so that harness/bin/run and harness/bin/batch run unchanged on one
# of them. See cloud/README.md.
set -euo pipefail

CLOUD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$(cd "$CLOUD_DIR/.." && pwd)"

REGION="${REGION:-ams3}"
IMAGE="${IMAGE:-ubuntu-24-04-x64}"
BENCH_SIZE="${BENCH_SIZE:-s-1vcpu-2gb}"      # the $12 box: 1 shared vCPU, 2 GB
LOADGEN_SIZE="${LOADGEN_SIZE:-s-8vcpu-16gb}" # k6, Prometheus, Grafana
TAG=one-cpu-bench
BENCH_NAME=one-cpu-bench
LOADGEN_NAME=one-cpu-loadgen
REPO_URL="${REPO_URL:-https://github.com/raju4789/one-cpu-which-backend-wins.git}"
REMOTE_REPO=/root/one-cpu-which-backend-wins
SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -o LogLevel=ERROR)

log()  { printf '==> %s\n' "$*"; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

need() { command -v "$1" >/dev/null 2>&1 || fail "$1 not found. $2"; }
need doctl "Install it: brew install doctl, then doctl auth init (cloud/README.md)"
need jq "Install it: brew install jq"

# droplet_ip <name> <public|private>
droplet_ip() {
  doctl compute droplet list "$1" -o json |
    jq -r --arg t "$2" '.[0].networks.v4[]? | select(.type == $t) | .ip_address' | head -1
}
loadgen_ip() { local ip; ip="$(droplet_ip "$LOADGEN_NAME" public)"; [ -n "$ip" ] || fail "no $LOADGEN_NAME droplet: run cloud/bin/create"; echo "$ip"; }
on_loadgen() { ssh "${SSH_OPTS[@]}" "root@$(loadgen_ip)" "$@"; }
