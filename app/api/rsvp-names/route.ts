import { NextResponse } from 'next/server';
import { getAvailableRSVPNames } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const names = await getAvailableRSVPNames();
        return NextResponse.json(names);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch RSVP names' }, { status: 500 });
    }
}
