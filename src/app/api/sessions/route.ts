import { NextResponse } from 'next/server';
import { createSession } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const session = await createSession();
    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Could not create session' }, { status: 500 });
  }
}
