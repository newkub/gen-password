import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/solid-router';
import { type JSX } from 'solid-js';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: 'Password Generator' },
      {
        name: 'description',
        content: 'Create strong, secure, and random passwords',
      },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: RootComponent,
});

function RootComponent(): JSX.Element {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
