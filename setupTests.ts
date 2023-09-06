import fetchMock from 'jest-fetch-mock'
import { TextEncoder } from 'util'

fetchMock.enableMocks()
jest.mock('next/router', () => require('next-router-mock'))

process.env.DISCOGS_APP_URL = 'http://localhost:3000'
process.env.DISCOGS_CALLBACK_URL = 'http://localhost:3000/callback'

Object.defineProperty(window.document, 'cookie', {
  writable: true,
  value: '',
})

global.TextEncoder = TextEncoder
