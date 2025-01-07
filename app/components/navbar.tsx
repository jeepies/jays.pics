"use client";

import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 mx-auto flex h-14 items-center">
        <div className="flex-1">
          <Link to="/" className="flex items-center">
            <span className="font-bold">UploadBytes</span>
          </Link>
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
