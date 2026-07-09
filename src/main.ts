import { Plugin, WorkspaceLeaf } from "obsidian";
import { TodoView, VIEW_TYPE_TODO } from "./todo-view";

export default class TodoTimelinePlugin extends Plugin {
  async onload() {
    this.registerView(
      VIEW_TYPE_TODO,
      (leaf: WorkspaceLeaf) => new TodoView(leaf, this)
    );

    this.addRibbonIcon("calendar-with-checkmark", "Open Todo Timeline", () => {
      this.activateView();
    });

    this.addCommand({
      id: "open-todo-timeline",
      name: "Open Todo Timeline View",
      callback: () => {
        this.activateView();
      },
    });
  }

  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_TODO);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(false);
      if(leaf) {
        await leaf.setViewState({ type: VIEW_TYPE_TODO, active: true });
      }
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    if(leaf) workspace.revealLeaf(leaf);
  }

  onunload() {}
}
