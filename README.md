# jays.pics

## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [Docker (Database)](#docker-database)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Cronjobs](#cronjobs)
- [Styling](#styling)
- [Contributing](#contributing)
- [License](#license)

## Introduction

jays.pics is an invite-only image hosting service built using Remix and AWS. The main goal of this project is to provide a secure and reliable platform for hosting images with restricted access.

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/jeepies/jays.pics.git
   cd jays.pics
   ```

2. **Install dependencies (with npm):**

   ```sh
   npm install
   ```

3. **Set up your environment variables:**
   - Copy `.example.env` to `.env` and fill in the required values.
   - See [Environment Variables](#environment-variables) for details.

## Docker (Database)

This project uses Docker only for the PostgreSQL database. To start a local Postgres instance:

```sh
docker compose up -d
```

This will start a Postgres 14 container with the credentials specified in your `.env` file. The app itself is not containerized.

## Environment Variables

All required environment variables are documented in `.example.env`. You must copy this file to `.env` and fill in the values for:

- Database (Postgres)
- AWS S3/CloudFront
- Cloudflare
- Website config (BASE_URL, SESSION_SECRET, etc)
- OAuth2 (Discord)

Example:

```sh
cp .example.env .env
# Edit .env with your secrets
```

## Development

1. **Run database migrations and generate Prisma client:**

   ```sh
   npm run setup
   ```

2. **Start the development server:**

   ```sh
   npm run dev
   ```

## Deployment

1. **Build the app for production:**

   ```sh
   npm run build
   ```

2. **Run the app and worker in production:**

   ```sh
   node start.js
   ```

   This will run both the Remix server and the Graphile worker concurrently.

3. **Deploy the output of `npm run build`, which includes:**
   - `build/server`
   - `build/client`

## Cronjobs

Some background tasks are required for domain and verification management. These are implemented as scripts in the `tasks/` directory and should be run via cron. Example crontab (see `crontab` file):

```
*/5 * * * * npm run --silent tasks/checkNameserver.cjs
*/5 * * * * npm run --silent tasks/cleanVerification.cjs
0 0 * * * npm run --silent tasks/cleanDomain.cjs
0 0 * * * npm run --silent tasks/dailyStats.cjs
```

- Make sure `npm` is available in your PATH for cron.
- Adjust paths as needed for your deployment.

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling. You can customize the styles or use any other CSS framework as per your preference.

## Uploading Images

- **On-site:** Use the dashboard's upload button to upload images directly.
- **ShareX:** Go to the Upload Settings page, click "ShareX" to download your config, and import it into ShareX.

## Contributing

We welcome contributions from the community. Here are the steps to get started:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with a descriptive message.
4. Push your changes to your fork.
5. Create a pull request describing your changes.

## Contributors

- [jeepies](https://github.com/jeepies) - Main contributor
- [occorune](https://github.com/occorune)

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---
