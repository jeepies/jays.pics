import { ReactNode } from "react";

import { cn } from "~/lib/utils";

type Alignment = "left" | "center" | "right";

export default function AnimatedGradientText({
  children,
  className,
  align = "center",
}: {
  children: ReactNode;
  className?: string;
  align?: Alignment;
}) {
  return (
    <div
      className={cn(
        "group relative flex max-w-fit flex-row items-center rounded-2xl-ele bg-white/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-xs transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40",
        {
          "mx-auto": align === "center",
          "mr-auto": align === "left",
          "ml-auto": align === "right",
        },
        className,
      )}
    >
      <div
        className={`absolute inset-0 block h-full w-full animate-gradient bg-linear-to-r from-primary/50 via-secondary/50 to-primary/50 bg-size-[var(--bg-size)_100%] p-px mask-subtract! rounded-[inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]`}
      />

      {children}
    </div>
  );
}
