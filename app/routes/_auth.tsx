import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, redirect, useLocation } from "@remix-run/react";
import { getSession } from "~/services/session.server";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Authorization | jays.pics" },
    { name: "description", content: "Invite-only Image Hosting" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userID")) return redirect("/dashboard/index");
  return null;
}

export default function Authorization() {
  const [shouldShowEmoji, setShouldShowEmoji] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("has_seen_wave") === "true")
      return setShouldShowEmoji(false);

    const animationTimer = setTimeout(() => setShouldShowEmoji(false), 2000);
    return () => {
      clearTimeout(animationTimer);
      localStorage.setItem("has_seen_wave", "true");
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background dark">
      <div className="relative w-full max-w-md dark">
        <AnimatePresence>
          {shouldShowEmoji ? (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: [0, -10, 10, -10, 10, 0],
              }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center text-9xl"
            >
              👋
            </motion.div>
          ) : (
            <Outlet />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
