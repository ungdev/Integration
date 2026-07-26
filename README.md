# Projet d'Intégration UTT - Environnement de Développement

Ce projet est une plateforme pour le site d'intégration de l'Université de Technologie de Troyes. Il utilise une architecture conteneurisée via Docker pour gérer le frontend, le backend et la base de données PostgreSQL.

## 🛠 Technologies utilisées

- **Frontend** :
  - Vite.js
  - React
  - Nginx (pour servir le build statique)
  - Docker

- **Backend** :
  - Node.js
  - Express.js
  - Prisma
  - PostgreSQL client
  - Docker

- **Base de données** :
  - PostgreSQL

- **Outils DevOps** :
  - Docker
  - Docker Compose

---

## Prérequis

### Cloner le projet

```bash
git clone https://github.com/ungdev/Integration.git
cd Integration
```

### Docker & Docker-Compose

Assurez-vous d'avoir installé :

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Vérifiez avec :

```bash
docker --version
docker-compose --version
```

### ESLint & Prettier

ESLint & Prettier sont utilisés pour maintenanir une cohérence et propreté de syntaxe dans le code de ce projet ainsi que la lisibilité.

Il convient donc d'installation les deux extensions sur votre éditeur de code.

Vérification de syntaxe via la commande

```
pnpm lint
```

La syntaxe doit être controllée avant chaque commit.

### Variables d'environnement

#### Frontend

Dans [le dossier frontend](/frontend)

```
cp .env.example .env
```

Renseigner les différents champs utiles.

#### API

Dans [le dossier backend](/backend)

```
cp .env.example .env
```

Renseigner les différents champs utiles.

## 🚀 Lancer le projet en local

### Database

#### Via Docker-Compose

A la racine du projet

```
docker compose up db
```

#### Database externe

Passage par exemple par `systemctl`

```
sudo systemctl start postgresql
```

### Frontend

Dans [le dossier frontend](/frontend)

Installation des dépendances

```
pnpm i
```

Pour lancer le serveur

```
pnpm run dev
```

### API

Dans [le dossier backend](/backend/)

Installation des dépendances & Migration DB

```
pnpm i
pnpm migrate
```

Pour lancer le serveur

```
pnpm run dev
```

### Accéder aux services

- Frontend : [http://localhost:4000](http://localhost:4000)
- Backend : [http://localhost:4001](http://localhost:4001)
- Base de données PostgreSQL : `localhost:5432` (user: `admin`, password: `password`)

## Test de build

### Via Docker

Exécutez la commande suivante à la racine du projet :

```bash
docker-compose up --build
```

Cette commande :

- Lance PostgreSQL
- Démarre le backend avec migration automatique via Prisma
- Compile et sert le frontend

---

## 📁 Structure du projet

```
.
├── backend/
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   └── ...
├── frontend/
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
└── README.md
```

---

# 🔧 Routage `/api` sur integration.utt.fr en local

Ce guide permet de configurer le site `integration.utt.fr` en local avec Nginx, en HTTPS, pour simuler l'environnement de production.

---

## ⚙️ Prérequis

- [Nginx](https://nginx.org/)
- [mkcert](https://github.com/FiloSottile/mkcert)
- Node.js (pour lancer le frontend et le backend)
- Accès sudo

---

## 🚀 Étapes d'installation locale

### 1. Ajouter `integration.utt.fr` au fichier hosts

```bash
sudo nano /etc/hosts
```

Ajouter :

```
127.0.0.1 integration.utt.fr
```

---

### 2. Générer les certificats SSL

Dans le dossier du projet :

```bash
mkcert integration.utt.fr
```

Cela crée deux fichiers :

- `integration.utt.fr.pem`
- `integration.utt.fr-key.pem`

---

### 3. Configurer Nginx

Créer un fichier dans `/etc/nginx/sites-available/integration.utt.fr` avec :

```nginx
server {
    listen 443 ssl;
    server_name integration.utt.fr;

    ssl_certificate     /chemin/vers/integration.utt.fr.pem;
    ssl_certificate_key /chemin/vers/integration.utt.fr-key.pem;

    location / {
        proxy_pass http://localhost:4000;
    }

    location /api/ {
        proxy_pass http://localhost:4001;
    }
}
```

Puis l'activer :

```bash
sudo ln -s /etc/nginx/sites-available/integration.utt.fr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 4. Lancer les services

[Lancer l'API](#api) puis [lancer le Frontend](#frontend)

Le projet de dev est maintenant accessible sur https://integration.utt.fr, en local.

---

## Nettoyage

### 1. Supprimer l'entrée dans `/etc/hosts`

```bash
sudo nano /etc/hosts
```

Supprimer la ligne :

```
127.0.0.1 integration.utt.fr
```

---

### 2. Désactiver la config Nginx

```bash
sudo rm /etc/nginx/sites-enabled/integration.utt.fr
sudo nginx -t
sudo systemctl reload nginx
```

---

La site de production est maintenant accessible sur https://integration.utt.fr, en ligne.

## 📜 Licence

Projet destiné à des fins d'utilisation pour l'intégration des nouveaux étudiants à l'Université de Technologie de Troyes.
