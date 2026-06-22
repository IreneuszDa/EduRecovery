// app/api/cookies/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { consent } = await request.json();
  
  if (consent === 'accepted') {
    // Ustawiamy ciasteczko po stronie serwera
    (await
          // Ustawiamy ciasteczko po stronie serwera
          cookies()).set('cookie_consent', 'accepted', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 rok
      httpOnly: true, // Zabezpieczenie przed dostępem z JS klienta
      secure: process.env.NODE_ENV === 'production', // Używaj tylko z HTTPS na produkcji
      sameSite: 'lax',
    });
    
    return NextResponse.json({ message: 'Zgoda na ciasteczka została zapisana.' });
  }

  return NextResponse.json({ message: 'Nie podjęto działania.' }, { status: 400 });
}