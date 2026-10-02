import {
  createArchitecture,
  deleteArchitectureForUser,
  findArchitectureByIdForUser,
  findArchitecturesByUser,
  updateArchitectureForUser,
} from '../repositories/architectureRepository.js';

export function saveArchitecture(userId, payload) {
  return createArchitecture(userId, payload);
}

export function listArchitectures(userId) {
  return findArchitecturesByUser(userId);
}

export function getArchitecture(id, userId) {
  return findArchitectureByIdForUser(id, userId);
}

export function updateArchitecture(id, userId, payload) {
  return updateArchitectureForUser(id, userId, payload);
}

export function removeArchitecture(id, userId) {
  return deleteArchitectureForUser(id, userId);
}
