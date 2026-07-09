<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Task } from '../store';

  export let task: Task;

  const dispatch = createEventDispatcher();

  function toggleComplete() {
    dispatch('update', {
      task,
      completed: !task.completed,
      date: task.date
    });
  }

  function changeDate(e: Event) {
    const input = e.target as HTMLInputElement;
    if(input.value) {
      dispatch('update', {
        task,
        completed: task.completed,
        date: input.value
      });
    }
  }

  function triggerDelete() {
    dispatch('delete', { task });
  }
</script>

<div class="task-item" class:completed={task.completed}>
  <input 
    type="checkbox" 
    checked={task.completed} 
    on:change={toggleComplete}
    class="task-checkbox"
  />
  <span class="task-text">{task.text}</span>
  <input 
    type="date" 
    value={task.date} 
    on:change={changeDate}
    class="task-date"
  />
  <button class="delete-btn" on:click={triggerDelete} aria-label="Delete task">
    ✕
  </button>
</div>

<style>
  .task-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--background-secondary-alt);
    border-radius: 4px;
    border: 1px solid var(--background-modifier-border);
    transition: opacity 0.2s;
  }
  
  .task-item.completed {
    opacity: 0.6;
  }
  
  .task-item.completed .task-text {
    text-decoration: line-through;
    color: var(--text-muted);
  }
  
  .task-text {
    flex-grow: 1;
    font-size: 0.95em;
  }
  
  .task-checkbox {
    cursor: pointer;
  }
  
  .task-date {
    background: var(--background-modifier-form-field);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 0.85em;
  }

  .delete-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 1em;
  }
  .delete-btn:hover {
    color: var(--text-error);
    background: var(--background-modifier-hover);
  }
</style>
