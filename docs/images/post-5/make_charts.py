"""Post 5 charts (Spring Boot), drawn from panels-data.json (export_panels.py), in the
style of posts 3 and 4: same panels, same axis scales, times from the run's own clock.

02-tuned-no-cache.png has post 3/4's exact layout: the 5-minute hold, the overload and
the recovery. The three crash charts show the coarse ramp up to the crash and add a fifth
row, memory by container, since memory is what failed. 05-three-stacks-recovery.png puts
tuned Node (post 3), Rails (post 4) and tuned Spring, all without a cache, on one scale.
Run: python3 make_charts.py
"""
import json
from collections import defaultdict
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = Path(__file__).parent
D = json.loads((HERE / "panels-data.json").read_text())
TITLES = {"01-untuned-crash": "Untuned Spring, no cache: killed for running out of memory",
          "02-tuned-no-cache": "Tuned Spring, no cache",
          "03-app-cache-crash": "Tuned Spring, app cache: killed for running out of memory",
          "04-nginx-cache-crash": "Tuned Spring, Nginx cache: killed for running out of memory"}
NAME = {"app": "Spring", "postgres": "Postgres", "nginx": "Nginx", "whole VM": "Whole server"}
COL = {"Spring": "#6a3d9a", "Postgres": "#1f77b4", "Nginx": "#2ca02c", "Whole server": "#555555",
       "p95": "#2171b5", "p99": "#08306b", "All requests": "black",
       "GET /feed": "#1f77b4", "POST /posts": "#ff7f0e", "POST /posts/:id/like": "#9467bd",
       "Node": "#1f77b4", "Rails": "#c0392b"}
plt.rcParams.update({"font.size": 13, "axes.spines.top": False, "axes.spines.right": False})


def total(ser):
    sums = defaultdict(float)
    for _, pts in ser:
        for t, y in pts:
            sums[t] += y
    return sorted(sums.items())


def line(ax, name, pts, scale=1.0, **kw):
    ax.plot([x / 60 for x, _ in pts], [y * scale for _, y in pts], label=name,
            color=COL.get(name), lw=kw.pop("lw", 2.0), **kw)


def base_panels(axes, p):
    ax = axes[0]
    line(ax, "All requests", total(p["10"]), lw=2.6)
    for n, pts in p["10"]: line(ax, n, pts, lw=1.5)
    ax.set_ylim(0, 7000); ax.set_ylabel("Requests / s")
    ax = axes[1]
    for n, pts in p["9"]: line(ax, n, [(t, max(y, 1e-4)) for t, y in pts], scale=1000)
    ax.set_yscale("log"); ax.set_ylim(0.1, 60000); ax.set_ylabel("Latency (ms, log)")
    ax.axhline(300, color="#d62728", lw=1, ls=":")
    ax.text(1.0, 300, "300 ms rule ", transform=ax.get_yaxis_transform(), ha="right", va="bottom", color="#d62728", fontsize=10)
    ax = axes[2]
    for n, pts in p["12"]: line(ax, n, pts, scale=100)
    ax.set_ylim(-3, 105); ax.set_ylabel("Errors (%)")
    ax = axes[3]
    for n, pts in p["16"]:
        n = NAME.get(n, n)
        line(ax, n, pts, scale=100, ls="--" if n == "Whole server" else "-", lw=1.4 if n == "Whole server" else 2.0)
    ax.set_ylim(0, 105); ax.set_ylabel("CPU (% of the one core)")


def finish(fig, axes, key, v, xmax):
    for ax in axes:
        ax.grid(alpha=0.3)
        ax.legend(loc="upper left", frameon=False, ncol=5, fontsize=11)
    axes[-1].set_xlabel("Minutes"); axes[-1].set_xlim(0, xmax)
    fig.suptitle(f"{TITLES[key]}  ·  {v['day']}, {v['from'][:5]} to {v['to'][:5]}",
                 x=0.01, ha="left", fontsize=17, fontweight="bold")
    fig.tight_layout()
    fig.savefig(HERE / f"{key}.png", dpi=100, facecolor="white")
    plt.close(fig)


# The tuned run: post 3/4's exact layout and phases.
key, v = "02-tuned-no-cache", D["02-tuned-no-cache"]
fig, axes = plt.subplots(4, 1, figsize=(16, 15), sharex=True)
base_panels(axes, v["panels"])
ov = v["overload_start"]
spans = [(45, 345, "5-minute hold", "#2ca02c"), (345, ov + 45, "cool-down", "#bbbbbb"),
         (ov + 45, ov + 165, "2 min at 1.5x", "#d62728"), (ov + 165, ov + 285, "back to normal", "#1f77b4")]
for i, ax in enumerate(axes):
    for a, b, label, c in spans:
        ax.axvspan(a / 60, b / 60, color=c, alpha=0.10)
        if i == 0:
            ax.text((a + b) / 120, 1.02, label, transform=ax.get_xaxis_transform(), ha="center", va="bottom", fontsize=11)
finish(fig, axes, key, v, 13.2)

# The crashes: the coarse ramp, its steps, and memory.
for key in ("01-untuned-crash", "03-app-cache-crash", "04-nginx-cache-crash"):
    v = D[key]
    fig, axes = plt.subplots(5, 1, figsize=(16, 18), sharex=True)
    base_panels(axes, v["panels"])
    ax = axes[4]
    for n, pts in v["panels"]["mem"]:
        n = NAME.get(n, n)
        line(ax, n, pts, scale=1e-6, ls="--" if n == "Whole server" else "-", lw=1.4 if n == "Whole server" else 2.0)
    ax.axhline(2048, color="#d62728", lw=1, ls=":")
    ax.text(1.0, 2048, "the VM's 2 GB ", transform=ax.get_yaxis_transform(), ha="right", va="bottom", color="#d62728", fontsize=10)
    ax.set_ylim(0, 2200); ax.set_ylabel("Memory (MB)")
    crash = v["crash_at"] / 60
    steps = v["steps"]
    for i, ax in enumerate(axes):
        for s, (rate, rps, passed) in enumerate(steps):
            if s % 2 == 0:
                ax.axvspan(s, s + 1, color="#000000", alpha=0.03)
            if i == 0 and rate >= 256:
                ax.text(s + 0.5, 1.02, f"{rate}", transform=ax.get_xaxis_transform(), ha="center", va="bottom",
                        fontsize=10, color="#d62728" if not passed else "black")
        ax.axvline(crash, color="#d62728", lw=2)
    axes[0].text(crash, 6600, " Java killed:\n out of memory", color="#d62728", fontsize=12, va="top", fontweight="bold")
    axes[0].text(0, 1.02, "sessions/s per 1-minute step:", transform=axes[0].get_xaxis_transform(),
                 ha="left", va="bottom", fontsize=10)
    finish(fig, axes, key, v, v["seconds"] / 60)

# Three stacks, no cache: p95 through the overload and back.
N = json.loads(Path("/mnt/user-data/uploads/projects/one-cpu-which-backend-wins/docs/images/post-3/panels-data.json").read_text())["02-tuned"]
R = json.loads(Path("/mnt/user-data/uploads/projects/one-cpu-which-backend-wins/docs/images/post-4/panels-data.json").read_text())["01-no-cache"]
S = D["02-tuned-no-cache"]
fig, ax = plt.subplots(figsize=(16, 7))
ov = S["overload_start"]
for a, b, label, c in [(45, 345, "5-minute hold", "#2ca02c"), (345, ov + 45, "cool-down", "#bbbbbb"),
                       (ov + 45, ov + 165, "2 min at 1.5x", "#d62728"), (ov + 165, ov + 285, "back to normal", "#1f77b4")]:
    ax.axvspan(a / 60, b / 60, color=c, alpha=0.10)
    ax.text((a + b) / 120, 1.02, label, transform=ax.get_xaxis_transform(), ha="center", va="bottom", fontsize=12)
for name, v, when in [("Node", N, "tuned, 26 Oct"), ("Rails", R, f"28 Oct"), ("Spring", S, "tuned, 3 Nov")]:
    pts = dict(v["panels"]["9"])["p95"]
    ax.plot([t / 60 for t, _ in pts], [max(y, 1e-4) * 1000 for _, y in pts], color=COL[name], lw=2.6,
            label=f"{name} ({when})")
ax.axhline(300, color="#d62728", lw=1, ls=":")
ax.text(1.0, 300, "300 ms rule ", transform=ax.get_yaxis_transform(), ha="right", va="bottom", color="#d62728", fontsize=11)
ax.set_yscale("log"); ax.set_ylim(0.1, 60000); ax.set_xlim(0, 13.2)
ax.set_ylabel("p95 latency (ms, log)"); ax.set_xlabel("Minutes")
ax.grid(alpha=0.3); ax.legend(loc="upper left", frameon=False)
fig.suptitle("Node vs Rails vs Spring: who recovers after the overload?  ·  p95 latency, 1 CPU and 2 GB, no cache",
             x=0.01, ha="left", fontsize=17, fontweight="bold")
fig.tight_layout()
fig.savefig(HERE / "05-three-stacks-recovery.png", dpi=100, facecolor="white")
print("done")
