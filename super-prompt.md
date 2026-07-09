# Role

你是一位專業的 Obsidian 插件開發工程師，精通 TypeScript、Svelte 框架以及 Obsidian API 開發。

# Objective

開發一個 Obsidian 插件，能讀取指定的 `to-do-list.md`，並將裡面的代辦事項以一個可視化的月曆 (以月為單位，可切換月份) 呈現，並附帶控制面板，讓使用者可以直觀地查看、新增與刪除任務。

# References

none

# Constraints

- **前端技術選型**：使用 Svelte 框架來開發視覺化介面。
- **介面呈現方式**：建立自訂視圖 (Custom View / Item View)，點擊後會在中央分頁開啟，顯示月曆與控制面板。
- **代辦事項格式**：使用 `@` 作為日期分隔，例如：`- [ ] 寫報告 @ 2026-07-09` 或 `- [x] 買東西 @ 2026-07-08`。
- **資料同步機制**：必須實現雙向同步。在月曆與控制面板上新增、修改、刪除或勾選代辦事項時，必須即時讀寫與更新原始的 `to-do-list.md` 檔案；若檔案被修改，介面也要能更新。
- **月曆標記與互動**：該日若有代辦事項需依照完成度用不同顏色標記。點擊特定日期會在控制面板顯示該日期的詳細代辦事項。
- **構建輸出**：編譯結果 (`main.js`, `manifest.json`) 需放在 `todo-timeline/` 目錄下。

# Output

輸出完整的 Obsidian 插件專案原始碼，需包含但不限於：
- `main.ts`：插件主程式、註冊自訂視圖並於中央分頁開啟。
- `TodoView.ts`：繼承 `ItemView`，負責掛載 Svelte。
- Svelte Components：
  - `App.svelte`: 主排版。
  - `Calendar.svelte`: 視覺化月曆。
  - `ControlPanel.svelte`: 點擊日期後展開的任務清單、新增、刪除面板。
- 處理 Markdown 讀寫及 `@` 格式解析、新增、刪除的核心邏輯 (`parser.ts`)。

# Verification

- **成功掛載**：插件能順利在 Obsidian 中啟用，並於中央分頁開啟。
- **正確解析**：能準確讀取並解析 `to-do-list.md` 內所有帶有 `@ YYYY-MM-DD` 的事項，正確顯示在月曆上，並區分完成度顏色。
- **雙向同步**：在 UI 上新增事項、刪除事項、勾選完成、修改日期的操作，都能正確無誤地同步回 `to-do-list.md`。

# Workflow

1. **環境配置與打包**：更新 `esbuild.config.mjs` 確保編譯並複製成品到 `todo-timeline/`。
2. **實作資料層 (`parser.ts` & `store.ts`)**：撰寫解析 `@` 日期格式的正則表達式，實作任務解析、新增、刪除、狀態更新的 Obsidian 檔案讀寫 API。
3. **設計月曆元件 (`Calendar.svelte`)**：實作月份切換邏輯、繪製日曆網格，與資料層綁定呈現對應顏色。
4. **設計控制面板 (`ControlPanel.svelte`)**：實作單日任務清單檢視，以及新增與刪除的 UI 互動。
5. **最終整合**：結合至 `App.svelte` 並在 Obsidian 測試所有邊界狀況。
