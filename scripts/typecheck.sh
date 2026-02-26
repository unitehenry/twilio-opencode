#!/usr/bin/env bash
bash scripts/version.sh

npx tsc --allowImportingTsExtensions --noEmit --target ES2022 --module NodeNext *.ts
