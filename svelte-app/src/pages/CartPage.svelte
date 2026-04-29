<script>
  import { createEventDispatcher } from 'svelte';
  import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, MessageCircle } from 'lucide-svelte';
  import { cart, removeFromCart, updateQuantity, clearCart } from '../lib/cart';
  import { sendWhatsAppOrder } from '../lib/whatsapp';
  import { fade, fly } from 'svelte/transition';
  import SEO from '../components/SEO.svelte';

  const dispatch = createEventDispatcher();

  $: cartItems = $cart;
  $: cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  function handleNav(id) {
    dispatch('navigate', id);
  }

  function handlePlaceOrder() {
    if (cartItems.length === 0) return;
    sendWhatsAppOrder(cartItems, cartTotal);
  }
</script>

<SEO 
  title="Your Collection | Aarti Abhushan" 
  description="Review the exquisite pieces in your collection and proceed to acquire them via direct studio contact."
  keywords="jewelry cart, checkout jewelry, Aarti Abhushan order, luxury jewelry shopping"
/>

<div class="min-h-screen bg-[#FFFCF9] pb-24">
  <div class="bg-[#F5F0EB] border-b border-[#DDD5CC] py-12 px-4 shadow-sm">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <button 
          on:click={() => handleNav('shop')}
          class="flex items-center space-x-2 text-[#8B7D6B] hover:text-[#3D3229] transition-colors mb-4 text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} />
          <span>Continue Shopping</span>
        </button>
        <h1 class="text-4xl font-bold text-[#3D3229]">Your Collection</h1>
      </div>
      {#if cartItems.length > 0}
        <button 
          on:click={clearCart}
          class="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center transition-colors"
        >
          <Trash2 size={14} class="mr-1" /> Clear Cart
        </button>
      {/if}
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 py-12">
    {#if cartItems.length === 0}
      <div class="text-center py-24 space-y-6" in:fade>
        <div class="mx-auto w-24 h-24 rounded-full bg-[#F5F0EB] flex items-center justify-center text-[#B8A99A]">
          <ShoppingBag size={48} strokeWidth={1} />
        </div>
        <div class="space-y-2">
          <p class="text-[#3D3229] text-xl font-bold">Your cart is empty.</p>
          <p class="text-[#8B7D6B] max-w-md mx-auto">It seems you haven't added any architectural pieces to your collection yet.</p>
        </div>
        <button 
          on:click={() => handleNav('shop')}
          class="px-8 py-4 bg-[#3D3229] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#5C4F43] transition-all"
        >
          Browse Collection
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- List -->
        <div class="lg:col-span-2 space-y-8">
          {#each cartItems as item (item.id)}
            <div 
              class="flex flex-col sm:flex-row gap-6 pb-8 border-b border-[#EDE7E0] group"
              in:fly={{ y: 20, duration: 400 }}
            >
              <div class="w-24 h-24 sm:w-32 sm:h-32 bg-[#F5F0EB] border border-[#DDD5CC] rounded-sm flex items-center justify-center shrink-0">
                <!-- Geometric Minimal Icon -->
                <div class="w-8 h-8 sm:w-12 sm:h-12 border border-[#C9BDB0] rounded-full group-hover:rotate-45 transition-transform duration-700" />
              </div>
              
              <div class="flex-grow flex flex-col justify-between">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-bold text-[#3D3229] mb-1">{item.name}</h3>
                    <p class="text-xs text-[#8B7D6B] uppercase tracking-widest font-bold">{item.category} • {item.material}</p>
                  </div>
                  <p class="text-lg font-bold text-[#3D3229]">${item.price.toLocaleString()}</p>
                </div>
                
                <div class="flex items-center justify-between mt-4">
                  <div class="flex items-center border border-[#DDD5CC] rounded-sm bg-white shadow-sm overflow-hidden">
                    <button 
                      on:click={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      class="px-3 py-1.5 hover:bg-[#F5F0EB] transition-colors text-[#3D3229]"
                    >
                      <Minus size={14} />
                    </button>
                    <span class="px-4 py-1.5 text-sm font-bold text-[#3D3229] border-x border-[#DDD5CC] min-w-[40px] text-center">{item.quantity}</span>
                    <button 
                      on:click={() => updateQuantity(item.id, item.quantity + 1)}
                      class="px-3 py-1.5 hover:bg-[#F5F0EB] transition-colors text-[#3D3229]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button 
                    on:click={() => removeFromCart(item.id)}
                    class="text-xs font-bold uppercase tracking-widest text-[#B8A99A] hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Summary -->
        <div class="lg:col-span-1">
          <div class="bg-[#F5F0EB] p-8 rounded-sm space-y-8 sticky top-32 border border-[#DDD5CC] shadow-sm">
            <h3 class="text-xl font-bold text-[#3D3229] uppercase tracking-widest border-b border-[#DDD5CC] pb-4">Summary</h3>
            
            <div class="space-y-4">
              <div class="flex justify-between text-[#6B5D50]">
                <span class="text-sm font-medium">Subtotal</span>
                <span class="text-sm font-bold">${cartTotal.toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-[#6B5D50]">
                <span class="text-sm font-medium">Shipping</span>
                <span class="text-sm font-bold">Complimentary</span>
              </div>
              <div class="pt-4 border-t border-[#DDD5CC] flex justify-between">
                <span class="text-lg font-bold text-[#3D3229] uppercase tracking-widest">Total</span>
                <span class="text-lg font-bold text-[#3D3229]">${cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <div class="space-y-4">
               <button 
                on:click={handlePlaceOrder}
                class="w-full py-5 bg-[#25D366] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#128C7E] transition-all flex items-center justify-center shadow-lg active:scale-95"
              >
                <MessageCircle size={18} class="mr-2" /> 
                Place Order via WhatsApp
              </button>
              
              <div class="flex items-center justify-center space-y-1 py-4 px-2">
                <p class="text-[10px] text-center text-[#8B7D6B] leading-relaxed font-medium uppercase tracking-tight">
                  Instant confirmation via WhatsApp. Fast secure and direct connection to our studio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
