import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { movie, moviePage } from '../../../testing/movie-fixtures';
import { API_BASE_URL } from './api-base-url';
import { MovieApi } from './movie-api';

const BASE_URL = 'http://api.test/movies';

describe('MovieApi', () => {
  let api: MovieApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    api = TestBed.inject(MovieApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getMovies', () => {
    it('sends only page and size when no filter is set', async () => {
      const page = moviePage([movie()]);
      const result = firstValueFrom(api.getMovies({ page: 2, size: 15 }));

      const request = httpMock.expectOne((req) => req.url === BASE_URL);
      expect(request.request.method).toBe('GET');
      expect(request.request.params.keys()).toEqual(['page', 'size']);
      expect(request.request.params.get('page')).toBe('2');
      expect(request.request.params.get('size')).toBe('15');
      request.flush(page);

      expect(await result).toEqual(page);
    });

    it('sends the year and winner filters when set', () => {
      api.getMovies({ page: 0, size: 15, year: 1990, winner: false }).subscribe();

      const request = httpMock.expectOne((req) => req.url === BASE_URL);
      expect(request.request.params.get('year')).toBe('1990');
      expect(request.request.params.get('winner')).toBe('false');
      request.flush(moviePage([]));
    });
  });

  it('getYearsWithMultipleWinners unwraps the years list', async () => {
    const years = [
      { year: 1986, winnerCount: 2 },
      { year: 1990, winnerCount: 2 },
    ];
    const result = firstValueFrom(api.getYearsWithMultipleWinners());

    httpMock.expectOne(`${BASE_URL}/yearsWithMultipleWinners`).flush({ years });

    expect(await result).toEqual(years);
  });

  it('getStudiosWithWinCount unwraps the studios list', async () => {
    const studios = [{ name: 'Columbia Pictures', winCount: 7 }];
    const result = firstValueFrom(api.getStudiosWithWinCount());

    httpMock.expectOne(`${BASE_URL}/studiosWithWinCount`).flush({ studios });

    expect(await result).toEqual(studios);
  });

  it('getProducerIntervals returns min and max intervals', async () => {
    const intervals = {
      min: [{ producer: 'Joel Silver', interval: 1, previousWin: 1990, followingWin: 1991 }],
      max: [{ producer: 'Matthew Vaughn', interval: 13, previousWin: 2002, followingWin: 2015 }],
    };
    const result = firstValueFrom(api.getProducerIntervals());

    httpMock.expectOne(`${BASE_URL}/maxMinWinIntervalForProducers`).flush(intervals);

    expect(await result).toEqual(intervals);
  });

  it('getWinnersByYear sends the year and returns the list of winners', async () => {
    const winners = [movie({ id: 56, year: 1990 }), movie({ id: 57, year: 1990 })];
    const result = firstValueFrom(api.getWinnersByYear(1990));

    httpMock.expectOne(`${BASE_URL}/winnersByYear?year=1990`).flush(winners);

    expect(await result).toEqual(winners);
  });
});
