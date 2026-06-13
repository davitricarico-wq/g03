import express from 'express';
import familiaRoutes from './routes/familia.routes';
import fotoRoutes from './routes/foto.routes';
import moradiaRoutes from './routes/moradia.routes';
import petRoutes from './routes/pet.routes';
import pessoaRoutes from './routes/pessoa.routes.ts';
import prioridadeRoutes from './routes/prioridade.routes';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => res.status(200).json({ status: 'ok', service: 'GeoRisco API' }));
app.use(pessoaRoutes);
app.use(moradiaRoutes);
app.use(familiaRoutes);
app.use(petRoutes);
app.use(fotoRoutes);
app.use(prioridadeRoutes);
