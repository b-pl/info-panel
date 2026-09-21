import {fetchWeather} from './api/weather.js';
import {fetchAirQuality} from './api/airQuality.js';
import {fetchSunriseSunset} from './api/sun.js';
import {getRefreshToken} from './server/auth.js';
import {getCalendarEvents} from './api/calendar.js';
import {fetchDepartures} from './api/transport.js';

// const weatherData = await fetchWeather();
// console.log(weatherData);
//
// const airQualityData = await fetchAirQuality();
// console.log(airQualityData);
//
// const sunData = await fetchSunriseSunset();
// console.log(sunData)

// const calendarData = await getCalendarEvents();
// console.log(calendarData);

// const calendarData = await getCalendarList();
// console.log(JSON.stringify(calendarData.data.items, null, 2));

const departuresData = await fetchDepartures();
console.log(departuresData);