import { writable } from 'svelte/store';

const initialCart = JSON.parse(localStorage.getItem('meridian_cart') || '[]');

export const cart = writable(initialCart);

cart.subscribe((value) => {
  localStorage.setItem('meridian_cart', JSON.stringify(value));
});

export const addToCart = (product, quantity = 1) => {
  cart.update((items) => {
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      return items.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
      );
    }
    return [...items, { ...product, quantity }];
  });
};

export const removeFromCart = (productId) => {
  cart.update((items) => items.filter((i) => i.id !== productId));
};

export const updateQuantity = (productId, quantity) => {
  cart.update((items) =>
    items.map((i) => (i.id === productId ? { ...i, quantity } : i))
  );
};

export const clearCart = () => cart.set([]);
