import { Router } from 'express';
import { MoradiaController } from '../controllers/moradia.controller';
import { FamiliaRepository } from '../repositories/familia.repository';
import { FotoRepository } from '../repositories/foto.repository';
import { MoradiaRepository } from '../repositories/moradia.repository';
import { MoradiaService } from '../services/moradia.service';

const repo = new MoradiaRepository();
const familiaRepo = new FamiliaRepository();
const fotoRepo = new FotoRepository();
const service = new MoradiaService(repo, familiaRepo, fotoRepo);
const controller = new MoradiaController(service);

const router = Router();

router.get('/api/moradias', controller.getAll);
router.get('/api/moradias/:id/detalhes', controller.getDetalhes);
router.get('/api/moradias/:id/familias/historico', controller.getHistoricoFamilias);
router.get('/api/moradias/:id', controller.getById);
router.post('/api/moradias', controller.criar);
router.put('/api/moradias/:id', controller.atualizar);
router.delete('/api/moradias/:id', controller.remover);

export default router;
