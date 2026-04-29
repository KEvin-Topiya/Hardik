<script>
  import { onMount } from 'svelte';
  import { Plus, Edit, Trash2, Upload, X, Save, Image as ImageIcon } from 'lucide-svelte';
  import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage, getHeroImages, addHeroImage, deleteHeroImage } from '../services/api';
  import SEO from '../components/SEO.svelte';

  let products = [];
  let heroImages = [];
  let loading = true;
  let activeTab = 'products';
  let editingProduct = null;
  let isModalOpen = false;
  let uploadLoading = false;

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
    images: []
  };

  onMount(() => {
    fetchProducts();
    fetchHeroImages();
  });

  async function fetchProducts() {
    loading = true;
    try {
      products = await getProducts();
    } catch (e) {
      console.error(e);
      alert('Failed to load products');
    } finally {
      loading = false;
    }
  }

  async function fetchHeroImages() {
    try {
      heroImages = await getHeroImages();
    } catch (e) {
      console.error("Failed to load hero images", e);
    }
  }

  async function handleHeroUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    uploadLoading = true;
    try {
      const result = await uploadImage(files[0]);
      await addHeroImage(result.url);
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
      images: []
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
      const result = await uploadImage(file);
      formProduct.images = [...formProduct.images, result.url];
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
    <div class="mb-8">
      <a href="#home" class="inline-flex items-center text-[#8B7D6B] hover:text-[#3D3229] transition-colors text-sm font-bold uppercase tracking-widest gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Website
      </a>
    </div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-[#3D3229]">Dashboard</h1>
        <p class="text-[#8B7D6B] mt-2">Manage your products and website content.</p>
      </div>
      {#if activeTab === 'products'}
        <button 
          on:click={openAddModal}
          class="flex items-center gap-2 bg-[#3D3229] text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-[#5C4F43] transition-all"
        >
          <Plus size={18} /> Add Product
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
    </div>

    {#if loading}
      <div class="flex justify-center py-24">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3D3229]"></div>
      </div>
    {:else}
      {#if activeTab === 'products'}
        <div class="bg-white shadow-sm border border-[#F0EBE5] overflow-hidden rounded-sm">
          <table class="w-full text-left">
            <thead class="bg-[#F5F0EB] text-[#3D3229] uppercase text-xs font-bold tracking-widest">
              <tr>
                <th class="px-6 py-4">Image</th>
                <th class="px-6 py-4">Product Name</th>
                <th class="px-6 py-4">Category</th>
                <th class="px-6 py-4">Price</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F0EBE5]">
              {#each products as product}
                <tr class="hover:bg-[#FFFCF9] transition-colors">
                  <td class="px-6 py-4">
                    <div class="w-12 h-12 bg-[#F5F0EB] rounded-sm overflow-hidden">
                      {#if product.images && product.images.length > 0}
                        <img src={product.images[0]} alt={product.name} class="w-full h-full object-cover" />
                      {:else}
                        <div class="w-full h-full flex items-center justify-center text-[#8B7D6B]">
                          <ImageIcon size={20} />
                        </div>
                      {/if}
                    </div>
                  </td>
                  <td class="px-6 py-4 font-bold text-[#3D3229]">{product.name}</td>
                  <td class="px-6 py-4 text-[#6B5D50]">{product.category}</td>
                  <td class="px-6 py-4 text-[#3D3229]">₹{product.price.toLocaleString()}</td>
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
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <!-- Hero Images Tab -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-[#3D3229]">Hero Section Slideshow</h2>
          <p class="text-[#8B7D6B] mt-1">Manage the high-resolution images displayed in your homepage hero section.</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          {#each heroImages as img}
            <div class="relative aspect-[3/4] bg-[#F5F0EB] group rounded-sm overflow-hidden border border-[#F0EBE5] shadow-sm">
              <img src={img.image_url} alt="Hero" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
          
          <label class="aspect-[3/4] bg-white border-2 border-dashed border-[#F0EBE5] rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-[#3D3229] hover:bg-[#FDFCFB] transition-all group shadow-sm">
            {#if uploadLoading}
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-[#3D3229]"></div>
            {:else}
              <div class="p-4 rounded-full bg-[#F5F0EB] text-[#8B7D6B] group-hover:bg-[#3D3229] group-hover:text-white transition-all mb-4">
                <Upload size={32} />
              </div>
              <span class="text-sm uppercase tracking-widest font-bold text-[#8B7D6B] group-hover:text-[#3D3229]">Add New Image</span>
              <p class="text-[10px] text-[#8B7D6B] mt-2 px-4 text-center">High resolution portrait images recommended</p>
            {/if}
            <input type="file" accept="image/*" class="hidden" on:change={handleHeroUpload} />
          </label>
        </div>
      {/if}
    {/if}
  </div>
</div>

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
            <label class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Product Name</label>
            <input 
              type="text" 
              bind:value={formProduct.name}
              class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] focus:border-[#3D3229] outline-none transition-all"
              placeholder="Ex: Diamond Solitaire Ring"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Price (₹)</label>
              <input 
                type="number" 
                bind:value={formProduct.price}
                class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] focus:border-[#3D3229] outline-none transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Category</label>
              <select 
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
            <label class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Description</label>
            <textarea 
              bind:value={formProduct.description}
              rows="4"
              class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] focus:border-[#3D3229] outline-none transition-all resize-none"
              placeholder="Tell the story of this piece..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Material</label>
              <input type="text" bind:value={formProduct.material} class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Weight</label>
              <input type="text" bind:value={formProduct.weight} class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none" placeholder="Ex: 4.5g" />
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Product Images</label>
            <div class="grid grid-cols-3 gap-2 mb-4">
              {#each formProduct.images as img, i}
                <div class="relative aspect-square bg-[#F5F0EB] group">
                  <img src={img} alt="Product" class="w-full h-full object-cover" />
                  <button 
                    on:click={() => removeImage(i)}
                    class="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              {/each}
              
              <label class="aspect-square bg-[#FDFCFB] border-2 border-dashed border-[#F0EBE5] flex flex-col items-center justify-center cursor-pointer hover:border-[#3D3229] transition-all">
                {#if uploadLoading}
                  <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-[#3D3229]"></div>
                {:else}
                  <Upload size={20} class="text-[#8B7D6B]" />
                  <span class="text-[10px] uppercase tracking-widest font-bold text-[#8B7D6B] mt-2">Upload</span>
                {/if}
                <input type="file" accept="image/*" class="hidden" on:change={handleFileUpload} />
              </label>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Dimensions</label>
              <input type="text" bind:value={formProduct.dimensions} class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Finish</label>
              <input type="text" bind:value={formProduct.finish} class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-[#8B7D6B] mb-2">Main Stone</label>
            <input type="text" bind:value={formProduct.stone} class="w-full px-4 py-3 bg-[#FDFCFB] border border-[#F0EBE5] outline-none" placeholder="Ex: VVS Diamond" />
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
