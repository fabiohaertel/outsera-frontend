import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let fixture: ComponentFixture<Pagination>;
  let emitted: number[];

  async function render(page: number, totalPages: number): Promise<void> {
    fixture.componentRef.setInput('page', page);
    fixture.componentRef.setInput('totalPages', totalPages);
    await fixture.whenStable();
  }

  function button(label: string): HTMLButtonElement {
    return fixture.nativeElement.querySelector(`button[aria-label="${label}"]`);
  }

  function pageNumbers(): string[] {
    return Array.from<HTMLButtonElement>(
      fixture.nativeElement.querySelectorAll('button:not([aria-label])'),
    ).map((pageButton) => pageButton.textContent?.trim() ?? '');
  }

  function currentPage(): string | undefined {
    return fixture.nativeElement.querySelector('[aria-current="page"]')?.textContent?.trim();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(Pagination);
    emitted = [];
    fixture.componentInstance.pageChange.subscribe((page) => emitted.push(page));
  });

  it('shows 1-based page numbers and marks the current page', async () => {
    await render(0, 3);

    expect(pageNumbers()).toEqual(['1', '2', '3']);
    expect(currentPage()).toBe('1');
  });

  it('shows at most 5 pages centered on the current page', async () => {
    await render(6, 14);

    expect(pageNumbers()).toEqual(['5', '6', '7', '8', '9']);
    expect(currentPage()).toBe('7');
  });

  it('keeps the window inside the first and last pages', async () => {
    await render(0, 14);
    expect(pageNumbers()).toEqual(['1', '2', '3', '4', '5']);

    await render(13, 14);
    expect(pageNumbers()).toEqual(['10', '11', '12', '13', '14']);
  });

  it('disables first/previous on the first page', async () => {
    await render(0, 14);

    expect(button('First page').disabled).toBe(true);
    expect(button('Previous page').disabled).toBe(true);
    expect(button('Next page').disabled).toBe(false);
    expect(button('Last page').disabled).toBe(false);
  });

  it('disables next/last on the last page', async () => {
    await render(13, 14);

    expect(button('First page').disabled).toBe(false);
    expect(button('Next page').disabled).toBe(true);
    expect(button('Last page').disabled).toBe(true);
  });

  it('emits the 0-based index of the selected page', async () => {
    await render(6, 14);

    button('First page').click();
    button('Previous page').click();
    button('Next page').click();
    button('Last page').click();
    fixture.nativeElement.querySelector('button:not([aria-label])').click();

    expect(emitted).toEqual([0, 5, 7, 13, 4]);
  });

  it('does not emit when the current page is clicked', async () => {
    await render(2, 5);

    (fixture.nativeElement.querySelector('[aria-current="page"]') as HTMLButtonElement).click();

    expect(emitted).toEqual([]);
  });
});
