import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Quiz, QuizSession, LectureNotes } from '../types';

export async function saveQuiz(quiz: Omit<Quiz, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'quizzes'), {
      ...quiz,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz:', error);
    throw new Error('Failed to save quiz');
  }
}

export async function getQuiz(quizId: string): Promise<Quiz | null> {
  try {
    const docRef = doc(db, 'quizzes', quizId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Quiz;
    }
    return null;
  } catch (error) {
    console.error('Error getting quiz:', error);
    throw new Error('Failed to get quiz');
  }
}

export async function getUserQuizzes(userId: string): Promise<Quiz[]> {
  try {
    const q = query(
      collection(db, 'quizzes'),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Quiz[];
  } catch (error) {
    console.error('Error getting user quizzes:', error);
    throw new Error('Failed to get user quizzes');
  }
}

export async function saveQuizSession(session: Omit<QuizSession, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'quizSessions'), {
      ...session,
      completedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz session:', error);
    throw new Error('Failed to save quiz session');
  }
}

export async function getUserQuizSessions(userId: string): Promise<QuizSession[]> {
  try {
    const q = query(
      collection(db, 'quizSessions'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as QuizSession[];
  } catch (error) {
    console.error('Error getting quiz sessions:', error);
    throw new Error('Failed to get quiz sessions');
  }
}

export async function saveLectureNotes(notes: Omit<LectureNotes, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'lectureNotes'), {
      ...notes,
      uploadedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving lecture notes:', error);
    throw new Error('Failed to save lecture notes');
  }
}

export async function getUserLectureNotes(userId: string): Promise<LectureNotes[]> {
  try {
    const q = query(
      collection(db, 'lectureNotes'),
      where('userId', '==', userId),
      orderBy('uploadedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LectureNotes[];
  } catch (error) {
    console.error('Error getting lecture notes:', error);
    throw new Error('Failed to get lecture notes');
  }
}