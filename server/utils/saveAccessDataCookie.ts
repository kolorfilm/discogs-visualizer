import { RequestData } from '../../types/RequestData'
import { setCookie } from 'nookies'
import { Request } from 'express'
const { ACCESS_DATA_COOKIE_NAME } = require('./constants')

module.exports = function saveAccessDataInCookie(
  req: Request,
  accessData: RequestData
): void {
  setCookie(req, ACCESS_DATA_COOKIE_NAME, JSON.stringify(accessData))
}
