<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { ArrowRight, Diamond, Zap, Award } from "lucide-svelte";
  import ProductCard from "../components/ProductCard.svelte";
  import { getProducts, getHeroImages, IMAGE_BASE_URL, getImageUrl, getTrendingProducts, getNewProducts } from "../services/api";
  import { fade, fly } from "svelte/transition";
  import SEO from "../components/SEO.svelte";

  const dispatch = createEventDispatcher();
  let featuredProducts = [];
  let trendingProducts = [];
  let newCollection = [];
  let loading = true;

  let currentImageIndex = 0;
  let heroImages = [];
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
    
    // Image rotation
    const interval = setInterval(() => {
      if (heroImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % heroImages.length;
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      if (abortController) abortController.abort();
    };
  });

  async function fetchData() {
    loading = true;
    abortController = new AbortController();
    try {
      const [productsData, imagesData, trendingData, newData] = await Promise.all([
        getProducts(abortController.signal),
        getHeroImages(abortController.signal),
        getTrendingProducts(abortController.signal),
        getNewProducts(abortController.signal)
      ]);
      
      featuredProducts = (productsData || []).slice(0, 4);
      trendingProducts = trendingData || [];
      newCollection = newData || [];
      
      if (imagesData && imagesData.length > 0) {
        heroImages = imagesData.map((img) => img.image_url);
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error("Failed to load home data", e);
      }
    } finally {
      loading = false;
      abortController = null;
    }
  }

  function handleNav(id) {
    dispatch("navigate", id);
  }

  function handleProductClick(product) {
    dispatch("productClick", product);
  }
</script>

<SEO
  title="Aarti Abhushan | Exquisite Jewelry Collections"
  description="Explore the finest collection of gold, platinum, and diamond jewelry at Aarti Abhushan. Handcrafted elegance for every moment."
  keywords="Aarti, Aarti Abhushan, Aarti Abhusan, Abhushan, Abhusan, Arati Abhushan, premium jewelry, gold rings, diamond necklaces, platinum jewelry, indian heritage jewelry, luxury ornaments, handcrafted jewelry, bridal jewelry"
/>

<div class="space-y-24 pb-24">
  <!-- Hero Section -->
  <section
    class="h-[70vh] bg-[#F5F0EB] relative overflow-hidden flex items-center px-4"
  >
    <!-- Mobile Background Images -->
    {#each heroImages as img, i}
      {#if i === currentImageIndex}
        <div
          class="absolute inset-0 z-0 lg:hidden"
          in:fade={{ duration: 1000 }}
          out:fade={{ duration: 1000 }}
        >
          <img
            src={getImageUrl(img)}
            alt="Hero Background"
            class="w-full h-full object-cover opacity-25"
          />
        </div>
      {/if}
    {/each}

    <div class="absolute inset-0 z-0 opacity-10 hidden lg:block">
      <div
        class="w-full h-full border-[1px] border-[#3D3229] rounded-full scale-150 transform -translate-x-1/2 -translate-y-1/2 absolute top-0 left-0"
      />
    </div>

    <div
      class="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
    >
      <div in:fly={{ y: 50, duration: 1000 }} class="max-w-xl space-y-6">
        <div class="w-12 h-1 bg-[#3D3229]" />
        <h1
          class="text-5xl md:text-7xl font-bold text-[#3D3229] leading-[1] tracking-tight"
        >
          Exquisite <br />Collections
        </h1>
        <p class="text-lg text-[#6B5D50] max-w-xl font-medium leading-relaxed">
          EXQUISITE CRAFTSMANSHIP. TRADITIONAL YET MODERN. AARTI ABHUSHAN BRINGS
          YOU THE FINEST JEWELRY COLLECTIONS.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            on:click={() => handleNav("shop")}
            class="px-8 py-4 bg-[#3D3229] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#5C4F43] transition-all flex items-center group"
          >
            Explore Collection
            <ArrowRight
              class="ml-2 transform group-hover:translate-x-1 transition-transform"
              size={16}
            />
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
              <div
                class="relative w-full h-[400px] overflow-hidden rounded-sm shadow-2xl border-4 border-white"
              >
                <img
                  src={getImageUrl(img)}
                  alt="Jewelry Display"
                  class="w-full h-full object-cover"
                />
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
        <h2 class="text-sm font-bold uppercase tracking-[0.3em] text-[#8B7D6B]">
          Featured Designs
        </h2>
        <h3 class="text-3xl font-bold text-[#3D3229]">Select Pieces</h3>
      </div>
      <button
        on:click={() => handleNav("shop")}
        class="text-sm font-bold uppercase tracking-widest text-[#3D3229] hover:text-[#8B7D6B] flex items-center border-b border-[#3D3229] pb-1 transition-colors"
      >
        View All <ArrowRight size={14} class="ml-1" />
      </button>
    </div>

    {#if loading}
      <div class="flex flex-col items-center space-y-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 w-full opacity-50 pointer-events-none">
          {#each Array(4) as _}
            <div class="space-y-4 animate-pulse">
              <div class="aspect-[4/5] bg-[#F5F0EB] rounded-sm" />
              <div class="space-y-2">
                <div class="h-4 bg-[#F5F0EB] rounded w-3/4" />
                <div class="h-3 bg-[#F5F0EB] rounded w-1/2" />
              </div>
            </div>
          {/each}
        </div>
        <button 
          on:click={stopLoading}
          class="text-xs font-bold uppercase tracking-widest text-[#3D3229] border-b border-[#3D3229] pb-0.5 hover:text-[#8B7D6B] hover:border-[#8B7D6B] transition-colors"
        >
          Stop Loading
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        {#each featuredProducts as product}
          <ProductCard
            {product}
            on:productClick={(e) => handleProductClick(e.detail)}
          />
        {/each}
      </div>
    {/if}
  </section>

  <!-- New Collection Section -->
  {#if newCollection.length > 0}
    <section class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-end mb-12">
        <div class="space-y-2">
          <h2 class="text-sm font-bold uppercase tracking-[0.3em] text-[#8B7D6B]">
            Recently Unveiled
          </h2>
          <h3 class="text-3xl font-bold text-[#3D3229]">New Collection</h3>
        </div>
        <button
          on:click={() => handleNav("shop")}
          class="text-sm font-bold uppercase tracking-widest text-[#3D3229] hover:text-[#8B7D6B] flex items-center border-b border-[#3D3229] pb-1 transition-colors"
        >
          Explore All <ArrowRight size={14} class="ml-1" />
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        {#each newCollection as product}
          <ProductCard
            {product}
            on:productClick={(e) => handleProductClick(e.detail)}
          />
        {/each}
      </div>
    </section>
  {/if}

  <!-- Trending Section -->
  {#if trendingProducts.length > 0}
    <section class="max-w-7xl mx-auto px-4 bg-[#FDFCFB] py-24 -mx-4">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-end mb-12">
          <div class="space-y-2">
            <h2 class="text-sm font-bold uppercase tracking-[0.3em] text-[#8B7D6B]">
              Highly Coveted
            </h2>
            <h3 class="text-3xl font-bold text-[#3D3229]">Trending Pieces</h3>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          {#each trendingProducts as product}
            <div class="relative">
              <ProductCard
                {product}
                on:productClick={(e) => handleProductClick(e.detail)}
              />
              <div class="absolute top-2 right-2 px-2 py-1 bg-[#3D3229] text-white text-[8px] font-bold uppercase tracking-widest rounded-sm opacity-80">
                Hot
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- Value Props -->
  <section class="bg-[#3D3229] py-24 px-4 overflow-hidden relative">
    <div
      class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10"
    >
      <div class="space-y-6 text-center">
        <div
          class="mx-auto w-16 h-16 rounded-full border border-[#8B7D6B] flex items-center justify-center text-white"
        >
          <Diamond size={32} strokeWidth={1} />
        </div>
        <h4 class="text-white font-bold uppercase tracking-widest text-lg">
          Pure Materials
        </h4>
        <p class="text-[#8B7D6B] text-sm leading-relaxed">
          950 Platinum and 18k Gold. We never compromise on structural
          integrity.
        </p>
      </div>
      <div class="space-y-6 text-center">
        <div
          class="mx-auto w-16 h-16 rounded-full border border-[#8B7D6B] flex items-center justify-center text-white"
        >
          <Zap size={32} strokeWidth={1} />
        </div>
        <h4 class="text-white font-bold uppercase tracking-widest text-lg">
          Precision Forged
        </h4>
        <p class="text-[#8B7D6B] text-sm leading-relaxed">
          Each piece is measured to the millimeter. Industrial tech meets
          heritage skill.
        </p>
      </div>
      <div class="space-y-6 text-center">
        <div
          class="mx-auto w-16 h-16 rounded-full border border-[#8B7D6B] flex items-center justify-center text-white"
        >
          <Award size={32} strokeWidth={1} />
        </div>
        <h4 class="text-white font-bold uppercase tracking-widest text-lg">
          Lifetime Service
        </h4>
        <p class="text-[#8B7D6B] text-sm leading-relaxed">
          Every purchase includes annual structural verification and
          re-polishing.
        </p>
      </div>
    </div>
  </section>
</div>
