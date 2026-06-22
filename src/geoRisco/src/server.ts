import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(__dirname, './.env')});

import { app } from './app.ts';

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})
