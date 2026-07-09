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

    // 強制關閉任何已經開啟的舊視圖（例如在側邊欄的）
    workspace.detachLeavesOfType(VIEW_TYPE_TODO);

    // 強制在中央區域建立一個新的分頁
    const leaf = workspace.getLeaf(true);
    await leaf.setViewState({ type: VIEW_TYPE_TODO, active: true });

    workspace.revealLeaf(leaf);
  }

  onunload() {}
}
