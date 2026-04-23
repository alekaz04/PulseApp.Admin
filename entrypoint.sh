#!/bin/sh
set -e

# Generate config.js from environment variables at container startup
cat > /usr/share/nginx/html/config.js << EOF
window.APP_CONFIG = {
  API_BASE_URL: '${API_BASE_URL}'
};
EOF

exec nginx -g 'daemon off;'
