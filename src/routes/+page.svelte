<script lang="ts">
  import TinyWin from '$lib/components/TinyWin.svelte';
  import GoalTracker from '$lib/components/GoalTracker.svelte';
  import '../routes/app.css';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let today = new Date().toLocaleDateString('th-TH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
</script>

<div class="app-container">
  <header class="app-header">
    <div class="header-content">
      <h1>Daily Tracker</h1>
      <p class="subtitle">{today}</p>
    </div>
  </header>

  <main class="main-content">
    <div class="content-wrapper">
      <TinyWin initialWins={data?.tinyWins ?? []} />
      <GoalTracker />
    </div>
  </main>
</div>

<style>
  .app-container {
    min-height: 100vh;
    background-color: var(--color-bg);
  }

  .app-header {
    background: white;
    border-bottom: 1px solid var(--color-border);
    padding: 2rem 1rem;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .app-header h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    margin: 0.5rem 0 0 0;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }

  .main-content {
    padding: 2rem 1rem;
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .app-header {
      padding: 3rem 2rem;
    }

    .main-content {
      padding: 3rem 2rem;
    }
  }
</style>
