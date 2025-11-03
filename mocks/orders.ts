import { Orders } from '../types/Orders';
import { RequestData } from '../types/RequestData';

// Mock AccessData for tests
export const mockAccessData: RequestData = {
  method: 'oauth',
  level: 2,
  consumerKey: 'testKey',
  consumerSecret: 'testSecret',
  token: 'testToken',
  tokenSecret: 'testTokenSecret',
  authorizeUrl: 'https://example.com',
};

// Mock Orders with mixed statuses (Shipped and Cancelled)
export const mockOrdersMixedStatus: Orders = {
  pagination: { pages: 1, items: 2, page: 1, per_page: 50, urls: { last: '', next: '' } },
  orders: [
    {
      id: '1',
      created: '2023-01-01T00:00:00.000Z',
      status: 'Shipped',
      resource_url: 'https://api.discogs.com/orders/1',
      total: { value: 100 },
      fee: { value: 10 },
      items: [
        {
          id: 1,
          release: {
            id: 1,
            description: 'Test Album',
          },
          price: { value: 100 },
        },
      ],
    },
    {
      id: '2',
      created: '2023-01-02T00:00:00.000Z',
      status: 'Cancelled (Item Unavailable)',
      resource_url: 'https://api.discogs.com/orders/2',
      total: { value: 50 },
      fee: { value: 5 },
      items: [],
    },
  ],
};

// Mock Orders - Page 1 of 2
export const mockOrdersMultiPagePage1: Orders = {
  pagination: { pages: 2, items: 100, page: 1, per_page: 50, urls: { last: '', next: '' } },
  orders: [
    {
      id: '1',
      created: '2023-01-01T00:00:00.000Z',
      status: 'Shipped',
      resource_url: 'https://api.discogs.com/orders/1',
      total: { value: 100 },
      fee: { value: 10 },
      items: [
        {
          id: 1,
          release: { id: 1, description: 'Album 1' },
          price: { value: 100 },
        },
      ],
    },
  ],
};

// Mock Orders - Page 2 of 2
export const mockOrdersMultiPagePage2: Orders = {
  pagination: { pages: 2, items: 100, page: 2, per_page: 50, urls: { last: '', next: '' } },
  orders: [
    {
      id: '2',
      created: '2023-01-02T00:00:00.000Z',
      status: 'Payment Received',
      resource_url: 'https://api.discogs.com/orders/2',
      total: { value: 50 },
      fee: { value: 5 },
      items: [
        {
          id: 2,
          release: { id: 2, description: 'Album 2' },
          price: { value: 50 },
        },
      ],
    },
  ],
};

// Mock Orders with all different status types
export const mockOrdersAllStatuses: Orders = {
  pagination: { pages: 1, items: 8, page: 1, per_page: 50, urls: { last: '', next: '' } },
  orders: [
    {
      id: '1',
      created: '2023-01-01T00:00:00.000Z',
      status: 'Shipped',
      resource_url: 'https://api.discogs.com/orders/1',
      total: { value: 100 },
      fee: { value: 10 },
      items: [
        {
          id: 1,
          release: { id: 1, description: 'Album' },
          price: { value: 100 },
        },
      ],
    },
    {
      id: '2',
      created: '2023-01-02T00:00:00.000Z',
      status: 'New Order',
      resource_url: 'https://api.discogs.com/orders/2',
      total: { value: 50 },
      fee: { value: 5 },
      items: [
        {
          id: 2,
          release: { id: 2, description: 'Album' },
          price: { value: 50 },
        },
      ],
    },
    {
      id: '3',
      created: '2023-01-03T00:00:00.000Z',
      status: 'Invoice Sent',
      resource_url: 'https://api.discogs.com/orders/3',
      total: { value: 75 },
      fee: { value: 7.5 },
      items: [
        {
          id: 3,
          release: { id: 3, description: 'Album' },
          price: { value: 75 },
        },
      ],
    },
    {
      id: '4',
      created: '2023-01-04T00:00:00.000Z',
      status: 'Payment Pending',
      resource_url: 'https://api.discogs.com/orders/4',
      total: { value: 60 },
      fee: { value: 6 },
      items: [
        {
          id: 4,
          release: { id: 4, description: 'Album' },
          price: { value: 60 },
        },
      ],
    },
    {
      id: '5',
      created: '2023-01-05T00:00:00.000Z',
      status: 'Payment Received',
      resource_url: 'https://api.discogs.com/orders/5',
      total: { value: 80 },
      fee: { value: 8 },
      items: [
        {
          id: 5,
          release: { id: 5, description: 'Album' },
          price: { value: 80 },
        },
      ],
    },
    {
      id: '6',
      created: '2023-01-06T00:00:00.000Z',
      status: 'Order Changed',
      resource_url: 'https://api.discogs.com/orders/6',
      total: { value: 90 },
      fee: { value: 9 },
      items: [
        {
          id: 6,
          release: { id: 6, description: 'Album' },
          price: { value: 90 },
        },
      ],
    },
    {
      id: '7',
      created: '2023-01-07T00:00:00.000Z',
      status: 'Cancelled (Item Unavailable)',
      resource_url: 'https://api.discogs.com/orders/7',
      total: { value: 40 },
      fee: { value: 4 },
      items: [],
    },
    {
      id: '8',
      created: '2023-01-08T00:00:00.000Z',
      status: 'Refund Sent',
      resource_url: 'https://api.discogs.com/orders/8',
      total: { value: 30 },
      fee: { value: 3 },
      items: [],
    },
  ],
};

// Mock Orders for profit calculation
export const mockOrdersProfitCalculation: Orders = {
  pagination: { pages: 1, items: 1, page: 1, per_page: 50, urls: { last: '', next: '' } },
  orders: [
    {
      id: '1',
      created: '2023-01-01T00:00:00.000Z',
      status: 'Shipped',
      resource_url: 'https://api.discogs.com/orders/1',
      total: { value: 123.45 },
      fee: { value: 23.45 },
      items: [
        {
          id: 1,
          release: { id: 1, description: 'Album' },
          price: { value: 123.45 },
        },
      ],
    },
  ],
};

// Mock Orders with multiple items per order
export const mockOrdersMultipleItems: Orders = {
  pagination: { pages: 1, items: 1, page: 1, per_page: 50, urls: { last: '', next: '' } },
  orders: [
    {
      id: '1',
      created: '2023-01-01T00:00:00.000Z',
      status: 'Shipped',
      resource_url: 'https://api.discogs.com/orders/1',
      total: { value: 100 },
      fee: { value: 10 },
      items: [
        {
          id: 1,
          release: { id: 1, description: 'Album 1' },
          price: { value: 50 },
        },
        {
          id: 2,
          release: { id: 2, description: 'Album 2' },
          price: { value: 30 },
        },
        {
          id: 3,
          release: { id: 3, description: 'Album 3' },
          price: { value: 20 },
        },
      ],
    },
  ],
};

// Mock Orders for timestamp conversion
export const mockOrdersWithTimestamp = (testDate: string): Orders => ({
  pagination: { pages: 1, items: 1, page: 1, per_page: 50, urls: { last: '', next: '' } },
  orders: [
    {
      id: '1',
      created: testDate,
      status: 'Shipped',
      resource_url: 'https://api.discogs.com/orders/1',
      total: { value: 100 },
      fee: { value: 10 },
      items: [
        {
          id: 1,
          release: { id: 1, description: 'Album' },
          price: { value: 100 },
        },
      ],
    },
  ],
});

// Mock Orders - Empty list
export const mockOrdersEmpty: Orders = {
  pagination: { pages: 1, items: 0, page: 1, per_page: 50, urls: { last: '', next: '' } },
  orders: [],
};

// Mock Orders for SeriesItems structure test
export const mockOrdersSeriesItems: Orders = {
  pagination: { pages: 1, items: 1, page: 1, per_page: 50, urls: { last: '', next: '' } },
  orders: [
    {
      id: '123',
      created: '2023-01-01T00:00:00.000Z',
      status: 'Shipped',
      resource_url: 'https://api.discogs.com/orders/123',
      total: { value: 100 },
      fee: { value: 10 },
      items: [
        {
          id: 1,
          release: { id: 1, description: 'Album' },
          price: { value: 100 },
        },
      ],
    },
  ],
};
