import { NextResponse } from 'next/server';

// Types
interface MessageRequest {
  message: string;
  user: string;
}

// POST /api/message - Example POST endpoint
export async function POST(request: Request) {
  try {
    const body: MessageRequest = await request.json();

    if (!body.message || !body.user) {
      return NextResponse.json(
        { error: 'Missing required fields: message, user' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      received: true,
      echo: `Hello ${body.user}, you said: ${body.message}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
