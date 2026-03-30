#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-dev}"   # dev or prod

# Resolve paths relative to this script
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC_DIR="${ROOT_DIR}/src/modules"
OUT_DIR="${ROOT_DIR}/dist"
OUT_FILE="${OUT_DIR}/tnt.collection.user.js"
PKG="${ROOT_DIR}/package.json"
VERSION_FILE="${ROOT_DIR}/VERSION"

mkdir -p "${OUT_DIR}"

# Escape CSS for safe GM_addStyle injection
escape_css() {
  sed 's/\\/\\\\/g; s/`/\\`/g'
}

# Read base version
if [ -f "${VERSION_FILE}" ]; then
  BASE_VERSION="$(tr -d ' \t\n\r' < "${VERSION_FILE}")"
else
  BASE_VERSION="$(jq -r '.version' "${PKG}")"
fi

# Dev counter helpers
get_dev_counter() {
  jq -r '.devCounter // 0' "${PKG}"
}

set_dev_counter() {
  jq ".devCounter = $1" "${PKG}" > "${PKG}.tmp" && mv "${PKG}.tmp" "${PKG}"
}

# Mode-specific version and name
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

# Build URLs
DEFAULT_USER="TheNorthman"
DEFAULT_REPO="tnt.collection"

BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo dev)}"
RAW_URL="https://raw.githubusercontent.com/${DEFAULT_USER}/${DEFAULT_REPO}/${BRANCH}/dist/tnt.collection.user.js"

DOWNLOAD_URL="${DOWNLOAD_URL:-${RAW_URL}}"
UPDATE_URL="${UPDATE_URL:-${RAW_URL}}"

# Userscript metadata from package.json
US_NAMESPACE=$(jq -r '.userscript.namespace' "${PKG}")
US_DESCRIPTION=$(jq -r '.description' "${PKG}")
US_HOMEPAGE=$(jq -r '.homepage' "${PKG}")
US_SUPPORT=$(jq -r '.bugs.url' "${PKG}")

US_INCLUDE=$(jq -r '.userscript.include[]?' "${PKG}")
US_EXCLUDE=$(jq -r '.userscript.exclude[]?' "${PKG}")
US_REQUIRE=$(jq -r '.userscript.require[]?' "${PKG}")
US_GRANT=$(jq -r '.userscript.grant[]?' "${PKG}")

# Write metadata header
{
  printf "// ==UserScript==\n"
  printf "// @name         %s\n" "${SCRIPT_NAME}"
  printf "// @version      %s\n" "${VERSION}"
  printf "// @namespace    %s\n" "${US_NAMESPACE}"
  printf "// @author       Ronny\n"
  printf "// @description  %s\n" "${US_DESCRIPTION}"
  printf "// @license      MIT\n"

  for inc in ${US_INCLUDE}; do
    printf "// @include      %s\n" "${inc}"
  done

  for exc in ${US_EXCLUDE}; do
    printf "// @exclude      %s\n" "${exc}"
  done

  for req in ${US_REQUIRE}; do
    printf "// @require      %s\n" "${req}"
  done

  for gr in ${US_GRANT}; do
    printf "// @grant        %s\n" "${gr}"
  done

  printf "// @downloadURL  %s\n" "${DOWNLOAD_URL}"
  printf "// @updateURL    %s\n" "${UPDATE_URL}"
  printf "// @homepageURL  %s\n" "${US_HOMEPAGE}"
  printf "// @supportURL   %s\n" "${US_SUPPORT}"
  printf "// ==/UserScript==\n\n"
} > "${OUT_FILE}"

###############################################
#  JS COLLECTION
###############################################

SORTED_MODULES=$(jq -r '
  .modules
  | to_entries
  | map({name: .key, order: (.value.order // 5000)})
  | sort_by(.order)
  | .[].name
' "${PKG}")

for module in ${SORTED_MODULES}; do
  ENABLED=$(jq -r ".modules.\"${module}\".${MODE}.enabled // true" "${PKG}")
  [ "${ENABLED}" != "true" ] && continue

  MODULE_PATH="${SRC_DIR}/${module}"

  # Explicit JS list?
  if jq -e ".modules.\"${module}\".${MODE}.js" "${PKG}" >/dev/null 2>&1; then
    while IFS= read -r rel; do
      FILE="${MODULE_PATH}/${rel}"
      [ -f "${FILE}" ] || continue
      {
        printf "\n\n// --- %s/%s ---\n" "${module}" "$(basename "${FILE}")"
        cat "${FILE}"
      } >> "${OUT_FILE}"
    done < <(jq -r ".modules.\"${module}\".${MODE}.js[]?" "${PKG}")
  else
    # Auto-discover all *.js in module folder
    if [ -d "${MODULE_PATH}" ]; then
      for FILE in "${MODULE_PATH}"/*.js; do
        [ -f "${FILE}" ] || continue
        {
          printf "\n\n// --- %s/%s ---\n" "${module}" "$(basename "${FILE}")"
          cat "${FILE}"
        } >> "${OUT_FILE}"
      done
    fi
  fi
done

###############################################
#  CSS COLLECTION (bulletproof, null-safe)
###############################################

# Reuse CSS_OUTPUT from earlier logic but now at end for final write-out
CSS_OUTPUT=""

# Null-delimited find to avoid whitespace issues
while IFS= read -r -d '' FILE; do
  CSS_OUTPUT+=$'\n'
  CSS_OUTPUT+="$(cat "$FILE")"
done < <(find "$SRC_DIR" -type f -name '*.css' -print0 | sort -z)

ESCAPED_CSS="$(printf '%s' "$CSS_OUTPUT" | escape_css)"

# IMPORTANT: single quotes so backticks are literal
printf 'GM_addStyle(`%s`);\n' "$ESCAPED_CSS" >> "$OUT_FILE"

echo "Built ${OUT_FILE} (${MODE}) version ${VERSION}"
