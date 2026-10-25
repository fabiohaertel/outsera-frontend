import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  Movie,
  MovieFilters,
  Page,
  ProducerIntervals,
  StudioWinCount,
  YearWinnerCount,
} from '../models/movie';
import { API_BASE_URL } from './api-base-url';

@Injectable({ providedIn: 'root' })
export class MovieApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getMovies({ page, size, year, winner }: MovieFilters): Observable<Page<Movie>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (year !== undefined) {
      params = params.set('year', year);
    }
    if (winner !== undefined) {
      params = params.set('winner', winner);
    }
    return this.http.get<Page<Movie>>(this.baseUrl, { params });
  }

  getYearsWithMultipleWinners(): Observable<YearWinnerCount[]> {
    return this.http
      .get<{ years: YearWinnerCount[] }>(`${this.baseUrl}/yearsWithMultipleWinners`)
      .pipe(map((response) => response.years));
  }

  getStudiosWithWinCount(): Observable<StudioWinCount[]> {
    return this.http
      .get<{ studios: StudioWinCount[] }>(`${this.baseUrl}/studiosWithWinCount`)
      .pipe(map((response) => response.studios));
  }

  getProducerIntervals(): Observable<ProducerIntervals> {
    return this.http.get<ProducerIntervals>(`${this.baseUrl}/maxMinWinIntervalForProducers`);
  }

  getWinnersByYear(year: number): Observable<Movie[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<Movie[]>(`${this.baseUrl}/winnersByYear`, { params });
  }
}
