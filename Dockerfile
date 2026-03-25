# Stage 1: Build
FROM node:20-bullseye AS builder

WORKDIR /app

ARG ENV=production

RUN echo "Build configuration: $ENV"

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

RUN npm run build -- --configuration=$ENV
FROM nginx:alpine

LABEL maintainer="tkrestore@project"
LABEL version="1.0.0"
LABEL description="tkrestore Angular Frontend"

COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/tkrestore-front/browser /usr/share/nginx/html

RUN [ -f /usr/share/nginx/html/index.csr.html ] && \
    mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html || true

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ > /dev/null || exit 1