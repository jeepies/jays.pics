import { Input } from '~/components/ui/input';

export default function RenameAction({ data, update }: { data: any; update: (d: any) => void }) {
  return (
    <Input
      placeholder="New Name"
      value={data.name || ''}
      onChange={(e) => update({ name: e.target.value })}
    />
  );
}