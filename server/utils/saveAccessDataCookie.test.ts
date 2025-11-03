import { Response } from 'express';
import type { Mock } from 'vitest';
import { RequestData } from '../../types/RequestData';
import saveAccessDataInCookie from './saveAccessDataCookie';

describe('saveAccessDataCookie', () => {
  let mockSetHeader: Mock;
  let mockResponse: Response;

  beforeEach(() => {
    mockSetHeader = vi.fn();
    mockResponse = {
      setHeader: mockSetHeader,
    } as unknown as Response;
  });

  it('should set cookie header with serialized access data', () => {
    const accessData: RequestData = {
      method: 'oauth',
      level: 2,
      consumerKey: 'testKey',
      consumerSecret: 'testSecret',
      token: 'testToken',
      tokenSecret: 'testTokenSecret',
      authorizeUrl: 'https://example.com',
    };

    saveAccessDataInCookie(mockResponse, accessData);

    expect(mockSetHeader).toHaveBeenCalledTimes(1);
    expect(mockSetHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringContaining('accessData=')
    );
  });

  it('should set cookie with correct attributes', () => {
    const accessData: RequestData = {
      method: 'oauth',
      level: 2,
      consumerKey: 'testKey',
      consumerSecret: 'testSecret',
      token: 'testToken',
      tokenSecret: 'testTokenSecret',
      authorizeUrl: 'https://example.com',
    };

    saveAccessDataInCookie(mockResponse, accessData);

    const setHeaderCall = mockSetHeader.mock.calls[0][1] as string;

    expect(setHeaderCall).toContain('Path=/');
    expect(setHeaderCall).toContain('HttpOnly');
    expect(setHeaderCall).toContain('Max-Age=604800'); // 7 days in seconds
  });

  it('should serialize access data as JSON in cookie', () => {
    const accessData: RequestData = {
      method: 'oauth',
      level: 2,
      consumerKey: 'testKey',
      consumerSecret: 'testSecret',
      token: 'testToken',
      tokenSecret: 'testTokenSecret',
      authorizeUrl: 'https://example.com',
    };

    saveAccessDataInCookie(mockResponse, accessData);

    const setHeaderCall = mockSetHeader.mock.calls[0][1] as string;
    const cookieValue = setHeaderCall.split(';')[0].split('=')[1];
    const decodedValue = decodeURIComponent(cookieValue);

    expect(JSON.parse(decodedValue)).toEqual(accessData);
  });

  it('should handle empty access data object', () => {
    const accessData: Partial<RequestData> = {};

    saveAccessDataInCookie(mockResponse, accessData as RequestData);

    expect(mockSetHeader).toHaveBeenCalledTimes(1);
    expect(mockSetHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringContaining('accessData=')
    );
  });

  it('should handle access data with special characters', () => {
    const accessData: RequestData = {
      method: 'oauth',
      level: 2,
      consumerKey: 'test@Key#123',
      consumerSecret: 'test$Secret&456',
      token: 'test/Token+789',
      tokenSecret: 'test=TokenSecret%000',
      authorizeUrl: 'https://example.com?param=value',
    };

    saveAccessDataInCookie(mockResponse, accessData);

    expect(mockSetHeader).toHaveBeenCalledTimes(1);

    const setHeaderCall = mockSetHeader.mock.calls[0][1] as string;

    expect(setHeaderCall).toContain('accessData=');
  });
});
