const FORBIDDEN_KEYS = ['$where', '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin'];

const sanitizeValue = (value) => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return value.replace(/\0/g, '');
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (typeof value === 'object') return sanitizeObject(value);
  return value;
};

const sanitizeObject = (obj) => {
  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (FORBIDDEN_KEYS.includes(key) || key.startsWith('$')) continue;
    clean[key] = sanitizeValue(value);
  }
  return clean;
};

export const sanitizeRequestData = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  next();
};
