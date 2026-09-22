import {fetchForecast, fetchWeather} from './api/weather.js';
import {fetchAirQuality} from './api/airQuality.js';
import {fetchSunriseSunset} from './api/sun.js';
import {fetchCalendarEvents} from './api/calendar.js';
import {fetchDepartures} from './api/transport.js';
import type {DashboardData} from './types/dashboard.js';
import {generateDashboardImage} from './renderer/canvas.js';

const [weather, forecast, airQuality, sun, departures, calendar] = await Promise.all([
    fetchWeather(),
    fetchForecast(),
    fetchAirQuality(),
    fetchSunriseSunset(),
    fetchDepartures(),
    fetchCalendarEvents()
]);

// const dashboardData: DashboardData = {
//     weather,
//     forecast,
//     airQuality,
//     sun,
//     departures,
//     calendar,
//     updatedAt: new Date().toLocaleString('pl-PL', {
//         dateStyle: 'short',
//         timeStyle: 'medium',
//         timeZone: 'Europe/Warsaw'
//     }),
// }
//
// console.log(dashboardData);
await generateDashboardImage();