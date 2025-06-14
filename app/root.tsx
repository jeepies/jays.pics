import type { LinksFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from '@remix-run/react';
import ErrorPage from './components/error-page';
import { useEffect, useState } from 'react';
import './tailwind.css';
import { ToastProvider } from './components/toast';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [ThemeToggle, setThemeToggle] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? savedTheme : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    ThemeToggle ? 'light' : 'dark';
    if (localStorage.getItem('theme') === ThemeToggle) {
      return;
    }
    document.documentElement.setAttribute('data-theme', ThemeToggle);
    localStorage.setItem('theme', ThemeToggle);
  }, [ThemeToggle]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let title = 'Something went wrong';
  let message: string | undefined;

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message ?? error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <Layout>
      <ErrorPage title={title} message={message} />
    </Layout>
  );
}