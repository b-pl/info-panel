import type {WeatherData} from '../types/api.js';

const BASE_URL = `https://danepubliczne.imgw.pl/api/data/synop/station`;
const DEFAULT_STATION = `szczecin`;

interface IMGWResponse {
    stacja: string;
    temperatura: string;
    predkosc_wiatru: string;
    wilgotnosc_wzgledna: string;
    suma_opadu: string;
    cisnienie: string;
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
        console.error('Błąd podczas pobierania pogody:', (error as Error).message);
        // W razie błędu zwracamy null – dzięki temu aplikacja nie padnie,
        // a cache/renderer będzie wiedział, że nie udało się pobrać świeżych danych.
        return null;
    }
}