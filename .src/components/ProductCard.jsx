import React from 'react';
import { motion } from 'framer-motion';

export function ProductCard({ product, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F0EB] border border-[#DDD5CC] mb-2 sm:mb-4 rounded-sm">
        {/* Geometric Placeholder Art */}
        <div className="absolute inset-0 w-full h-full bg-architectural-gradient opacity-50 transition-transform duration-700 group-hover:scale-105" />

        {/* Decorative Geometric Elements */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div
            className={`w-16 h-16 sm:w-32 sm:h-32 border border-[#C9BDB0] ${
              parseInt(product.id) % 2 === 0 ? 'rounded-full' : 'rotate-45'
            }`}
          />

          <div
            className={`absolute w-12 h-12 sm:w-24 sm:h-24 border border-[#C9BDB0] ${
              parseInt(product.id) % 3 === 0 ? 'rotate-12' : '-rotate-12'
            }`}
          />
        </div>

        {/* "Image" Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFCF9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="space-y-0.5 sm:space-y-1">
        <h3 className="text-xs sm:text-base font-medium text-[#3D3229] group-hover:text-[#6B5D50] transition-colors leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-[#8B7D6B] uppercase tracking-wide">
          {product.material}
        </p>
        <p className="text-xs sm:text-sm font-semibold text-[#3D3229] mt-1 sm:mt-2">
          ${product.price.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
