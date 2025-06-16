'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { QuizTaker } from '@/components/quiz/QuizTaker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getQuiz } from '@/lib/services/quiz';
import { Clock, BookOpen, Target, Play } from 'lucide-react';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (params.id && user) {
      loadQuiz();
    }
  }, [params.id, user]);

  const loadQuiz = async () => {
    try {
      const quizData = await getQuiz(params.id);
      if (quizData) {
        setQuiz(quizData);
      } else {
        setError('Quiz not found');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      setError('Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h2>
              <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (hasStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <QuizTaker quiz={quiz} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {quiz.description}
                </CardDescription>
              </div>
              <Badge variant={quiz.difficulty === 'easy' ? 'secondary' : quiz.difficulty === 'medium' ? 'default' : 'destructive'}>
                {quiz.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Quiz Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                  <div>
                    <div className="font-semibold text-indigo-900">{quiz.questions.length}</div>
                    <div className="text-sm text-indigo-600">Questions</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg">
                  <Target className="h-8 w-8 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-emerald-900">{quiz.subject}</div>
                    <div className="text-sm text-emerald-600">Subject</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
                  <Clock className="h-8 w-8 text-amber-600" />
                  <div>
                    <div className="font-semibold text-amber-900">
                      {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
                    </div>
                    <div className="text-sm text-amber-600">Time Limit</div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Read each question carefully before selecting your answer</li>
                  <li>• You can navigate between questions using the Previous/Next buttons</li>
                  <li>• Your answers are automatically saved as you progress</li>
                  <li>• Review your answers before submitting the quiz</li>
                  <li>• You'll receive immediate feedback and explanations after completion</li>
                </ul>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={() => setHasStarted(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}