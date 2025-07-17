import express from 'express';
import  * as discordController from '../controllers/discord.controller';


const discordRouter = express.Router();

discordRouter.post('/user/callback', discordController.createChallenge);

export default discordRouter;