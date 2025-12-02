<script lang="ts">
  interface Props {
    onSave: (goal: { title: string; targetDate: string; target: number }) => void;
    onCancel: () => void;
    initialData?: { title: string; targetDate: string; target: number };
  }

  let { onSave, onCancel, initialData }: Props = $props();

  let title = $state(initialData?.title || '');
  let targetDate = $state(initialData?.targetDate || '');
  let target = $state(initialData?.target || 1);

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title, targetDate, target });
    }
  }
</script>

<form onsubmit={handleSubmit}>
  <div class="form-group">
    <label for="goal-title">เป้าหมาย</label>
    <input
      id="goal-title"
      type="text"
      bind:value={title}
      placeholder="เช่น อ่านหนังสือ 1 เล่ม"
      required
    />
  </div>

  <div class="form-group">
    <label for="goal-target">จำนวนที่ต้องทำ</label>
    <input
      id="goal-target"
      type="number"
      bind:value={target}
      min="1"
      placeholder="1"
    />
    <small>จำนวนครั้งหรือหน่วยที่ต้องการทำให้สำเร็จ</small>
  </div>

  <div class="form-group">
    <label for="goal-date">วันที่เป้าหมาย (ไม่บังคับ)</label>
    <input
      id="goal-date"
      type="date"
      bind:value={targetDate}
    />
  </div>

  <div class="form-actions">
    <button type="button" class="btn-outline" onclick={onCancel}>ยกเลิก</button>
    <button type="submit" class="btn-primary">สร้างเป้าหมาย</button>
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

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(116, 199, 236, 0.1);
  }

  small {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
</style>
