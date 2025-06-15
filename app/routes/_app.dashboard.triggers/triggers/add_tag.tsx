import { Input } from "~/components/ui/input";

export default function AddTagAction({
  data,
  update,
}: {
  data: any;
  update: (d: any) => void;
}) {
  return (
    <Input
      placeholder="Tag Name"
      value={data.tag || ""}
      onChange={(e) => update({ tag: e.target.value })}
    />
  );
}
