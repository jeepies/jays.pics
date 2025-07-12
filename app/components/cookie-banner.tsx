import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-md border bg-background/90 backdrop-blur-sm p-4 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-sm">
      <span className="text-foreground">
        We use cookies to improve your experience. Read our{" "}
        <Link className="underline" to="/privacy">
          privacy policy
        </Link>{" "}
        for more info.
      </span>
      <Button size="sm" onClick={accept} className="shrink-0 w-fit">
        Accept
      </Button>
    </div>
  );
}
