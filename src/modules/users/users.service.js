import prisma from '../../config/database.js';
import { AppError } from '../../utils/AppError.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';
import { uploadImage } from '../../services/cloudinary.service.js';

export const updateProfile = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isVerified: true,
    },
  });
};

export const updateAvatar = async (userId, file) => {
  const { url } = await uploadImage(file, 'avatars');
  return updateProfile(userId, { avatar: url });
};

export const getAddresses = async (userId) =>
  prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

export const addAddress = async (userId, data) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }
  return prisma.address.create({ data: { ...data, userId } });
};

export const updateAddress = async (userId, addressId, data) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) throw new AppError('Address not found.', 404);

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({ where: { id: addressId }, data });
};

export const deleteAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) throw new AppError('Address not found.', 404);
  await prisma.address.delete({ where: { id: addressId } });
};

export const listUsers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const where = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { email: { contains: query.search } },
    ];
  }
  if (query.role) where.role = query.role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, meta: buildPaginationMeta({ page, limit, total }) };
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      isVerified: true,
      createdAt: true,
    },
  });
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

export const updateUserRole = async (id, role) => {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
};

export const deleteUser = async (id) => {
  await prisma.user.delete({ where: { id } });
};
