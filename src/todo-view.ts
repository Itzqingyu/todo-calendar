import { ItemView, WorkspaceLeaf } from "obsidian";
import App from "./components/App.svelte";
import type TodoTimelinePlugin from "./main";

export const VIEW_TYPE_TODO = "todo-timeline-view";

export class TodoView extends ItemView {
  component!: App;
  plugin: TodoTimelinePlugin;

  constructor(leaf: WorkspaceLeaf, plugin: TodoTimelinePlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return VIEW_TYPE_TODO;
  }

  getDisplayText() {
    return "Todo Timeline";
  }

  getIcon(): string {
    return "calendar-with-checkmark";
  }

  async onOpen() {
    this.contentEl.empty();
    this.component = new App({
      target: this.contentEl,
      props: {
        app: this.app
      }
    });
  }

  async onClose() {
    this.component.$destroy();
  }
}
