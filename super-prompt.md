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
- **Svelte CSS Scoping**：充分利用 Svelte 的作用域樣式 (Scoped CSS) 機制。請避免創建全域的 `styles.css`，因為將樣式直接寫在 Svelte 組件中可以自動獲得雜湊後綴 (如 `.class-name.svelte-xyz`)，這能有效提高 CSS 權重，防止樣式被 Obsidian 的全域樣式覆蓋或污染。
- **避免 Obsidian 保留字**：在命名 CSS Class 時，切勿使用 Obsidian 原生的保留字 (例如 `.empty-state`、`.button` 等通用名稱)。這些名稱在 Obsidian 的全域樣式中常帶有絕對定位或特定的 `pointer-events`，會導致 Svelte 渲染的 UI 出現不可預期的排版崩壞或點擊失效。
- **Z-Index 與重疊管理**：若使用 Flexbox 或絕對定位，請務必處理好各個面板的 `z-index` 與 `flex-shrink` 屬性。當發生「明明看的到按鈕卻無法點擊」的情況，第一步請先檢查是否被透明的其他 Svelte 組件 (如沒有設定高度限制的控制面板) 覆蓋。
- **分頁開啟防呆 (No tab group found)**：在 `ItemView` 或 `Plugin` 的 `activateView()` 中開啟視圖時，請優先使用 `workspace.getLeaf(false)` 或先檢查現有 `getLeavesOfType`，避免強行 detach 後使用 `getLeaf(true)` 或 `getLeaf("tab")` 導致 Obsidian 拋出 "No tab group found" 錯誤。
- **容器清空**：在 `ItemView.onOpen()` 中掛載 Svelte 應用程式前，務必先呼叫 `this.contentEl.empty()`，避免 Obsidian 預設產生的 DOM 元素殘留並遮蔽 Svelte 渲染的互動介面。

# Workflow

1. **環境配置與打包**：更新 `esbuild.config.mjs` 確保編譯並複製成品到 `todo-timeline/`。
2. **實作資料層 (`parser.ts` & `store.ts`)**：撰寫解析 `@` 日期格式的正則表達式，實作任務解析、新增、刪除、狀態更新的 Obsidian 檔案讀寫 API。
3. **設計月曆元件 (`Calendar.svelte`)**：實作月份切換邏輯、繪製日曆網格，與資料層綁定呈現對應顏色。
4. **設計控制面板 (`ControlPanel.svelte`)**：實作單日任務清單檢視，以及新增與刪除的 UI 互動。
5. **最終整合**：結合至 `App.svelte` 並在 Obsidian 測試所有邊界狀況。
