<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { ChevronDown, Grid, List, Loader2 } from 'lucide-svelte';
  import ProductCard from '../components/ProductCard.svelte';
  import { getProducts } from '../services/api';
  import { fade, fly } from 'svelte/transition';
  import SEO from '../components/SEO.svelte';

  const dispatch = createEventDispatcher();
  
  let products = [];
  let loading = true;
  let error = null;
  let category = 'All';
  let sortBy = 'newest';
  let viewMode = 'grid';
  let abortController = null;

  function stopLoading() {
    if (abortController) {
      abortController.abort();
      abortController = null;
      loading = false;
    }
  }

  onMount(() => {
    fetchData();
    return () => {
      if (abortController) abortController.abort();
    };
  });

  async function fetchData() {
    loading = true;
    error = null;
    abortController = new AbortController();
    try {
      const data = await getProducts(abortController.signal);
      products = data || [];
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        error = 'Failed to load products. Please check if the server is running.';
        console.error(err);
      }
    } finally {
      loading = false;
      abortController = null;
    }
  }

  $: filteredProducts = (() => {
    let result = Array.isArray(products) ? [...products] : [];
    if (category !== 'All') {
      result = result.filter((p) => {
        const pCat = p.category.toLowerCase();
        const tCat = category.toLowerCase();
        return pCat === tCat || 
               pCat === tCat.replace(/s$/, '') || 
               tCat === pCat.replace(/s$/, '');
      });
    }
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }
    return result;
  })();

  function handleProductClick(product) {
    dispatch('productClick', product);
  }
</script>

<SEO 
  title="Shop Collection | Aarti Abhushan" 
  description="Browse our complete collection of rings, necklaces, earrings, and bracelets. Find the perfect piece for your next milestone."
  keywords="Aarti, Aarti Abhushan, Aarti Abhusan, Abhushan, Abhusan, jewelry shop, buy gold jewelry, diamond rings collection, silver ornaments, Aarti Abhushan shop, jewelry store, luxury collection"
/>

<div class="min-h-screen bg-[#FFFCF9] pb-12 sm:pb-24">
  <div class="bg-[#F5F0EB] border-b border-[#DDD5CC] py-6 sm:py-12 px-4 shadow-sm">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-bold text-[#3D3229] mb-2 sm:mb-4">The Collection</h1>
      <p class="text-[#8B7D6B] max-w-2xl text-base sm:text-lg font-medium">
        Explore our complete range of architectural jewelry. Each piece is designed with precision and crafted for longevity.
      </p>
    </div>
  </div>

  <div class="sticky top-16 z-30 bg-[#FFFCF9]/90 backdrop-blur-md border-b border-[#DDD5CC] px-4 py-4">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
        {#each ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'] as cat}
          <button
            on:click={() => (category = cat)}
            class="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all {category === cat ? 'bg-[#3D3229] text-white' : 'text-[#6B5D50] hover:bg-[#EDE7E0]'}"
          >
            {cat}
          </button>
        {/each}
      </div>

      <div class="flex items-center space-x-4 w-full md:w-auto justify-end">
        <div class="relative group">
          <button class="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#5C4F43] hover:text-[#3D3229]">
            <span>Sort: {sortBy}</span>
            <ChevronDown size={14} />
          </button>
          <div class="absolute right-0 mt-2 w-48 bg-[#FFFCF9] border border-[#DDD5CC] shadow-2xl rounded-sm overflow-hidden hidden group-hover:block z-50">
            <button on:click={() => (sortBy = 'newest')} class="block w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#5C4F43] hover:bg-[#F5F0EB]">Newest</button>
            <button on:click={() => (sortBy = 'price-low')} class="block w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#5C4F43] hover:bg-[#F5F0EB]">Price: Low to High</button>
            <button on:click={() => (sortBy = 'price-high')} class="block w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-[#5C4F43] hover:bg-[#F5F0EB]">Price: High to Low</button>
          </div>
        </div>

        <div class="h-6 w-px bg-[#C9BDB0]" />

        <div class="flex items-center space-x-1">
          <button on:click={() => (viewMode = 'grid')} class="p-2 rounded-sm {viewMode === 'grid' ? 'bg-[#EDE7E0] text-[#3D3229]' : 'text-[#B8A99A] hover:text-[#6B5D50]'}">
            <Grid size={18} />
          </button>
          <button on:click={() => (viewMode = 'list')} class="p-2 rounded-sm {viewMode === 'list' ? 'bg-[#EDE7E0] text-[#3D3229]' : 'text-[#B8A99A] hover:text-[#6B5D50]'}">
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 py-6 sm:py-12">
    {#if loading}
      <div class="flex flex-col items-center justify-center py-24 space-y-6">
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 w-full opacity-50 pointer-events-none">
          {#each Array(8) as _}
            <div class="space-y-4 animate-pulse">
              <div class="aspect-[4/5] bg-[#F5F0EB] rounded-sm" />
              <div class="space-y-2">
                <div class="h-4 bg-[#F5F0EB] rounded w-3/4" />
                <div class="h-3 bg-[#F5F0EB] rounded w-1/2" />
              </div>
            </div>
          {/each}
        </div>
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin text-[#3D3229]">
            <Loader2 size={32} />
          </div>
          <p class="text-[#8B7D6B] font-medium tracking-wide">Syncing Collection...</p>
          <button 
            on:click={stopLoading}
            class="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors border-b border-red-500 pb-0.5"
          >
            Cancel Sync
          </button>
        </div>
      </div>
    {:else if error}
      <div class="text-center py-24 bg-[#FFF5F5] border border-red-100 rounded-lg">
        <p class="text-red-500 font-bold mb-2">{error}</p>
        <p class="text-sm text-red-400">Make sure your Go backend is running on http://localhost:8080</p>
      </div>
    {:else}
      <div class="grid {viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8' : 'grid-cols-1 gap-6'}">
        {#each filteredProducts as product (product.id)}
          <div in:fade={{ duration: 300 }}>
            <ProductCard {product} on:productClick={(e) => handleProductClick(e.detail)} />
          </div>
        {/each}
      </div>

      {#if filteredProducts.length === 0}
        <div class="text-center py-24">
          <p class="text-[#8B7D6B] text-lg font-medium">No pieces found in this category.</p>
          <button on:click={() => (category = 'All')} class="mt-4 text-[#3D3229] font-bold uppercase tracking-widest text-xs border-b border-[#3D3229] pb-1 hover:text-[#5C4F43]">View all products</button>
        </div>
      {/if}
    {/if}
  </div>
</div>
