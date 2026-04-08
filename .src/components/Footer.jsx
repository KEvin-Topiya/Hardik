import React from 'react';

export function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#FFFCF9] border-t border-[#DDD5CC] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <span
              className="font-bold text-xl tracking-[0.2em] text-[#3D3229] block mb-4 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              MERIDIAN
            </span>
            <p className="text-[#8B7D6B] text-sm leading-relaxed">
              Architecture of Adornment. Precision crafted jewelry for the
              modern minimalist.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-sm font-semibold text-[#3D3229] tracking-wider uppercase mb-4">
              Collections
            </h3>
            <ul className="space-y-3">
              {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="text-sm text-[#8B7D6B] hover:text-[#3D3229] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-[#3D3229] tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {['About Us', 'Craftsmanship', 'Sustainability', 'Careers'].map(
                (item) => (
                  <li key={item}>
                    <button
                      onClick={() =>
                        item === 'About Us' ? onNavigate('about') : null
                      }
                      className="text-sm text-[#8B7D6B] hover:text-[#3D3229] transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-[#3D3229] tracking-wider uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-[#8B7D6B]">
              <li>concierge@meridian.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Precision Ave, New York, NY</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#EDE7E0] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-[#B8A99A]">
            &copy; {new Date().getFullYear()} Meridian Jewelry. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="text-xs text-[#B8A99A] hover:text-[#6B5D50] cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-xs text-[#B8A99A] hover:text-[#6B5D50] cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
