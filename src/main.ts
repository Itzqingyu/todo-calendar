import { Plugin, WorkspaceLeaf, PluginSettingTab, App, Setting } from "obsidian";
import { TodoView, VIEW_TYPE_TODO } from "./todo-view";
import { currentLanguage, type Language } from "./i18n";

interface TodoTimelineSettings {
  language: Language;
}

const DEFAULT_SETTINGS: TodoTimelineSettings = {
  language: "en",
};

export default class TodoTimelinePlugin extends Plugin {
  settings: TodoTimelineSettings;

  async onload() {
    await this.loadSettings();
    currentLanguage.set(this.settings.language);

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

    this.addSettingTab(new TodoTimelineSettingTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    currentLanguage.set(this.settings.language);
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

class TodoTimelineSettingTab extends PluginSettingTab {
  plugin: TodoTimelinePlugin;

  constructor(app: App, plugin: TodoTimelinePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Language / 語言")
      .setDesc("Choose the display language for the Todo Timeline view.")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("en", "English")
          .addOption("zh-TW", "繁體中文")
          .setValue(this.plugin.settings.language)
          .onChange(async (value) => {
            this.plugin.settings.language = value as Language;
            await this.plugin.saveSettings();
          });
      });
  }
}
