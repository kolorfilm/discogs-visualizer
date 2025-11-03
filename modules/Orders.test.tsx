import { act } from 'react';
import { render, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import Orders from './Orders';
import { ordersMapped } from '../mocks/ordersMapped';
import { ORDER_SUMMARY_LABELS } from './OrdersSummary';

jest.mock('highcharts/highstock');

describe('Orders', () => {
  const renderComponent = async (): Promise<void> => {
    await act(async () => {
      render(<Orders />);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockResponse(JSON.stringify({ orders: ordersMapped }));
  });

  it('fetches orders correctly', async () => {
    await renderComponent();

    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(fetchMock.mock.calls[0][0]).toEqual(process.env.NEXT_PUBLIC_DISCOGS_APP_URL + '/orders');

    expect(screen.queryByTestId('orders-loader')).not.toBeInTheDocument();
  });

  it('renders summary correctly', async () => {
    await renderComponent();

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const profileLink = screen.getByTestId('order-summary-profile-link');
    expect(profileLink).toHaveAttribute(
      'href',
      `https://www.discogs.com/de/seller/${ordersMapped.username}/profile`
    );
    expect(profileLink).toHaveTextContent('Profile Link');

    ORDER_SUMMARY_LABELS.forEach((label, index) => {
      expect(screen.getByTestId(`order-summary-label-${index}`)).toHaveTextContent(label);
    });

    expect(screen.getByText(ORDER_SUMMARY_LABELS[0] + ':').parentNode).toHaveTextContent(
      '2018-09-05'
    );
    expect(screen.getByText(ORDER_SUMMARY_LABELS[1] + ':').parentNode).toHaveTextContent(
      '2019-02-02'
    );
    expect(screen.getByText(ORDER_SUMMARY_LABELS[2] + ':').parentNode).toHaveTextContent(
      ordersMapped.ordersTotal.toString()
    );
    expect(screen.getByText(ORDER_SUMMARY_LABELS[3] + ':').parentNode).toHaveTextContent(
      ordersMapped.itemsSold.toString()
    );
    expect(screen.getByText(ORDER_SUMMARY_LABELS[4] + ':').parentNode).toHaveTextContent(
      ordersMapped.ordersSent.toString()
    );
    expect(screen.getByText(ORDER_SUMMARY_LABELS[5] + ':').parentNode).toHaveTextContent(
      ordersMapped.ordersCancelled.toString()
    );
    expect(screen.getByText(ORDER_SUMMARY_LABELS[6] + ':').parentNode).toHaveTextContent(
      ordersMapped.ordersRefund.toString()
    );
    expect(screen.getByText(ORDER_SUMMARY_LABELS[7] + ':').parentNode).toHaveTextContent(
      Number(ordersMapped.totalAmount).toFixed(2) + ' €'
    );
  });
});
