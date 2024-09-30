import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "~/components/ui/checkbox";

export type URL = {
  url: string;
  donator: {
    username: string;
  };
};

export const columns: ColumnDef<URL>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "url",
    header: "Domain",
  },
  {
    accessorKey: "donator.username",
    header: "Donator",
  },
];
