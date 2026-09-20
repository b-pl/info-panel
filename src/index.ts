import {fetchWeather} from './api/weather.js';
import {fetchAirQuality} from './api/airQuality.js';
import {fetchSunriseSunset} from './api/sun.js';

const weatherData = await fetchWeather();
console.log(weatherData);

const airQualityData = await fetchAirQuality();
console.log(airQualityData);

const sunData = await fetchSunriseSunset();
console.log(sunData)