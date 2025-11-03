import { RequestData } from '../../types/RequestData';
import { SeriesItem } from '../../types/SeriesItem';
import { Orders } from '../../types/Orders';
import { OrdersMapped } from '../../types/OrdersMapped';
import { createDiscogsClient } from './discogsClient';

export default async function getOrders(accessData: RequestData): Promise<OrdersMapped> {
  const marketplace = createDiscogsClient(accessData).marketplace();

  return await marketplace.getOrders({ per_page: 50 }).then(async (orders: Orders) => {
    let itemsSold = 0;
    let totalAmount = 0;
    let ordersTotal = 0;
    let ordersCancelled = 0;
    let ordersRefund = 0;
    const series: Record<number, number>[] = [];
    const seriesItems: SeriesItem[] = [];

    for (let i = 0; i < orders.pagination.pages; i++) {
      await marketplace.getOrders({ per_page: 50, page: i + 1 }).then((orders: Orders) => {
        orders.orders.forEach((order) => {
          ordersTotal++;

          if (
            [
              'Shipped',
              'New Order',
              'Invoice Sent',
              'Payment Pending',
              'Payment Received',
              'Order Changed',
            ].includes(order.status)
          ) {
            const timestamp = new Date(order.created).getTime();
            const profit = order.total.value - order.fee.value;

            itemsSold += order.items.length;
            totalAmount += profit;

            series.push([timestamp, profit]);

            seriesItems.push({
              id: order.id,
              created: new Date(order.created).getTime(),
              resourceUrl: order.resource_url,
              total: order.total.value,
              fee: order.fee.value,
              items: order.items,
            });

            return;
          }

          if (order.status.includes('Cancelled')) {
            ordersCancelled++;
            return;
          }

          if (order.status.includes('Refund Sent')) {
            ordersRefund++;
            return;
          }
        });
      });
    }

    return {
      series,
      seriesItems,
      ordersTotal,
      ordersSent: series.length,
      ordersCancelled,
      ordersRefund,
      itemsSold,
      totalAmount,
    };
  });
}
