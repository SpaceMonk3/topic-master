'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserQuizSessions } from '@/lib/services/quiz';
import { Brain, Plus, BookOpen, TrendingUp, Clock, RefreshCw } from 'lucide-react';
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
  const [refreshing, setRefreshing] = useState(false);
  const lastLoadTime = useRef(0);

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

  const loadDashboardData = useCallback(async (force = false) => {
    if (!user) return;
    
    // Don't reload data if it was loaded less than 5 seconds ago (unless forced)
    const now = Date.now();
    if (!force && now - lastLoadTime.current < 5000) {
      return;
    }
    
    setIsLoading(true);
    setRefreshing(true);

    try {
      console.log("Loading dashboard data...");
      const sessions = await getUserQuizSessions(user.uid);
      console.log(`Found ${sessions.length} quiz sessions`, sessions);
      
      if (sessions.length > 0) {
        setRecentSessions(sessions.slice(0, 5));

        // Calculate stats
        const totalQuizzes = sessions.length;
        
        // Calculate average score safely
        let totalScore = 0;
        sessions.forEach(session => {
          if (typeof session.score === 'number') {
            totalScore += session.score;
          }
        });
        const averageScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;
        
        // Calculate total time spent safely
        const totalTimeSpent = sessions.reduce((sum, session) => {
          return sum + (typeof session.timeSpent === 'number' ? session.timeSpent : 0);
        }, 0);
        
        // Get recent performance scores
        const recentPerformance = sessions
          .slice(0, 10)
          .map(session => typeof session.score === 'number' ? session.score : 0);

        // Get subject performance
        const subjectScores = {};
        sessions.forEach(session => {
          const subject = session.quiz?.subject || "Unknown";
          if (!subjectScores[subject]) {
            subjectScores[subject] = [];
          }
          if (typeof session.score === 'number') {
            subjectScores[subject].push(session.score);
          }
        });

        const subjectAverages = Object.entries(subjectScores).map(([subject, scores]) => ({
          subject,
          average: scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0,
        }));

        const sortedSubjects = subjectAverages.sort((a, b) => b.average - a.average);
        const strongestSubjects = sortedSubjects.slice(0, 3).map(s => s.subject);
        const weakestSubjects = sortedSubjects.slice(-3).reverse().map(s => s.subject);

        console.log("Dashboard stats calculated:", {
          totalQuizzes,
          averageScore,
          totalTimeSpent,
          strongestSubjects,
          weakestSubjects
        });

        setStats({
          totalQuizzes,
          averageScore,
          totalTimeSpent,
          strongestSubjects,
          weakestSubjects,
          recentPerformance,
        });
      } else {
        console.log("No quiz sessions found, setting default stats");
        // Set default stats when no sessions are found
        setStats({
          totalQuizzes: 0,
          averageScore: 0,
          totalTimeSpent: 0,
          strongestSubjects: [],
          weakestSubjects: [],
          recentPerformance: [],
        });
        setRecentSessions([]);
      }
      
      lastLoadTime.current = now;
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
      setRefreshing(false);
    }
  }, [user]);

  // Refresh when user navigates back to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadDashboardData(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh on focus
    window.addEventListener('focus', () => loadDashboardData(true));

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', () => loadDashboardData(true));
    };
  }, [loadDashboardData]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData(true);
    }
  }, [user, loadDashboardData]);

  const handleRefresh = () => {
    loadDashboardData(true);
  };

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.displayName || user.email}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here&apos;s your learning progress and recent activity
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <Plus className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create Quiz</h3>
                    <p className="text-sm text-gray-600">Generate new quiz from notes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/quizzes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
            </Card>
          </Link>

          <Link href="/notes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
            </Card>
          </Link>
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
                        <h4 className="font-medium text-sm">{session.quiz?.title || "Untitled Quiz"}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {session.quiz?.subject || "Unknown"}
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
                          {Math.floor((session.timeSpent || 0) / 60)}m
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No quiz activity yet</p>
                  <Link href="/create">
                    <Button className="bg-sky-500 hover:bg-sky-600 px-5 py-2.5">Create Your First Quiz</Button>
                  </Link>
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
                    <Link href="/create">
                      <Button variant="outline">Get Started</Button>
                    </Link>
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