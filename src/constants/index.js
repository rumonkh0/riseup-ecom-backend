export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  VENDOR: 'VENDOR',
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const DISCOUNT_TYPE = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED',
};

export const CANCELLABLE_ORDER_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
];

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const TOKEN_TYPES = {
  EMAIL_VERIFY: 'email_verify',
  RESET_PASSWORD: 'reset_password',
};
