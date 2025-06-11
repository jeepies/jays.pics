import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';

export type URL = {
  url: string;
  donator: {
    username: string;
  };
};

export function getColumns(subdomains: Record<string, string>): ColumnDef<URL>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'url',
      header: 'Domain',
    },
    {
      id: 'subdomain',
      header: 'Subdomain',
      cell: ({ row }) => (
        <Input
          name={`subdomain_${row.original.url}`}
          defaultValue={subdomains[row.original.url] ?? ''}
          className="w-32"
          placeholder="optional"
        />
      ),
    },
    {
      accessorKey: 'donator.username',
      header: 'Donator',
    },
  ];
}
