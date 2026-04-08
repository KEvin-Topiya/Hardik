<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  export let product;
  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('productClick', product);
  }
</script>

<div
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  class="group cursor-pointer"
>
  <div class="relative aspect-[1/1] sm:aspect-[4/5] overflow-hidden bg-[#F5F0EB] border border-[#DDD5CC] mb-2 sm:mb-4 rounded-sm transition-all duration-500 group-hover:border-[#C9BDB0]">
    {#if product.image_url}
      <img src={product.image_url} alt={product.name} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    {:else}
      <!-- Geometric Placeholder Art -->
      <div class="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_#FFE8D6_0%,_#F5F0EB_100%)] opacity-50 transition-transform duration-700 group-hover:scale-105" />

      <!-- Decorative Geometric Elements -->
      <div class="absolute inset-0 flex items-center justify-center opacity-30">
        <div
          class="w-16 h-16 sm:w-32 sm:h-32 border border-[#C9BDB0] {parseInt(product.id) % 2 === 0 ? 'rounded-full' : 'rotate-45'}"
        />

        <div
          class="absolute w-12 h-12 sm:w-24 sm:h-24 border border-[#C9BDB0] {parseInt(product.id) % 3 === 0 ? 'rotate-12' : '-rotate-12'}"
        />
      </div>
    {/if}

    <!-- "Image" Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-[#FFFCF9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
  </div>

  <div class="space-y-0.5 sm:space-y-1">
    <h3 class="text-xs sm:text-base font-medium text-[#3D3229] group-hover:text-[#6B5D50] transition-colors leading-tight line-clamp-2">
      {product.name}
    </h3>
    <p class="text-[10px] sm:text-xs text-[#8B7D6B] uppercase tracking-wide">
      {product.material}
    </p>
    <p class="text-xs sm:text-sm font-semibold text-[#3D3229] mt-1 sm:mt-2">
      ${product.price.toLocaleString()}
    </p>
  </div>
</div>
