import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/v1/ai/generate-project`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ data });

  } catch (error) {
    console.error('Error generating project spec:', error);
    return NextResponse.json(
      { error: { message: 'Failed to generate project spec' } },
      { status: 500 }
    );
  }
}
