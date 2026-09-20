import type {SunriseData} from '../types/api.js';

const BASE_URL: string = 'https://api.sunrise-sunset.org/json';
const LAT: string = `52.2297`;
const LNG: string = `21.0122`;

export const fetchSunriseSunset = async (lat: string = LAT, lng: string = LNG): Promise<SunriseData | null> => {
    try {
        const response = await fetch(`${BASE_URL}?lat=${lat}&lng=${lng}&formatted=0`);
        if (!response.ok) {
            throw new Error(`Błąd HTTP API: ${response.status} ${response.statusText}`);
        }
        const rawData = (await response.json()) as { results: SunriseData; status: string };

        // Opcjonalne sprawdzenie statusu z odpowiedzi API
        if (rawData.status !== 'OK') {
            throw new Error(`API zwróciło status: ${rawData.status}`);
        }

        return rawData.results;
    } catch (error) {
        console.error('Błąd podczas pobierania informacji o słońcu:', (error as Error).message);
        return null;
    }
}