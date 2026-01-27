import { NextResponse } from 'next/server';
import { claimGift } from '@/lib/googleSheets';
import { z } from 'zod';

const claimSchema = z.object({
    gift_id: z.string(),
    name: z.string().min(1, 'Nombre es requerido'),
    phone: z.string().optional().or(z.literal('')),
    email: z.string().email().optional().or(z.literal('')),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = claimSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        const { gift_id, ...userData } = result.data;
        await claimGift(gift_id, userData);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Error al reclamar el regalo' }, { status: 500 });
    }
}
