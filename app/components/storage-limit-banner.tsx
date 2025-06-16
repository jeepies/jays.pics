import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import prettyBytes from "pretty-bytes";
import { Button } from "./ui/button";

interface UploadLimitBannerProps {
  spaceUsed: number;
  maxSpace: number;
}

export function StorageLimitBanner({
  spaceUsed,
  maxSpace,
}: Readonly<UploadLimitBannerProps>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("uploadLimitBannerDismissed");
    if (dismissed === "true") return;
    if (maxSpace > 0 && spaceUsed / maxSpace >= 0.9) {
      setVisible(true);
    }
  }, [spaceUsed, maxSpace]);

  function dismiss() {
    localStorage.setItem("uploadLimitBannerDismissed", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-md border bg-background/90 backdrop-blur p-4 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-sm">
      <span className="text-foreground">
        You're using {prettyBytes(spaceUsed)} of {prettyBytes(maxSpace)}{" "}
        storage. Please consider{" "}
        <Link className="underline" to="/dashboard/settings">
          upgrading
        </Link>{" "}
        or{" "}
        <Link className="underline" to="/dashboard/images">
          removing some images
        </Link>
        .
      </span>
      <Button size="sm" onClick={dismiss} className="shrink-0 w-fit">
        Dismiss
      </Button>
    </div>
  );
}
