import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovieApi } from '../../../core/api/movie-api';
import { Panel } from '../../../shared/ui/panel/panel';
import { ResourceState } from '../../../shared/ui/resource-state/resource-state';

@Component({
  selector: 'app-winners-by-year',
  imports: [Panel, ReactiveFormsModule, ResourceState],
  templateUrl: './winners-by-year.html',
})
export class WinnersByYear {
  private readonly movieApi = inject(MovieApi);

  protected readonly yearControl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.pattern(/^\d{4}$/),
  ]);

  /** Year of the last valid search; `undefined` keeps the resource idle. */
  protected readonly searchedYear = signal<number | undefined>(undefined);

  protected readonly winners = rxResource({
    params: () => this.searchedYear(),
    stream: ({ params: year }) => this.movieApi.getWinnersByYear(year),
  });

  protected search(event: SubmitEvent): void {
    event.preventDefault();
    const year = this.yearControl.value;
    if (this.yearControl.invalid || year === null) {
      this.yearControl.markAsTouched();
      return;
    }
    this.searchedYear.set(year);
  }
}
