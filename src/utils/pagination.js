import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../constants/index.js';

export const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1),
    MAX_LIMIT
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildPaginationMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1,
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});
