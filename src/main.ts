import { Plugin, WorkspaceLeaf, PluginSettingTab, App, Setting } from "obsidian";
import { TodoView, VIEW_TYPE_TODO } from "./todo-view";
import { currentLanguage, t, type Language } from "./i18n";
import { get } from "svelte/store";
import { currentFileStore } from "./store";
import { FileSuggestModal } from "./FileSuggestModal";

interface TodoCalendarSettings {
  language: Language;
  targetFile: string;
  openInRightSidebar: boolean;
}

const DEFAULT_SETTINGS: TodoCalendarSettings = {
  language: "en",
  targetFile: "todo-calendar.md",
  openInRightSidebar: false,
};

export default class TodoCalendarPlugin extends Plugin {
  declare settings: TodoCalendarSettings;

  async onload() {
    await this.loadSettings();
    currentLanguage.set(this.settings.language);
    currentFileStore.set(this.settings.targetFile);

    this.registerView(
      VIEW_TYPE_TODO,
      (leaf: WorkspaceLeaf) => new TodoView(leaf, this)
    );

    this.addRibbonIcon("calendar-with-checkmark", "Open Todo Calendar", () => {
      this.activateView();
    });

    this.addCommand({
      id: "open-todo-calendar",
      name: "Open Todo Calendar View",
      callback: () => {
        this.activateView();
      },
    });

    this.addSettingTab(new TodoCalendarSettingTab(this.app, this));
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
      if (this.settings.openInRightSidebar) {
        leaf = workspace.getRightLeaf(false) || workspace.getLeaf(false);
      } else {
        leaf = workspace.getLeaf(false);
      }
      await leaf.setViewState({ type: VIEW_TYPE_TODO, active: true });
    }

    workspace.revealLeaf(leaf);
  }

  onunload() {}
}

class TodoCalendarSettingTab extends PluginSettingTab {
  plugin: TodoCalendarPlugin;

  constructor(app: App, plugin: TodoCalendarPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    const $t = get(t);
    containerEl.empty();

    new Setting(containerEl)
      .setName($t.settings_language_name)
      .setDesc($t.settings_language_desc)
      .addDropdown((dropdown) => {
        dropdown
          .addOption("en", "English")
          .addOption("zh-TW", "繁體中文")
          .setValue(this.plugin.settings.language)
          .onChange(async (value) => {
            this.plugin.settings.language = value as Language;
            await this.plugin.saveSettings();
            this.display();
          });
      });

    new Setting(containerEl)
      .setName($t.settings_target_name)
      .setDesc($t.settings_target_desc)
      .addText((text) => {
        text.setValue(this.plugin.settings.targetFile).setDisabled(true);
      })
      .addButton((button) => {
        button.setButtonText($t.settings_change_btn).onClick(() => {
          new FileSuggestModal(this.plugin.app, async (file) => {
            this.plugin.settings.targetFile = file.path;
            await this.plugin.saveSettings();
            currentFileStore.set(file.path);
            this.display();
          }).open();
        });
      });

    new Setting(containerEl)
      .setName($t.settings_open_sidebar_name)
      .setDesc($t.settings_open_sidebar_desc)
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.openInRightSidebar)
          .onChange(async (value) => {
            this.plugin.settings.openInRightSidebar = value;
            await this.plugin.saveSettings();
          });
      });
  }
}
