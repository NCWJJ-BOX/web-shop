import { useEffect, useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { FlashSale } from '../components/FlashSale';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductGrid } from '../components/ProductGrid';
import { Cart } from '../components/Cart';
import { ProductModal } from '../components/ProductModal';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { AccountModal } from '../components/AccountModal';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import { Category, Product, Order } from '../types';
import { fetchCategories, fetchProducts } from '../lib/db';
import { createOrder, uploadSlip, getMyOrders } from '../lib/orders';

export function StorePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const cart = useCart();
  const wishlist = useWishlist();
  const auth = useAuth();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const catId = selectedCategory === 'all' ? undefined : selectedCategory;
      const q = searchQuery || undefined;
      const data = await fetchProducts(catId, q);
      setAllProducts(data);
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };
  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCheckout = () => {
    if (!auth.isAuthenticated) {
      setIsCheckoutOpen(false);
      setIsAuthOpen(true);
      return;
    }
    cart.setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleAccountClick = () => {
    if (auth.isAuthenticated) {
      setIsAccountOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleCreateOrder = async (input: {
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    items: { productId: string; quantity: number }[];
  }): Promise<Order> => {
    const order = await createOrder(input);
    cart.clearCart();
    return order;
  };

  const handleUploadSlip = async (orderId: string, slip: File): Promise<Order> => {
    return uploadSlip(orderId, slip);
  };

  const handleLoadOrders = async (): Promise<Order[]> => {
    return getMyOrders();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header
        cartCount={cart.cartCount}
        wishlistCount={wishlist.wishlistCount}
        onCartClick={() => cart.setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
        onAccountClick={handleAccountClick}
        userName={auth.user?.name}
      />

      <main>
        <Hero />
        <FlashSale />
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
        <ProductGrid
          products={allProducts}
          onAddToCart={cart.addToCart}
          onToggleWishlist={wishlist.toggleWishlist}
          isInWishlist={wishlist.isInWishlist}
          onQuickView={openProductModal}
          loading={loading}
        />
      </main>

      <Footer />

      <Cart
        isOpen={cart.isCartOpen}
        onClose={() => cart.setIsCartOpen(false)}
        items={cart.cartItems}
        total={cart.cartTotal}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
        onClearCart={cart.clearCart}
        onCheckout={handleCheckout}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onAddToCart={cart.addToCart}
        onToggleWishlist={wishlist.toggleWishlist}
        isInWishlist={selectedProduct ? wishlist.isInWishlist(selectedProduct.id) : false}
        onBuyNow={(product) => {
          cart.addToCart(product);
          closeProductModal();
          handleCheckout();
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        loading={auth.loading}
        onLogin={auth.login}
        onRegister={auth.register}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart.cartItems}
        total={cart.cartTotal}
        isAuthenticated={auth.isAuthenticated}
        onCreateOrder={handleCreateOrder}
        onUploadSlip={handleUploadSlip}
      />

      {auth.user && (
        <AccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          user={auth.user}
          onLogout={auth.logout}
          loadOrders={handleLoadOrders}
          uploadSlip={handleUploadSlip}
        />
      )}
    </div>
  );
}
