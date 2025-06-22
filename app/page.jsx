'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, BookOpen, BarChart3, Sparkles, CheckCircle, Users, Zap, ArrowRight, Menu, X } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Close mobile menu when clicking on a link
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 overflow-hidden">
      {/* Glass Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className={`glass-navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-sky-500" />
                <span className="text-xl font-bold text-gray-900">Topic Master</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-700 hover:text-sky-600 transition-colors px-3 py-2 text-sm font-medium">Features</a>
                <a href="#benefits" className="text-gray-700 hover:text-sky-600 transition-colors px-3 py-2 text-sm font-medium">Benefits</a>
                <a href="#testimonials" className="text-gray-700 hover:text-sky-600 transition-colors px-3 py-2 text-sm font-medium">Testimonials</a>
              </nav>
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" asChild className="px-5 py-2.5 rounded-full">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-sky-500 hover:bg-sky-600 px-5 py-2.5 rounded-full shadow-lg hover:shadow-sky-200/50 transition-all">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  className="p-2 rounded-md text-gray-700 hover:text-sky-600 focus:outline-none"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-navbar border-t border-white/20 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50"
                onClick={handleNavLinkClick}
              >
                Features
              </a>
              <a
                href="#benefits"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50"
                onClick={handleNavLinkClick}
              >
                Benefits
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50"
                onClick={handleNavLinkClick}
              >
                Testimonials
              </a>
              <div className="pt-4 flex flex-col space-y-2">
                <Link 
                  href="/login"
                  className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50"
                  onClick={handleNavLinkClick}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register"
                  className="px-3 py-2 rounded-md text-base font-medium bg-sky-500 text-white hover:bg-sky-600 text-center"
                  onClick={handleNavLinkClick}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-100 rounded-full opacity-70 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-70 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Brain className="h-20 w-20 text-sky-500" />
                <Sparkles className="h-8 w-8 text-amber-500 absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl tracking-tight font-extrabold text-gray-900 mb-8">
              <span className="block">Personalized Quizzes</span>
              <span className="gradient-text">From Your Study Notes</span>
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Upload your lecture notes and let our AI create personalized quizzes to help you study smarter, not harder.
            </p>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-sky-500 hover:bg-sky-600 px-8 py-6 rounded-full shadow-lg hover:shadow-sky-200/50 transition-all text-lg glow">
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 py-6 rounded-full border-2 text-lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-100/70 to-transparent rounded-3xl blur-xl"></div>
            <div className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 transform transition-all hover:-translate-y-1 hover:shadow-sky-200/20 duration-300">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
                <Image 
                  src="/images/dashboard-preview.png" 
                  alt="Topic Master Dashboard" 
                  width={1200} 
                  height={675} 
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              AI-driven features for smarter learning
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-500">
              Everything you need to create, take, and track personalized quizzes with advanced AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="h-7 w-7 text-sky-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Generation</h3>
                <p className="text-gray-600">
                  Upload your notes and let our AI create personalized multiple-choice questions tailored specifically to your content
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Learning</h3>
                <p className="text-gray-600">
                  Take quizzes with instant feedback, detailed explanations, and comprehensive progress tracking for effective learning
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Analytics</h3>
                <p className="text-gray-600">
                  Track your progress, identify weak areas, and see detailed analytics of your learning journey with beautiful visualizations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
                Why Choose Topic Master?
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-sky-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Intelligent Question Generation</h3>
                    <p className="text-gray-600 mt-2">Our AI analyzes your content to create meaningful questions that test comprehension, not just memorization</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-sky-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Adaptive Difficulty</h3>
                    <p className="text-gray-600 mt-2">Choose from easy, medium, or hard difficulty levels to match your learning goals and challenge yourself appropriately</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-sky-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Secure & Private</h3>
                    <p className="text-gray-600 mt-2">Your notes and quiz data are securely stored with Firebase authentication and encryption for maximum privacy</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-sky-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Detailed Analytics</h3>
                    <p className="text-gray-600 mt-2">Track your performance over time with comprehensive analytics and insights to optimize your study strategy</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-100 to-blue-100 rounded-3xl blur-xl -z-10"></div>
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-10 text-white shadow-xl">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center">Ready to Get Started?</h3>
                  <p className="text-sky-100 text-center">
                    Join thousands of students who are already using Topic Master to improve their learning outcomes and achieve academic success
                  </p>
                  <div className="flex justify-center pt-4">
                    <Button size="lg" variant="secondary" className="px-8 py-6 rounded-full text-sky-600 hover:text-sky-700 bg-white hover:bg-gray-100 shadow-lg transition-all text-lg" asChild>
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
        </div>
      </section>

      {/* Testimonials section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Loved by students and educators
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-500">
              See what our users are saying about their experience with Topic Master
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Topic Master has completely transformed how I study. The AI-generated quizzes are incredibly relevant and have helped me improve my grades significantly."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Random Kid</h4>
                    <p className="text-sm text-gray-500">University Student</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-5 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-8 w-8 text-sky-500" />
              <span className="text-xl font-bold">Topic Master</span>
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} Topic Master. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}