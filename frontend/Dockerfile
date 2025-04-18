FROM node:23-slim AS builder
WORKDIR /app

ENV VITE_CAS_LOGIN_URL="https://cas.utt.fr/cas/login"
ENV VITE_SERVICE_URL="https://integration.utt.fr/"
ENV VITE_API_URL="https://integration.utt.fr/api" 
#localhost:4001 in local version

COPY package.json package-lock.json ./
RUN npm install -g npm@latest
RUN npm install --force

COPY . .
RUN npm run build

FROM node:23-slim AS runner
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["serve", "-s", "dist", "-l", "4000"]


