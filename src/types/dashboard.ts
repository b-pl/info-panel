import type {AirQualityData, HourlyForecastItem, SunriseData, TramDepartureData, WeatherData} from './api.js';
import {calendar_v3} from 'googleapis';

export interface DashboardData {
    weather: WeatherData | null;
    forecast: HourlyForecastItem[] | null;
    airQuality: AirQualityData | null;
    sun: SunriseData | null;
    departures: TramDepartureData[] | null;
    calendar: calendar_v3.Schema$Event[] | null;
    updatedAt: string;
}