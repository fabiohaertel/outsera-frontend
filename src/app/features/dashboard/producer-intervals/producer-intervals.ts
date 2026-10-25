import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MovieApi } from '../../../core/api/movie-api';
import { Panel } from '../../../shared/ui/panel/panel';
import { ResourceState } from '../../../shared/ui/resource-state/resource-state';

@Component({
  selector: 'app-producer-intervals',
  imports: [Panel, ResourceState],
  templateUrl: './producer-intervals.html',
})
export class ProducerIntervals {
  private readonly movieApi = inject(MovieApi);

  protected readonly intervals = rxResource({
    stream: () => this.movieApi.getProducerIntervals(),
  });

  protected readonly sections = computed(() => {
    if (!this.intervals.hasValue()) {
      return [];
    }
    const { max, min } = this.intervals.value();
    return [
      { title: 'Maximum', rows: max },
      { title: 'Minimum', rows: min },
    ];
  });
}
