export interface ImageFilters {
  dateRange?: { from: Date; to: Date };
  types?: string[];
  tags?: string[];
  minSize?: number;
  maxSize?: number;
}

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "size-asc"
  | "size-desc"
  | "views-desc";
