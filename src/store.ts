import { writable } from "svelte/store";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string | null; // YYYY-MM-DD
  line: number; // line index in the markdown file
  originalText: string;
}

export const tasksStore = writable<Task[]>([]);
export const currentFileStore = writable<string>("to-do-list.md");
