<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Task } from '../store';
  import TaskItem from './TaskItem.svelte';

  export let tasks: Task[] = [];
  export let selectedDate: string | null = null;

  const dispatch = createEventDispatcher();
  
  let newTaskText = "";

  $: dayTasks = selectedDate ? tasks.filter(t => t.date === selectedDate) : [];

  function handleUpdate(event: CustomEvent) {
    dispatch('updateTask', event.detail);
  }

  function handleDelete(event: CustomEvent) {
    dispatch('deleteTask', event.detail);
  }

  function handleAdd() {
    if (newTaskText.trim() && selectedDate) {
      dispatch('addTask', { text: newTaskText, date: selectedDate });
      newTaskText = "";
    }
  }
</script>

<div class="control-panel">
  {#if selectedDate}
    <div class="panel-header">
      <h3>Tasks for {selectedDate}</h3>
    </div>

    <div class="task-list">
      {#if dayTasks.length === 0}
        <p class="empty-state">No tasks for this day.</p>
      {:else}
        {#each dayTasks as task (task.id)}
          <TaskItem {task} on:update={handleUpdate} on:delete={handleDelete} />
        {/each}
      {/if}
    </div>

    <div class="add-task-form">
      <input 
        type="text" 
        bind:value={newTaskText} 
        placeholder="Add a new task..." 
        on:keydown={(e) => e.key === 'Enter' && handleAdd()}
      />
      <button on:click={handleAdd} disabled={!newTaskText.trim()}>Add</button>
    </div>
  {:else}
    <div class="empty-state">
      <p>Select a date on the calendar to view and manage tasks.</p>
    </div>
  {/if}
</div>

<style>
  .control-panel {
    background: var(--background-primary);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--background-modifier-border);
  }
  .panel-header {
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--background-modifier-border);
    padding-bottom: 0.5rem;
  }
  .panel-header h3 {
    margin: 0;
    color: var(--text-normal);
  }
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    max-height: 300px;
    overflow-y: auto;
  }
  .empty-state {
    color: var(--text-muted);
    font-style: italic;
    text-align: center;
    padding: 1rem 0;
  }
  .add-task-form {
    display: flex;
    gap: 0.5rem;
  }
  .add-task-form input {
    flex-grow: 1;
    background: var(--background-modifier-form-field);
    border: 1px solid var(--background-modifier-border);
    color: var(--text-normal);
    padding: 4px 8px;
    border-radius: 4px;
  }
  .add-task-form button {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
    border: none;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
  }
  .add-task-form button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
