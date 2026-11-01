"""Node vs Rails recovery: p95 latency through the overload and back, both tuned, no cache.
Node: post 3 run 6 (docs/images/post-3/panels-data.json, key 02-tuned, copied here as
node-panels-data.json). Rails: run 1 of batch 20261028-172131 (panels-data.json, key 01-no-cache).
Run: python3 make_recovery_chart.py"""
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = Path(__file__).parent
node = json.loads((HERE / "node-panels-data.json").read_text())["02-tuned"]
rails = json.loads((HERE / "panels-data.json").read_text())["01-no-cache"]
plt.rcParams.update({"font.size": 14, "axes.spines.top": False, "axes.spines.right": False})


def p95(v):
    pts = dict(v["panels"]["9"])["p95"]
    return [t / 60 for t, _ in pts], [max(y, 1e-4) * 1000 for _, y in pts]


fig, ax = plt.subplots(figsize=(16, 7))
ov = rails["overload_start"]
for a, b, label, c in [(45, 345, "5-minute hold", "#2ca02c"), (345, ov + 45, "cool-down", "#bbbbbb"),
                       (ov + 45, ov + 165, "2 min at 1.5x", "#d62728"), (ov + 165, ov + 285, "back to normal", "#1f77b4")]:
    ax.axvspan(a / 60, b / 60, color=c, alpha=0.10)
    ax.text((a + b) / 120, 1.02, label, transform=ax.get_xaxis_transform(), ha="center", va="bottom", fontsize=12)
x, y = p95(node); ax.plot(x, y, color="#2ca02c", lw=2.6, label="Node, tuned, no cache (run 6, 26 Oct)")
x, y = p95(rails); ax.plot(x, y, color="#c0392b", lw=2.6, label="Rails, no cache (run 1, 28 Oct)")
ax.axhline(300, color="#d62728", lw=1, ls=":")
ax.text(1.0, 300, "300 ms rule ", transform=ax.get_yaxis_transform(), ha="right", va="bottom", color="#d62728", fontsize=11)
ax.set_yscale("log"); ax.set_ylim(0.1, 60000); ax.set_xlim(0, 13.2)
ax.set_ylabel("p95 latency (ms, log)"); ax.set_xlabel("Minutes")
ax.grid(alpha=0.3); ax.legend(loc="upper left", frameon=False)
fig.suptitle("Node vs Rails: who recovers after the overload?  ·  p95 latency, 1 CPU and 2 GB, no cache",
             x=0.01, ha="left", fontsize=17, fontweight="bold")
fig.tight_layout()
fig.savefig(HERE / "05-node-vs-rails-recovery.png", dpi=100, facecolor="white")
