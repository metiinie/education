#!/bin/bash
set -e

# Disable SSL requirement on MariaDB client to connect to local mariadb container
mkdir -p /home/frappe
cat << 'EOF' > /home/frappe/.my.cnf
[client]
ssl=0
EOF

export PATH="${NVM_DIR}/versions/node/v${NODE_VERSION_DEVELOP}/bin/:${PATH}"

# 1. Initialize Bench if not present
if [ ! -d "/home/frappe/frappe-bench/apps/frappe" ]; then
    echo "Creating new bench..."
    bench init --skip-redis-config-generation frappe-bench
fi

cd /home/frappe/frappe-bench

# 2. Configure DB and Redis hosts
bench set-mariadb-host mariadb
bench set-redis-cache-host redis://redis:6379
bench set-redis-queue-host redis://redis:6379
bench set-redis-socketio-host redis://redis:6379

# 3. Configure Procfile:
# - Remove background redis and watch services
# - Crucial: Bind web server to 0.0.0.0 so Docker port forwarding from host works (preventing ERR_EMPTY_RESPONSE)
sed -i '/redis/d' ./Procfile
sed -i '/watch/d' ./Procfile
sed -i 's/bench serve.*--port 8000/bench serve --host 0.0.0.0 --port 8000/' ./Procfile
if ! grep -q -- "--host 0.0.0.0" ./Procfile; then
    sed -i 's/bench serve/bench serve --host 0.0.0.0/' ./Procfile
fi

# 4. Install apps if not present
if [ ! -d "apps/erpnext" ]; then
    echo "Getting erpnext..."
    bench get-app erpnext --resolve-deps
fi

if [ ! -d "apps/education" ]; then
    echo "Getting education..."
    bench get-app education --resolve-deps
fi

# 5. Create site if not present
if [ ! -d "sites/education.localhost" ]; then
    echo "Creating new site education.localhost..."
    bench new-site education.localhost \
        --force \
        --mariadb-root-password 123 \
        --admin-password admin \
        --no-mariadb-socket

    echo "Installing apps to education.localhost..."
    bench --site education.localhost install-app erpnext
    bench --site education.localhost install-app education
    bench --site education.localhost set-config developer_mode 1
    bench --site education.localhost enable-scheduler
    bench --site education.localhost clear-cache
fi

bench use education.localhost

echo "Starting bench on http://0.0.0.0:8000..."
bench start
