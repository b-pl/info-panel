import type {HourlyForecastItem, WeatherData} from '../types/api.js';

const BASE_URL = `https://danepubliczne.imgw.pl/api/data/synop/station`;
const DEFAULT_STATION = `szczecin`;
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast?latitude=53.4285&longitude=14.5528&hourly=temperature_2m,precipitation_probability,precipitation,weather_code&timezone=Europe%2FWarsaw&forecast_days=1'

interface IMGWResponse {
    stacja: string;
    temperatura: string;
    predkosc_wiatru: string;
    wilgotnosc_wzgledna: string;
    suma_opadu: string;
    cisnienie: string;
}

// kody WMO weather_code
// 0 = słońce, 1–3 = chmury, 51–67 i 80–82 = deszcz, 71–77 = śnieg
interface OpenMeteoHourly {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
}

interface OpenMeteoResponse {
    hourly: OpenMeteoHourly;
}

export const fetchWeather = async (station: string = DEFAULT_STATION): Promise<WeatherData | null> => {
    try {
        const response = await fetch(`${BASE_URL}/${station}`);
        if (!response.ok) {
            throw new Error(`Błąd HTTP IMGW: ${response.status} ${response.statusText}`);
        }
        const rawData: IMGWResponse = await response.json();

        return {
            stationName: rawData.stacja,
            temp: parseFloat(rawData.temperatura ?? '0'),
            windSpeed: parseFloat(rawData.predkosc_wiatru ?? '0'),
            humidity: parseFloat(rawData.wilgotnosc_wzgledna ?? '0'),
            rain: parseFloat(rawData.suma_opadu ?? '0'),
            pressure: parseFloat(rawData.cisnienie ?? '0'),
        };
    } catch (error) {
        console.error('Błąd podczas pobierania danych IMGW:', (error as Error).message);
        return null;
    }
}

export const fetchForecast = async (): Promise<HourlyForecastItem[] | null> => {
    try {
        const response = await fetch(`${OPEN_METEO_URL}`);
        if (!response.ok) {
            throw new Error(`Błąd HTTP OpenMeteo: ${response.status} ${response.statusText}`);
        }
        const rawData: OpenMeteoResponse = await response.json();

        return rawData.hourly.time.map((item, i) => ({
            time: item,
            temp: rawData.hourly.temperature_2m[i] ?? 0,
            rain: rawData.hourly.precipitation[i] ?? 0,
            rainProbability: rawData.hourly.precipitation_probability[i] ?? 0,
            weather_code: rawData.hourly.weather_code[i] ?? 0,
        }));
    } catch (error) {
        console.error('Błąd podczas pobierania danych OpenMeteo:', (error as Error).message);
        return null;
    }
}