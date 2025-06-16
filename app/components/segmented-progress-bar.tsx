import React from "react";

export interface Segment {
  label: string;
  value: number;
  color: string;
}

export function SegmentedProgressBar({
  segments,
  max,
  className = "",
}: {
  segments: Segment[];
  max: number;
  className?: string;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  return (
    <div
      className={`relative h-4 w-full overflow-hidden rounded-full bg-primary/20 flex ${className}`}
    >
      {segments.map((seg) => (
        <div
          key={seg.label}
          className={seg.color}
          style={{ width: `${(seg.value / max) * 100}%` }}
        />
      ))}
      {total < max && (
        <div
          style={{ width: `${((max - total) / max) * 100}%` }}
          className="bg-transparent"
        />
      )}
    </div>
  );
}
