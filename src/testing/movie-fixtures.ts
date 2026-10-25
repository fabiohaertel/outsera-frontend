import { Movie, Page } from '../app/core/models/movie';

export function movie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    year: 1980,
    title: "Can't Stop the Music",
    studios: ['Associated Film Distribution'],
    producers: ['Allan Carr'],
    winner: true,
    ...overrides,
  };
}

export function moviePage(content: Movie[], overrides: Partial<Page<Movie>> = {}): Page<Movie> {
  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    number: 0,
    size: 15,
    numberOfElements: content.length,
    first: true,
    last: true,
    empty: content.length === 0,
    ...overrides,
  };
}
