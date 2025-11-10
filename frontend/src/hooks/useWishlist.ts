import { useState, useCallback } from 'react';
import { Product } from '../types';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems(items => {
      if (items.some(item => item.id === product.id)) {
        return items;
      }
      return [...items, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems(items => items.filter(item => item.id !== productId));
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const toggleWishlist = useCallback((product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist
  };
};