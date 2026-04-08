<script>
  import { createEventDispatcher } from 'svelte';
  import { ShoppingCart, Menu, X, Diamond } from 'lucide-svelte';
  import { cart } from '../lib/cart';

  export let currentPage = 'home';
  const dispatch = createEventDispatcher();
  let isMenuOpen = false;

  $: cartCount = $cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'The House' }
  ];

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleNav(id) {
    dispatch('navigate', id);
    isMenuOpen = false;
  }
</script>

<header class="sticky top-0 z-50 bg-[#FFFCF9]/80 backdrop-blur-md border-b border-[#EDE7E0]">
  <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    <button 
      on:click={() => handleNav('home')} 
      class="flex items-center space-x-3 text-[#3D3229] hover:opacity-80 transition-opacity"
    >
      <img src="/logo.svg" alt="Aarti Abhushan Logo" class="w-12 h-12 object-contain" />
      <span class="text-xl font-bold tracking-[0.1em] uppercase">Aarti Abhushan</span>
    </button>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center space-x-8">
      {#each navItems as item}
        <button
          on:click={() => handleNav(item.id)}
          class="text-sm font-medium tracking-wide transition-colors {currentPage === item.id ? 'text-[#3D3229]' : 'text-[#8B7D6B] hover:text-[#3D3229]'}"
        >
          {item.label}
        </button>
      {/each}
    </nav>

    <div class="flex items-center space-x-4">
      <button
        on:click={() => handleNav('cart')}
        class="relative p-2 text-[#3D3229] hover:bg-[#EDE7E0] rounded-full transition-colors"
      >
        <ShoppingCart size={20} />
        {#if cartCount > 0}
          <span class="absolute top-0 right-0 w-4 h-4 bg-[#3D3229] text-white text-[10px] flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        {/if}
      </button>

      <button 
        on:click={toggleMenu} 
        class="md:hidden p-2 text-[#3D3229] hover:bg-[#EDE7E0] rounded-full transition-colors"
      >
        {#if isMenuOpen}
          <X size={24} />
        {:else}
          <Menu size={24} />
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div class="md:hidden absolute top-16 inset-x-0 bg-[#FFFCF9] border-b border-[#EDE7E0] p-4 flex flex-col space-y-4 shadow-xl">
      {#each navItems as item}
        <button
          on:click={() => handleNav(item.id)}
          class="text-left py-2 text-lg font-medium {currentPage === item.id ? 'text-[#3D3229]' : 'text-[#8B7D6B]'}"
        >
          {item.label}
        </button>
      {/each}
      <button 
        on:click={() => handleNav('cart')}
        class="text-left py-2 text-lg font-medium text-[#8B7D6B]"
      >
        View Cart ({cartCount})
      </button>
    </div>
  {/if}
</header>
