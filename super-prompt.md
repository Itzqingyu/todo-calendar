# Role

你是一位專業的 Obsidian 插件開發工程師，精通 TypeScript、Svelte 框架以及 Obsidian API 開發。

# Objective

開發一個 Obsidian 插件，能讀取指定的 `to-do-list.md`，並將裡面的代辦事項以視覺化的時間線 (月曆) 介面呈現，方便使用者直觀地管理任務。

# References

none

# Constraints

- **前端技術選型**：使用 Svelte 框架來開發視覺化介面。
- **介面呈現方式**：建立自訂視圖 (Custom View / Item View)，作為一個獨立頁籤，支援釘選、拖曳與並排顯示。
- **代辦事項格式**：相容於 Obsidian Tasks 插件的格式，使用 `📅 YYYY-MM-DD` 標註 deadline。例如：`- [ ] 寫報告 📅 2026-07-09`。
- **資料同步機制**：必須實現雙向同步。在視覺管理介面上新增、修改、刪除或勾選代辦事項時，必須即時讀寫與更新原始的 `to-do-list.md` 檔案；若檔案被修改，介面也要能更新。

# Output

輸出完整的 Obsidian 插件專案原始碼，需包含但不限於：
- `main.ts`：插件主程式、註冊自訂視圖。
- `TodoView.ts`：繼承 `ItemView`，負責將 Svelte Component 掛載到 DOM。
- Svelte Components：實作視覺化時間線與代辦事項的操作介面。
- 處理 Markdown 讀寫及 Tasks 格式解析的核心邏輯。

# Verification

- **成功掛載**：插件能順利在 Obsidian 中啟用，並開啟視覺化頁籤。
- **正確解析**：能準確讀取並解析 `to-do-list.md` 內所有帶有 `📅 YYYY-MM-DD` 的代辦事項，並呈現在對應日期上。
- **雙向同步功能正常運作**：在 UI 上新增、刪除、勾選完成、修改日期的操作，都能正確無誤地更新回 `to-do-list.md` 對應行的字元。

# Workflow

1. **環境配置與框架整合**：建立 Obsidian 插件基礎結構，並整合 Svelte 開發環境。
2. **實作資料解析與寫入層**：撰寫讀寫 Obsidian 檔案的邏輯，利用正則表達式精準定位代辦事項，確保修改時不破壞其餘筆記內容。
3. **設計視覺化管理介面**：使用 Svelte 開發時間線 (或月曆) UI，實作任務拖曳、新增刪除等互動體驗。
4. **介面與資料層橋接**：將 Svelte 元件的狀態與 Obsidian 檔案讀寫 API 結合，達成所見即所得的雙向同步。
5. **最終測試與除錯**：針對各種格式邊界情況 (如檔案為空、日期格式錯誤等) 進行錯誤處理。
