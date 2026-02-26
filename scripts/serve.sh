#!/usr/bin/env bash
bash scripts/version.sh

node --no-warnings \
  --experimental-transform-types \
  app.ts
