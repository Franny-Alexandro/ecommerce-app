import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { WishlistItem } from '../types';

export const addToWishlist = async (userId: string, productId: string) => {
  try {
    const wishlistData = {
      userId,
      productId,
      addedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'wishlist'), wishlistData);
    return { id: docRef.id, ...wishlistData };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (wishlistItemId: string) => {
  try {
    await deleteDoc(doc(db, 'wishlist', wishlistItemId));
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const getUserWishlist = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'wishlist'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const wishlistItems: WishlistItem[] = [];
    
    querySnapshot.forEach((doc) => {
      wishlistItems.push({ id: doc.id, ...doc.data() } as WishlistItem);
    });
    
    return wishlistItems;
  } catch (error) {
    console.error('Error getting user wishlist:', error);
    throw error;
  }
};

export const checkIfInWishlist = async (userId: string, productId: string) => {
  try {
    const q = query(
      collection(db, 'wishlist'),
      where('userId', '==', userId),
      where('productId', '==', productId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};