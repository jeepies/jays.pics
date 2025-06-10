import concurrently from "concurrently";
import "dotenv/config";

concurrently(
  [
    {
      command: "npm start",
      name: "server",
    },
    {
      command: "npx graphile-worker",
      name: "worker"
    },
  ],
  {
    restartTries: 3,
  }
);
