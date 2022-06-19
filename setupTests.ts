export {}

process.env.DISCOGS_APP_URL = 'http://localhost:3000'
process.env.DISCOGS_CALLBACK_URL = 'http://localhost:3000/callback'

require('jest-fetch-mock').enableMocks()

jest.mock('next/router', () => require('next-router-mock'))

Object.defineProperty(window.document, 'cookie', {
  writable: true,
  value: '',
})

import { TextEncoder } from 'util'

global.TextEncoder = TextEncoder
