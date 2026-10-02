import { Router } from 'express';
import {
  createArchitectureHandler,
  deleteArchitectureHandler,
  getArchitectureHandler,
  listArchitecturesHandler,
  updateArchitectureHandler,
} from '../controllers/architectureController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.get('/', listArchitecturesHandler);
router.post('/', createArchitectureHandler);
router.get('/:id', getArchitectureHandler);
router.put('/:id', updateArchitectureHandler);
router.delete('/:id', deleteArchitectureHandler);

export default router;
