import { Component, computed, input, output } from '@angular/core';

/** Pagination controls. Pages are 0-based in the API and shown 1-based to the user. */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly maxVisiblePages = input(5);
  readonly pageChange = output<number>();

  protected readonly isFirst = computed(() => this.page() <= 0);
  protected readonly isLast = computed(() => this.page() >= this.totalPages() - 1);

  /** Window of page indexes centered on the current page whenever possible. */
  protected readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const count = Math.min(this.maxVisiblePages(), total);
    const start = Math.min(Math.max(this.page() - Math.floor(count / 2), 0), total - count);
    return Array.from({ length: count }, (_, index) => start + index);
  });

  protected goTo(page: number): void {
    if (page !== this.page() && page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
