# jays.pics

## Table of Contents
- [Introduction](#introduction)
- [Development](#development)
- [Deployment](#deployment)
- [Styling](#styling)
- [Contributing](#contributing)
- [License](#license)

## Introduction

jays.pics is an invite-only image hosting service built using Remix and AWS. The main goal of this project is to provide a secure and reliable platform for hosting images with restricted access.

## Setup
Refer to the `.example.env` on setting up the `.env` file

## Development

To set up the development environment, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/jeepies/jays.pics.git
    cd jays.pics
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Run the development server:
    ```sh
    npm run dev
    ```

## Deployment

To deploy the application, follow these steps:

1. Build the app for production:
    ```sh
    npm run build
    ```

2. Run the app in production mode:
    ```sh
    npm start
    ```

3. Deploy the output of `npm run build` which includes:
    - `build/server`
    - `build/client`

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling. You can customize the styles or use any other CSS framework as per your preference.

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
