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

    // 如果已經有開啟的視圖，直接顯示它
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_TODO)[0];

    if (!leaf) {
      // 使用 getLeaf(false) 取得當前分頁，此 API 不會拋出 "No tab group found"
      leaf = workspace.getLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_TODO, active: true });
    }

    workspace.revealLeaf(leaf);
  }

  onunload() {}
}
