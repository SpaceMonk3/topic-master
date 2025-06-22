'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { saveLectureNotes } from '@/lib/services/quiz';
import { Loader2, Upload, FileText, X } from 'lucide-react';

export function NotesUploader({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setContent('');
    setError('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setContent(event.target.result.toString());
          }
        };
        reader.readAsText(file);
      } else {
        setError('Please upload a text file (.txt)');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) {
      setError('Please enter a title for your notes');
      return;
    }

    if (!content.trim()) {
      setError('Please enter or upload some content');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Prepare notes data
      const notesData = {
        title: title.trim(),
        subject: subject.trim() || 'General',
        content: content.trim(),
        userId: user.uid,
        uploadedAt: new Date(),
        wordCount: content.trim().split(/\s+/).length,
        characterCount: content.trim().length,
      };

      // Save notes to Firebase
      const noteId = await saveLectureNotes(notesData);
      console.log('Notes saved successfully with ID:', noteId);
      
      // Reset form and close dialog
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      setError(error.message || 'Failed to save notes');
    } finally {
      setIsUploading(false);
    }
  };

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Upload Lecture Notes</h2>
            <p className="text-sm text-gray-500">
              Upload your lecture notes to create personalized quizzes
            </p>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Week 3 Biology Lecture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Biology, Chemistry, History"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Notes Content</Label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="mt-2">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="block text-sm font-medium text-gray-900">
                          Upload text file
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

                  <Textarea
                    placeholder="Paste your lecture notes here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  if (onClose) onClose();
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Save Notes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 