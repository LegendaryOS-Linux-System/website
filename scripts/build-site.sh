#!/usr/bin/env bash
# Buduje strone LegendaryOS: dwa wejscia HackerScript -> dist/ (+ dist/changelog/).
# Kompilator: $BIT_HACKERC (ustawiany przez workflow / bit), inaczej `hackerc` z PATH.
set -euo pipefail
cd "$(dirname "$0")/.."

HACKERC="${BIT_HACKERC:-hackerc}"
OUT="${1:-dist}"

rm -rf "$OUT"

# strona glowna -> dist/index.html + dist/app.js
"$HACKERC" build src/main.hcs -o "$OUT"

# changelog -> dist/changelog/index.html + dist/changelog/app.js
"$HACKERC" build src/changelog.hcs -o "$OUT/changelog"

for f in index.html app.js changelog/index.html changelog/app.js; do
  test -s "$OUT/$f" || { echo "build-site: brak $OUT/$f" >&2; exit 1; }
done
echo "build-site: gotowe -> $OUT/"
