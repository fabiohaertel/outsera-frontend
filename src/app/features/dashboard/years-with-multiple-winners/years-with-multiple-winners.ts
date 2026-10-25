import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieApi } from '../../../core/api/movie-api';
import { Panel } from '../../../shared/ui/panel/panel';
import { ResourceState } from '../../../shared/ui/resource-state/resource-state';

@Component({
  selector: 'app-years-with-multiple-winners',
  imports: [Panel, ResourceState],
  templateUrl: './years-with-multiple-winners.html',
})
export class YearsWithMultipleWinners {
  private readonly movieApi = inject(MovieApi);

  protected readonly years = rxResource({
    stream: () => this.movieApi.getYearsWithMultipleWinners(),
  });
}
