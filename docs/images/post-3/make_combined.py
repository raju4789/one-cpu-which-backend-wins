"""All four setups side by side in one image: columns = setups, rows = panels.
Same data and scales as make_setup_charts.py. Run: python3 make_combined.py"""
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = Path(__file__).parent
D = json.loads((HERE / "panels-data.json").read_text())
TITLES = {"01-untuned": "Untuned, no cache", "02-tuned": "Tuned, no cache",
          "03-app-cache": "App cache", "04-nginx-cache": "Nginx cache"}
NAME = {"app": "Node", "postgres": "Postgres", "nginx": "Nginx", "whole VM": "Whole server"}
COL = {"Node": "#1f77b4", "Postgres": "#d62728", "Nginx": "#2ca02c", "Whole server": "#555555",
       "p95": "#2171b5", "p99": "#08306b", "All requests": "black",
       "GET /feed": "#1f77b4", "POST /posts": "#ff7f0e", "POST /posts/:id/like": "#9467bd"}
plt.rcParams.update({"font.size": 12, "axes.spines.top": False, "axes.spines.right": False})
ROWS = ["Requests / s", "Latency (ms, log)", "Errors (%)", "CPU (% of the core)"]

fig, axes = plt.subplots(4, 4, figsize=(24, 16), sharex=True, sharey="row")
for c, (key, v) in enumerate(D.items()):
    p = v["panels"]; ov = v["overload_start"]
    def line(ax, name, pts, scale=1.0, **kw):
        ax.plot([x / 60 for x, _ in pts], [y * scale for _, y in pts], label=name, color=COL.get(name), **kw)
    ser = p["10"]
    total = [[ser[0][1][i][0], sum(s[1][i][1] for s in ser)] for i in range(len(ser[0][1]))]
    line(axes[0][c], "All requests", total, lw=2.4)
    for n, pts in ser: line(axes[0][c], n, pts, lw=1.3)
    for n, pts in p["9"]: line(axes[1][c], n, pts, scale=1000, lw=1.8)
    for n, pts in p["12"]: line(axes[2][c], n, pts, scale=100, lw=1.8)
    for n, pts in p["16"]:
        n = NAME.get(n, n)
        line(axes[3][c], n, pts, scale=100, lw=1.2 if n == "Whole server" else 1.8, ls="--" if n == "Whole server" else "-")
    axes[0][c].set_title(f"{TITLES[key]}  ({v['run']})", fontsize=15, fontweight="bold")
    axes[1][c].set_yscale("log")
    for r in range(4):
        ax = axes[r][c]
        for a, b, col in [(45, 345, "#2ca02c"), (ov + 45, ov + 165, "#d62728"), (ov + 165, ov + 285, "#1f77b4")]:
            ax.axvspan(a / 60, b / 60, color=col, alpha=0.10)
        ax.grid(alpha=0.3)
    axes[1][c].axhline(300, color="#d62728", lw=1, ls=":")
    axes[3][c].set_xlabel("Minutes")
axes[0][0].set_ylim(0, 7000); axes[1][0].set_ylim(0.1, 60000)
axes[2][0].set_ylim(-3, 105); axes[3][0].set_ylim(0, 105); axes[3][0].set_xlim(0, 13.2)
for r, label in enumerate(ROWS):
    axes[r][0].set_ylabel(label)
    h, l = axes[r][3].get_legend_handles_labels()
    axes[r][3].legend(h, l, loc="upper left", bbox_to_anchor=(1.01, 1), frameon=False, fontsize=11)
fig.suptitle("Node.js on 1 CPU and 2 GB: all four setups, same scales.  "
             "Green = 5-minute hold, red = 2 min at 1.5x, blue = back to normal. Dotted line = 300 ms rule.",
             x=0.01, ha="left", fontsize=15)
fig.tight_layout(rect=(0, 0, 1, 0.97))
fig.savefig(HERE / "05-all-four.png", dpi=100, facecolor="white")
print("done")
