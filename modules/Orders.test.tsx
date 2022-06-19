import { act, render, screen } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import Orders from './Orders'
import { ordersMapped } from '../mocks/ordersMapped'
import Highcharts from 'highcharts/highstock'
import { ORDER_SUMMARY_LABELS } from './OrdersSummary'

jest.mock('highcharts/highstock')

describe('Orders', () => {
  const renderComponent = async (): Promise<void> => {
    await act(async () => {
      render(<Orders />)
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    fetchMock.mockResponse(JSON.stringify({ orders: ordersMapped }))
  })

  it('fetches orders correctly', async () => {
    await renderComponent()

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(fetchMock.mock.calls[0][0]).toEqual(
      process.env.DISCOGS_APP_URL + '/orders'
    )

    expect(screen.queryByTestId('orders-loader')).not.toBeInTheDocument()
  })

  it('renders summary correctly', async () => {
    const firstOrderDate = '2022-01-01'
    const lastOrderDate = '2022-06-01'

    jest
      .spyOn(Highcharts, 'dateFormat')
      .mockReturnValueOnce(firstOrderDate)
      .mockReturnValueOnce(lastOrderDate)

    await renderComponent()

    expect(fetchMock).toHaveBeenCalledTimes(1)

    const profileLink = screen.getByTestId('order-summary-profile-link')
    expect(profileLink).toHaveAttribute(
      'href',
      `https://www.discogs.com/de/seller/${ordersMapped.username}/profile`
    )
    expect(profileLink).toHaveTextContent('Profile Link')

    ORDER_SUMMARY_LABELS.forEach((label, index) => {
      expect(
        screen.getByTestId(`order-summary-label-${index}`)
      ).toHaveTextContent(label)
    })

    expect(
      screen.getByText(ORDER_SUMMARY_LABELS[0] + ':').parentNode
    ).toHaveTextContent(firstOrderDate)
    expect(
      screen.getByText(ORDER_SUMMARY_LABELS[1] + ':').parentNode
    ).toHaveTextContent(lastOrderDate)
    expect(
      screen.getByText(ORDER_SUMMARY_LABELS[2] + ':').parentNode
    ).toHaveTextContent(ordersMapped.ordersTotal.toString())
    expect(
      screen.getByText(ORDER_SUMMARY_LABELS[3] + ':').parentNode
    ).toHaveTextContent(ordersMapped.itemsSold.toString())
    expect(
      screen.getByText(ORDER_SUMMARY_LABELS[4] + ':').parentNode
    ).toHaveTextContent(ordersMapped.ordersSent.toString())
    expect(
      screen.getByText(ORDER_SUMMARY_LABELS[5] + ':').parentNode
    ).toHaveTextContent(ordersMapped.ordersCancelled.toString())
    expect(
      screen.getByText(ORDER_SUMMARY_LABELS[6] + ':').parentNode
    ).toHaveTextContent(ordersMapped.ordersRefund.toString())
    expect(
      screen.getByText(ORDER_SUMMARY_LABELS[7] + ':').parentNode
    ).toHaveTextContent(Number(ordersMapped.totalAmount).toFixed(2) + ' €')
  })
})
