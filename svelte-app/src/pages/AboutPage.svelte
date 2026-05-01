<script>
  import { Diamond, ShieldCheck, Ruler, Fingerprint } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import AnimatedCounter from '../components/AnimatedCounter.svelte';
  import SEO from '../components/SEO.svelte';
</script>

<SEO 
  title="About Our Heritage | Aarti Abhushan" 
  description="Discover the story of Aarti Abhushan. Our heritage of fine craftsmanship and commitment to quality in every jewelry piece."
  keywords="about Aarti Abhushan, Aarti, Abhushan, Aarti Abhusan, Abhusan, Arati, jewelry brand history, craftsmanship, jewelry designers, authentic jewelry India, luxury jewelry heritage, traditional jewelry store"
/>

<div class="min-h-screen bg-[#FFFCF9] pb-24" in:fade>
  <!-- Hero -->
  <section class="h-[60vh] bg-[#3D3229] relative overflow-hidden flex flex-col justify-center px-4">
    <div class="absolute inset-0 z-0 opacity-10">
      <div class="w-full h-full border-[100px] border-white rounded-full scale-110 transform translate-x-1/2 -translate-y-1/2 absolute top-0 right-0" />
    </div>
    
    <div class="max-w-7xl mx-auto w-full z-10 space-y-6">
      <h1 class="text-xs font-bold text-[#8B7D6B] tracking-[0.4em] uppercase">The House</h1>
      <h2 class="text-5xl md:text-8xl font-bold text-white leading-tight tracking-tight">Geometry & <br/>Heritage</h2>
    </div>
  </section>

  <!-- Content -->
  <section class="max-w-7xl mx-auto px-4 py-32 grid grid-cols-1 lg:grid-cols-2 gap-24">
    <div class="space-y-12">
      <div class="w-16 h-1 bg-[#3D3229]" />
      <h3 class="text-4xl font-bold text-[#3D3229] leading-tight">Founded on the intersection of modern architecture and manual craftsmanship.</h3>
      <p class="text-[#6B5D50] text-xl font-medium leading-relaxed">
        Meridian began as a studio dedicated to the study of form. We believe that jewelry should be an extension of the body's natural geometry, not an ornament.
      </p>
      <p class="text-[#8B7D6B] text-lg leading-relaxed">
        Our designs are influenced by brutalist structures, mathematical constants, and the golden ratio. Each piece is not just made; it is engineered using 3D modeling and hand-finished by master goldsmiths.
      </p>
    </div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div class="p-8 bg-[#F5F0EB] text-center space-y-4 border border-[#DDD5CC]">
        <div class="mx-auto w-12 h-12 flex items-center justify-center text-[#3D3229]">
          <ShieldCheck size={32} />
        </div>
        <h4 class="font-bold text-[#3D3229] uppercase tracking-widest text-sm">Authenticity</h4>
        <p class="text-xs text-[#8B7D6B] leading-relaxed font-medium">Every piece is laser-engraved with a unique serial number and digital certificate of ownership.</p>
      </div>
      <div class="p-8 bg-[#F5F0EB] text-center space-y-4 border border-[#DDD5CC]">
        <div class="mx-auto w-12 h-12 flex items-center justify-center text-[#3D3229]">
          <Ruler size={32} />
        </div>
        <h4 class="font-bold text-[#3D3229] uppercase tracking-widest text-sm">Precision</h4>
        <p class="text-xs text-[#8B7D6B] leading-relaxed font-medium">Tolerance levels of less than 0.01mm ensure perfect structural integrity across the collection.</p>
      </div>
      <div class="p-8 bg-[#F5F0EB] text-center space-y-4 border border-[#DDD5CC]">
        <div class="mx-auto w-12 h-12 flex items-center justify-center text-[#3D3229]">
          <Fingerprint size={32} />
        </div>
        <h4 class="font-bold text-[#3D3229] uppercase tracking-widest text-sm">Finishing</h4>
        <p class="text-xs text-[#8B7D6B] leading-relaxed font-medium">Seven stages of hand-polishing and ultrasonic cleaning for an unparalleled interior feel.</p>
      </div>
       <div class="p-8 bg-[#F5F0EB] text-center space-y-4 border border-[#DDD5CC]">
        <div class="mx-auto w-12 h-12 flex items-center justify-center text-[#3D3229]">
          <Diamond size={32} />
        </div>
        <h4 class="font-bold text-[#3D3229] uppercase tracking-widest text-sm">Rarity</h4>
        <p class="text-xs text-[#8B7D6B] leading-relaxed font-medium">Limited production batches ensure that each Meridian piece remains a rare artifact.</p>
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="max-w-7xl mx-auto px-4 pb-32">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t border-[#EDE7E0]">
      <AnimatedCounter value={2018} label="Established" />
      <AnimatedCounter value={12000} label="Commissions" suffix="+" />
      <AnimatedCounter value={42} label="Countries" />
      <AnimatedCounter value={100} label="Satisfaction" suffix="%" />
    </div>
  </section>
</div>
