import { getByPath } from '../object';

export interface SortOption {
  key: string;
  order?: 'asc' | 'desc';
}

export function sortBy<T>(
  arr: T[],
  key: string | string[] | SortOption[],
  order: 'asc' | 'desc' = 'asc',
): T[] {
  const sortOptions: SortOption[] = (() => {
    if (typeof key === 'string') {
      return [{ key, order }];
    }
    if (Array.isArray(key)) {
      return key.map((k) => (typeof k === 'string' ? { key: k, order } : k));
    }
    return [];
  })();

  return [...arr].sort((a, b) => {
    for (const { key: fieldKey, order: fieldOrder = 'asc' } of sortOptions) {
      const aVal = getByPath(a, fieldKey);
      const bVal = getByPath(b, fieldKey);

      if (aVal === bVal) continue;

      let comparison = 0;

      if (aVal == null) {
        comparison = 1;
      } else if (bVal == null) {
        comparison = -1;
      } else if (aVal > bVal) {
        comparison = 1;
      } else if (aVal < bVal) {
        comparison = -1;
      }

      return fieldOrder === 'desc' ? -comparison : comparison;
    }

    return 0;
  });
}
