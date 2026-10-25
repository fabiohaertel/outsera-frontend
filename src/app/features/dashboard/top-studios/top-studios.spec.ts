import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { tableHeaders, tableRows } from '../../../../testing/dom';
import { MovieApi } from '../../../core/api/movie-api';
import { StudioWinCount } from '../../../core/models/movie';
import { TopStudios } from './top-studios';

describe('TopStudios', () => {
  async function render(response: Observable<StudioWinCount[]>): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      providers: [{ provide: MovieApi, useValue: { getStudiosWithWinCount: () => response } }],
    });
    const fixture = TestBed.createComponent(TopStudios);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('lists only the three studios with the most wins', async () => {
    const root = await render(
      of([
        { name: 'MGM', winCount: 3 },
        { name: 'Paramount Pictures', winCount: 6 },
        { name: 'Columbia Pictures', winCount: 7 },
        { name: 'Warner Bros.', winCount: 5 },
      ]),
    );

    expect(root.querySelector('h2')?.textContent).toBe('Top 3 studios with winners');
    expect(tableHeaders(root)).toEqual(['Name', 'Win Count']);
    expect(tableRows(root)).toEqual([
      ['Columbia Pictures', '7'],
      ['Paramount Pictures', '6'],
      ['Warner Bros.', '5'],
    ]);
  });

  it('shows a message when there are no studios', async () => {
    const root = await render(of([]));

    expect(tableRows(root)).toEqual([['No studios found']]);
  });

  it('shows an error instead of the table when the request fails', async () => {
    const root = await render(throwError(() => new Error('Network error')));

    expect(root.querySelector('[role="alert"]')).not.toBeNull();
    expect(root.querySelector('table')).toBeNull();
  });
});
