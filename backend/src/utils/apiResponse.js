export const sendSuccess = (
  res,
  { statusCode = 200, message = 'Success', data = null, meta = null } = {}
) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

export const sendCreated = (res, message, data) =>
  sendSuccess(res, { statusCode: 201, message, data });

export const sendNoContent = (res) => res.status(204).send();
