<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { ArrowLeft, Diamond, ShoppingCart, Check, Info } from 'lucide-svelte';
  import { addToCart } from '../lib/cart';
  import { fade, fly } from 'svelte/transition';
  import { IMAGE_BASE_URL, getImageUrl } from '../services/api';
  import SEO from '../components/SEO.svelte';

  export let product;
  const dispatch = createEventDispatcher();
  
  let quantity = 1;
  let added = false;
  let currentImageIndex = 0;

  $: images = product.images || [];
  $: activeImage = images[currentImageIndex] || null;

  function handleBack() {
    dispatch('back');
  }

  function handleAddToCart() {
    addToCart(product, quantity);
    added = true;
    setTimeout(() => (added = false), 2000);
  }

  function handleNav(id) {
    dispatch('navigate', id);
  }
</script>

<SEO 
  title="{product.name} | Aarti Abhushan" 
  description={product.description}
  keywords="{product.name}, {product.category}, {product.material}, jewelry, Aarti Abhushan"
/>

<div class="min-h-screen bg-[#FFFCF9] pb-12 sm:pb-24" in:fade>
  <div class="max-w-7xl mx-auto px-4 py-4 sm:py-8">
    <button 
      on:click={handleBack}
      class="flex items-center space-x-2 text-[#8B7D6B] hover:text-[#3D3229] transition-colors mb-4 sm:mb-8 text-xs font-bold uppercase tracking-widest"
    >
      <ArrowLeft size={16} />
      <span>Back to collection</span>
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
      <!-- Image / Form Section -->
      <div class="flex flex-col space-y-4">
        <!-- Main Image -->
        <div 
          class="aspect-[4/5] bg-[#F5F0EB] border border-[#DDD5CC] rounded-sm relative flex items-center justify-center overflow-hidden"
          in:fly={{ x: -20, duration: 600 }}
        >
          {#if activeImage}
            <img src={getImageUrl(activeImage)} alt={product.name} class="w-full h-full object-cover transition-all duration-300" />
          {:else}
            <div class="absolute inset-0 z-0 opacity-20">
               <div class="w-full h-full border-[100px] border-[#3D3229] rounded-full scale-150 transform -translate-x-1/2 -translate-y-1/2 absolute top-0 left-0" />
            </div>
            
            <div class="relative z-10 p-12 text-center space-y-8">
               <div class="mx-auto w-32 h-32 sm:w-64 sm:h-64 border border-[#C9BDB0] rounded-full flex items-center justify-center">
                 <div class="w-24 h-24 sm:w-48 sm:h-48 border border-[#C9BDB0] rotate-45 transform scale-75 animate-pulse" />
               </div>
            </div>
          {/if}
          
        </div>

        <!-- Thumbnails -->
        {#if images.length > 1}
          <div class="flex space-x-4 overflow-x-auto pb-2">
            {#each images as img, i}
              <button 
                on:click={() => currentImageIndex = i}
                class="w-20 h-24 flex-shrink-0 border {currentImageIndex === i ? 'border-[#3D3229]' : 'border-[#DDD5CC] opacity-60 hover:opacity-100'} transition-all overflow-hidden rounded-sm bg-[#F5F0EB]"
              >
                <img src={getImageUrl(img)} alt="{product.name} view {i + 1}" class="w-full h-full object-cover" />
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Content Section -->
      <div class="flex flex-col justify-center space-y-6 sm:space-y-12" in:fly={{ x: 20, duration: 600, delay: 200 }}>
        <div class="space-y-2 sm:space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B7D6B]">{product.category} • {product.material}</p>
          <h1 class="text-3xl sm:text-6xl font-bold text-[#3D3229] leading-tight tracking-tight">{product.name}</h1>
          <p class="text-[10px] uppercase font-bold tracking-[0.4em] text-[#8B7D6B] mt-1 mb-2 sm:mb-4 opacity-70">Ref: FR-00{product.id}</p>
          <p class="text-2xl font-bold text-[#3D3229]">₹{product.price.toLocaleString()}</p>
        </div>

        <p class="text-[#6B5D50] text-base sm:text-lg font-medium leading-relaxed max-w-xl">
          {product.description}
        </p>

        <!-- Specs -->
        <div class="grid grid-cols-2 gap-4 sm:gap-8 py-4 sm:py-8 border-y border-[#EDE7E0]">
          <div class="space-y-1">
            <h4 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A]">Weight</h4>
            <p class="text-sm font-bold text-[#3D3229]">{product.weight}</p>
          </div>
          <div class="space-y-1">
            <h4 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A]">Dimensions</h4>
            <p class="text-sm font-bold text-[#3D3229]">{product.dimensions}</p>
          </div>
          <div class="space-y-1">
            <h4 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A]">Finish</h4>
            <p class="text-sm font-bold text-[#3D3229]">{product.finish}</p>
          </div>
          <div class="space-y-1">
            <h4 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A]">Primary Stone</h4>
            <p class="text-sm font-bold text-[#3D3229]">{product.stone}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
           <div class="flex items-center border border-[#3D3229] rounded-sm bg-white self-start">
            <button 
              on:click={() => (quantity = Math.max(1, quantity - 1))}
              class="px-5 py-4 hover:bg-[#F5F0EB] transition-colors"
            >
              -
            </button>
            <span class="px-8 py-4 text-sm font-bold text-[#3D3229] border-x border-[#3D3229] min-w-[60px] text-center">{quantity}</span>
            <button 
              on:click={() => (quantity += 1)}
              class="px-5 py-4 hover:bg-[#F5F0EB] transition-colors"
            >
              +
            </button>
          </div>
          
          <button 
            on:click={handleAddToCart}
            class="flex-grow px-12 py-5 {added ? 'bg-[#25D366]' : 'bg-[#3D3229]'} text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-[#3D3229]/10"
          >
            {#if added}
              <Check size={18} />
              <span>Added to Cart</span>
            {:else}
              <ShoppingCart size={18} />
              <span>Acquire Piece</span>
            {/if}
          </button>
        </div>
        
        <div class="flex items-center space-x-2 text-[#8B7D6B] text-[10px] uppercase font-bold tracking-widest">
           <Info size={14} />
           <span>Estimated global delivery: 3—5 Business Days</span>
        </div>
      </div>
    </div>
  </div>
</div>
