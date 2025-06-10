import { cn } from '~/lib/utils';
import { useFetcher } from '@remix-run/react';
import { X } from 'lucide-react';

interface Notification {
  id: string;
  content: string;
  created_at: string;
}

export function NotificationTray({
  notifications,
  onRemove,
  className,
}: {
  notifications: Notification[];
  onRemove?: (id: string) => void;
  className?: string;
}) {
  const fetcher = useFetcher();

  const markSeen = (id: string) => {
    fetcher.submit(null, {
      method: 'post',
      action: `/api/notification/${id}/seen`,
    });
    onRemove?.(id);
  };

  return (
    <div
      className={cn(
        'absolute inset-x-0 top-12 w-full border rounded bg-background p-2 shadow',
        className,
      )}
    >
      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">No notifications</p>
      ) : (
        <ul className="space-y-1 text-sm max-h-64 overflow-y-auto">
          {notifications.map((n) => (
            <li key={n.id} className="flex items-start justify-between gap-2">
              <span>{n.content}</span>
              <button
                aria-label="Dismiss notification"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => markSeen(n.id)}
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}