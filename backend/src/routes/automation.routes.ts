import express from 'express';
import * as permanenceController from '../controllers/permanence.controller';

const automationRoutes = express.Router();

// Permanences routes
automationRoutes.post('/permanence/notification/hourly', permanenceController.sendHourlyNotificationToUsers);
automationRoutes.post('/permanence/notification/daily', permanenceController.sendDailyNotificationToUsers);
automationRoutes.post(
    '/permanence/concurrent/notification',
    permanenceController.sendConcurrentPermanenceNotifications,
);
automationRoutes.post('/permanence/concurrent/purge', permanenceController.purgeConcurrentPermanences);

export default automationRoutes;
