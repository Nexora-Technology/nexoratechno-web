# Docker Stack — Next.js + WordPress + MySQL

One `docker compose up -d` brings up the entire stack:

| Service     | Container           | Host port (default) | Internal |
|-------------|--------------------|---------------------|---------|
| `web`       | `nexora_web`       | `3000`              | Next.js 16 production build |
| `wordpress` | `nexora_wordpress` | `8080`              | WordPress 6.7 + Apache |
| `mysql`     | `nexora_mysql`     | — (internal only)   | MySQL 8.4 |

Next.js talks to WordPress inside the Docker network via `http://wordpress/graphql`, so the WP port does not need to be public when everything runs on the same host.

---

## 1. First-time setup

```bash
# 1. Copy env template (populates ports, DB passwords, SMTP)
cp .env.local.example .env

# 2. Edit .env — set strong DB passwords and real SMTP credentials
#    For production, also set WP_PUBLIC_URL=https://your-domain.com/wp

# 3. Build + start everything
docker compose up -d --build

# 4. Tail logs until WordPress is ready
docker compose logs -f wordpress
```

Then open WordPress admin at `http://localhost:${WP_PORT}/wp-admin` and complete the install wizard (see plugin list below).

## 2. Required WordPress plugins

Install + activate from **Plugins → Add New**:

- **WPGraphQL** — exposes the GraphQL API used by Next.js
- **WPGraphQL IDE** — GraphQL explorer (admin only, optional)
- **Custom Post Type UI** — creates `career` and `case_study` post types
- **Advanced Custom Fields (ACF)** — ACF field groups for career/case meta
- **WPGraphQL for Advanced Custom Fields** — exposes ACF fields to GraphQL

Post type + ACF field spec: see “Custom post types” section at the bottom.

---

## 3. Updating the Next.js image

Code changes to the Next.js app require a rebuild:

```bash
docker compose up -d --build web
```

WordPress and MySQL keep running — only the web container is rebuilt and restarted.

---

## 4. Deploying behind the server's Nginx

The server already runs Nginx as the public TLS terminator. Docker only exposes the two app ports on `127.0.0.1` — Nginx proxies everything else.

### Example Nginx config (same domain, WP at `/wp`)

```nginx
server {
  listen 443 ssl http2;
  server_name nexoratechno.com;

  ssl_certificate     /etc/letsencrypt/live/nexoratechno.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/nexoratechno.com/privkey.pem;

  # WordPress admin + GraphQL live under /wp
  location /wp/ {
    proxy_pass         http://127.0.0.1:8080/;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
  }

  # Everything else → Next.js
  location / {
    proxy_pass         http://127.0.0.1:3000;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade           $http_upgrade;
    proxy_set_header   Connection        "upgrade";
  }
}
```

### Matching `.env` on the production server

```bash
WEB_PORT=3000
WP_PORT=8080
WP_PUBLIC_URL=https://nexoratechno.com/wp
```

Then:

```bash
docker compose up -d --build
```

The `WP_PUBLIC_URL` value is baked into `WP_HOME` / `WP_SITEURL`, so WordPress generates correct links even though it is hidden behind Nginx.

If you change `WP_PUBLIC_URL` after install, either wipe `wordpress_data` or run:

```bash
docker exec nexora_wordpress wp option update home     "$WP_PUBLIC_URL" --allow-root
docker exec nexora_wordpress wp option update siteurl  "$WP_PUBLIC_URL" --allow-root
docker exec nexora_wordpress wp rewrite flush         --allow-root
```

---

## 5. Useful commands

```bash
# Start / stop / restart everything
docker compose up -d
docker compose down
docker compose restart web

# Logs
docker compose logs -f web
docker compose logs -f wordpress

# Shell into a container
docker exec -it nexora_wordpress bash
docker exec -it nexora_mysql     mysql -u root -p

# Wipe + start fresh (DELETES WP content + DB)
docker compose down -v && docker compose up -d --build
```

---

## 6. Custom post types

### Careers  (`career` / `careers`)
Supports: `title`, `editor`, `excerpt`.
ACF field group `careerMeta`:
- `department` (text)
- `location` (text)
- `salary` (text)
- `jobType` (select: Full-time / Part-time / Contract)
- `level` (select: Junior / Mid / Senior / Lead)

### Case Studies  (`case_study` / `caseStudy`)
Supports: `title`, `editor`, `excerpt`, `thumbnail`.
ACF field group `caseMeta`:
- `client` (text)
- `industry` (text)
- `year` (text)
- `duration` (text)
- `team` (text)
- `color` (text, hex)

Both CPTs must have `show_in_graphql: true` with the exact `graphql_single_name` / `graphql_plural_name` shown above — the Next.js queries expect these names.

---

## 7. Troubleshooting

**Web container exits immediately** — check the build logs:
```bash
docker compose logs web
```
Most common cause: `npm run build` failure. Run `npm run build` locally first.

**`wordpress/graphql` returns 404** — WPGraphQL not installed/activated yet, or permalinks not flushed:
```bash
docker exec nexora_wordpress wp rewrite flush --allow-root
```

**GraphQL queries return empty** — custom post types not registered in GraphQL. Verify CPT UI settings have `show_in_graphql: true`.

**Database connection errors** — MySQL still starting. `healthcheck` should gate this automatically; if not, restart the WP container.
