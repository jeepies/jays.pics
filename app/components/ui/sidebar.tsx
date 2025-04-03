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
  FileQuestion,
  Link2,
  ImageIcon,
  Globe2,
  BellDotIcon,
  Bell,
} from "lucide-react";
import { ThemeToggle } from "./themetoggle";
import { Separator } from "./separator";
import { Prisma } from "@prisma/client";

interface SidebarProps {
  className?: string;
  user: {
    username: string;
    is_admin: boolean;
    notifications: Prisma.User$notificationsArgs[];
  };
}

export function Sidebar({ className, user }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64 relative", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            jays.pics
            {!user.notifications || user.notifications.length === 0 ? (
              <Bell className="float-right w-4 m-1" />
            ) : (
              <BellDotIcon className="float-right w-4 m-1 hover:text-accent" />
            )}
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
                {/* <span className="ml-auto bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs">
                  {user.images.length}
                </span> */}
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
              <Link to="/dashboard/upload-settings">
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Config
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-gray-900 dark:text-gray-100"
            >
              <Link to="/dashboard/domains">
                <Globe2 className="mr-2 h-4 w-4" />
                Domains
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
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="space-y-1">
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
          {user.is_admin ? (
            <>
              
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-gray-900 dark:text-gray-100"
              >
                <Link to="/admin/index">
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
