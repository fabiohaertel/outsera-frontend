import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { tableHeaders, tableRows } from '../../../../testing/dom';
import { MovieApi } from '../../../core/api/movie-api';
import { YearWinnerCount } from '../../../core/models/movie';
import { YearsWithMultipleWinners } from './years-with-multiple-winners';

describe('YearsWithMultipleWinners', () => {
  async function render(response: Observable<YearWinnerCount[]>): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      providers: [{ provide: MovieApi, useValue: { getYearsWithMultipleWinners: () => response } }],
    });
    const fixture = TestBed.createComponent(YearsWithMultipleWinners);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('lists the years with more than one winner', async () => {
    const root = await render(
      of([
        { year: 1986, winnerCount: 2 },
        { year: 1990, winnerCount: 2 },
        { year: 2015, winnerCount: 2 },
      ]),
    );

    expect(root.querySelector('h2')?.textContent).toBe('List years with multiple winners');
    expect(tableHeaders(root)).toEqual(['Year', 'Win Count']);
    expect(tableRows(root)).toEqual([
      ['1986', '2'],
      ['1990', '2'],
      ['2015', '2'],
    ]);
  });

  it('shows a message when there are no such years', async () => {
    const root = await render(of([]));

    expect(tableRows(root)).toEqual([['No years found']]);
  });

  it('shows an error instead of the table when the request fails', async () => {
    const root = await render(throwError(() => new Error('Network error')));

    expect(root.querySelector('[role="alert"]')).not.toBeNull();
    expect(root.querySelector('table')).toBeNull();
  });
});
