import OpenAI from 'openai';

// Initialize OpenAI client lazily to ensure environment variables are loaded
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: "My API Key" }).');
  }
  
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generateQuiz({
  content,
  subject,
  difficulty,
  numberOfQuestions,
}) {
  try {
    const openai = getOpenAIClient();
    const prompt = `
    You are an expert educator. Create a ${difficulty} level multiple-choice quiz with ${numberOfQuestions} questions based on the following lecture notes about ${subject}.

    Lecture Notes:
    ${content}

    Requirements:
    - Generate exactly ${numberOfQuestions} multiple-choice questions
    - Each question should have 4 options (A, B, C, D)
    - Include clear explanations for correct answers
    - Ensure questions test understanding, not just memorization
    - Vary question types (factual, conceptual, application)
    - Make distractors plausible but clearly incorrect

    Format your response as a valid JSON object:
    {
      "questions": [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Why this answer is correct...",
          "difficulty": "${difficulty}"
        }
      ]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator who creates high-quality educational assessments.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const quizData = JSON.parse(response);
    return quizData.questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz');
  }
}