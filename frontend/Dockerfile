FROM node:22 AS builder
WORKDIR /app

ENV REACT_APP_API_URL=https://inetgration.utt.fr/api

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22 AS runner
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 4000

CMD ["serve", "-s", "build", "-l", "5002"]
