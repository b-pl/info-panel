# Kody Pogodowe WMO (World Meteorological Organization) - Open-Meteo

Poniższa tabela przedstawia zestawienie kodów pogodowych `weather_code` zwracanych przez API Open-Meteo wraz z ich polskim i angielskim opisem, rekomendowanym przypisaniem ikonek oraz dokładnymi nazwami zweryfikowanych plików w bibliotece **Tabler Icons**.

## Zestawienie kodów WMO oraz zweryfikowanych plików Tabler Icons

| Kod WMO | Opis (PL) | Opis (EN) | Rekomendowana Ikonka | Zweryfikowany plik w Tabler Icons (`outline`) |
|---|---|---|---|---|
| **0** | Czyste niebo | Clear sky | Słońce | `sun.svg` |
| **1** | Przeważnie słonecznie | Mainly clear | Słońce | `sun.svg` |
| **2** | Częściowe zachmurzenie | Partly cloudy | Chmura / Słońce | `cloud.svg` (lub `sun.svg`) |
| **3** | Całkowite zachmurzenie | Overcast | Chmura | `cloud.svg` |
| **45** | Mgła | Fog | Mgła | `cloud-fog.svg` |
| **48** | Mgła osadzająca szadź | Depositing rime fog | Mgła | `cloud-fog.svg` |
| **51** | Lekka mżawka | Drizzle: Light | Deszcz | `cloud-rain.svg` |
| **53** | Umiarkowana mżawka | Drizzle: Moderate | Deszcz | `cloud-rain.svg` |
| **55** | Gęsta mżawka | Drizzle: Dense intensity | Deszcz | `cloud-rain.svg` |
| **56** | Lekka marznąca mżawka | Freezing Drizzle: Light | Deszcz / Śnieg | `cloud-rain.svg` |
| **57** | Gęsta marznąca mżawka | Freezing Drizzle: Dense | Deszcz / Śnieg | `cloud-rain.svg` |
| **61** | Słaby deszcz | Rain: Slight | Deszcz | `cloud-rain.svg` |
| **63** | Umiarkowany deszcz | Rain: Moderate | Deszcz | `cloud-rain.svg` |
| **65** | Silny deszcz | Rain: Heavy intensity | Deszcz | `cloud-rain.svg` |
| **66** | Słaby marznący deszcz | Freezing Rain: Light | Deszcz | `cloud-rain.svg` |
| **67** | Silny marznący deszcz | Freezing Rain: Heavy | Deszcz | `cloud-rain.svg` |
| **71** | Słabe opady śniegu | Snow fall: Slight | Śnieg | `cloud-snow.svg` |
| **73** | Umiarkowane opady śniegu | Snow fall: Moderate | Śnieg | `cloud-snow.svg` |
| **75** | Silne opady śniegu | Snow fall: Heavy intensity | Śnieg | `cloud-snow.svg` |
| **77** | Ziarna śnieżne | Snow grains | Śnieg | `cloud-snow.svg` |
| **80** | Słaby przelotny deszcz | Rain showers: Slight | Deszcz | `cloud-rain.svg` |
| **81** | Umiarkowany przelotny deszcz | Rain showers: Moderate | Deszcz | `cloud-rain.svg` |
| **82** | Gwałtowny przelotny deszcz | Rain showers: Violent | Deszcz | `cloud-rain.svg` |
| **85** | Słaby przelotny śnieg | Snow showers: Slight | Śnieg | `cloud-snow.svg` |
| **86** | Silny przelotny śnieg | Snow showers: Heavy | Śnieg | `cloud-snow.svg` |
| **95** | Burza (słaba/umiarkowana) | Thunderstorm: Slight or moderate | Burza | `cloud-storm.svg` |
| **96** | Burza z drobnym gradem | Thunderstorm with slight hail | Burza | `cloud-storm.svg` |
| **99** | Burza z dużym gradem | Thunderstorm with heavy hail | Burza | `cloud-storm.svg` |

---

## Logika Mapowania (Grupowanie Kodów)

Dostępne, zweryfikowane pliki w Tabler Icons to:
- `sun.svg`
- `cloud.svg`
- `cloud-fog.svg`
- `cloud-rain.svg`
- `cloud-snow.svg`
- `cloud-storm.svg`

### Rekomendowane Mapowanie (6 Ikonek)
- **Słońce (`SUN`)** -> `[0, 1]` -> Plik: `sun.svg`
- **Chmura (`CLOUD`)** -> `[2, 3]` -> Plik: `cloud.svg`
- **Mgła (`FOG`)** -> `[45, 48]` -> Plik: `cloud-fog.svg`
- **Deszcz (`RAIN`)** -> `[51..67, 80..82]` -> Plik: `cloud-rain.svg`
- **Śnieg (`SNOW`)** -> `[71..77, 85..86]` -> Plik: `cloud-snow.svg`
- **Burza (`THUNDERSTORM`)** -> `[95..99]` -> Plik: `cloud-storm.svg`
