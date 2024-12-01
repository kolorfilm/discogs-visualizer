import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
const OrdersHighcharts = dynamic(() => import('./OrdersHighcharts'), {
  ssr: false,
})
import OrdersSummary from './OrdersSummary'
import { OrdersMapped } from '../types/OrdersMapped'
import styles from './Orders.module.scss'

const Orders: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrdersMapped | null>(null)
  const [firstOrderDate, setFirstOrderDate] = useState('')
  const [lastOrderDate, setLastOrderDate] = useState('')

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      fetch(process.env.DISCOGS_APP_URL + '/orders')
        .then((orders) => {
          return orders.json()
        })
        .then((data) => {
          if (data.hasAuthError) {
            location.assign('authorize')
            return
          }

          const orders = data.orders
          const seriesItems = orders.seriesItems
          const formatter = new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
          const firstOrderDate = formatter.format(seriesItems[0].created)
          const lastOrderDate = formatter.format(
            seriesItems[seriesItems.length - 1].created
          )

          setOrders(orders)
          setFirstOrderDate(firstOrderDate)
          setLastOrderDate(lastOrderDate)
        })
    }

    fetchOrders().then()
  }, [])

  useEffect(() => {
    if (orders) {
      setLoading(false)
    }
  }, [orders])

  return (
    <div className={styles.container}>
      <Head>
        <title>Discogs Visualizer</title>
      </Head>
      <main className={styles.main}>
        {loading && (
          <div className={styles.loader} data-testid="orders-loader"></div>
        )}
        {orders && (
          <>
            <OrdersHighcharts orders={orders} />
            <OrdersSummary
              orders={orders}
              firstOrderDate={firstOrderDate}
              lastOrderDate={lastOrderDate}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default Orders
