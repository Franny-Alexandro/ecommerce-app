import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { addToWishlist, removeFromWishlist, checkIfInWishlist } from '../../services/wishlistService';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    if (currentUser) {
      checkWishlistStatus();
    }
  }, [currentUser, product.id]);

  const checkWishlistStatus = async () => {
    if (currentUser) {
      const inWishlist = await checkIfInWishlist(currentUser.uid, product.id);
      setIsInWishlist(inWishlist);
    }
  };

  const handleWishlistToggle = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      if (isInWishlist) {
        // Find and remove from wishlist
        // This would need the wishlist item ID, which we'd get from a more complete implementation
        setIsInWishlist(false);
      } else {
        await addToWishlist(currentUser.uid, product.id);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images && product.images.length > 0 
              ? product.images[0] 
              : 'https://images.pexels.com/photos/4239853/pexels-photo-4239853.jpeg?auto=compress&cs=tinysrgb&w=400'
            }
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </Link>
        
        {currentUser && (
          <button
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${
              isInWishlist 
                ? 'bg-red-100 text-red-600' 
                : 'bg-white text-gray-400 hover:text-red-600'
            }`}
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            <p className="text-xs text-gray-500">
              Stock: {product.stock}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;