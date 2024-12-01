import { Request } from 'express';
import { parseCookies } from 'nookies';
const { ACCESS_DATA_COOKIE_NAME } = require('./constants');

module.exports = function getAccessDataCookie(req: Request): string | null {
  const cookies = parseCookies({ req });
  const accessDataCookie = cookies?.[ACCESS_DATA_COOKIE_NAME] ?? null;

  return accessDataCookie ? JSON.parse(accessDataCookie) : null;
};
