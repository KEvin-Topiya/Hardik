import React, { useState } from 'react';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/Button';

export function CartPage({ onNavigate }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [shippingMethod, setShippingMethod] = useState('standard');
  const shippingCost =
  cartTotal > 5000 ? 0 : shippingMethod === 'express' ? 35 : 15;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shippingCost + tax;
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-[#EDE7E0] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-[#B8A99A]" />
        </div>
        <h2 className="text-2xl font-bold text-[#3D3229] mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#8B7D6B] mb-8">
          Looks like you haven't added any pieces yet.
        </p>
        <Button onClick={() => onNavigate('shop')}>Start Shopping</Button>
      </div>);

  }
  return (
    <div className="min-h-screen bg-[#FFFCF9] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#3D3229] mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="border-t border-[#DDD5CC]">
              {cart.map((item) =>
              <div
                key={item.id}
                className="py-8 border-b border-[#DDD5CC] flex items-center gap-6">

                  {/* Image */}
                  <div className="w-24 h-24 bg-[#F5F0EB] border border-[#DDD5CC] flex-shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-architectural-gradient opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <div className="w-12 h-12 border border-[#C9BDB0] rounded-full" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-[#3D3229] truncate pr-4">
                        {item.name}
                      </h3>
                      <p className="text-lg font-semibold text-[#3D3229]">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-[#8B7D6B] mb-4">
                      {item.material}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[#C9BDB0] rounded-md">
                        <button
                        onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 text-[#6B5D50] hover:bg-[#F5F0EB] disabled:opacity-50"
                        disabled={item.quantity <= 1}>

                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-[#3D3229] border-x border-[#C9BDB0] min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                        onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 text-[#6B5D50] hover:bg-[#F5F0EB]">

                          +
                        </button>
                      </div>

                      <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center">

                        <Trash2 size={16} className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#F5F0EB] p-8 rounded-lg border border-[#DDD5CC] sticky top-24">
              <h2 className="text-lg font-bold text-[#3D3229] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#6B5D50]">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[#6B5D50]">
                  <span>Shipping</span>
                  <div className="text-right">
                    <select
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-sm border-[#C9BDB0] rounded-md bg-[#FFFCF9] py-1 px-2 focus:ring-[#8B7D6B] focus:border-[#8B7D6B]">

                      <option value="standard">Standard ($15)</option>
                      <option value="express">Express ($35)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between text-[#6B5D50]">
                  <span>Estimated Tax</span>
                  <span>
                    $
                    {tax.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>

                {cartTotal > 5000 &&
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-100">
                    Complimentary shipping applied on orders over $5,000
                  </div>
                }
              </div>

              <div className="border-t border-[#DDD5CC] pt-4 mb-8">
                <div className="flex justify-between text-lg font-bold text-[#3D3229]">
                  <span>Total</span>
                  <span>
                    $
                    {finalTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>

              <Button fullWidth size="lg" className="mb-4">
                Proceed to Checkout
              </Button>

              <button
                onClick={() => onNavigate('shop')}
                className="w-full text-center text-sm text-[#8B7D6B] hover:text-[#3D3229] flex items-center justify-center">

                Continue Shopping <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}