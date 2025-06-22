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
import { format } from 'date-fns';
import { FileText, MoreVertical, Trash, Edit, BookOpen, X } from 'lucide-react';

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
      <Card className="hover:shadow-lg transition-all rounded-xl border">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="rounded-full px-3 py-1">{note.subject || 'General'}</Badge>
                <span className="text-xs text-gray-500">
                  {formatDate(note.uploadedAt)}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border shadow-lg rounded-lg">
                <DropdownMenuItem onClick={() => setShowPreview(true)} className="cursor-pointer hover:bg-gray-100 rounded-md">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Preview</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCreateQuiz} className="cursor-pointer hover:bg-gray-100 rounded-md">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Create Quiz</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600 cursor-pointer hover:bg-red-50 rounded-md">
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
            className="w-full rounded-full"
            onClick={handleCreateQuiz}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog - Custom Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Delete Note</h2>
              <button 
                onClick={() => setShowDeleteDialog(false)}
                className="h-9 w-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-5"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  className="px-5"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Preview Dialog - Custom Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-[700px] w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="rounded-full px-3 py-0.5">{note.subject || 'General'}</Badge>
                  <span className="text-xs text-gray-500">
                    {formatDate(note.uploadedAt)}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="h-9 w-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="whitespace-pre-line text-sm">
                {note.content}
              </div>
              <div className="flex justify-end space-x-3 pt-5 border-t mt-6">
                <Button 
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="px-5"
                >
                  Close
                </Button>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all px-5"
                  onClick={() => {
                    setShowPreview(false);
                    handleCreateQuiz();
                  }}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Create Quiz
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 