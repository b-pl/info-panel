try { process.loadEnvFile(); } catch (e) {}
import {calendar_v3, google} from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const fetchCalendarEvents = async (): Promise<calendar_v3.Schema$Event[] | null> => {
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

    try {
        const tokens = JSON.parse(process.env.GOOGLE_TOKENS as string);
        oauth2Client.setCredentials(tokens);

        const calendar = google.calendar({version: 'v3', auth: oauth2Client});

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        return response.data.items ?? [];
    } catch (error) {
        console.error('Błąd podczas pobierania danych Google Calendar:', (error as Error).message);
        return null;
    }
}