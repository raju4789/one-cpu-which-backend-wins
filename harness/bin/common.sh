# Shared helpers for the harness scripts. Sourced, not run.
# macOS ships bash 3.2, so nothing here needs bash 4.
set -euo pipefail

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$(cd "$HARNESS_DIR/.." && pwd)"

BENCH_PROFILE=bench        # the "$12 box": 1 vCPU, 2 GB
MONITOR_PROFILE=monitor    # Prometheus + Grafana, outside the test budget
BENCH_CTX="colima-$BENCH_PROFILE"
MONITOR_CTX="colima-$MONITOR_PROFILE"

# Each VM gets its own IP on the Mac (colima --network-address). Load and
# scraping go to those IPs directly, never through Colima's port forwarding:
# that is a user-space proxy which uses the bench VM's CPU and collapsed
# after a few hundred connections in testing.
colima_ip() {
  local ip
  ip="$(colima list --json 2>/dev/null | jq -r --arg p "$1" \
        '(if type == "array" then .[] else . end) | select(.name == $p) | .address // empty' 2>/dev/null | head -1)"
  if [ -z "$ip" ]; then
    ip="$(colima ssh --profile "$1" -- ip -4 -o addr show col0 2>/dev/null | awk '{print $4}' | cut -d/ -f1)"
  fi
  printf '%s' "$ip"
}
if [ -z "${BASE_URL:-}" ]; then
  BENCH_IP="$(colima_ip "$BENCH_PROFILE")"
  BASE_URL="${BENCH_IP:+http://$BENCH_IP:8080}"
fi
if [ -z "${PROM_URL:-}" ]; then
  MONITOR_IP="$(colima_ip "$MONITOR_PROFILE")"
  PROM_URL="${MONITOR_IP:+http://$MONITOR_IP:9090}"
fi
need_urls() {
  [ -n "$BASE_URL" ] && [ -n "$PROM_URL" ] || fail "a VM has no IP address; run harness/bin/vm-up"
}
CALIBRATE_IMAGE=alpine:3.20@sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc     # pinned by bin/pin-images

bench()   { docker --context "$BENCH_CTX" "$@"; }
monitor() { docker --context "$MONITOR_CTX" "$@"; }

log()  { printf '==> %s\n' "$*"; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# stacks/<name> for real stacks, harness/<name> for the dummy app
stack_dir() {
  if [ -f "$REPO_DIR/stacks/$1/compose.yaml" ]; then echo "$REPO_DIR/stacks/$1"
  elif [ -f "$HARNESS_DIR/$1/compose.yaml" ]; then echo "$HARNESS_DIR/$1"
  else fail "no compose.yaml for stack '$1' in stacks/ or harness/"
  fi
}

bench_compose() {
  local dir; dir="$(stack_dir "$1")"; shift
  STACK_DIR="$dir" docker --context "$BENCH_CTX" compose \
    -f "$HARNESS_DIR/compose.yaml" -f "$dir/compose.yaml" "$@"
}

psql_admin() {
  bench exec -i bench-postgres-1 psql -U bench -d bench -v ON_ERROR_STOP=1 -X -q "$@"
}

# Runs k6 with metrics pushed to Prometheus. Latency goes as native histograms,
# so Grafana can compute exact percentiles across endpoints. Every metric is
# tagged with the stack and phase started by bin/up.
k6_run() {
  local stack=unknown phase=unknown
  if [ -f "$HARNESS_DIR/.run-info" ]; then . "$HARNESS_DIR/.run-info"; stack="$STACK"; phase="$PHASE"; fi
  need_urls
  K6_PROMETHEUS_RW_SERVER_URL="$PROM_URL/api/v1/write" \
  K6_FEATURES=native-histograms \
  K6_PROMETHEUS_RW_PUSH_INTERVAL=5s \
  BASE_URL="$BASE_URL" \
    k6 run -o experimental-prometheus-rw --tag stack="$stack" --tag phase="$phase" "$@"
}
