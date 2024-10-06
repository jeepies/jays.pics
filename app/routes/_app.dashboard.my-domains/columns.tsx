import { Progress } from "@prisma/client";
import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

export type URL = {
  url: string;
  created_at: string;
  last_checked_at: string;
  public: boolean;
  status: Progress;
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
    accessorKey: "public",
    header: "Public",
    cell: (cell) => (cell.getValue() ? "Yes" : "No"),
  },
  {
    accessorKey: "progress",
    header: "Status",
    cell: (cell) => {
      switch (cell.getValue()) {
        case Progress.DONE:
          return "Linked!";
        case Progress.INPUT:
          const url = cell.row
            .getAllCells()
            .filter((cell) => cell.id === "0_url")[0];
          if (!url) return <Label>An unknown error occured</Label>;
          return (
            <Link to={`/dashboard/domain/add?domain=${url.getValue() ?? ""}`}>
              Input Required
            </Link>
          );
        case Progress.WAITING:
          return "Waiting...";
      }
    },
  },
  {
    accessorKey: "last_checked_at",
    header: "Last Checked",
    cell: (cell) =>
      `${new Date(
        // @ts-ignore
        Date.parse(cell.getValue())
      ).toLocaleTimeString()} - ${new Date(
        // @ts-ignore
        Date.parse(cell.getValue())
      ).toLocaleDateString()}`,
  },
  {
    accessorKey: "created_at",
    header: "Donated At",
    // @ts-ignore
    cell: (cell) =>
      `${new Date(
        // @ts-ignore
        Date.parse(cell.getValue())
      ).toLocaleTimeString()} - ${new Date(
        // @ts-ignore
        Date.parse(cell.getValue())
      ).toLocaleDateString()}`,
  },
];
