import { Link } from '@remix-run/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface PaginationProps {
  path: string;
  currentPage: number;
  totalCount: number;
}

export function Pagination(props: Readonly<PaginationProps>) {
  const totalPages = Math.ceil(props.totalCount / PAGE_SIZE);

  return (
    <>
      <Button variant="outline">
        <Link to={`${props.path}?page=${props.currentPage - 1}`}>
          <ChevronLeft />
        </Link>
      </Button>

      {new Array(10).fill(0).map((_, idx) => (
        <Button variant="outline" disabled={idx > totalPages-1} key={idx}>
          <Link to={`${props.path}?page=${idx+1}`}>{idx+1}</Link>
        </Button>
      ))}

      <Button variant="outline">
        <Link to={`${props.path}?page=${props.currentPage + 1}`}>
          <ChevronRight />
        </Link>
      </Button>
    </>
  );
}

// how many rows to take per page
export const PAGE_SIZE = 25;
