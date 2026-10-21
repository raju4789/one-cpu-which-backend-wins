# Shared helpers for the harness scripts. Sourced, not run.
# macOS ships bash 3.2, so nothing here needs bash 4.
set -euo pipefail

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_DIR="$(cd "$HARNESS_DIR/.." && pwd)"

BENCH_PROFILE=bench        # the "$12 box": 1 vCPU, 2 GB
MONITOR_PROFILE=monitor    # Prometheus + Grafana, outside the test budget
BENCH_CTX="colima-$BENCH_PROFILE"
MONITOR_CTX="colima-$MONITOR_PROFILE"
BASE_URL="${BASE_URL:-http://localhost:8080}"

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
