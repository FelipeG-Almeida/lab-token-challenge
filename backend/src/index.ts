import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Servidor rodando na poirta 3000');
});
