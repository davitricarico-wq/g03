import { Router } from 'express';
import { PetController } from '../controllers/pet.controller';
import { FamiliaRepository } from '../repositories/familia.repository';
import { PetRepository } from '../repositories/pet.repository';
import { PetService } from '../services/pet.service';

const petRepo = new PetRepository();
const familiaRepo = new FamiliaRepository();
const service = new PetService(petRepo, familiaRepo);
const controller = new PetController(service);

const router = Router();

router.get('/api/pets', controller.getAll);
router.get('/api/pets/:id', controller.getById);
router.post('/api/pets', controller.criar);
router.put('/api/pets/:id', controller.atualizar);
router.delete('/api/pets/:id', controller.remover);

router.get('/api/familias/:id/pets', controller.getByFamilia);
router.post('/api/familias/:id/pets', controller.criarNaFamilia);

export default router;
