import React, { useEffect, useState } from 'react';
import { CartProvider } from './hooks/useCart';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedProduct]);

  const navigate = (page) => {
    setCurrentPage(page);
    if (page !== 'product') {
      setSelectedProduct(null);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={navigate}
            onProductClick={handleProductClick}
          />
        );

      case 'shop':
        return <ShopPage onProductClick={handleProductClick} />;

      case 'product':
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => navigate('shop')}
            onNavigate={navigate}
            onProductClick={handleProductClick}
          />
        ) : (
          <ShopPage onProductClick={handleProductClick} />
        );

      case 'cart':
        return <CartPage onNavigate={navigate} />;

      case 'about':
        return <AboutPage />;

      default:
        return (
          <HomePage
            onNavigate={navigate}
            onProductClick={handleProductClick}
          />
        );
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#FFFCF9]">
        <Header currentPage={currentPage} onNavigate={navigate} />
        <main className="flex-grow">{renderPage()}</main>
        <Footer onNavigate={navigate} />
      </div>
    </CartProvider>
  );
}
