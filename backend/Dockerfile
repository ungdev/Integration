FROM node:22

WORKDIR /app

# Copier le package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

RUN npm install

# Copier tous les autres fichiers du backend
COPY . .

EXPOSE 4001

# Démarrer le serveur avec ts-node en utilisant le fichier server.ts à la racine
CMD ["npm", "run", "dev"]
