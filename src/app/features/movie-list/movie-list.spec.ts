import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import type { Mock } from 'vitest';
import { selectOption, tableHeaders, tableRows, typeInto } from '../../../testing/dom';
import { movie, moviePage } from '../../../testing/movie-fixtures';
import { MovieApi } from '../../core/api/movie-api';
import { MovieFilters } from '../../core/models/movie';
import { MovieList, PAGE_SIZE, YEAR_FILTER_DEBOUNCE_MS } from './movie-list';

describe('MovieList', () => {
  let fixture: ComponentFixture<MovieList>;
  let root: HTMLElement;
  let getMovies: Mock<MovieApi['getMovies']>;

  const movies = [
    movie({ id: 1, year: 1980, title: "Can't Stop the Music", winner: true }),
    movie({ id: 2, year: 1980, title: 'Cruising', winner: false }),
  ];

  async function render(): Promise<void> {
    TestBed.configureTestingModule({ providers: [{ provide: MovieApi, useValue: { getMovies } }] });
    fixture = TestBed.createComponent(MovieList);
    root = fixture.nativeElement;
    await fixture.whenStable();
  }

  function lastFilters(): MovieFilters {
    return getMovies.mock.lastCall![0];
  }

  function yearInput(): HTMLInputElement {
    return root.querySelector('input[aria-label="Filter by year"]')!;
  }

  function winnerSelect(): HTMLSelectElement {
    return root.querySelector('select[aria-label="Filter by winner"]')!;
  }

  async function goToPage(label: string): Promise<void> {
    const pageButton = Array.from(root.querySelectorAll<HTMLButtonElement>('.page-link')).find(
      (button) => button.textContent?.trim() === label,
    );
    pageButton!.click();
    await fixture.whenStable();
  }

  // Real timers: Vitest fake timers do not drive the debounce scheduled from the signal effect.
  function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Types into the year filter and lets the debounce time pass. */
  async function filterByYear(value: string): Promise<void> {
    typeInto(yearInput(), value);
    await wait(YEAR_FILTER_DEBOUNCE_MS + 50);
    await fixture.whenStable();
  }

  beforeEach(() => {
    getMovies = vi.fn(({ page }: MovieFilters) =>
      of(moviePage(movies, { totalPages: 14, totalElements: 206, number: page })),
    );
  });

  it('loads the first page without filters', async () => {
    await render();

    expect(getMovies).toHaveBeenCalledTimes(1);
    expect(lastFilters()).toEqual({ page: 0, size: PAGE_SIZE, year: undefined, winner: undefined });
  });

  it('renders the movies with the winner column as Yes/No', async () => {
    await render();

    expect(root.querySelector('h1')?.textContent).toBe('List movies');
    expect(tableHeaders(root)).toEqual(['ID', 'Year', 'Title', 'Winner?']);
    expect(tableRows(root)).toEqual([
      ['1', '1980', "Can't Stop the Music", 'Yes'],
      ['2', '1980', 'Cruising', 'No'],
    ]);
  });

  it('loads the selected page', async () => {
    await render();

    await goToPage('2');

    expect(lastFilters()).toMatchObject({ page: 1 });
    expect(root.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('2');
  });

  it.each([
    ['true', true],
    ['false', false],
  ])('filters by winner "%s" and goes back to the first page', async (option, winner) => {
    await render();
    await goToPage('3');

    selectOption(winnerSelect(), option);
    await fixture.whenStable();

    expect(lastFilters()).toEqual({ page: 0, size: PAGE_SIZE, year: undefined, winner });
  });

  it('removes the winner filter when "Yes/No" is selected', async () => {
    await render();
    selectOption(winnerSelect(), 'true');
    await fixture.whenStable();
    await goToPage('3');

    selectOption(winnerSelect(), '');
    await fixture.whenStable();

    expect(lastFilters()).toEqual({ page: 0, size: PAGE_SIZE, year: undefined, winner: undefined });
  });

  it('filters by year after the debounce time and goes back to the first page', async () => {
    await render();
    await goToPage('3');

    await filterByYear('1990');

    expect(lastFilters()).toEqual({ page: 0, size: PAGE_SIZE, year: 1990, winner: undefined });
  });

  it('does not reload while the year is being typed', async () => {
    await render();
    getMovies.mockClear();

    typeInto(yearInput(), '1');
    await wait(YEAR_FILTER_DEBOUNCE_MS / 2);
    typeInto(yearInput(), '1990');
    await wait(YEAR_FILTER_DEBOUNCE_MS / 2);
    await fixture.whenStable();
    expect(getMovies).not.toHaveBeenCalled();

    await wait(YEAR_FILTER_DEBOUNCE_MS);
    await fixture.whenStable();
    expect(getMovies).toHaveBeenCalledTimes(1);
    expect(lastFilters()).toMatchObject({ year: 1990 });
  });

  it('ignores an incomplete year', async () => {
    await render();
    getMovies.mockClear();

    await filterByYear('19');

    expect(getMovies).not.toHaveBeenCalled();
  });

  it('removes the year filter when the field is cleared', async () => {
    await render();
    await filterByYear('1990');

    await filterByYear('');

    expect(lastFilters()).toMatchObject({ year: undefined });
  });

  it('shows a message and no pagination when no movie matches the filters', async () => {
    getMovies.mockReturnValue(of(moviePage([], { totalPages: 0 })));

    await render();

    expect(tableRows(root)).toEqual([['No movies found']]);
    expect(root.querySelector('app-pagination')).toBeNull();
  });

  it('keeps the filters visible and shows an error when the request fails', async () => {
    getMovies.mockReturnValue(throwError(() => new Error('Network error')));

    await render();

    expect(root.querySelector('[role="alert"]')).not.toBeNull();
    expect(yearInput()).not.toBeNull();
    expect(winnerSelect()).not.toBeNull();
  });
});
