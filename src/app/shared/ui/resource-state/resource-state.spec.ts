import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceState } from './resource-state';

describe('ResourceState', () => {
  let fixture: ComponentFixture<ResourceState>;
  const isLoading = signal(false);
  const error = signal<Error | undefined>(undefined);
  const reload = vi.fn(() => true);

  beforeEach(async () => {
    isLoading.set(false);
    error.set(undefined);
    reload.mockClear();
    fixture = TestBed.createComponent(ResourceState);
    fixture.componentRef.setInput('resource', { isLoading, error, reload });
    await fixture.whenStable();
  });

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent?.trim() ?? '';
  }

  it('renders nothing when the resource is idle or resolved', () => {
    expect(text()).toBe('');
  });

  it('shows a loading indicator while loading', async () => {
    isLoading.set(true);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
  });

  it('shows an error message with a retry button that reloads the resource', async () => {
    error.set(new Error('Network error'));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Could not load data.',
    );

    fixture.nativeElement.querySelector('button').click();

    expect(reload).toHaveBeenCalledTimes(1);
  });
});
