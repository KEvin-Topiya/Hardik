<script>
  import { createEventDispatcher } from 'svelte';
  import { Github, Twitter, Instagram, Diamond } from 'lucide-svelte';

  const dispatch = createEventDispatcher();
  const year = new Date().getFullYear();

  function handleNav(id) {
    dispatch('navigate', id);
  }
</script>

<footer class="bg-[#3D3229] py-16 px-4">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      <!-- Logo & Socials -->
      <div class="space-y-6">
        <button 
          on:click={() => handleNav('home')} 
          class="flex items-center space-x-3 text-white hover:opacity-80 transition-opacity"
        >
          <img src="/logo.svg" alt="Logo" class="w-12 h-12 brightness-0 invert opacity-90" />
          <span class="text-2xl font-bold tracking-[0.2em] uppercase">Aarti Abhushan</span>
        </button>
        <p class="text-[#8B7D6B] text-sm leading-relaxed">
          Exquisite designs. Pure metals. Traditional craftsmanship for the modern era.
        </p>
        <div class="flex space-x-4">
          <button class="text-[#8B7D6B] hover:text-white transition-colors">
            <Instagram size={20} />
          </button>
          <button class="text-[#8B7D6B] hover:text-white transition-colors">
            <Twitter size={20} />
          </button>
          <button class="text-[#8B7D6B] hover:text-white transition-colors">
            <Github size={20} />
          </button>
        </div>
      </div>

      <!-- Links -->
      <div class="space-y-4">
        <h4 class="text-white font-bold uppercase tracking-widest text-sm">Collection</h4>
        <nav class="flex flex-col space-y-2">
          <button on:click={() => handleNav('shop')} class="text-[#8B7D6B] hover:text-white text-sm text-left transition-colors">All Pieces</button>
          <button on:click={() => handleNav('shop')} class="text-[#8B7D6B] hover:text-white text-sm text-left transition-colors">Rings</button>
          <button on:click={() => handleNav('shop')} class="text-[#8B7D6B] hover:text-white text-sm text-left transition-colors">Necklaces</button>
          <button on:click={() => handleNav('shop')} class="text-[#8B7D6B] hover:text-white text-sm text-left transition-colors">Earrings</button>
        </nav>
      </div>

      <div class="space-y-4">
        <h4 class="text-white font-bold uppercase tracking-widest text-sm">Service</h4>
        <nav class="flex flex-col space-y-2">
          <button on:click={() => handleNav('about')} class="text-[#8B7D6B] hover:text-white text-sm text-left transition-colors">About Us</button>
          <button class="text-[#8B7D6B] hover:text-white text-sm text-left transition-colors">Shipping</button>
          <button class="text-[#8B7D6B] hover:text-white text-sm text-left transition-colors">Warranty</button>
          <button class="text-[#8B7D6B] hover:text-white text-sm text-left transition-colors">Materials</button>
        </nav>
      </div>

      <div class="space-y-4">
        <h4 class="text-white font-bold uppercase tracking-widest text-sm">Visit Us</h4>
        <p class="text-[#8B7D6B] text-sm leading-relaxed">
          Studio 402, Meridian Tower<br/>
          Design District<br/>
          New York, NY 10001
        </p>
      </div>
    </div>

    <div class="border-t border-[#6B5D50] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-[#8B7D6B] text-xs">
        © {year} Aarti Abhushan. All rights reserved.
      </p>
      <div class="flex space-x-6 text-[10px] uppercase tracking-[0.1em] text-[#8B7D6B]">
        <button class="hover:text-white transition-colors">Privacy Policy</button>
        <button class="hover:text-white transition-colors">Terms of Service</button>
      </div>
    </div>
  </div>
</footer>
