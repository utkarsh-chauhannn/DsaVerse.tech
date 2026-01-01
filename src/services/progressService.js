import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const assertDbInitialized = () => {
  if (!db) {
    console.error('Firestore database is not initialized');
    throw new Error('Database not initialized');
  }
};

export const getUserProgress = async (userId) => {
  try {
    assertDbInitialized();
    
    const progressRef = doc(db, 'users', userId);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return progressSnap.data();
    }
    
    // Create initial progress
    const initialProgress = {
      algorithms: {},
      dataStructures: {},
      totalTimeSpent: 0,
      achievements: [],
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    };
    
    await setDoc(progressRef, initialProgress);
    return initialProgress;
  } catch (error) {
    console.error('Error getting progress:', error);
    
    // Check if it's a blocked request error
    if (error.message?.includes('offline') || error.code === 'unavailable') {
      console.warn('Firestore requests are being blocked. This might be due to an ad blocker or browser extension.');
    }
    
    // Return empty progress object instead of null to prevent loading state issues
    return {
      algorithms: {},
      dataStructures: {},
      totalTimeSpent: 0,
      achievements: []
    };
  }
};

export const updateAlgorithmProgress = async (userId, algorithmName, data) => {
  try {
    assertDbInitialized();
    const progressRef = doc(db, 'users', userId);
    const progressSnap = await getDoc(progressRef);
    
    if (!progressSnap.exists()) {
      await getUserProgress(userId); // Initialize
    }
    
    await updateDoc(progressRef, {
      [`algorithms.${algorithmName}`]: {
        viewed: true,
        lastViewed: serverTimestamp(),
        ...data
      },
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

export const updateDataStructureProgress = async (userId, dsName, data) => {
  try {
    assertDbInitialized();
    const progressRef = doc(db, 'users', userId);
    const progressSnap = await getDoc(progressRef);
    
    if (!progressSnap.exists()) {
      await getUserProgress(userId); // Initialize
    }
    
    await updateDoc(progressRef, {
      [`dataStructures.${dsName}`]: {
        viewed: true,
        lastViewed: serverTimestamp(),
        ...data
      },
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating data structure progress:', error);
  }
};

export const markAsLearned = async (userId, topicType, topicName) => {
  try {
    assertDbInitialized();
    const progressRef = doc(db, 'users', userId);
    const progressSnap = await getDoc(progressRef);
    
    if (!progressSnap.exists()) {
      // Initialize progress if it doesn't exist
      await getUserProgress(userId);
    }
    
    await updateDoc(progressRef, {
      [`${topicType}.${topicName}.understood`]: true,
      [`${topicType}.${topicName}.learnedAt`]: serverTimestamp(),
      lastActive: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error marking as learned:', error);
    throw error;
  }
};

export const addTimeSpent = async (userId, seconds) => {
  try {
    assertDbInitialized();
    const progressRef = doc(db, 'users', userId);
    const progressSnap = await getDoc(progressRef);
    const currentTime = progressSnap.data()?.totalTimeSpent || 0;
    
    await updateDoc(progressRef, {
      totalTimeSpent: currentTime + seconds,
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding time:', error);
  }
};

