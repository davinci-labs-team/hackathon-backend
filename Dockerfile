# -----------------------------
# Étape 1 : Build du backend
# -----------------------------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache python3 py3-pip build-base libstdc++ bash
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

COPY scripts/entrypoint.sh .
RUN chmod +x entrypoint.sh

# Replace CMD
CMD ["./entrypoint.sh"]