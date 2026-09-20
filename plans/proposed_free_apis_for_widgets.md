# Proponowane Darmowe API do Widgetów (E-Ink Info-Panel)

Zestawienie bezpłatnych i niezawodnych interfejsów API, które idealnie nadają się do budowy widgetów na czarno-białym ekranie dashboardu E-Ink (oraz ogólnych paneli informacyjnych).

---

## 1. Pogoda, Środowisko i Astronomia

### ☀️ Open-Meteo
* **Zastosowanie:** Dokładna pogoda, temperatura odczuwalna, opady, wiatr, jakość powietrza, wschód/zachód słońca, fazy księżyca.
* **Darmowy tier:** Całkowicie darmowe do użytku niekomercyjnego (do 10 000 zapytań dziennie).
* **Zalety:** **Brak konieczności klucza API**, obsługa współrzędnych GPS, wyjście JSON, wysoka dokładność dla Polski.
* **Endpoint przykładowy:** 
  `https://api.open-meteo.com/v1/forecast?latitude=52.2297&longitude=21.0122&current_weather=true&hourly=temperature_2m,precipitation`

### 🌬️ GIOŚ (Główny Inspektorat Ochrony Środowiska)
* **Zastosowanie:** Oficjalne stacje pomiarowe jakości powietrza w Polsce (indeksy PM2.5, PM10, NO2, O3).
* **Darmowy tier:** 100% darmowe, publiczne API rządowe.
* **Zalety:** Oficjalne, polskie dane bez limitów zapytań i bez rejestracji.
* **Endpoint:** `https://api.gios.gov.pl/pjp-api/rest/station/findAll`

### 🌙 SunCalc / Sunrise-Sunset API
* **Zastosowanie:** Godziny wschodu, zachodu, zmierzchu cywilnego/nawigacyjnego i długości dnia.
* **Darmowy tier:** Bezpłatne bez klucza API.
* **Endpoint:** `https://api.sunrise-sunset.org/json?lat=52.2297&lng=21.0122&formatted=0`

---

## 2. Kalendarz, Zadania i Produktywność

### 📅 Google Calendar API & Google Tasks API
* **Zastosowanie:** Pobieranie wydarzeń na dziś/nadchodzący tydzień oraz listy zadań (To-Do).
* **Darmowy tier:** Bezpłatne konto Google Cloud (bardzo wysokie limity, wystarczające na całą dobę).
* **Zalety:** Pełna synchronizacja z własnym telefonem/kontem Google.
* **Wymagania:** OAuth2 lub Service Account z tokenem odświeżania.

### ✅ Todoist REST API
* **Zastosowanie:** Pobieranie aktywnych zadań, projektów i terminów.
* **Darmowy tier:** Darmowe API przy korzystaniu z bezpłatnego konta Todoist.
* **Zalety:** Bardzo proste API z użyciem statycznego API Tokena (bez konieczności skomplikowanego przepływu OAuth2).
* **Endpoint:** `https://api.todoist.com/rest/v2/tasks`

### 📝 Notion API
* **Zastosowanie:** Pobieranie bazy danych z Notion (np. nawyków, planów lekcji, projektów, notatek).
* **Darmowy tier:** Darmowe integracje własne (Internal Integrations).
* **Zalety:** Możliwość elastycznego projektowania własnych tabel i widgetów w Notion.

---

## 3. Transport i Komunikacja Miejska

### 🚌 Otwarte Dane Miejskie (np. ZTM Warszawa / MPK Kraków / SDIP Katowice / Wrocław)
* **Zastosowanie:** Odjazdy na żywo z wybranych przystanków, opóźnienia, pozycje pojazdów.
* **Darmowy tier:** Otwarte dane miast (np. `um.warszawa.pl`, `otwartedane.krakow.pl`).
* **Zalety:** Precyzyjne odliczanie "za ile minut przyjedzie autobus/tramwaj".

### 🚆 PKP / Rozkłady Kolejowe (Transport.rest / DB API)
* **Zastosowanie:** Rozkład jazdy pociągów i opóźnienia ze wskazanych stacji kolejowych.
* **Darmowy tier:** Darmowe API społecznościowe (np. `v5.db.transport.rest`).

---

## 4. Finanse, Kryptowaluty i Waluty

### 💱 NBP API (Narodowy Bank Polski)
* **Zastosowanie:** Aktualne średnie kursy walut (EUR, USD, CHF, GBP itp.) oraz tabele A/B/C.
* **Darmowy tier:** 100% darmowe, bez klucza API, oficjalne polskie źródło.
* **Endpoint przykładowy:** `https://api.nbp.pl/api/exchangerates/rates/a/eur/?format=json`

### 🪙 CoinGecko API / Coinbase Public API
* **Zastosowanie:** Kursy kryptowalut (BTC, ETH, SOL) oraz 24h zmiany procentowe.
* **Darmowy tier:** CoinGecko Demo API (do 30 zapytań/min bezpłatnie).
* **Endpoint przykładowy:** `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=pln,usd`

---

## 5. Wiadomości, RSS i Informacje

### 📰 Kanały RSS / Atom (rss-parser)
* **Zastosowanie:** Paski z nagłówkami wiadomości ze świata, kraju lub technologii (np. TVN24, RMF24, Niebezpiecznik, SpidersWeb, BBC).
* **Darmowy tier:** Bezpłatne i ogólnodostępne w sieci.
* **Zalety:** Brak limitów API, prosty odczyt przez bibliotekę Node.js `rss-parser`.

### 💻 Hacker News Firebase API
* **Zastosowanie:** Najpopularniejsze artykuły ze świata IT i nowinek technologicznych.
* **Darmowy tier:** Darmowe oficjalne API od Y Combinator.
* **Endpoint:** `https://hacker-news.firebaseio.com/v0/topstories.json`

---

## 6. Ciekawostki, Inspiracja i Humor

### 💬 Quotable API / ZenQuotes API
* **Zastosowanie:** Cytat dnia (filozoficzny, motywacyjny, naukowy) do wyświetlania na dole ekranu.
* **Darmowy tier:** Darmowe bez klucza API.
* **Endpoint:** `https://api.quotable.io/random`

### 📅 Imieniny i Kalendarz Świąt API
* **Zastosowanie:** Wyświetlanie informacji kogo są dzisiaj imieniny oraz czy dzisiaj jest dzień wolny/święto w Polsce.
* **Darmowy tier:** Darmowe bezpłatne endpointy JSON.

### 📚 Wikipedia API / Wydarzyło się dzisiaj
* **Zastosowanie:** Wzmianka historyczna "Dzisiaj w historii" lub "Artykuł dnia".
* **Darmowy tier:** Darmowe API Wikimedia.
* **Endpoint:** `https://pl.wikipedia.org/api/rest_v1/feed/featured/YYYY/MM/DD`

---

## 7. Smart Home i Monitorowanie Sieci

### 🏠 Home Assistant REST / WebSocket API
* **Zastosowanie:** Pobieranie temperatur z czujników domowych, stanu oświetlenia, zużycia prądu.
* **Darmowy tier:** Własna instancja domowa (Long-Lived Access Token).

### 🛡️ Pi-hole API / AdGuard Home API
* **Zastosowanie:** Statystyki sieci domowej (liczba zablokowanych reklam, udział procentowy, zapytania DNS).
* **Endpoint przykładowy (Pi-hole):** `http://pi.hole/admin/api.php?summary`

---

## 💡 Rekomendowany zestaw widgetów na E-Ink Dashboard v1

1. **Header:** Zegar, Data, Imieniny, Wschód/Zachód Słońca.
2. **Pogoda (Sekcja Lewa):** Open-Meteo + Jakość Powietrza z GIOŚ.
3. **Kalendarz & Zadania (Sekcja Prawa):** Google Calendar / Todoist.
4. **Dolny Pasek (Bottom Bar):** Kursy Walut (NBP) + Cytat Dnia / Nagłówki z RSS.
