<?php
/**
 * nexora-auto-admin.php
 * Auto-creates admin user on WordPress first installation.
 * Reads credentials from environment variables set in docker-compose.yml.
 *
 * @package Nexora
 */

if (!function_exists('nexora_create_admin_user')) {
    function nexora_create_admin_user() {
        $username = getenv('WORDPRESS_ADMIN_USER');
        $password = getenv('WORDPRESS_ADMIN_PASSWORD');
        $email    = getenv('WORDPRESS_ADMIN_EMAIL');

        if (empty($username) || empty($password) || empty($email)) {
            return;
        }

        // Only run once — permanent marker (option, never expires)
        if (get_option('nexora_admin_created') === 'done') {
            return;
        }

        // Check if user already exists
        if (username_exists($username) || email_exists($email)) {
            // User exists — never touch the password here: wp_set_password()
            // re-hashes user_pass and instantly invalidates every active session.
            update_option('nexora_admin_created', 'done', true);
            return;
        }

        // Create user (first install only)
        $user_id = wp_create_user($username, $password, $email);
        if (!is_wp_error($user_id)) {
            $user = new WP_User($user_id);
            $user->set_role('administrator');
            update_option('nexora_admin_created', 'done', true);
            error_log("[nexora-auto-admin] Created admin user: {$username}");
        } else {
            error_log("[nexora-auto-admin] Failed to create user: " . $user_id->get_error_message());
        }
    }
    add_action('admin_init', 'nexora_create_admin_user');
}
