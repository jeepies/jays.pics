import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Cog, Home, Image, LogOut, User } from "lucide-react";

interface SidebarProps {
  className?: string;
  user: {
    username: string;
    images: any[];
  };
}

export function Sidebar({ className, user }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64 relative", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/dashboard/images">
                <Image className="mr-2 h-4 w-4" />
                Images
                <span className="ml-auto bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs">
                  {user.images.length}
                </span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/dashboard/settings">
                <Cog className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="space-y-1">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/profile/me">
              <User className="mr-2 h-4 w-4" />
              {user.username}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/logout">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
