import { writable, derived } from 'svelte/store';

export type Language = 'en' | 'zh-TW';

export const currentLanguage = writable<Language>('en');

const translations = {
  en: {
    // App / ControlPanel
    no_tasks_for_day: "No tasks for this day.",
    add_new_task: "Add a new task...",
    delete_confirm: "Are you sure you want to delete this task?",
    delete_prompt: "Delete?",
    yes: "Yes",
    no: "No",
    tasks_for: "Tasks for",
    select_date: "Select a date on the calendar to view and manage tasks.",

    // FilterPanel
    filtered_tasks: "Filtered Tasks",
    filter_overdue: "Overdue",
    filter_upcoming_3: "Next 3 Days",
    filter_upcoming_7: "Next 7 Days",
    filter_upcoming_14: "Next 14 Days",
    filter_uncompleted: "Uncompleted",
    filter_completed: "Completed",
    filter_all: "All",
    no_tasks_match: "No tasks match your filters.",

    // NoDeadlinePanel
    no_deadline_tasks: "No Deadline Tasks",
    no_undated_tasks: "No undated tasks.",
    add_no_deadline_task: "Add a no-deadline task...",
    add_no_deadline_btn: "Add a task without specific deadline",
    add: "Add",

    // Calendar
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

    // App Empty State
    welcome: "Welcome to Todo Calendar",
    welcome_desc_1: "There is currently no markdown file bound to this plugin in this vault.",
    welcome_desc_2: "Click the button below to create todo-calendar.md in the root directory directly, or specify an existing markdown file.",
    task_formats: "Task Formats:",
    create_now: "Create todo-calendar.md now",
    select_existing_file: "Select existing file",

    // Settings
    settings_language_name: "Language",
    settings_language_desc: "Choose the display language for the Todo Calendar view.",
    settings_target_name: "Target File",
    settings_target_desc: "The markdown file to load and save tasks.",
    settings_change_btn: "Change",
  },
  'zh-TW': {
    // App / ControlPanel
    no_tasks_for_day: "這天沒有待辦事項。",
    add_new_task: "輸入待辦事項...",
    delete_confirm: "確定要刪除這筆事項嗎？",
    delete_prompt: "刪除？",
    yes: "是",
    no: "否",
    tasks_for: "待辦事項：",
    select_date: "在月曆上點選一個日期來檢視和管理待辦事項。",

    // FilterPanel
    filtered_tasks: "篩選事項",
    filter_overdue: "已過期",
    filter_upcoming_3: "未來 3 天",
    filter_upcoming_7: "未來 7 天",
    filter_upcoming_14: "未來 14 天",
    filter_uncompleted: "未完成",
    filter_completed: "已完成",
    filter_all: "全部",
    no_tasks_match: "沒有符合篩選條件的事項。",

    // NoDeadlinePanel
    no_deadline_tasks: "無期限事項",
    no_undated_tasks: "目前沒有無期限事項。",
    add_no_deadline_task: "輸入無期限事項...",
    add_no_deadline_btn: "新增沒有特定日期的事項",
    add: "新增",

    // Calendar
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],

    // App Empty State
    welcome: "歡迎使用 Todo Calendar",
    welcome_desc_1: "目前在此庫中沒有與此插件綁定的 markdown 檔案。",
    welcome_desc_2: "點擊下方按鈕直接在根目錄創建 todo-calendar.md，或指定一個現有 markdown 檔案。",
    task_formats: "代辦事項格式：",
    create_now: "立即建立 todo-calendar.md",
    select_existing_file: "選擇現有檔案",

    // Settings
    settings_language_name: "語言",
    settings_language_desc: "選擇 Todo Calendar 面板的顯示語言。",
    settings_target_name: "目標檔案",
    settings_target_desc: "用來讀取與儲存待辦事項的 Markdown 檔案。",
    settings_change_btn: "變更",
  }
};

export const t = derived(currentLanguage, ($lang) => translations[$lang]);
