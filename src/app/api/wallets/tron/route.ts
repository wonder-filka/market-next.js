// app/api/wallets/tron/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, currency } = await req.json(); // currency: 'USDT' | 'TRX'

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    const base = process.env.INTERNAL_API_BASE_URL!;
    const r = await fetch(`${base}/users/${userId}/wallets/tron`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currency }), // пробрасываем в Nest
    });

    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    console.error('proxy /api/wallets/tron error', e);
    return NextResponse.json({ message: 'proxy error' }, { status: 500 });
  }
}
