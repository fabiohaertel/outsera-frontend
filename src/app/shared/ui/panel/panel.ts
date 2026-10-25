import { Component, input } from '@angular/core';

/** Card with a title used by every dashboard panel. */
@Component({
  selector: 'app-panel',
  host: { class: 'd-block h-100' },
  template: `
    <section class="card shadow-sm h-100">
      <div class="card-body">
        <h2 class="card-title h6 fw-bold mb-3">{{ title() }}</h2>
        <ng-content />
      </div>
    </section>
  `,
})
export class Panel {
  readonly title = input.required<string>();
}
