process.loadEnvFile();
import { google } from 'googleapis';
import http from 'http';
import fs from 'fs/promises';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
const TOKEN_PATH = './config/tokens.json';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

// Zakresy uprawnień (np. tylko odczyt kalendarzy)
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export async function getRefreshToken() {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Wymagane do uzyskania refresh_token!
        prompt: 'consent',     // Wymusza ponowne wygenerowanie refresh_token
        scope: SCOPES,
    });

    console.log('Otwórz ten URL w przeglądarce, aby udzielić zgody:');
    console.log(authUrl);

    // Tworzymy tymczasowy lokalny serwer do przechwycenia kodu powrotnego
    const server = http.createServer(async (req, res) => {
        if (req.url?.startsWith('/oauth2callback')) {
            const urlParams = new URLSearchParams(req.url.split('?')[1]);
            const code = urlParams.get('code');

            if (code) {
                res.end('Autoryzacja zakończona sukcesem! Możesz zamknąć tę kartę.');
                server.close();

                // Wymiana kodu na tokeny (access_token i refresh_token)
                const { tokens } = await oauth2Client.getToken(code);
                await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));
                console.log('Tokeny zostały zapisane w:', TOKEN_PATH);
            }
        }
    });

    server.listen(3000, () => {
        console.log('Czekam na autoryzację na http://localhost:3000/oauth2callback ...');
    });
}