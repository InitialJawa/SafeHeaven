FROM node:22-alpine

WORKDIR /app

# Copy package configuration
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Install build dependencies temporarily and build project
RUN npm install typescript esbuild @tailwindcss/vite vite -D && \
    npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
