<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Task } from '../store';
  import TaskItem from './TaskItem.svelte';

  export let tasks: Task[] = [];

  const dispatch = createEventDispatcher();
  
  let timeFilter: 'overdue' | 'upcoming-3' | 'upcoming-7' | 'upcoming-14' = 'overdue';
  let statusFilter: 'uncompleted' | 'completed' | 'all' = 'uncompleted';

  function parseDate(dateStr: string) {
    const [y, m, d] = dateStr.split('-');
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }

  $: filteredTasks = tasks.filter(t => {
    if (!t.date || t.date === 'none') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = parseDate(t.date);
    const timeDiff = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    let timeMatch = false;
    if (timeFilter === 'overdue') {
      timeMatch = diffDays < 0;
    } else if (timeFilter === 'upcoming-3') {
      timeMatch = diffDays >= 0 && diffDays <= 3;
    } else if (timeFilter === 'upcoming-7') {
      timeMatch = diffDays >= 0 && diffDays <= 7;
    } else if (timeFilter === 'upcoming-14') {
      timeMatch = diffDays >= 0 && diffDays <= 14;
    }
    
    let statusMatch = false;
    if (statusFilter === 'all') statusMatch = true;
    else if (statusFilter === 'completed') statusMatch = t.completed;
    else if (statusFilter === 'uncompleted') statusMatch = !t.completed;
    
    return timeMatch && statusMatch;
  });

  function handleUpdate(event: CustomEvent) {
    dispatch('updateTask', event.detail);
  }

  function handleDelete(event: CustomEvent) {
    dispatch('deleteTask', event.detail);
  }
</script>

<div class="control-panel filter-panel">
  <div class="panel-header">
    <h3>Filtered Tasks</h3>
    <div class="filter-controls">
      <select bind:value={timeFilter} class="dropdown">
        <option value="overdue">Overdue</option>
        <option value="upcoming-3">Next 3 Days</option>
        <option value="upcoming-7">Next 7 Days</option>
        <option value="upcoming-14">Next 14 Days</option>
      </select>
      
      <select bind:value={statusFilter} class="dropdown">
        <option value="uncompleted">Uncompleted</option>
        <option value="completed">Completed</option>
        <option value="all">All</option>
      </select>
    </div>
  </div>
  
  <div class="task-list">
    {#if filteredTasks.length === 0}
      <p class="no-tasks-msg">No tasks match your filters.</p>
    {:else}
      {#each filteredTasks as task (task.id)}
        <TaskItem {task} on:update={handleUpdate} on:delete={handleDelete} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .control-panel {
    background: var(--background-primary);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--background-modifier-border);
    margin-top: 1rem;
  }
  .panel-header {
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--background-modifier-border);
    padding-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .panel-header h3 {
    margin: 0;
    color: var(--text-normal);
  }
  .filter-controls {
    display: flex;
    gap: 0.5rem;
  }
  .dropdown {
    background-color: var(--background-modifier-form-field);
    color: var(--text-normal);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    padding: 4px 24px 4px 8px; /* Extra padding on right for the arrow */
    font-size: 0.9em;
    appearance: none; /* Remove default browser arrow */
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23cccccc%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 10px auto;
    cursor: pointer;
  }
  .dropdown:hover {
    border-color: var(--text-muted);
  }
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
  }
  .no-tasks-msg {
    color: var(--text-muted);
    font-style: italic;
    text-align: center;
    padding: 1rem 0;
    margin: 0;
  }
</style>
