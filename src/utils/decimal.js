import { Prisma } from '@prisma/client';

export const toDecimal = (value) => new Prisma.Decimal(value);

export const decimalToNumber = (value) =>
  value instanceof Prisma.Decimal ? value.toNumber() : Number(value);
