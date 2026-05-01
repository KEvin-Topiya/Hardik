<script>
  import { onMount } from 'svelte';
  import { Plus, Edit, Trash2, Upload, X, Save, Image as ImageIcon, MessageSquare, ClipboardList, RefreshCw, LogOut } from 'lucide-svelte';
  import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage, getHeroImages, addHeroImage, deleteHeroImage, IMAGE_BASE_URL, getImageUrl, getOrders, createOrder, updateOrderStatus } from '../services/api';
  import SEO from '../components/SEO.svelte';

  let products = [];
  let heroImages = [];
  let orders = [];
  let loading = true;
  let activeTab = 'products';
  let editingProduct = null;
  let isModalOpen = false;
  let isOrderModalOpen = false;
  let rawOrderMessage = '';
  let manualOrderPhone = '';
  let parsingStatus = '';
  let uploadLoading = false;
  let abortController = null;

  // Login State
  let isAuthenticated = false;
  let password = '';
  let loginError = '';
  let failedAttempts = 0;
  let lockoutTimer = 0;
  let isLocked = false;

  const ADMIN_PASSWORD = 'aarti@admin';

  function handleLogin() {
    if (isLocked) return;

    if (password === ADMIN_PASSWORD) {
      isAuthenticated = true;
      localStorage.setItem('adminAuthenticated', 'true');
      loginError = '';
      failedAttempts = 0;
    } else {
      failedAttempts++;
      loginError = 'Invalid password.';
      
      if (failedAttempts % 5 === 0) {
        startLockout();
      }
    }
  }

  function handleLogout() {
    isAuthenticated = false;
    localStorage.removeItem('adminAuthenticated');
    password = '';
  }

  function startLockout() {
    isLocked = true;
    lockoutTimer = 10;
    loginError = `Too many failed attempts. Wait ${lockoutTimer}s.`;
    
    const interval = setInterval(() => {
      lockoutTimer--;
      if (lockoutTimer <= 0) {
        clearInterval(interval);
        isLocked = false;
        loginError = '';
      } else {
        loginError = `Too many failed attempts. Wait ${lockoutTimer}s.`;
      }
    }, 1000);
  }

  function stopLoading() {
    if (abortController) {
      abortController.abort();
      abortController = null;
      loading = false;
    }
  }

  // Form state
  let formProduct = {
    name: '',
    price: 0,
    category: 'Ring',
    material: 'Gold',
    description: '',
    weight: '',
    dimensions: '',
    finish: '',
    stone: '',
    images: [],
    is_new: false
  };

  onMount(() => {
    // Check persistence
    const savedAuth = localStorage.getItem('adminAuthenticated');
    if (savedAuth === 'true') {
      isAuthenticated = true;
    }
    
    fetchProducts();
    fetchHeroImages();
    fetchOrders();
  });

  async function fetchOrders() {
    try {
      orders = await getOrders() || [];
    } catch (e) {
      console.error("Failed to load orders", e);
    }
  }

  async function updateStatus(orderId, newStatus) {
    try {
      const success = await updateOrderStatus(orderId, newStatus);
      if (success) {
        fetchOrders();
      } else {
        alert('Failed to update status');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating status');
    }
  }

  let selectedOrder = null;
  let isViewOrderModalOpen = false;

  function viewOrderDetails(order) {
    selectedOrder = order;
    isViewOrderModalOpen = true;
  }

  function parseAndSaveOrder() {
    if (!rawOrderMessage) return;
    parsingStatus = 'Parsing...';
    
    try {
      const orderData = {
        customer_name: '',
        customer_phone: '',
        items: [],
        raw_message: rawOrderMessage
      };

      // Extract Customer Name
      const nameMatch = rawOrderMessage.match(/Customer: (.*)/);
      if (nameMatch) orderData.customer_name = nameMatch[1].trim();

      const addressMatch = rawOrderMessage.match(/Address: (.*)/);
      if (addressMatch) orderData.customer_address = addressMatch[1].trim();

      // Use manually entered phone instead of parsing from message for better accuracy
      orderData.customer_phone = manualOrderPhone;

      // Extract Items
      // Regex for: 1. Item Name \n Ref ID: FR-005 \n Quantity: 2
      // Using [^\n]+ for name and \s* for flexible spacing
      const itemsRegex = /(\d+)\.\s+([^\n]+)\n\s*Ref ID:\s*FR-00(\d+)\n\s*Quantity:\s*(\d+)/g;
      let match;
      while ((match = itemsRegex.exec(rawOrderMessage)) !== null) {
        orderData.items.push({
          product_id: parseInt(match[3]),
          quantity: parseInt(match[4])
        });
      }

      console.log("Found Items:", orderData.items);

      console.log("Parsed Data:", orderData);

      if (orderData.items.length === 0) {
        parsingStatus = 'Error: No items found in message.';
        return;
      }

      createOrder(orderData).then(() => {
        parsingStatus = 'Order saved successfully!';
        rawOrderMessage = '';
        manualOrderPhone = '';
        fetchOrders();
        setTimeout(() => {
          isOrderModalOpen = false;
          parsingStatus = '';
        }, 1500);
      }).catch(err => {
        parsingStatus = 'Failed to save to database.';
        console.error(err);
      });

    } catch (e) {
      parsingStatus = 'Parsing failed. Check format.';
      console.error(e);
    }
  }

  async function fetchProducts() {
    loading = true;
    abortController = new AbortController();
    try {
      products = await getProducts(abortController.signal) || [];
    } catch (e) {
      if (e.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error(e);
        alert('Failed to load products');
      }
    } finally {
      loading = false;
      abortController = null;
    }
  }

  async function fetchHeroImages() {
    try {
      heroImages = await getHeroImages() || [];
    } catch (e) {
      console.error("Failed to load hero images", e);
    }
  }

  async function handleHeroUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    uploadLoading = true;
    try {
      const filename = await uploadImage(files[0]);
      await addHeroImage(filename);
      fetchHeroImages();
    } catch (e) {
      console.error(e);
      alert('Failed to upload hero image');
    } finally {
      uploadLoading = false;
    }
  }

  async function handleDeleteHero(id) {
    if (confirm('Are you sure you want to delete this hero image?')) {
      try {
        await deleteHeroImage(id);
        fetchHeroImages();
      } catch (e) {
        console.error(e);
        alert('Failed to delete hero image');
      }
    }
  }

  function openAddModal() {
    editingProduct = null;
    formProduct = {
      name: '',
      price: 0,
      category: 'Ring',
      material: 'Gold',
      description: '',
      weight: '',
      dimensions: '',
      finish: '',
      stone: '',
      images: [],
      is_new: false
    };
    isModalOpen = true;
  }

  function openEditModal(product) {
    editingProduct = product;
    formProduct = { ...product };
    isModalOpen = true;
  }

  async function handleSave() {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formProduct);
      } else {
        await createProduct(formProduct);
      }
      isModalOpen = false;
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert('Failed to save product');
    }
  }

  async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (e) {
        console.error(e);
        alert('Failed to delete product');
      }
    }
  }

  async function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    uploadLoading = true;
    try {
      const file = files[0];
      const filename = await uploadImage(file);
      formProduct.images = [...formProduct.images, filename];
    } catch (e) {
      console.error(e);
      alert('Failed to upload image');
    } finally {
      uploadLoading = false;
    }
  }

  function removeImage(index) {
    formProduct.images = formProduct.images.filter((_, i) => i !== index);
  }
</script>

<SEO title="Admin Panel | Aarti Abhushan" description="Manage your jewelry products and inventory." />

<div class="min-h-screen bg-[#FDFCFB] pt-12 pb-24 px-4">
  <div class="max-w-7xl mx-auto">
    {#if !isAuthenticated}
      <div class="max-w-md mx-auto mt-24 bg-white p-8 border border-[#F0EBE5] shadow-xl rounded-sm">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-[#3D3229] rounded-full flex items-center justify-center text-white mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 class="text-2xl font-bold text-[#3D3229]">Admin Access</h2>
          <p class="text-[#8B7D6B] text-sm mt-1">Please enter your studio password</p>
        </div>

        <form on:submit|preventDefault={handleLogin} class="space-y-6">
          <div>
            <label for="adminPass" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Password</label>
            <input 
              id="adminPass"
              type="password" 
              bind:value={password}
              disabled={isLocked}
              class="w-full px-4 py-3 bg-[#FDFCFB] border {loginError ? 'border-red-400' : 'border-[#F0EBE5]'} focus:border-[#3D3229] outline-none transition-all"
              placeholder="••••••••"
            />
            {#if loginError}
              <p class="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{loginError}</p>
            {/if}
          </div>

          <button 
            type="submit"
            disabled={isLocked || !password}
            class="w-full py-4 bg-[#3D3229] text-white font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-[#5C4F43] transition-all disabled:opacity-50"
          >
            Access Dashboard
          </button>
        </form>
        
        <div class="mt-8 pt-6 border-t border-[#F0EBE5] text-center">
          <a href="/home" class="text-xs font-bold uppercase tracking-widest text-[#8B7D6B] hover:text-[#3D3229]">Return to Home</a>
        </div>
      </div>
    {:else}
      <div class="mb-8">
      <a href="/home" class="inline-flex items-center text-[#8B7D6B] hover:text-[#3D3229] transition-colors text-sm font-bold uppercase tracking-widest gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Website
      </a>
    </div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-[#3D3229]">Dashboard</h1>
        <div class="flex items-center gap-4 mt-2">
          <p class="text-[#8B7D6B]">Manage your products and website content.</p>
          <button 
            on:click={handleLogout}
            class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 hover:text-red-600 transition-colors"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>
      {#if activeTab === 'products'}
        <button 
          on:click={openAddModal}
          class="flex items-center gap-2 bg-[#3D3229] text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-[#5C4F43] transition-all"
        >
          <Plus size={18} /> Add Product
        </button>
      {:else if activeTab === 'orders'}
        <button 
          on:click={() => isOrderModalOpen = true}
          class="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all"
        >
          <MessageSquare size={18} /> Paste WhatsApp Order
        </button>
      {/if}
    </div>

    <div class="flex space-x-8 border-b border-[#F0EBE5] mb-8">
      <button 
        on:click={() => activeTab = 'products'} 
        class="pb-4 font-bold uppercase tracking-widest text-xs {activeTab === 'products' ? 'text-[#3D3229] border-b-2 border-[#3D3229]' : 'text-[#8B7D6B] hover:text-[#3D3229]'}"
      >Products</button>
      <button 
        on:click={() => activeTab = 'hero'} 
        class="pb-4 font-bold uppercase tracking-widest text-xs {activeTab === 'hero' ? 'text-[#3D3229] border-b-2 border-[#3D3229]' : 'text-[#8B7D6B] hover:text-[#3D3229]'}"
      >Hero Images</button>
      <button 
        on:click={() => activeTab = 'orders'} 
        class="pb-4 font-bold uppercase tracking-widest text-xs {activeTab === 'orders' ? 'text-[#3D3229] border-b-2 border-[#3D3229]' : 'text-[#8B7D6B] hover:text-[#3D3229]'}"
      >Orders</button>
    </div>

    {#if loading}
      <div class="flex flex-col items-center justify-center py-24 space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D3229]"></div>
        <p class="text-[#8B7D6B] font-medium">Syncing with server...</p>
        <button 
          on:click={stopLoading}
          class="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
        >
          Stop Loading
        </button>
      </div>
    {:else}
      {#if activeTab === 'products'}
        <div class="bg-white shadow-sm border border-[#F0EBE5] overflow-hidden rounded-sm">
          <table class="w-full text-left">
            <thead class="bg-[#F5F0EB] text-[#3D3229] uppercase text-xs font-bold tracking-widest">
              <tr>
                <th class="px-6 py-4">Image</th>
                <th class="px-6 py-4">Ref ID</th>
                <th class="px-6 py-4">Product Name</th>
                <th class="px-6 py-4">Category</th>
                <th class="px-6 py-4">Price</th>
                <th class="px-6 py-4">Sales (Clicks)</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F0EBE5]">
              {#each products as product}
                <tr class="hover:bg-[#FFFCF9] transition-colors">
                  <td class="px-6 py-4">
                    <div class="w-12 h-12 bg-[#F5F0EB] rounded-sm overflow-hidden">
                      {#if product.images && product.images.length > 0}
                        <img src={getImageUrl(product.images[0])} alt={product.name} class="w-full h-full object-cover" />
                      {:else}
                        <div class="w-full h-full flex items-center justify-center text-[#8B7D6B]">
                          <ImageIcon size={20} />
                        </div>
                      {/if}
                    </div>
                  </td>
                  <td class="px-6 py-4 font-mono text-[10px] text-[#8B7D6B]">FR-00{product.id}</td>
                  <td class="px-6 py-4 font-bold text-[#3D3229]">{product.name}</td>
                  <td class="px-6 py-4 text-[#6B5D50]">{product.category}</td>
                  <td class="px-6 py-4 text-[#3D3229]">₹{product.price.toLocaleString()}</td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-[#F5F0EB] text-[#3D3229] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#DDD5CC]">
                      {product.sales_count || 0}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-3">
                      <button 
                        on:click={() => openEditModal(product)}
                        class="p-2 text-[#8B7D6B] hover:text-[#3D3229] transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        on:click={() => handleDelete(product.id)}
                        class="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              {:else}
                <tr>
                  <td colspan="5" class="px-6 py-24 text-center">
                    <div class="flex flex-col items-center justify-center space-y-4">
                      <div class="w-16 h-16 bg-[#F5F0EB] rounded-full flex items-center justify-center text-[#B8A99A]">
                         <ImageIcon size={32} />
                      </div>
                      <div class="space-y-1">
                        <p class="text-[#3D3229] text-lg font-bold">No products available</p>
                        <p class="text-[#8B7D6B] text-sm max-w-xs mx-auto">Your collection is currently empty. Start by adding your first exquisite piece.</p>
                      </div>
                      <button 
                        on:click={openAddModal}
                        class="mt-4 flex items-center gap-2 bg-[#3D3229] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-[#5C4F43] transition-all shadow-lg shadow-[#3D3229]/20"
                      >
                        <Plus size={18} /> Add Your First Product
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else if activeTab === 'hero'}
        <!-- Hero Images Tab -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-[#3D3229]">Hero Section Slideshow</h2>
          <p class="text-[#8B7D6B] mt-1">Manage the high-resolution images displayed in your homepage hero section.</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          {#each heroImages as img}
            <div class="relative aspect-[3/4] bg-[#F5F0EB] group rounded-sm overflow-hidden border border-[#F0EBE5] shadow-sm">
              <img src={getImageUrl(img.image_url)} alt="Hero" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  on:click={() => handleDeleteHero(img.id)}
                  class="bg-white text-red-500 p-3 rounded-full shadow-lg hover:bg-red-50 transition-all transform hover:scale-110"
                  title="Delete Image"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          {/each}
          
          <label for="heroUpload" class="aspect-[3/4] bg-white border-2 border-dashed border-[#F0EBE5] rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-[#3D3229] hover:bg-[#FDFCFB] transition-all group shadow-sm">
            {#if uploadLoading}
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-[#3D3229]"></div>
            {:else}
              <div class="p-4 rounded-full bg-[#F5F0EB] text-[#8B7D6B] group-hover:bg-[#3D3229] group-hover:text-white transition-all mb-4">
                <Upload size={32} />
              </div>
              <span class="text-sm uppercase tracking-widest font-bold text-[#8B7D6B] group-hover:text-[#3D3229]">Add New Image</span>
              <p class="text-[10px] text-[#8B7D6B] mt-2 px-4 text-center">High resolution portrait images recommended</p>
            {/if}
            <input id="heroUpload" type="file" accept="image/*" class="hidden" on:change={handleHeroUpload} />
          </label>
        </div>
      {:else if activeTab === 'orders'}
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-[#3D3229]">Processed Orders</h2>
            <button on:click={fetchOrders} class="p-2 text-[#8B7D6B] hover:text-[#3D3229]"><RefreshCw size={20} /></button>
          </div>
          
          <div class="bg-white border border-[#F0EBE5] rounded-sm overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-[#F5F0EB] text-[#3D3229] uppercase text-xs font-bold tracking-widest">
                <tr>
                  <th class="px-6 py-4">ID</th>
                  <th class="px-6 py-4">Date</th>
                  <th class="px-6 py-4">Customer</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#F0EBE5]">
                {#each orders as order}
                  <tr class="hover:bg-[#FFFCF9]">
                    <td class="px-6 py-4 font-mono text-xs">#{order.id}</td>
                    <td class="px-6 py-4 text-xs text-[#8B7D6B]">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td class="px-6 py-4">
                      <div class="font-bold text-[#3D3229]">{order.customer_name}</div>
                      <div class="text-[10px] text-[#8B7D6B]">{order.customer_phone}</div>
                    </td>
                    <td class="px-6 py-4">
                      <select 
                        value={order.status} 
                        on:change={(e) => updateStatus(order.id, e.target.value)}
                        class="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-[#F5F0EB] border border-[#DDD5CC] outline-none focus:border-[#3D3229]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="on way">On Way</option>
                        <option value="delivered">Delivered</option>
                        <option value="done">Done</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button 
                        on:click={() => viewOrderDetails(order)}
                        class="text-xs font-bold uppercase tracking-widest text-[#3D3229] hover:underline"
                      >View Details</button>
                    </td>
                  </tr>
                {:else}
                  <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-[#8B7D6B]">No processed orders yet. Paste a WhatsApp message to start tracking.</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    {/if}
    {/if}
  </div>
</div>

<!-- View Order Details Modal -->
{#if isViewOrderModalOpen && selectedOrder}
  <div class="fixed inset-0 z-[120] flex items-center justify-center px-4 bg-[#3D3229]/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden">
      <div class="bg-[#F5F0EB] p-6 border-b border-[#DDD5CC] flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-[#3D3229]">Order Details #{selectedOrder.id}</h2>
          <p class="text-[10px] font-bold uppercase tracking-widest text-[#8B7D6B] mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
        </div>
        <button on:click={() => isViewOrderModalOpen = false} class="p-2 hover:bg-black/5 rounded-full"><X size={24} /></button>
      </div>
      
      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="space-y-6">
          <section>
            <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A] mb-3">Customer Information</h3>
            <div class="space-y-1">
              <p class="text-lg font-bold text-[#3D3229]">{selectedOrder.customer_name}</p>
              <p class="text-sm text-[#3D3229]">{selectedOrder.customer_phone}</p>
            </div>
          </section>
          
          <section>
            <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A] mb-3">Shipping Address</h3>
            <div class="p-4 bg-[#FDFCFB] border border-[#F5F0EB] text-sm text-[#3D3229] whitespace-pre-line">
              {selectedOrder.customer_address || 'No address provided'}
            </div>
          </section>

          <section>
            <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A] mb-3">Order Status</h3>
            <div class="flex items-center gap-4">
              <span class="px-4 py-2 bg-[#F5F0EB] border border-[#DDD5CC] text-[10px] font-bold uppercase tracking-[0.2em] text-[#3D3229]">
                {selectedOrder.status}
              </span>
            </div>
          </section>
        </div>
        
        <div class="space-y-6">
          <section>
            <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A] mb-3">Products</h3>
            <div class="bg-[#FDFCFB] border border-[#F5F0EB] divide-y divide-[#F5F0EB]">
              {#each selectedOrder.items as item}
                <div class="p-4 flex justify-between items-center text-sm">
                  <div>
                    <div class="font-bold text-[#3D3229]">{item.product_name}</div>
                    <div class="text-xs text-[#8B7D6B]">Ref: FR-00{item.product_id} × {item.quantity}</div>
                  </div>
                  <div class="font-mono font-bold">₹{(item.price_at_purchase * item.quantity).toLocaleString()}</div>
                </div>
              {/each}
              <div class="p-4 flex justify-between items-center bg-[#F5F0EB]">
                <span class="font-bold uppercase tracking-widest text-[10px]">Total Amount</span>
                <span class="text-xl font-bold">₹{selectedOrder.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </section>
          
          <section>
            <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#B8A99A] mb-3">Original Message</h3>
            <div class="p-4 bg-gray-50 border border-gray-200 text-[10px] font-mono text-gray-600 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {selectedOrder.raw_message}
            </div>
          </section>
        </div>
      </div>
      
      <div class="p-6 bg-[#FDFCFB] border-t border-[#F5F0EB] flex justify-end">
        <button 
          on:click={() => isViewOrderModalOpen = false}
          class="px-8 py-3 bg-[#3D3229] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#5C4F43] transition-all"
        >Close</button>
      </div>
    </div>
  </div>
{/if}

<!-- WhatsApp Order Modal -->
{#if isOrderModalOpen}
  <div class="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-[#3D3229]/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-2xl rounded-sm shadow-2xl p-8 space-y-6">
      <div class="flex justify-between items-center border-b border-[#F0EBE5] pb-4">
        <h2 class="text-2xl font-bold text-[#3D3229]">Paste WhatsApp Message</h2>
        <button on:click={() => isOrderModalOpen = false}><X size={24} /></button>
      </div>
      
      <div class="space-y-4">
        <div>
          <label for="manualPhone" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Verified Customer Phone</label>
          <input 
            id="manualPhone"
            type="tel" 
            bind:value={manualOrderPhone}
            class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none focus:border-[#25D366] transition-all text-sm"
            placeholder="Ex: +91 98765 43210"
          />
          <p class="text-[10px] text-[#8B7D6B] mt-2 italic">* Enter the phone number from the actual WhatsApp chat for accuracy.</p>
        </div>

        <div class="pt-4">
          <label for="orderMsg" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Order Message</label>
          <p class="text-[10px] text-[#8B7D6B] mb-2">Paste the exact order message received on WhatsApp.</p>
          <textarea 
            id="orderMsg"
            bind:value={rawOrderMessage}
            placeholder="Paste message here..."
            class="w-full h-48 p-4 bg-[#FDFCFB] border border-[#F0EBE5] font-mono text-sm outline-none focus:border-[#25D366] transition-all"
          ></textarea>
        </div>
        
        {#if parsingStatus}
          <p class="text-xs font-bold uppercase tracking-widest {parsingStatus.includes('Error') || parsingStatus.includes('Failed') ? 'text-red-500' : 'text-[#25D366]'}">{parsingStatus}</p>
        {/if}
      </div>
      
      <div class="flex gap-4">
        <button 
          on:click={parseAndSaveOrder}
          disabled={!rawOrderMessage}
          class="flex-grow py-4 bg-[#25D366] text-white font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ClipboardList size={18} /> Parse & Save Order
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Modal -->
{#if isModalOpen}
  <div class="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#3D3229]/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl">
      <div class="p-8 border-b border-[#F0EBE5] flex justify-between items-center sticky top-0 bg-white z-10">
        <h2 class="text-2xl font-bold text-[#3D3229]">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <button on:click={() => isModalOpen = false} class="text-[#8B7D6B] hover:text-[#3D3229]">
          <X size={24} />
        </button>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div>
            <label for="productName" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Product Name</label>
            <input 
              id="productName"
              type="text" 
              bind:value={formProduct.name}
              class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] focus:border-[#3D3229] outline-none transition-all capitalize"
              placeholder="Ex: Diamond Solitaire Ring"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="productPrice" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Price (₹)</label>
              <input 
                id="productPrice"
                type="number" 
                bind:value={formProduct.price}
                class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] focus:border-[#3D3229] outline-none transition-all"
              />
            </div>
            <div>
              <label for="productCategory" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Category</label>
              <select 
                id="productCategory"
                bind:value={formProduct.category}
                class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] focus:border-[#3D3229] outline-none transition-all"
              >
                <option>Ring</option>
                <option>Necklace</option>
                <option>Earrings</option>
                <option>Bracelet</option>
                <option>Bangle</option>
                <option>Pendant</option>
              </select>
            </div>
          </div>

          <div>
            <label for="productDescription" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Description</label>
            <textarea 
              id="productDescription"
              bind:value={formProduct.description}
              rows="4"
              class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] focus:border-[#3D3229] outline-none transition-all resize-none"
              placeholder="Tell the story of this piece..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="productMaterial" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Material</label>
              <input id="productMaterial" type="text" bind:value={formProduct.material} class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none" />
            </div>
            <div>
              <label for="productWeight" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Weight</label>
              <input id="productWeight" type="text" bind:value={formProduct.weight} class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none" placeholder="Ex: 4.5g" />
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <span class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Product Images</span>
            <div class="grid grid-cols-3 gap-2 mb-4">
              {#each formProduct.images as img, i}
                <div class="relative aspect-square bg-[#F5F0EB] group">
                  <img src={getImageUrl(img)} alt="Product" class="w-full h-full object-cover" />
                  <button 
                    on:click={() => removeImage(i)}
                    class="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              {/each}
              
              <label for="productUpload" class="aspect-square bg-[#FDFCFB] border-2 border-dashed border-[#F0EBE5] flex flex-col items-center justify-center cursor-pointer hover:border-[#3D3229] transition-all">
                {#if uploadLoading}
                  <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-[#3D3229]"></div>
                {:else}
                  <Upload size={20} class="text-[#8B7D6B]" />
                  <span class="text-[10px] uppercase tracking-widest font-bold text-[#8B7D6B] mt-2">Upload</span>
                {/if}
                <input id="productUpload" type="file" accept="image/*" class="hidden" on:change={handleFileUpload} />
              </label>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="productDimensions" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Dimensions</label>
              <input id="productDimensions" type="text" bind:value={formProduct.dimensions} class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none" />
            </div>
            <div>
              <label for="productFinish" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Finish</label>
              <input id="productFinish" type="text" bind:value={formProduct.finish} class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none" />
            </div>
          </div>

          <div>
            <label for="productStone" class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Main Stone</label>
            <input id="productStone" type="text" bind:value={formProduct.stone} class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none" placeholder="Ex: VVS Diamond" />
          </div>

          <div class="flex items-center space-x-3 py-4 border-t border-[#F0EBE5]">
            <input 
              id="isNew" 
              type="checkbox" 
              bind:checked={formProduct.is_new}
              class="w-5 h-5 accent-[#3D3229] cursor-pointer"
            />
            <label for="isNew" class="text-xs font-bold uppercase tracking-widest text-[#3D3229] cursor-pointer">Mark as New Collection</label>
          </div>

          <button 
            on:click={handleSave}
            class="w-full py-4 bg-[#3D3229] text-white font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-[#5C4F43] transition-all mt-8"
          >
            <Save size={18} /> {editingProduct ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
