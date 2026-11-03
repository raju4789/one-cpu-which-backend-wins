#!/usr/bin/env bash
# cloud-init for the loadgen droplet: k6, Docker (for Prometheus and Grafana),
# node_exporter (shows whether k6 is short of CPU, as the Mac's does), git.
set -euxo pipefail
export DEBIAN_FRONTEND=noninteractive
systemctl disable --now unattended-upgrades apt-daily.timer apt-daily-upgrade.timer 2>/dev/null || true
curl -fsSL https://get.docker.com | sh
apt-get update
apt-get install -y gnupg git jq python3 prometheus-node-exporter
gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
  > /etc/apt/sources.list.d/k6.list
apt-get update
apt-get install -y k6
# Tens of thousands of client connections: more ports and open files.
cat > /etc/sysctl.d/90-loadgen.conf <<'CONF'
net.ipv4.ip_local_port_range=1024 65000
net.ipv4.tcp_tw_reuse=1
net.core.somaxconn=4096
fs.file-max=2000000
CONF
sysctl --system
printf '* soft nofile 1000000\n* hard nofile 1000000\nroot soft nofile 1000000\nroot hard nofile 1000000\n' \
  > /etc/security/limits.d/90-loadgen.conf
touch /root/cloud-init-done
