'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, Target, TrendingUp } from 'lucide-react';

export function DashboardStats({ stats }) {
  // Format time in minutes and seconds
  const formatTimeSpent = (seconds) => {
    if (!seconds) return '0m';
    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };
  
  // Get the latest performance score
  const getLatestScore = () => {
    if (!stats.recentPerformance || stats.recentPerformance.length === 0) {
      return 0;
    }
    return Math.round(stats.recentPerformance[0]);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalQuizzes || 0}</div>
          <p className="text-xs text-muted-foreground">
            Quizzes completed
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(stats.averageScore || 0)}%</div>
          <p className="text-xs text-muted-foreground">
            Across all quizzes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatTimeSpent(stats.totalTimeSpent)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total study time
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {getLatestScore()}%
          </div>
          <p className="text-xs text-muted-foreground">
            Latest quiz score
          </p>
        </CardContent>
      </Card>
    </div>
  );
}