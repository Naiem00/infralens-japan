import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import {
  createUser,
  findUserByEmail,
  findUserById,
} from '../repositories/userRepository.js';

function createToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );
}

export async function registerUser({
  name,
  email,
  password,
}) {
  const existing = await findUserByEmail(email);

  if (existing) {
    const error = new Error(
      'An account with this email already exists.'
    );
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await createUser({
    name,
    email,
    passwordHash,
  });

  return {
    user,
    token: createToken(user),
  };
}

export async function loginUser({
  email,
  password,
}) {
  const user = await findUserByEmail(email);

  if (!user) {
    const error = new Error(
      'Invalid email or password.'
    );
    error.statusCode = 401;
    throw error;
  }

  const matches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!matches) {
    const error = new Error(
      'Invalid email or password.'
    );
    error.statusCode = 401;
    throw error;
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };

  return {
    user: safeUser,
    token: createToken(safeUser),
  };
}

export async function getCurrentUser(id) {
  return findUserById(id);
}
