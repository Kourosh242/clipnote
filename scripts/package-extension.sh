#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXTENSION_DIR="${ROOT_DIR}/clipnote_v1.3.2"
VERSION="$(python3 -c 'import json, sys; print(json.load(open(sys.argv[1], encoding="utf-8"))["version"])' "${EXTENSION_DIR}/manifest.json")"
OUTPUT="${ROOT_DIR}/clipnote-v${VERSION}.zip"
CHECKSUM_FILE="${OUTPUT}.sha256"
TEMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TEMP_DIR}"' EXIT

echo "📦 Packaging ClipNote v${VERSION}..."
echo "   Source: ${EXTENSION_DIR}"
echo "   Output: ${OUTPUT}"

mkdir -p "${TEMP_DIR}/clipnote"
cp -R "${EXTENSION_DIR}/." "${TEMP_DIR}/clipnote/"
find "${TEMP_DIR}" -name '.DS_Store' -delete
# Remove any stray .git or node_modules if ever copied
find "${TEMP_DIR}" -type d -name ".git" -exec rm -rf {} + 2>/dev/null || true

(cd "${TEMP_DIR}" && zip -qr "${OUTPUT}" clipnote)

# Generate SHA256
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "${OUTPUT}" > "${CHECKSUM_FILE}"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "${OUTPUT}" > "${CHECKSUM_FILE}"
else
  echo "⚠️  sha256sum/shasum not found, skipping checksum"
fi

SIZE=$(du -h "${OUTPUT}" | cut -f1)
echo "✅ Created ${OUTPUT} (${SIZE})"
if [ -f "${CHECKSUM_FILE}" ]; then
  echo "✅ Checksum: $(cat "${CHECKSUM_FILE}")"
  echo "   Saved to ${CHECKSUM_FILE}"
fi

# Verify structure
echo "🔍 Verifying zip structure..."
if unzip -l "${OUTPUT}" | grep -q "clipnote/manifest.json"; then
  echo "✅ Zip contains clipnote/manifest.json — OK"
else
  echo "❌ Zip structure invalid! manifest.json not found at clipnote/manifest.json"
  exit 1
fi

echo ""
echo "📋 Next steps:"
echo "   1. Test: unzip and Load unpacked in chrome://extensions/"
echo "   2. Upload ${OUTPUT} to GitHub Releases as asset"
echo "   3. Use RELEASE.md for release description (FA+EN)"
