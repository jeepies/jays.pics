import concurrently from "concurrently";
import 'dotenv/config'

concurrently(
  [
    {
      command: "npm run dev",
      name: "server",
    },
    {
        command: "npx graphile-worker",
        name: "worker",
        env: {
            DATABASE_URL: process.env.DATABASE_URL,
        }
    },
  ],
  {
    restartTries: 3,
  }
);