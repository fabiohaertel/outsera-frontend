import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MovieApi } from '../../core/api/movie-api';
import { YesNoPipe } from '../../shared/pipes/yes-no';
import { Pagination } from '../../shared/ui/pagination/pagination';
import { ResourceState } from '../../shared/ui/resource-state/resource-state';

export const PAGE_SIZE = 15;
export const YEAR_FILTER_DEBOUNCE_MS = 300;

/** Only a complete 4-digit year filters the list; anything else means "all years". */
function parseYear(value: string): number | undefined {
  const trimmed = value.trim();
  return /^\d{4}$/.test(trimmed) ? Number(trimmed) : undefined;
}

@Component({
  selector: 'app-movie-list',
  imports: [Pagination, ResourceState, YesNoPipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList {
  private readonly movieApi = inject(MovieApi);

  private readonly yearInput = signal('');
  private readonly year = toSignal(
    toObservable(this.yearInput).pipe(
      debounceTime(YEAR_FILTER_DEBOUNCE_MS),
      map(parseYear),
      distinctUntilChanged(),
    ),
    { initialValue: undefined },
  );
  private readonly winner = signal<boolean | undefined>(undefined);

  private readonly filters = computed(() => ({ year: this.year(), winner: this.winner() }));

  /** Goes back to the first page whenever a filter changes. */
  protected readonly page = linkedSignal({ source: this.filters, computation: () => 0 });

  protected readonly movies = rxResource({
    params: () => ({ ...this.filters(), page: this.page(), size: PAGE_SIZE }),
    stream: ({ params }) => this.movieApi.getMovies(params),
  });

  protected onYearInput(value: string): void {
    this.yearInput.set(value);
  }

  protected onWinnerChange(value: string): void {
    this.winner.set(value === '' ? undefined : value === 'true');
  }
}
