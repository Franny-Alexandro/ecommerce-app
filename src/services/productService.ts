import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import { convertFileToBase64, resizeImage, validateImageFile } from '../utils/imageUtils';

export const createProduct = async (productData: Omit<Product, 'id' | 'images'>, imageFiles: File[]) => {
  try {
    // Convertir imágenes a base64
    const imageBase64Array: string[] = [];
    
    for (const file of imageFiles) {
      // Validar archivo
      validateImageFile(file);
      
      // Redimensionar y convertir a base64
      const base64Image = await resizeImage(file, 800, 600, 0.8);
      imageBase64Array.push(base64Image);
    }

    // Crear producto con imágenes en base64
    const product = {
      ...productData,
      images: imageBase64Array,
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 0,
      reviewCount: 0
    };

    const docRef = await addDoc(collection(db, 'products'), product);
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const getProducts = async (filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  limit?: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}) => {
  try {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters?.minPrice !== undefined) {
      q = query(q, where('price', '>=', filters.minPrice));
    }

    if (filters?.maxPrice !== undefined) {
      q = query(q, where('price', '<=', filters.maxPrice));
    }

    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }

    if (filters?.lastDoc) {
      q = query(q, startAfter(filters.lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    // Filter by search term (client-side for now)
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {

    // Eliminar documento del producto (las imágenes base64 se eliminan automáticamente)
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const getProductsBySupervisor = async (supervisorId: string) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('supervisorId', '==', supervisorId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error getting supervisor products:', error);
    throw error;
  }
};