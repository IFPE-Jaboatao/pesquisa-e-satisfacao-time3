# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação Vite
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /app

# Copiar arquivo de configuração nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar build do stage anterior para pasta do nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Criar usuário não-root
RUN addgroup -g 101 -S nginx 2>/dev/null && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -c "Nginx web server" -G nginx nginx 2>/dev/null || true

# Health check
HEALTHCHECK --interval=15s --timeout=5s --retries=5 --start-period=30s \
    CMD wget -q --spider http://127.0.0.1:80/ || exit 1

# Expor porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
