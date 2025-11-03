import { Request } from 'express';
import getAccessDataCookie from './getAccessDataCookie';

describe('getAccessDataCookie', () => {
  let mockRequest: Request;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    } as Request;
  });

  it('should return null when no cookie header is present', () => {
    const result = getAccessDataCookie(mockRequest);

    expect(result).toBeNull();
  });

  it('should return null when cookie header is empty', () => {
    mockRequest.headers = { cookie: '' };

    const result = getAccessDataCookie(mockRequest);

    expect(result).toBeNull();
  });

  it('should return null when accessData cookie is not present', () => {
    mockRequest.headers = { cookie: 'otherCookie=value; anotherCookie=anotherValue' };

    const result = getAccessDataCookie(mockRequest);

    expect(result).toBeNull();
  });

  it('should parse and return accessData cookie when present', () => {
    const accessData = {
      method: 'oauth',
      level: 2,
      consumerKey: 'testKey',
      consumerSecret: 'testSecret',
      token: 'testToken',
      tokenSecret: 'testTokenSecret',
      authorizeUrl: 'https://example.com',
    };

    mockRequest.headers = {
      cookie: `accessData=${JSON.stringify(accessData)}`,
    };

    const result = getAccessDataCookie(mockRequest);

    expect(result).toEqual(accessData);
  });

  it('should parse accessData cookie from multiple cookies', () => {
    const accessData = {
      method: 'oauth',
      level: 2,
      consumerKey: 'testKey',
      consumerSecret: 'testSecret',
      token: 'testToken',
      tokenSecret: 'testTokenSecret',
      authorizeUrl: 'https://example.com',
    };

    mockRequest.headers = {
      cookie: `otherCookie=value; accessData=${JSON.stringify(accessData)}; anotherCookie=anotherValue`,
    };

    const result = getAccessDataCookie(mockRequest);

    expect(result).toEqual(accessData);
  });

  it('should handle malformed JSON in cookie gracefully', () => {
    mockRequest.headers = {
      cookie: 'accessData={invalid-json}',
    };

    expect(() => {
      getAccessDataCookie(mockRequest);
    }).toThrow();
  });

  it('should handle URL-encoded cookie values', () => {
    const accessData = {
      method: 'oauth',
      level: 2,
      consumerKey: 'testKey',
      consumerSecret: 'testSecret',
      token: 'testToken',
      tokenSecret: 'testTokenSecret',
      authorizeUrl: 'https://example.com',
    };

    const encodedValue = encodeURIComponent(JSON.stringify(accessData));

    mockRequest.headers = {
      cookie: `accessData=${encodedValue}`,
    };

    const result = getAccessDataCookie(mockRequest);

    expect(result).toEqual(accessData);
  });
});
