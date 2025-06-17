import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple test to check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'OpenAI API key is configured' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 