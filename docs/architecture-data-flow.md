# Architektura i Przepływ Danych (Data Flow) - info-panel

Ten dokument opisuje architekturę przepływu danych oraz podział odpowiedzialności pomiędzy poszczególnymi warstwami w aplikacji `info-panel`.

---

## 1. Ogólny Przepływ Danych (Data Flow)

Aplikacja opiera się na centralnym orkiestratorze danych w `src/index.ts` oraz czystej komunikacji jednokierunkowej:

```text
1. src/index.ts (Orchestrator)
   │
   ├── Pobieranie danych (Promise.all): fetchWeather(), fetchForecast(), fetchDepartures()...
   ├── Agregacja do struktury DashboardData (src/types/dashboard.ts)
   │
   └── Wywołanie: generateDashboardImage(dashboardData)
          │
          └── 2. src/renderer/canvas.ts (Layout Manager)
                 │
                 ├── Inicjalizacja Canvasa 600x800 px i tła
                 ├── renderHeader(ctx, dashboardData.updatedAt)
                 ├── renderWeatherWidget(ctx, dashboardData.weather, dashboardData.forecast)
                 ├── renderTransportWidget(ctx, dashboardData.departures)
                 ├── renderCalendarWidget(ctx, dashboardData.calendar)
                 └── renderFooter(ctx, ...)
```

---

## 2. Podział Odpowiedzialności (Separation of Concerns)

### Warstwa API (`src/api/*.ts`)
* **Odpowiedzialność:** Pobieranie danych z zewnętrznych serwisów (IMGW, Open-Meteo, ZDiTM, Google Calendar).
* **Normalizacja danych:** Konwersja surowych JSON-ów na spójne typy TypeScriptowe (np. `parseFloat(temperatura)`, ustawianie bezpiecznych wartości domyślnych `?? 0`).
* **Zwracane typy:** Czyste dane domenowe (`number`, `string`, `boolean`).

### Warstwa Canvasa (`src/renderer/canvas.ts`)
* **Odpowiedzialność:** Tworzenie i inicjalizacja płótna `@napi-rs/canvas`, czyszczenie tła, eksport finalnego pliku PNG do `output/dashboard.png`.
* **Rola:** Zarządzanie układowi głównemu oraz wywoływanie poszczególnych komponentów widgetowych.

### Warstwa Widgetów (`src/renderer/components/*.ts`)
* **Odpowiedzialność:** Rysowanie konkretnego bloku informacyjnego na płótnie na podstawie przekazanych danych.
* **Formatowanie Prezentacyjne:** Transformacja danych domenowych na postać wizualną (napisy, ikonki).

---

## 3. Formatowanie Danych: Dwuetapowy Podział

| Etap | Miejsce w kodzie | Zakres obowiązków | Przykład |
|---|---|---|---|
| **1. Normalizacja (API)** | `src/api/weather.ts` | Konwersja z JSON na typy TS, obsługa błędów HTTP. | `parseFloat(rawData.temperatura)` |
| **2. Prezentacja (Widget)** | `src/renderer/components/weatherWidget.ts` | Zaokrąglanie, dodawanie jednostek, wybór ikonek, filtrowanie. | `Math.round(temp)` → `"21°C"`, WMO → `sun.svg` |

---

## 4. Formatowanie Prezentacyjne w Widgetach (Helpery per Widget)

Każdy widget zawiera własne funkcje pomocnicze (helpery prezentacyjne) umieszczone w pliku widgetu lub w pliku pomocniczym w tym samym katalogu:

### Przykładowe Helpery dla `weatherWidget.ts`:
* **`getWeatherIcon(wmoCode: number): string`** – Mapowanie numerycznego kodu WMO na ścieżkę do pliku SVG z ikony w `assets/icons/`.
* **`formatTemperature(temp: number): string`** – Zaokrąglanie wartości i doklejanie jednostki (np. `Math.round(21.4)` $\rightarrow$ `"21°C"`).
* **`filterTargetHours(forecast: HourlyForecastItem[]): HourlyForecastItem[]`** – Wybieranie docelowych godzin z prognozy (np. `08:00`, `11:00`, `14:00`, `17:00`, `20:00`, `23:00`).
