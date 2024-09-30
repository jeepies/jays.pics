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

export default function Auth() {
  const [showEmoji, setShowEmoji] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [hasShownEmoji, setHasShownEmoji] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!hasShownEmoji) {
      const emojiTimer = setTimeout(() => setShowEmoji(false), 2000);
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
  }, [hasShownEmoji]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <AnimatePresence>
          {showEmoji && (
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
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                {location.pathname.includes("register")
                  ? "Create an Account"
                  : "Log In"}
              </h2>
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
