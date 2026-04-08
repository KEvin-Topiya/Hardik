<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { ArrowRight, Diamond, Zap, Award } from 'lucide-svelte';
  import ProductCard from '../components/ProductCard.svelte';
  import { getProducts } from '../services/api';
  import { fade, fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();
  let featuredProducts = [];
  let loading = true;

  let currentImageIndex = 0;
  const heroImages = [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
  ];

  onMount(async () => {
    try {
      const data = await getProducts();
      featuredProducts = data.slice(0, 4);
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }

    // Image rotation
    const interval = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    }, 4000);
    
    return () => clearInterval(interval);
  });

  function handleNav(id) {
    dispatch('navigate', id);
  }

  function handleProductClick(product) {
    dispatch('productClick', product);
  }
</script>

<div class="space-y-24 pb-24">
  <!-- Hero Section -->
  <section class="h-[70vh] bg-[#F5F0EB] relative overflow-hidden flex items-center px-4">
    <div class="absolute inset-0 z-0 opacity-10">
      <div class="w-full h-full border-[1px] border-[#3D3229] rounded-full scale-150 transform -translate-x-1/2 -translate-y-1/2 absolute top-0 left-0" />
    </div>

    <div class="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div in:fly={{ y: 50, duration: 1000 }} class="max-w-xl space-y-6">
        <div class="w-12 h-1 bg-[#3D3229]" />
        <h1 class="text-5xl md:text-7xl font-bold text-[#3D3229] leading-[1] tracking-tight">
          Exquisite <br/>Collections
        </h1>
        <p class="text-lg text-[#6B5D50] max-w-xl font-medium leading-relaxed">
          EXQUISITE CRAFTSMANSHIP. TRADITIONAL YET MODERN. AARTI ABHUSHAN BRINGS YOU THE FINEST JEWELRY COLLECTIONS.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            on:click={() => handleNav('shop')}
            class="px-8 py-4 bg-[#3D3229] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#5C4F43] transition-all flex items-center group"
          >
            Explore Collection
            <ArrowRight class="ml-2 transform group-hover:translate-x-1 transition-transform" size={16} />
          </button>
        </div>
      </div>

      <!-- Image Area -->
      <div class="hidden lg:flex justify-center relative h-full">
        {#each heroImages as img, i}
          {#if i === currentImageIndex}
            <div 
              class="absolute inset-0 flex items-center justify-center p-8"
              in:fly={{ y: 40, duration: 800, delay: 200 }}
              out:fade={{ duration: 400 }}
            >
              <div class="relative w-full h-[400px] overflow-hidden rounded-sm shadow-2xl border-4 border-white">
                <img src={img} alt="Jewelry Display" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-[#3D3229]/5" />
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  </section>

  <!-- Featured Grid -->
  <section class="max-w-7xl mx-auto px-4">
    <div class="flex justify-between items-end mb-12">
      <div class="space-y-2">
        <h2 class="text-sm font-bold uppercase tracking-[0.3em] text-[#8B7D6B]">Featured Designs</h2>
        <h3 class="text-3xl font-bold text-[#3D3229]">Select Pieces</h3>
      </div>
      <button 
        on:click={() => handleNav('shop')}
        class="text-sm font-bold uppercase tracking-widest text-[#3D3229] hover:text-[#8B7D6B] flex items-center border-b border-[#3D3229] pb-1 transition-colors"
      >
        View All <ArrowRight size={14} class="ml-1" />
      </button>
    </div>

    {#if loading}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        {#each Array(4) as _}
          <div class="animate-pulse space-y-4">
            <div class="aspect-[4/5] bg-[#EDE7E0]" />
            <div class="h-4 bg-[#EDE7E0] w-2/3" />
            <div class="h-4 bg-[#EDE7E0] w-1/3" />
          </div>
        {/each}
      </div>
    {:else}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        {#each featuredProducts as product}
          <ProductCard {product} on:productClick={(e) => handleProductClick(e.detail)} />
        {/each}
      </div>
    {/if}
  </section>

  <!-- Value Props -->
  <section class="bg-[#3D3229] py-24 px-4 overflow-hidden relative">
     <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
       <div class="space-y-6 text-center">
         <div class="mx-auto w-16 h-16 rounded-full border border-[#8B7D6B] flex items-center justify-center text-white">
           <Diamond size={32} strokeWidth={1} />
         </div>
         <h4 class="text-white font-bold uppercase tracking-widest text-lg">Pure Materials</h4>
         <p class="text-[#8B7D6B] text-sm leading-relaxed">950 Platinum and 18k Gold. We never compromise on structural integrity.</p>
       </div>
       <div class="space-y-6 text-center">
         <div class="mx-auto w-16 h-16 rounded-full border border-[#8B7D6B] flex items-center justify-center text-white">
           <Zap size={32} strokeWidth={1} />
         </div>
         <h4 class="text-white font-bold uppercase tracking-widest text-lg">Precision Forged</h4>
         <p class="text-[#8B7D6B] text-sm leading-relaxed">Each piece is measured to the millimeter. Industrial tech meets heritage skill.</p>
       </div>
       <div class="space-y-6 text-center">
         <div class="mx-auto w-16 h-16 rounded-full border border-[#8B7D6B] flex items-center justify-center text-white">
           <Award size={32} strokeWidth={1} />
         </div>
         <h4 class="text-white font-bold uppercase tracking-widest text-lg">Lifetime Service</h4>
         <p class="text-[#8B7D6B] text-sm leading-relaxed">Every purchase includes annual structural verification and re-polishing.</p>
       </div>
     </div>
  </section>
</div>
