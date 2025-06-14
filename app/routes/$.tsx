import { Link } from "@remix-run/react";
import { FuzzyText } from "~/components/fuzzy";
import { Button } from "~/components/ui/button";

export default function Error() {
  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center flex-col">
      <FuzzyText
        baseIntensity={0.5}
        fontSize="7rem"
        className="font-extrabold text-accent drop-shadow-lg"
      >
        404
      </FuzzyText>
      <div className="flex flex-col items-center justify-center mt-4">
        <h2 className="text-2xl font-semibold text-foreground mb-1">
          Page Not Found
        </h2>
        <p className="text-center text-muted-foreground max-w-xs mb-4">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg" className="mt-2 w-full max-w-xs">
          <Link to="/">Return Home</Link>
        </Button>
        <span className="text-xs text-muted-foreground mt-2">
          If you think this is a mistake,{" "}
          <a
            href="mailto:support@jays.pics"
            className="underline hover:text-accent"
          >
            contact support
          </a>
          .
        </span>
      </div>
    </div>
  );
}
