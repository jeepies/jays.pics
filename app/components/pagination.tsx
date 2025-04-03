import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@remix-run/react';

interface PaginationProps {
  path: string;
  currentPage: number;
  totalCount: number;
}

export function Pagination(props: PaginationProps) {
  const [page, setPage] = useState(props.currentPage);

  const totalPages = Math.ceil(props.totalCount / PAGE_SIZE);

  return (
    <>
      <Link to={`${props.path}?page=${props.currentPage - 1}`}>
        <Button variant="outline">
          <ChevronLeft />
        </Button>
      </Link>

      <Link to={`${props.path}?page=${props.currentPage + 1}`}>
        <Button variant="outline">
          <ChevronRight />
        </Button>
      </Link>
    </>
  );
}

// how many rows should we take?
export const PAGE_SIZE = 25;
