import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Grid, List, Loader2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from '../services/api';

export function ShopPage({ onProductClick }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please check if the server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [category, sortBy]);

  return (
    <div className="min-h-screen bg-[#FFFCF9] pb-24">
      <div className="bg-[#F5F0EB] border-b border-[#DDD5CC] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-[#3D3229] mb-4">
            The Collection
          </h1>
          <p className="text-[#8B7D6B] max-w-2xl">
            Explore our complete range of architectural jewelry. Each piece is
            designed with precision and crafted for longevity.
          </p>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-[#FFFCF9]/90 backdrop-blur border-b border-[#DDD5CC] px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-[#3D3229] text-white'
                    : 'text-[#6B5D50] hover:bg-[#EDE7E0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
            <div className="relative group">
              <button className="flex items-center space-x-2 text-sm font-medium text-[#5C4F43] hover:text-[#3D3229]">
                <span>Sort by</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-[#FFFCF9] border border-[#DDD5CC] shadow-lg rounded-md overflow-hidden hidden group-hover:block">
                <button
                  onClick={() => setSortBy('newest')}
                  className="block w-full text-left px-4 py-2 text-sm text-[#5C4F43] hover:bg-[#F5F0EB]"
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('price-low')}
                  className="block w-full text-left px-4 py-2 text-sm text-[#5C4F43] hover:bg-[#F5F0EB]"
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => setSortBy('price-high')}
                  className="block w-full text-left px-4 py-2 text-sm text-[#5C4F43] hover:bg-[#F5F0EB]"
                >
                  Price: High to Low
                </button>
              </div>
            </div>

            <div className="h-6 w-px bg-[#C9BDB0]" />

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-[#EDE7E0] text-[#3D3229]'
                    : 'text-[#B8A99A] hover:text-[#6B5D50]'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-[#EDE7E0] text-[#3D3229]'
                    : 'text-[#B8A99A] hover:text-[#6B5D50]'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#3D3229]" />
            <p className="text-[#8B7D6B]">Loading our collection...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-[#FFF5F5] border border-red-100 rounded-lg">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-sm text-red-400">
              Make sure your Go backend is running on http://localhost:8080
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid ${
              viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8'
                : 'grid-cols-1 gap-4'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={onProductClick}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[#8B7D6B] text-lg">
              No products found in this category.
            </p>
            <button
              onClick={() => setCategory('All')}
              className="mt-4 text-[#3D3229] underline hover:text-[#5C4F43]"
            >
              View all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
