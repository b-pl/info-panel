export interface WeatherData {
    temp: number;
    windSpeed: number;
    humidity: number;
    rain: number;
    pressure: number;
    stationName: string;
}

export interface HourlyForecastItem {
    time: string;
    temp: number;
    rain: number;
    rainProbability: number;
}

export interface AirQualityData {
    indexValue: number | null;
    categoryName: string | null;
}

export interface SunriseData {
    sunrise: string;
    sunset: string;
    day_length: number;
}

export interface TramDepartureData {
    line: string;
    destination: string;
    scheduledDeparture: string;
    estimatedDeparture: string | null;
    realTime: boolean;
    canceled: boolean;
    tramModel: string | null;
}