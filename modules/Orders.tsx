import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import OrdersSummary from './OrdersSummary';
import { OrdersMapped } from '../types/OrdersMapped';
import styles from './Orders.module.scss';

const OrdersHighcharts = dynamic(() => import('./OrdersHighcharts'), {
  ssr: false,
});

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrdersMapped | undefined>(undefined);
  const [firstOrderDate, setFirstOrderDate] = useState('');
  const [lastOrderDate, setLastOrderDate] = useState('');

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      fetch(process.env.DISCOGS_APP_URL + '/orders')
        .then((orders) => orders.json())
        .then((data) => {
          if (data.hasAuthError) {
            location.assign('authorize');
            return;
          }

          const orders = data.orders;
          const seriesItems = orders.seriesItems;
          const formatter = new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
          const firstOrderDate = formatter.format(seriesItems[0].created);
          const lastOrderDate = formatter.format(seriesItems[seriesItems.length - 1].created);

          setOrders(orders);
          setFirstOrderDate(firstOrderDate);
          setLastOrderDate(lastOrderDate);
          setLoading(false);
        });
    };

    fetchOrders().then();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Discogs Visualizer</title>
      </Head>
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loader} data-testid="orders-loader"></div>
        ) : (
          orders && (
            <>
              <OrdersHighcharts orders={orders} />
              <OrdersSummary
                orders={orders}
                firstOrderDate={firstOrderDate}
                lastOrderDate={lastOrderDate}
              />
            </>
          )
        )}
      </main>
    </div>
  );
};

export default Orders;
