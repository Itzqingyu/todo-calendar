<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { App as ObsidianApp, TFile } from "obsidian";
  import { tasksStore, currentFileStore, type Task } from "../store";
  import { parseTodoFile, updateTaskLine } from "../parser";
  import TaskItem from "./TaskItem.svelte";

  export let app: ObsidianApp;

  let tasks: Task[] = [];
  let fileToRead = "to-do-list.md";
  
  const unsubscribeTasks = tasksStore.subscribe(value => {
    tasks = value;
  });

  const unsubscribeFile = currentFileStore.subscribe(value => {
    fileToRead = value;
    loadTasks();
  });

  async function loadTasks() {
    try {
      const parsedTasks = await parseTodoFile(app, fileToRead);
      tasksStore.set(parsedTasks);
    } catch (e) {
      console.error("Error loading tasks:", e);
    }
  }

  // Listen to file modifications in Obsidian to auto-reload
  const onModify = (file: TFile) => {
    if (file.path === fileToRead) {
      loadTasks();
    }
  };

  onMount(() => {
    app.vault.on("modify", onModify);
    loadTasks();
  });

  onDestroy(() => {
    unsubscribeTasks();
    unsubscribeFile();
    app.vault.off("modify", onModify);
  });

  async function handleUpdateTask(event: CustomEvent<{task: Task, completed: boolean, date: string}>) {
    const { task, completed, date } = event.detail;
    
    // Construct new line
    const checkChar = completed ? "x" : " ";
    const newLine = `- [${checkChar}] ${task.text} 📅 ${date}`;
    
    // Optimistic update in UI
    const updatedTasks = tasks.map(t => {
      if(t.id === task.id) {
        return { ...t, completed, date, originalText: newLine };
      }
      return t;
    });
    tasksStore.set(updatedTasks);

    // Update in file
    try {
      await updateTaskLine(app, fileToRead, task.line, newLine);
    } catch (e) {
      console.error("Failed to update task", e);
      // Reload on failure
      loadTasks();
    }
  }

  // Group tasks by date
  $: groupedTasks = tasks.reduce((acc, task) => {
    if(task.date) {
      if(!acc[task.date]) acc[task.date] = [];
      acc[task.date].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);
  
  $: sortedDates = Object.keys(groupedTasks).sort();
</script>

<div class="todo-timeline-container">
  <h2>Todo Timeline</h2>
  
  {#if sortedDates.length === 0}
    <p class="empty-state">No tasks found with dates in {fileToRead}.</p>
  {:else}
    <div class="timeline">
      {#each sortedDates as date}
        <div class="date-group">
          <h3 class="date-header">{date}</h3>
          <div class="task-list">
            {#each groupedTasks[date] as task (task.id)}
              <TaskItem {task} on:update={handleUpdateTask} />
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .todo-timeline-container {
    padding: 1rem;
    height: 100%;
    overflow-y: auto;
  }
  
  .timeline {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .date-group {
    background-color: var(--background-secondary);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--background-modifier-border);
  }
  
  .date-header {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--text-accent);
    font-size: 1.1em;
  }
  
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .empty-state {
    color: var(--text-muted);
    font-style: italic;
  }
</style>
