#!/usr/bin/env bash
docker compose -f ./docker/docker-compose.yaml -f ./docker/docker-compose.$1.yaml ${@:2}