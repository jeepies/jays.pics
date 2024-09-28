import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  Cog,
  Home,
  Image,
  LogOut,
  User,
  Shield,
  FileQuestionIcon,
  MailQuestion,
  FileQuestion,
  Link2,
} from "lucide-react";
import { ThemeToggle } from "./themetoggle";
import { Separator } from "./separator";

interface SidebarProps {
  className?: string;
  user: {
    username: string;
    images: any[];
    is_admin: boolean;
  };
}

export function Sidebar({ className, user }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64 relative", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            jays.host
          </h2>
          <Separator className="my-4" />
          <div className="space-y-1">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-gray-900 dark:text-gray-100"
            >
              <Link to="/dashboard/index">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-gray-900 dark:text-gray-100"
            >
              <Link to="/dashboard/images">
                <Image className="mr-2 h-4 w-4" />
                Images
                <span className="ml-auto bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs">
                  {user.images.length}
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-gray-900 dark:text-gray-100"
            >
              <Link to="/dashboard/referrals">
                <Link2 className="mr-2 h-4 w-4" />
                Referrals
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-gray-900 dark:text-gray-100"
            >
              <Link to="/dashboard/help">
                <FileQuestion className="mr-2 h-4 w-4" />
                Help
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-gray-900 dark:text-gray-100"
            >
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
          {user.is_admin ? (
            <>
              {" "}
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-gray-900 dark:text-gray-100"
              >
                <Link to="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <></>
          )}
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-gray-900 dark:text-gray-100"
          >
            <Link to="/profile/me">
              <User className="mr-2 h-4 w-4" />
              {user.username}
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-gray-900 dark:text-gray-100"
          >
            <ThemeToggle />
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start hover:bg-red-700 hover:text-white text-gray-900 dark:text-gray-100"
          >
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
