import { NextResponse } from 'next/server';
import { getMessages } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const messages = await getMessages();
        return NextResponse.json(messages);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
