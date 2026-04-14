#!/bin/bash
# Refresh local DB snapshot from production.
# Usage: ./scripts/pull-db.sh
set -euo pipefail
cd "$(dirname "$0")/.."
scp dan-server:/var/www/apps/cookbook/cookbook.db ./cookbook.local.db
echo "Pulled: $(ls -lh cookbook.local.db | awk '{print $5, $NF}')"
