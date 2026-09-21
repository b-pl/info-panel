process.loadEnvFile();
import { google } from 'googleapis';
import fs from 'fs/promises';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const TOKEN_PATH = './config/tokens.json';

export async function getCalendarEvents() {
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

    // Wczytujemy zapisane tokeny
    const tokenData = await fs.readFile(TOKEN_PATH, 'utf-8');
    const tokens = JSON.parse(tokenData);
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Pobranie najbliższych wydarzeń z głównego kalendarza (primary)
    const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return response.data.items;
}