import { Router } from 'express';
import {
  createAssessmentHandler,
  getAssessmentHandler,
  listAssessmentsHandler,
} from '../controllers/assessmentController.js';

const router = Router();

router.get('/', listAssessmentsHandler);
router.get('/:id', getAssessmentHandler);
router.post('/', createAssessmentHandler);

export default router;
