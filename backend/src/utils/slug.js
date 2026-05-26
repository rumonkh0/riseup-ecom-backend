import slugify from 'slugify';

export const createSlug = (text) =>
  slugify(text, { lower: true, strict: true, trim: true });
