import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel.js';

const signup = async (name, email, password) => {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error('User already exists');

  const hashed = await bcrypt.hash(password, 10);
  await createUser(name, email, hashed);
};

const login = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

export { signup, login };
