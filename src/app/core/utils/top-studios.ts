import { StudioWinCount } from '../models/movie';

/**
 * Returns the `limit` studios with the most wins. The API does not guarantee any order,
 * so studios are sorted by win count (desc) and then by name for a stable result.
 */
export function topStudios(studios: readonly StudioWinCount[], limit = 3): StudioWinCount[] {
  return [...studios]
    .sort((a, b) => b.winCount - a.winCount || a.name.localeCompare(b.name))
    .slice(0, limit);
}
