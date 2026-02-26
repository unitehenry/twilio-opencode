#!/usr/bin/env bash

if ! command -v node &> /dev/null; then
  echo "node not installed"
  exit 1
fi

NODE_VERSION=$(node --version)

if [[ $NODE_VERSION == "v22."* ]]; then
  exit 0
else
  echo "node 22 required"
  exit 1
fi
