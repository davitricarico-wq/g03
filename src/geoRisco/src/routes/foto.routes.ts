import { Router } from 'express';
import { FotoController } from '../controllers/foto.controller';
import { FotoStorageController } from '../controllers/foto-storage.controller';
import { FotoRepository } from '../repositories/foto.repository';
import { MoradiaRepository } from '../repositories/moradia.repository';
import { PetRepository } from '../repositories/pet.repository';
import { FotoStorageService } from '../services/foto-storage.service';
import { FotoService } from '../services/foto.service';

const fotoRepo = new FotoRepository();
const moradiaRepo = new MoradiaRepository();
const petRepo = new PetRepository();
const service = new FotoService(fotoRepo, moradiaRepo, petRepo);
const controller = new FotoController(service);
const storageService = new FotoStorageService(fotoRepo, moradiaRepo, petRepo);
const storageController = new FotoStorageController(storageService);

const router = Router();

router.get('/api/fotos', controller.getAll);
router.get('/api/fotos/:id', controller.getById);
router.get('/api/fotos/:id/signed-url', storageController.criarUrlAssinadaDaFoto);
router.put('/api/fotos/:id', controller.atualizar);
router.delete('/api/fotos/:id', controller.remover);

router.get('/api/moradias/:id/fotos', controller.getByMoradia);
router.post('/api/moradias/:id/fotos/upload-url', storageController.criarUploadParaMoradia);
router.post('/api/moradias/:id/fotos', controller.criarNaMoradia);
router.delete('/api/moradias/:id/fotos/:fotoId', controller.removerDaMoradia);

router.get('/api/pets/:id/fotos', controller.getByPet);
router.post('/api/pets/:id/fotos/upload-url', storageController.criarUploadParaPet);
router.post('/api/pets/:id/fotos', controller.criarNoPet);
router.delete('/api/pets/:id/fotos/:fotoId', controller.removerDoPet);

export default router;
