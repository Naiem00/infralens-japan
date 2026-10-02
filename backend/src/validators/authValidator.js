export function validateRegisterPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['Request body must be a JSON object.'];
  }

  const { name, email, password } = payload;

  if (
    typeof name !== 'string' ||
    name.trim().length < 2
  ) {
    errors.push(
      'name must contain at least 2 characters.'
    );
  }

  if (
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.push('A valid email is required.');
  }

  if (
    typeof password !== 'string' ||
    password.length < 8
  ) {
    errors.push(
      'password must contain at least 8 characters.'
    );
  }

  return errors;
}

export function validateLoginPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['Request body must be a JSON object.'];
  }

  if (
    typeof payload.email !== 'string' ||
    payload.email.trim().length === 0
  ) {
    errors.push('email is required.');
  }

  if (
    typeof payload.password !== 'string' ||
    payload.password.length === 0
  ) {
    errors.push('password is required.');
  }

  return errors;
}
