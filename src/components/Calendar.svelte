<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { Task } from '../store';

  export let tasks: Task[] = [];
  export let selectedDate: string | null = null;

  const dispatch = createEventDispatcher();

  let currentDate = new Date();
  let calendarEl: HTMLDivElement;
  
  $: currentYear = currentDate.getFullYear();
  $: currentMonth = currentDate.getMonth();

  onMount(() => {
    console.log('[Calendar] Component mounted successfully');
    console.log('[Calendar] calendarEl bound?', !!calendarEl);
    // 使用原生 DOM 事件測試點擊是否能到達元素
    if (calendarEl) {
      calendarEl.addEventListener('click', (e) => {
        console.log('[Calendar] Native DOM click detected on:', (e.target as HTMLElement).tagName, (e.target as HTMLElement).className);
      });
      // 檢查 computed style 中是否有 pointer-events: none
      const style = window.getComputedStyle(calendarEl);
      console.log('[Calendar] pointer-events:', style.pointerEvents);
      // 檢查所有父元素的 pointer-events
      let el: HTMLElement | null = calendarEl;
      while (el) {
        const s = window.getComputedStyle(el);
        if (s.pointerEvents === 'none') {
          console.warn('[Calendar] FOUND pointer-events:none on:', el.tagName, el.className);
        }
        el = el.parentElement;
      }
    }
    // document 層級的點擊測試
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.calendar-container') || target.closest('.todo-app-container')) {
        console.log('[Calendar] Document-level click in calendar area:', target.tagName, target.className);
      }
    });
  });

  function prevMonth() {
    console.log('[Calendar] prevMonth clicked');
    currentDate = new Date(currentYear, currentMonth - 1, 1);
  }

  function nextMonth() {
    console.log('[Calendar] nextMonth clicked');
    currentDate = new Date(currentYear, currentMonth + 1, 1);
  }

  function selectDate(dateStr: string) {
    console.log('[Calendar] selectDate clicked:', dateStr);
    dispatch('select', dateStr);
  }

  // Get calendar grid
  $: calendarDays = (() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay(); // 0 is Sunday
    const totalDays = lastDay.getDate();

    const days = [];
    
    // Previous month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false, dateStr: '' });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(i).padStart(2, '0');
      days.push({ 
        day: i, 
        isCurrentMonth: true, 
        dateStr: `${currentYear}-${monthStr}-${dayStr}` 
      });
    }

    // Next month padding to fill 6 rows (42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false, dateStr: '' });
    }

    return days;
  })();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  function getTaskStatusClass(dateStr: string) {
    if (!dateStr) return '';
    const dayTasks = tasks.filter(t => t.date === dateStr);
    if (dayTasks.length === 0) return '';
    
    const allCompleted = dayTasks.every(t => t.completed);
    return allCompleted ? 'status-completed' : 'status-pending';
  }
</script>

<div class="calendar-container" bind:this={calendarEl}>
  <div class="header">
    <button on:click={prevMonth}>&lt;</button>
    <h3>{monthNames[currentMonth]} {currentYear}</h3>
    <button on:click={nextMonth}>&gt;</button>
  </div>

  <div class="weekdays">
    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
  </div>

  <div class="days-grid">
    {#each calendarDays as {day, isCurrentMonth, dateStr}}
      <button 
        class="day-cell {isCurrentMonth ? 'current-month' : 'other-month'} {dateStr === selectedDate ? 'selected' : ''} {getTaskStatusClass(dateStr)}"
        on:click={() => isCurrentMonth && selectDate(dateStr)}
      >
        <span class="day-number">{day}</span>
        {#if getTaskStatusClass(dateStr)}
          <div class="indicator"></div>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .calendar-container {
    background: var(--background-secondary);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--background-modifier-border);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .header h3 {
    margin: 0;
  }
  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: var(--text-muted);
  }
  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  .day-cell {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    background: transparent;
    border: 1px solid transparent;
    padding: 0;
    color: var(--text-normal);
    font-size: 1em;
  }
  .day-cell.current-month:hover {
    background: var(--background-modifier-hover);
  }
  .day-cell.other-month {
    color: var(--text-faint);
    cursor: default;
  }
  .day-cell.selected {
    border: 2px solid var(--interactive-accent);
  }
  .indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-top: 4px;
  }
  .status-pending .indicator {
    background-color: var(--interactive-accent);
  }
  .status-completed .indicator {
    background-color: var(--text-success);
  }
</style>
