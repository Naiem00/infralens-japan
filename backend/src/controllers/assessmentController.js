import {
  createAssessment,
  getAssessment,
  getAssessments,
} from '../services/assessmentService.js';
import { validateAssessmentPayload } from '../validators/assessmentValidator.js';

export async function createAssessmentHandler(req, res, next) {
  try {
    const errors = validateAssessmentPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors,
      });
    }

    const created = await createAssessment(req.body);

    return res.status(201).json({
      data: created,
    });
  } catch (error) {
    return next(error);
  }
}

export async function listAssessmentsHandler(_req, res, next) {
  try {
    const assessments = await getAssessments();

    return res.json({
      data: assessments,
      count: assessments.length,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAssessmentHandler(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'Invalid assessment id.',
      });
    }

    const assessment = await getAssessment(id);

    if (!assessment) {
      return res.status(404).json({
        error: 'Assessment not found.',
      });
    }

    return res.json({
      data: assessment,
    });
  } catch (error) {
    return next(error);
  }
}
