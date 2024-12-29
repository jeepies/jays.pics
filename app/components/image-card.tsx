import { Form } from "@remix-run/react";
import { Download, Link2, Trash } from "lucide-react";
import { formatDate, formatFileSize } from "~/lib/utils";
import type { Image } from "@prisma/client";

interface ImageCardProps {
  image: Image;
}

export function ImageCard({ image }: ImageCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={`/i/${image.id}/raw`}
          alt={image.display_name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute right-2 top-2 flex gap-2">
          <Form method="post" action={`/i/${image.id}/copy`}>
            <button
              type="submit"
              className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              title="Copy Link"
            >
              <Link2 className="h-5 w-5" />
            </button>
          </Form>

          <a
            href={`/i/${image.id}/raw`}
            download
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            title="Download"
          >
            <Download className="h-5 w-5" />
          </a>

          <Form method="post" action={`/i/${image.id}/delete`}>
            <button
              type="submit"
              className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              title="Delete"
            >
              <Trash className="h-5 w-5" />
            </button>
          </Form>
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-2 truncate text-lg font-medium text-gray-900">
          {image.display_name}
        </h3>
        <div className="space-y-1 text-sm text-gray-500">
          <p>{formatDate(new Date(image.created_at))}</p>
          <p>{formatFileSize(image.size)}</p>
          <p>{image.type}</p>
        </div>
      </div>
    </div>
  );
}
