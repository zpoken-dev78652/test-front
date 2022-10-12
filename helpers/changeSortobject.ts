export type SortDirection = 'desc' | 'asc' | null;

export interface SortObject {
  sortField: string | null;
  sortType: SortDirection;
}

export const changeSortObject = (
  field: string | null,
  currentSortObject: SortObject,
  callback: (obj: SortObject) => void,
  direction?: SortDirection,
) => {
  const { sortField, sortType } = currentSortObject;

  // Clear sorting
  if (!field) return callback({ sortField: null, sortType: null });

  if (field && direction) return callback({ sortField: field, sortType: direction });

  // change sorting direction
  if (sortField === field)
    return callback({
      sortField,
      sortType: sortType === 'asc' ? 'desc' : 'asc',
    });

  return callback({
    sortField: field,
    sortType: 'asc',
  });
};
