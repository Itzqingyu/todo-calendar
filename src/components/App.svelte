<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { App as ObsidianApp, TFile } from "obsidian";
  import { tasksStore, currentFileStore, selectedDateStore, type Task } from "../store";
  import { parseTodoFile, updateTaskLine, addTask, deleteTask } from "../parser";
  import Calendar from "./Calendar.svelte";
  import ControlPanel from "./ControlPanel.svelte";
  import FilterPanel from "./FilterPanel.svelte";
  import NoDeadlinePanel from "./NoDeadlinePanel.svelte";

  export let app: ObsidianApp;

  let fileExists = true;

  async function loadTasks() {
    try {
      const parsedTasks = await parseTodoFile(app, $currentFileStore);
      if (parsedTasks === null) {
        fileExists = false;
        $tasksStore = [];
      } else {
        fileExists = true;
        $tasksStore = parsedTasks;
      }
    } catch (e) {
      console.error("Error loading tasks:", e);
    }
  }

  async function createTodoFile() {
    try {
      await app.vault.create($currentFileStore, "");
      fileExists = true;
      loadTasks();
    } catch (e) {
      console.error("Failed to create file:", e);
    }
  }

  const onModify = (file: TFile) => {
    if (file.path === $currentFileStore) {
      loadTasks();
    }
  };

  let eventRef: any;

  onMount(() => {
    eventRef = app.vault.on("modify", onModify);
    loadTasks();
  });

  onDestroy(() => {
    if (eventRef) {
      app.vault.offref(eventRef);
    }
  });

  function handleSelectDate(event: CustomEvent<string>) {
    $selectedDateStore = event.detail;
  }

  async function handleUpdateTask(event: CustomEvent<{task: Task, completed: boolean, date: string | null}>) {
    const { task, completed, date } = event.detail;
    const checkChar = completed ? "x" : " ";
    const datePart = date ? date : "none";
    const newLine = `- [${checkChar}] ${task.text} @ ${datePart}`;
    
    try {
      await updateTaskLine(app, $currentFileStore, task.line, newLine);
    } catch (e) {
      console.error("Failed to update task", e);
    }
  }

  async function handleAddTask(event: CustomEvent<{text: string, date: string | null}>) {
    const { text, date } = event.detail;
    try {
      await addTask(app, $currentFileStore, text, date);
    } catch (e) {
      console.error("Failed to add task", e);
    }
  }

  async function handleDeleteTask(event: CustomEvent<{task: Task}>) {
    const { task } = event.detail;
    try {
      await deleteTask(app, $currentFileStore, task.line);
    } catch (e) {
      console.error("Failed to delete task", e);
    }
  }
</script>

<div class="todo-app-container">
  <h2>Todo Calendar</h2>
  
  {#if !fileExists}
    <div class="setup-notice">
      <h3>Welcome to Todo Timeline</h3>
      <p>We couldn't find the <strong>{$currentFileStore}</strong> file in your vault.</p>
      <p>Please create a file named <code>{$currentFileStore}</code> in the root of your vault to start using the calendar, or click the button below.</p>
      
      <div class="instructions">
        <h4>Task Formats:</h4>
        <code>- [ ] Task name @ YYYY-MM-DD</code><br/><br/>
        <code>- [ ] No deadline task @ none</code>
      </div>

      <button class="create-btn" on:click={createTodoFile}>Create {$currentFileStore} now</button>
    </div>
  {:else}
    <Calendar 
      tasks={$tasksStore} 
      selectedDate={$selectedDateStore} 
      on:select={handleSelectDate} 
    />

    <ControlPanel 
      tasks={$tasksStore} 
      selectedDate={$selectedDateStore} 
      on:updateTask={handleUpdateTask}
      on:addTask={handleAddTask}
      on:deleteTask={handleDeleteTask}
      on:close={() => $selectedDateStore = null}
    />

    <FilterPanel 
      tasks={$tasksStore} 
      on:updateTask={handleUpdateTask}
      on:deleteTask={handleDeleteTask}
    />

    <NoDeadlinePanel 
      tasks={$tasksStore} 
      on:updateTask={handleUpdateTask}
      on:addTask={handleAddTask}
      on:deleteTask={handleDeleteTask}
    />
  {/if}
</div>

<style>
  .todo-app-container {
    padding: 1rem;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    z-index: 0;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    flex-shrink: 0;
  }

  :global(.calendar-container) {
    flex-shrink: 0;
    position: relative;
    z-index: 10;
  }

  :global(.control-panel) {
    flex-shrink: 0;
    position: relative;
    z-index: 5;
  }

  .setup-notice {
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    margin-top: 2rem;
  }
  
  .setup-notice h3 {
    margin-top: 0;
  }
  
  .instructions {
    background: var(--background-primary);
    padding: 1rem;
    border-radius: 4px;
    margin: 1.5rem 0;
    text-align: left;
    border: 1px solid var(--background-modifier-border);
  }
  
  .instructions h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  .create-btn {
    background-color: var(--interactive-accent);
    color: var(--text-on-accent);
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 1rem;
  }
  
  .create-btn:hover {
    opacity: 0.9;
  }
</style>
