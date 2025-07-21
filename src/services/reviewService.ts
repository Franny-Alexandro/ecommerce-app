import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  increment 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Review } from '../types';

export const addReview = async (
  productId: string, 
  userId: string, 
  userName: string, 
  rating: number, 
  comment: string
) => {
  try {
    const reviewData = {
      productId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'reviews'), reviewData);
    
    // Update product rating
    await updateProductRating(productId);
    
    return { id: docRef.id, ...reviewData };
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const getProductReviews = async (productId: string) => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() } as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting product reviews:', error);
    throw error;
  }
};

const updateProductRating = async (productId: string) => {
  try {
    const reviews = await getProductReviews(productId);
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      rating: averageRating,
      reviewCount: reviews.length,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};