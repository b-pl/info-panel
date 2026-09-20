export interface WeatherData {
    temp: number;
    windSpeed: number;
    humidity: number;
    rain: number;
    pressure: number;
    stationName: string;
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