import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, ArrowLeft, Check } from 'lucide-react';
import { products } from '../data/products';
import { Button } from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import { ProductCard } from '../components/ProductCard';

export function ProductDetailPage({
  product,
  onBack,
  onNavigate,
  onProductClick
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FFFCF9] pb-24">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-[#8B7D6B] hover:text-[#3D3229] transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Collection
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="relative">
            <div
              className={`aspect-[4/5] bg-[#F5F0EB] border border-[#DDD5CC] overflow-hidden cursor-zoom-in relative group ${
                isZoomed ? 'cursor-zoom-out' : ''
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <div
                className={`w-full h-full bg-architectural-gradient transition-transform duration-700 ease-out ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="w-64 h-64 border border-[#C9BDB0] rounded-full" />
                  <div className="absolute w-48 h-48 border border-[#C9BDB0] rotate-45" />
                  <div className="absolute w-32 h-32 border border-[#C9BDB0] -rotate-12" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-[#FFFCF9]/80 backdrop-blur px-3 py-1 text-xs font-medium text-[#6B5D50] rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {isZoomed ? 'Click to Reset' : 'Click to Zoom'}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-sm font-medium text-[#8B7D6B] uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-[#3D3229] mb-4">
              {product.name}
            </h1>

            <p className="text-2xl font-light text-[#3D3229] mb-8">
              ${product.price.toLocaleString()}
            </p>

            <div className="mb-10">
              <p className="text-[#6B5D50] leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="bg-[#F5F0EB] p-6 mb-10 border border-[#EDE7E0]">
              <h3 className="text-sm font-semibold text-[#3D3229] uppercase tracking-wider mb-2">
                Composition
              </h3>
              <p className="text-[#5C4F43]">{product.material}</p>
              {product.specs.stone && (
                <p className="text-[#6B5D50] text-sm mt-1">
                  {product.specs.stone}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-6 mb-12">
              <div className="flex items-center border border-[#C9BDB0] rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-[#6B5D50] hover:text-[#3D3229] hover:bg-[#F5F0EB] transition-colors"
                >
                  <Minus size={16} />
                </button>

                <span className="w-12 text-center font-medium text-[#3D3229]">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-[#6B5D50] hover:text-[#3D3229] hover:bg-[#F5F0EB] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <Button
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={isAdded}
                className="flex-1"
              >
                {isAdded ? (
                  <span className="flex items-center justify-center">
                    <Check className="mr-2 h-5 w-5" /> Added to Cart
                  </span>
                ) : (
                  'Add to Cart'
                )}
              </Button>
            </div>

            <div className="border-t border-[#DDD5CC] pt-8">
              <h3 className="text-lg font-bold text-[#3D3229] mb-6">
                Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex justify-between py-2 border-b border-[#EDE7E0]">
                  <span className="text-[#8B7D6B]">Weight</span>
                  <span className="text-[#3D3229] font-medium">
                    {product.specs.weight}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-[#EDE7E0]">
                  <span className="text-[#8B7D6B]">Dimensions</span>
                  <span className="text-[#3D3229] font-medium">
                    {product.specs.dimensions}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-[#EDE7E0]">
                  <span className="text-[#8B7D6B]">Finish</span>
                  <span className="text-[#3D3229] font-medium">
                    {product.specs.finish}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-[#EDE7E0]">
                  <span className="text-[#8B7D6B]">Material</span>
                  <span className="text-[#3D3229] font-medium">
                    {product.material}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-32 border-t border-[#DDD5CC] pt-16">
            <h2 className="text-2xl font-bold text-[#3D3229] mb-8">
              You May Also Like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={onProductClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
