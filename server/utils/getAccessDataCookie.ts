import { Request } from 'express';
import { parse } from 'cookie';
import { RequestData } from '../../types/RequestData';
import { ACCESS_DATA_COOKIE_NAME } from './constants';

export default function getAccessDataCookie(req: Request): RequestData | null {
  const cookieHeader = req.headers.cookie || '';
  const cookies = parse(cookieHeader);
  const accessDataCookie = cookies?.[ACCESS_DATA_COOKIE_NAME] ?? null;

  return accessDataCookie ? JSON.parse(accessDataCookie) : null;
};
