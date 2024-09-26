import { Ghost, Link, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button";

export function ThemeToggle() {
  if (typeof window === "undefined") return null;

  const [isDarkMode, setIsDarkMode] = useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    isDarkMode ? bodyClass.add(className) : bodyClass.remove(className);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Button
      onClick={toggleDarkMode}
      variant="ghost"
      className="w-full justify-start"
    >
      {isDarkMode ? (
        <>
          <Sun className="mr-2 h-4 w-4" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="mr-2 h-4 w-4" />
          Dark Mode
        </>
      )}
    </Button>
  );
}
