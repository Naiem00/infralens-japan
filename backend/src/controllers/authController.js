import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../services/authService.js';
import {
  validateLoginPayload,
  validateRegisterPayload,
} from '../validators/authValidator.js';

export async function registerHandler(
  req,
  res,
  next
) {
  try {
    const errors =
      validateRegisterPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors,
      });
    }

    const result = await registerUser(req.body);

    return res.status(201).json({
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function loginHandler(
  req,
  res,
  next
) {
  try {
    const errors =
      validateLoginPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors,
      });
    }

    const result = await loginUser(req.body);

    return res.json({
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function meHandler(
  req,
  res,
  next
) {
  try {
    const user = await getCurrentUser(
      req.auth.userId
    );

    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
      });
    }

    return res.json({
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}
