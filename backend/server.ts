import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
import path from "path";

import authRoutes from './src/routes/auth.routes';
import roleRoutes from './src/routes/role.routes';
import userRoutes from './src/routes/user.routes';
import teamRoutes from './src/routes/team.routes';
import eventRoutes from './src/routes/event.routes';
import factionRoutes from './src/routes/faction.routes';
import exportRoutes from './src/routes/export.routes';
import permanenceRoutes from './src/routes/permanences.routes';
import challengeRoutes from './src/routes/challenge.routes';
import emailRoutes from './src/routes/email.routes';
import newsRoutes from './src/routes/news.routes';
import discordRoutes from './src/routes/discord.routes';
import { server_port } from './src/utils/secret';
import { initUser } from './src/database/initdb/initUser'
import { initRoles } from './src/database/initdb/initrole'
import {initEvent} from './src/database/initdb/initevent'
import {initChallenge} from './src/database/initdb/initChallenge'
import { authenticateUser } from './src/middlewares/auth.middleware';
//import { initDB } from './src/database/init';

dotenv.config();

async function startServer() {
    const app = express();

    // Configuration des middlewares    
    app.use(cors({ origin: "*" }));
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));
    

    try {
        // Initialisation de la base de données
        await initUser();
        await initRoles();
        await initEvent();
        await initChallenge();
        console.log('Base de données initialisée avec succès');
        
        // Utilisation des routes d'authentification
        app.use('/api/auth', authRoutes);
        app.use('/api/role',authenticateUser, roleRoutes);
        app.use('/api/user',authenticateUser, userRoutes);
        app.use('/api/team',authenticateUser, teamRoutes);
        app.use('/api/event',authenticateUser, eventRoutes);
        app.use('/api/faction',authenticateUser, factionRoutes);
        app.use('/api/export',authenticateUser, exportRoutes);
        app.use('/api/permanence',authenticateUser, permanenceRoutes);
        app.use('/api/challenge',authenticateUser, challengeRoutes);
        app.use('/api/email',authenticateUser, emailRoutes);
        app.use('/api/news',authenticateUser, newsRoutes);
        app.use('/api/discord',authenticateUser, discordRoutes);
        app.use("/api/uploads/imgnews", express.static(path.join(__dirname, "/uploads/imgnews")));

        // Démarrage du serveur
        app.listen(server_port, () => {
            console.log(`Server running on port ${server_port}`);
        });
    } catch (err) {
        console.error('Erreur lors de l\'initialisation de la base de données :', err);
        process.exit(1);  // Arrêter le serveur si l'initialisation échoue
    }
}

startServer();
