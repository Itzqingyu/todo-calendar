<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { App as ObsidianApp, TFile } from "obsidian";
  import { tasksStore, currentFileStore, selectedDateStore, type Task } from "../store";
  import { parseTodoFile, updateTaskLine, addTask, deleteTask } from "../parser";
  import Calendar from "./Calendar.svelte";
  import ControlPanel from "./ControlPanel.svelte";

  export let app: ObsidianApp;

  async function loadTasks() {
    try {
      const parsedTasks = await parseTodoFile(app, $currentFileStore);
      $tasksStore = parsedTasks;
    } catch (e) {
      console.error("Error loading tasks:", e);
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

  async function handleUpdateTask(event: CustomEvent<{task: Task, completed: boolean, date: string}>) {
    const { task, completed, date } = event.detail;
    const checkChar = completed ? "x" : " ";
    const newLine = `- [${checkChar}] ${task.text} @ ${date}`;
    
    try {
      await updateTaskLine(app, $currentFileStore, task.line, newLine);
    } catch (e) {
      console.error("Failed to update task", e);
    }
  }

  async function handleAddTask(event: CustomEvent<{text: string, date: string}>) {
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
  />
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
</style>
