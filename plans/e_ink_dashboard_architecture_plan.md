# E-Ink Dashboard – Architektura i Plan Wdrożenia

Kompletna specyfikacja i plan architektoniczny systemu wyświetlającego spersonalizowany dashboard na czytniku Nook z ekranem E-Ink, zasilanym przez backend na serwerze VPS.

---

## 1. Architektura Systemu

### Serwer Backend (VPS na Mikr.usie)
* **Środowisko:** Node.js + TypeScript
* **Rola:** Pobieranie danych zewnętrznych, obróbka oraz renderowanie czarno-białego płótna (canvas).
* **Silnik graficzny:** Biblioteka `@napi-rs/canvas` lub `canvas` – generowanie pliku `dashboard.png` (np. rozdzielczość $800 \times 600$) z niskim zużyciem pamięci RAM ($\sim 30\text{--}50\text{ MB}$).
* **Harmonogram (Cron):** Uruchamianie skryptu generującego co $N$ minut (np. co 15 minut) w celu odświeżania pliku obrazu.
* **Serwer plików:** Nginx / Caddy / prosty HTTP server udostępniający wygenerowany plik `dashboard.png` pod publicznym adresem URL.

### Klient (Nook z ekranem E-Ink)
* **Środowisko:** Zrootowany system Android.
* **Rola:** Pobieranie pliku obrazu z serwera i wyświetlanie go na pełnym ekranie.
* **Oprogramowanie:** Dedykowana aplikacja (np. *ElectricSign*, *Fully Kiosk Browser* lub własny prosty wygaszacz/apk) wykonująca pobieranie w stałych odstępach czasu.

---

## 2. Zestaw Danych na Dashboardzie

### Czas i Kalendarz
* **Data i godzina:** Aktualny czas i data wraz ze wskaźnikiem ostatniej odświeżonej wersji (np. `Zaktualizowano: 14:15`).
* **Wschód i zachód słońca:** Dokładne godziny wschodu, zachodu oraz zmierzchu (np. via SunCalc lub z API pogodowego).

### Pogoda i Środowisko
* **Pogoda:** Aktualna temperatura, temperatura odczuwalna, ikona stanu (słońce/deszcz/chmury) oraz prognoza na najbliższe godziny (API: **OpenWeatherMap** lub **wttr.in**).
* **Jakość powietrza:** Indeks PM2.5 / PM10 dla wybranej lokalizacji (API: **GIOŚ** lub **Airly**).

### Organizacja i Zadaniówki
* **Zadania / Kalendarz:** Nadchodzące wydarzenia i listy zadań z oficjalnych API (**Google Tasks / Google Calendar**).opcjonalnie: nieoficjalne `gkeepapi` dla Google Keep lub parser Google Docs.

### Transport i Inspiracja
* **Odjazdy komunikacji miejskiej:** Odliczanie czasu do najbliższych odjazdów z wybranego przystanku (API lokalnego zbiorkomu lub rozkłady GTFS).
* **Cytat dnia:** Krótki motywacyjny lub filozoficzny tekst (API: **Ninja Quotes** lub **ZenQuotes**).

---

## 3. Dobre Praktyki i Wytyczne Techniczne

1. **Skalowanie Szarości i Kontrast (Dither / Monochromatyczność):**
   * Ekrany E-Ink najlepiej prezentują obraz o wysokim kontraście (1-bitowy czarno-biały lub 4-bitowa skala szarości).
   * Należy stosować ostry kontrast dla napisów oraz czarno-białe, wektorowe ikony w formacie PNG z przezroczystym tłem.

2. **Obsługa Błędów i Odporność na Brak Połączenia:**
   * Brak odpowiedzi z API nie może powodować błędu skryptu – należy wyrenderować ostatnie znane dane lub ikonę ostrzegawczą.
   * Wskaźnik `Zaktualizowano: HH:MM` pozwala natychmiastowo zdiagnozować, czy urządzenie pobrało nowy obraz, czy utraciło połączenie Wi-Fi.

3. **Tryb Nocny i Oszczędzanie Energii:**
   * Konfiguracja crona na VPS w godzinach $23:00\text{--}06:00$ w celu wstrzymania odświeżania lub generowania uproszczonego, ciemnego layoutu (tylko zegar i poranna pogoda).

4. **Cachowanie Zapytań (Rate Limiting):**
   * Zapewnienie buforowania zapytań do API posiadających limity (np. pogoda pobierana co 15 minut, cytat dnia raz na 24 godziny).