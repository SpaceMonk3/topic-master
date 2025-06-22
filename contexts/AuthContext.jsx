'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser
} from 'firebase/auth';
import { auth, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const AuthContext = createContext(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, displayName) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(firebaseUser, { displayName });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async ({ displayName, photoFile }) => {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const updates = {};
    if (displayName) updates.displayName = displayName;

    // Handle photo upload if provided
    if (photoFile) {
      try {
        const fileExtension = photoFile.name.split('.').pop();
        const fileName = `${auth.currentUser.uid}.${fileExtension}`;
        const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}/${fileName}`);
        
        // Set metadata with content type
        const metadata = {
          contentType: photoFile.type,
          customMetadata: {
            'uploaded-by': auth.currentUser.uid,
            'original-filename': photoFile.name
          }
        };
        
        // Upload with metadata and retry logic
        let attempt = 0;
        const maxAttempts = 3;
        let uploadSuccessful = false;
        
        while (!uploadSuccessful && attempt < maxAttempts) {
          try {
            attempt++;
            console.log(`Attempting upload (${attempt}/${maxAttempts})...`);
            
            // Upload the file with metadata
            const snapshot = await uploadBytes(storageRef, photoFile, metadata);
            
            // Get the download URL
            const photoURL = await getDownloadURL(snapshot.ref);
            updates.photoURL = photoURL;
            uploadSuccessful = true;
            console.log('Upload successful!');
          } catch (error) {
            console.error(`Upload attempt ${attempt} failed:`, error);
            
            if (attempt >= maxAttempts) {
              throw new Error(`Failed to upload profile image after ${maxAttempts} attempts: ${error.message}`);
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      } catch (error) {
        console.error('Error uploading profile image:', error);
        throw new Error(`Profile image upload failed: ${error.message}`);
      }
    }

    await updateProfile(auth.currentUser, updates);

    // Update local user state
    setUser(prevUser => ({
      ...prevUser,
      ...updates
    }));

    return updates;
  };

  const updateUserEmail = async (newEmail, password) => {
    if (!auth.currentUser) throw new Error('No authenticated user');

    // Re-authenticate user before changing email
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
    
    // Update email
    await updateEmail(auth.currentUser, newEmail);
    
    // Update local user state
    setUser(prevUser => ({
      ...prevUser,
      email: newEmail
    }));
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser) throw new Error('No authenticated user');

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    
    // Update password
    await updatePassword(auth.currentUser, newPassword);
  };

  const deleteAccount = async (password) => {
    if (!auth.currentUser) throw new Error('No authenticated user');

    // Re-authenticate user before deleting account
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);
    
    // Delete profile image if it exists
    if (auth.currentUser.photoURL && auth.currentUser.photoURL.includes('firebase')) {
      try {
        const photoRef = ref(storage, auth.currentUser.photoURL);
        await deleteObject(photoRef);
      } catch (error) {
        console.error('Error deleting profile image:', error);
      }
    }
    
    // Delete user account
    await deleteUser(auth.currentUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    updateUserEmail,
    changePassword,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}