import { NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/services/openai';

export async function POST(req) {
  try {
    const data = await req.json();
    const { content, subject, difficulty, numberOfQuestions } = data;

    if (!content || !subject || !difficulty || !numberOfQuestions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const questions = await generateQuiz({
      content,
      subject,
      difficulty,
      numberOfQuestions,
    });

    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
