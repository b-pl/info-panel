import {fetchForecast, fetchWeather} from './api/weather.js';
import {fetchAirQuality} from './api/airQuality.js';
import {fetchSunriseSunset} from './api/sun.js';
import {fetchCalendarEvents} from './api/calendar.js';
import {fetchDepartures} from './api/transport.js';
import type {DashboardData} from './types/dashboard.js';
import {generateDashboardImage} from './renderer/canvas.js';
import express, {type Express} from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/dashboard.png', async (req, res) => {
    const [weather, forecast, airQuality, sun, departures, calendar] = await Promise.all([
        fetchWeather(),
        fetchForecast(),
        fetchAirQuality(),
        fetchSunriseSunset(),
        fetchDepartures(),
        fetchCalendarEvents()
    ]);

    const dashboardData: DashboardData = {
        weather,
        forecast,
        airQuality,
        sun,
        departures,
        calendar,
        updatedAt: new Date().toLocaleString('pl-PL', {
            dateStyle: 'short',
            timeStyle: 'medium',
            timeZone: 'Europe/Warsaw'
        }),
    }

    const imageBuffer = await generateDashboardImage(dashboardData);
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})