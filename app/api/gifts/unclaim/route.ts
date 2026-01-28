import { NextResponse } from 'next/server';
import { unclaimGift } from '@/lib/googleSheets';
import { z } from 'zod';

const unclaimSchema = z.object({
    gift_id: z.string(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = unclaimSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        const { gift_id } = result.data;
        await unclaimGift(gift_id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Error al liberar el regalo' }, { status: 500 });
    }
}
