export interface Movie {
  id: number;
  year: number;
  title: string;
  studios: string[];
  producers: string[];
  winner: boolean;
}

/** Spring Data page returned by `GET /api/movies`. `number` is the 0-based page index. */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface MovieFilters {
  page: number;
  size: number;
  year?: number;
  winner?: boolean;
}

export interface YearWinnerCount {
  year: number;
  winnerCount: number;
}

export interface StudioWinCount {
  name: string;
  winCount: number;
}

export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducerIntervals {
  min: ProducerInterval[];
  max: ProducerInterval[];
}
