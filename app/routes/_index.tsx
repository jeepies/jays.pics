import { Progress } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import {
  ChevronRight,
  Database,
  FileImage,
  Globe,
  Link2,
  MessageSquare,
  User,
  Zap,
} from "lucide-react";
import prettyBytes from "pretty-bytes";
import { FaGithub } from "react-icons/fa";

import uploadIllustration from "~/assets/uploadIllustration.svg";
import Hero from "~/components/hero";
import { Navbar } from "~/components/navbar";
import AnimatedGradientText from "~/components/ui/animated-gradient-text";
import { Button } from "~/components/ui/button";
import FlickeringGrid from "~/components/ui/flickering-grid";
import { cn } from "~/lib/utils";
import { prisma } from "~/services/database.server";
import { getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userID")) return redirect("/dashboard/index");

  const imageTotal = await prisma.image.count();
  const userTotal = await prisma.user.count();
  const storageTotalBig = (
    await prisma.user.aggregate({
      _sum: {
        space_used: true,
      },
    })
  )._sum.space_used;
  const domainsTotal = await prisma.uRL.count({
    where: {
      progress: Progress.DONE,
    },
  });

  const storageTotal = Number(storageTotalBig ?? 0n);

  return { imageTotal, userTotal, storageTotal, domainsTotal };
}

export default function Index() {
  const { imageTotal, userTotal, storageTotal, domainsTotal } =
    useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen flex-col items-center bg-background dark">
      <Navbar />
      <Hero />
      <footer className="w-full border-t">
        <div className="container mx-auto text-white">
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-muted-foreground">
              © 2025 jays.pics. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/tos"
                className="text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                to="https://github.com/jeepies/jays.pics"
                className="text-muted-foreground hover:text-foreground"
              >
                <FaGithub className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
