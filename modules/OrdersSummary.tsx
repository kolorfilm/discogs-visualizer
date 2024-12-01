import React from 'react';
import { OrdersMapped } from '../types/OrdersMapped';
import styles from './OrdersSummary.module.scss';

export const ORDER_SUMMARY_LABELS = [
  'First Order',
  'Last Order',
  'Total Orders',
  'Items Sold',
  'Sent Orders',
  'Cancelled Order',
  'Refunded Orders',
  'Total Amount',
];

interface Props {
  orders: OrdersMapped;
  firstOrderDate: string;
  lastOrderDate: string;
}

const OrdersSummary: React.FC<Props> = ({ orders, firstOrderDate, lastOrderDate }) => {
  const summaryValues = [
    firstOrderDate,
    lastOrderDate,
    orders.ordersTotal,
    orders.itemsSold,
    orders.ordersSent,
    orders.ordersCancelled,
    orders.ordersRefund,
    Number(orders.totalAmount).toFixed(2) + ' €',
  ];

  return (
    <div className={styles.summary}>
      <div>
        <a
          className={styles.link}
          href={`https://www.discogs.com/de/seller/${orders.username}/profile`}
          target="_blank"
          rel="noreferrer"
          data-testid="order-summary-profile-link"
        >
          Profile Link
        </a>
      </div>
      {ORDER_SUMMARY_LABELS.map((label, index) => (
        <div key={index} data-testid={`order-summary-label-${index}`}>
          <label className={styles.label}>{label}:</label>
          {summaryValues[index]}
        </div>
      ))}
    </div>
  );
};

export default OrdersSummary;
