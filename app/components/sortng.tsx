import React from "react";
import { ArrowDownAZ, ArrowUpAZ, Calendar, FileDown } from "lucide-react";

interface SortControlsProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export function SortControls({
  sortBy,
  sortOrder,
  onSortChange,
}: SortControlsProps) {
  const sortOptions = [
    { value: "created_at", label: "Upload Date", icon: Calendar },
    { value: "size", label: "File Size", icon: FileDown },
    {
      value: "display_name",
      label: "Filename",
      icon: sortOrder === "asc" ? ArrowDownAZ : ArrowUpAZ,
    },
  ];

  return (
    <div className="mb-6 flex items-center gap-4">
      {sortOptions.map((option) => {
        const Icon = option.icon;
        const isActive = sortBy === option.value;

        return (
          <button
            key={option.value}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() =>
              onSortChange(
                option.value,
                isActive ? (sortOrder === "asc" ? "desc" : "asc") : "asc"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
