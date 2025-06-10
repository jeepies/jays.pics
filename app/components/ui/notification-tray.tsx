import { cn } from '~/lib/utils';

interface Notification {
  id: string;
  content: string;
  created_at: string;
}

export function NotificationTray({ notifications, className }: { notifications: Notification[]; className?: string; }) {
  return (
    <div className={cn('absolute right-2 top-12 w-64 border rounded bg-background p-2 shadow', className)}>
      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notifications</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {notifications.map((n) => (
            <li key={n.id}>{n.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
}