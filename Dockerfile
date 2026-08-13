FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
WORKDIR /app
RUN addgroup --system --gid 10001 shortpilot \
    && adduser --system --uid 10001 --ingroup shortpilot shortpilot
COPY --from=builder --chown=shortpilot:shortpilot /app/public ./public
COPY --from=builder --chown=shortpilot:shortpilot /app/.next/standalone ./
COPY --from=builder --chown=shortpilot:shortpilot /app/.next/static ./.next/static
USER shortpilot
EXPOSE 3000
CMD ["node", "server.js"]
