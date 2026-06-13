import { Router } from 'express';
import { PrioridadeController } from '../controllers/prioridade.controller';
import { PrioridadeRepository } from '../repositories/prioridade.repository';

const repo = new PrioridadeRepository();
const controller = new PrioridadeController(repo);

const router = Router();

router.get('/api/prioridades', controller.getAll);
router.get('/api/pessoas/:id/prioridades', controller.getByPessoa);
router.put('/api/pessoas/:id/prioridades', controller.setForPessoa);

export default router;
