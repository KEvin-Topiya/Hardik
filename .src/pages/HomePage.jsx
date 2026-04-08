import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';

export function HomePage({ onNavigate, onProductClick }) {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="w-full">
      <section className="relative h-[90vh] w-full bg-[#F5F0EB] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        <div className="absolute top-0 left-1/4 w-px h-full bg-[#DDD5CC]" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-[#DDD5CC]" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-[#DDD5CC]" />
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-[#DDD5CC]" />

        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-7xl font-bold text-[#3D3229] tracking-tight mb-6"
          >
            ARCHITECTURE OF <br />
            <span className="text-[#B8A99A] font-light">ADORNMENT</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-lg md:text-xl text-[#6B5D50] mb-10 max-w-2xl mx-auto font-light"v
          >
            Precision crafted jewelry inspired by modern structural forms.
            Where geometry meets luxury.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <Button
              size="lg"
              onClick={() => onNavigate('shop')}
              className="group"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#3D3229] mb-4">
            CURATED COLLECTIONS
          </h2>
          <div className="w-24 h-px bg-[#C9BDB0] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#DDD5CC] border border-[#DDD5CC]">
          {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map(
            (category, idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-[#FFFCF9] p-12 aspect-square flex flex-col items-center justify-center group cursor-pointer hover:bg-[#F5F0EB] transition-colors"
                onClick={() => onNavigate('shop')}
              >
                <div className="w-24 h-24 border border-[#DDD5CC] rounded-full mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="w-16 h-16 border border-[#EDE7E0] rounded-full" />
                </div>

                <h3 className="text-xl font-medium text-[#3D3229] tracking-wide">
                  {category}
                </h3>

                <span className="text-xs text-[#B8A99A] mt-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  View All
                </span>
              </motion.div>
            )
          )}
        </div>
      </section>

      <section className="py-24 bg-[#EDE7E0] border-y border-[#DDD5CC]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            <AnimatedCounter value={47} label="Years of Craft" />
            <AnimatedCounter value={12400} label="Pieces Created" suffix="+" />
            <AnimatedCounter value={23} label="Master Artisans" />
            <AnimatedCounter value={38} label="Countries Served" />
          </div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#3D3229] mb-2">
              FEATURED PIECES
            </h2>
            <p className="text-[#8B7D6B]">
              Highlights from our latest architectural series.
            </p>
          </div>

          <Button variant="outline" onClick={() => onNavigate('shop')}>
            View All
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onProductClick}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
