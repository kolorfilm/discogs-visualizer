export interface OrdersPagination {
  page: number;
  pages: number;
  per_page: number;
  items: number;
  urls: {
    last: string;
    next: string;
  };
}
