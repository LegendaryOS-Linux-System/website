# LegendaryOS website

Statyczna strona promująca LegendaryOS, napisana w **czystym HackerScript** (`use <mode:website>`) —
w repozytorium nie ma ani jednego pliku `.html`, `.css` ani `.ts`. Wygląd i działanie są takie same
jak w poprzedniej wersji (HTML + CSS + TypeScript).

## Struktura

| Plik | Rola |
|---|---|
| `src/main.hcs` | strona główna: cała struktura DOM, kliknięcia kart pobierania, animacja `reveal`, meta/favicon |
| `src/changelog.hcs` | podstrona `/changelog/` |
| `src/styles.hcs` | cały arkusz stylów jako stringi HackerScript (`page_css`) |
| `src/ui.hcs` | wspólne pomocniki (`mk`, `lnk`, `brand`, `head_meta`, …) nad mostkiem DOM |
| `scripts/build-site.sh` | buduje obie strony do `dist/` |
| `scripts/get-hackerc.sh` | dostarcza kompilator `hackerc` obsługujący `mode:website` |
| `Bit.hk` | manifest projektu; komenda `bit site` |

`dist/` (`index.html` + `app.js`, `changelog/…`) to wynik kompilacji, nie źródło — jest w `.gitignore`.

## Budowanie lokalnie

```bash
BIT_HACKERC=/ścieżka/do/hackerc bit site          # => dist/
bash scripts/get-hackerc.sh .tools                # zdobywa hackerc (.tools/hackerc)
python3 -m http.server -d dist                    # podgląd
```

## CI

`.github/workflows/build.yml` pobiera `bit` (v0.2) i `hackerc` (v0.5), buduje stronę komendą
`bit site` i publikuje `dist/` na GitHub Pages. Jeśli wydanie `hackerc` v0.5 nie istnieje albo nie
obsługuje `mode:website`, kompilator jest budowany ze źródeł HackerScript.

## Uwagi techniczne

- Tryb `website` generuje jedną stronę na plik wejściowy, więc changelog to osobne wejście
  (`dist/changelog/`). Szkielet `index.html` tworzy kompilator — to jego wynik, nie nasz plik.
- Meta (`description`, `theme-color`), favicon i style są dodawane z kodu po załadowaniu skryptu,
  a nie wpisane w statyczny HTML. Przeglądarki i Google (wykonuje JS) widzą je normalnie; proste
  boty bez JS nie zobaczą opisu strony.
- Linki między stronami są względne (`changelog/`, `../`), więc działają na własnej domenie i pod
  `/<repozytorium>/`.
- Animacja `reveal` używa `scroll`/`resize` zamiast `IntersectionObserver` (kompilator gubi `new`
  przed obiektami przeglądarki); próg widoczności 12% jak w oryginale.
