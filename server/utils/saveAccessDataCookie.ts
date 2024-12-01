import { setCookie } from 'nookies';
import { Request } from 'express';
import { RequestData } from '../../types/RequestData';

const { ACCESS_DATA_COOKIE_NAME } = require('./constants');

module.exports = function saveAccessDataInCookie(req: Request, accessData: RequestData): void {
  setCookie(req, ACCESS_DATA_COOKIE_NAME, JSON.stringify(accessData));
};
