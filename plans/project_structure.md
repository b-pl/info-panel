# Opis Struktury Katalogów i Plików Projektu Info-Panel

Poniżej znajduje się opis struktury projektu `info-panel` dedykowanego dla czytnika Nook z ekranem E-Ink.

---

```text
info-panel/
├── config/                  # Konfiguracja aplikacji (wymiary ekranu, pozycje widgetów, API keys)
│   ├── index.ts             # Główne zmienne i ładowanie .env (rozdzielczość 800x600, współrzędne)
│   └── layout.ts            # Współrzędne (X, Y, W, H) i układy poszczególnych sekcji
├── src/
│   ├── api/                 # Integracje z zewnętrznymi dostawcami danych (Data Providers)
│   │   ├── airQuality.ts    # Pobieranie jakości powietrza (GIOŚ / Airly)
│   │   ├── calendar.ts      # Pobieranie wydarzeń i zadań (Google Calendar / Google Tasks)
│   │   ├── quotes.ts        # Pobieranie cytatu dnia (Ninja Quotes / ZenQuotes)
│   │   ├── sun.ts           # Obliczanie czasów wschodu i zachodu słońca (SunCalc)
│   │   ├── transport.ts     # Pobieranie rozkładów jazdy / odjazdów GTFS
│   │   └── weather.ts       # Pobieranie pogody (IMGW / OpenWeatherMap)
│   ├── cache/               # Buforowanie i odporność na błędy (Fallback strategy)
│   │   └── cacheManager.ts  # Zapis/odczyt z pamięci lub dysku z czasem ważności (TTL)
│   ├── renderer/            # Generowanie obrazu Canvas (@napi-rs/canvas)
│   │   ├── components/      # Poszczególne widgety rysujące fragmenty płótna
│   │   │   ├── calendarWidget.ts  # Rysowanie widgetu kalendarza i zadań
│   │   │   ├── header.ts          # Rysowanie nagłówka z zegarem, datą i statusem odświeżenia
│   │   │   ├── quoteWidget.ts     # Rysowanie widgetu cytatu dnia
│   │   │   ├── transportWidget.ts # Rysowanie widgetu transportu miejskiego
│   │   │   └── weatherWidget.ts   # Rysowanie widgetu pogody i jakości powietrza
│   │   ├── utils/           # Pomocniki rysowania
│   │   │   ├── drawUtils.ts # Funkcje pomocnicze do rysowania na Canvas (ramki, dither, linie)
│   │   │   └── fonts.ts     # Obsługa rejestracji i ładowania czcionek TTF/OTF
│   │   └── canvas.ts        # Inicjalizacja płótna 800x600 i eksport do `output/dashboard.png`
│   ├── server/              # (Opcjonalnie) Prosty serwer HTTP do udostępniania obrazu
│   │   └── http.ts          # Zwykły serwer plików dla klienta Nook (jeśli brak Nginx/Caddy)
│   ├── types/               # Typy TypeScript
│   │   ├── api.ts           # Interfejsy odpowiedzi z zewnętrznych API
│   │   └── dashboard.ts     # Skonsolidowany obiekt danych dla całego dashboardu
│   └── index.ts             # Główny punkt wejścia (orchestrator: Fetch -> Cache -> Render -> Save)
├── assets/                  # Zasoby statyczne dla ekranu E-Ink
│   ├── fonts/               # Czcionki o wysokiej czytelności (np. Inter, Roboto)
│   └── icons/               # 1-bitowe / czarno-białe ikony PNG z przezroczystym tłem
├── output/                  # Wygenerowany plik `dashboard.png`
├── plans/                   # Dokumentacja i architektura
│   ├── e_ink_dashboard_architecture_plan.md
│   └── project_structure.md
├── .env.example             # Szablon zmiennych środowiskowych
├── package.json             # Konfiguracja zależności npm i skryptów
└── tsconfig.json            # Konfiguracja kompilatora TypeScript
```

---

## Opis Poszczególnych Modułów

### 1. `config/`
* **`config/index.ts`**: Ogólna konfiguracja systemu, stałe globalne (rozdzielczość płótna $800 \times 600$, strefa czasowa, ustawienia API).
* **`config/layout.ts`**: Definicja układu siatki (Grid/Bounding Boxes) na ekranie. Zawiera współrzędne $(X, Y, W, H)$ dla każdego widgetu.

### 2. `src/api/`
Moduły odpowiedzialne wyłącznie za komunikację z zewnętrznymi usługami API:
* **`weather.ts`**: Zapytania do IMGW / OpenWeatherMap.
* **`airQuality.ts`**: Pobieranie wskaźników PM2.5 / PM10 z GIOŚ lub Airly.
* **`calendar.ts`**: Integracja z Google Calendar / Google Tasks.
* **`transport.ts`**: Pobieranie godzin odjazdów komunikacji miejskiej.
* **`quotes.ts`**: Pobieranie losowego cytatu dnia.
* **`sun.ts`**: Obliczanie wschodu/zachodu słońca na podstawie współrzędnych geograficznych.

### 3. `src/cache/`
* **`cacheManager.ts`**: Klasa/zarządca pamięci podręcznej. Odpowiada za zapamiętywanie ostatnich udanych danych w przypadku awarii sieci lub braku odpowiedzi z API (Fallback Strategy).

### 4. `src/renderer/`
Moduły odpowiadające za warstwę wizualną Canvas:
* **`canvas.ts`**: Główny menedżer Canvas. Tworzy płótno, uruchamia rysowanie komponentów i zapisuje wynikowy plik `dashboard.png`.
* **`components/`**: Dedykowane moduły renderujące konkretne sekcje dashboardu:
  * `header.ts`: Zegar, data, wskaźnik "Zaktualizowano: HH:MM".
  * `weatherWidget.ts`: Temperatura, opady, ikony pogodowe.
  * `calendarWidget.ts`: Nadchodzące wydarzenia i listy zadań.
  * `transportWidget.ts`: Lista nadchodzących kursów autobusów/tramwajów.
  * `quoteWidget.ts`: Tekst cytatu z autorem.
* **`utils/`**:
  * `drawUtils.ts`: Pomocnicze funkcje do rysowania tekstu, wyrównywania elementów, podziału linii, ditheringu i czarno-białych ramek.
  * `fonts.ts`: Inicjalizacja oraz rejestracja własnych czcionek wektorowych w `@napi-rs/canvas`.

### 5. `src/types/`
* **`api.ts`**: Interfejsy danych zwracanych z poszczególnych API.
* **`dashboard.ts`**: Główny typ agregujący wszystkie dane potrzebne do wyrenderowania pełnego obrazu.

### 6. `src/server/`
* **`http.ts`**: Opcjonalny serwer HTTP do bezpośredniego serwowania pliku `dashboard.png` pod czytnik Nook, jeśli nie używasz odrębnego serwera Nginx / Caddy.

### 7. `src/index.ts`
* Główny punkt startowy aplikacji (Orchestrator). Pobiera dane z API (przez cache), wywołuje renderowanie i zapisuje obraz do folderu `output/`.
