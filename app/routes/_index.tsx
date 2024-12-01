import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "jays.pics" },
    { name: "description", content: "V2!! yippie!!" },
    {
      name: "theme-color",
      content: "#474787",
    },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">

    </div>
  );
}