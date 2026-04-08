import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export function Header({ currentPage, onNavigate }) {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
  {
    name: 'Home',
    value: 'home'
  },
  {
    name: 'Shop',
    value: 'shop'
  },
  {
    name: 'About',
    value: 'about'
  }];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFCF9]/80 backdrop-blur-md border-b border-[#DDD5CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#6B5D50] hover:text-[#3D3229]">

              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}>

            <span className="font-bold text-xl tracking-[0.2em] text-[#3D3229]">
              AARTI ABHUSHAN
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) =>
            <button
              key={item.value}
              onClick={() => onNavigate(item.value)}
              className={`text-sm font-medium transition-colors duration-200 ${currentPage === item.value ? 'text-[#3D3229] border-b-2 border-[#3D3229]' : 'text-[#8B7D6B] hover:text-[#3D3229]'}`}>

                {item.name}
              </button>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-[#B8A99A] hover:text-[#6B5D50] transition-colors">
              <Search size={20} />
            </button>
            <button
              className="p-2 text-[#6B5D50] hover:text-[#3D3229] transition-colors relative"
              onClick={() => onNavigate('cart')}>

              <ShoppingBag size={20} />
              {cartCount > 0 &&
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#4A3F35] rounded-full">
                  {cartCount}
                </span>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen &&
      <div className="md:hidden bg-[#FFFCF9] border-b border-[#DDD5CC]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) =>
          <button
            key={item.value}
            onClick={() => {
              onNavigate(item.value);
              setIsMobileMenuOpen(false);
            }}
            className={`block w-full text-left px-3 py-2 text-base font-medium ${currentPage === item.value ? 'text-[#3D3229] bg-[#F5F0EB]' : 'text-[#8B7D6B] hover:text-[#3D3229] hover:bg-[#F5F0EB]'}`}>

                {item.name}
              </button>
          )}
          </div>
        </div>
      }
    </header>);

}