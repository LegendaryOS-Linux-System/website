/**
 * LegendaryOS Changelog Data
 * Dodaj nowe wydania na początku tablicy RELEASES.
 * Strona automatycznie je wyrenderuje.
 */

window.LEGENDARY_RELEASES = [
  {
    version: "0.1.0",
    codename: "Phoenix",
    date: "2026-05-14",
    status: "alpha",          // "stable" | "beta" | "alpha"
    summary: "Pierwsze publiczne wydanie alfa LegendaryOS. Podstawowa infrastruktura systemu oparta na Fedorze 44 i mechanizmie bootc.",
    changes: [
      {
        category: "System",
        items: [
          "Bazowa dystrybucja oparta na Fedorze 44 z mechanizmem bootc",
          "Immutable root filesystem — partycja / montowana tylko do odczytu",
          "Obsługa atomowych aktualizacji przez obrazy OCI",
          "Wbudowany mechanizm transakcyjnego rollbacku przez GRUB",
          "Trzy edycje: KDE Plasma 6, Blue (HackerOS DE), Cosmic DE"
        ]
      },
      {
        category: "Instalator",
        items: [
          "Instalator Anaconda dostosowany do LegendaryOS",
          "Obsługa Secure Boot przez podpisane obrazy jądra",
          "Automatyczna konfiguracja Flatpak po instalacji"
        ]
      },
      {
        category: "Narzędzia",
        items: [
          "Wbudowana obsługa Toolbox i Distrobox",
          "Podman jako domyślny silnik kontenerowy",
          "Rejestr obrazów: ghcr.io/LegendaryOS/LegendaryOS"
        ]
      },
      {
        category: "Dokumentacja",
        items: [
          "Pierwsza wersja strony dokumentacji",
          "Przewodnik po bootc i immutable Linux",
          "Sekcja instalacji z podziałem na edycje"
        ]
      }
    ],
    known_bugs: []
  }
];
