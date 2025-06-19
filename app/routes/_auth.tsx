import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { redirectIfUser } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Authorization | jays.pics" },
    { name: "description", content: "Invite-only Image Hosting" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.pathname === "/verify" || url.pathname === "/verify/resend") {
    return null;
  }
  return redirectIfUser(request);
}

export default function Authorization() {
  const [showEmojiOverlay, setShowEmojiOverlay] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("hasSeenAuthEmoji") !== "true") {
      setShowEmojiOverlay(true);
      sessionStorage.setItem("hasSeenAuthEmoji", "true");
      const timer = setTimeout(() => {
        setShowEmojiOverlay(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background dark">
      <div className="relative w-full max-w-md dark">
        <Outlet />

        <AnimatePresence>
          {showEmojiOverlay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: [0, -10, 10, -10, 10, 0],
              }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center text-9xl bg-background dark z-10"
            >
              👋
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
