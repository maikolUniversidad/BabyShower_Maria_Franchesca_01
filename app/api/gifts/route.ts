import { NextResponse } from 'next/server';
import { getGifts } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const gifts = await getGifts();
        return NextResponse.json(gifts);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch gifts' }, { status: 500 });
    }
}
