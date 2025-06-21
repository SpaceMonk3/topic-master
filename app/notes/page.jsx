'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { NotesUploader } from '@/components/notes/NotesUploader';
import { NotesCard } from '@/components/notes/NotesCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { getUserLectureNotes, deleteLectureNote } from '@/lib/services/quiz';
import { FileText, Upload, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NotesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setRefreshing(true);
    
    try {
      console.log("Fetching lecture notes for user:", user.uid);
      const userNotes = await getUserLectureNotes(user.uid);
      console.log("Fetched notes:", userNotes);
      setNotes(userNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your notes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user, loadNotes]);

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteLectureNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
      toast({
        title: 'Success',
        description: 'Note deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateQuiz = (note) => {
    // Navigate to create quiz page with note data
    router.push(`/create?noteId=${note.id}`);
  };

  const handleRefresh = () => {
    loadNotes();
  };

  const openDialog = () => {
    console.log("Opening notes uploader dialog - setting isDialogOpen to true");
    setIsDialogOpen(true);
    console.log("isDialogOpen after setting:", true);
  };

  // Debug dialog state changes
  useEffect(() => {
    console.log("Dialog state changed:", isDialogOpen);
  }, [isDialogOpen]);

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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
              <p className="text-gray-600 mt-2">
                Manage your lecture notes and study materials
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={openDialog}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Notes
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No notes uploaded yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload your lecture notes to start creating personalized quizzes
                  </p>
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={openDialog}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NotesCard
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onCreateQuiz={handleCreateQuiz}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Debug info */}
      <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs rounded opacity-50">
        Dialog state: {isDialogOpen ? 'Open' : 'Closed'}
      </div>

      <NotesUploader
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        onSuccess={loadNotes}
      />
    </div>
  );
} 