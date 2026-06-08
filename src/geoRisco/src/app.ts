import express from 'express';
import path from "path";
import familiaRoutes from './routes/familia.routes';
import fotoRoutes from './routes/foto.routes';
import moradiaRoutes from './routes/moradia.routes';
import petRoutes from './routes/pet.routes';
import pessoaRoutes from './routes/pessoa.routes.ts';

export const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req,res) => res.redirect('/pessoas/novo'));
app.use(pessoaRoutes);
app.use(moradiaRoutes);
app.use(familiaRoutes);
app.use(petRoutes);
app.use(fotoRoutes);
