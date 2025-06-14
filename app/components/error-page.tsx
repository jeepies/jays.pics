import { Link } from '@remix-run/react';

import { Button } from './ui/button';

export default function ErrorPage({
  title = 'Something went wrong',
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground p-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      {message ? <p className="text-muted-foreground">{message}</p> : null}
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}