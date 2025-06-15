import { Input } from "~/components/ui/input";
import { prisma } from "~/services/database.server";

export default async function rename({
  imageId,
  data,
}: {
  imageId: string;
  data: any;
}) {
  if (!data.name) return;
  await prisma.image.update({
    where: { id: imageId },
    data: { display_name: data.name },
  });
}

export function Component({
  data,
  update,
}: {
  data: any;
  update: (d: any) => void;
}) {
  return (
    <Input
      placeholder="New Name"
      value={data.name || ""}
      onChange={(e) => update({ name: e.target.value })}
    />
  );
}
