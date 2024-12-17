import express from 'express';
import dotenv from 'dotenv';
import { userRouter } from './routers/userRouter';
import { eventRouter } from './routers/eventRouter';

dotenv.config();
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

app.use('/users', userRouter);
app.use('/events', eventRouter);
