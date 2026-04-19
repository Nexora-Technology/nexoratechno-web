# WordPress + WPGraphQL Setup Guide

## Quick Start

### 1. Start Docker containers
```bash
docker compose up -d
```

### 2. Access WordPress Admin
Open your browser and navigate to: **http://localhost:8080/wp-admin**

### 3. Complete WordPress Setup Wizard
Fill in the required information:
- **Site Title:** Nexora Techno
- **Username:** (choose a secure admin username)
- **Password:** (use the generated strong password)
- **Email:** admin@nexoratechno.com

### 4. Install Required Plugins
After WordPress setup:

1. Go to **Plugins → Add New**
2. Search and install:
   - **WPGraphQL** — GraphQL API for WordPress
   - **WPGraphQL IDE** — Interactive GraphQL explorer
   - **Custom Post Type UI** — For creating Careers & Case Studies post types
3. Activate each plugin after installation

### 5. Create Custom Post Types

Using **Custom Post Type UI** plugin:

#### Careers
- **Post Type Slug:** `career`
- **Label:** `Careers`
- **Supports:** title, editor, excerpt
- Add ACF field group for:
  - `department` (text)
  - `location` (text)
  - `salary` (text)
  - `jobType` (select: Full-time, Part-time, Contract)
  - `level` (select: Junior, Mid, Senior, Lead)

#### Case Studies
- **Post Type Slug:** `case_study`
- **Label:** `Case Studies`
- **Supports:** title, editor, excerpt, thumbnail
- Add ACF field group for:
  - `client` (text)
  - `industry` (text)
  - `year` (text)
  - `duration` (text)
  - `team` (text)
  - `color` (text, hex color)

### 6. Register Custom Post Types in WPGraphQL

Add to your theme's `functions.php` or a custom plugin:

```php
add_action('init', function() {
  add_filter('cpt_post_types', function($types) {
    $types['career'] = ['show_in_graphql' => true, 'graphql_single_name' => 'career', 'graphql_plural_name' => 'careers'];
    $types['case_study'] = ['show_in_graphql' => true, 'graphql_single_name' => 'caseStudy', 'graphql_plural_name' => 'caseStudies'];
    return $types;
  });
});
```

Or install **WPGraphQL for Custom Post Types** add-on.

### 7. WPGraphQL Endpoint

The GraphQL endpoint is available at:
**http://localhost:8080/graphql**

Test queries in the WPGraphQL IDE at:
**http://localhost:8080/wp-admin/graphql-ide**

---

## Useful WP-CLI Commands

```bash
# Activate plugin
docker exec nexora_wordpress wp plugin activate wp-graphql

# Flush rewrite rules
docker exec nexora_wordpress wp rewrite flush

# Import sample content
docker exec nexora_wordpress wp import /path/to/sample-content.xml --authors=create

# Update permalink structure
docker exec nexora_wordpress wp rewrite structure '/%postname%/'
```

---

## Environment Variables (Next.js)

Copy `.env.local.example` to `.env.local` and configure:

```bash
cp .env.local.example .env.local
```

Update these variables:
- `WPGRAPHQL_URL` — WordPress GraphQL endpoint
- `SMTP_*` — Email settings for contact form

---

## Troubleshooting

### WordPress container not starting
Check Docker logs: `docker compose logs wordpress`

### Database connection issues
```bash
docker compose exec mysql mysql -u nexora_wp -pnexora_wp_pass
```

### Clear all data and start fresh
```bash
docker compose down -v   # Remove volumes
docker compose up -d     # Fresh start
```

### Restart services
```bash
docker compose restart wordpress
docker compose restart mysql
```