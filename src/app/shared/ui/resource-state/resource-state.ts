import { Component, WritableResource, input } from '@angular/core';

type LoadableResource = Pick<WritableResource<unknown>, 'isLoading' | 'error' | 'reload'>;

/** Shows the loading spinner or the error message (with retry) of a resource. */
@Component({
  selector: 'app-resource-state',
  template: `
    @if (resource().error()) {
      <div
        class="alert alert-danger d-flex align-items-center justify-content-between gap-2 py-2 mb-0"
        role="alert"
      >
        <span>Could not load data.</span>
        <button type="button" class="btn btn-sm btn-outline-danger" (click)="resource().reload()">
          Retry
        </button>
      </div>
    } @else if (resource().isLoading()) {
      <div class="text-center py-3" role="status">
        <span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
        <span class="visually-hidden">Loading...</span>
      </div>
    }
  `,
})
export class ResourceState {
  readonly resource = input.required<LoadableResource>();
}
