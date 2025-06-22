'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { saveQuiz, getLectureNote } from '@/lib/services/quiz';
import { Loader2, Upload, Brain, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QuizCreator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Check if creating quiz from a note
  useEffect(() => {
    const loadNoteContent = async () => {
      const noteId = searchParams.get('noteId');
      if (!noteId || !user) return;
      
      setIsLoading(true);
      try {
        const note = await getLectureNote(noteId);
        if (note) {
          setTitle(note.title ? `Quiz on ${note.title}` : 'New Quiz');
          setSubject(note.subject || '');
          setContent(note.content || '');
          setDescription(note.title ? `Quiz generated from "${note.title}" notes` : '');
        }
      } catch (error) {
        console.error('Error loading note:', error);
        toast({
          title: 'Error',
          description: 'Failed to load note content. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNoteContent();
  }, [searchParams, user, toast]);

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target && event.target.result;
          if (result) {
            setContent(result);
          }
        };
        reader.readAsText(file);
      } else {
        setError('Please upload a text file (.txt)');
      }
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) {
      setError('Please enter a title for your quiz');
      return;
    }

    if (!subject.trim()) {
      setError('Please enter a subject for your quiz');
      return;
    }

    if (!content.trim()) {
      setError('Please enter or upload some content');
      return;
    }

    setError('');
    setIsGenerating(true);
    
    const progressInterval = simulateProgress();

    try {
      // Generate quiz using server-side API
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          subject,
          difficulty,
          numberOfQuestions,
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate quiz');
      }

      const { questions } = await res.json();

      setProgress(95);

      // Save quiz to Firebase with proper validation
      const quizData = {
        title: title.trim(),
        description: description.trim(),
        questions,
        createdBy: user.uid,
        difficulty,
        subject: subject.trim(),
        createdAt: new Date(),
        // Add source note ID if creating from a note
        sourceNoteId: searchParams.get('noteId') || null,
      };

      const quizId = await saveQuiz(quizData);

      setProgress(100);
      
      // Show success toast
      toast({
        title: 'Success',
        description: 'Quiz created successfully!',
      });
      
      // Redirect to quiz view
      setTimeout(() => {
        router.push(`/quiz/${quizId}`);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setError(error.message || 'Failed to generate quiz');
      setProgress(0);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Brain className="h-12 w-12 text-indigo-600 animate-pulse" />
                  <Sparkles className="h-6 w-6 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Generating Your Quiz</h3>
                <p className="text-sm text-muted-foreground">
                  AI is analyzing your content and creating personalized questions...
                </p>
              </div>
              <div className="space-y-2">
                <Progress value={progress} max={100} className="w-full" />
                <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
        <p className="text-gray-600 mt-2">
          {searchParams.get('noteId') 
            ? 'Generate a quiz from your selected lecture notes' 
            : 'Upload your lecture notes and let AI generate personalized quiz questions'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
          <CardDescription>
            Provide basic information about your quiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Biology"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Biology, Chemistry, History"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of what this quiz covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg rounded-lg">
                    <SelectItem value="easy" className="cursor-pointer hover:bg-gray-100">Easy</SelectItem>
                    <SelectItem value="medium" className="cursor-pointer hover:bg-gray-100">Medium</SelectItem>
                    <SelectItem value="hard" className="cursor-pointer hover:bg-gray-100">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <Select 
                  value={numberOfQuestions.toString()} 
                  onValueChange={(value) => setNumberOfQuestions(parseInt(value))}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg rounded-lg">
                    <SelectItem value="5" className="cursor-pointer hover:bg-gray-100">5 Questions</SelectItem>
                    <SelectItem value="10" className="cursor-pointer hover:bg-gray-100">10 Questions</SelectItem>
                    <SelectItem value="15" className="cursor-pointer hover:bg-gray-100">15 Questions</SelectItem>
                    <SelectItem value="20" className="cursor-pointer hover:bg-gray-100">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Lecture Notes</Label>
              <div className="space-y-4">
                {!searchParams.get('noteId') && (
                  <>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload lecture notes
                          </span>
                          <span className="text-xs text-gray-500">
                            Text files only (.txt)
                          </span>
                        </Label>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".txt"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-500">or</div>
                  </>
                )}

                <Textarea
                  placeholder="Paste your lecture notes here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-sky-500 hover:bg-sky-600 px-5 py-2.5"
              disabled={isGenerating || !content.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}