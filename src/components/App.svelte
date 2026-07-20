<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import type { App as ObsidianApp, TFile, TAbstractFile } from "obsidian";
  import { tasksStore, currentFileStore, selectedDateStore } from "../store";
  import type { Task } from "../store";
  import {
    parseTodoFile,
    updateTaskLine,
    addTask,
    deleteTask,
  } from "../parser";
  import Calendar from "./Calendar.svelte";
  import ControlPanel from "./ControlPanel.svelte";
  import FilterPanel from "./FilterPanel.svelte";
  import NoDeadlinePanel from "./NoDeadlinePanel.svelte";
  import { t } from "../i18n";
  import { FileSuggestModal } from "../FileSuggestModal";

  export let app: ObsidianApp;
  export let plugin: any;

  let fileExists = true;

  $: {
    const _ = $currentFileStore;
    loadTasks();
  }

  async function loadTasks() {
    try {
      const parsedTasks = await parseTodoFile(app, $currentFileStore);
      if (parsedTasks === null) {
        fileExists = false;
        $tasksStore = [];

        // Reset to default if the custom file is missing
        if ($currentFileStore !== "todo-calendar.md") {
          $currentFileStore = "todo-calendar.md";
          if (plugin && plugin.settings) {
            plugin.settings.targetFile = "todo-calendar.md";
            plugin.saveSettings();
          }
        }
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
      await app.vault.create("todo-calendar.md", "");
      $currentFileStore = "todo-calendar.md";
      if (plugin && plugin.settings) {
        plugin.settings.targetFile = "todo-calendar.md";
        await plugin.saveSettings();
      }
      fileExists = true;
    } catch (e) {
      console.error("Failed to create file:", e);
    }
  }

  const onModify = (file: TAbstractFile) => {
    if (file.path === $currentFileStore) {
      loadTasks();
    }
  };

  function handleSelectExistingFile() {
    new FileSuggestModal(app, async (file) => {
      $currentFileStore = file.path;
      plugin.settings.targetFile = file.path;
      await plugin.saveSettings();
    }).open();
  }

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
    if ($selectedDateStore === event.detail) {
      $selectedDateStore = null;
    } else {
      $selectedDateStore = event.detail;
    }
  }

  async function handleUpdateTask(
    event: CustomEvent<{ task: Task; completed: boolean; date: string | null }>,
  ) {
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

  async function handleAddTask(
    event: CustomEvent<{ text: string; date: string | null }>,
  ) {
    const { text, date } = event.detail;
    try {
      await addTask(app, $currentFileStore, text, date);
    } catch (e) {
      console.error("Failed to add task", e);
    }
  }

  async function handleDeleteTask(event: CustomEvent<{ task: Task }>) {
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
      <h3>{$t.welcome}</h3>
      <p>{$t.welcome_desc_1}</p>
      <p>{$t.welcome_desc_2}</p>

      <div class="instructions">
        <h4>{$t.task_formats}</h4>
        <code>- [ ] Task name @ YYYY-MM-DD</code><br /><br />
        <code>- [ ] No deadline task @ none</code>
      </div>

      <div
        class="actions-row"
        style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem;"
      >
        <button
          class="create-btn"
          style="margin-top: 0;"
          on:click={createTodoFile}>{$t.create_now}</button
        >
        <button
          class="create-btn select-btn"
          style="margin-top: 0; background-color: var(--background-modifier-form-field); color: var(--text-normal); border: 1px solid var(--background-modifier-border);"
          on:click={handleSelectExistingFile}>{$t.select_existing_file}</button
        >
      </div>
    </div>
  {:else}
    <div class="calendar-and-control-group">
      <Calendar
        tasks={$tasksStore}
        selectedDate={$selectedDateStore}
        on:select={handleSelectDate}
      />

      <div class="divider"></div>

      <ControlPanel
        tasks={$tasksStore}
        selectedDate={$selectedDateStore}
        on:updateTask={handleUpdateTask}
        on:addTask={handleAddTask}
        on:deleteTask={handleDeleteTask}
        on:close={() => ($selectedDateStore = null)}
      />
    </div>

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

  .calendar-and-control-group {
    background: var(--background-primary);
    border-radius: 8px;
    border: 1px solid var(--background-modifier-border);
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .divider {
    height: 1px;
    background-color: var(--background-modifier-border);
    margin: 0 -1rem; /* Extend to edge to ignore padding */
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
