# E-Ink Dashboard – Architektura i Plan Wdrożenia

Kompletna specyfikacja i plan architektoniczny systemu wyświetlającego spersonalizowany dashboard na czytniku Nook z ekranem E-Ink, zasilanym przez serwer na platformie **Google Cloud Platform (Cloud Run)** w modelu hybrydowym.

---

## 1. Architektura Systemu (Google Cloud + Hybrydowy Klient)

### Serwer Backend (Google Cloud Run)
* **Środowisko:** Node.js + TypeScript uruchamiane jako kontener w bezserwerowej usłudze **Google Cloud Run**.
* **Model rozliczeniowy:** Optymalizacja pod **GCP Free Tier** (skalowanie do 0 instancji, limit 2 mln żądań/mc oraz 1 GB darmowego transferu wyjściowego Egress).
* **Endpointy serwera:**
  * `GET /` – Serwuje lekką stronę HTML wraz z lokalnym skryptem JS i arkuszem CSS.
  * `GET /api/dashboard.png` – Wywołuje silnik Canvas (`@napi-rs/canvas`), pobiera dane zewnętrzne, generuje czarno-białe tło z danymi i zwraca obraz PNG (wycinając pusty prostokąt w miejscu zarezerwowanym na zegar).
* **Harmonogram i Buforowanie:** Pobieranie danych z zewnętrznych API (pogoda, kalendarz, transport) co 15 minut z wykorzystaniem pamięci podręcznej w kontenerze.

### Klient (Nook z ekranem E-Ink)
* **Środowisko:** Zrootowany system Android.
* **Oprogramowanie:** Przeglądarka w trybie pełnoekranowym (np. *Fully Kiosk Browser* lub własna aplikacja WebView).
* **Architektura Hybrydowa (Hybrid Refresh):**
  * **Tło (Obraz z GCP):** Element `<img>` pobierany co 15 minut z endpointu `/api/dashboard.png` z mechanizmem *Cache-Busting* (`?t=timestamp`). Zużycie transferu: $\approx 200\text{ MB / miesiąc}$ (mieści się w limicie 1 GB GCP Egress).
  * **Zegar (Lokalny Overlay HTML/CSS):** Warstwa tekstowa z godziną pozycjonowana bezwzględnie w CSS (`position: absolute`) w miejscu zarezerwowanym na płótnie Canvas. Odświeżana lokalnie przez JavaScript (`setInterval` z `new Date()`) co 1 minutę.

---

## 2. Zestaw Danych na Dashboardzie

### Czas i Kalendarz
* **Data i godzina (Lokalnie w HTML):** Aktualny czas i data odświeżane co minutę po stronie klienta.
* **Wskaźnik ostatniej aktualizacji (Na obrazie z GCP):** Informacja na tle PNG o czasie wygenerowania danych z serwera (np. `Odświeżono dane: 14:15`).
* **Wschód i zachód słońca:** Dokładne godziny wschodu, zachodu oraz zmierzchu (np. via SunCalc lub API pogodowe).

### Pogoda i Środowisko (Generowane w GCP)
* **Pogoda:** Aktualna temperatura, temperatura odczuwalna, ikona stanu (słońce/deszcz/chmury) oraz prognoza na najbliższe godziny (**OpenWeatherMap** / **wttr.in**).
* **Jakość powietrza:** Indeks PM2.5 / PM10 dla wybranej lokalizacji (**GIOŚ** / **Airly**).

### Organizacja i Zadaniówki (Generowane w GCP)
* **Zadania / Kalendarz:** Nadchodzące wydarzenia i listy zadań z oficjalnych API (**Google Tasks / Google Calendar**).

### Transport i Inspiracja (Generowane w GCP)
* **Odjazdy komunikacji miejskiej:** Odliczanie czasu do najbliższych odjazdów z wybranego przystanku (API zbiorkomu lub rozkłady GTFS).
* **Cytat dnia:** Krótki motywacyjny lub filozoficzny tekst (**Ninja Quotes** / **ZenQuotes**).

---

## 3. Dobre Praktyki i Wytyczne Techniczne

1. **Optymalizacja Limitów GCP Free Tier:**
   * Odświeżanie tła PNG z serwera ściśle co 15 minut chroni limit transferu wyjściowego (Egress max 1 GB/mc).
   * Obrazek kompresowany do palety monochromatycznej lub niskiej skali szarości, aby waga pliku nie przekraczała $50\text{--}100\text{ KB}$.

2. **Dopasowanie Współrzędnych (Canvas $\leftrightarrow$ CSS):**
   * Koordynaty pustego prostokąta rysowanego po stronie serwera w Canvas muszą odpowiadać wartościom `top`, `left`, `width`, `height` elementu zegara w CSS.

3. **Obsługa Błędów i Odporność na Brak Połączenia (Offline Handling):**
   * W skrypcie JS na Nooku obsługa zdarzenia `onerror` dla obrazka: w przypadku utraty Wi-Fi zegar kontynuuje działanie lokalnie, dodając wizualny wskaźnik braku połączenia (np. ikonę ⚠️).

4. **Kontrast i Czytelność E-Ink:**
   * Wykorzystanie wysokiego kontrastu (1-bitowe lub 4-bitowe kolory), ostrych wektorowych ikon i czarnych czcionek na białym tle pod zegar w HTML.