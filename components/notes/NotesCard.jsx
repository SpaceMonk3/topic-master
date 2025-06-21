'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { FileText, MoreVertical, Trash, Edit, BookOpen } from 'lucide-react';

export function NotesCard({ note, onDelete, onCreateQuiz }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

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

  // Format the content preview to show only the first few lines
  const getContentPreview = () => {
    if (!note.content) return '';
    const lines = note.content.split('\n').filter(line => line.trim());
    const preview = lines.slice(0, 3).join('\n');
    return lines.length > 3 ? `${preview}...` : preview;
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(note.id);
    }
    setShowDeleteDialog(false);
  };

  const handleCreateQuiz = () => {
    if (onCreateQuiz) {
      onCreateQuiz(note);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{note.subject || 'General'}</Badge>
                <span className="text-xs text-gray-500">
                  {formatDate(note.uploadedAt)}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowPreview(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Preview</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreateQuiz}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Create Quiz</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 line-clamp-3 whitespace-pre-line">
            {getContentPreview()}
          </div>
          <div className="mt-3 text-xs text-gray-500 flex items-center space-x-3">
            <span>{note.wordCount || 0} words</span>
            <span>{note.characterCount || 0} characters</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleCreateQuiz}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{note.title}</DialogTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{note.subject || 'General'}</Badge>
              <span className="text-xs text-gray-500">
                {formatDate(note.uploadedAt)}
              </span>
            </div>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-line text-sm">
            {note.content}
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                setShowPreview(false);
                handleCreateQuiz();
              }}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 