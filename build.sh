#!/usr/bin/env bash
set -euo pipefail

# build.sh - simple userscript concatenator with configurable download/update URLs
# Usage:
#   ./build.sh dev            # dev build (appends -dev.<sha>), uses dev raw URL by default
#   ./build.sh prod           # prod build (uses base version), uses main raw URL by default
#   DOWNLOAD_URL="..." UPDATE_URL="..." ./build.sh dev   # override URLs
#   BRANCH=release/1.2 ./build.sh prod                  # override branch used for default raw URL

MODE="${1:-dev}"                # dev or prod
SRC_DIR="src"
CORE="${SRC_DIR}/core.js"
STYLES="${SRC_DIR}/styles.js"
OUT_DIR="dist"
OUT_FILE="${OUT_DIR}/tnt.collection.user.js"
VERSION_FILE="VERSION"
PKG="package.json"

# Try to detect current git branch (used only if BRANCH env var is not set)
GIT_BRANCH=""
if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
fi

# Defaults for raw URLs (can be overridden by env vars DOWNLOAD_URL / UPDATE_URL)
DEFAULT_USER="TheNorthman"
DEFAULT_REPO="tnt.collection"
# Use BRANCH env if provided, else use detected git branch, else fallback to main/dev
DEFAULT_PROD_BRANCH="${BRANCH:-${GIT_BRANCH:-main}}"
DEFAULT_DEV_BRANCH="${BRANCH:-${GIT_BRANCH:-dev}}"

DEFAULT_PROD_RAW="https://raw.githubusercontent.com/${DEFAULT_USER}/${DEFAULT_REPO}/${DEFAULT_PROD_BRANCH}/dist/tnt.collection.user.js"
DEFAULT_DEV_RAW="https://raw.githubusercontent.com/${DEFAULT_USER}/${DEFAULT_REPO}/${DEFAULT_DEV_BRANCH}/dist/tnt.collection.user.js"

# Allow explicit overrides via env
DOWNLOAD_URL="${DOWNLOAD_URL:-}"
UPDATE_URL="${UPDATE_URL:-}"

# Determine base version (VERSION file preferred, else package.json, else 0.0.0)
if [ -f "${VERSION_FILE}" ]; then
  BASE_VERSION="$(tr -d ' \t\n\r' < "${VERSION_FILE}")"
elif [ -f "${PKG}" ]; then
  BASE_VERSION="$(grep -m1 '"version"' "${PKG}" 2>/dev/null | sed -E 's/.*"version"[[:space:]]*:[[:space:]]*"(.*)".*/\1/' || true)"
  BASE_VERSION="${BASE_VERSION:-0.0.0}"
else
  BASE_VERSION="0.0.0"
fi

# Helper to read a numeric devCounter from package.json (falls back to 0)
get_dev_counter() {
  [ ! -f "${PKG}" ] && echo 0 && return

  local candidate
  candidate=$(grep -oE '"devCounter"[[:space:]]*:[[:space:]]*[0-9]+' "${PKG}" | head -n1 | grep -oE '[0-9]+')
  if ! [[ "${candidate}" =~ ^[0-9]+$ ]]; then
    echo 0
  else
    echo "${candidate}"
  fi
}

# Helper to write devCounter to package.json
set_dev_counter() {
  local value="${1:-0}"
  if ! [[ "${value}" =~ ^[0-9]+$ ]]; then
    value=0
  fi

  if [ ! -f "${PKG}" ]; then
    cat > "${PKG}" <<EOF
{
  "name": "tnt.collection",
  "version": "0.0.0",
  "devCounter": ${value}
}
EOF
    return
  fi

  if grep -qE '"devCounter"[[:space:]]*:' "${PKG}"; then
    sed -i -E 's/("devCounter"[[:space:]]*:[[:space:]]*)[0-9]+/\1'"${value}"'/' "${PKG}"
  else
    sed -i -E '/"version"[[:space:]]*:/a \  "devCounter": '"${value}"',' "${PKG}"
  fi
}

# Decide version, name, and default URLs based on mode
if [ "${MODE}" = "dev" ]; then
  DEV_COUNTER="$(get_dev_counter)"
  DEV_COUNTER=$((DEV_COUNTER + 1))
  set_dev_counter "${DEV_COUNTER}"

  VERSION="${BASE_VERSION}-dev.${DEV_COUNTER}"
  SCRIPT_NAME="TNT Collection (dev)"
  # default dev URLs if not overridden
  DOWNLOAD_URL="${DOWNLOAD_URL:-${DEFAULT_DEV_RAW}}"
  UPDATE_URL="${UPDATE_URL:-${DEFAULT_DEV_RAW}}"
else
  VERSION="${BASE_VERSION}"
  SCRIPT_NAME="TNT Collection"
  # reset dev counter when prod builds are created
  set_dev_counter 0
  # default prod URLs if not overridden
  DOWNLOAD_URL="${DOWNLOAD_URL:-${DEFAULT_PROD_RAW}}"
  UPDATE_URL="${UPDATE_URL:-${DEFAULT_PROD_RAW}}"
fi

# Ensure source files exist
if [ ! -f "${CORE}" ]; then
  echo "ERROR: missing ${CORE}. Copy your script into ${CORE} first." >&2
  exit 1
fi
if [ ! -f "${STYLES}" ]; then
  echo "ERROR: missing ${STYLES}. Copy your styles into ${STYLES} first." >&2
  exit 1
fi

mkdir -p "${OUT_DIR}"

# Metadata header (edit fields as needed)
METADATA=$(cat <<EOF
// ==UserScript==
// @name         ${SCRIPT_NAME}
// @version      ${VERSION}
// @namespace    https://github.com/${DEFAULT_USER}/${DEFAULT_REPO}
// @author       Ronny
// @description  Ikariam TNT Collection Tools
// @license      MIT
// @include      http*s*.ikariam.*/*
// @exclude      http*support*.ikariam.*/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @downloadURL  ${DOWNLOAD_URL}
// @updateURL    ${UPDATE_URL}
// @homepageURL  https://github.com/${DEFAULT_USER}/${DEFAULT_REPO}
// @supportURL   https://github.com/${DEFAULT_USER}/${DEFAULT_REPO}/issues
// ==/UserScript==

EOF
)

# Build: metadata + core + styles
{
  printf "%s\n" "${METADATA}"
  printf "// --- core.js ---\n\n"
  cat "${CORE}"
  printf "\n\n// --- styles.js ---\n\n"
  cat "${STYLES}"
} > "${OUT_FILE}"

# For prod: collapse excessive blank lines (tiny cleanup)
if [ "${MODE}" = "prod" ]; then
  TMP="$(mktemp)"
  awk 'BEGIN{blank=0} { if ($0 ~ /^[[:space:]]*$/) { blank++; if (blank<=2) print $0 } else { blank=0; print $0 } }' "${OUT_FILE}" > "${TMP}"
  mv "${TMP}" "${OUT_FILE}"
fi

echo "Built ${OUT_FILE} (${MODE}) — version ${VERSION}"
echo "  downloadURL: ${DOWNLOAD_URL}"
echo "  updateURL:   ${UPDATE_URL}"