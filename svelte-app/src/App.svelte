<script>
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import HomePage from './pages/HomePage.svelte';
  import ShopPage from './pages/ShopPage.svelte';
  import ProductDetailPage from './pages/ProductDetailPage.svelte';
  import CartPage from './pages/CartPage.svelte';
  import AboutPage from './pages/AboutPage.svelte';

  let currentPage = 'home';
  let selectedProduct = null;

  function navigate(page) {
    currentPage = page;
    if (page !== 'product') {
      selectedProduct = null;
    }
  }

  function handleProductClick(product) {
    selectedProduct = product;
    currentPage = 'product';
  }
</script>

<div class="min-h-screen flex flex-col bg-[#FFFCF9]">
  <Header {currentPage} on:navigate={(e) => navigate(e.detail)} />

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
    {:else}
      <HomePage 
        on:navigate={(e) => navigate(e.detail)} 
        on:productClick={(e) => handleProductClick(e.detail)} 
      />
    {/if}
  </main>

  <Footer on:navigate={(e) => navigate(e.detail)} />
</div>

<style>
  :global(*){
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
</style>
