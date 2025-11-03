import { TextEncoder } from 'util';
import createFetchMock from 'vitest-fetch-mock';
import '@testing-library/jest-dom/vitest';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

vi.mock('next/router', () => require('next-router-mock'));

process.env.NEXT_PUBLIC_DISCOGS_APP_URL = 'http://localhost:3000';
process.env.DISCOGS_CALLBACK_URL = 'http://localhost:3000/callback';

Object.defineProperty(window.document, 'cookie', {
  writable: true,
  value: '',
});

global.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder;
