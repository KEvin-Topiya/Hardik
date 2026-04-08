<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';

  export let value = 0;
  export let label = '';
  export let suffix = '';

  const count = tweened(0, {
    duration: 1500,
    easing: cubicOut
  });

  let element;
  let isInView = false;

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isInView) {
        isInView = true;
        count.set(value);
      }
    }, { threshold: 0.1 });

    observer.observe(element);
    return () => observer.disconnect();
  });
</script>

<div bind:this={element} class="text-center">
  <div class="text-4xl font-bold text-[#3D3229]" in:fly={{ y: 20, duration: 600 }}>
    {Math.round($count).toLocaleString()}
    {suffix}
  </div>

  <p class="text-[10px] mt-2 text-[#8B7D6B] uppercase tracking-[0.2em] font-bold">
    {label}
  </p>
</div>
