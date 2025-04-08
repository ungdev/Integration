FROM node:22

WORKDIR /app

# Installer les dépendances système (dont PostgreSQL client)
RUN apt-get update && apt-get install -y postgresql-client

# Copier le package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

RUN npm install -g npm@latest

# Copier tous les autres fichiers du backend
COPY . .

EXPOSE 4001

# Démarrer le serveur avec ts-node en utilisant le fichier server.ts à la racine
CMD until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT; do echo "Waiting for DB..."; sleep 2; done && \
    npm run migrate && \
    npm run start
