import { StudioWinCount } from '../models/movie';
import { topStudios } from './top-studios';

describe('topStudios', () => {
  const studios: StudioWinCount[] = [
    { name: 'MGM', winCount: 3 },
    { name: 'Warner Bros.', winCount: 5 },
    { name: 'Columbia Pictures', winCount: 7 },
    { name: '20th Century Fox', winCount: 4 },
    { name: 'Paramount Pictures', winCount: 6 },
  ];

  it('returns the three studios with the most wins, in descending order', () => {
    expect(topStudios(studios).map((studio) => studio.name)).toEqual([
      'Columbia Pictures',
      'Paramount Pictures',
      'Warner Bros.',
    ]);
  });

  it('accepts a custom limit', () => {
    expect(topStudios(studios, 1)).toEqual([{ name: 'Columbia Pictures', winCount: 7 }]);
  });

  it('returns every studio when there are fewer than the limit', () => {
    expect(topStudios(studios.slice(0, 2))).toHaveLength(2);
    expect(topStudios([])).toEqual([]);
  });

  it('breaks ties by name', () => {
    const tied = [
      { name: 'Universal Studios', winCount: 2 },
      { name: 'Hollywood Pictures', winCount: 2 },
    ];

    expect(topStudios(tied).map((studio) => studio.name)).toEqual([
      'Hollywood Pictures',
      'Universal Studios',
    ]);
  });

  it('does not change the input list', () => {
    const input = [...studios];

    topStudios(input);

    expect(input).toEqual(studios);
  });
});
