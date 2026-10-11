# ==========================================
# Stage 1: Build Environment (Node.js)
# ==========================================
# NOTE: digest pin pending verification in deploy env (no network here).
# Verify with `docker buildx imagetools inspect` then pin, e.g.:
# FROM node:22-alpine@sha256:<verified> AS builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for efficient Docker layer caching
COPY package.json package-lock.json ./

# Install exact production & dev dependencies needed for build
RUN npm ci

# Copy project source files
COPY . .

# Run build to produce production bundle in /app/dist
RUN npm run build

# ==========================================
# Stage 2: Production Server (Nginx Alpine)
# ==========================================
# NOTE: digest pin pending verification in deploy env.
# FROM nginx:1.27-alpine@sha256:<verified> AS runner
FROM nginx:1.27-alpine AS runner

# Non-root runtime: writable pid/cache/temp paths for the `nginx` user.
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp /var/cache/nginx /var/run \
  && chown -R nginx:nginx /tmp/client_temp /tmp/proxy_temp /var/cache/nginx /var/run \
    /usr/share/nginx/html /etc/nginx/conf.d

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled SPA bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose unprivileged HTTP port (non-root cannot bind 80)
EXPOSE 8080

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/healthz || exit 1

USER nginx

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
