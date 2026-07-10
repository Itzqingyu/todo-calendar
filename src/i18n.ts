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
    file_not_found: "We couldn't find the",
    file_not_found_2: "file in your vault.",
    please_create: "Please create a file named",
    please_create_2: "in the root of your vault to start using Todo Calendar, or click the button below.",
    task_formats: "Task Formats:",
    create_now: "Create",
    create_now_2: "now",
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
    file_not_found: "目前在此庫中沒有",
    file_not_found_2: "檔案。",
    please_create: "請在根目錄建立名為",
    please_create_2: "的檔案以開始使用 Todo Calendar，或直接點擊下方按鈕。",
    task_formats: "代辦事項格式：",
    create_now: "立即建立",
    create_now_2: "",
  }
};

export const t = derived(currentLanguage, ($lang) => translations[$lang]);
