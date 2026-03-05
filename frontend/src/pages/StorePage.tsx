import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
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
import { apiFetch, apiUpload } from '../api/client';
import { Category, Order, Product } from '../types';

export function StorePage() {
  const navigate = useNavigate();

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

  useEffect(() => {
    void fetchCategories();
    void fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await apiFetch<Category[]>('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery);
      }

      const url = `/api/products${params.toString() ? `?${params}` : ''}`;
      const data = await apiFetch<Product[]>(url);
      setAllProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      void fetchProducts();
    }, 300);
    return () => clearTimeout(debounce);
  }, [selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => allProducts, [allProducts]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const onAccountClick = () => {
    if (!auth.isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }
    if (auth.user?.role === 'ADMIN') {
      navigate('/admin');
      return;
    }
    setIsAccountOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={cart.cartCount}
        wishlistCount={wishlist.wishlistCount}
        onCartClick={() => cart.setIsCartOpen(true)}
        onSearchChange={setSearchQuery}
        onAccountClick={onAccountClick}
        userName={auth.user?.name}
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
        loading={loading}
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
        onCheckout={() => {
          cart.setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onAddToCart={cart.addToCart}
        onToggleWishlist={wishlist.toggleWishlist}
        isInWishlist={selectedProduct ? wishlist.isInWishlist(selectedProduct.id) : false}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        loading={auth.loading}
        onLogin={async (email, password) => {
          await auth.login(email, password);
        }}
        onRegister={async (name, email, password) => {
          await auth.register(name, email, password);
        }}
      />

      {auth.user && auth.user.role !== 'ADMIN' && (
        <AccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          user={{ name: auth.user.name, email: auth.user.email }}
          onLogout={auth.logout}
          loadOrders={async () => {
            return await apiFetch<Order[]>('/api/orders/me');
          }}
          uploadSlip={async (orderId, slip) => {
            const form = new FormData();
            form.append('slip', slip);
            const data = await apiUpload<{ order: Order }>(`/api/orders/${orderId}/payment-slip`, form);
            return data.order;
          }}
        />
      )}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart.cartItems}
        total={Math.round(cart.cartTotal * 35)}
        isAuthenticated={auth.isAuthenticated}
        onCreateOrder={async (input) => {
          const order = await apiFetch<Order>('/api/orders', {
            method: 'POST',
            body: JSON.stringify(input),
          });
          cart.clearCart();
          return order;
        }}
        onUploadSlip={async (orderId, slip) => {
          const form = new FormData();
          form.append('slip', slip);
          const data = await apiUpload<{ order: Order }>(`/api/orders/${orderId}/payment-slip`, form);
          return data.order;
        }}
      />
    </div>
  );
}
