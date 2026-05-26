import { config } from '../config/index.js';

export const getTokenCookieOptions = () => ({
  expires: new Date(
    Date.now() + config.jwt.cookieExpire * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
  secure: config.cookie.secure,
  sameSite: config.isProduction ? 'strict' : 'lax',
});

export const sendTokenCookie = (res, token) => {
  res.cookie('token', token, getTokenCookieOptions());
};

export const clearTokenCookie = (res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
};
