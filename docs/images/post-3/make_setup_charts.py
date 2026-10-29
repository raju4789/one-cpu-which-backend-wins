"""One chart per setup for post 3: the 5-minute hold, the overload and the recovery.

panels-data.json holds the dashboard's own Prometheus queries (panels 9, 10, 12, 16)
for batch 20261026-094626, runs 5 to 8, at 5-second steps. Grafana has no image
renderer installed, so the charts are drawn here from the same numbers.
All four charts share the same layout and axis scales. Run: python3 make_setup_charts.py
"""
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = Path(__file__).parent
D = json.loads((HERE / "panels-data.json").read_text())
TITLES = {"01-untuned": "Untuned Node, no cache", "02-tuned": "Tuned Node, no cache",
          "03-app-cache": "Tuned Node, app cache", "04-nginx-cache": "Tuned Node, Nginx cache"}
NAME = {"app": "Node", "postgres": "Postgres", "nginx": "Nginx", "whole VM": "Whole server"}
COL = {"Node": "#1f77b4", "Postgres": "#d62728", "Nginx": "#2ca02c", "Whole server": "#555555",
       "p95": "#2171b5", "p99": "#08306b", "All requests": "black",
       "GET /feed": "#1f77b4", "POST /posts": "#ff7f0e", "POST /posts/:id/like": "#9467bd"}
plt.rcParams.update({"font.size": 13, "axes.spines.top": False, "axes.spines.right": False})

def line(ax, name, pts, scale=1.0, **kw):
    ax.plot([x / 60 for x, _ in pts], [y * scale for _, y in pts], label=name,
            color=COL.get(name), lw=kw.pop("lw", 2.0), **kw)

for key, v in D.items():
    p = v["panels"]; ov = v["overload_start"]
    fig, axes = plt.subplots(4, 1, figsize=(16, 15), sharex=True)
    # 1. requests per second
    ax = axes[0]
    ser = p["10"]
    total = [[ser[0][1][i][0], sum(s[1][i][1] for s in ser)] for i in range(len(ser[0][1]))]
    line(ax, "All requests", total, lw=2.6)
    for name, pts in ser: line(ax, name, pts, lw=1.5)
    ax.set_ylim(0, 7000); ax.set_ylabel("Requests / s")
    # 2. latency
    ax = axes[1]
    for name, pts in p["9"]: line(ax, name, pts, scale=1000)
    ax.set_yscale("log"); ax.set_ylim(0.1, 60000); ax.set_ylabel("Latency (ms, log)")
    ax.axhline(300, color="#d62728", lw=1, ls=":")
    ax.text(1.0, 300, "300 ms rule ", transform=ax.get_yaxis_transform(), ha="right", va="bottom", color="#d62728", fontsize=10)
    # 3. errors
    ax = axes[2]
    for name, pts in p["12"]: line(ax, name, pts, scale=100)
    ax.set_ylim(-3, 105); ax.set_ylabel("Errors (%)")
    # 4. CPU
    ax = axes[3]
    for name, pts in p["16"]:
        n = NAME.get(name, name)
        line(ax, n, pts, scale=100, ls="--" if n == "Whole server" else "-", lw=1.4 if n == "Whole server" else 2.0)
    ax.set_ylim(0, 105); ax.set_ylabel("CPU (% of the one core)")
    spans = [(45, 345, "5-minute hold", "#2ca02c"), (345, ov + 45, "cool-down", "#bbbbbb"),
             (ov + 45, ov + 165, "2 min at 1.5x", "#d62728"), (ov + 165, ov + 285, "back to normal", "#1f77b4")]
    for i, ax in enumerate(axes):
        for a, b, label, c in spans:
            ax.axvspan(a / 60, b / 60, color=c, alpha=0.10)
            if i == 0:
                ax.text((a + b) / 120, 1.02, label, transform=ax.get_xaxis_transform(), ha="center", va="bottom", fontsize=11)
        ax.grid(alpha=0.3)
        ax.legend(loc="upper left", frameon=False, ncol=5, fontsize=11)
    axes[-1].set_xlabel("Minutes")
    axes[-1].set_xlim(0, 13.2)
    fig.suptitle(f"{TITLES[key]}  ·  {v['run']}, 26 Oct, {v['from'][:5]} to {v['to'][:5]}",
                 x=0.01, ha="left", fontsize=17, fontweight="bold")
    fig.tight_layout()
    fig.savefig(HERE / f"{key}.png", dpi=100, facecolor="white")
    plt.close(fig)
print("done")
