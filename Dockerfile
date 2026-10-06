# ==========================================
# Stage 1: Build Environment (Node.js)
# ==========================================
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
FROM nginx:1.27-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled SPA bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
