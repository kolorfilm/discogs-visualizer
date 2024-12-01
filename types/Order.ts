export interface Order {
  id: string;
  status: string;
  created: string;
  total: {
    value: number;
  };
  fee: {
    value: number;
  };
  items: unknown[];
  resource_url: string;
}
