<script lang="ts">
  interface Props {
    onSave: (win: { title: string; description: string; category: string; completedAt: string }) => void;
    onCancel: () => void;
    initialData?: { title: string; description: string; category: string; completedAt: string };
    isSubmitting?: boolean;
    errorMessage?: string | null;
  }

  let { onSave, onCancel, initialData, isSubmitting = false, errorMessage = null }: Props = $props();

  const today = () => new Date().toISOString().slice(0, 10);

  let title = $state('');
  let description = $state('');
  let category = $state('');
  let completedAt = $state(today());

  $effect(() => {
    title = initialData?.title || '';
    description = initialData?.description || '';
    category = initialData?.category || '';
    completedAt = initialData?.completedAt || today();
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title, description, category, completedAt });
    }
  }
</script>

<form onsubmit={handleSubmit}>
  <div class="form-group">
    <label for="win-title">Tiny Win</label>
    <input
      id="win-title"
      type="text"
      bind:value={title}
      placeholder="เช่น ออกกำลังกาย 30 นาที"
      required
    />
  </div>

  <div class="form-group">
    <label for="win-description">รายละเอียด (ไม่บังคับ)</label>
    <textarea
      id="win-description"
      bind:value={description}
      rows="3"
      placeholder="บันทึกเพิ่มเติม..."
    ></textarea>
  </div>

  <div class="form-group">
    <label for="win-category">หมวดหมู่ (ไม่บังคับ)</label>
    <input
      id="win-category"
      type="text"
      bind:value={category}
      placeholder="เช่น สุขภาพ, งาน, ความสัมพันธ์"
    />
  </div>

  <div class="form-group">
    <label for="win-completed-at">วันที่สำเร็จ</label>
    <input
      id="win-completed-at"
      type="date"
      bind:value={completedAt}
      required
    />
  </div>

  {#if errorMessage}
    <p class="error-message" aria-live="assertive">{errorMessage}</p>
  {/if}

  <div class="form-actions">
    <button type="button" class="btn-outline" onclick={onCancel} disabled={isSubmitting}>
      ยกเลิก
    </button>
    <button type="submit" class="btn-primary" disabled={isSubmitting}>
      {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
    </button>
  </div>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.2s;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(116, 199, 236, 0.1);
  }

  textarea {
    resize: vertical;
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }

  .error-message {
    color: #d14343;
    font-size: 0.875rem;
    margin: -0.5rem 0 0;
  }
</style>
