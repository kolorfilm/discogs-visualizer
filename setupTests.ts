import { TextEncoder } from 'util';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
jest.mock('next/router', () => require('next-router-mock'));

process.env.DISCOGS_APP_URL = 'http://localhost:3000';
process.env.DISCOGS_CALLBACK_URL = 'http://localhost:3000/callback';

Object.defineProperty(window.document, 'cookie', {
  writable: true,
  value: '',
});

global.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
