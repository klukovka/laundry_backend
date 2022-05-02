export class PagedModel<T> {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  content: Array<T>;

  constructor(
    page: number,
    size: number,
    totalPages: number,
    totalElements: number,
    content: Array<T>
  ) {
    this.page = page;
    this.size = size;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.content = content;
  }
}
