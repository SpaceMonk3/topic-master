'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserQuizzes } from '@/lib/services/quiz';
import { Brain, Clock, BookOpen, Plus, Play } from 'lucide-react';

export default function QuizzesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadQuizzes = useCallback(async () => {
    try {
      const userQuizzes = await getUserQuizzes(user.uid);
      setQuizzes(userQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadQuizzes();
    }
  }, [user, loadQuizzes]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
              <p className="text-gray-600 mt-2">
                View and manage your created quizzes
              </p>
            </div>
            <Button 
              onClick={() => router.push('/create')}
              className="bg-sky-500 hover:bg-sky-600 px-5 py-2.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No quizzes created yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first quiz from your lecture notes
                  </p>
                  <Button 
                    onClick={() => router.push('/create')}
                    className="bg-sky-500 hover:bg-sky-600 px-5 py-2.5"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <Badge 
                        variant={
                          quiz.difficulty === 'easy' 
                            ? 'secondary' 
                            : quiz.difficulty === 'medium' 
                            ? 'default' 
                            : 'destructive'
                        }
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {quiz.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {quiz.questions?.length || 0} questions
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {quiz.subject}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Created {(() => {
                          try {
                            const date = quiz.createdAt?.toDate ? 
                              quiz.createdAt.toDate() : 
                              new Date(quiz.createdAt);
                            return date.toLocaleDateString();
                          } catch (error) {
                            return 'Recently';
                          }
                        })()}
                      </div>

                      <Button 
                        onClick={() => router.push(`/quiz/${quiz.id}`)}
                        className="w-full bg-sky-500 hover:bg-sky-600 px-5 py-2.5"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Take Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 