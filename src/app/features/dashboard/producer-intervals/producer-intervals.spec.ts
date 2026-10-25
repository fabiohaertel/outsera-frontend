import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { tableHeaders, tableRows } from '../../../../testing/dom';
import { MovieApi } from '../../../core/api/movie-api';
import { ProducerIntervals as ProducerIntervalsResponse } from '../../../core/models/movie';
import { ProducerIntervals } from './producer-intervals';

describe('ProducerIntervals', () => {
  async function render(response: Observable<ProducerIntervalsResponse>): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      providers: [{ provide: MovieApi, useValue: { getProducerIntervals: () => response } }],
    });
    const fixture = TestBed.createComponent(ProducerIntervals);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  function sections(root: HTMLElement): { title: string; rows: string[][] }[] {
    return Array.from(root.querySelectorAll('h3')).map((heading) => ({
      title: heading.textContent?.trim() ?? '',
      rows: tableRows(heading.nextElementSibling as HTMLElement),
    }));
  }

  it('shows the maximum and minimum intervals in separate tables', async () => {
    const root = await render(
      of({
        min: [{ producer: 'Joel Silver', interval: 1, previousWin: 1990, followingWin: 1991 }],
        max: [{ producer: 'Matthew Vaughn', interval: 13, previousWin: 2002, followingWin: 2015 }],
      }),
    );

    expect(root.querySelector('h2')?.textContent).toBe(
      'Producers with longest and shortest interval between wins',
    );
    expect(tableHeaders(root).slice(0, 4)).toEqual([
      'Producer',
      'Interval',
      'Previous Year',
      'Following Year',
    ]);
    expect(sections(root)).toEqual([
      { title: 'Maximum', rows: [['Matthew Vaughn', '13', '2002', '2015']] },
      { title: 'Minimum', rows: [['Joel Silver', '1', '1990', '1991']] },
    ]);
  });

  it('shows every tied interval, even for the same producer', async () => {
    const root = await render(
      of({
        min: [
          { producer: 'Producer A', interval: 1, previousWin: 2008, followingWin: 2009 },
          { producer: 'Producer A', interval: 1, previousWin: 2018, followingWin: 2019 },
        ],
        max: [],
      }),
    );

    expect(sections(root)).toEqual([
      { title: 'Maximum', rows: [['No producers found']] },
      {
        title: 'Minimum',
        rows: [
          ['Producer A', '1', '2008', '2009'],
          ['Producer A', '1', '2018', '2019'],
        ],
      },
    ]);
  });

  it('shows an error instead of the tables when the request fails', async () => {
    const root = await render(throwError(() => new Error('Network error')));

    expect(root.querySelector('[role="alert"]')).not.toBeNull();
    expect(root.querySelector('table')).toBeNull();
  });
});
