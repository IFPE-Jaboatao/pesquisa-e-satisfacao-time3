# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependências de build
RUN apk add --no-cache python3 make g++

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Instalar dumb-init para garantir que sinais SIGTERM sejam passados corretamente
RUN apk add --no-cache dumb-init

# Criar usuário não-root para executar a aplicação
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar node_modules do stage de build
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar dist do stage de build
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copiar arquivos necessários em produção
COPY --chown=nodejs:nodejs package*.json ./

# Remover dependências de desenvolvimento
RUN npm prune --production

# Mudar para usuário não-root
USER nodejs

# Health check
HEALTHCHECK --interval=15s --timeout=5s --retries=5 --start-period=60s \
    CMD node -e "require('http').get('http://127.0.0.1:3001', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Usar dumb-init como entrypoint para garantir limpeza de processos
ENTRYPOINT ["dumb-init", "--"]

# Comando padrão
CMD ["node", "dist/main"]

EXPOSE 3001
