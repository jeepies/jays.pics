import { Image } from "@prisma/client";
import { ImageFilters, SortOption } from "~/types/image";

export function filterImages(
  images: Image[],
  searchQuery: string,
  filters: ImageFilters
) {
  return images.filter((image) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return image.display_name.toLowerCase().includes(query);
    }
    if (filters.dateRange) {
      const imageDate = new Date(image.created_at);
      if (
        imageDate < filters.dateRange.from ||
        imageDate > filters.dateRange.to
      ) {
        return false;
      }
    }
    return true;
  });
}

export function sortImages(images: Image[], sort: SortOption) {
  return [...images].sort((a, b) => {
    switch (sort) {
      case "date-desc":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "date-asc":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "name-asc":
        return a.display_name.localeCompare(b.display_name);
      case "name-desc":
        return b.display_name.localeCompare(a.display_name);
      case "size-asc":
        return a.size - b.size;
      case "size-desc":
        return b.size - a.size;
      default:
        return 0;
    }
  });
}
