import { NextResponse } from 'next/server';
import { getAdminData } from '@/lib/googleSheets';
import { SheetTab } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    props: { params: Promise<{ tab: string }> }
) {
    const params = await props.params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || request.headers.get('Authorization')?.replace('Bearer ', '');

    if (token !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tab = params.tab;
    // Capitalize first letter to match Enum if needed, or case insensitive check
    const formattedTab = tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase();

    if (!['Gifts', 'RSVP', 'Messages'].includes(formattedTab)) {
        return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
    }

    try {
        const data = await getAdminData(formattedTab as SheetTab);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
