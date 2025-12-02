<script lang="ts">
  import Modal from './Modal.svelte';
  import GoalForm from './GoalForm.svelte';

  interface Goal {
    id: string;
    title: string;
    targetDate: string;
    target: number;
    current: number;
    completed: boolean;
  }

  let goals = $state<Goal[]>([
    {
      id: '1',
      title: 'อ่านหนังสือ',
      targetDate: '2025-12-31',
      target: 12,
      current: 3,
      completed: false
    },
    {
      id: '2',
      title: 'ออกกำลังกาย',
      targetDate: '2025-12-31',
      target: 100,
      current: 45,
      completed: false
    }
  ]);

  let isModalOpen = $state(false);
  let editingGoal = $state<Goal | null>(null);

  function openAddModal() {
    editingGoal = null;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
    editingGoal = null;
  }

  function handleSave(data: { title: string; targetDate: string; target: number }) {
    if (editingGoal && editingGoal.id) {
      // Update existing goal
      const index = goals.findIndex(g => g.id === editingGoal!.id);
      if (index !== -1) {
        goals[index] = { ...goals[index], ...data };
      }
    } else {
      // Add new goal
      const newGoal: Goal = {
        id: Date.now().toString(),
        ...data,
        current: 0,
        completed: false
      };
      goals = [newGoal, ...goals];
    }
    closeModal();
  }

  function handleIncrement(id: string) {
    const goal = goals.find(g => g.id === id);
    if (goal && goal.current < goal.target) {
      goal.current++;
      if (goal.current >= goal.target) {
        goal.completed = true;
      }
    }
  }

  function handleDecrement(id: string) {
    const goal = goals.find(g => g.id === id);
    if (goal && goal.current > 0) {
      goal.current--;
      goal.completed = false;
    }
  }

  function handleDelete(id: string) {
    if (confirm('ต้องการลบเป้าหมายนี้?')) {
      goals = goals.filter(g => g.id !== id);
    }
  }

  function getProgressPercentage(goal: Goal): number {
    return Math.min((goal.current / goal.target) * 100, 100);
  }
</script>

<section class="goal-tracker-section">
  <div class="section-header">
    <h2>🎯 Goals</h2>
    <button class="btn-secondary" onclick={openAddModal}>+ เพิ่มเป้าหมาย</button>
  </div>

  <div class="goals-list">
    {#if goals.length === 0}
      <div class="empty-state">
        <p>ยังไม่มีเป้าหมาย</p>
        <p class="subtext">กำหนดเป้าหมายและติดตามความคืบหน้า</p>
      </div>
    {:else}
      <div class="goals-grid">
        {#each goals as goal (goal.id)}
          <div class="goal-card" class:completed={goal.completed}>
            <div class="goal-content">
              <div class="goal-header">
                <h4>{goal.title}</h4>
                {#if goal.completed}
                  <span class="completed-badge">✓ สำเร็จ</span>
                {/if}
              </div>
              
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: {getProgressPercentage(goal)}%"></div>
                </div>
                <div class="progress-text">
                  <span class="current">{goal.current}</span>
                  <span class="separator">/</span>
                  <span class="target">{goal.target}</span>
                </div>
              </div>

              {#if goal.targetDate}
                <p class="target-date">🗓️ {goal.targetDate}</p>
              {/if}
            </div>

            <div class="goal-actions">
              <div class="counter-actions">
                <button
                  class="counter-btn"
                  onclick={() => handleDecrement(goal.id)}
                  disabled={goal.current === 0}
                  aria-label="Decrease"
                >
                  −
                </button>
                <button
                  class="counter-btn"
                  onclick={() => handleIncrement(goal.id)}
                  disabled={goal.current >= goal.target}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <button
                class="action-btn delete-btn"
                onclick={() => handleDelete(goal.id)}
                aria-label="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <Modal isOpen={isModalOpen} onClose={closeModal} title={editingGoal ? 'แก้ไขเป้าหมาย' : 'เพิ่มเป้าหมาย'}>
    {#snippet children()}
      <GoalForm
        onSave={handleSave}
        onCancel={closeModal}
        initialData={editingGoal ? {
          title: editingGoal.title,
          targetDate: editingGoal.targetDate,
          target: editingGoal.target
        } : undefined}
      />
    {/snippet}
  </Modal>
</section>

<style>
  .goal-tracker-section {
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

  .goals-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

  .goals-grid {
    display: grid;
    gap: 1rem;
  }

  .goal-card {
    background: white;
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    padding: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    transition: all 0.2s;
  }

  .goal-card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-secondary);
  }

  .goal-card.completed {
    border-color: #10b981;
    background-color: #f0fdf4;
  }

  .goal-content {
    flex: 1;
  }

  .goal-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  .goal-card h4 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .completed-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background-color: #10b981;
    color: white;
    border-radius: 0.25rem;
    font-weight: 500;
  }

  .goal-progress {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .progress-bar {
    flex: 1;
    height: 0.5rem;
    background-color: var(--color-bg-secondary);
    border-radius: 0.25rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
    min-width: 4rem;
    text-align: right;
  }

  .separator {
    color: var(--color-text-secondary);
    margin: 0 0.25rem;
  }

  .target-date {
    margin: 0.5rem 0 0 0;
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }

  .goal-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
  }

  .counter-actions {
    display: flex;
    gap: 0.25rem;
  }

  .counter-btn {
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--color-border);
    background: white;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    color: var(--color-text);
  }

  .counter-btn:hover:not(:disabled) {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
    color: white;
  }

  .counter-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
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
</style>
