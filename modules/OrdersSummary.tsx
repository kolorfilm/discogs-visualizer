import React from 'react'
import { OrdersMapped } from '../types/OrdersMapped'
import styles from './OrdersSummary.module.scss'

interface Props {
  orders: OrdersMapped
  firstOrderDate: string
  lastOrderDate: string
}

const OrdersSummary: React.FC<Props> = ({
  orders,
  firstOrderDate,
  lastOrderDate,
}) => {
  const summaryEntries = [
    { label: 'First Order', value: firstOrderDate },
    { label: 'Last Order', value: lastOrderDate },
    { label: 'Total Orders', value: orders.ordersTotal },
    { label: 'Items Sold', value: orders.itemsSold },
    { label: 'Sent Orders', value: orders.ordersSent },
    { label: 'Cancelled Order', value: orders.ordersCancelled },
    { label: 'Refunded Orders', value: orders.ordersRefund },
    {
      label: 'Total Amount',
      value: Number(orders.totalAmount).toFixed(2) + ' €',
    },
  ]

  return (
    <div className={styles.summary}>
      <div>
        <a
          className={styles.link}
          href={`https://www.discogs.com/de/seller/${orders.username}/profile`}
          target="_blank"
          rel="noreferrer"
        >
          Profile Link
        </a>
      </div>
      {summaryEntries.map((entry, index) => (
        <div key={index}>
          <label className={styles.label}>{entry.label}:</label>
          {entry.value}
        </div>
      ))}
    </div>
  )
}

export default OrdersSummary
