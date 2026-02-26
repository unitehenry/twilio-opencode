#!/usr/bin/env bash
bash scripts/install.sh

docker build \
  --tag twilio-opencode .
