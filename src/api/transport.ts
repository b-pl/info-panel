import type {TramDepartureData} from '../types/api.js';

const BASE_URL = 'https://www.zditm.szczecin.pl/api/v2/departure-boards';
const STOP_ID = '16311';

interface ZditmLine {
    number: string;
}

// destination
interface ZditmHeadsign {
    short: string
}

interface ZditmTrip {
    headsign: ZditmHeadsign;
}

interface ZditmDepartureTime {
    scheduled: string;
    estimated: string | null;
    real_time: boolean;
    canceled: boolean;
}

interface ZditmVehicle {
    model: string;
}

interface ZditmDepartureItem {
    line: ZditmLine;
    trip: ZditmTrip;
    departure_time: ZditmDepartureTime;
    vehicle: ZditmVehicle | null;
}

interface ZditmResponse {
    data: {
        departures: ZditmDepartureItem[];
    }
}

export const fetchDepartures = async (stopId: string = STOP_ID): Promise<TramDepartureData[] | null> => {
    try {
        const response = await fetch(`${BASE_URL}/${stopId}`);
        if (!response.ok) {
            throw new Error(`Błąd HTTP Zditm: ${response.status} ${response.statusText}`);
        }
        const rawData: ZditmResponse = await response.json();
        const departures: ZditmDepartureItem[] = rawData.data.departures;

        return departures.map((item) => ({
            line: item.line.number,
            destination: item.trip.headsign.short,
            scheduledDeparture: item.departure_time.scheduled,
            estimatedDeparture: item.departure_time.estimated ?? null,
            realTime: item.departure_time.real_time,
            canceled: item.departure_time.canceled,
            tramModel: item.vehicle?.model ?? null
        }));

    } catch (error) {
        console.error('Błąd podczas pobierania danych Zditm:', (error as Error).message);
        return null;
    }
}