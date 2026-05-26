import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const signToken = (payload) =>
  jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expire });

export const verifyToken = (token) => jwt.verify(token, config.jwt.secret);

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const generateRandomToken = () => crypto.randomBytes(32).toString('hex');
