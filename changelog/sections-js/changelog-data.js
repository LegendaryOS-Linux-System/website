window.LEGENDARY_RELEASES = [
  {
    version: "0.0.1",
    codename: "",
    date: "2026-05-29",
    status: "alpha",
    summary: "Pierwsze publiczne wydanie alfa LegendaryOS. Podstawowa infrastruktura systemu oparta na Fedorze 44 i mechanizmie bootc/ostree.",
    changes: [
      {
        category: "System",
        items: [
          "Bazowa dystrybucja oparta na Fedorze 44 z mechanizmem bootc",
          "Immutable root filesystem — partycja / montowana tylko do odczytu",
          "Obsługa atomowych aktualizacji przez obrazy OCI",
          "Wbudowany mechanizm transakcyjnego rollbacku przez GRUB",
          "Jedna edycja (narazie): KDE Plasma 6"
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
          "Rejestr obrazów: ghcr.io/legendaryos-linux-system/legendaryos:0.0.1"
        ]
      },
      {
        category: "Dokumentacja",
        items: [
          "Pierwsza wersja strony dokumentacji",
          "Przewodnik po LegendaryOS",
          "Sekcja instalacji z podziałem na edycje"
        ]
      }
    ],
    known_bugs: []
  }
];
