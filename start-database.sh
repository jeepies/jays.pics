#!/usr/bin/env bash

DB_CONTAINER_NAME="jayspics"

if ! [ -x "$(command -v docker)" ]; then
  echo "Docker not installed. Visit https://docs.docker.com/engine/install/"
  exit 1
fi

set -a
source .env

if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "Database container '$DB_CONTAINER_NAME' already running"
elif [ "$(docker ps -q -a -f name=$DB_CONTAINER_NAME)" ]; then
  docker start "$DB_CONTAINER_NAME"
  echo "Started existing database container '$DB_CONTAINER_NAME'"
else
  DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
  DB_PORT=$(echo "$DATABASE_URL" | awk -F':' '{print $4}' | awk -F'/' '{print $1}')

  if [ "$DB_PASSWORD" = "password" ]; then
    read -p "Generate random password? [y/N]: " -r REPLY
    if ! [[ $REPLY =~ ^[Yy]$ ]]; then
      echo "Change default password in .env and retry"
      exit 1
    fi
    DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
    sed -i -e "s#:password@#:$DB_PASSWORD@#" .env
  fi

  docker run -d \
    --name $DB_CONTAINER_NAME \
    -e POSTGRES_USER="postgres" \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB=${DB_CONTAINER_NAME} \
    -p "$DB_PORT":5432 \
    docker.io/postgres && echo "Created database container '$DB_CONTAINER_NAME'"
fi