import { Link } from "@remix-run/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./ui/button";

interface PaginationProps {
  path: string;
  currentPage: number;
  totalCount: number;
  query?: string;
}

export function Pagination(props: Readonly<PaginationProps>) {
  const totalPages = Math.ceil(props.totalCount / PAGE_SIZE);

  const q = props.query ? `&${props.query}` : "";

  const maxPagesToShow = 5;
  let startPage = Math.max(
    1,
    props.currentPage - Math.floor(maxPagesToShow / 2),
  );
  let endPage = startPage + maxPagesToShow - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      <Link
        to={`${props.path}?page=${props.currentPage !== 1 ? props.currentPage - 1 : 1}${q}`}
      >
        <Button variant="outline" size="sm">
          <ChevronLeft />
        </Button>
      </Link>

      {pages.map((num) => (
        <Link key={num} to={`${props.path}?page=${num}${q}`}>
          <Button
            variant={num === props.currentPage ? "default" : "outline"}
            size="sm"
          >
            {num}
          </Button>
        </Link>
      ))}

      <Link
        to={`${props.path}?page=${props.currentPage !== totalPages ? props.currentPage + 1 : totalPages}${q}`}
      >
        <Button variant="outline" size="sm">
          <ChevronRight />
        </Button>
      </Link>
    </div>
  );
}

// how many rows to take per page
export const PAGE_SIZE = 20;
