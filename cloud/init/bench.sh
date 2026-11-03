#!/usr/bin/env bash
# cloud-init for the bench droplet (1 vCPU, 2 GB): Docker and the same kernel
# settings the Mac's bench VM gets from harness/bin/vm-up. Nothing else runs here.
set -euxo pipefail
export DEBIAN_FRONTEND=noninteractive
# Nothing in the background competing for the one core during runs.
systemctl disable --now unattended-upgrades apt-daily.timer apt-daily-upgrade.timer snapd 2>/dev/null || true
curl -fsSL https://get.docker.com | sh
# Classic overlay2 image store: cAdvisor can't see containers in containerd's
# store (harness/bin/vm-up does the same on the Mac).
mkdir -p /etc/docker
echo '{"features": {"containerd-snapshotter": false}}' > /etc/docker/daemon.json
systemctl restart docker
# Connection tracking for the cache phases' many connections (as in vm-up).
echo 'net.netfilter.nf_conntrack_max=262144' > /etc/sysctl.d/90-bench.conf
modprobe nf_conntrack || true
sysctl --system
touch /root/cloud-init-done
