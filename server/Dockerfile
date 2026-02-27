FROM node:20-alpine

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# App Runner / ECS expect the app to listen on $PORT (default 3002)
ENV PORT=3002
EXPOSE 3002

CMD ["node", "index.js"]
