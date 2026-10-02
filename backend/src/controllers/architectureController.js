import {
  getArchitecture,
  listArchitectures,
  removeArchitecture,
  saveArchitecture,
  updateArchitecture,
} from '../services/architectureService.js';
import { validateArchitecturePayload } from '../validators/architectureValidator.js';

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function createArchitectureHandler(req, res, next) {
  try {
    const errors = validateArchitecturePayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors,
      });
    }

    const architecture = await saveArchitecture(
      req.auth.userId,
      req.body
    );

    return res.status(201).json({
      data: architecture,
    });
  } catch (error) {
    return next(error);
  }
}

export async function listArchitecturesHandler(req, res, next) {
  try {
    const architectures = await listArchitectures(
      req.auth.userId
    );

    return res.json({
      data: architectures,
      count: architectures.length,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getArchitectureHandler(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: 'Invalid architecture id.',
      });
    }

    const architecture = await getArchitecture(
      id,
      req.auth.userId
    );

    if (!architecture) {
      return res.status(404).json({
        error: 'Architecture not found.',
      });
    }

    return res.json({
      data: architecture,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateArchitectureHandler(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: 'Invalid architecture id.',
      });
    }

    const errors = validateArchitecturePayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors,
      });
    }

    const architecture = await updateArchitecture(
      id,
      req.auth.userId,
      req.body
    );

    if (!architecture) {
      return res.status(404).json({
        error: 'Architecture not found.',
      });
    }

    return res.json({
      data: architecture,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteArchitectureHandler(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      return res.status(400).json({
        error: 'Invalid architecture id.',
      });
    }

    const deleted = await removeArchitecture(
      id,
      req.auth.userId
    );

    if (!deleted) {
      return res.status(404).json({
        error: 'Architecture not found.',
      });
    }

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
