import { ColumnDef } from "@tanstack/react-table";

export type URL = {
  url: string;
  donator: {
    username: string;
  };
  created_at: string;
  last_checked_at: string;
  public: boolean;
};

export const columns: ColumnDef<URL>[] = [
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
    accessorKey: "donator.username",
    header: "Donator",
  },
  {
    accessorKey: "last_checked_at",
    header: "Last Checked",
    // @ts-ignore
    cell: (cell) =>
      `${new Date(
        Date.parse(cell.getValue() as string)
      ).toLocaleTimeString()} - ${new Date(
        Date.parse(cell.getValue() as string)
      ).toLocaleDateString()}`,
  },
  {
    accessorKey: "created_at",
    header: "Donated At",
    // @ts-ignore
    cell: (cell) => new Date(Date.parse(cell.getValue())).toLocaleDateString(),
  },
];
