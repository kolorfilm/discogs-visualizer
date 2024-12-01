import { OrdersMapped } from '../types/OrdersMapped'
import Highcharts from 'highcharts/highstock'
import * as ReactDOMServer from 'react-dom/server'
import cx from 'classnames'
import styles from './Orders.module.scss'
import React, { useEffect } from 'react'

const tooltipHeaderAsString = (): string =>
  ReactDOMServer.renderToString(
    <div className={cx(styles.item, styles.head)}>
      <span className={styles.price}>Total</span>
      <span className={styles.price}>Fee</span>
      <span className={styles.release}>Order Link</span>
    </div>
  )

const tooltipLineItemAsString = (item: {
  total: number
  fee: number
  id: string
}): string =>
  ReactDOMServer.renderToString(
    <div className={styles.item}>
      <span className={styles.price}>{Number(item.total).toFixed(2)} €</span>
      <span className={styles.price}>{Number(item.fee).toFixed(2)} €</span>
      <a
        href={`https://www.discogs.com/sell/order/${item.id}`}
        className={styles.release}
      >
        {item.id}
      </a>
      <span></span>
    </div>
  )

const tooltipFooterAsString = (totalFees: number, value: number): string =>
  ReactDOMServer.renderToString(
    <div className={styles.item}>
      <span className={cx(styles.price, styles.priceTotal, styles.foot)}>
        {Number(value).toFixed(2)} €
      </span>
      <span className={cx(styles.price, styles.foot)}>
        {Number(totalFees).toFixed(2)} €
      </span>
      <span className={cx(styles.release, styles.foot)}></span>
    </div>
  )

const initHighcharts = (containerId: string, orders: OrdersMapped): void => {
  Highcharts.setOptions({
    lang: {
      thousandsSep: '.',
      decimalPoint: ',',
    },
  })

  Highcharts.stockChart(containerId, {
    title: {
      text: 'Discogs Orders',
    },
    subtitle: {
      text: 'Profile of ' + orders.username,
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return Highcharts.dateFormat('%Y/%m', this.value as number)
        },
      },
    },
    yAxis: {
      title: {
        text: 'Price',
      },
    },
    plotOptions: {
      column: {
        grouping: false,
      },
    },
    tooltip: {
      valueDecimals: 2,
      useHTML: true,
      formatter: function () {
        const year = new Date(this.x as number).getFullYear()
        const month = new Date(this.x as number).getMonth()
        let totalFees = 0
        let htmlItems = '<div>' + tooltipHeaderAsString()

        orders.seriesItems.forEach((item) => {
          const item_year = new Date(item.created).getFullYear()
          const item_month = new Date(item.created).getMonth()

          if (item_year === year && item_month === month) {
            htmlItems += tooltipLineItemAsString(item)
            totalFees += item.fee
          }
        })

        htmlItems += tooltipFooterAsString(totalFees, this.y as number)
        htmlItems += '</div>'

        return htmlItems
      },
    },
    series: [
      {
        type: 'column',
        dataGrouping: {
          forced: true,
          units: [['month', [1]]],
        },
        data: orders.series,
      },
    ],
  })
}

interface Props {
  orders: OrdersMapped
}

const OrdersHighcharts: React.FC<Props> = ({ orders }) => {
  const highchartsContainerId = 'highcharts-container'

  useEffect(() => {
    initHighcharts(highchartsContainerId, orders)
  }, [highchartsContainerId, orders])

  return <div id={highchartsContainerId}></div>
}

export default OrdersHighcharts
