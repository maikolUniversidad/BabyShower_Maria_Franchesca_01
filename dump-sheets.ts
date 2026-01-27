import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuth() {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    return new google.auth.GoogleAuth({
        credentials: { client_email: clientEmail, private_key: privateKey },
        scopes: SCOPES,
    });
}

async function dump() {
    try {
        const auth = getAuth();
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client as any });
        const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Gifts!A1:L', // Check A1 to L
        });

        const rows = response.data.values || [];
        console.log('Headers:', rows[0]);
        const giftsWithNotes = rows.slice(1).filter(r => r[3] && r[3].trim() !== '');
        console.log(`Found ${giftsWithNotes.length} gifts with notes.`);
        if (giftsWithNotes.length > 0) {
            console.log('First gift with notes:', giftsWithNotes[0]);
        }

    } catch (error: any) {
        console.error('ERROR:', error.message);
    }
}

dump();
