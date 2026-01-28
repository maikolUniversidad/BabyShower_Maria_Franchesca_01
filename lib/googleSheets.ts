import { google } from 'googleapis';
import { Gift, RSVP, Message, SheetTab } from '@/types';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuth() {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
        throw new Error('Missing Google Sheets credentials');
    }

    return new google.auth.GoogleAuth({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
        scopes: SCOPES,
    });
}

async function getSheets() {
    const auth = getAuth();
    const client = await auth.getClient();
    return google.sheets({ version: 'v4', auth: client as any });
}

export async function getGifts(): Promise<Gift[]> {
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Gifts!A2:K', // Extended to K for 'type'
    });

    const rows = response.data.values || [];

    return rows.map((row) => ({
        gift_id: row[0] || '',
        title: row[1] || '',
        store_url: row[2] || '',
        notes: row[3] || '',
        status: (row[4] || 'available') as 'available' | 'claimed' | 'disqualified',
        claimed_by: row[5] || '',
        claimed_phone: row[6] || '',
        claimed_email: row[7] || '',
        claimed_at: row[8] || '',
        image_url: row[9] || '',
        type: (row[10] as 'unique' | 'unlimited') || 'unique',
    }));
}

export async function getMessages(): Promise<Message[]> {
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Messages!A2:C',
    });

    const rows = response.data.values || [];

    return rows.map((row) => ({
        timestamp: row[0],
        name: row[1],
        message: row[2],
    })).reverse();
}

export async function claimGift(giftId: string, data: { name: string; phone?: string; email?: string }): Promise<void> {
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // 1. Get Gift Info
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Gifts!A:K',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === giftId);

    if (rowIndex === -1) {
        throw new Error('Gift not found');
    }

    const row = rows[rowIndex];
    const type = (row[10] as 'unique' | 'unlimited') || 'unique';
    const status = row[4];
    const title = row[1]; // Get title to save in Claims tab

    const realRowIndex = rowIndex + 1;

    // 2. Check availability
    if (type === 'unique' && (status === 'claimed' || status === 'disqualified')) {
        throw new Error('Ya fue seleccionado por otra persona');
    }

    const claimedAt = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    // 3. Save to "Claims" Tab (New central log for ALL claims)
    // Columns: Timestamp, Gift ID, Gift Title, Name, Phone, Email
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Claims!A:F',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    claimedAt,
                    giftId,
                    title,
                    data.name,
                    data.phone,
                    data.email || ''
                ]]
            }
        });
    } catch (e) {
        console.error("Error writing to Claims tab. Ensure it exists.", e);
        // We continue to update Gifts tab if unique, but ideally this should exist.
    }

    // 4. Update Status in Gifts Tab (ONLY if unique)
    if (type === 'unique') {
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Gifts!E${realRowIndex}:I${realRowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    'disqualified',
                    data.name,
                    data.phone || '',
                    data.email || '',
                    claimedAt
                ]]
            }
        });
    }
}

export async function unclaimGift(giftId: string): Promise<void> {
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // 1. Get Gift Info
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Gifts!A:K',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === giftId);

    if (rowIndex === -1) {
        throw new Error('Gift not found');
    }

    const row = rows[rowIndex];
    const type = (row[10] as 'unique' | 'unlimited') || 'unique';
    const realRowIndex = rowIndex + 1;

    // 2. Update Status in Gifts Tab (ONLY if unique)
    if (type === 'unique') {
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Gifts!E${realRowIndex}:I${realRowIndex}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    'available',
                    '',
                    '',
                    '',
                    ''
                ]]
            }
        });
    }
}

export async function addRSVP(data: RSVP): Promise<void> {
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'RSVP!A:G',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[
                data.timestamp,
                data.name,
                data.phone,
                data.email || '',
                data.attending ? 'Yes' : 'No',
                data.guest_count,
                data.notes || ''
            ]]
        }
    });
}

export async function addMessage(data: Message): Promise<void> {
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Messages!A:C',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[
                data.timestamp,
                data.name,
                data.message
            ]]
        }
    });
}


export async function getAdminData(tab: SheetTab) {
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${tab}!A1:Z`,
    });

    return response.data.values || [];
}

export async function getRSVPNames(): Promise<string[]> {
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'RSVP!B2:B', // Column B contains names
    });

    const rows = response.data.values || [];
    return rows.map(row => row[0]).filter(name => name && name.trim() !== '');
}

export async function getAvailableRSVPNames(): Promise<string[]> {
    const sheets = await getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Get all RSVP names
    const rsvpResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'RSVP!B2:B',
    });
    const allNames = (rsvpResponse.data.values || [])
        .map(row => row[0])
        .filter(name => name && name.trim() !== '');

    // Get all claimed names from Gifts sheet
    const giftsResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Gifts!F2:F', // Column F contains claimed_by
    });
    const claimedNames = (giftsResponse.data.values || [])
        .map(row => row[0])
        .filter(name => name && name.trim() !== '');

    // Filter out names that have already claimed gifts
    const claimedNamesSet = new Set(claimedNames);
    return allNames.filter(name => !claimedNamesSet.has(name));
}
