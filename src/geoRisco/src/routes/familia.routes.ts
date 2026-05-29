import { Router } from 'express';
import { FamiliaController } from '../controllers/familia.controller';
import { FamiliaRepository } from '../repositories/familia.repository';
import { FotoRepository } from '../repositories/foto.repository';
import { MoradiaRepository } from '../repositories/moradia.repository';
import { PetRepository } from '../repositories/pet.repository';
import { PessoaRepository } from '../repositories/pessoa.repository';
import { FamiliaService } from '../services/familia.service';

const familiaRepo = new FamiliaRepository();
const moradiaRepo = new MoradiaRepository();
const pessoaRepo = new PessoaRepository();
const petRepo = new PetRepository();
const fotoRepo = new FotoRepository();
const service = new FamiliaService(familiaRepo, moradiaRepo, pessoaRepo, petRepo, fotoRepo);
const controller = new FamiliaController(service);

const router = Router();

router.get('/api/familias', controller.getAll);
router.get('/api/familias/:id', controller.getById);
router.post('/api/familias', controller.criar);
router.delete('/api/familias/:id', controller.remover);

router.post('/api/familias/nucleo', controller.cadastrarNucleoFamiliar);

router.get('/api/familias/:id/pessoas/historico', controller.getHistoricoPessoas);
router.get('/api/familias/:id/pessoas', controller.getPessoas);
router.post('/api/familias/:id/pessoas', controller.vincularPessoa);
router.delete('/api/familias/:id/pessoas/:pessoaId', controller.removerPessoa);

router.get('/api/familias/:id/moradias/historico', controller.getHistoricoMoradias);
router.get('/api/familias/:id/moradias', controller.getMoradias);
router.post('/api/familias/:id/moradias', controller.vincularMoradia);
router.delete('/api/familias/:id/moradias/:moradiaId', controller.removerMoradia);

export default router;
