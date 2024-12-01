import { SeriesItem } from './SeriesItem';

export interface OrdersMapped {
  series: Record<number, number>[];
  seriesItems: SeriesItem[];
  ordersTotal: number;
  ordersSent: number;
  ordersCancelled: number;
  ordersRefund: number;
  itemsSold: number;
  totalAmount: number;
  username?: string;
}
