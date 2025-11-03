import { OrdersMapped } from '../../types/OrdersMapped';
import {
  mockAccessData,
  mockOrdersMixedStatus,
  mockOrdersMultiPagePage1,
  mockOrdersMultiPagePage2,
  mockOrdersAllStatuses,
  mockOrdersProfitCalculation,
  mockOrdersMultipleItems,
  mockOrdersWithTimestamp,
  mockOrdersEmpty,
  mockOrdersSeriesItems,
} from '../../mocks/orders';

const mockGetOrders = vi.fn();

vi.mock('./discogsClient', () => ({
  createDiscogsClient: vi.fn(() => ({
    marketplace: () => ({
      getOrders: mockGetOrders,
    }),
  })),
}));

import getOrders from './getOrders';

describe('getOrders', () => {
  beforeEach(() => {
    mockGetOrders.mockClear();
  });

  it('should process orders and return mapped data', async () => {
    mockGetOrders.mockResolvedValue(mockOrdersMixedStatus);

    const result: OrdersMapped = await getOrders(mockAccessData);

    expect(result.ordersTotal).toBe(2);
    expect(result.ordersSent).toBe(1);
    expect(result.ordersCancelled).toBe(1);
    expect(result.ordersRefund).toBe(0);
    expect(result.itemsSold).toBe(1);
    expect(result.totalAmount).toBe(90); // 100 - 10
    expect(result.series).toHaveLength(1);
    expect(result.seriesItems).toHaveLength(1);
  });

  it('should handle multiple pages of orders', async () => {
    mockGetOrders
      .mockResolvedValueOnce(mockOrdersMultiPagePage1)
      .mockResolvedValueOnce(mockOrdersMultiPagePage1)
      .mockResolvedValueOnce(mockOrdersMultiPagePage2);

    const result: OrdersMapped = await getOrders(mockAccessData);

    expect(result.ordersTotal).toBe(2);
    expect(result.ordersSent).toBe(2);
    expect(result.itemsSold).toBe(2);
    expect(result.totalAmount).toBe(135); // (100-10) + (50-5)
  });

  it('should correctly categorize different order statuses', async () => {
    mockGetOrders.mockResolvedValue(mockOrdersAllStatuses);

    const result: OrdersMapped = await getOrders(mockAccessData);

    expect(result.ordersTotal).toBe(8);
    expect(result.ordersSent).toBe(6); // Shipped, New Order, Invoice Sent, Payment Pending, Payment Received, Order Changed
    expect(result.ordersCancelled).toBe(1);
    expect(result.ordersRefund).toBe(1);
  });

  it('should calculate profit correctly (total - fee)', async () => {
    mockGetOrders.mockResolvedValue(mockOrdersProfitCalculation);

    const result: OrdersMapped = await getOrders(mockAccessData);

    expect(result.totalAmount).toBe(100); // 123.45 - 23.45
    expect(result.series[0][1]).toBe(100);
  });

  it('should handle orders with multiple items', async () => {
    mockGetOrders.mockResolvedValue(mockOrdersMultipleItems);

    const result: OrdersMapped = await getOrders(mockAccessData);

    expect(result.itemsSold).toBe(3);
    expect(result.seriesItems[0].items).toHaveLength(3);
  });

  it('should convert dates to timestamps correctly', async () => {
    const testDate = '2023-06-15T14:30:00.000Z';
    const expectedTimestamp = new Date(testDate).getTime();

    mockGetOrders.mockResolvedValue(mockOrdersWithTimestamp(testDate));

    const result: OrdersMapped = await getOrders(mockAccessData);

    expect(result.series[0][0]).toBe(expectedTimestamp);
    expect(result.seriesItems[0].created).toBe(expectedTimestamp);
  });

  it('should handle empty orders list', async () => {
    mockGetOrders.mockResolvedValue(mockOrdersEmpty);

    const result: OrdersMapped = await getOrders(mockAccessData);

    expect(result.ordersTotal).toBe(0);
    expect(result.ordersSent).toBe(0);
    expect(result.ordersCancelled).toBe(0);
    expect(result.ordersRefund).toBe(0);
    expect(result.itemsSold).toBe(0);
    expect(result.totalAmount).toBe(0);
    expect(result.series).toHaveLength(0);
    expect(result.seriesItems).toHaveLength(0);
  });

  it('should populate seriesItems with correct data structure', async () => {
    mockGetOrders.mockResolvedValue(mockOrdersSeriesItems);

    const result: OrdersMapped = await getOrders(mockAccessData);

    expect(result.seriesItems).toHaveLength(1);
    expect(result.seriesItems[0]).toEqual({
      id: '123',
      created: new Date('2023-01-01T00:00:00.000Z').getTime(),
      resourceUrl: 'https://api.discogs.com/orders/123',
      total: 100,
      fee: 10,
      items: mockOrdersSeriesItems.orders[0].items,
    });
  });
});
