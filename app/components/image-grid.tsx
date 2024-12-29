import { Image } from "@prisma/client";
import { ImageCard } from "./image-card";

interface ImageGridProps {
  images: Image[];
}

export function Grid({ images }: ImageGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}
