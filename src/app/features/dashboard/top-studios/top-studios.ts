import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MovieApi } from '../../../core/api/movie-api';
import { topStudios } from '../../../core/utils/top-studios';
import { Panel } from '../../../shared/ui/panel/panel';
import { ResourceState } from '../../../shared/ui/resource-state/resource-state';

@Component({
  selector: 'app-top-studios',
  imports: [Panel, ResourceState],
  templateUrl: './top-studios.html',
})
export class TopStudios {
  private readonly movieApi = inject(MovieApi);

  protected readonly studios = rxResource({
    stream: () =>
      this.movieApi.getStudiosWithWinCount().pipe(map((studios) => topStudios(studios))),
  });
}
