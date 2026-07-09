import { App, TFile } from "obsidian";
import { Task } from "./store";

// RegExp to match: - [ ] text @ YYYY-MM-DD
// Group 1: checkbox (space or x)
// Group 2: task text before the date
// Group 3: the date YYYY-MM-DD
const TASK_REGEX = /^- \[( |x|X)\] (.*?) @ (\d{4}-\d{2}-\d{2})/;

export async function parseTodoFile(app: App, filePath: string): Promise<Task[] | null> {
  const file = app.vault.getAbstractFileByPath(filePath);
  if (!(file instanceof TFile)) {
    return null;
  }

  const content = await app.vault.read(file);
  const lines = content.split("\n");
  const tasks: Task[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(TASK_REGEX);
    if (match) {
      tasks.push({
        id: `task-${i}`,
        completed: match[1].toLowerCase() === "x",
        text: match[2].trim(),
        date: match[3],
        line: i,
        originalText: line,
      });
    }
  }

  return tasks;
}

export async function updateTaskLine(app: App, filePath: string, lineIndex: number, newText: string): Promise<void> {
  const file = app.vault.getAbstractFileByPath(filePath);
  if (!(file instanceof TFile)) {
    throw new Error(`File ${filePath} not found`);
  }

  const content = await app.vault.read(file);
  const lines = content.split("\n");
  
  if (lineIndex >= 0 && lineIndex < lines.length) {
    lines[lineIndex] = newText;
    await app.vault.modify(file, lines.join("\n"));
  }
}

export async function addTask(app: App, filePath: string, text: string, date: string): Promise<void> {
  const file = app.vault.getAbstractFileByPath(filePath);
  if (!(file instanceof TFile)) {
    throw new Error(`File ${filePath} not found`);
  }

  const content = await app.vault.read(file);
  // Ensure the file ends with a newline if it's not empty
  let newContent = content;
  if (newContent.length > 0 && !newContent.endsWith("\n")) {
    newContent += "\n";
  }
  
  const newLine = `- [ ] ${text} @ ${date}`;
  newContent += newLine + "\n";
  
  await app.vault.modify(file, newContent);
}

export async function deleteTask(app: App, filePath: string, lineIndex: number): Promise<void> {
  const file = app.vault.getAbstractFileByPath(filePath);
  if (!(file instanceof TFile)) {
    throw new Error(`File ${filePath} not found`);
  }

  const content = await app.vault.read(file);
  const lines = content.split("\n");
  
  if (lineIndex >= 0 && lineIndex < lines.length) {
    lines.splice(lineIndex, 1);
    await app.vault.modify(file, lines.join("\n"));
  }
}
