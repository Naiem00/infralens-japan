import {
  createAssessmentRecord,
  findAllAssessments,
  findAssessmentById,
} from '../repositories/assessmentRepository.js';

export async function createAssessment(payload) {
  return createAssessmentRecord(payload);
}

export async function getAssessments() {
  return findAllAssessments();
}

export async function getAssessment(id) {
  return findAssessmentById(id);
}
