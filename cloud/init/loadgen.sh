#!/usr/bin/env bash
# cloud-init for the loadgen droplet: k6, Docker (for Prometheus and Grafana),
# node_exporter (shows whether k6 is short of CPU, as the Mac's does), git.
set -euxo pipefail
export DEBIAN_FRONTEND=noninteractive
systemctl disable --now unattended-upgrades apt-daily.timer apt-daily-upgrade.timer 2>/dev/null || true
# Safe to rerun: a k6 repo entry left by an earlier, failed run (without its
# key) would make every apt-get update fail, including Docker's installer.
rm -f /etc/apt/sources.list.d/k6.list
curl -fsSL https://get.docker.com | sh
apt-get update
apt-get install -y gnupg git jq python3 prometheus-node-exporter
# k6 from its official release on GitHub, pinned to the version the earlier
# cloud runs used (v2.3.0). Not from k6's apt repository: its signing key
# changed and the published key file no longer matched, so apt refused it.
K6_VERSION=v2.3.0
curl -fsSL "https://github.com/grafana/k6/releases/download/$K6_VERSION/k6-$K6_VERSION-linux-amd64.tar.gz" |
  tar -xz -C /usr/local/bin --strip-components=1 "k6-$K6_VERSION-linux-amd64/k6"
k6 version
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
