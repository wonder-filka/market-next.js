// app/api/wallets/evm/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, currency } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: 'userId is required' }, { status: 400 });
    }

    const base = process.env.INTERNAL_API_BASE_URL!;
    const r = await fetch(`${base}/users/${userId}/wallets/evm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // пробрасываем currency (ETH/USDT/BTC)
      body: JSON.stringify({ currency }),
      // если нужен cookie/авторизация к Nest — добавь credentials и заголовки
    });

    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    console.error('proxy /api/wallets/evm error', e);
    return NextResponse.json({ message: 'proxy error' }, { status: 500 });
  }
}
