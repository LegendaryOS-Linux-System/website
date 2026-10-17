#!/usr/bin/env bash
# Dostarcza binarke `hackerc` zdolna do `use <mode:website>`.
#
# 1. Pobiera ja z HACKERC_URL (domyslnie: release v0.5).
# 2. Sprawdza (probe), czy ta binarka naprawde umie zbudowac strone. Release
#    v0.4 i starsze generuja crate Rust zamiast index.html + app.js, a adres
#    wydania, ktorego nie ma (404), tez konczy sie porazka.
# 3. Gdy nie umie / nie istnieje - buduje hackerc ze zrodel HackerScript tym
#    samym lancuchem bootstrapu co ich build.yml:
#        stage0 (release v0.4)  ->  transpiluje hackerc/cmd/main.hcs  ->  cargo build
#
# uzycie: scripts/get-hackerc.sh [katalog]     (domyslnie .tools; wynik: <katalog>/hackerc)
set -euo pipefail

DEST="$(mkdir -p "${1:-.tools}" && cd "${1:-.tools}" && pwd)"
BIN="$DEST/hackerc"

REL="https://github.com/HackerOS-Linux-System/HackerScript/releases/download"
HACKERC_URL="${HACKERC_URL:-$REL/v0.5/hackerc}"
STAGE0_URL="${STAGE0_URL:-$REL/v0.4/hackerc}"
SRC_REPO="${HACKERSCRIPT_REPO:-https://github.com/HackerOS-Linux-System/HackerScript}"

# true, gdy `$1 build` z `use <mode:website>` daje index.html + app.js
supports_website() {
  local bin="$1" tmp rc=0
  [ -x "$bin" ] || return 1
  tmp="$(mktemp -d)"
  cat > "$tmp/probe.hcs" <<'HCS'
use <mode:website>

fun main() [
    page_title("probe")
    child(app_root(), "p", "ok")
]
HCS
  "$bin" build "$tmp/probe.hcs" -o "$tmp/out" > /dev/null 2>&1 || rc=$?
  if [ "$rc" -eq 0 ] && [ -s "$tmp/out/index.html" ] && [ -s "$tmp/out/app.js" ]; then
    rm -rf "$tmp"; return 0
  fi
  rm -rf "$tmp"; return 1
}

# 0. binarka z cache
if supports_website "$BIN"; then
  echo "get-hackerc: uzywam istniejacej binarki: $BIN ($("$BIN" --version 2>&1 | head -1))"
  exit 0
fi

# 1. wydanie
echo "get-hackerc: pobieram $HACKERC_URL"
if curl -L --fail --silent --show-error -o "$BIN" "$HACKERC_URL"; then
  chmod +x "$BIN"
  if supports_website "$BIN"; then
    echo "get-hackerc: OK, wydanie obsluguje mode:website ($("$BIN" --version 2>&1 | head -1))"
    exit 0
  fi
  echo "get-hackerc: pobrana binarka ($("$BIN" --version 2>&1 | head -1)) NIE obsluguje mode:website - buduje ze zrodel"
else
  echo "get-hackerc: nie udalo sie pobrac $HACKERC_URL (brak wydania?) - buduje ze zrodel"
fi
rm -f "$BIN"

# 2. bootstrap ze zrodel
command -v cargo > /dev/null || { echo "get-hackerc: potrzebny cargo (Rust) do budowy ze zrodel" >&2; exit 1; }
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "get-hackerc: stage0 <- $STAGE0_URL"
curl -L --fail --silent --show-error -o "$WORK/stage0" "$STAGE0_URL"
chmod +x "$WORK/stage0"

echo "get-hackerc: zrodla <- $SRC_REPO"
git clone --depth 1 --quiet "$SRC_REPO" "$WORK/src"
( cd "$WORK/src" && git log -1 --format='get-hackerc: HackerScript %h %s' )

echo "get-hackerc: stage0 transpiluje hackerc/cmd/main.hcs -> crate Rust"
( cd "$WORK/src" && "$WORK/stage0" build hackerc/cmd/main.hcs -o "$WORK/crate" --crate-name hackerc > /dev/null )

echo "get-hackerc: cargo build --release (kilka minut)"
( cd "$WORK/crate" \
  && CARGO_PROFILE_RELEASE_LTO=false CARGO_PROFILE_RELEASE_CODEGEN_UNITS=16 \
     CARGO_TERM_COLOR=never cargo build --release --quiet 2>&1 | grep -E '^(error|Error)' || true )

cp "$WORK/crate/target/release/hackerc" "$BIN"
chmod +x "$BIN"

supports_website "$BIN" || { echo "get-hackerc: zbudowany hackerc nie obsluguje mode:website" >&2; exit 1; }
echo "get-hackerc: gotowe: $BIN ($("$BIN" --version 2>&1 | head -1))"
