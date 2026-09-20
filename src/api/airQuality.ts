import type { AirQualityData } from '../types/api.js';

const BASE_URL = `https://api.gios.gov.pl/pjp-api/v1/rest/aqindex/getIndex`;
const STATION_ID = `989`;

export interface GiosAqIndex {
    "Wartość indeksu": number | null;
    "Nazwa kategorii indeksu": string | null;
}

export interface GiosAirQualityResponse {
    AqIndex: GiosAqIndex;
}

export const fetchAirQuality = async (stationId: string = STATION_ID): Promise<AirQualityData | null> => {
    try {
        const response = await fetch(`${BASE_URL}/${stationId}`);
        if (!response.ok) {
            throw new Error(`Błąd HTTP GIOŚ: ${response.status} ${response.statusText}`);
        }
        const rawData: GiosAirQualityResponse = await response.json();

        return {
            indexValue: rawData.AqIndex["Wartość indeksu"] ?? null,
            categoryName: rawData.AqIndex["Nazwa kategorii indeksu"] ?? null,
        };
    } catch (error) {
        console.error('Błąd podczas pobierania jakości powietrza:', (error as Error).message);
        return null;
    }
};
