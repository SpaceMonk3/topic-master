'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Brain, BookOpen, BarChart3, Sparkles, CheckCircle, Users, Zap } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-sky-500" />
              <span className="text-xl font-bold text-gray-900">Topic Master</span>
            </div>
            <div className="space-x-4">
              <Button variant="ghost" asChild className="px-5 py-2.5">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-sky-500 hover:bg-sky-600 px-5 py-2.5">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Brain className="h-20 w-20 text-sky-500" />
                <Sparkles className="h-8 w-8 text-amber-500 absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Personalized Learning</span>
              <span className="block text-sky-500">Quiz Generator</span>
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Transform your lecture notes into engaging, AI-powered quizzes. 
              Study smarter with personalized questions that adapt to your learning style.
            </p>
            
            <div className="mt-10 flex justify-center space-x-4">
              <Button size="lg" asChild className="bg-sky-500 hover:bg-sky-600 px-6 py-3">
                <Link href="/register">
                  Start Creating Quizzes
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-6 py-3">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Powered by Advanced AI
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to create, take, and track personalized quizzes
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Generation</h3>
                <p className="text-gray-600">
                  Upload your notes and let our AI create personalized multiple-choice questions tailored to your content
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Learning</h3>
                <p className="text-gray-600">
                  Take quizzes with instant feedback, explanations, and progress tracking for effective learning
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Analytics</h3>
                <p className="text-gray-600">
                  Track your progress, identify weak areas, and see detailed analytics of your learning journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Why Choose Topic Master?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-sky-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Intelligent Question Generation</h3>
                    <p className="text-gray-600">Our AI analyzes your content to create meaningful questions that test comprehension, not just memorization</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-sky-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Adaptive Difficulty</h3>
                    <p className="text-gray-600">Choose from easy, medium, or hard difficulty levels to match your learning goals</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-sky-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure & Private</h3>
                    <p className="text-gray-600">Your notes and quiz data are securely stored with Firebase authentication and encryption</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-sky-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Detailed Analytics</h3>
                    <p className="text-gray-600">Track your performance over time with comprehensive analytics and insights</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-lg p-8 text-white">
                <div className="text-center space-y-4">
                  <Users className="h-16 w-16 mx-auto opacity-80" />
                  <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
                  <p className="text-sky-100">
                    Join thousands of students who are already using Topic Master to improve their learning outcomes
                  </p>
                  <Button size="lg" variant="secondary" className="mt-6 px-6 py-3" asChild>
                    <Link href="/register">
                      Create Your First Quiz
                      <Sparkles className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-6 w-6 text-sky-500" />
              <span className="text-lg font-bold text-gray-900">Topic Master</span>
            </div>
            <p className="text-gray-600">
              Transforming learning with AI-powered personalized quizzes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}