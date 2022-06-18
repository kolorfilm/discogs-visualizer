import { Order } from './Order'
import { OrdersPagination } from './OrdersPagination'

export interface Orders {
  orders: Order[]
  pagination: OrdersPagination
}
