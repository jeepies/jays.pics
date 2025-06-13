#!/usr/bin/env bash

# Docker is required.
# If you're on Windows, you should have Git or WSL installed, otherwise, refer to the next line.
# Run this script - `./start-database.sh`

set -a
source .env

DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
DB_PORT=$(echo "$DATABASE_URL" | awk -F':' '{print $4}' | awk -F'\/' '{print $1}')
DB_NAME=$(echo "$DATABASE_URL" | awk -F'/' '{print $4}')
DB_CONTAINER_NAME="$DB_NAME-postgres"

if ! [ -x "$(command -v docker)" ] && ! [ -x "$(command -v podman)" ]; then
  echo -e "Docker or Podman is not installed. Please install docker or podman and try again.\nDocker install guide: https://docs.docker.com/engine/install/\nPodman install guide: https://podman.io/getting-started/installation"
  exit 1
fi

if [ -x "$(command -v docker)" ]; then
  DOCKER_CMD="docker"
elif [ -x "$(command -v podman)" ]; then
  DOCKER_CMD="podman"
fi

if ! $DOCKER_CMD info > /dev/null 2>&1; then
  echo "$DOCKER_CMD daemon is not running. Please start $DOCKER_CMD and try again."
  exit 1
fi

if command -v nc >/dev/null 2>&1; then
  if command -v nc >/dev/null 2>&1; then
    if nc -z localhost "$DB_PORT" 2>/dev/null; then
      echo "Port $DB_PORT is already in use."
      exit 1
    fi
  elif command -v ncat >/dev/null 2>&1; then
    if ncat -z localhost "$DB_PORT" 2>/dev/null; then
      echo "Port $DB_PORT is already in use."
      exit 1
    fi
  fi
else
  echo "Warning: Unable to check if port $DB_PORT is already in use (netcat not installed)"
  read -p "Do you want to continue anyway? [y/N]: " -r REPLY
  if ! [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborting."
    exit 1
  fi
fi

if [ "$($DOCKER_CMD ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "Database container '$DB_CONTAINER_NAME' already running"
  exit 0
fi

if [ "$($DOCKER_CMD ps -q -a -f name=$DB_CONTAINER_NAME)" ]; then
  $DOCKER_CMD start "$DB_CONTAINER_NAME"
  echo "Existing database container '$DB_CONTAINER_NAME' started"
  exit 0
fi

if [ "$DB_PASSWORD" = "password" ]; then
  echo "You are using the default database password"
  read -p "Should we generate a random password for you? [y/N]: " -r REPLY
  if ! [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Please change the default password in the .env file and try again"
    exit 1
  fi
  DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' "s#:password@#:$DB_PASSWORD@#" .env
  else
    sed -i "s#:password@#:$DB_PASSWORD@#" .env
  fi
fi

$DOCKER_CMD run -d \
  --restart always \
  --name $DB_CONTAINER_NAME \
  -e POSTGRES_USER="postgres" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB="$DB_NAME" \
  -p "$DB_PORT":5432 \
  docker.io/postgres && echo "Database container '$DB_CONTAINER_NAME' was successfully created"