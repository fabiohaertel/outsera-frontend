import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import type { Mock } from 'vitest';
import { tableHeaders, tableRows, typeInto } from '../../../../testing/dom';
import { movie } from '../../../../testing/movie-fixtures';
import { MovieApi } from '../../../core/api/movie-api';
import { Movie } from '../../../core/models/movie';
import { WinnersByYear } from './winners-by-year';

describe('WinnersByYear', () => {
  let fixture: ComponentFixture<WinnersByYear>;
  let root: HTMLElement;
  let getWinnersByYear: Mock<MovieApi['getWinnersByYear']>;

  beforeEach(async () => {
    getWinnersByYear = vi.fn(() => of<Movie[]>([]));
    TestBed.configureTestingModule({
      providers: [{ provide: MovieApi, useValue: { getWinnersByYear } }],
    });
    fixture = TestBed.createComponent(WinnersByYear);
    root = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function search(value: string): Promise<void> {
    typeInto(root.querySelector('input')!, value);
    root.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    await fixture.whenStable();
  }

  it('does not load anything before a search', () => {
    expect(root.querySelector('h2')?.textContent).toBe('List movie winners by year');
    expect(getWinnersByYear).not.toHaveBeenCalled();
    expect(root.querySelector('table')).toBeNull();
  });

  it('lists the winners of the searched year', async () => {
    getWinnersByYear.mockReturnValue(
      of([
        movie({ id: 56, year: 1990, title: 'The Adventures of Ford Fairlane' }),
        movie({ id: 57, year: 1990, title: "Ghosts Can't Do It" }),
      ]),
    );

    await search('1990');

    expect(getWinnersByYear).toHaveBeenCalledWith(1990);
    expect(tableHeaders(root)).toEqual(['Id', 'Year', 'Title']);
    expect(tableRows(root)).toEqual([
      ['56', '1990', 'The Adventures of Ford Fairlane'],
      ['57', '1990', "Ghosts Can't Do It"],
    ]);
  });

  it('shows a message when the year has no winners', async () => {
    await search('1979');

    expect(tableRows(root)).toEqual([['No winners found']]);
  });

  it.each(['', '199', '19900'])('does not search with the invalid year "%s"', async (value) => {
    await search(value);

    expect(getWinnersByYear).not.toHaveBeenCalled();
    expect(root.querySelector('input')?.classList).toContain('is-invalid');
  });
});
