import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "./button";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    theme === "dark" ? bodyClass.add(className) : bodyClass.remove(className);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: string) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className="w-full justify-start"
    >
      {theme === "dark" ? (
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
