'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { saveQuizSession } from '@/lib/services/quiz';
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export function QuizTaker({ quiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setSelectedAnswer(null);
  }, [currentQuestion]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const questionTimeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const currentQuiz = quiz.questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;

    const userAnswer = {
      questionId: currentQuiz.id,
      selectedAnswer,
      isCorrect,
      timeSpent: questionTimeSpent,
    };

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = userAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completed
      completeQuiz(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      // Set the selected answer to the previously answered one
      const previousAnswer = answers[currentQuestion - 1];
      if (previousAnswer) {
        setSelectedAnswer(previousAnswer.selectedAnswer);
      }
    }
  };

  const completeQuiz = async (finalAnswers) => {
    if (!user) return;

    const correctAnswers = finalAnswers.filter(answer => answer.isCorrect).length;
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    setScore(finalScore);
    setIsCompleted(true);

    try {
      const session = {
        quizId: quiz.id,
        userId: user.uid,
        answers: finalAnswers,
        score: finalScore,
        totalQuestions: quiz.questions.length,
        completedAt: new Date(),
        timeSpent,
        quiz,
      };

      await saveQuizSession(session);
    } catch (error) {
      console.error('Error saving quiz session:', error);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                {score >= 80 ? (
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
                ) : score >= 60 ? (
                  <CheckCircle className="h-16 w-16 text-amber-500 mx-auto" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                )}
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Quiz Completed!</h2>
                <p className="text-gray-600 mt-2">Here are your results</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">{score}%</div>
                  <div className="text-sm text-indigo-600">Final Score</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-emerald-600">
                    {answers.filter(a => a.isCorrect).length}/{quiz.questions.length}
                  </div>
                  <div className="text-sm text-emerald-600">Correct Answers</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-amber-600">{formatTime(timeSpent)}</div>
                  <div className="text-sm text-amber-600">Time Spent</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Question Review</h3>
                <div className="space-y-3">
                  {quiz.questions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer?.isCorrect;
                    
                    return (
                      <div key={question.id} className="text-left border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{question.question}</h4>
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 ml-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="text-gray-600">
                            Your answer: <span className={isCorrect ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                              {question.options[userAnswer?.selectedAnswer || 0]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-gray-600">
                              Correct answer: <span className="text-emerald-600 font-medium">
                                {question.options[question.correctAnswer]}
                              </span>
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-gray-500 text-xs mt-2">{question.explanation}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push('/dashboard')}>
                  Back to Dashboard
                </Button>
                <Button variant="outline" onClick={() => router.push('/quizzes')}>
                  View All Quizzes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuiz = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600">{quiz.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(timeSpent)}
          </Badge>
          <Badge variant="outline">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
            <Badge variant={currentQuiz.difficulty === 'easy' ? 'secondary' : currentQuiz.difficulty === 'medium' ? 'default' : 'destructive'}>
              {currentQuiz.difficulty}
            </Badge>
          </div>
          <CardDescription className="text-base text-gray-900 font-medium">
            {currentQuiz.question}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => handleAnswerSelect(parseInt(value))}>
            <div className="space-y-3">
              {currentQuiz.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}