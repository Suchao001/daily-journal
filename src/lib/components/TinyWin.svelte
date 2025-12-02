<script lang="ts">
  import { onMount } from 'svelte';
  import Modal from './Modal.svelte';
  import WinForm from './WinForm.svelte';

  interface Win {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    completedAt: string;
    createdAt: string;
  }

  interface WinFormData {
    title: string;
    description: string;
    category: string;
    completedAt: string;
  }

  let { initialWins = [] }: { initialWins?: Win[] } = $props();

  let wins = $state<Win[]>([]);
  let isModalOpen = $state(false);
  let editingWin = $state<Win | null>(null);
  let isListLoading = $state(false);
  let listError = $state<string | null>(null);
  let isSubmitting = $state(false);
  let formError = $state<string | null>(null);

  function sortWins(winList: Win[]) {
    return [...winList].sort(
      (a, b) =>
        new Date(b.completedAt || b.createdAt).getTime() -
        new Date(a.completedAt || a.createdAt).getTime()
    );
  }

  $effect(() => {
    wins = sortWins([...initialWins]);
  });

  onMount(() => {
    if (!wins.length) {
      refreshWins();
    }
  });

  async function refreshWins() {
    isListLoading = true;
    listError = null;
    try {
      const response = await fetch('/api/tiny-win');
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูล Tiny Win ได้');
      }
      wins = sortWins(await response.json());
    } catch (error) {
      listError = (error as Error).message;
    } finally {
      isListLoading = false;
    }
  }

  function openAddModal() {
    editingWin = null;
    formError = null;
    isModalOpen = true;
  }

  function openEditModal(win: Win) {
    editingWin = win;
    formError = null;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    editingWin = null;
    formError = null;
  }

  async function handleSave(data: WinFormData) {
    isSubmitting = true;
    formError = null;

    const url = editingWin ? `/api/tiny-win/${editingWin.id}` : '/api/tiny-win';
    const method = editingWin ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }

      const savedWin: Win = await response.json();
      if (editingWin) {
        wins = sortWins(wins.map(win => (win.id === savedWin.id ? savedWin : win)));
      } else {
        wins = sortWins([savedWin, ...wins]);
      }

      closeModal();
    } catch (error) {
      formError = (error as Error).message;
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(id: number) {
    const confirmed = confirm('ต้องการลบ Tiny Win นี้?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/tiny-win/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'ไม่สามารถลบ Tiny Win ได้');
      }
      wins = wins.filter(win => win.id !== id);
    } catch (error) {
      alert((error as Error).message);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  let groupedWins = $derived(() => {
    const groups = new Map<string, Win[]>();

    wins.forEach(win => {
      const key = win.completedAt?.slice(0, 10) || win.createdAt.slice(0, 10);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(win);
    });

    return Array.from(groups.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
  });
</script>

<section class="tiny-win-section">
  <div class="section-header">
    <h2>🏆 Tiny Wins</h2>
    <button class="btn-primary" onclick={openAddModal}>+ เพิ่ม Win</button>
  </div>

  <div class="wins-list">
    {#if isListLoading}
      <div class="empty-state">
        <p>กำลังโหลด Tiny Wins...</p>
      </div>
    {:else if listError}
      <div class="empty-state error-state">
        <p>{listError}</p>
        <button class="btn-outline" onclick={refreshWins}>ลองอีกครั้ง</button>
      </div>
    {:else if wins.length === 0}
      <div class="empty-state">
        <p>ยังไม่มี Tiny Win</p>
        <p class="subtext">เริ่มบันทึกความสำเร็จเล็ก ๆ ของคุณวันนี้</p>
      </div>
    {:else}
      {#each groupedWins() as [date, dateWins]}
        <div class="date-group">
          <h3 class="date-header">{formatDate(date)}</h3>
          <div class="wins-grid">
            {#each dateWins as win (win.id)}
              <div class="win-card">
                <div class="win-content">
                  <div class="win-header">
                    <h4>{win.title}</h4>
                    {#if win.category}
                      <span class="category-badge">{win.category}</span>
                    {/if}
                  </div>
                  {#if win.description}
                    <p class="win-description">{win.description}</p>
                  {/if}
                </div>
                <div class="win-actions">
                  <button
                    class="action-btn"
                    onclick={() => openEditModal(win)}
                    aria-label="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    class="action-btn delete-btn"
                    onclick={() => handleDelete(win.id)}
                    aria-label="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <Modal isOpen={isModalOpen} onClose={closeModal} title={editingWin ? 'แก้ไข Win' : 'เพิ่ม Tiny Win'}>
    {#snippet children()}
      <WinForm
        onSave={handleSave}
        onCancel={closeModal}
        isSubmitting={isSubmitting}
        errorMessage={formError}
        initialData={editingWin ? {
          title: editingWin.title,
          description: editingWin.description ?? '',
          category: editingWin.category ?? '',
          completedAt: editingWin.completedAt.slice(0, 10)
        } : undefined}
      />
    {/snippet}
  </Modal>
</section>

<style>
  .tiny-win-section {
    margin-bottom: 3rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  .wins-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-text-secondary);
  }

  .empty-state p {
    margin: 0.5rem 0;
  }

  .subtext {
    font-size: 0.875rem;
  }

  .date-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .date-header {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .wins-grid {
    display: grid;
    gap: 1rem;
  }

  .win-card {
    background: white;
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    transition: all 0.2s;
  }

  .win-card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
  }

  .win-content {
    flex: 1;
  }

  .win-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.25rem;
  }

  .win-card h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .category-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background-color: var(--color-secondary);
    color: white;
    border-radius: 0.25rem;
    font-weight: 500;
  }

  .win-description {
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .win-actions {
    display: flex;
    gap: 0.25rem;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    font-size: 1.25rem;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .action-btn:hover {
    opacity: 1;
  }

  .delete-btn:hover {
    filter: brightness(0.8);
  }
</style>
