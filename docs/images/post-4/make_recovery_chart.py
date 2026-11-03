"""Node vs Rails recovery in every setup: p95 latency through the overload and back.
One row per setup, Node and Rails on the same scale.
Node: post 3 runs 6, 7, 8 (docs/images/post-3/panels-data.json, copied here as node-panels-data.json).
Rails: batch 20261028-172131 runs 1 and 2, rerun batch 20261031-203248 run 1 (panels-data.json).
Run: python3 make_recovery_chart.py"""
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = Path(__file__).parent
N = json.loads((HERE / "node-panels-data.json").read_text())
R = json.loads((HERE / "panels-data.json").read_text())
ROWS = [("No cache", "02-tuned", "01-no-cache"), ("App cache", "03-app-cache", "02-app-cache"),
        ("Nginx cache", "04-nginx-cache", "03-nginx-cache")]
plt.rcParams.update({"font.size": 14, "axes.spines.top": False, "axes.spines.right": False})


def p95(v):
    pts = dict(v["panels"]["9"])["p95"]
    return [t / 60 for t, _ in pts], [max(y, 1e-4) * 1000 for _, y in pts]


fig, axes = plt.subplots(3, 1, figsize=(16, 15), sharex=True)
for i, (ax, (title, nk, rk)) in enumerate(zip(axes, ROWS)):
    ov = R[rk]["overload_start"]
    for a, b, label, c in [(45, 345, "5-minute hold", "#2ca02c"), (345, ov + 45, "cool-down", "#bbbbbb"),
                           (ov + 45, ov + 165, "2 min at 1.5x", "#d62728"), (ov + 165, ov + 285, "back to normal", "#1f77b4")]:
        ax.axvspan(a / 60, b / 60, color=c, alpha=0.10)
        if i == 0:
            ax.text((a + b) / 120, 1.03, label, transform=ax.get_xaxis_transform(), ha="center", va="bottom", fontsize=12)
    x, y = p95(N[nk]); ax.plot(x, y, color="#2ca02c", lw=2.6, label=f"Node ({N[nk]['run']}, 26 Oct)")
    x, y = p95(R[rk]); ax.plot(x, y, color="#c0392b", lw=2.6, label=f"Rails ({R[rk]['run']}, {R[rk]['day']})")
    ax.axhline(300, color="#d62728", lw=1, ls=":")
    ax.text(1.0, 300, "300 ms rule ", transform=ax.get_yaxis_transform(), ha="right", va="bottom", color="#d62728", fontsize=11)
    ax.set_yscale("log"); ax.set_ylim(0.1, 60000)
    ax.set_ylabel("p95 latency (ms, log)")
    ax.set_title(title, loc="left", fontsize=16, fontweight="bold", pad=28 if i == 0 else 8)
    ax.grid(alpha=0.3); ax.legend(loc="upper left", frameon=False)
axes[-1].set_xlim(0, 13.2); axes[-1].set_xlabel("Minutes")
fig.suptitle("Node vs Rails: who recovers after the overload?  ·  p95 latency, 1 CPU and 2 GB, every setup",
             x=0.01, ha="left", fontsize=17, fontweight="bold")
fig.tight_layout()
fig.savefig(HERE / "05-node-vs-rails-recovery.png", dpi=100, facecolor="white")
