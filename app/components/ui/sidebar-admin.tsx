import { Link } from '@remix-run/react';
import { ArrowLeft, Bell, BellDotIcon, Globe2, Home, Images, Logs, Users } from 'lucide-react';
import { useState } from 'react';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

import { Separator } from './separator';
import { ThemeToggle } from './themetoggle';

interface SidebarProps {
  className?: string;
  user: {
    username: string;
    images: any[];
    is_admin: boolean;
    notifications: { id: string; content: string; created_at: string }[];
  };
}

export function SidebarAdmin({ className, user }: SidebarProps) {
  const [showTray, setShowTray] = useState(false);

  return (
    <div className={cn('pb-12 w-64 relative', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            jays.pics
            {!user.notifications || user.notifications.length === 0 ? (
              <Bell className="float-right w-4 m-1 cursor-pointer" onClick={() => setShowTray(!showTray)} />
            ) : (
              <BellDotIcon
                className="float-right w-4 m-1 hover:text-accent cursor-pointer"
                onClick={() => setShowTray(!showTray)}
              />
            )}
          </h2>
          <Separator className="my-4" />
          <div className="space-y-1">
            <Button asChild variant="ghost" className="w-full justify-start text-gray-900 dark:text-gray-100">
              <Link to="/admin/index">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start text-gray-900 dark:text-gray-100">
              <Link to="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start text-gray-900 dark:text-gray-100">
              <Link to="/admin/images">
                <Images className="mr-2 h-4 w-4" />
                Images
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start text-gray-900 dark:text-gray-100">
              <Link to="/admin/domains">
                <Globe2 className="mr-2 h-4 w-4" />
                Domains
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start text-gray-900 dark:text-gray-100">
              <Link to="/admin/logs">
                <Logs className="mr-2 h-4 w-4" />
                Logs
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className="space-y-1">
          <Button asChild variant="ghost" className="w-full justify-start text-gray-900 dark:text-gray-100">
            <ThemeToggle />
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start text-gray-900 dark:text-gray-100">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Normal Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
