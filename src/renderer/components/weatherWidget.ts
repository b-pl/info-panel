import { loadImage, type SKRSContext2D } from '@napi-rs/canvas';
import path from 'path';
import { LAYOUT } from '../../../config/layout.js';
import type { HourlyForecastItem, WeatherData } from '../../types/api.js';

const CLOUD_ICON = path.resolve(process.cwd(), 'assets/icons/cloud.svg');
const CLOUD_FOG_ICON = path.resolve(process.cwd(), 'assets/icons/cloud-fog.svg');
const CLOUD_RAIN_ICON = path.resolve(process.cwd(), 'assets/icons/cloud-rain.svg');
const CLOUD_SNOW_ICON = path.resolve(process.cwd(), 'assets/icons/cloud-snow.svg');
const CLOUD_STORM_ICON = path.resolve(process.cwd(), 'assets/icons/cloud-storm.svg');
const SUN_ICON = path.resolve(process.cwd(), 'assets/icons/sun.svg');

const getWeatherIcon = (wmoCode: number = 0): string => {
    if (wmoCode === 0 || wmoCode === 1) return SUN_ICON;
    if (wmoCode === 2 || wmoCode === 3) return CLOUD_ICON;
    if (wmoCode === 45 || wmoCode === 48) return CLOUD_FOG_ICON;
    if ((wmoCode >= 51 && wmoCode <= 67) || (wmoCode >= 80 && wmoCode <= 82)) return CLOUD_RAIN_ICON;
    if ((wmoCode >= 71 && wmoCode <= 77) || (wmoCode >= 85 && wmoCode <= 86)) return CLOUD_SNOW_ICON;
    if (wmoCode >= 95 && wmoCode <= 99) return CLOUD_STORM_ICON;

    return CLOUD_ICON;
};

const getCurrentWmoCode = (forecast: HourlyForecastItem[] | undefined): number => {
    if (!forecast) return 0;

    const now = new Date();
    const hours = String(now.getHours());
    const minutes = String(now.getMinutes());
    let needle = undefined;

    if (parseInt(hours) === 23) needle = `23:00`
    else if (parseInt(minutes) < 30) needle = `${hours}:00`.padStart(5, '0');
    else needle = `${parseInt(hours)+1}:00`.padStart(5, '0');

    return forecast.find(f => f.time.includes(`T${needle}`))?.weather_code ?? 0;
}

export async function renderWeatherWidget(
    ctx: SKRSContext2D,
    weather: WeatherData | null,
    forecast: HourlyForecastItem[] | null
): Promise<void> {
    const { x, y, width, height } = LAYOUT.weather;

    ctx.save();

    // Tło widgetu (czysta biel)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);

    // --- SEKCJA 1: AKTUALNA POGODA ---
    // Ikona aktualnej pogody
    const currentIconPath = getWeatherIcon(getCurrentWmoCode(forecast ?? undefined));
    const currentIcon = await loadImage(currentIconPath);
    ctx.drawImage(currentIcon, x + 20, y + 15, 64, 64);

    // Temperatura główna
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 44px "Inter-Bold"';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(weather?.temp ?? 0)}°C`, x + 100, y + 47);

    // Wilgotność i ciśnienie (po prawej)
    ctx.font = '16px "Inter"';
    ctx.textAlign = 'right';
    ctx.fillText(`Wilgotność: ${Math.round(weather?.humidity ?? 0)}%`, x + width - 20, y + 35);
    ctx.fillText(`Ciśnienie: ${Math.round(weather?.pressure ?? 0)} hPa`, x + width - 20, y + 60);

    // Linia rozdzielająca sekcję główną i prognozę
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 95);
    ctx.lineTo(x + width - 10, y + 95);
    ctx.stroke();

    // --- SEKCJA 2: PROGNOZA HOURLY ---
    const targetHours = ['08:00', '11:00', '14:00', '17:00', '20:00', '23:00'];
    const colWidth = width / targetHours.length; // 100px na kolumnę

    for (let i = 0; i < targetHours.length; i++) {
        const hourStr = targetHours[i] ?? '0';
        const item = forecast?.find(f => f.time.includes(`T${hourStr}`)) ?? {
            time: hourStr,
            temp: 15 + i * 2,
            rain: 0,
            rainProbability: 0,
            weather_code: i % 2 === 0 ? 0 : 3
        };

        const colCenterX = x + i * colWidth + colWidth / 2;

        // Godzina
        ctx.font = '14px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText(hourStr, colCenterX, y + 118);

        // Ikona WMO
        const iconPath = getWeatherIcon(item.weather_code);
        const iconImg = await loadImage(iconPath);
        ctx.drawImage(iconImg, colCenterX - 16, y + 132, 32, 32);

        // Temperatura
        ctx.font = 'bold 16px "Inter-Bold"';
        ctx.fillText(`${Math.round(item.temp)}°C`, colCenterX, y + 188);
    }

    ctx.restore();
}
