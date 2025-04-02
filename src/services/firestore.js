import { firestore } from './firebase';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';

// Initialize user data when they register
export const initializeUserData = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await setDoc(userRef, {
      balance: 10000, // Initial balance in USDaddyDollars
      createdAt: new Date(),
      portfolio: [],
      watchlist: []
    });
  } catch (error) {
    console.error('Error initializing user data:', error);
  }
};

// Get user data
export const getUserData = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Add to watchlist
export const addToWatchlist = async (userId, symbol) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const watchlist = userData.watchlist || [];
    
    if (!watchlist.includes(symbol)) {
      watchlist.push(symbol);
      await setDoc(userRef, { ...userData, watchlist }, { merge: true });
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
  }
}; 