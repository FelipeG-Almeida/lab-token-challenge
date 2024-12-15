import express from 'express';
import { UserController } from '../controllers/UserController';
import { UserBusiness } from '../business/UserBusiness';
import { UserDatabase } from '../database/UserDatabase';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { HashManager } from '../services/HashManager';

export const userRouter = express.Router();

const userController = new UserController(
    new UserBusiness(
        new HashManager(),
        new IdGenerator(),
        new TokenManager(),
        new UserDatabase()
    )
);

userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.put('/update', userController.updateUser);
