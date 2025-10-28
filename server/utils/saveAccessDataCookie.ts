import { serialize } from 'cookie';
import { Response } from 'express';
import { RequestData } from '../../types/RequestData';

const { ACCESS_DATA_COOKIE_NAME } = require('./constants');

module.exports = function saveAccessDataInCookie(res: Response, accessData: RequestData): void {
  const cookie = serialize(ACCESS_DATA_COOKIE_NAME, JSON.stringify(accessData), {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  res.setHeader('Set-Cookie', cookie);
};
