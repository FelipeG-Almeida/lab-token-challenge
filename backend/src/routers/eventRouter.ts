import express from 'express';
import { EventController } from '../controllers/EventController';
import { EventBusiness } from '../business/EventBusiness';
import { TokenManager } from '../services/TokenManager';
import { EventDatabase } from '../database/EventDatabase';
import { IdGenerator } from '../services/IdGenerator';
import { UserDatabase } from '../database/UserDatabase';

export const eventRouter = express.Router();

const eventController = new EventController(
    new EventBusiness(
        new TokenManager(),
        new EventDatabase(),
        new UserDatabase(),
        new IdGenerator()
    )
);

eventRouter.post('/create', eventController.createEvent);
eventRouter.get('/list', eventController.getEvents);
eventRouter.put('/edit/:id', eventController.editEvent);
eventRouter.delete('/delete/:id', eventController.deleteEvent);
eventRouter.put('/guest', eventController.updateStatus);
