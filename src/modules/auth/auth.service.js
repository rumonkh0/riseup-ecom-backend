import bcrypt from 'bcryptjs';
import prisma from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import {
  generateRandomToken,
  hashToken,
  signToken,
} from '../../utils/token.js';
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '../../services/email.service.js';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRE_HOURS = 24;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const buildAuthResponse = (user) => {
  const token = signToken({ id: user.id, role: user.role });
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    phone: user.phone,
  };
  return { token, user: safeUser };
};

const setEmailVerifyToken = async (userId) => {
  const rawToken = generateRandomToken();
  const hashed = hashToken(rawToken);
  const expire = new Date(Date.now() + TOKEN_EXPIRE_HOURS * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: { emailVerifyToken: hashed, emailVerifyExpire: expire },
  });

  return rawToken;
};

export const register = async ({ name, email, password, phone }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('Email already registered.', 409);
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, phone },
  });

  const rawToken = await setEmailVerifyToken(user.id);
  await sendVerificationEmail(user, rawToken).catch(() => {});

  return buildAuthResponse(user);
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    throw new AppError('Invalid email or password.', 401);
  }
  return buildAuthResponse(user);
};

export const verifyEmail = async (rawToken) => {
  const hashed = hashToken(rawToken);
  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: hashed,
      emailVerifyExpire: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError('Invalid or expired verification token.', 400);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      emailVerifyToken: null,
      emailVerifyExpire: null,
    },
  });

  return { message: 'Email verified successfully.' };
};

export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { message: 'If that email exists, a reset link was sent.' };
  }

  const rawToken = generateRandomToken();
  const hashed = hashToken(rawToken);
  const expire = new Date(Date.now() + TOKEN_EXPIRE_HOURS * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetPasswordToken: hashed, resetPasswordExpire: expire },
  });

  await sendPasswordResetEmail(user, rawToken).catch(() => {});

  return { message: 'If that email exists, a reset link was sent.' };
};

export const resetPassword = async ({ token, password }) => {
  const hashed = hashToken(token);
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashed,
      resetPasswordExpire: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token.', 400);
  }

  const hashedPassword = await hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
  });

  return buildAuthResponse(user);
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await comparePassword(currentPassword, user.password))) {
    throw new AppError('Current password is incorrect.', 401);
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return { message: 'Password updated successfully.' };
};

export const resendVerification = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);
  if (user.isVerified) {
    throw new AppError('Email is already verified.', 400);
  }

  const rawToken = await setEmailVerifyToken(user.id);
  await sendVerificationEmail(user, rawToken);

  return { message: 'Verification email sent.' };
};

export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      phone: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) throw new AppError('User not found.', 404);
  return user;
};
