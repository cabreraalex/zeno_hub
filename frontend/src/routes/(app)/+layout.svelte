<script lang="ts">
  import Header from '$lib/components/general/Header.svelte';
  import { fade } from 'svelte/transition';

  export let data;
</script>

<main>
  <Header />
  {#key data.url}
    <div
      class="container centered"
      in:fade={{ duration: 300, delay: 400 }}
      out:fade={{ duration: 300 }}
    >
      <slot />
    </div>
  {/key}
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
    text-align: left;
    width: 100%;
    height: 100%;
  }

  .container {
    width: 100%;
    height: 100%;
  }

  .centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
