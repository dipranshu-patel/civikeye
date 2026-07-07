# ---- deps stage: install production deps only ----
FROM node:20-alpine AS deps
WORKDIR /app
# bcrypt needs native build tools on Alpine
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci --omit=dev

# ---- runner stage: lean final image ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Run as non-root user for security
RUN addgroup -S app && adduser -S app -G app

COPY --from=deps /app/node_modules ./node_modules
COPY src/ ./src/

USER app
EXPOSE 5000
CMD ["node", "src/server.js"]
