import { cn } from '~/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export interface ChartPoint {
  date: string;
  count: number;
}

export function SimpleBarChart({
  data,
  className,
}: Readonly<{
  data: ChartPoint[];
  className?: string;
}>) {
  return (
    <div className={cn('w-full h-40', className)}>
      <ResponsiveContainer width="100%" height="100%" className="text-primary">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickFormatter={(v) => new Date(v).getUTCDate().toString()} />
          <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString()} />
          <Bar dataKey="count" fill="currentColor" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}