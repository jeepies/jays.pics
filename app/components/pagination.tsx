import { Link } from '@remix-run/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface PaginationProps {
  path: string;
  currentPage: number;
  totalCount: number;
  query?: string;
}

export function Pagination(props: Readonly<PaginationProps>) {
  const totalPages = Math.ceil(props.totalCount / PAGE_SIZE);

  const q = props.query ? `&${props.query}` : '';

  return (
    <>
      <Link to={`${props.path}?page=${props.currentPage !== 1 ? props.currentPage - 1 : 1}${q}`}>
        <Button variant="outline">
          <ChevronLeft />
        </Button>
      </Link>

      {new Array(10).fill(0).map((_, idx) => (
        <Link to={`${props.path}?page=${idx + 1}${q}`}>
          <Button variant="outline" disabled={idx > totalPages - 1} key={idx}>
            {idx + 1}
          </Button>
        </Link>
      ))}

      <Link to={`${props.path}?page=${props.currentPage !== totalPages ? props.currentPage + 1 : totalPages}${q}`}>
        <Button variant="outline">
          <ChevronRight />
        </Button>
      </Link>
    </>
  );
}

// how many rows to take per page
export const PAGE_SIZE = 25;