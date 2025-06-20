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

export async function saveQuiz(quiz) {
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

export async function getQuiz(quizId) {
  try {
    const docRef = doc(db, 'quizzes', quizId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting quiz:', error);
    throw new Error('Failed to get quiz');
  }
}

export async function getUserQuizzes(userId) {
  try {
    // Simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, 'quizzes'),
      where('createdBy', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const quizzes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort on client side instead
    return quizzes.sort((a, b) => {
      const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return bDate - aDate;
    });
  } catch (error) {
    console.error('Error getting user quizzes:', error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
}

export async function saveQuizSession(session) {
  try {
    console.log('Attempting to save quiz session');
    
    // Sanitize the session data to remove any undefined values
    const sanitizedSession = JSON.parse(JSON.stringify(session));
    
    // Ensure required fields have default values
    const sessionWithDefaults = {
      quizId: '',
      userId: '',
      score: 0,
      timeSpent: 0,
      totalQuestions: 0,
      completedAt: new Date(),
      answers: [],
      ...sanitizedSession
    };
    
    console.log('Saving sanitized quiz session:', sessionWithDefaults);
    
    const docRef = await addDoc(collection(db, 'quizSessions'), sessionWithDefaults);
    console.log('Quiz session saved successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving quiz session:', error);
    throw new Error('Failed to save quiz session');
  }
}

export async function getUserQuizSessions(userId) {
  try {
    console.log(`Fetching quiz sessions for user: ${userId}`);
    
    // Simple query without orderBy and limit to avoid index requirement
    const q = query(
      collection(db, 'quizSessions'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.docs.length} quiz session documents`);
    
    const sessions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Add the document ID to the session data
      return {
        id: doc.id,
        ...data,
        // Ensure completedAt is properly handled
        completedAt: data.completedAt || new Date(),
        // Ensure timeSpent is a number
        timeSpent: typeof data.timeSpent === 'number' ? data.timeSpent : 0,
        // Ensure score is a number
        score: typeof data.score === 'number' ? data.score : 0
      };
    });
    
    // Sort and limit on client side
    const sortedSessions = sessions.sort((a, b) => {
      try {
        const aDate = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt);
        const bDate = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt);
        return bDate - aDate;
      } catch (error) {
        console.error('Error sorting sessions:', error);
        return 0;
      }
    });
    
    console.log(`Returning ${sortedSessions.length} sorted quiz sessions`);
    return sortedSessions.slice(0, 20);
  } catch (error) {
    console.error('Error getting quiz sessions:', error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
}

export async function saveLectureNotes(notes) {
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

export async function getUserLectureNotes(userId) {
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
    }));
  } catch (error) {
    console.error('Error getting lecture notes:', error);
    throw new Error('Failed to get lecture notes');
  }
}