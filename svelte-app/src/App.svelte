<script>
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import HomePage from './pages/HomePage.svelte';
  import ShopPage from './pages/ShopPage.svelte';
  import ProductDetailPage from './pages/ProductDetailPage.svelte';
  import CartPage from './pages/CartPage.svelte';
  import AboutPage from './pages/AboutPage.svelte';
  import AdminPage from './pages/AdminPage.svelte';

  let currentPage = 'home';
  let selectedProduct = null;

  onMount(() => {
    const validPages = ['home', 'shop', 'product', 'cart', 'about', 'admin'];
    
    // Check URL first
    let path = window.location.hash.slice(1);
    if (!path || !validPages.includes(path)) {
      // Fallback to local storage or home if invalid hash
      const savedPage = localStorage.getItem('currentPage');
      path = validPages.includes(savedPage) ? savedPage : 'home';
      window.location.hash = path;
    }
    currentPage = path;
    
    const savedProduct = localStorage.getItem('selectedProduct');
    if (savedProduct && currentPage === 'product') {
      try {
        selectedProduct = JSON.parse(savedProduct);
      } catch (e) {
        console.error("Failed to parse saved product", e);
      }
    }

    const handleHashChange = () => {
      let newPath = window.location.hash.slice(1);
      if (!newPath || !validPages.includes(newPath)) {
        newPath = 'home';
        window.location.hash = newPath;
      }
      currentPage = newPath;
      localStorage.setItem('currentPage', newPath);
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  });

  function navigate(page) {
    currentPage = page;
    localStorage.setItem('currentPage', page);
    window.location.hash = page;
    if (page !== 'product') {
      selectedProduct = null;
      localStorage.removeItem('selectedProduct');
    }
  }

  function handleProductClick(product) {
    selectedProduct = product;
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    currentPage = 'product';
    localStorage.setItem('currentPage', 'product');
    window.location.hash = 'product';
  }
</script>

<div class="min-h-screen flex flex-col bg-[#FFFCF9]">
  {#if currentPage !== 'admin'}
    <Header {currentPage} on:navigate={(e) => navigate(e.detail)} />
  {/if}

  <main class="flex-grow">
    {#if currentPage === 'home'}
      <HomePage 
        on:navigate={(e) => navigate(e.detail)} 
        on:productClick={(e) => handleProductClick(e.detail)} 
      />
    {:else if currentPage === 'shop'}
      <ShopPage on:productClick={(e) => handleProductClick(e.detail)} />
    {:else if currentPage === 'product'}
      {#if selectedProduct}
        <ProductDetailPage 
          product={selectedProduct} 
          on:back={() => navigate('shop')} 
          on:navigate={(e) => navigate(e.detail)}
        />
      {:else}
        <ShopPage on:productClick={(e) => handleProductClick(e.detail)} />
      {/if}
    {:else if currentPage === 'cart'}
      <CartPage on:navigate={(e) => navigate(e.detail)} />
    {:else if currentPage === 'about'}
      <AboutPage />
    {:else if currentPage === 'admin'}
      <AdminPage />
    {:else}
      <HomePage 
        on:navigate={(e) => navigate(e.detail)} 
        on:productClick={(e) => handleProductClick(e.detail)} 
      />
    {/if}
  </main>

  {#if currentPage !== 'admin'}
    <Footer on:navigate={(e) => navigate(e.detail)} />
  {/if}
</div>

<style>
  :global(*){
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
</style>
