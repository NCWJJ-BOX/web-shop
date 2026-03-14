import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { ProductModal } from './components/ProductModal';
import { Footer } from './components/Footer';
import { useCart } from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';
import { products, categories } from './data/mockData';
import { Product } from './types';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const cart = useCart();
  const wishlist = useWishlist();

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={cart.cartCount}
        wishlistCount={wishlist.wishlistCount}
        onCartClick={() => cart.setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
      />
      
      <Hero />
      
      <CategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      <ProductGrid
        products={filteredProducts}
        onAddToCart={cart.addToCart}
        onToggleWishlist={wishlist.toggleWishlist}
        isInWishlist={wishlist.isInWishlist}
        onQuickView={handleQuickView}
      />
      
      <Footer />

      <Cart
        isOpen={cart.isCartOpen}
        onClose={() => cart.setIsCartOpen(false)}
        items={cart.cartItems}
        total={cart.cartTotal}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
        onClearCart={cart.clearCart}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onAddToCart={cart.addToCart}
        onToggleWishlist={wishlist.toggleWishlist}
        isInWishlist={selectedProduct ? wishlist.isInWishlist(selectedProduct.id) : false}
      />
    </div>
  );
}

export default App;