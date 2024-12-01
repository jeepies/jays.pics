#!/usr/bin/env bash
docker compose -f docker-compose.yaml -f docker-compose.$1.yaml ${@:2}