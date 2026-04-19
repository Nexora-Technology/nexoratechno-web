#!/bin/bash
# Post-install script for Nexora WordPress + WPGraphQL setup

echo "Waiting for WordPress to be ready..."
until curl -s http://localhost:8080/wp-admin/install.php > /dev/null 2>&1; do
    sleep 5
done
echo "WordPress is ready!"

# Install WPGraphQL via WP-CLI
docker exec nexora_wordpress wp plugin install wp-graphql --activate --allow-root
docker exec nexora_wordpress wp plugin install wp-graphql-ide --activate --allow-root
docker exec nexora_wordpress wp rewrite structure '/%postname%/' --allow-root

echo "WPGraphQL activated!"
