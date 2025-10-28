import { Request } from 'express';
import { parse } from 'cookie';
const { ACCESS_DATA_COOKIE_NAME } = require('./constants');

module.exports = function getAccessDataCookie(req: Request): string | null {
  const cookieHeader = req.headers.cookie || '';
  const cookies = parse(cookieHeader);
  const accessDataCookie = cookies?.[ACCESS_DATA_COOKIE_NAME] ?? null;

  return accessDataCookie ? JSON.parse(accessDataCookie) : null;
};
