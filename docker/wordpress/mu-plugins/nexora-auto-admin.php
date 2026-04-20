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

        // Only run once
        $transient_key = 'nexora_admin_created_' . md5($username . $email);
        if (get_transient($transient_key) === 'done') {
            return;
        }

        // Check if user already exists
        if (username_exists($username) || email_exists($email)) {
            // Update password if user exists
            $user = get_user_by('login', $username);
            if (!$user) $user = get_user_by('email', $email);
            if ($user) {
                wp_set_password($password, $user->ID);
                set_transient($transient_key, 'done', DAY_IN_SECONDS);
                error_log("[nexora-auto-admin] Updated password for user: {$username}");
            }
            return;
        }

        // Create user
        $user_id = wp_create_user($username, $password, $email);
        if (!is_wp_error($user_id)) {
            $user = new WP_User($user_id);
            $user->set_role('administrator');
            set_transient($transient_key, 'done', DAY_IN_SECONDS);
            error_log("[nexora-auto-admin] Created admin user: {$username}");
        } else {
            error_log("[nexora-auto-admin] Failed to create user: " . $user_id->get_error_message());
        }
    }
    add_action('admin_init', 'nexora_create_admin_user');
}
