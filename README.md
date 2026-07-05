# Projet d'Intégration UTT - Environnement de Développement

Ce projet est une plateforme pour le site d'intégration de l'Université de Technologie de Troyes. Il utilise une architecture conteneurisée via Docker pour gérer le frontend, le backend et la base de données PostgreSQL.

## 🛠 Technologies utilisées

- **Frontend** :
  - Vite.js
  - React
  - Serve (pour servir le build statique)
  - Docker

- **Backend** :
  - Node.js
  - Express.js
  - Prisma ORM
  - PostgreSQL client
  - Docker

- **Base de données** :
  - PostgreSQL

- **Outils DevOps** :
  - Docker
  - Docker Compose

---

## 🚀 Lancer le projet en local

### 1. Prérequis

Assurez-vous d'avoir installé :
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Vérifiez avec :
```bash
docker --version
docker-compose --version
```

### 2. Cloner le projet

```bash
git clone https://github.com/ungdev/Integration.git
cd Integration
```

### 3. Démarrer les conteneurs

Exécutez la commande suivante à la racine du projet :

```bash
docker-compose up --build
```

Cette commande :
- Lance PostgreSQL
- Démarre le backend avec synchronisation du schéma Prisma et seed automatique
- Compile et sert le frontend

### 4. Accéder aux services

- Frontend : [http://localhost:4000](http://localhost:4000)
- Backend : [http://localhost:4001](http://localhost:4001)
- Base de données PostgreSQL : `localhost:5432` (user: `admin`, password: `password`)

---

## 🧪 Gestion du schéma et des seeds

Le backend utilise **Prisma ORM** pour synchroniser le schéma et injecter les données de base.

La commande suivante est exécutée automatiquement au démarrage :

```bash
npm run migrate
```

Elle exécute `prisma generate`, `prisma db push`, puis `prisma db seed`.

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


# 🔧 Installation du site de l'Intégration en local

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

Dans deux terminaux différents :

```bash
cd frontend
npm install
npm run dev
```

```bash
cd backend
npm install
npm run dev
```

---

### ✅ Accès

Ouvrir :  
👉 https://integration.utt.fr

---

## 🔚 Nettoyage quand le dev est terminé

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

Tu peux maintenant accéder à la version en ligne de :  
👉 https://integration.utt.fr


## 📜 Licence

Projet destiné à des fins d'utilisation pour l'intégration des étudiants à l'UTT.
