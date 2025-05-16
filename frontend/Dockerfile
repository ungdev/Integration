FROM node:23-slim AS builder
WORKDIR /app

ARG VITE_CAS_LOGIN_URL="https://cas.utt.fr/cas/login"
ARG VITE_SERVICE_URL="https://integration.utt.fr/"
ARG VITE_API_URL="https://integration.utt.fr/api"
ARG VITE_ANALYTICS_WEBSITE_ID=""

ENV VITE_CAS_LOGIN_URL=${VITE_CAS_LOGIN_URL}
ENV VITE_SERVICE_URL=${VITE_SERVICE_URL}
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_ANALYTICS_WEBSITE_ID=${VITE_ANALYTICS_WEBSITE_ID}
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

