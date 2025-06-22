'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Upload, 
  Save, 
  Key, 
  AlertTriangle, 
  Trash2, 
  Loader2
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, updateUserProfile, updateUserEmail, changePassword, deleteAccount } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setIsUpdating(true);

    try {
      // Update profile
      await updateUserProfile({
        displayName,
        photoFile
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      // Clear photo file after successful upload
      setPhotoFile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!currentPassword) {
      setError('Current password is required to update email');
      return;
    }

    setIsUpdating(true);

    try {
      await updateUserEmail(email, currentPassword);
      setCurrentPassword('');
      
      toast({
        title: 'Email updated',
        description: 'Your email has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating email:', error);
      setError(error.message || 'Failed to update email');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword(currentPassword, newPassword);
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: 'Password changed',
        description: 'Your password has been changed successfully.',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (!deleteConfirmPassword) {
      setError('Please enter your password to confirm account deletion');
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAccount(deleteConfirmPassword);
      
      toast({
        title: 'Account deleted',
        description: 'Your account has been deleted successfully.',
      });
      
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.message || 'Failed to delete account');
      setIsDeleting(false);
    }
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
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-white border shadow-sm">
              <TabsTrigger value="profile" className="data-[state=active]:bg-sky-50 data-[state=active]:text-sky-600">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-sky-50 data-[state=active]:text-sky-600">
                <Key className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="danger" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Danger Zone
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile information and avatar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex flex-col items-center space-y-3">
                      <Avatar className="h-24 w-24">
                        <AvatarImage 
                          src={photoPreview || user.photoURL} 
                          alt={user.displayName || user.email} 
                        />
                        <AvatarFallback className="text-2xl">
                          {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <Label htmlFor="photo" className="cursor-pointer text-sm text-sky-600 hover:text-sky-500 flex items-center justify-center">
                          <Upload className="h-4 w-4 mr-1" />
                          Change avatar
                        </Label>
                        <Input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your display name"
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-sky-500 hover:bg-sky-600"
                          disabled={isUpdating}
                        >
                          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Save className="mr-2 h-4 w-4" />
                          Save Profile
                        </Button>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Address</CardTitle>
                  <CardDescription>
                    Update your email address (requires current password)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmailUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPasswordEmail">Current Password</Label>
                      <Input
                        id="currentPasswordEmail"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-sky-500 hover:bg-sky-600"
                      disabled={isUpdating}
                    >
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Email
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-sky-500 hover:bg-sky-600"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger">
              <Card className="border-red-200">
                <CardHeader className="border-b border-red-100">
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <h3 className="text-lg font-semibold text-red-700">Delete Account</h3>
                      <p className="text-sm text-red-600 mt-1 mb-4">
                        Once you delete your account, there is no going back. All your data will be permanently removed.
                      </p>
                      
                      {!showDeleteConfirm ? (
                        <Button 
                          variant="destructive"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      ) : (
                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="deleteConfirmPassword" className="text-red-700">
                              Enter your password to confirm
                            </Label>
                            <Input
                              id="deleteConfirmPassword"
                              type="password"
                              value={deleteConfirmPassword}
                              onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                              placeholder="Enter your password"
                              required
                              className="border-red-200 focus:border-red-400"
                            />
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteConfirmPassword('');
                                setError('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              variant="destructive"
                              disabled={isDeleting}
                            >
                              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Confirm Delete
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
} 