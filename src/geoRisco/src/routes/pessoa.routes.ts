import { Router } from 'express';
import { PessoaController } from '../controllers/pessoa.controller.ts';
import { PessoaRepository } from '../repositories/pessoa.repository.ts';
import { PessoaService } from '../services/pessoa.service.ts';

const repo = new PessoaRepository();
const service = new PessoaService(repo);
const controller = new PessoaController(service);

const router = Router();

router.get('/api/pessoas', controller.getAll);
router.get('/api/pessoas/busca', controller.buscar);
router.get('/api/pessoas/inativas', controller.getInativas);
router.get('/api/pessoas/:id', controller.getById);
router.post('/api/pessoas', controller.criar);
router.put('/api/pessoas/:id', controller.atualizar);
router.delete('/api/pessoas/:id', controller.remover);

router.get('/api/responsaveis', controller.getAllResponsaveis);
router.get('/api/responsaveis/:id', controller.getResponsavelById);
router.post('/api/responsaveis', controller.criarResponsavel);
router.put('/api/responsaveis/:id', controller.atualizarResponsavel);
router.delete('/api/responsaveis/:id', controller.removerResponsavel);

export default router;
