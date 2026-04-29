<script>
  export let title = "Aarti Abhushan | Premium Jewelry Collection";
  export let description = "Discover the finest collection of gold, silver, and diamond jewelry at Aarti Abhushan. Exquisite designs for every occasion.";
  export let keywords = "Aarti Abhushan, jewelry, gold jewelry, silver jewelry, diamond jewelry, wedding jewelry, indian jewelry, luxury ornaments";
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />

  <!-- Robots -->
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={window.location.href} />
</svelte:head>
