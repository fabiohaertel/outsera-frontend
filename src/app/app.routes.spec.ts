import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { moviePage } from '../testing/movie-fixtures';
import { routes } from './app.routes';
import { MovieApi } from './core/api/movie-api';
import { Dashboard } from './features/dashboard/dashboard';
import { MovieList } from './features/movie-list/movie-list';

describe('routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        {
          provide: MovieApi,
          useValue: {
            getMovies: () => of(moviePage([])),
            getYearsWithMultipleWinners: () => of([]),
            getStudiosWithWinCount: () => of([]),
            getProducerIntervals: () => of({ min: [], max: [] }),
            getWinnersByYear: () => of([]),
          },
        },
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  it('opens the dashboard by default', async () => {
    await harness.navigateByUrl('/', Dashboard);

    expect(TestBed.inject(Router).url).toBe('/dashboard');
  });

  it('opens the movie list at /list', async () => {
    await harness.navigateByUrl('/list', MovieList);

    expect(TestBed.inject(Router).url).toBe('/list');
  });

  it('redirects unknown urls to the dashboard', async () => {
    await harness.navigateByUrl('/unknown', Dashboard);

    expect(TestBed.inject(Router).url).toBe('/dashboard');
  });
});
