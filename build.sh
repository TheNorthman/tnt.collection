#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-dev}"   # dev or prod
SRC_DIR="src/modules"
OUT_DIR="dist"
OUT_FILE="${OUT_DIR}/tnt.collection.user.js"
PKG="package.json"
VERSION_FILE="VERSION"

mkdir -p "${OUT_DIR}"

# --- Escape CSS for safe GM_addStyle injection ---
escape_css() {
  sed 's/\\/\\\\/g; s/`/\\`/g'
}

# --- Read version ---
if [ -f "${VERSION_FILE}" ]; then
  BASE_VERSION="$(tr -d ' \t\n\r' < "${VERSION_FILE}")"
else
  BASE_VERSION="$(grep -m1 '"version"' "${PKG}" | sed -E 's/.*"version"[[:space:]]*:[[:space:]]*"(.*)".*/\1/')"
fi

# --- Dev counter ---
get_dev_counter() {
  grep -oE '"devCounter"[[:space:]]*:[[:space:]]*[0-9]+' "${PKG}" | grep -oE '[0-9]+' || echo 0
}

set_dev_counter() {
  local value="$1"
  sed -i -E 's/("devCounter"[[:space:]]*:[[:space:]]*)[0-9]+/\1'"${value}"'/' "${PKG}"
}

if [ "${MODE}" = "dev" ]; then
  DEV_COUNTER=$(get_dev_counter)
  DEV_COUNTER=$((DEV_COUNTER + 1))
  set_dev_counter "${DEV_COUNTER}"
  VERSION="${BASE_VERSION}-dev.${DEV_COUNTER}"
  SCRIPT_NAME="TNT Collection (dev)"
else
  VERSION="${BASE_VERSION}"
  SCRIPT_NAME="TNT Collection"
  set_dev_counter 0
fi

# --- Metadata header ---
METADATA=$(cat <<EOF
// ==UserScript==
// @name         ${SCRIPT_NAME}
// @version      ${VERSION}
// @namespace    https://github.com/TheNorthman/tnt.collection
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
// ==/UserScript==

EOF
)

# --- Extract module list from package.json ---
MODULES=$(jq -r '.modules | keys[]' "${PKG}")

# --- Sort modules by order ---
SORTED_MODULES=$(jq -r '
  .modules
  | to_entries
  | map({name: .key, order: (.value.order // 5000)})
  | sort_by(.order)
  | .[].name
' "${PKG}")

JS_OUTPUT=""
CSS_OUTPUT=""

# --- Build modules ---
for module in ${SORTED_MODULES}; do
  ENABLED=$(jq -r ".modules.\"${module}\".${MODE}.enabled // true" "${PKG}")
  [ "${ENABLED}" != "true" ] && continue

  MODULE_PATH="${SRC_DIR}/${module}"

  # JS files
  JS_FILES=$(jq -r ".modules.\"${module}\".${MODE}.js[]? // empty" "${PKG}")
  if [ -z "${JS_FILES}" ]; then
    JS_FILES=$(ls "${MODULE_PATH}"/*.js 2>/dev/null || true)
  else
    JS_FILES=$(printf "%s\n" ${JS_FILES})
  fi

  for f in ${JS_FILES}; do
    FILE="${MODULE_PATH}/${f}"
    [ -f "${FILE}" ] && JS_OUTPUT="${JS_OUTPUT}\n\n// --- ${module}/${f} ---\n$(cat "${FILE}")"
  done

  # CSS files
  CSS_FILES=$(jq -r ".modules.\"${module}\".${MODE}.css[]? // empty" "${PKG}")
  if [ -z "${CSS_FILES}" ]; then
    CSS_FILES=$(ls "${MODULE_PATH}"/*.css 2>/dev/null || true)
  else
    CSS_FILES=$(printf "%s\n" ${CSS_FILES})
  fi

  for f in ${CSS_FILES}; do
    FILE="${MODULE_PATH}/${f}"
    [ -f "${FILE}" ] && CSS_OUTPUT="${CSS_OUTPUT}\n$(cat "${FILE}")"
  done
done

# --- Escape CSS safely ---
ESCAPED_CSS="$(printf "%s" "${CSS_OUTPUT}" | escape_css)"

# --- Write output ---
{
  printf "%s\n" "${METADATA}"
  printf "GM_addStyle(`%s`);\n" "${ESCAPED_CSS}"
  printf "%b\n" "${JS_OUTPUT}"
} > "${OUT_FILE}"

echo "Built ${OUT_FILE} (${MODE}) version ${VERSION}"
