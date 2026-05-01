<script>
  import { onMount } from 'svelte';
  import { Search, Package, MapPin, Calendar, Clock, ChevronRight } from 'lucide-svelte';
  import { trackOrders } from '../services/api';
  import SEO from '../components/SEO.svelte';
  import { fade, fly } from 'svelte/transition';

  let phone = '';
  let orders = [];
  let loading = false;
  let searched = false;
  let error = '';

  onMount(() => {
    const savedPhone = localStorage.getItem('customerPhone');
    if (savedPhone) {
      phone = savedPhone;
      handleSearch();
    }
  });

  async function handleSearch() {
    if (!phone) return;
    loading = true;
    searched = true;
    error = '';
    
    try {
      orders = await trackOrders(phone) || [];
      if (orders.length === 0) {
        error = "No orders found for this number.";
      }
    } catch (e) {
      console.error(e);
      orders = [];
      error = "Failed to fetch orders. Please try again.";
    } finally {
      loading = false;
    }
  }

  function getStatusColor(status) {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'confirmed': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'on way': case 'shipped': return 'text-purple-500 bg-purple-50 border-purple-100';
      case 'delivered': case 'done': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'canceled': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  }
</script>

<SEO 
  title="Track Your Order | Aarti Abhushan" 
  description="Check the status of your exquisite jewelry orders using your phone number."
/>

<div class="min-h-screen bg-[#FFFCF9] py-24 px-4">
  <div class="max-w-3xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-[#3D3229] mb-4">Track Your Order</h1>
      <p class="text-[#8B7D6B]">Enter the phone number used during checkout to view your order status.</p>
    </div>

    <div class="bg-white p-8 border border-[#F0EBE5] shadow-xl rounded-sm mb-12">
      <div class="flex gap-4">
        <div class="relative flex-grow">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A99A]">
            <Search size={20} />
          </span>
          <input 
            type="tel" 
            bind:value={phone}
            placeholder="Enter Phone Number (e.g. +91...)"
            class="w-full pl-12 pr-4 py-4 bg-[#FDFCFB] border border-[#F0EBE5] outline-none focus:border-[#3D3229] transition-all font-medium"
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button 
          on:click={handleSearch}
          disabled={loading || !phone}
          class="px-8 bg-[#3D3229] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#5C4F43] transition-all disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>

    {#if loading}
      <div class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D3229]"></div>
      </div>
    {:else if searched}
      <div class="space-y-6" in:fade>
        {#each orders as order}
          <div class="bg-white border border-[#F0EBE5] overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-shadow">
            <div class="p-6 border-b border-[#F5F0EB] flex justify-between items-center bg-[#FDFCFB]">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-[#F5F0EB] text-[#3D3229] rounded-sm">
                  <Package size={24} />
                </div>
                <div>
                  <h3 class="font-bold text-[#3D3229]">Order #{order.id}</h3>
                  <div class="flex items-center gap-4 text-xs text-[#8B7D6B] mt-1">
                    <span class="flex items-center gap-1"><Calendar size={12} /> {new Date(order.created_at).toLocaleDateString()}</span>
                    <span class="flex items-center gap-1 text-[#3D3229] font-bold uppercase tracking-wider">₹{order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div class="px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] {getStatusColor(order.status)}">
                {order.status}
              </div>
            </div>
            
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A] mb-3">Order Details</h4>
                <div class="space-y-2">
                  {#each order.items as item}
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-[#3D3229]">{item.product_name} <span class="text-[#8B7D6B] text-xs">x{item.quantity}</span></span>
                      <span class="font-mono text-[#8B7D6B]">₹{(item.price_at_purchase * item.quantity).toLocaleString()}</span>
                    </div>
                  {/each}
                </div>
              </div>
              
              <div>
                <h4 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A] mb-3">Shipping To</h4>
                <div class="flex gap-2 text-[#6B5D50] text-sm">
                  <MapPin size={16} class="shrink-0 mt-0.5 text-[#B8A99A]" />
                  <p class="whitespace-pre-line">{order.customer_address || 'Address not specified'}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-[#FFFCF9] px-6 py-4 border-t border-[#F5F0EB] text-center">
              <p class="text-[10px] text-[#8B7D6B] italic">Need help? Contact us on WhatsApp with your Order ID.</p>
            </div>
          </div>
        {:else}
          <div class="text-center py-24 bg-white border border-[#F0EBE5] rounded-sm">
            <div class="w-16 h-16 bg-[#F5F0EB] rounded-full flex items-center justify-center text-[#B8A99A] mx-auto mb-4">
              <Package size={32} />
            </div>
            <p class="text-[#3D3229] font-bold">{error || 'Enter your phone number to see your orders.'}</p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
