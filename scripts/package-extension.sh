#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXTENSION_DIR="${ROOT_DIR}/clipnote_v1.3.1"
VERSION="$(python3 -c 'import json, sys; print(json.load(open(sys.argv[1], encoding="utf-8"))["version"])' "${EXTENSION_DIR}/manifest.json")"
OUTPUT="${ROOT_DIR}/clipnote-v${VERSION}.zip"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TEMP_DIR}"' EXIT

mkdir -p "${TEMP_DIR}/clipnote"
cp -R "${EXTENSION_DIR}/." "${TEMP_DIR}/clipnote/"
find "${TEMP_DIR}" -name '.DS_Store' -delete
(cd "${TEMP_DIR}" && zip -qr "${OUTPUT}" clipnote)

echo "Created ${OUTPUT}"
