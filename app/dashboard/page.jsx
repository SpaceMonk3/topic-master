'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserQuizSessions } from '@/lib/services/quiz';
import { Brain, Plus, BookOpen, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    strongestSubjects: [],
    weakestSubjects: [],
    recentPerformance: [],
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const formatDate = (timestamp) => {
    try {
      const date = timestamp?.toDate ? 
        timestamp.toDate() : 
        new Date(timestamp);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Recently';
    }
  };

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const sessions = await getUserQuizSessions(user.uid);
      setRecentSessions(sessions.slice(0, 5));

      // Calculate stats
      const totalQuizzes = sessions.length;
      const averageScore = sessions.length > 0 
        ? sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length 
        : 0;
      const totalTimeSpent = sessions.reduce((sum, session) => sum + session.timeSpent, 0);
      const recentPerformance = sessions.slice(0, 10).map(session => session.score);

      // Get subject performance
      const subjectScores = {};
      sessions.forEach(session => {
        const subject = session.quiz?.subject || 'Unknown';
        if (!subjectScores[subject]) {
          subjectScores[subject] = [];
        }
        subjectScores[subject].push(session.score);
      });

      const subjectAverages = Object.entries(subjectScores).map(([subject, scores]) => ({
        subject,
        average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      }));

      const sortedSubjects = subjectAverages.sort((a, b) => b.average - a.average);
      const strongestSubjects = sortedSubjects.slice(0, 3).map(s => s.subject);
      const weakestSubjects = sortedSubjects.slice(-3).reverse().map(s => s.subject);

      setStats({
        totalQuizzes,
        averageScore,
        totalTimeSpent,
        strongestSubjects,
        weakestSubjects,
        recentPerformance,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default stats on error
      setStats({
        totalQuizzes: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        strongestSubjects: [],
        weakestSubjects: [],
        recentPerformance: [],
      });
      setRecentSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.displayName || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your learning progress and recent activity
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
            <Link href="/create">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Plus className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create Quiz</h3>
                    <p className="text-sm text-gray-600">Generate new quiz from notes</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
            <Link href="/quizzes">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">My Quizzes</h3>
                    <p className="text-sm text-gray-600">View and take quizzes</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
            <Link href="/notes">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Brain className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">My Notes</h3>
                    <p className="text-sm text-gray-600">Manage lecture notes</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <DashboardStats stats={stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recent Quiz Activity
              </CardTitle>
              <CardDescription>Your latest quiz attempts and scores</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSessions.length > 0 ? (
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{session.quiz.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {session.quiz?.subject || 'Unknown'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(session.completedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          session.score >= 80 ? 'text-emerald-600' : 
                          session.score >= 60 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {session.score}%
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.floor(session.timeSpent / 60)}m
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No quiz activity yet</p>
                  <Button asChild>
                    <Link href="/create">Create Your First Quiz</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Areas of strength and improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats.strongestSubjects.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-emerald-600 mb-2">Strongest Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {stats.strongestSubjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="bg-emerald-100 text-emerald-800">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {stats.weakestSubjects.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-amber-600 mb-2">Areas for Improvement</h4>
                    <div className="flex flex-wrap gap-2">
                      {stats.weakestSubjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="bg-amber-100 text-amber-800">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {stats.totalQuizzes === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">Complete more quizzes to see insights</p>
                    <Button variant="outline" asChild>
                      <Link href="/create">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}