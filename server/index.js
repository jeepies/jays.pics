import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookieSessionStorage, redirect, json } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, Link, useLoaderData, useRouteLoaderData, useActionData, Form, redirect as redirect$1, useLocation } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import React__default, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrismaClient, Progress as Progress$1 } from "@prisma/client";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Sun, Moon, Bell, BellDotIcon, Home, Image as Image$1, Link2, ImageIcon, Globe2, Cog, FileQuestion, Shield, User, LogOut, CalendarIcon, Users as Users$3, Images as Images$2, Logs, ArrowLeft, Upload as Upload$2, Plus, UserIcon, LogIn } from "lucide-react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Label as Label$1 } from "@radix-ui/react-label";
import { z } from "zod";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import Cloudflare, { CloudflareError } from "cloudflare";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { AvatarImage as AvatarImage$1 } from "@radix-ui/react-avatar";
import { v4 } from "uuid";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload as Upload$1 } from "@aws-sdk/lib-storage";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import prettyBytes from "pretty-bytes";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import bcrypt from "bcryptjs";
import { AnimatePresence, motion } from "framer-motion";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  const [ThemeToggle2, setThemeToggle] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });
  useEffect(() => {
    if (localStorage.getItem("theme") === ThemeToggle2) {
      return;
    }
    document.documentElement.setAttribute("data-theme", ThemeToggle2);
    localStorage.setItem("theme", ThemeToggle2);
  }, [ThemeToggle2]);
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function templateReplacer(stringWithTemplates, data) {
  const regex = /(?:{{[a-z_.]+}})/gi;
  const matches = [...stringWithTemplates.matchAll(regex)];
  matches.forEach((match) => {
    const s_match = match.toString();
    const key = s_match.replace("{{", "").replace("}}", "");
    const value = data[key];
    stringWithTemplates = stringWithTemplates.replace(
      s_match,
      value === "" || value === void 0 ? s_match : value
    );
  });
  return stringWithTemplates;
}
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const extendedClient = new PrismaClient().$extends({
  model: {
    user: {
      async delete({ where }) {
        return extendedClient.user.update({
          where: {
            ...where
          },
          data: {
            deleted_at: /* @__PURE__ */ new Date()
          }
        });
      }
    },
    comment: {
      async delete({ where }) {
        return extendedClient.comment.update({
          where: {
            ...where
          },
          data: {
            deleted_at: /* @__PURE__ */ new Date()
          }
        });
      }
    },
    image: {
      async delete({ where }) {
        return extendedClient.image.update({
          where: {
            ...where
          },
          data: {
            deleted_at: /* @__PURE__ */ new Date()
          }
        });
      }
    },
    imageComment: {
      async delete({ where }) {
        return extendedClient.imageComment.update({
          where: {
            ...where
          },
          data: {
            deleted_at: /* @__PURE__ */ new Date()
          }
        });
      }
    }
  },
  query: {
    user: {
      async $allOperations({ operation, args, query }) {
        if (operation === "findUnique" || operation === "findMany") {
          args.where = { ...args.where, deleted_at: null };
        }
        return query(args);
      }
    },
    comment: {
      async $allOperations({ operation, args, query }) {
        if (operation === "findUnique" || operation === "findMany") {
          args.where = { ...args.where, deleted_at: null };
        }
        return query(args);
      }
    },
    image: {
      async $allOperations({ operation, args, query }) {
        if (operation === "findUnique" || operation === "findMany") {
          args.where = { ...args.where, deleted_at: null };
        }
        return query(args);
      }
    },
    imageComment: {
      async $allOperations({ operation, args, query }) {
        if (operation === "findUnique" || operation === "findMany") {
          args.where = { ...args.where, deleted_at: null };
        }
        return query(args);
      }
    }
  }
});
if (!global.__prisma) {
  global.__prisma = extendedClient;
}
global.__prisma.$connect();
const prisma = global.__prisma;
let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET ?? "totally_secret"],
    secure: process.env.NODE_ENV === "production"
  }
});
async function getUserBySession(session) {
  return await prisma.user.findUnique({
    where: { id: session.get("userID") },
    select: {
      id: true,
      username: true,
      images: true,
      referrer_profile: true,
      upload_preferences: true,
      is_admin: true,
      upload_key: true,
      username_changed_at: true,
      username_history: true,
      max_space: true,
      space_used: true,
      notifications: {
        where: {
          seen: false
        }
      }
    }
  });
}
async function getUserByID(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      images: true,
      created_at: true,
      badges: true,
      referrer_profile: true
    }
  });
}
async function getAllReferrals(referrer_id) {
  return await prisma.referral.findMany({
    where: { referrer_id }
  });
}
let { getSession, commitSession, destroySession } = sessionStorage;
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme ? savedTheme : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });
  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;
    theme === "dark" ? bodyClass.add(className) : bodyClass.remove(className);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => prevTheme === "dark" ? "light" : "dark");
  };
  return /* @__PURE__ */ jsx(
    Button,
    {
      onClick: toggleTheme,
      variant: "ghost",
      className: "w-full justify-start",
      children: theme === "dark" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Sun, { className: "mr-2 h-4 w-4" }),
        "Light Mode"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Moon, { className: "mr-2 h-4 w-4" }),
        "Dark Mode"
      ] })
    }
  );
}
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
function Sidebar({ className, user }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("pb-12 w-64 relative", className), children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "px-3 py-2", children: [
      /* @__PURE__ */ jsxs("h2", { className: "mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100", children: [
        "jays.pics",
        !user.notifications || user.notifications.length === 0 ? /* @__PURE__ */ jsx(Bell, { className: "float-right w-4 m-1" }) : /* @__PURE__ */ jsx(BellDotIcon, { className: "float-right w-4 m-1 hover:text-accent" })
      ] }),
      /* @__PURE__ */ jsx(Separator, { className: "my-4" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/index", children: [
              /* @__PURE__ */ jsx(Home, { className: "mr-2 h-4 w-4" }),
              "Dashboard"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/images", children: [
              /* @__PURE__ */ jsx(Image$1, { className: "mr-2 h-4 w-4" }),
              "Images"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/referrals", children: [
              /* @__PURE__ */ jsx(Link2, { className: "mr-2 h-4 w-4" }),
              "Referrals"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/upload-settings", children: [
              /* @__PURE__ */ jsx(ImageIcon, { className: "mr-2 h-4 w-4" }),
              "Upload Config"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/domains", children: [
              /* @__PURE__ */ jsx(Globe2, { className: "mr-2 h-4 w-4" }),
              "Domains"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/settings", children: [
              /* @__PURE__ */ jsx(Cog, { className: "mr-2 h-4 w-4" }),
              "Settings"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/help", children: [
              /* @__PURE__ */ jsx(FileQuestion, { className: "mr-2 h-4 w-4" }),
              "Help"
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-0 right-0 px-3", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      user.is_admin ? /* @__PURE__ */ jsxs(Fragment, { children: [
        " ",
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/admin/index", children: [
              /* @__PURE__ */ jsx(Shield, { className: "mr-2 h-4 w-4" }),
              "Admin Dashboard"
            ] })
          }
        )
      ] }) : /* @__PURE__ */ jsx(Fragment, {}),
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          variant: "ghost",
          className: "w-full justify-start text-gray-900 dark:text-gray-100",
          children: /* @__PURE__ */ jsxs(Link, { to: "/profile/me", children: [
            /* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }),
            user.username
          ] })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          variant: "ghost",
          className: "w-full justify-start text-gray-900 dark:text-gray-100",
          children: /* @__PURE__ */ jsx(ThemeToggle, {})
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          variant: "ghost",
          className: "w-full justify-start hover:bg-red-700 hover:text-white text-gray-900 dark:text-gray-100",
          children: /* @__PURE__ */ jsxs(Link, { to: "/logout", children: [
            /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
            "Log out"
          ] })
        }
      )
    ] }) })
  ] });
}
const meta$8 = () => {
  return [
    { title: "Dashboard | jays.pics" },
    { name: "description", content: "Invite-only Image Hosting" },
    {
      name: "theme-color",
      content: "#e05cd9"
    }
  ];
};
async function loader$r({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");
  const user = await getUserBySession(session);
  if (user === null)
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  const now = Date.now();
  return { user, now };
}
function Application() {
  const { user } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsx(Sidebar, { user, className: "border-r" }),
    /* @__PURE__ */ jsx("div", { className: "flex-grow rounded w-full h-full overflow-auto", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}
function useAppLoaderData() {
  return useRouteLoaderData("routes/_app");
}
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Application,
  loader: loader$r,
  meta: meta$8,
  useAppLoaderData
}, Symbol.toStringTag, { value: "Module" }));
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
function DataTable({
  columns: columns2,
  data,
  selected
}) {
  var _a, _b;
  const [columnFilters, setColumnFilters] = React__default.useState(
    []
  );
  const [rowSelection, setRowSelection] = React__default.useState({});
  const table = useReactTable({
    data,
    columns: columns2,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      columnFilters
    }
  });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      Input,
      {
        className: "hidden",
        name: "selected",
        readOnly: true,
        value: JSON.stringify(rowSelection)
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex items-center py-4", children: /* @__PURE__ */ jsx(
      Input,
      {
        placeholder: "Filter domains...",
        value: ((_a = table.getColumn("url")) == null ? void 0 : _a.getFilterValue()) ?? "",
        onChange: (event) => {
          var _a2;
          return (_a2 = table.getColumn("url")) == null ? void 0 : _a2.setFilterValue(event.target.value);
        },
        className: "max-w-sm"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "rounded-md border", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx(TableRow, { children: headerGroup.headers.map((header) => {
        return /* @__PURE__ */ jsx(TableHead, { children: header.isPlaceholder ? null : flexRender(
          header.column.columnDef.header,
          header.getContext()
        ) }, header.id);
      }) }, headerGroup.id)) }),
      /* @__PURE__ */ jsx(TableBody, { children: ((_b = table.getRowModel().rows) == null ? void 0 : _b.length) ? table.getRowModel().rows.map((row) => /* @__PURE__ */ jsx(
        TableRow,
        {
          "data-state": row.getIsSelected() && "selected",
          children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx(TableCell, { children: flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
          ) }, cell.id))
        },
        row.id
      )) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(
        TableCell,
        {
          colSpan: columns2.length,
          className: "h-24 text-center",
          children: "No results."
        }
      ) }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end space-x-2 py-4", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => table.previousPage(),
          disabled: !table.getCanPreviousPage(),
          children: "Previous"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => table.nextPage(),
          disabled: !table.getCanNextPage(),
          children: "Next"
        }
      )
    ] })
  ] });
}
const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const columns$2 = [
  {
    id: "select",
    header: ({ table }) => /* @__PURE__ */ jsx(
      Checkbox,
      {
        checked: table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected() && "indeterminate",
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all"
      }
    ),
    cell: ({ row }) => /* @__PURE__ */ jsx(
      Checkbox,
      {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        "aria-label": "Select row"
      }
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "url",
    header: "Domain"
  },
  {
    accessorKey: "donator.username",
    header: "Donator"
  }
];
async function loader$q({ request }) {
  const user = await getUserBySession(
    await getSession(request.headers.get("Cookie"))
  );
  const public_domains = await prisma.uRL.findMany({
    where: {
      public: true,
      progress: Progress$1.DONE
    },
    select: {
      url: true,
      donator: {
        select: {
          username: true
        }
      }
    }
  });
  const private_domains = await prisma.uRL.findMany({
    where: {
      donator_id: user.id,
      progress: Progress$1.DONE,
      public: false
    },
    select: {
      url: true,
      donator: {
        select: {
          username: true
        }
      }
    }
  });
  const data = [...public_domains, ...private_domains];
  return data;
}
function UploadSettings() {
  var _a, _b, _c;
  const data = useAppLoaderData();
  const urls = useLoaderData();
  const actionData = useActionData();
  const selected = data.user.upload_preferences.urls;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Uploader Configuration" }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx("label", { children: "Upload Key:" }),
        /* @__PURE__ */ jsx(Input, { className: "my-2", readOnly: true, value: data == null ? void 0 : data.user.upload_key }),
        /* @__PURE__ */ jsx("label", { children: "Download Configs for:" }),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx(Button, { children: /* @__PURE__ */ jsx("a", { href: `/api/sharex/${data == null ? void 0 : data.user.id}`, children: "ShareX" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mt-4", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Embed Content" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Form, { method: "post", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            className: "hidden",
            value: "update_embed",
            name: "type",
            readOnly: true
          }
        ),
        /* @__PURE__ */ jsx(Label, { htmlFor: "embed_title", children: "Title" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            className: "my-2",
            name: "embed_title",
            defaultValue: (_a = data == null ? void 0 : data.user.upload_preferences) == null ? void 0 : _a.embed_title
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.embed_title }),
        /* @__PURE__ */ jsx(Label, { htmlFor: "embed_author", children: "Author" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            className: "my-2",
            name: "embed_author",
            defaultValue: (_b = data == null ? void 0 : data.user.upload_preferences) == null ? void 0 : _b.embed_author
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.embed_author }),
        /* @__PURE__ */ jsx(Label, { htmlFor: "embed_colour", children: "Colour" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            className: "my-2",
            name: "embed_colour",
            defaultValue: (_c = data == null ? void 0 : data.user.upload_preferences) == null ? void 0 : _c.embed_colour
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.embed_colour }),
        /* @__PURE__ */ jsx(Button, { type: "submit", children: "Save" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mt-4", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Domains" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Form, { method: "post", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            className: "hidden",
            value: "update_urls",
            name: "type",
            readOnly: true
          }
        ),
        /* @__PURE__ */ jsx(DataTable, { columns: columns$2, data: urls, selected }),
        /* @__PURE__ */ jsx(Button, { type: "submit", children: "Save" })
      ] }) })
    ] })
  ] }) });
}
const embedUpdateSchema$1 = z.object({
  embed_title: z.string(),
  embed_author: z.string(),
  embed_colour: z.string().length(7, { message: "Must be 7 characters long" }).regex(/^#/, { message: "Must be a valid hex colour" })
});
const urlUpdateSchema = z.object({
  selected: z.string()
});
async function action$a({ request }) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  let result;
  const requestType = formData.get("type");
  const user = await getUserBySession(
    await getSession(request.headers.get("Cookie"))
  );
  if (requestType === "update_embed") {
    result = embedUpdateSchema$1.safeParse(payload);
    if (!result.success) {
      const error = result.error.flatten();
      return {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors
      };
    }
    await prisma.uploaderPreferences.update({
      where: {
        userId: user.id
      },
      data: {
        embed_author: result.data.embed_author,
        embed_title: result.data.embed_title,
        embed_colour: result.data.embed_colour
      }
    });
  }
  if (requestType === "update_urls") {
    result = urlUpdateSchema.safeParse(payload);
    if (!result.success) {
      const error = result.error.flatten();
      return {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors
      };
    }
    const urls = await prisma.uRL.findMany({
      select: {
        url: true
      }
    });
    let selected = Object.keys(JSON.parse(result.data.selected)).map((val) => {
      return urls[+val].url;
    });
    if (selected.length === 0) selected = ["jays.pics"];
    await prisma.uploaderPreferences.update({
      where: {
        userId: user.id
      },
      data: {
        urls: selected
      }
    });
  }
  return null;
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a,
  default: UploadSettings,
  loader: loader$q
}, Symbol.toStringTag, { value: "Module" }));
const cf = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_USER_API
});
async function createZone(domain) {
  const zone = await cf.zones.create({
    account: { id: process.env.CLOUDFLARE_USER_ID },
    name: domain,
    type: "full"
  });
  return zone;
}
const domainSchema = z.object({
  domain: z.string().regex(/[a-z-]+\.[a-z]+/i, "This domain is invalid.").optional()
});
async function loader$p({ request }) {
  const url = new URL(request.url);
  const paramEntries = Object.fromEntries(url.searchParams.entries());
  const result = domainSchema.safeParse(paramEntries);
  if (!result.success) {
    const error = result.error.flatten();
    return {
      paramEntries,
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors
    };
  }
  let domain = null;
  if (result.data.domain) {
    domain = await prisma.uRL.findFirst({
      where: {
        url: result.data.domain
      }
    });
  }
  return domain;
}
function AddDomain() {
  const data = useLoaderData();
  const actionData = useActionData();
  console.log(data);
  console.log(actionData);
  if (data === null) {
    return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: "What domain would you like to link?" }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Form, { method: "POST", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            name: "action",
            value: "set_domain",
            readOnly: true,
            className: "hidden"
          }
        ),
        /* @__PURE__ */ jsx(Input, { name: "domain", placeholder: "domain.com" }),
        /* @__PURE__ */ jsx(Button, { className: "mt-2 w-full", children: "Start" })
      ] }) })
    ] }) });
  }
  switch (data.progress) {
    case Progress$1.INPUT:
      return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            " ",
            /* @__PURE__ */ jsx(CardTitle, { children: "What domain would you like to link?" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx(Input, { name: "domain", defaultValue: data.url, readOnly: true }),
            /* @__PURE__ */ jsx(Button, { className: "mt-2 w-full", disabled: true, children: "Start" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "mt-2", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Change Nameservers" }) }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx(Label$1, { children: "Please update your nameservers to point too" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                className: "mt-2",
                readOnly: true,
                defaultValue: data.nameservers[0]
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                className: "mt-2",
                readOnly: true,
                defaultValue: data.nameservers[1]
              }
            ),
            /* @__PURE__ */ jsxs(Form, { method: "POST", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  name: "domain",
                  defaultValue: data.url,
                  readOnly: true,
                  className: "hidden"
                }
              ),
              /* @__PURE__ */ jsx(
                Input,
                {
                  name: "action",
                  value: "updated_nameservers",
                  readOnly: true,
                  className: "hidden"
                }
              ),
              /* @__PURE__ */ jsx(Button, { className: "mt-2 w-full", children: "Done" })
            ] })
          ] })
        ] })
      ] });
    case Progress$1.WAITING:
      return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            " ",
            /* @__PURE__ */ jsx(CardTitle, { children: "What domain would you like to link?" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx(Input, { name: "domain", defaultValue: data.url, readOnly: true }),
            /* @__PURE__ */ jsx(Button, { className: "mt-2 w-full", disabled: true, children: "Start" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "mt-2", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Change Nameservers" }) }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx(Label$1, { children: "Please update your nameservers to point too" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                className: "mt-2",
                readOnly: true,
                defaultValue: data.nameservers[0]
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                className: "mt-2",
                readOnly: true,
                defaultValue: data.nameservers[1]
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                name: "action",
                value: "updated_nameservers",
                readOnly: true,
                className: "hidden",
                disabled: true
              }
            ),
            /* @__PURE__ */ jsx(Button, { className: "mt-2 w-full", disabled: true, children: "Done" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "mt-2", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Waiting" }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Label$1, { children: [
            "We are checking the nameservers of ",
            data.url,
            ". Please check back again later."
          ] }) })
        ] })
      ] });
  }
}
async function action$9({ request }) {
  var _a;
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const result = domainSchema.safeParse(payload);
  if (!result.success) {
    const error = result.error.flatten();
    return {
      payload,
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors
    };
  }
  const requestAction = formData.get("action");
  const user = await getUserBySession(
    await getSession(request.headers.get("Cookie"))
  );
  if (requestAction === "set_domain") {
    const domainCheck = await prisma.uRL.count({
      where: { url: (_a = result.data) == null ? void 0 : _a.domain }
    });
    if (domainCheck !== 0) return null;
    let zone;
    try {
      zone = await createZone(result.data.domain);
    } catch (err) {
      if (err instanceof CloudflareError) {
        const e = JSON.parse(err.message.slice(4, err.message.length));
        if (!e.errors[0].message.includes("already exists")) {
          await prisma.log.create({
            data: {
              message: e.errors[0].message
            }
          });
        }
      }
    }
    const domain = await prisma.uRL.create({
      data: {
        donator_id: user.id,
        url: result.data.domain,
        public: false,
        connected: false,
        zone_id: zone.id,
        nameservers: zone == null ? void 0 : zone.name_servers
      }
    });
    return redirect("/dashboard/domain/add?domain=" + domain.url);
  }
  if (requestAction === "updated_nameservers") {
    await prisma.uRL.update({
      where: {
        url: result.data.domain
      },
      data: {
        progress: Progress$1.WAITING
      }
    });
    return redirect("/dashboard/domain/add?domain=" + result.data.domain);
  }
  return null;
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  default: AddDomain,
  loader: loader$p
}, Symbol.toStringTag, { value: "Module" }));
const columns$1 = [
  {
    id: "select",
    header: ({ table }) => /* @__PURE__ */ jsx(
      Checkbox,
      {
        checked: table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected() && "indeterminate",
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all"
      }
    ),
    cell: ({ row }) => /* @__PURE__ */ jsx(
      Checkbox,
      {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        "aria-label": "Select row"
      }
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "url",
    header: "Domain"
  },
  {
    accessorKey: "public",
    header: "Public",
    cell: (cell) => cell.getValue() ? "Yes" : "No"
  },
  {
    accessorKey: "progress",
    header: "Status",
    cell: (cell) => {
      switch (cell.getValue()) {
        case Progress$1.DONE:
          return "Linked!";
        case Progress$1.INPUT:
          const url = cell.row.getAllCells().filter((cell2) => cell2.id.includes("_url"))[0];
          if (!url) return /* @__PURE__ */ jsx(Label, { children: "An unknown error occured" });
          return /* @__PURE__ */ jsx(Link, { to: `/dashboard/domain/add?domain=${url.getValue() ?? ""}`, children: "Input Required" });
        case Progress$1.WAITING:
          return "Waiting...";
      }
    }
  },
  {
    accessorKey: "last_checked_at",
    header: "Last Checked",
    cell: (cell) => `${new Date(
      // @ts-ignore
      Date.parse(cell.getValue())
    ).toLocaleTimeString()} - ${new Date(
      // @ts-ignore
      Date.parse(cell.getValue())
    ).toLocaleDateString()}`
  },
  {
    accessorKey: "created_at",
    header: "Donated At",
    // @ts-ignore
    cell: (cell) => `${new Date(
      // @ts-ignore
      Date.parse(cell.getValue())
    ).toLocaleTimeString()} - ${new Date(
      // @ts-ignore
      Date.parse(cell.getValue())
    ).toLocaleDateString()}`
  }
];
async function loader$o({ request }) {
  const user = await getUserBySession(
    await getSession(request.headers.get("Cookie"))
  );
  return await prisma.uRL.findMany({
    where: {
      donator_id: user.id
    },
    select: {
      url: true,
      public: true,
      created_at: true,
      last_checked_at: true,
      progress: true
    }
  });
}
function MyDomains() {
  const urls = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs(Card, { className: "mt-4", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Domains" }) }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx(DataTable, { columns: columns$1, data: urls, selected: [] }),
      /* @__PURE__ */ jsx(Button, { className: "mt-2", children: /* @__PURE__ */ jsx(Link, { to: "/dashboard/domain/add", children: "Add Domain" }) }),
      /* @__PURE__ */ jsx(Button, { className: "mt-2 ml-2", children: /* @__PURE__ */ jsx(Link, { to: "/dashboard/domain/add", children: "Delete Domain(s)" }) })
    ] })
  ] }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MyDomains,
  loader: loader$o
}, Symbol.toStringTag, { value: "Module" }));
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
async function loader$n({ params }) {
  const user = await prisma.user.findFirst({
    where: { id: params.id },
    select: {
      username: true,
      created_at: true,
      badges: true,
      upload_preferences: true
    }
  });
  if (user === null) return redirect("/admin/index");
  return { user };
}
function AdminProfile() {
  var _a, _b, _c;
  const { user } = useLoaderData();
  const actionData = useActionData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Card, { className: "mb-8", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4", children: [
      /* @__PURE__ */ jsxs(Avatar, { className: "h-24 w-24", children: [
        /* @__PURE__ */ jsx(
          AvatarImage$1,
          {
            src: `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`,
            alt: user == null ? void 0 : user.username
          }
        ),
        /* @__PURE__ */ jsx(AvatarFallback, { children: user == null ? void 0 : user.username.slice(0, 2).toUpperCase() })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: user == null ? void 0 : user.username }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx(CalendarIcon, { className: "mr-1 inline-block h-4 w-4" }),
          "Joined ",
          new Date(user.created_at).toLocaleDateString()
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", children: JSON.parse(user.badges).map((badge) => /* @__PURE__ */ jsx(Badge, { className: "mr-2", children: badge.text })) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs(Card, { className: "mx-auto mb-8", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Uploader Preferences" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Form, { method: "post", children: [
        /* @__PURE__ */ jsx(Input, { className: "hidden", value: "update_embed", name: "type" }),
        /* @__PURE__ */ jsx(Label, { htmlFor: "embed_title", children: "Title" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            className: "my-2",
            name: "embed_title",
            defaultValue: (_a = user.upload_preferences) == null ? void 0 : _a.embed_title
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.embed_title }),
        /* @__PURE__ */ jsx(Label, { htmlFor: "embed_author", children: "Author" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            className: "my-2",
            name: "embed_author",
            defaultValue: (_b = user.upload_preferences) == null ? void 0 : _b.embed_author
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.embed_author }),
        /* @__PURE__ */ jsx(Label, { htmlFor: "embed_colour", children: "Colour" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            className: "my-2",
            name: "embed_colour",
            defaultValue: (_c = user.upload_preferences) == null ? void 0 : _c.embed_colour
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.embed_colour }),
        /* @__PURE__ */ jsx(Button, { type: "submit", children: "Save" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mb border-red-900", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Danger Zone" }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-red-700", children: /* @__PURE__ */ jsx("i", { children: "These actions can be catastrophic" }) })
      ] }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx(Form, { method: "post", children: /* @__PURE__ */ jsx(Input, { className: "hidden", value: "danger_zone", name: "type" }) }),
        /* @__PURE__ */ jsxs("div", { className: "", children: [
          /* @__PURE__ */ jsx(Button, { children: "Lock Account" }),
          /* @__PURE__ */ jsx(Button, { className: "ml-2", children: "Purge Images" })
        ] })
      ] })
    ] })
  ] });
}
const embedUpdateSchema = z.object({
  embed_title: z.string(),
  embed_author: z.string(),
  embed_colour: z.string().length(7, { message: "Must be 7 characters long" }).regex(/^#/, { message: "Must be a valid hex colour" })
});
async function action$8({ request, params }) {
  const user = await prisma.user.findFirst({ where: { id: params.id } });
  if (user === null)
    return {
      undefined: void 0,
      formErrors: [],
      fieldErrors: {
        embed_title: "",
        embed_author: "",
        embed_colour: ""
      }
    };
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  let result;
  const requestType = formData.get("type");
  formData.delete("type");
  if (requestType === "update_embed") {
    result = embedUpdateSchema.safeParse(payload);
    if (!result.success) {
      const error = result.error.flatten();
      return {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors
      };
    }
    await prisma.uploaderPreferences.update({
      where: {
        userId: user.id
      },
      data: {
        embed_author: result.data.embed_author,
        embed_title: result.data.embed_title,
        embed_colour: result.data.embed_colour
      }
    });
  }
  return null;
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  default: AdminProfile,
  loader: loader$n
}, Symbol.toStringTag, { value: "Module" }));
async function loader$m({ request }) {
  var _a;
  const session = await getSession(request.headers.get("Cookie"));
  const user = await getUserBySession(session);
  const url = new URL(request.url);
  const query = url.searchParams.get("regenerate");
  if (query !== null) {
    await prisma.referrerProfile.update({
      where: { userId: user.id },
      data: {
        referral_code: v4()
      }
    });
    return redirect("/dashboard/referrals");
  }
  const referrals = await prisma.referral.findMany({
    where: { referrer_id: (_a = user.referrer_profile) == null ? void 0 : _a.id },
    select: {
      created_at: true,
      referred: true
    }
  });
  return await { data: { referrals }, user };
}
function copy() {
  const referralCode = document.getElementById("referral-code");
  referralCode.select();
  referralCode.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(referralCode.value);
}
function Referrals() {
  var _a, _b;
  const { user, data } = useLoaderData();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Your Referral Code" }) }),
      /* @__PURE__ */ jsxs(CardContent, { children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "referral-code",
            className: "text-center",
            value: (_a = user == null ? void 0 : user.referrer_profile) == null ? void 0 : _a.referral_code,
            readOnly: true
          }
        ),
        /* @__PURE__ */ jsx(Button, { onClick: copy, className: "mt-2 w-full", children: "Copy" }),
        /* @__PURE__ */ jsx(Link, { to: "?regenerate", children: /* @__PURE__ */ jsx(Button, { className: "mt-2 w-full", children: "Regenerate" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mt-4", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Your Referrals" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          "You have used ",
          data.referrals.length,
          " of",
          " ",
          (_b = user == null ? void 0 : user.referrer_profile) == null ? void 0 : _b.referral_limit,
          " referrals"
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "User" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Date" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: data.referrals.map((referral) => {
          return /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsx("a", { href: `/profile/${referral.referred.id}`, children: referral.referred.username }) }),
            /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: new Date(referral.created_at).toLocaleDateString() })
          ] }, referral.referred.id);
        }) })
      ] }) })
    ] })
  ] }) });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Referrals,
  loader: loader$m
}, Symbol.toStringTag, { value: "Module" }));
function Settings() {
  const data = useAppLoaderData();
  const changedAt = Date.parse(data.user.username_changed_at);
  const sevenDaysAgo = Date.parse(
    new Date(data.now - 7 * 24 * 60 * 60 * 1e3).toString()
  );
  const canChange = changedAt < sevenDaysAgo;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Account Details" }) }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx("label", { children: "Username:" }),
      canChange ? /* @__PURE__ */ jsx(Input, { defaultValue: data == null ? void 0 : data.user.username }) : /* @__PURE__ */ jsx(Input, { readOnly: true, value: data == null ? void 0 : data.user.username })
    ] })
  ] }) }) });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Settings
}, Symbol.toStringTag, { value: "Module" }));
const columns = [
  {
    accessorKey: "url",
    header: "Domain"
  },
  {
    accessorKey: "public",
    header: "Public",
    cell: (cell) => cell.getValue() ? "Yes" : "No"
  },
  {
    accessorKey: "donator.username",
    header: "Donator"
  },
  {
    accessorKey: "last_checked_at",
    header: "Last Checked",
    // @ts-ignore
    cell: (cell) => `${new Date(
      Date.parse(cell.getValue())
    ).toLocaleTimeString()} - ${new Date(
      Date.parse(cell.getValue())
    ).toLocaleDateString()}`
  },
  {
    accessorKey: "created_at",
    header: "Donated At",
    // @ts-ignore
    cell: (cell) => new Date(Date.parse(cell.getValue())).toLocaleDateString()
  }
];
async function loader$l() {
  return await prisma.uRL.findMany({
    where: {
      progress: Progress$1.DONE
    },
    select: {
      url: true,
      donator: {
        select: {
          username: true
        }
      },
      public: true,
      created_at: true,
      last_checked_at: true
    }
  });
}
function Domain() {
  const urls = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxs(Card, { className: "mt-4", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Domains" }) }),
    /* @__PURE__ */ jsxs(CardContent, { children: [
      /* @__PURE__ */ jsx(DataTable, { columns, data: urls, selected: [] }),
      /* @__PURE__ */ jsx(Button, { className: "mt-2", children: /* @__PURE__ */ jsx(Link, { to: "/dashboard/my-domains", children: "My Domains" }) })
    ] })
  ] }) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Domain,
  loader: loader$l
}, Symbol.toStringTag, { value: "Module" }));
async function loader$k({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");
  const user = await getUserBySession(session);
  if (user === null)
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  const images = await prisma.image.findMany({
    where: { uploader_id: user.id }
  });
  const url = new URL(request.url);
  const query = url.searchParams.get("generate_link");
  let clipboard;
  if (query !== null) {
    const urls = user.upload_preferences.urls;
    let url2;
    if (urls.length === 1) url2 = urls[0];
    else url2 = urls[Math.floor(Math.random() * urls.length)];
    clipboard = `https://${url2}/i/${query}/`;
  }
  return { images, clipboard };
}
function Images$1() {
  const { images, clipboard } = useLoaderData();
  if (clipboard) {
    navigator.clipboard.writeText(clipboard);
  }
  return /* @__PURE__ */ jsx("div", { className: "p-4", children: images.map((image) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-2", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: `/i/${image.id}/raw`,
        alt: image.display_name,
        className: "aspect-square rounded-md object-cover h-12"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "mt-2 truncate text-sm font-medium", children: /* @__PURE__ */ jsx("a", { href: `/i/${image.id}`, children: image.display_name }) }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: new Date(image.created_at).toLocaleDateString() }),
    /* @__PURE__ */ jsx(Form, { children: /* @__PURE__ */ jsx(Link, { to: `?generate_link=${image.id}`, children: /* @__PURE__ */ jsx(Button, { children: "Link" }) }) }),
    /* @__PURE__ */ jsx(Link, { to: `/i/${image.id}/delete`, children: /* @__PURE__ */ jsx(Button, { children: "Delete" }) })
  ] }) }, image.id)) });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Images$1,
  loader: loader$k
}, Symbol.toStringTag, { value: "Module" }));
const { STORAGE_ACCESS_KEY, STORAGE_SECRET, STORAGE_REGION, STORAGE_BUCKET } = process.env;
if (!(STORAGE_ACCESS_KEY && STORAGE_SECRET && STORAGE_REGION && STORAGE_BUCKET)) {
  throw new Error(`Storage is missing required configuration.`);
}
const S3 = new S3Client({
  credentials: {
    secretAccessKey: STORAGE_SECRET,
    accessKeyId: STORAGE_ACCESS_KEY
  },
  region: STORAGE_REGION
});
async function uploadToS3(file, filename) {
  try {
    const upload = new Upload$1({
      client: S3,
      leavePartsOnError: false,
      params: {
        Bucket: STORAGE_BUCKET,
        Key: filename,
        Body: file.stream()
      }
    });
    const res = await upload.done();
    return res;
  } catch (err) {
    await prisma.log.create({
      data: {
        message: "S3 failed with err " + err
      }
    });
  }
}
async function get(key) {
  const res = await fetch(
    `https://s3.${STORAGE_REGION}.amazonaws.com/${STORAGE_BUCKET}/${key}`
  );
  return await res.blob();
}
async function del(key) {
  await S3.send(new DeleteObjectCommand({ Bucket: STORAGE_BUCKET, Key: key }));
}
const schema$4 = z.object({
  image: z.instanceof(File)
});
async function action$7({ request }) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const result = schema$4.safeParse(payload);
  if (!result.success) {
    return json({ success: false, errors: result.error });
  }
  const image = result.data.image;
  const url = new URL(request.url);
  const paramEntries = Object.fromEntries(url.searchParams.entries());
  if (!paramEntries.upload_key)
    return json({
      success: false,
      message: "Upload key is not set"
    });
  const user = await prisma.user.findFirst({
    where: { upload_key: paramEntries.upload_key }
  });
  if (!user) {
    return json({
      success: false,
      message: "You are not authorised"
    });
  }
  if (!["image/png", "image/gif", "image/jpeg", "image/webp"].includes(image.type)) {
    return json({
      success: false,
      message: "Incorrect file type"
    });
  }
  if (user.space_used + image.size > user.max_space) {
    return json({
      success: false,
      message: "When uploading this image, your allocated space was exceeded."
    });
  }
  const dbImage = await prisma.image.create({
    data: {
      display_name: image.name,
      uploader_id: user.id,
      size: image.size,
      type: image.type
    }
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { space_used: user.space_used + image.size }
  });
  const response = await uploadToS3(
    result.data.image,
    `${user.id}/${dbImage.id}`
  );
  if ((response == null ? void 0 : response.$metadata.httpStatusCode) === 200) {
    return json({
      success: true
    });
  }
  return json({
    success: false
  });
}
async function loader$j({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");
  const user = await getUserBySession(session);
  if (user === null)
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  return { user };
}
function Upload() {
  const { user } = useLoaderData();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    Form,
    {
      method: "POST",
      action: `/upload?upload_key=${user.upload_key}`,
      encType: "multipart/form-data",
      children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "img-field", children: "Image to upload" }),
        /* @__PURE__ */ jsx("input", { id: "img-field", type: "file", name: "image", accept: "image/*" }),
        /* @__PURE__ */ jsx("button", { type: "submit", children: "Upload" })
      ]
    }
  ) });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: Upload,
  loader: loader$j
}, Symbol.toStringTag, { value: "Module" }));
function SidebarAdmin({ className, user }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("pb-12 w-64 relative", className), children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "px-3 py-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100", children: "jays.pics" }),
      /* @__PURE__ */ jsx(Separator, { className: "my-4" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/admin/index", children: [
              /* @__PURE__ */ jsx(Home, { className: "mr-2 h-4 w-4" }),
              "Dashboard"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/admin/users", children: [
              /* @__PURE__ */ jsx(Users$3, { className: "mr-2 h-4 w-4" }),
              "Users"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/admin/images", children: [
              /* @__PURE__ */ jsx(Images$2, { className: "mr-2 h-4 w-4" }),
              "Images"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/admin/domains", children: [
              /* @__PURE__ */ jsx(Globe2, { className: "mr-2 h-4 w-4" }),
              "Domains"
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            asChild: true,
            variant: "ghost",
            className: "w-full justify-start text-gray-900 dark:text-gray-100",
            children: /* @__PURE__ */ jsxs(Link, { to: "/admin/logs", children: [
              /* @__PURE__ */ jsx(Logs, { className: "mr-2 h-4 w-4" }),
              "Logs"
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-0 right-0 px-3", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          variant: "ghost",
          className: "w-full justify-start text-gray-900 dark:text-gray-100",
          children: /* @__PURE__ */ jsx(ThemeToggle, {})
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          variant: "ghost",
          className: "w-full justify-start text-gray-900 dark:text-gray-100",
          children: /* @__PURE__ */ jsxs(Link, { to: "/", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Normal Dashboard"
          ] })
        }
      )
    ] }) })
  ] });
}
const meta$7 = () => {
  return [
    { title: "Admin Dashboard | jays.pics" },
    { name: "description", content: "Administration Dashboard" },
    {
      name: "theme-color",
      content: "#e05cd9"
    }
  ];
};
async function loader$i({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");
  const user = await getUserBySession(session);
  if (!(user == null ? void 0 : user.is_admin)) return redirect("/");
  if (user === null)
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  return user;
}
function AdminDashboard$1() {
  const user = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen overflow-hidden", children: [
    /* @__PURE__ */ jsx(SidebarAdmin, { user, className: "border-r" }),
    /* @__PURE__ */ jsx("div", { className: "flex-grow rounded w-full h-full overflow-auto", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsx(Outlet, {}) }) })
  ] });
}
function useAdminLoader() {
  return useRouteLoaderData("routes/_admin");
}
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminDashboard$1,
  loader: loader$i,
  meta: meta$7,
  useAdminLoader
}, Symbol.toStringTag, { value: "Module" }));
async function loader$h({ request }) {
  const count = await prisma.uRL.count();
  const urls = await prisma.uRL.findMany({
    select: {
      url: true,
      public: true,
      progress: true,
      zone_id: true,
      donator: {
        select: {
          id: true,
          username: true
        }
      },
      created_at: true
    }
  });
  return { count, urls };
}
function Users$2() {
  useAdminLoader();
  const { count, urls } = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    " ",
    /* @__PURE__ */ jsxs(Card, { className: "mt-4", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Domains" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          "There are ",
          count,
          " domains"
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "max-w-96", children: "Domain" }),
          /* @__PURE__ */ jsx(TableHead, { className: "max-w-96", children: "Public" }),
          /* @__PURE__ */ jsx(TableHead, { className: "max-w-96", children: "Status" }),
          /* @__PURE__ */ jsx(TableHead, { className: "max-w-96", children: "Zone" }),
          /* @__PURE__ */ jsx(TableHead, { className: "max-w-96", children: "Donator" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Date of Creation" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: urls.map((url) => {
          return /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: url.url }),
            /* @__PURE__ */ jsx(TableCell, { children: url.public ? "Yes" : "No" }),
            /* @__PURE__ */ jsx(TableCell, { children: url.progress }),
            /* @__PURE__ */ jsx(TableCell, { children: url.zone_id }),
            /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("a", { href: `/admin/profile/${url.donator.id}`, children: url.donator.username }) }),
            /* @__PURE__ */ jsxs(TableCell, { className: "text-right", children: [
              new Date(url.created_at).toLocaleDateString(),
              " @",
              " ",
              new Date(url.created_at).toLocaleTimeString()
            ] })
          ] });
        }) })
      ] }) })
    ] })
  ] });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Users$2,
  loader: loader$h
}, Symbol.toStringTag, { value: "Module" }));
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
async function loader$g({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");
  const user = await getUserBySession(session);
  if (user === null)
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session)
      }
    });
  const referrals = await getAllReferrals(user.referrer_profile.id);
  const images = await prisma.image.findMany({
    where: { uploader_id: user.id }
  });
  const announcement = await prisma.announcement.findMany({
    select: {
      content: true
    },
    orderBy: {
      created_at: "desc"
    },
    take: 1
  });
  return { user, referrals, images, announcement };
}
function Dashboard() {
  const { user, referrals, images, announcement } = useLoaderData();
  const [totalStorage, setTotalStorage] = useState(0);
  const [storageLimit] = useState(user.max_space);
  useEffect(() => {
    const calculatedStorage = images.reduce(
      (acc, image) => acc + image.size,
      0
    );
    setTotalStorage(calculatedStorage);
  }, [user.images]);
  return /* @__PURE__ */ jsx("div", { className: "flex h-screen", children: /* @__PURE__ */ jsxs("main", { className: "flex-1 p-8 overflow-y-auto", children: [
    /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold py-2", children: [
      "Welcome, ",
      /* @__PURE__ */ jsx("span", { className: "text-primary", children: user.username }),
      "!"
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "my-2", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Announcement" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: announcement[0].content })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Total Images" }),
          /* @__PURE__ */ jsxs(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              className: "h-4 w-4 text-muted-foreground",
              children: [
                /* @__PURE__ */ jsx("path", { d: "M21 12V7H5a2 2 0 0 1 0-4h14v4" }),
                /* @__PURE__ */ jsx("path", { d: "M3 5v14a2 2 0 0 0 2 2h16" }),
                /* @__PURE__ */ jsx("path", { d: "m18 15 3 3-3 3" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: images.length }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Lifetime uploads" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Storage Used" }),
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              className: "h-4 w-4 text-muted-foreground",
              children: /* @__PURE__ */ jsx("path", { d: "M22 12h-4l-3 9L9 3l-3 9H2" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: prettyBytes(totalStorage) }),
          /* @__PURE__ */ jsx(
            Progress,
            {
              value: totalStorage / storageLimit * 100,
              className: "mt-2"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
            (totalStorage / storageLimit * 100).toFixed(2),
            "% of",
            " ",
            prettyBytes(storageLimit),
            " limit"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Active Referrals" }),
          /* @__PURE__ */ jsxs(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              className: "h-4 w-4 text-muted-foreground",
              children: [
                /* @__PURE__ */ jsx("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
                /* @__PURE__ */ jsx("circle", { cx: "9", cy: "7", r: "4" }),
                /* @__PURE__ */ jsx("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
                /* @__PURE__ */ jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: referrals.length }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Total referrals" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Recent Uploads" }),
      /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/upload", children: [
        /* @__PURE__ */ jsx(Upload$2, { className: "mr-2 h-4 w-4" }),
        " Upload New Image"
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: images.slice(Math.max(images.length - 15, 0)).reverse().map((image) => {
      return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-2", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: `/i/${image.id}/raw`,
            alt: "Image",
            className: "w-full h-24 object-cover rounded-md"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-medium truncate", children: /* @__PURE__ */ jsx("a", { href: `/i/${image.id}`, children: image.display_name }) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: new Date(image.created_at).toLocaleDateString() })
      ] }) }, image.id);
    }) }),
    /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-6", variant: "outline", children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard/images", children: [
      /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " View All Images"
    ] }) })
  ] }) });
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
const schema$3 = z.object({
  target: z.string({ required_error: "Target ID is required" }).cuid(),
  content: z.string({ required_error: "Comment required" }).min(1)
});
async function action$6({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");
  const user = await getUserBySession(session);
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  Object.assign(payload, params);
  const result = schema$3.safeParse(payload);
  if (!result.success) {
    return json(result.error);
  }
  await prisma.comment.create({
    data: {
      commenter_id: user.id,
      receiver_id: result.data.target,
      content: result.data.content,
      hidden: false,
      flagged: false
    }
  });
  return redirect(`/profile/${params.id}`);
}
async function loader$f({ params }) {
  return redirect(`/profile/${params.id}`);
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  loader: loader$f
}, Symbol.toStringTag, { value: "Module" }));
function Images() {
  return /* @__PURE__ */ jsx(Fragment, {});
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Images
}, Symbol.toStringTag, { value: "Module" }));
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
function Help() {
  const [reportingActiveTab, setReportingActiveTab] = useState("images");
  const [uploadingActiveTab, setUploadingActiveTab] = useState("onsite");
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx("p", { children: "Uploading" }),
    /* @__PURE__ */ jsxs(
      Tabs,
      {
        value: uploadingActiveTab,
        onValueChange: setUploadingActiveTab,
        className: "mt-8",
        children: [
          /* @__PURE__ */ jsxs(TabsList, { children: [
            /* @__PURE__ */ jsx(TabsTrigger, { value: "onsite", children: "On-site" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "sharex", children: "ShareX" })
          ] }),
          /* @__PURE__ */ jsx(TabsContent, { value: "onsite", className: "mt-4", children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "On-Site" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "How to upload images to jays.pics on-site" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: "1. click a funny button" })
          ] }) }),
          /* @__PURE__ */ jsx(TabsContent, { value: "sharex", className: "mt-4", children: /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { children: "ShareX" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "How to set up ShareX to automatically upload to jays.pics" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: "1. do this 2. do that 3. upload images 4. profit?" })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "my-8", children: "Reporting content" }),
    /* @__PURE__ */ jsxs(Tabs, { value: reportingActiveTab, onValueChange: setReportingActiveTab, children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "images", children: "Images" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "comments", children: "Comments" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "images", className: "mt-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Images" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "How to report uploaded images" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: "1. click a funny button" })
      ] }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "comments", className: "mt-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { children: "Comments" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "How to report comments on profile or images" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: "1. do this 2. do that 3. upload images 4. profit?" })
      ] }) })
    ] })
  ] });
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Help
}, Symbol.toStringTag, { value: "Module" }));
const meta$6 = () => {
  return [
    { title: "oEmbed | jays.pics" },
    { name: "description", content: "Administration Dashboard" },
    {
      name: "theme-color",
      content: "#e05cd9"
    }
  ];
};
async function loader$e({ params }) {
  var _a;
  const image = await prisma.image.findFirst({ where: { id: params.id } });
  if (!image) return json({ success: false, message: "Image does not exist" });
  const uploader = await prisma.user.findFirst({
    where: { id: image.uploader_id },
    select: {
      username: true,
      upload_preferences: true,
      space_used: true,
      max_space: true,
      id: true
    }
  });
  const dictionary = {
    "image.name": image == null ? void 0 : image.display_name,
    "image.size_bytes": image == null ? void 0 : image.size,
    "image.size": prettyBytes(image.size),
    "image.created_at": image == null ? void 0 : image.created_at,
    "uploader.name": uploader == null ? void 0 : uploader.username,
    "uploader.storage_used_bytes": uploader == null ? void 0 : uploader.space_used,
    "uploader.storage_used": prettyBytes(uploader.space_used),
    "uploader.total_storage_bytes": uploader == null ? void 0 : uploader.max_space,
    "uploader.total_storage": prettyBytes(uploader.max_space)
  };
  const author = templateReplacer(
    ((_a = uploader == null ? void 0 : uploader.upload_preferences) == null ? void 0 : _a.embed_author) ?? "",
    dictionary
  );
  return json({
    author_name: author,
    author_url: `https://jays.pics/profile/${uploader == null ? void 0 : uploader.id}`,
    provider_name: "Hosted with 🩵 at jays.pics",
    provider_url: "https://jays.pics",
    type: "photo"
  });
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$e,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
async function loader$d() {
  const users = await prisma.user.count();
  const images = await prisma.image.count();
  const bytesUsed = (await prisma.image.findMany({ select: { size: true } })).reduce((acc, val) => acc + val.size, 0);
  const imagesWithoutDeleted = await prisma.image.count({
    where: { deleted_at: null }
  });
  const announcement = await prisma.announcement.findMany({
    select: {
      content: true
    },
    orderBy: {
      created_at: "desc"
    },
    take: 1
  });
  return { users, images, imagesWithoutDeleted, bytesUsed, announcement };
}
function AdminDashboard() {
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Users" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: data.users }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Images" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
          data.imagesWithoutDeleted,
          " (",
          data.images,
          " total)"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Storage" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: prettyBytes(data.bytesUsed) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Announcement" }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Form, { method: "post", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            className: "hidden",
            value: "update_annoucement",
            name: "type"
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            className: "mb-2",
            name: "content",
            defaultValue: data.announcement[0].content
          }
        ),
        /* @__PURE__ */ jsx(Button, { type: "submit", children: "Post" })
      ] }) })
    ] })
  ] });
}
const announcementSchema = z.object({
  content: z.string({ required_error: "Content is required" }).min(1, { message: "Should be atleast one character" }).max(256, { message: "Should be 256 or less characters" })
});
async function action$5({ request }) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  let result;
  const requestType = formData.get("type");
  formData.delete("type");
  if (requestType === "update_annoucement") {
    result = announcementSchema.safeParse(payload);
    if (!result.success) {
      const error = result.error.flatten();
      return {
        payload,
        formErrors: error.formErrors,
        fieldErrors: error.fieldErrors
      };
    }
    await prisma.announcement.create({
      data: {
        content: result.data.content
      }
    });
  }
  return null;
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: AdminDashboard,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
async function loader$c({ request }) {
  const count = await prisma.user.count();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      images: true,
      space_used: true,
      is_admin: true,
      created_at: true,
      donated_urls: true
    }
  });
  return { count, users };
}
function Users$1() {
  useAdminLoader();
  const { count, users } = useLoaderData();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Card, { className: "mt-4", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: "Users" }),
      /* @__PURE__ */ jsxs(CardDescription, { children: [
        "There are ",
        count,
        " users"
      ] })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { className: "w-[100px]", children: "User" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Images Uploaded" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Donated Domains" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Admin" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Date of Creation" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: users.map((user) => {
        return /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsx("a", { href: `/admin/profile/${user.id}`, children: user.username }) }),
          /* @__PURE__ */ jsxs(TableCell, { children: [
            user.images.filter((image) => image.deleted_at === null).length,
            " ",
            "(",
            prettyBytes(user.space_used),
            ", w/ deleted:",
            " ",
            user.images.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: user.donated_urls.length }),
          /* @__PURE__ */ jsx(TableCell, { children: user.is_admin ? "Yes" : "No" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-right", children: new Date(user.created_at).toLocaleDateString() })
        ] });
      }) })
    ] }) })
  ] }) });
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Users$1,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
async function loader$b({ request }) {
  const count = await prisma.log.count();
  const logs = await prisma.log.findMany();
  return { count, logs };
}
function Users() {
  useAdminLoader();
  const { count, logs } = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    " ",
    /* @__PURE__ */ jsxs(Card, { className: "mt-4", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Logs" }),
        /* @__PURE__ */ jsxs(CardDescription, { children: [
          "There are ",
          count,
          " logs"
        ] })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableHead, { className: "max-w-96", children: "Message" }),
          /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Date of Creation" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: logs.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).map((log) => {
          return /* @__PURE__ */ jsxs(TableRow, { children: [
            /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: log.message }),
            /* @__PURE__ */ jsxs(TableCell, { className: "text-right", children: [
              new Date(log.created_at).toLocaleDateString(),
              " @",
              " ",
              new Date(log.created_at).toLocaleTimeString()
            ] })
          ] });
        }) })
      ] }) })
    ] })
  ] });
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Users,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
async function action$4({ params }) {
  const image = await prisma.image.findFirst({
    where: { id: params.id },
    select: { uploader: true, id: true, size: true }
  });
  await prisma.image.delete({ where: { id: params.id } });
  const user = await prisma.user.findFirst({
    where: {
      id: image == null ? void 0 : image.uploader.id
    }
  });
  await prisma.user.update({
    where: { id: user.id },
    data: {
      space_used: user.space_used - image.size
    }
  });
  del(`${image == null ? void 0 : image.uploader.id}/${image == null ? void 0 : image.id}`);
  return redirect("/dashboard/images");
}
async function loader$a({ params }) {
  const image = await prisma.image.findFirst({
    where: { id: params.id },
    select: { uploader: true, id: true, size: true }
  });
  await prisma.image.delete({ where: { id: params.id } });
  const user = await prisma.user.findFirst({
    where: {
      id: image == null ? void 0 : image.uploader.id
    }
  });
  await prisma.user.update({
    where: { id: user.id },
    data: {
      space_used: user.space_used - image.size
    }
  });
  del(`${image == null ? void 0 : image.uploader.id}/${image == null ? void 0 : image.id}`);
  return redirect("/dashboard/images");
}
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
async function loader$9() {
  return json({
    success: true,
    data: {
      "image.name": "Gets the display name of the image",
      "image.size_bytes": "Gets the images size in bytes",
      "image.size": "Gets the human-readable image size",
      "image.created_at": "Gets the date the image was created on",
      "uploader.name": "Gets the uploader's username",
      "uploader.storage_used_bytes": "Gets the uploader's storage used",
      "uploader.storage_used": "Gets the human-readable uploader's storage used",
      "uploader.total_storage_bytes": "Gets the uploader's total storage capacity",
      "uploader.total_storage": "Gets the human-readable uploader's total storage capacity"
    }
  });
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
async function loader$8({ request, params }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (params.id === "me") return redirect(`/profile/${session.get("userID")}`);
  const id = params.id ?? session.get("userID");
  const user = await getUserByID(id);
  const referrals = await getAllReferrals(user.referrer_profile.id);
  if (!user) return redirect(`/profile/${session.get("userID")}`);
  const images = await prisma.image.findMany({ where: { uploader_id: id } });
  return { user, referrals, images };
}
function Profile() {
  const { user, referrals, images } = useLoaderData();
  const [activeTab, setActiveTab] = useState("images");
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx(Card, { className: "mb-8", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4", children: [
      /* @__PURE__ */ jsxs(Avatar, { className: "h-24 w-24", children: [
        /* @__PURE__ */ jsx(
          AvatarImage,
          {
            src: `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`,
            alt: user.username
          }
        ),
        /* @__PURE__ */ jsx(AvatarFallback, { children: user.username.slice(0, 2).toUpperCase() })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center sm:text-left", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: user.username }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx(CalendarIcon, { className: "mr-1 inline-block h-4 w-4" }),
          "Joined ",
          new Date(user.created_at).toLocaleDateString()
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", children: JSON.parse(user.badges).map((badge) => /* @__PURE__ */ jsx(Badge, { className: "mr-2", children: badge.text })) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Total Images" }),
          /* @__PURE__ */ jsx(ImageIcon, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: images.length }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Referrals" }),
          /* @__PURE__ */ jsx(UserIcon, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: referrals.length }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "mt-8", children: [
      /* @__PURE__ */ jsxs(TabsList, { children: [
        /* @__PURE__ */ jsx(TabsTrigger, { value: "images", children: "Images" }),
        /* @__PURE__ */ jsx(TabsTrigger, { value: "about", children: "About" })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { value: "images", className: "mt-4", children: /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: images.map((image) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-2", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: `/i/${image.id}/raw`,
            alt: "Image",
            className: "aspect-square w-full rounded-md object-cover"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-2 truncate text-sm font-medium", children: /* @__PURE__ */ jsx("a", { href: `/i/${image.id}`, children: image.display_name }) }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
          new Date(image.created_at).toLocaleDateString(),
          " at",
          " ",
          new Date(image.created_at).toLocaleTimeString()
        ] })
      ] }) }, image.id)) }) }),
      /* @__PURE__ */ jsx(TabsContent, { value: "about", className: "mt-4", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { children: [
            "About ",
            user.username
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "More information about this user" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("p", { children: [
            "This user has been a member since",
            " ",
            new Date(user.created_at).toLocaleDateString(),
            "."
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2", children: [
            "They have uploaded ",
            images.length,
            " images and have",
            " ",
            referrals.length,
            " referral(s)."
          ] }),
          /* @__PURE__ */ jsxs(Form, { method: "POST", action: "/profile/comment", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "target",
                name: "target",
                type: "text",
                value: user.id,
                required: true,
                className: "hidden"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "content",
                name: "content",
                type: "text",
                placeholder: "Comment",
                required: true
              }
            ),
            /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", children: "Comment" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Profile,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const meta$5 = () => {
  return [
    { title: "Image | jays.pics" },
    { name: "description", content: "Administration Dashboard" },
    {
      name: "theme-color",
      content: "#e05cd9"
    }
  ];
};
async function loader$7({ request, params }) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });
  if (!image) return json({ success: false, message: "Image does not exist" });
  const user = await prisma.user.findFirst({
    where: { id: image.uploader_id }
  });
  try {
    const s3Image = await get(`${user.id}/${image.id}`);
    return new Response(s3Image, {
      headers: {
        "Content-Type": image.type,
        "Cache-Control": "public, immutable, no-transform, s-maxage=31536000, max-age=31536000"
      }
    });
  } catch {
  }
  return null;
}
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$7,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
const schema$2 = z.object({
  username: z.string({ required_error: "Username is required" }).regex(/^[a-z0-9_]+$/gim, "Invalid username").min(3, { message: "Must be 3 or more characters" }).max(20, { message: "Must be 20 or less characters" }),
  password: z.string({ required_error: "Password is required" }).min(8, { message: "Must be 8 or more characters" }).max(256, { message: "Must be 256 or less characters" }).regex(
    /([!?&-_]+)/g,
    "Insecure password - Please add one (or more) of (!, ?, &, - or _)"
  ).regex(
    /([0-9]+)/g,
    "Insecure password - Please add one (or more) digit (0-9)"
  ),
  referralCode: z.string({ required_error: "Referral Code is required" }).uuid("Must be a valid referral code")
});
function Register() {
  const actionData = useActionData();
  return /* @__PURE__ */ jsxs(Form, { className: "space-y-4", method: "post", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Username" }),
      /* @__PURE__ */ jsx(Input, { id: "username", name: "username", placeholder: "jeepies", required: true }),
      /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.username })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "password",
          name: "password",
          type: "password",
          placeholder: "*********",
          required: true
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.password })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "referralCode", children: "Referral Code" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "referralCode",
          name: "referralCode",
          placeholder: "JX7s...",
          required: true
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.referralCode })
    ] }),
    /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", children: "Sign Up" }),
    /* @__PURE__ */ jsxs("p", { className: "mt-4 text-center text-sm", children: [
      "Already have an account?",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/login",
          className: "ml-1 text-primary hover:underline focus:outline-none",
          children: "Log in"
        }
      )
    ] })
  ] });
}
async function action$3({ request }) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const result = schema$2.safeParse(payload);
  if (!result.success) {
    const error = result.error.flatten();
    return {
      payload,
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors
    };
  }
  prisma.user.findFirst({ where: { username: result.data.username } }).then((user2) => {
    if (user2 !== null)
      return {
        payload,
        formErrors: [],
        fieldErrors: {
          username: "This username already exists",
          password: "",
          referralCode: ""
        }
      };
  });
  const referrer = await prisma.referrerProfile.findFirst({
    where: { referral_code: result.data.referralCode }
  });
  if (referrer === null) {
    return {
      payload,
      formErrors: [],
      fieldErrors: {
        username: "",
        password: "",
        referralCode: "This referral code is invalid"
      }
    };
  }
  const referralsAlreadyUsed = (await prisma.referral.findMany({ where: { referrer_id: referrer.id } })).length;
  if (referralsAlreadyUsed === referrer.referral_limit) {
    return {
      payload,
      formErrors: [],
      fieldErrors: {
        username: "",
        password: "",
        referralCode: "This referral code has been used too many times"
      }
    };
  }
  const hashedPassword = bcrypt.hashSync(result.data.password, 10);
  const count = await prisma.user.count();
  let badges;
  if (count < 100) {
    badges = JSON.stringify([
      { name: "user", text: "User" },
      { name: "early", text: "Early" }
    ]);
  }
  const user = await prisma.user.create({
    data: {
      username: result.data.username,
      password: hashedPassword,
      referrer_profile: {
        create: {}
      },
      upload_preferences: {
        create: {}
      },
      last_login_at: /* @__PURE__ */ new Date(),
      badges
    }
  });
  await prisma.referral.create({
    data: {
      referred_id: user.id,
      referrer_id: referrer.id
    }
  });
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userID", user.id);
  return redirect("/dashboard/index", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: Register
}, Symbol.toStringTag, { value: "Module" }));
async function loader$6({ params }) {
  const user = await prisma.user.findFirst({ where: { id: params.id } });
  if (!user) {
    return json({
      success: false,
      message: "Invalid user"
    });
  }
  const config = {
    Version: "16.1.0",
    Name: "jays.pics",
    DestinationType: "ImageUploader, FileUploader",
    RequestMethod: "POST",
    Parameters: {
      upload_key: user.upload_key
    },
    Body: "MultipartFormData",
    FileFormName: "image",
    RequestURL: "https://jays.pics/upload",
    URL: "{json:url}",
    ErrorMessage: "{json:message}"
  };
  return new Response(JSON.stringify(config), {
    headers: {
      "Content-Disposition": `attachment; filename="${user.username}.sxcu"`,
      "Content-Type": "application/json"
    }
  });
}
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const schema$1 = z.object({
  username: z.string({ required_error: "Username is required" }).min(3, "Must be 3 or more characters").max(20, "Must be 20 or less characters"),
  password: z.string({ required_error: "Password is required" }).min(8, "Must be 8 or more characters").max(256, "Must be 256 or less characters")
});
function Login() {
  const actionData = useActionData();
  return /* @__PURE__ */ jsxs(Form, { className: "space-y-4", method: "post", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Username" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "username",
          name: "username",
          type: "text",
          placeholder: "Username",
          required: true
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.username })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "password",
          name: "password",
          type: "password",
          placeholder: "Password",
          required: true
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "text-red-500 text-sm", children: actionData == null ? void 0 : actionData.fieldErrors.password })
    ] }),
    /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", children: "Login" }),
    /* @__PURE__ */ jsxs("p", { className: "mt-4 text-center text-sm", children: [
      "Don't have an account?",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/register",
          className: "ml-1 text-primary hover:underline focus:outline-none",
          children: "Sign up"
        }
      )
    ] })
  ] });
}
async function action$2({ request }) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const result = schema$1.safeParse(payload);
  if (!result.success) {
    const error = result.error.flatten();
    return {
      payload,
      formErrors: error.formErrors,
      fieldErrors: error.fieldErrors
    };
  }
  if (result.data.username === "system") {
    return {
      payload,
      formErrors: [],
      fieldErrors: {
        username: "Invalid account",
        password: ""
      }
    };
  }
  const user = await prisma.user.findFirst({
    where: { username: result.data.username }
  });
  if (user === null) {
    return {
      payload,
      formErrors: [],
      fieldErrors: {
        username: "This username does not exist",
        password: ""
      }
    };
  }
  if (!await bcrypt.compare(result.data.password, user.password)) {
    return {
      payload,
      formErrors: [],
      fieldErrors: {
        username: "",
        password: "Incorrect password"
      }
    };
  }
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userID", user.id);
  return redirect("/dashboard/index", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
const meta$4 = () => {
  return [
    { title: "Image | jays.pics" },
    { name: "description", content: "Administration Dashboard" },
    {
      name: "theme-color",
      content: "#e05cd9"
    }
  ];
};
async function loader$5({ request, params }) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });
  if (!image) return json({ success: false, message: "Image does not exist" });
  const user = await prisma.user.findFirst({
    where: { id: image.uploader_id }
  });
  try {
    const s3Image = await get(`${user.id}/${image.id}`);
    return new Response(s3Image, {
      headers: {
        "Content-Type": image.type,
        "Cache-Control": "public, immutable, no-transform, s-maxage=31536000, max-age=31536000"
      }
    });
  } catch {
  }
  return null;
}
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$5,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const meta$3 = () => {
  return [
    { title: "jays.pics" },
    { name: "description", content: "Invite-only Image Hosting" }
  ];
};
async function loader$4({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userID")) return redirect$1("/dashboard/index");
  return null;
}
function Index() {
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen items-center justify-center gap-1", children: [
    /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/login", children: "Login" }) }),
    /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/register", children: "Register" }) })
  ] });
}
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$4,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
async function action$1({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
}
async function loader$3({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
}
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const schema = z.object({
  image: z.instanceof(File)
});
const meta$2 = () => {
  return [
    { title: "Upload | jays.pics" },
    { name: "description", content: "Administration Dashboard" },
    {
      name: "theme-color",
      content: "#e05cd9"
    }
  ];
};
async function action({ request }) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);
  const result = schema.safeParse(payload);
  if (!result.success) {
    return json({ success: false, errors: result.error });
  }
  const image = result.data.image;
  const url = new URL(request.url);
  const paramEntries = Object.fromEntries(url.searchParams.entries());
  if (!paramEntries.upload_key)
    return json({
      success: false,
      message: "Upload key is not set"
    });
  const user = await prisma.user.findFirst({
    where: { upload_key: paramEntries.upload_key },
    select: {
      id: true,
      space_used: true,
      max_space: true,
      upload_preferences: true
    }
  });
  if (!user) {
    return json({
      success: false,
      message: "You are not authorised"
    });
  }
  if (!["image/png", "image/gif", "image/jpeg", "image/webp"].includes(image.type)) {
    return json({
      success: false,
      message: "Incorrect file type"
    });
  }
  if (user.space_used + image.size > user.max_space) {
    return json({
      success: false,
      message: "When uploading this image, your allocated space was exceeded."
    });
  }
  const dbImage = await prisma.image.create({
    data: {
      display_name: image.name,
      uploader_id: user.id,
      size: image.size,
      type: image.type
    }
  });
  await prisma.user.update({
    where: { id: user.id },
    data: { space_used: user.space_used + image.size }
  });
  const response = await uploadToS3(
    result.data.image,
    `${user.id}/${dbImage.id}`
  );
  if ((response == null ? void 0 : response.$metadata.httpStatusCode) === 200) {
    const urls = user.upload_preferences.urls;
    let url2;
    if (urls.length === 1) url2 = urls[0];
    else url2 = urls[Math.floor(Math.random() * urls.length)];
    return json({
      success: true,
      url: `https://${url2}/i/${dbImage.id}/`
    });
  }
  return json({
    success: false,
    message: "An unknown error occured."
  });
}
async function loader$2() {
  return redirect("/");
}
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  loader: loader$2,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = () => {
  return [
    { title: "Authorization | jays.pics" },
    { name: "description", content: "Invite-only Image Hosting" }
  ];
};
async function loader$1({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userID")) return redirect$1("/dashboard/index");
  return null;
}
function Auth() {
  const [showEmoji, setShowEmoji] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [hasShownEmoji, setHasShownEmoji] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (!hasShownEmoji) {
      const emojiTimer = setTimeout(() => setShowEmoji(false), 2e3);
      const contentTimer = setTimeout(() => setShowContent(true), 2500);
      setHasShownEmoji(true);
      return () => {
        clearTimeout(emojiTimer);
        clearTimeout(contentTimer);
      };
    } else {
      setShowEmoji(false);
      setShowContent(true);
    }
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md", children: [
    /* @__PURE__ */ jsx(AnimatePresence, { children: showEmoji && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 1 },
        animate: {
          opacity: 1,
          scale: 1,
          rotate: [0, -10, 10, -10, 10, 0]
        },
        exit: { opacity: 0, scale: 0.5, transition: { duration: 0.5 } },
        transition: { duration: 2, ease: "easeInOut" },
        className: "absolute inset-0 flex items-center justify-center text-9xl",
        children: "👋"
      }
    ) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: showContent && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "w-full",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-center mb-6", children: location.pathname.includes("register") ? "Create an Account" : "Log In" }),
          /* @__PURE__ */ jsx(Outlet, {})
        ]
      }
    ) })
  ] }) });
}
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Auth,
  loader: loader$1,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function SidebarGuest({ className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("pb-12 w-64 relative", className), children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "px-3 py-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100", children: "jays.pics" }),
      /* @__PURE__ */ jsx(Separator, { className: "my-4" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          variant: "ghost",
          className: "w-full justify-start text-gray-900 dark:text-gray-100",
          children: /* @__PURE__ */ jsxs(Link, { to: "/", children: [
            /* @__PURE__ */ jsx(Home, { className: "mr-2 h-4 w-4" }),
            "Index"
          ] })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-0 right-0 px-3", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          variant: "ghost",
          className: "w-full justify-start text-gray-900 dark:text-gray-100",
          children: /* @__PURE__ */ jsx(ThemeToggle, {})
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          asChild: true,
          variant: "ghost",
          className: "w-full justify-start text-gray-900 dark:text-gray-100",
          children: /* @__PURE__ */ jsxs(Link, { to: "/login", children: [
            /* @__PURE__ */ jsx(LogIn, { className: "mr-2 h-4 w-4" }),
            "Login"
          ] })
        }
      )
    ] }) })
  ] });
}
async function loader({ request, params }) {
  const image = await prisma.image.findFirst({ where: { id: params.id } });
  if (!image) return redirect("/");
  const uploader = await prisma.user.findFirst({
    where: { id: image.uploader_id },
    select: {
      username: true,
      upload_preferences: true,
      space_used: true,
      max_space: true
    }
  });
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.has("userID") ? await getUserBySession(session) : { id: "", username: "Guest", is_admin: false };
  return { data: { image, uploader }, user };
}
function Image() {
  const { data, user } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen overflow-hidden", children: [
    user.id !== "" ? /* @__PURE__ */ jsx(
      Sidebar,
      {
        user: { username: user.username, is_admin: user.is_admin, notifications: user.notifications },
        className: "border-r"
      }
    ) : /* @__PURE__ */ jsx(SidebarGuest, { className: "border-r" }),
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsx(Card, { className: "w-full h-2/3", children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("img", { src: `/i/${data.image.id}/raw` }) }) }) })
  ] });
}
const meta = ({ data }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  if (!data) return [{ title: `Image | jays.pics ` }];
  const dictionary = {
    "image.name": (_a = data.data.image) == null ? void 0 : _a.display_name,
    "image.size_bytes": (_b = data.data.image) == null ? void 0 : _b.size,
    "image.size": prettyBytes(data.data.image.size),
    "image.created_at": (_c = data.data.image) == null ? void 0 : _c.created_at,
    "uploader.name": (_d = data.data.uploader) == null ? void 0 : _d.username,
    "uploader.storage_used_bytes": (_e = data.data.uploader) == null ? void 0 : _e.space_used,
    "uploader.storage_used": prettyBytes(data.data.uploader.space_used),
    "uploader.total_storage_bytes": (_f = data.data.uploader) == null ? void 0 : _f.max_space,
    "uploader.total_storage": prettyBytes(data.data.uploader.max_space)
  };
  const title = templateReplacer(
    ((_h = (_g = data.data.uploader) == null ? void 0 : _g.upload_preferences) == null ? void 0 : _h.embed_title) ?? "",
    dictionary
  );
  return [
    { title: (_i = data.data.image) == null ? void 0 : _i.display_name },
    { property: "og:title", content: title },
    { property: "og:description", content: "" },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: `https://jays.pics/i/${(_j = data.data.image) == null ? void 0 : _j.id}`
    },
    {
      property: "og:image",
      content: `https://jays.pics/i/${(_k = data.data.image) == null ? void 0 : _k.id}/raw${data.data.image.type === "image/gif" ? ".gif" : ""}`
    },
    {
      name: "theme-color",
      content: (_m = (_l = data.data.uploader) == null ? void 0 : _l.upload_preferences) == null ? void 0 : _m.embed_colour
    },
    {
      tagName: "link",
      type: "application/json+oembed",
      href: `https://jays.pics/i/${data.data.image.id}/oembed.json`
    },
    { name: "twitter:card", content: "summary_large_image" }
  ];
};
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Image,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function Error$1() {
  return /* @__PURE__ */ jsx(Fragment, { children: "404" });
}
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Error$1
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DzUb4j2t.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js", "/assets/components-BwFStQ-X.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-DaSkXNP_.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js", "/assets/components-BwFStQ-X.js"], "css": ["/assets/root-Ciig87H_.css"] }, "routes/_app.dashboard.upload-settings": { "id": "routes/_app.dashboard.upload-settings", "parentId": "routes/_app", "path": "dashboard/upload-settings", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-BUqURzGA.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/card-CEVsoCFj.js", "/assets/_app-BEEOCYaM.js", "/assets/input-DHMy5rOh.js", "/assets/button-DVl6wKDh.js", "/assets/label-Bok1Uajx.js", "/assets/url-data-table-9tPtDM2n.js", "/assets/checkbox-7b-1935D.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/sidebar-B5rxhk5X.js", "/assets/separator-Cu6-nCqS.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/user-DJfuBIeY.js", "/assets/index-CFsilEuh.js", "/assets/index-CxDjNTdQ.js", "/assets/table-CFscRwcK.js", "/assets/index-D3MAovHW.js", "/assets/index-DI2hRbsd.js", "/assets/index-DX9bpRaH.js"], "css": [] }, "routes/_app.dashboard.domain.add": { "id": "routes/_app.dashboard.domain.add", "parentId": "routes/_app", "path": "dashboard/domain/add", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.dashboard.domain.add-CNadHtVi.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/index-browser-Q5hlEJEC.js", "/assets/index-CxDjNTdQ.js", "/assets/button-DVl6wKDh.js", "/assets/card-CEVsoCFj.js", "/assets/input-DHMy5rOh.js", "/assets/components-BwFStQ-X.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/index-CTHubjAk.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_app.dashboard.my-domains": { "id": "routes/_app.dashboard.my-domains", "parentId": "routes/_app", "path": "dashboard/my-domains", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-BaW1OUVO.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/card-CEVsoCFj.js", "/assets/url-data-table-9tPtDM2n.js", "/assets/index-browser-Q5hlEJEC.js", "/assets/checkbox-7b-1935D.js", "/assets/label-Bok1Uajx.js", "/assets/components-BwFStQ-X.js", "/assets/button-DVl6wKDh.js", "/assets/index-CTHubjAk.js", "/assets/table-CFscRwcK.js", "/assets/input-DHMy5rOh.js", "/assets/index-D3MAovHW.js", "/assets/index-DI2hRbsd.js", "/assets/index-DX9bpRaH.js", "/assets/index-BlA7Mg33.js", "/assets/index-De4eUs7t.js", "/assets/index-CxDjNTdQ.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_admin.admin.profile.$id": { "id": "routes/_admin.admin.profile.$id", "parentId": "routes/_admin", "path": "admin/profile/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_admin.admin.profile._id-ZPePYNKf.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/badge-BX5TskpA.js", "/assets/button-DVl6wKDh.js", "/assets/card-CEVsoCFj.js", "/assets/input-DHMy5rOh.js", "/assets/label-Bok1Uajx.js", "/assets/components-BwFStQ-X.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/index-D3MAovHW.js", "/assets/index-DX9bpRaH.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/index-CTHubjAk.js", "/assets/index-CxDjNTdQ.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_app.dashboard.referrals": { "id": "routes/_app.dashboard.referrals", "parentId": "routes/_app", "path": "dashboard/referrals", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.dashboard.referrals--pHDla6s.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/button-DVl6wKDh.js", "/assets/card-CEVsoCFj.js", "/assets/input-DHMy5rOh.js", "/assets/table-CFscRwcK.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_app.dashboard.settings": { "id": "routes/_app.dashboard.settings", "parentId": "routes/_app", "path": "dashboard/settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.dashboard.settings-EDZ-yqB_.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/card-CEVsoCFj.js", "/assets/input-DHMy5rOh.js", "/assets/_app-BEEOCYaM.js", "/assets/index-CTHubjAk.js", "/assets/sidebar-B5rxhk5X.js", "/assets/button-DVl6wKDh.js", "/assets/separator-Cu6-nCqS.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/components-BwFStQ-X.js", "/assets/index-CFsilEuh.js", "/assets/user-DJfuBIeY.js"], "css": [] }, "routes/_app.dashboard.domains": { "id": "routes/_app.dashboard.domains", "parentId": "routes/_app", "path": "dashboard/domains", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-B6eFTnpW.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/card-CEVsoCFj.js", "/assets/url-data-table-9tPtDM2n.js", "/assets/button-DVl6wKDh.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/table-CFscRwcK.js", "/assets/input-DHMy5rOh.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_app.dashboard.images": { "id": "routes/_app.dashboard.images", "parentId": "routes/_app", "path": "dashboard/images", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.dashboard.images-B2Um_bJh.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/button-DVl6wKDh.js", "/assets/card-CEVsoCFj.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_app.dashboard.upload": { "id": "routes/_app.dashboard.upload", "parentId": "routes/_app", "path": "dashboard/upload", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.dashboard.upload-CWL2hmN4.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/components-BwFStQ-X.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_admin.admin.domains": { "id": "routes/_admin.admin.domains", "parentId": "routes/_admin", "path": "admin/domains", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_admin.admin.domains-BgnAgqFW.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/card-CEVsoCFj.js", "/assets/table-CFscRwcK.js", "/assets/_admin-TbWPlviG.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/button-DVl6wKDh.js", "/assets/separator-Cu6-nCqS.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_app.dashboard.index": { "id": "routes/_app.dashboard.index", "parentId": "routes/_app", "path": "dashboard/index", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.dashboard.index-BSN2YsL1.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/button-DVl6wKDh.js", "/assets/card-CEVsoCFj.js", "/assets/index-D3MAovHW.js", "/assets/index-De4eUs7t.js", "/assets/index-CTHubjAk.js", "/assets/index-BuUnCgYx.js", "/assets/components-BwFStQ-X.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_app.profile.comment": { "id": "routes/_app.profile.comment", "parentId": "routes/_app", "path": "profile/comment", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.profile.comment-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_admin.admin.images": { "id": "routes/_admin.admin.images", "parentId": "routes/_admin", "path": "admin/images", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_admin.admin.images-CfUcifHz.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js"], "css": [] }, "routes/_app.dashboard.help": { "id": "routes/_app.dashboard.help", "parentId": "routes/_app", "path": "dashboard/help", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.dashboard.help-BhdgfSYv.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/card-CEVsoCFj.js", "/assets/tabs-Ddn3-yNf.js", "/assets/index-CTHubjAk.js", "/assets/index-DI2hRbsd.js", "/assets/index-DX9bpRaH.js", "/assets/index-BlA7Mg33.js", "/assets/index-D3MAovHW.js", "/assets/index-De4eUs7t.js"], "css": [] }, "routes/i.$id.oembed[.json]": { "id": "routes/i.$id.oembed[.json]", "parentId": "routes/i.$id", "path": "oembed.json", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/i._id.oembed_.json_-bbh5TKxL.js", "imports": [], "css": [] }, "routes/_admin.admin.index": { "id": "routes/_admin.admin.index", "parentId": "routes/_admin", "path": "admin/index", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_admin.admin.index-hPmofZig.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/card-CEVsoCFj.js", "/assets/index-BuUnCgYx.js", "/assets/input-DHMy5rOh.js", "/assets/button-DVl6wKDh.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_admin.admin.users": { "id": "routes/_admin.admin.users", "parentId": "routes/_admin", "path": "admin/users", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_admin.admin.users-B7H7WR4l.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/card-CEVsoCFj.js", "/assets/table-CFscRwcK.js", "/assets/_admin-TbWPlviG.js", "/assets/index-BuUnCgYx.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/button-DVl6wKDh.js", "/assets/separator-Cu6-nCqS.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_admin.admin.logs": { "id": "routes/_admin.admin.logs", "parentId": "routes/_admin", "path": "admin/logs", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_admin.admin.logs-CXvk_w_G.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/card-CEVsoCFj.js", "/assets/table-CFscRwcK.js", "/assets/_admin-TbWPlviG.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/button-DVl6wKDh.js", "/assets/separator-Cu6-nCqS.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_app.i.$id.delete": { "id": "routes/_app.i.$id.delete", "parentId": "routes/_app", "path": "i/:id/delete", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.i._id.delete-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.get-templates": { "id": "routes/api.get-templates", "parentId": "root", "path": "api/get-templates", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.get-templates-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_app.profile.$id": { "id": "routes/_app.profile.$id", "parentId": "routes/_app", "path": "profile/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app.profile._id-CLLvg3l3.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/badge-BX5TskpA.js", "/assets/card-CEVsoCFj.js", "/assets/tabs-Ddn3-yNf.js", "/assets/input-DHMy5rOh.js", "/assets/button-DVl6wKDh.js", "/assets/components-BwFStQ-X.js", "/assets/user-DJfuBIeY.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/index-D3MAovHW.js", "/assets/index-DX9bpRaH.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/index-CTHubjAk.js", "/assets/index-DI2hRbsd.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/i.$id.raw[.gif]": { "id": "routes/i.$id.raw[.gif]", "parentId": "routes/i.$id", "path": "raw.gif", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/i._id.raw_.gif_-CHENbSOG.js", "imports": [], "css": [] }, "routes/_auth.register": { "id": "routes/_auth.register", "parentId": "routes/_auth", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.register-i_dvQo9f.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/input-DHMy5rOh.js", "/assets/button-DVl6wKDh.js", "/assets/label-Bok1Uajx.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/index-CxDjNTdQ.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/api.sharex.$id": { "id": "routes/api.sharex.$id", "parentId": "root", "path": "api/sharex/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.sharex._id-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_auth.login": { "id": "routes/_auth.login", "parentId": "routes/_auth", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.login-CORUpYSW.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/input-DHMy5rOh.js", "/assets/button-DVl6wKDh.js", "/assets/label-Bok1Uajx.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/index-CxDjNTdQ.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/i.$id.raw": { "id": "routes/i.$id.raw", "parentId": "routes/i.$id", "path": "raw", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/i._id.raw-CHENbSOG.js", "imports": [], "css": [] }, "routes/_admin": { "id": "routes/_admin", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_admin-D7r22h70.js", "imports": ["/assets/_admin-TbWPlviG.js", "/assets/jsx-runtime-BMrMXMSG.js", "/assets/button-DVl6wKDh.js", "/assets/index-CTHubjAk.js", "/assets/separator-Cu6-nCqS.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/components-BwFStQ-X.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-DYOdJriX.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/button-DVl6wKDh.js", "/assets/components-BwFStQ-X.js", "/assets/index-CTHubjAk.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/logout": { "id": "routes/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/upload": { "id": "routes/upload", "parentId": "root", "path": "upload", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/upload-DmTghtwf.js", "imports": [], "css": [] }, "routes/_auth": { "id": "routes/_auth", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth-CEmgDdb9.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/i.$id": { "id": "routes/i.$id", "parentId": "root", "path": "i/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/i._id-ClGwdlO8.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js", "/assets/index-CTHubjAk.js", "/assets/index-BuUnCgYx.js", "/assets/sidebar-B5rxhk5X.js", "/assets/button-DVl6wKDh.js", "/assets/separator-Cu6-nCqS.js", "/assets/components-BwFStQ-X.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/card-CEVsoCFj.js", "/assets/user-DJfuBIeY.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/index-CFsilEuh.js"], "css": [] }, "routes/_app": { "id": "routes/_app", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_app-BSCe9nAR.js", "imports": ["/assets/_app-BEEOCYaM.js", "/assets/jsx-runtime-BMrMXMSG.js", "/assets/sidebar-B5rxhk5X.js", "/assets/button-DVl6wKDh.js", "/assets/index-CTHubjAk.js", "/assets/separator-Cu6-nCqS.js", "/assets/createLucideIcon-CKMWKKJc.js", "/assets/index-De4eUs7t.js", "/assets/index-BlA7Mg33.js", "/assets/components-BwFStQ-X.js", "/assets/index-CFsilEuh.js", "/assets/user-DJfuBIeY.js"], "css": [] }, "routes/$": { "id": "routes/$", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_-gM_mZ-cG.js", "imports": ["/assets/jsx-runtime-BMrMXMSG.js"], "css": [] } }, "url": "/assets/manifest-ec958749.js", "version": "ec958749" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "unstable_singleFetch": false, "unstable_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_app.dashboard.upload-settings": {
    id: "routes/_app.dashboard.upload-settings",
    parentId: "routes/_app",
    path: "dashboard/upload-settings",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_app.dashboard.domain.add": {
    id: "routes/_app.dashboard.domain.add",
    parentId: "routes/_app",
    path: "dashboard/domain/add",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_app.dashboard.my-domains": {
    id: "routes/_app.dashboard.my-domains",
    parentId: "routes/_app",
    path: "dashboard/my-domains",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_admin.admin.profile.$id": {
    id: "routes/_admin.admin.profile.$id",
    parentId: "routes/_admin",
    path: "admin/profile/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_app.dashboard.referrals": {
    id: "routes/_app.dashboard.referrals",
    parentId: "routes/_app",
    path: "dashboard/referrals",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_app.dashboard.settings": {
    id: "routes/_app.dashboard.settings",
    parentId: "routes/_app",
    path: "dashboard/settings",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/_app.dashboard.domains": {
    id: "routes/_app.dashboard.domains",
    parentId: "routes/_app",
    path: "dashboard/domains",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/_app.dashboard.images": {
    id: "routes/_app.dashboard.images",
    parentId: "routes/_app",
    path: "dashboard/images",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/_app.dashboard.upload": {
    id: "routes/_app.dashboard.upload",
    parentId: "routes/_app",
    path: "dashboard/upload",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/_admin.admin.domains": {
    id: "routes/_admin.admin.domains",
    parentId: "routes/_admin",
    path: "admin/domains",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/_app.dashboard.index": {
    id: "routes/_app.dashboard.index",
    parentId: "routes/_app",
    path: "dashboard/index",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/_app.profile.comment": {
    id: "routes/_app.profile.comment",
    parentId: "routes/_app",
    path: "profile/comment",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/_admin.admin.images": {
    id: "routes/_admin.admin.images",
    parentId: "routes/_admin",
    path: "admin/images",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/_app.dashboard.help": {
    id: "routes/_app.dashboard.help",
    parentId: "routes/_app",
    path: "dashboard/help",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/i.$id.oembed[.json]": {
    id: "routes/i.$id.oembed[.json]",
    parentId: "routes/i.$id",
    path: "oembed.json",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/_admin.admin.index": {
    id: "routes/_admin.admin.index",
    parentId: "routes/_admin",
    path: "admin/index",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/_admin.admin.users": {
    id: "routes/_admin.admin.users",
    parentId: "routes/_admin",
    path: "admin/users",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/_admin.admin.logs": {
    id: "routes/_admin.admin.logs",
    parentId: "routes/_admin",
    path: "admin/logs",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/_app.i.$id.delete": {
    id: "routes/_app.i.$id.delete",
    parentId: "routes/_app",
    path: "i/:id/delete",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/api.get-templates": {
    id: "routes/api.get-templates",
    parentId: "root",
    path: "api/get-templates",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/_app.profile.$id": {
    id: "routes/_app.profile.$id",
    parentId: "routes/_app",
    path: "profile/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/i.$id.raw[.gif]": {
    id: "routes/i.$id.raw[.gif]",
    parentId: "routes/i.$id",
    path: "raw.gif",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/_auth.register": {
    id: "routes/_auth.register",
    parentId: "routes/_auth",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/api.sharex.$id": {
    id: "routes/api.sharex.$id",
    parentId: "root",
    path: "api/sharex/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/_auth.login": {
    id: "routes/_auth.login",
    parentId: "routes/_auth",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/i.$id.raw": {
    id: "routes/i.$id.raw",
    parentId: "routes/i.$id",
    path: "raw",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "routes/_admin": {
    id: "routes/_admin",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route28
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/upload": {
    id: "routes/upload",
    parentId: "root",
    path: "upload",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/_auth": {
    id: "routes/_auth",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "routes/i.$id": {
    id: "routes/i.$id",
    parentId: "root",
    path: "i/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route32
  },
  "routes/_app": {
    id: "routes/_app",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route33
  },
  "routes/$": {
    id: "routes/$",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route34
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
