/**
 * options.js - منطق صفحهٔ کامل مدیریت یادداشت‌های ClipNote
 */

(function () {
  const {
    STORAGE_KEYS,
    DEFAULT_SETTINGS,
    DEFAULT_CATEGORIES,
    DEFAULT_WORKSPACES,
    DEFAULT_WORKSPACE_ID,
    NOTE_COLORS,
    getNotes,
    saveNotes,
    getSettings,
    saveSettings,
    getCategories,
    saveCategories,
    getWorkspaces,
    saveWorkspaces,
    getCustomTags,
    saveCustomTags,
    getUpdateInfo,
    checkForUpdates,
    GITHUB_REPO_URL,
    createWorkspace,
    createNote,
    filterNotes,
    parseMarkdown,
    applyTheme,
    showToast,
    copyToClipboard,
    readFromClipboard,
    exportToJson,
    exportToTxt,
    importFromJson,
    normalizeTag,
    normalizeTags,
    getTagCatalog,
    getQuickTagList,
    getTimelineGroups,
    suggestTags,
    mergeCustomTags,
    isNoteLocked,
    createNoteLock,
    createRecoveryData,
    hasRecoveryQuestion,
    verifyNoteSecret,
    verifyRecoveryAnswer,
    getNoteWorkspace,
    truncateText,
    migrateStorageData
  } = window.ClipNote;

  const I18N = {
    en: {
      allNotes: 'All Notes',
      listSubtitle: 'Manage your clipboard notes',
      searchSidebar: 'Search (Ctrl+F)',
      searchList: 'Search title, content, tags, categories...',
      workspaces: 'Workspaces',
      categories: 'Categories',
      tags: 'Tags',
      addWorkspace: 'Add Workspace',
      addCategory: 'Add Category',
      newNote: 'New Note',
      settings: 'Settings',
      import: 'Import',
      export: 'Export',
      noNotes: 'No notes found',
      noNotesSub: 'Press Ctrl+N to create a new note',
      lastUpdated: 'Last Updated',
      createdDate: 'Created Date',
      titleAsc: 'Title A-Z',
      titleDesc: 'Title Z-A',
      overviewView: 'Overview',
      titlePlaceholder: 'Note Title',
      contentPlaceholder: 'Write your note here... Supports Markdown.',
      workspace: 'Workspace',
      category: 'Category',
      noCategory: 'No Category',
      tagsLabel: 'Tags',
      tagsPlaceholder: 'python, api, md',
      addTag: 'Add Tag',
      color: 'Color',
      pin: '📌 Pin',
      favorite: '⭐ Favorite',
      quickTags: 'Quick Tags',
      quickTagsSub: 'Default + custom tags',
      smartSuggestions: 'Smart Suggestions',
      acceptAll: 'Accept All',
      edit: 'Edit',
      protection: 'Protection',
      lock: 'Lock',
      changeLock: 'Change Password / PIN',
      removeLock: 'Remove Lock',
      relock: 'Re-Lock Session',
      recoveryToggle: 'Set Recovery Question',
      recoveryQuestion: 'Question',
      recoveryAnswer: 'Answer',
      recoveryQuestionPlaceholder: 'What is your favorite food?',
      recoveryAnswerPlaceholder: 'Hamburger',
      saveRecovery: 'Save Recovery',
      clearRecovery: 'Clear Recovery',
      recoverPassword: 'Recover Password',
      recoveryUnavailable: 'No recovery question is set for this note.',
      recoverySaved: 'Recovery question saved.',
      recoveryCleared: 'Recovery question removed.',
      recoverySuccess: 'Recovery successful. You can now open the note.',
      recoveryFailed: 'Recovery answer is incorrect.',
      splitView: 'Split View',
      editorOnly: 'Editor Only',
      previewOnly: 'Preview Only',
      paste: 'Paste',
      preview: 'Preview',
      settingsTitle: 'Settings',
      settingsSub: 'Customize ClipNote',
      back: 'Back',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      theme: 'Theme',
      fontSize: 'Font Size',
      animations: 'Animations',
      editor: 'Editor',
      autoSave: 'Auto Save',
      defaultColor: 'Default Color for New Notes',
      defaultColorSub: 'New notes will use this color by default.',
      defaultColorAboutTitle: 'About this tab',
      defaultColorAboutText: 'This sets the color automatically when a new note is created in the manager or popup.',
      language: 'Language',
      languageSelect: 'Interface Language',
      languageHelp: 'Texts and labels will switch to the selected language. Persian uses Vazirmatn and RTL layout.',
      updates: 'Check for Updates',
      updatesHelp: 'Open the GitHub page to download the newest version manually.',
      updatesButton: 'Check for Updates',
      updatesChecking: 'Checking latest version...',
      updatesAvailable: 'New Version Available',
      updatesCurrent: 'You already have the latest version.',
      updatesUnknown: 'Unable to verify the latest version right now.',
      updatesPrivacy: 'Only a public version check is sent to GitHub. No notes or private user data are uploaded.',
      updatesTip: 'It is recommended to click for updates every 10 days to stay up to date. Thank you ❤️',
      newBadge: 'New',
      data: 'Data',
      dataHelp: 'All data stays local on your device. No cloud, no server.',
      about: 'About',
      aboutDesc: 'A fast, secure, and professional local notebook for Chrome.',
      totalNotes: 'Total Notes',
      exportJson: 'Export JSON',
      exportTxt: 'Export TXT',
      importJson: 'Import JSON',
      clearAllData: 'Clear All Data',
      addWorkspaceTitle: 'Add Workspace',
      renameWorkspaceTitle: 'Rename Workspace',
      workspacePlaceholder: 'Workspace name',
      addCategoryTitle: 'Add Category',
      editCategoryTitle: 'Edit Category',
      categoryPlaceholder: 'Category name',
      deleteTitle: 'Delete Note?',
      deleteText: 'This action cannot be undone.',
      cancel: 'Cancel',
      save: 'Save',
      saveLock: 'Save Lock',
      delete: 'Delete',
      undo: 'Undo',
      copy: 'Copy',
      unlockAction: 'Unlock',
      unlockNote: 'Unlock Note',
      unlockWithPassword: 'Enter the password or PIN to view this note.',
      passwordOrPin: 'Password or PIN',
      lockNote: 'Lock Note',
      lockType: 'Protection Type',
      password: 'Password',
      pin4: '4-digit PIN',
      secretLabel: 'Password / PIN',
      confirmLabel: 'Confirm',
      secretPlaceholder: 'Enter password or 4-digit PIN',
      confirmPlaceholder: 'Repeat password or PIN',
      sourceNone: 'No external source metadata for this note.',
      source: 'Source',
      captured: 'Captured',
      unlockFirst: 'Unlock note first',
      invalidSecret: 'Invalid password or PIN',
      noteUnlocked: 'Note unlocked',
      lockRemoved: 'Lock removed',
      noteLocked: 'Note locked successfully',
      lockChanged: 'Lock changed successfully',
      noteRelocked: 'Note locked again',
      workspaceRequired: 'Workspace name is required',
      workspaceExists: 'Workspace already exists',
      workspaceAdded: 'Workspace added',
      workspaceUpdated: 'Workspace updated',
      workspaceDeleted: 'Workspace deleted',
      workspaceDeleteConfirm: 'Delete workspace "{name}"? Notes will be moved to "{fallback}".',
      atLeastOneWorkspace: 'At least one workspace is required',
      categoryRequired: 'Category name is required',
      categoryExists: 'Category already exists',
      categoryAdded: 'Category added',
      categoryUpdated: 'Category updated',
      categoryDeleted: 'Category deleted',
      categoryDeleteConfirm: 'Delete category "{name}"? Notes will become uncategorized.',
      customTagAdded: 'Custom tag added',
      enterTagName: 'Enter new tag name',
      suggestionsEmpty: 'No tag suggestions for this note yet.',
      noTagsYet: 'No tags yet.',
      settingsSaved: 'Settings saved',
      saveSuccess: 'Saved successfully',
      nothingToSave: 'Nothing to save',
      newNoteCreated: 'New note created',
      noteDeleted: 'Deleted successfully',
      noteDuplicated: 'Note duplicated',
      noteNotFound: 'Note not found',
      changesUnsaved: 'Unsaved changes',
      autosaved: 'Auto-saved',
      saved: 'Saved',
      clearConfirm: 'Are you sure? This will delete ALL notes, categories, workspaces, tags, and settings. This cannot be undone.',
      dataCleared: 'All data cleared',
      addTitleOrContent: 'Please enter a title or content',
      confirmRemoveLock: 'Remove protection from this note?',
      deleteConfirm: 'Delete this note?',
      untitled: 'Untitled Note',
      general: 'General',
      notes: 'notes',
      note: 'note',
      chars: 'chars',
      created: 'Created',
      updated: 'Updated',
      locked: 'Locked',
      unlocked: 'Unlocked',
      notLocked: 'This note is not locked.',
      protectedByPassword: 'Protected with password.',
      protectedByPin: 'Protected with 4-digit PIN.',
      previewHidden: '🔒 Preview hidden until unlocked',
      savedFromWeb: 'Saved from webpage',
      allScopes: 'All Notes',
      themeBlue: 'Blue',
      themeGreen: 'Green',
      themePurple: 'Purple',
      themeOrange: 'Orange',
      themeDarkPro: 'Dark Pro'
    },
    fa: {
      allNotes: 'همه یادداشت‌ها',
      listSubtitle: 'مدیریت یادداشت‌های محلی شما',
      searchSidebar: 'جستجو (Ctrl+F)',
      searchList: 'جستجو در عنوان، متن، برچسب و دسته‌بندی...',
      workspaces: 'فضاهای کاری',
      categories: 'دسته‌بندی‌ها',
      tags: 'برچسب‌ها',
      addWorkspace: 'افزودن فضای کاری',
      addCategory: 'افزودن دسته‌بندی',
      newNote: 'یادداشت جدید',
      settings: 'تنظیمات',
      import: 'ورود',
      export: 'خروجی',
      noNotes: 'یادداشتی پیدا نشد',
      noNotesSub: 'برای ساخت یادداشت جدید Ctrl+N را بزنید',
      lastUpdated: 'آخرین ویرایش',
      createdDate: 'تاریخ ایجاد',
      titleAsc: 'عنوان از الف تا ی',
      titleDesc: 'عنوان از ی تا الف',
      overviewView: 'نمای کلی',
      titlePlaceholder: 'عنوان یادداشت',
      contentPlaceholder: 'یادداشت خود را اینجا بنویسید... پشتیبانی از Markdown فعال است.',
      workspace: 'فضای کاری',
      category: 'دسته‌بندی',
      noCategory: 'بدون دسته‌بندی',
      tagsLabel: 'برچسب‌ها',
      tagsPlaceholder: 'python, api, md',
      addTag: 'افزودن برچسب',
      color: 'رنگ',
      pin: '📌 پین',
      favorite: '⭐ علاقه‌مندی',
      quickTags: 'برچسب‌های سریع',
      quickTagsSub: 'پیش‌فرض + سفارشی',
      smartSuggestions: 'پیشنهاد هوشمند',
      acceptAll: 'افزودن همه',
      edit: 'ویرایش',
      protection: 'محافظت',
      lock: 'قفل',
      changeLock: 'تغییر رمز / پین',
      removeLock: 'حذف قفل',
      relock: 'قفل دوباره',
      recoveryToggle: 'تنظیم سوال بازیابی',
      recoveryQuestion: 'سوال',
      recoveryAnswer: 'جواب',
      recoveryQuestionPlaceholder: 'نام غذای مورد علاقه شما چیست؟',
      recoveryAnswerPlaceholder: 'همبرگر',
      saveRecovery: 'ذخیره بازیابی',
      clearRecovery: 'حذف بازیابی',
      recoverPassword: 'بازیابی رمز',
      recoveryUnavailable: 'برای این یادداشت سوال بازیابی ثبت نشده است.',
      recoverySaved: 'سوال بازیابی ذخیره شد.',
      recoveryCleared: 'سوال بازیابی حذف شد.',
      recoverySuccess: 'بازیابی با موفقیت انجام شد. اکنون می‌توانید یادداشت را باز کنید.',
      recoveryFailed: 'پاسخ سوال بازیابی نادرست است.',
      splitView: 'نمای دو ستونه',
      editorOnly: 'فقط ادیتور',
      previewOnly: 'فقط پیش‌نمایش',
      paste: 'چسباندن',
      preview: 'پیش‌نمایش',
      settingsTitle: 'تنظیمات',
      settingsSub: 'شخصی‌سازی ClipNote',
      back: 'بازگشت',
      appearance: 'ظاهر',
      darkMode: 'حالت تیره',
      theme: 'تم',
      fontSize: 'اندازه فونت',
      animations: 'انیمیشن‌ها',
      editor: 'ویرایشگر',
      autoSave: 'ذخیره خودکار',
      defaultColor: 'رنگ پیش‌فرض یادداشت جدید',
      defaultColorSub: 'یادداشت‌های جدید با این رنگ ساخته می‌شوند.',
      defaultColorAboutTitle: 'درباره این بخش',
      defaultColorAboutText: 'این تنظیم مشخص می‌کند هر یادداشت جدیدی که در مدیر یا پاپ‌اپ ساخته می‌شود با چه رنگی شروع شود.',
      language: 'زبان',
      languageSelect: 'زبان رابط کاربری',
      languageHelp: 'متن‌ها و برچسب‌ها به زبان انتخابی نمایش داده می‌شوند. برای فارسی فونت وزیرمتن و چیدمان راست‌چین فعال می‌شود.',
      updates: 'بررسی بروزرسانی جدید',
      updatesHelp: 'با کلیک روی این دکمه، صفحهٔ GitHub پروژه برای دریافت جدیدترین نسخه باز می‌شود.',
      updatesButton: 'بررسی بروزرسانی جدید',
      updatesChecking: 'در حال بررسی آخرین نسخه...',
      updatesAvailable: 'نسخه جدید موجود است',
      updatesCurrent: 'هم‌اکنون جدیدترین نسخه را دارید.',
      updatesUnknown: 'فعلاً امکان بررسی نسخه جدید وجود ندارد.',
      updatesPrivacy: 'فقط یک درخواست عمومی برای بررسی نسخه به GitHub ارسال می‌شود و هیچ یادداشت یا دادهٔ خصوصی کاربر ارسال نمی‌شود.',
      updatesTip: 'توصیه می‌شود هر ۱۰ روز یک بار برای دریافت به‌روزرسانی‌های جدید، روی دکمه به‌روزرسانی کلیک کنید. با تشکر ❤️',
      newBadge: 'جدید',
      data: 'داده‌ها',
      dataHelp: 'همه داده‌ها فقط روی دستگاه شما ذخیره می‌شوند. بدون سرور و بدون فضای ابری.',
      about: 'درباره',
      aboutDesc: 'یک دفترچه یادداشت محلی، سریع، امن و حرفه‌ای برای Chrome.',
      totalNotes: 'تعداد کل یادداشت‌ها',
      exportJson: 'خروجی JSON',
      exportTxt: 'خروجی TXT',
      importJson: 'ورود JSON',
      clearAllData: 'پاک‌کردن همه داده‌ها',
      addWorkspaceTitle: 'افزودن فضای کاری',
      renameWorkspaceTitle: 'تغییر نام فضای کاری',
      workspacePlaceholder: 'نام فضای کاری',
      addCategoryTitle: 'افزودن دسته‌بندی',
      editCategoryTitle: 'ویرایش دسته‌بندی',
      categoryPlaceholder: 'نام دسته‌بندی',
      deleteTitle: 'حذف یادداشت؟',
      deleteText: 'این عمل قابل بازگشت نیست.',
      cancel: 'لغو',
      save: 'ذخیره',
      saveLock: 'ذخیره قفل',
      delete: 'حذف',
      undo: 'بازگشت',
      copy: 'رونوشت',
      unlockAction: 'باز کردن',
      unlockNote: 'باز کردن یادداشت',
      unlockWithPassword: 'برای دیدن این یادداشت رمز یا پین را وارد کنید.',
      passwordOrPin: 'رمز یا پین',
      lockNote: 'قفل کردن یادداشت',
      lockType: 'نوع محافظت',
      password: 'رمز عبور',
      pin4: 'پین ۴ رقمی',
      secretLabel: 'رمز / پین',
      confirmLabel: 'تأیید',
      secretPlaceholder: 'رمز یا پین ۴ رقمی را وارد کنید',
      confirmPlaceholder: 'رمز یا پین را دوباره وارد کنید',
      sourceNone: 'برای این یادداشت دادهٔ منبع خارجی وجود ندارد.',
      source: 'منبع',
      captured: 'زمان ذخیره',
      unlockFirst: 'ابتدا یادداشت را باز کنید',
      invalidSecret: 'رمز یا پین نادرست است',
      noteUnlocked: 'یادداشت باز شد',
      lockRemoved: 'قفل حذف شد',
      noteLocked: 'یادداشت قفل شد',
      lockChanged: 'رمز / پین تغییر کرد',
      noteRelocked: 'یادداشت دوباره قفل شد',
      workspaceRequired: 'نام فضای کاری الزامی است',
      workspaceExists: 'این فضای کاری قبلاً وجود دارد',
      workspaceAdded: 'فضای کاری اضافه شد',
      workspaceUpdated: 'فضای کاری به‌روزرسانی شد',
      workspaceDeleted: 'فضای کاری حذف شد',
      workspaceDeleteConfirm: 'فضای کاری "{name}" حذف شود؟ یادداشت‌ها به "{fallback}" منتقل می‌شوند.',
      atLeastOneWorkspace: 'حداقل یک فضای کاری لازم است',
      categoryRequired: 'نام دسته‌بندی الزامی است',
      categoryExists: 'این دسته‌بندی قبلاً وجود دارد',
      categoryAdded: 'دسته‌بندی اضافه شد',
      categoryUpdated: 'دسته‌بندی به‌روزرسانی شد',
      categoryDeleted: 'دسته‌بندی حذف شد',
      categoryDeleteConfirm: 'دسته‌بندی "{name}" حذف شود؟ یادداشت‌ها بدون دسته‌بندی می‌شوند.',
      customTagAdded: 'برچسب سفارشی اضافه شد',
      enterTagName: 'نام برچسب جدید را وارد کنید',
      suggestionsEmpty: 'فعلاً برچسب پیشنهادی برای این یادداشت وجود ندارد.',
      noTagsYet: 'هنوز برچسبی وجود ندارد.',
      settingsSaved: 'تنظیمات ذخیره شد',
      saveSuccess: 'یادداشت ذخیره شد',
      nothingToSave: 'تغییری برای ذخیره وجود ندارد',
      newNoteCreated: 'یادداشت جدید ساخته شد',
      noteDeleted: 'یادداشت حذف شد',
      noteDuplicated: 'کپی یادداشت ساخته شد',
      noteNotFound: 'یادداشت پیدا نشد',
      changesUnsaved: 'تغییرات ذخیره نشده',
      autosaved: 'ذخیره خودکار شد',
      saved: 'ذخیره شد',
      clearConfirm: 'آیا مطمئن هستید؟ همهٔ یادداشت‌ها، دسته‌بندی‌ها، فضاهای کاری، برچسب‌ها و تنظیمات حذف می‌شوند و قابل بازگشت نیستند.',
      dataCleared: 'همه داده‌ها پاک شد',
      addTitleOrContent: 'لطفاً عنوان یا محتوا وارد کنید',
      confirmRemoveLock: 'قفل این یادداشت حذف شود؟',
      deleteConfirm: 'این یادداشت حذف شود؟',
      untitled: 'یادداشت بدون عنوان',
      general: 'عمومی',
      notes: 'یادداشت',
      note: 'یادداشت',
      chars: 'کاراکتر',
      created: 'ساخته‌شده',
      updated: 'ویرایش‌شده',
      locked: 'قفل‌شده',
      unlocked: 'باز',
      notLocked: 'این یادداشت قفل نشده است.',
      protectedByPassword: 'این یادداشت با رمز محافظت شده است.',
      protectedByPin: 'این یادداشت با پین ۴ رقمی محافظت شده است.',
      previewHidden: '🔒 پیش‌نمایش تا زمان باز شدن مخفی است',
      savedFromWeb: 'ذخیره‌شده از وب',
      allScopes: 'همه یادداشت‌ها',
      themeBlue: 'آبی',
      themeGreen: 'سبز',
      themePurple: 'بنفش',
      themeOrange: 'نارنجی',
      themeDarkPro: 'دارک پرو'
    }
  };

  let allNotes = [];
  let categories = [];
  let workspaces = [];
  let customTags = [];
  let settings = {};

  let currentView = 'list';
  let currentScope = 'all';
  let currentNoteId = null;
  let currentCategoryFilter = null;
  let currentTagFilter = null;
  let sortMode = 'updated-desc';
  let listMode = 'overview';
  let isDirty = false;
  let autoSaveTimer = null;
  let historyTimer = null;
  let editorHistory = [];
  let editorHistoryIndex = -1;
  let applyingHistoryState = false;

  let editingWorkspaceId = null;
  let editingCategory = null;
  let lockModalMode = 'create';
  let unlockTargetNoteId = null;
  let unlockSuccessCallback = null;
  let unlockRecoveryMode = false;

  const unlockedNotes = new Set();

  const els = {
    sidebar: document.getElementById('sidebar'),
    collapseBtn: document.getElementById('btn-collapse'),
    navAllNotes: document.getElementById('nav-all-notes'),
    globalSearch: document.getElementById('global-search'),

    workspacesList: document.getElementById('workspaces-list'),
    btnAddWorkspace: document.getElementById('btn-add-workspace'),
    categoriesList: document.getElementById('categories-list'),
    tagsList: document.getElementById('tags-list'),
    btnAddCategory: document.getElementById('btn-add-category'),
    btnNewNote: document.getElementById('btn-new-note'),
    btnNewNoteHeader: document.getElementById('btn-new-note-header'),
    btnSettingsNav: document.getElementById('btn-settings-nav'),
    settingsUpdateBadge: document.getElementById('settings-update-badge'),

    viewList: document.getElementById('view-list'),
    viewEditor: document.getElementById('view-editor'),
    viewSettings: document.getElementById('view-settings'),
    listTitle: document.getElementById('list-title'),
    listSubtitle: document.getElementById('list-subtitle'),
    listSearch: document.getElementById('list-search'),
    listSort: document.getElementById('list-sort'),
    listWorkspaceFilter: document.getElementById('list-workspace-filter'),
    notesGrid: document.getElementById('notes-grid'),
    listEmpty: document.getElementById('list-empty'),
    listEmptyTitle: document.getElementById('list-empty-title'),
    listEmptySubtitle: document.getElementById('list-empty-subtitle'),
    btnOverviewView: document.getElementById('btn-overview-view'),

    btnBack: document.getElementById('btn-back'),
    noteTitle: document.getElementById('note-title'),
    noteCreated: document.getElementById('note-created'),
    noteUpdated: document.getElementById('note-updated'),
    noteChars: document.getElementById('note-chars'),
    noteLockBadge: document.getElementById('note-lock-badge'),
    autoSaveStatus: document.getElementById('auto-save-status'),
    btnSave: document.getElementById('btn-save'),
    btnUndo: document.getElementById('btn-undo'),
    btnCopyNote: document.getElementById('btn-copy-note'),
    btnDelete: document.getElementById('btn-delete'),
    noteWorkspace: document.getElementById('note-workspace'),
    noteCategory: document.getElementById('note-category'),
    noteTags: document.getElementById('note-tags'),
    btnAddTag: document.getElementById('btn-add-tag'),
    tagSuggestionsList: document.getElementById('tag-suggestions-list'),
    noteQuickTags: document.getElementById('note-quick-tags'),
    noteSuggestedTags: document.getElementById('note-suggested-tags'),
    btnApplyAllSuggestions: document.getElementById('btn-apply-all-suggestions'),
    btnEditSuggestions: document.getElementById('btn-edit-suggestions'),
    noteColorOptions: document.getElementById('note-color-options'),
    notePin: document.getElementById('note-pin'),
    noteFavorite: document.getElementById('note-favorite'),
    modeTabs: document.querySelectorAll('.cn-mode-tab'),
    btnPaste: document.getElementById('btn-paste'),
    noteContent: document.getElementById('note-content'),
    notePreview: document.getElementById('note-preview'),
    editorContainer: document.getElementById('editor-container'),
    lockStatusText: document.getElementById('lock-status-text'),
    btnLockNote: document.getElementById('btn-lock-note'),
    btnChangeLock: document.getElementById('btn-change-lock'),
    btnRemoveLock: document.getElementById('btn-remove-lock'),
    btnRecoveryToggle: document.getElementById('btn-recovery-toggle'),
    noteRecoveryPanel: document.getElementById('note-recovery-panel'),
    recoveryQuestion: document.getElementById('recovery-question'),
    recoveryAnswer: document.getElementById('recovery-answer'),
    btnSaveRecovery: document.getElementById('btn-save-recovery'),
    btnClearRecovery: document.getElementById('btn-clear-recovery'),
    noteSourceMeta: document.getElementById('note-source-meta'),

    btnBackSettings: document.getElementById('btn-back-settings'),
    settingDarkMode: document.getElementById('setting-dark-mode'),
    settingTheme: document.getElementById('setting-theme'),
    settingFontSize: document.getElementById('setting-font-size'),
    fontSizeValue: document.getElementById('font-size-value'),
    settingAnimations: document.getElementById('setting-animations'),
    settingAutoSave: document.getElementById('setting-auto-save'),
    settingDefaultColor: document.getElementById('setting-default-color'),
    settingLanguage: document.getElementById('setting-language'),
    btnCheckUpdates: document.getElementById('btn-check-updates'),
    updatesStatus: document.getElementById('updates-status'),
    updatesPrivacy: document.getElementById('updates-privacy'),
    btnExportJson: document.getElementById('btn-export-json'),
    btnExportTxt: document.getElementById('btn-export-txt'),
    btnImportJson: document.getElementById('btn-import-json'),
    btnClearData: document.getElementById('btn-clear-data'),
    settingsNoteCount: document.getElementById('settings-note-count'),

    workspaceModal: document.getElementById('workspace-modal'),
    workspaceModalTitle: document.getElementById('workspace-modal-title'),
    workspaceInput: document.getElementById('workspace-input'),
    btnSaveWorkspace: document.getElementById('btn-save-workspace'),
    btnCancelWorkspace: document.getElementById('btn-cancel-workspace'),

    categoryModal: document.getElementById('category-modal'),
    categoryModalTitle: document.getElementById('category-modal-title'),
    categoryInput: document.getElementById('category-input'),
    btnSaveCategory: document.getElementById('btn-save-category'),
    btnCancelCategory: document.getElementById('btn-cancel-category'),

    deleteModal: document.getElementById('delete-modal'),
    btnConfirmDelete: document.getElementById('btn-confirm-delete'),
    btnCancelDelete: document.getElementById('btn-cancel-delete'),

    lockModal: document.getElementById('lock-modal'),
    lockModalTitle: document.getElementById('lock-modal-title'),
    lockType: document.getElementById('lock-type'),
    lockSecret: document.getElementById('lock-secret'),
    lockConfirmSecret: document.getElementById('lock-confirm-secret'),
    btnToggleLockSecret: document.getElementById('btn-toggle-lock-secret'),
    btnToggleLockConfirmSecret: document.getElementById('btn-toggle-lock-confirm-secret'),
    btnSaveLock: document.getElementById('btn-save-lock'),
    btnCancelLock: document.getElementById('btn-cancel-lock'),

    unlockModal: document.getElementById('unlock-modal'),
    unlockModalTitle: document.getElementById('unlock-modal-title'),
    unlockModalText: document.getElementById('unlock-modal-text'),
    unlockSecret: document.getElementById('unlock-secret'),
    btnToggleUnlockSecret: document.getElementById('btn-toggle-unlock-secret'),
    btnConfirmUnlock: document.getElementById('btn-confirm-unlock'),
    btnCancelUnlock: document.getElementById('btn-cancel-unlock'),
    btnRecoverUnlock: document.getElementById('btn-recover-unlock'),
    unlockRecoveryPanel: document.getElementById('unlock-recovery-panel'),
    unlockRecoveryQuestion: document.getElementById('unlock-recovery-question'),
    unlockRecoveryAnswer: document.getElementById('unlock-recovery-answer')
  };

  function locale() {
    return settings.language === 'fa' ? 'fa' : 'en';
  }

  function t(key, params = {}) {
    let text = I18N[locale()][key] || I18N.en[key] || key;
    Object.entries(params).forEach(([name, value]) => {
      text = text.replace(`{${name}}`, value);
    });
    return text;
  }

  function isFa() {
    return locale() === 'fa';
  }

  function localDate(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString(isFa() ? 'fa-IR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function localRelativeDate(timestamp) {
    if (!timestamp) return '-';
    if (!isFa()) return window.ClipNote.formatRelativeDate(timestamp);
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return 'همین الآن';
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    if (days < 7) return `${days} روز پیش`;
    return localDate(timestamp);
  }

  function workspaceLabel(workspace) {
    if (!workspace) return t('general');
    if (workspace.id === DEFAULT_WORKSPACE_ID && workspace.name === 'General' && isFa()) {
      return t('general');
    }
    return workspace.name;
  }

  function getLocalizedUpdateStatus(info = null) {
    if (!info) return t('updatesChecking');
    if (info.hasUpdate) {
      return `${t('updatesAvailable')}: v${info.latestVersion}`;
    }
    if (info.error) return t('updatesUnknown');
    return t('updatesCurrent');
  }

  function renderUpdateStatus(info = null) {
    if (els.updatesStatus) {
      els.updatesStatus.textContent = getLocalizedUpdateStatus(info);
    }
    if (els.settingsUpdateBadge) {
      els.settingsUpdateBadge.classList.toggle('cn-hidden', !(info && info.hasUpdate));
    }
  }

  async function openUpdatesPage(forceCheck = true) {
    const info = forceCheck ? await checkForUpdates(true) : ((await getUpdateInfo()) || null);
    renderUpdateStatus(info);
    chrome.tabs.create({ url: (info && info.url) ? info.url : GITHUB_REPO_URL });
  }

  function themeLabel(key) {
    return {
      blue: t('themeBlue'),
      green: t('themeGreen'),
      purple: t('themePurple'),
      orange: t('themeOrange'),
      'dark-pro': t('themeDarkPro')
    }[key] || key;
  }

  function findNote(id = currentNoteId) {
    return allNotes.find(note => note.id === id) || null;
  }

  async function init() {
    const migrated = await migrateStorageData();
    settings = migrated.settings;
    listMode = settings.fullViewMode === 'timeline' || settings.fullViewMode === 'normal'
      ? 'overview'
      : (settings.fullViewMode || 'overview');

    await refreshState();
    currentScope = workspaces.some(workspace => workspace.id === settings.currentWorkspaceId)
      ? settings.currentWorkspaceId
      : 'all';

    await applyTheme(settings);
    applyLocale();
    renderColorOptions();
    renderSettingColorOptions();
    renderWorkspaceSelectors();
    renderWorkspacesSidebar();
    renderCategoriesSidebar();
    renderTagsSidebar();
    renderTagSuggestionsDataList();
    updateCounts();
    applyListModeUI();
    renderUpdateStatus(await getUpdateInfo());
    setupEventListeners();
    checkForUpdates(false).then(renderUpdateStatus).catch(() => renderUpdateStatus({ error: true }));

    document.addEventListener('visibilitychange', async () => {
      if (document.hidden && currentView === 'edit' && isDirty) {
        await saveCurrentNote(false);
      }
      if (!document.hidden && currentView !== 'edit') {
        await refreshState();
        renderAllListState();
      }
    });

    window.addEventListener('beforeunload', () => {
      if (currentView === 'edit' && isDirty) saveCurrentNote(false);
    });

    chrome.storage.onChanged.addListener(handleStorageChanges);
    await handleUrlParams();
  }

  async function refreshState() {
    [allNotes, categories, workspaces, customTags, settings] = await Promise.all([
      getNotes(),
      getCategories(),
      getWorkspaces(),
      getCustomTags(),
      getSettings()
    ]);

    if (!workspaces.length) {
      workspaces = DEFAULT_WORKSPACES.map(createWorkspace);
      await saveWorkspaces(workspaces);
    }
  }

  function applyLocale() {
    document.documentElement.lang = locale();
    document.documentElement.dir = isFa() ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-lang', locale());

    document.getElementById('nav-all-notes-label').textContent = t('allNotes');
    document.getElementById('workspace-section-title').textContent = t('workspaces');
    document.getElementById('category-section-title').textContent = t('categories');
    document.getElementById('tag-section-title').textContent = t('tags');
    document.getElementById('add-workspace-label').textContent = t('addWorkspace');
    document.getElementById('add-category-label').textContent = t('addCategory');
    document.getElementById('new-note-label').textContent = t('newNote');
    document.getElementById('settings-nav-label').textContent = t('settings');
    document.getElementById('new-note-header-label').textContent = t('newNote');
    document.getElementById('save-btn-label').textContent = t('save');
    document.getElementById('undo-btn-label').textContent = t('undo');
    document.getElementById('copy-btn-label').textContent = t('copy');
    document.getElementById('delete-btn-label').textContent = t('delete');
    document.getElementById('label-note-workspace').textContent = t('workspace');
    document.getElementById('label-note-category').textContent = t('category');
    document.getElementById('label-note-tags').textContent = t('tagsLabel');
    document.getElementById('add-tag-label').textContent = t('addTag');
    document.getElementById('label-note-color').textContent = t('color');
    document.getElementById('pin-label').textContent = t('pin');
    document.getElementById('favorite-label').textContent = t('favorite');
    document.getElementById('quick-tags-title').textContent = t('quickTags');
    document.getElementById('quick-tags-subtitle').textContent = t('quickTagsSub');
    document.getElementById('smart-tags-title').textContent = t('smartSuggestions');
    document.getElementById('btn-apply-all-suggestions').textContent = t('acceptAll');
    document.getElementById('btn-edit-suggestions').textContent = t('edit');
    document.getElementById('protection-title').textContent = t('protection');
    document.getElementById('lock-btn-label').textContent = t('lock');
    document.getElementById('change-lock-label').textContent = t('changeLock');
    document.getElementById('remove-lock-label').textContent = t('removeLock');
    document.getElementById('recovery-toggle-label').textContent = t('recoveryToggle');
    document.getElementById('recovery-question-label').textContent = t('recoveryQuestion');
    document.getElementById('recovery-answer-label').textContent = t('recoveryAnswer');
    document.querySelector('.cn-mode-tab[data-mode="split"]').textContent = t('splitView');
    document.querySelector('.cn-mode-tab[data-mode="edit"]').textContent = t('editorOnly');
    document.querySelector('.cn-mode-tab[data-mode="preview"]').textContent = t('previewOnly');
    document.getElementById('paste-label').textContent = t('paste');
    document.getElementById('preview-label').textContent = t('preview');
    document.getElementById('settings-title').textContent = t('settingsTitle');
    document.getElementById('settings-subtitle').textContent = t('settingsSub');
    document.getElementById('back-label').textContent = t('back');
    document.getElementById('appearance-title').textContent = t('appearance');
    document.getElementById('dark-mode-label').textContent = t('darkMode');
    document.getElementById('theme-label').textContent = t('theme');
    document.getElementById('font-size-label').textContent = t('fontSize');
    document.getElementById('animations-label').textContent = t('animations');
    document.getElementById('editor-settings-title').textContent = t('editor');
    document.getElementById('autosave-label').textContent = t('autoSave');
    document.getElementById('default-color-label').textContent = t('defaultColor');
    document.getElementById('default-color-subtitle').textContent = t('defaultColorSub');
    document.getElementById('default-color-about-title').textContent = t('defaultColorAboutTitle');
    document.getElementById('default-color-about-text').textContent = t('defaultColorAboutText');
    document.getElementById('language-title').textContent = t('language');
    document.getElementById('language-select-label').textContent = t('languageSelect');
    document.getElementById('language-help').textContent = t('languageHelp');
    document.getElementById('updates-title').textContent = t('updates');
    document.getElementById('updates-help').textContent = t('updatesHelp');
    document.getElementById('updates-privacy').textContent = t('updatesPrivacy');
    document.getElementById('updates-tip-text').textContent = t('updatesTip');
    document.getElementById('data-title').textContent = t('data');
    document.getElementById('data-help').textContent = t('dataHelp');
    document.getElementById('about-title').textContent = t('about');
    document.getElementById('about-desc').textContent = t('aboutDesc');
    document.getElementById('total-notes-label').textContent = t('totalNotes');
    document.getElementById('import-json-label').textContent = t('importJson');
    document.getElementById('clear-data-label').textContent = t('clearAllData');
    document.getElementById('list-empty-title').textContent = t('noNotes');
    document.getElementById('list-empty-subtitle').textContent = t('noNotesSub');
    document.getElementById('delete-modal-title').textContent = t('deleteTitle');
    document.getElementById('delete-modal-text').textContent = t('deleteText');
    document.getElementById('lock-type-label').textContent = t('lockType');
    document.getElementById('lock-secret-label').textContent = t('secretLabel');
    document.getElementById('lock-confirm-label').textContent = t('confirmLabel');

    els.globalSearch.placeholder = t('searchSidebar');
    els.listSearch.placeholder = t('searchList');
    els.noteTitle.placeholder = t('titlePlaceholder');
    els.noteTags.placeholder = t('tagsPlaceholder');
    els.noteContent.placeholder = t('contentPlaceholder');
    els.workspaceInput.placeholder = t('workspacePlaceholder');
    els.categoryInput.placeholder = t('categoryPlaceholder');
    els.lockSecret.placeholder = t('secretPlaceholder');
    els.lockConfirmSecret.placeholder = t('confirmPlaceholder');
    els.recoveryQuestion.placeholder = t('recoveryQuestionPlaceholder');
    els.recoveryAnswer.placeholder = t('recoveryAnswerPlaceholder');
    els.unlockSecret.placeholder = t('passwordOrPin');
    els.unlockRecoveryAnswer.placeholder = t('recoveryAnswer');
    els.unlockModalTitle.textContent = t('unlockNote');
    els.unlockModalText.textContent = t('unlockWithPassword');
    els.btnOverviewView.textContent = t('overviewView');
    const sortOptions = els.listSort.querySelectorAll('option');
    if (sortOptions[0]) sortOptions[0].textContent = t('lastUpdated');
    if (sortOptions[1]) sortOptions[1].textContent = t('createdDate');
    if (sortOptions[2]) sortOptions[2].textContent = t('titleAsc');
    if (sortOptions[3]) sortOptions[3].textContent = t('titleDesc');
    els.btnBackSettings.innerHTML = `← <span id="back-label">${t('back')}</span>`;
    els.btnCheckUpdates.textContent = t('updatesButton');
    if (els.settingsUpdateBadge) els.settingsUpdateBadge.textContent = t('newBadge');
    els.btnExportJson.textContent = t('exportJson');
    els.btnExportTxt.textContent = t('exportTxt');
    els.btnCancelWorkspace.textContent = t('cancel');
    els.btnSaveWorkspace.textContent = t('save');
    els.btnCancelCategory.textContent = t('cancel');
    els.btnSaveCategory.textContent = t('save');
    els.btnCancelDelete.textContent = t('cancel');
    els.btnConfirmDelete.textContent = t('delete');
    els.btnCancelLock.textContent = t('cancel');
    els.btnSaveLock.textContent = t('saveLock');
    els.btnSaveRecovery.textContent = t('saveRecovery');
    els.btnClearRecovery.textContent = t('clearRecovery');
    els.btnCancelUnlock.textContent = t('cancel');
    els.btnRecoverUnlock.textContent = t('recoverPassword');
    els.btnConfirmUnlock.textContent = t('unlockAction');
    [...els.settingTheme.options].forEach(option => {
      option.textContent = themeLabel(option.value);
    });

    [...els.lockType.options].forEach(option => {
      option.textContent = option.value === 'pin' ? t('pin4') : t('password');
    });

    [...els.settingLanguage.options].forEach(option => {
      option.textContent = option.value === 'fa' ? 'فارسی' : 'English';
    });
  }

  async function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const id = params.get('id');

    if (view === 'settings') {
      await showView('settings');
      return;
    }

    if (view === 'edit' && id) {
      await openEditor(id);
      return;
    }

    await showView('list');
  }

  function renderAllListState() {
    applyLocale();
    renderWorkspaceSelectors();
    renderWorkspacesSidebar();
    renderCategoriesSidebar();
    renderTagsSidebar();
    renderTagSuggestionsDataList();
    updateCounts();
    updateListTitle();
    renderNotesList();
  }

  async function handleStorageChanges(changes, areaName) {
    if (areaName !== 'local') return;
    const keys = [STORAGE_KEYS.NOTES, STORAGE_KEYS.SETTINGS, STORAGE_KEYS.WORKSPACES, STORAGE_KEYS.CATEGORIES, STORAGE_KEYS.CUSTOM_TAGS, STORAGE_KEYS.UPDATE_INFO];
    if (!Object.keys(changes).some(key => keys.includes(key))) return;
    if (currentView === 'edit' && isDirty) return;

    await refreshState();
    await applyTheme(settings);
    renderAllListState();
    renderUpdateStatus(await getUpdateInfo());

    if (currentView === 'edit' && currentNoteId) {
      const note = findNote(currentNoteId);
      if (note) fillEditor(note);
    }
    if (currentView === 'settings') loadSettingsUI();
  }

  function setupEventListeners() {
    els.collapseBtn.addEventListener('click', async () => {
      els.sidebar.classList.toggle('collapsed');
      settings.sidebarCollapsed = els.sidebar.classList.contains('collapsed');
      await saveSettings({ ...settings });
    });

    els.navAllNotes.addEventListener('click', async () => {
      currentScope = 'all';
      currentCategoryFilter = null;
      currentTagFilter = null;
      await showView('list');
    });

    els.globalSearch.addEventListener('input', () => renderNotesList());
    els.btnAddWorkspace.addEventListener('click', () => openWorkspaceModal());
    els.btnAddCategory.addEventListener('click', () => openCategoryModal());
    els.btnNewNote.addEventListener('click', createNewNote);
    els.btnNewNoteHeader.addEventListener('click', createNewNote);
    els.btnSettingsNav.addEventListener('click', () => showView('settings'));

    els.listSearch.addEventListener('input', () => renderNotesList());
    els.listSort.addEventListener('change', (e) => {
      sortMode = e.target.value;
      renderNotesList();
    });
    els.listWorkspaceFilter.addEventListener('change', async (e) => {
      currentScope = e.target.value;
      if (currentScope !== 'all') {
        settings.currentWorkspaceId = currentScope;
        await saveSettings({ ...settings, currentWorkspaceId: currentScope });
      }
      currentCategoryFilter = null;
      currentTagFilter = null;
      renderAllListState();
    });
    els.btnOverviewView.addEventListener('click', () => setListMode('overview'));

    els.btnBack.addEventListener('click', async () => {
      if (isDirty) await saveCurrentNote(false);
      await showView('list');
    });

    els.noteTitle.addEventListener('input', onEditorInput);
    els.noteContent.addEventListener('input', () => {
      onEditorInput();
      updatePreview();
      updateCharCount();
      renderSuggestionPanel();
    });
    els.noteWorkspace.addEventListener('change', onEditorInput);
    els.noteCategory.addEventListener('change', onEditorInput);
    els.noteTags.addEventListener('input', () => {
      onEditorInput();
      renderQuickTagPanel();
      renderSuggestionPanel();
    });
    els.notePin.addEventListener('change', onEditorInput);
    els.noteFavorite.addEventListener('change', onEditorInput);
    els.btnSave.addEventListener('click', () => saveCurrentNote(true));
    els.btnUndo.addEventListener('click', undoEditorChange);
    els.btnCopyNote.addEventListener('click', () => {
      const note = findNote();
      if (note && isProtected(note) && !unlockedNotes.has(note.id)) {
        showToast(t('unlockFirst'), 'warning');
        return;
      }
      const values = getCurrentNoteValues();
      copyToClipboard(`${values.title}\n\n${values.content}`, els.btnCopyNote);
    });
    els.btnDelete.addEventListener('click', () => els.deleteModal.classList.remove('cn-hidden'));
    els.btnPaste.addEventListener('click', async () => {
      const text = await readFromClipboard();
      if (text) {
        els.noteContent.value += text;
        onEditorInput();
        updatePreview();
        updateCharCount();
        renderSuggestionPanel();
      }
    });
    els.btnAddTag.addEventListener('click', addCustomTagFromPrompt);
    els.btnApplyAllSuggestions.addEventListener('click', applyAllSuggestedTags);
    els.btnEditSuggestions.addEventListener('click', mergeSuggestionsIntoInput);

    els.btnLockNote.addEventListener('click', () => openLockModal('create'));
    els.btnChangeLock.addEventListener('click', () => openLockModal('change'));
    els.btnRemoveLock.addEventListener('click', removeCurrentLock);
    els.btnRecoveryToggle.addEventListener('click', toggleRecoveryPanel);
    els.btnSaveRecovery.addEventListener('click', saveRecoveryQuestion);
    els.btnClearRecovery.addEventListener('click', clearRecoveryQuestion);

    els.btnBackSettings.addEventListener('click', () => showView('list'));
    els.settingDarkMode.addEventListener('change', saveSettingsFromUI);
    els.settingTheme.addEventListener('change', saveSettingsFromUI);
    els.settingFontSize.addEventListener('input', () => {
      els.fontSizeValue.textContent = `${els.settingFontSize.value}px`;
      saveSettingsFromUI();
    });
    els.settingAnimations.addEventListener('change', saveSettingsFromUI);
    els.settingAutoSave.addEventListener('change', saveSettingsFromUI);
    els.settingLanguage.addEventListener('change', saveSettingsFromUI);
    els.btnCheckUpdates.addEventListener('click', () => openUpdatesPage(true));
    els.btnExportJson.addEventListener('click', exportToJson);
    els.btnExportTxt.addEventListener('click', exportToTxt);
    els.btnImportJson.addEventListener('change', handleImportFile);
    els.btnClearData.addEventListener('click', clearAllData);

    els.btnSaveWorkspace.addEventListener('click', saveWorkspaceFromModal);
    els.btnCancelWorkspace.addEventListener('click', closeWorkspaceModal);
    els.workspaceInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveWorkspaceFromModal();
      if (e.key === 'Escape') closeWorkspaceModal();
    });

    els.btnSaveCategory.addEventListener('click', saveCategoryFromModal);
    els.btnCancelCategory.addEventListener('click', closeCategoryModal);
    els.categoryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveCategoryFromModal();
      if (e.key === 'Escape') closeCategoryModal();
    });

    els.btnConfirmDelete.addEventListener('click', deleteCurrentNote);
    els.btnCancelDelete.addEventListener('click', closeDeleteModal);

    els.btnSaveLock.addEventListener('click', saveLockFromModal);
    els.btnCancelLock.addEventListener('click', closeLockModal);
    els.lockType.addEventListener('change', updateLockModalPlaceholder);
    els.btnToggleLockSecret.addEventListener('click', () => togglePasswordField(els.lockSecret));
    els.btnToggleLockConfirmSecret.addEventListener('click', () => togglePasswordField(els.lockConfirmSecret));

    els.btnConfirmUnlock.addEventListener('click', confirmUnlock);
    els.btnCancelUnlock.addEventListener('click', closeUnlockModal);
    els.btnRecoverUnlock.addEventListener('click', handleRecoveryUnlock);
    els.btnToggleUnlockSecret.addEventListener('click', () => togglePasswordField(els.unlockSecret));
    els.unlockSecret.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmUnlock();
      if (e.key === 'Escape') closeUnlockModal();
    });
    els.unlockRecoveryAnswer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleRecoveryUnlock();
      if (e.key === 'Escape') closeUnlockModal();
    });

    els.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        els.modeTabs.forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
        els.editorContainer.className = `cn-editor-container ${tab.dataset.mode}-mode`;
      });
    });

    els.notePreview.addEventListener('click', (e) => {
      const button = e.target.closest('.cn-copy-code-btn');
      if (button && button.dataset.code) {
        copyToClipboard(button.dataset.code, button);
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && currentView === 'edit') {
        e.preventDefault();
        saveCurrentNote(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        currentView === 'edit' ? els.noteContent.focus() : els.listSearch.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createNewNote();
      }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'u' && currentView === 'edit') {
        e.preventDefault();
        undoEditorChange();
      }
      if (e.key === 'Escape') handleEscape();
    });
  }

  function onEditorInput() {
    if (applyingHistoryState) return;
    markDirty();
    queueHistoryCapture();
    scheduleAutoSave();
  }

  async function showView(viewName) {
    if (currentView === 'edit' && viewName !== 'edit') {
      clearEditorHistory();
    }
    currentView = viewName;
    els.viewList.classList.add('cn-hidden');
    els.viewEditor.classList.add('cn-hidden');
    els.viewSettings.classList.add('cn-hidden');

    if (viewName === 'list') {
      els.viewList.classList.remove('cn-hidden');
      renderAllListState();
    } else if (viewName === 'edit') {
      els.viewEditor.classList.remove('cn-hidden');
    } else {
      els.viewSettings.classList.remove('cn-hidden');
      loadSettingsUI();
    }

    updateUrlState();
  }

  function updateUrlState() {
    const url = new URL(window.location.href);
    if (currentView === 'settings') {
      url.searchParams.set('view', 'settings');
      url.searchParams.delete('id');
    } else if (currentView === 'edit' && currentNoteId) {
      url.searchParams.set('view', 'edit');
      url.searchParams.set('id', currentNoteId);
    } else {
      url.searchParams.delete('view');
      url.searchParams.delete('id');
    }
    window.history.replaceState({}, '', url);
  }

  async function handleEscape() {
    if (!els.workspaceModal.classList.contains('cn-hidden')) return closeWorkspaceModal();
    if (!els.categoryModal.classList.contains('cn-hidden')) return closeCategoryModal();
    if (!els.deleteModal.classList.contains('cn-hidden')) return closeDeleteModal();
    if (!els.lockModal.classList.contains('cn-hidden')) return closeLockModal();
    if (!els.unlockModal.classList.contains('cn-hidden')) return closeUnlockModal();
    if (currentView === 'edit' || currentView === 'settings') await showView('list');
  }

  function updateScopeSelectionUI() {
    els.navAllNotes.classList.toggle('active', currentScope === 'all');
  }

  function renderWorkspaceSelectors() {
    els.listWorkspaceFilter.innerHTML = `<option value="all">${t('allScopes')}</option>`;
    els.noteWorkspace.innerHTML = '';

    workspaces.forEach(workspace => {
      const filterOption = document.createElement('option');
      filterOption.value = workspace.id;
      filterOption.textContent = workspaceLabel(workspace);
      els.listWorkspaceFilter.appendChild(filterOption);

      const noteOption = document.createElement('option');
      noteOption.value = workspace.id;
      noteOption.textContent = workspaceLabel(workspace);
      els.noteWorkspace.appendChild(noteOption);
    });

    els.listWorkspaceFilter.value = workspaces.some(workspace => workspace.id === currentScope) ? currentScope : 'all';
    const editorWorkspaceId = findNote()?.workspaceId || settings.currentWorkspaceId || workspaces[0]?.id || DEFAULT_WORKSPACE_ID;
    els.noteWorkspace.value = workspaces.some(workspace => workspace.id === editorWorkspaceId) ? editorWorkspaceId : (workspaces[0]?.id || DEFAULT_WORKSPACE_ID);
    updateScopeSelectionUI();
  }

  function scopedNotes() {
    return currentScope === 'all'
      ? [...allNotes]
      : allNotes.filter(note => note.workspaceId === currentScope);
  }

  function updateListTitle() {
    const selectedWorkspace = workspaces.find(workspace => workspace.id === currentScope);
    if (currentCategoryFilter) {
      els.listTitle.textContent = `${t('category')}: ${currentCategoryFilter}`;
      els.listSubtitle.textContent = currentScope === 'all' ? t('allNotes') : workspaceLabel(selectedWorkspace);
      return;
    }
    if (currentTagFilter) {
      els.listTitle.textContent = `${t('tagsLabel')}: ${currentTagFilter}`;
      els.listSubtitle.textContent = currentScope === 'all' ? t('allNotes') : workspaceLabel(selectedWorkspace);
      return;
    }
    if (currentScope === 'all') {
      els.listTitle.textContent = t('allNotes');
      els.listSubtitle.textContent = t('listSubtitle');
    } else {
      els.listTitle.textContent = workspaceLabel(selectedWorkspace);
      els.listSubtitle.textContent = t('workspace');
    }
  }

  function renderWorkspacesSidebar() {
    els.workspacesList.innerHTML = '';
    workspaces.forEach(workspace => {
      const count = allNotes.filter(note => note.workspaceId === workspace.id).length;
      const item = document.createElement('div');
      item.className = `cn-category-item ${currentScope === workspace.id ? 'active' : ''}`;
      item.innerHTML = `
        <span class="cn-color-dot cn-color-purple"></span>
        <span class="cn-truncate">${escapeHtml(workspaceLabel(workspace))}</span>
        <span class="cn-nav-count">${count}</span>
        <div class="cn-category-actions">
          <button class="cn-action-btn cn-btn-sm" data-action="edit" type="button">✏️</button>
          <button class="cn-action-btn cn-btn-sm danger" data-action="delete" type="button">🗑</button>
        </div>
      `;
      item.addEventListener('click', async (e) => {
        if (e.target.closest('.cn-category-actions')) return;
        currentScope = workspace.id;
        settings.currentWorkspaceId = workspace.id;
        currentCategoryFilter = null;
        currentTagFilter = null;
        await saveSettings({ ...settings, currentWorkspaceId: workspace.id });
        renderAllListState();
      });
      item.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
        e.stopPropagation();
        openWorkspaceModal(workspace.id);
      });
      item.querySelector('[data-action="delete"]').addEventListener('click', async (e) => {
        e.stopPropagation();
        await deleteWorkspace(workspace.id);
      });
      els.workspacesList.appendChild(item);
    });
  }

  function renderCategoriesSidebar() {
    els.categoriesList.innerHTML = '';
    categories.forEach(category => {
      const count = scopedNotes().filter(note => note.category === category).length;
      const item = document.createElement('div');
      item.className = `cn-category-item ${currentCategoryFilter === category ? 'active' : ''}`;
      item.innerHTML = `
        <span class="cn-color-dot cn-color-gray"></span>
        <span class="cn-truncate">${escapeHtml(category)}</span>
        <span class="cn-nav-count">${count}</span>
        <div class="cn-category-actions">
          <button class="cn-action-btn cn-btn-sm" data-action="edit" type="button">✏️</button>
          <button class="cn-action-btn cn-btn-sm danger" data-action="delete" type="button">🗑</button>
        </div>
      `;
      item.addEventListener('click', () => {
        currentCategoryFilter = currentCategoryFilter === category ? null : category;
        currentTagFilter = null;
        renderAllListState();
      });
      item.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
        e.stopPropagation();
        openCategoryModal(category);
      });
      item.querySelector('[data-action="delete"]').addEventListener('click', async (e) => {
        e.stopPropagation();
        const confirmed = confirm(t('categoryDeleteConfirm', { name: category }));
        if (!confirmed) return;
        categories = categories.filter(item => item !== category);
        allNotes.forEach(note => { if (note.category === category) note.category = ''; });
        await Promise.all([saveCategories(categories), saveNotes(allNotes)]);
        currentCategoryFilter = null;
        renderAllListState();
        showToast(t('categoryDeleted'), 'success');
      });
      els.categoriesList.appendChild(item);
    });
  }

  function renderTagsSidebar() {
    els.tagsList.innerHTML = '';
    const usage = new Map();
    scopedNotes().forEach(note => {
      (note.tags || []).forEach(tag => usage.set(tag, (usage.get(tag) || 0) + 1));
    });

    [...usage.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).forEach(([tag, count]) => {
      const item = document.createElement('div');
      item.className = `cn-tag-item ${currentTagFilter === tag ? 'active' : ''}`;
      item.innerHTML = `<span class="cn-tag">${escapeHtml(tag)}</span><span class="cn-nav-count">${count}</span>`;
      item.addEventListener('click', () => {
        currentTagFilter = currentTagFilter === tag ? null : tag;
        currentCategoryFilter = null;
        renderAllListState();
      });
      els.tagsList.appendChild(item);
    });
  }

  function getFilteredNotes() {
    let notes = scopedNotes();
    if (currentCategoryFilter) notes = notes.filter(note => note.category === currentCategoryFilter);
    if (currentTagFilter) notes = notes.filter(note => (note.tags || []).includes(currentTagFilter));

    const query = (els.listSearch.value || els.globalSearch.value).trim();
    if (query) notes = filterNotes(notes, query);

    notes.sort((a, b) => {
      if (sortMode === 'created-desc') return (b.createdAt || 0) - (a.createdAt || 0);
      if (sortMode === 'title-asc') return (a.title || '').localeCompare(b.title || '');
      if (sortMode === 'title-desc') return (b.title || '').localeCompare(a.title || '');
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

    return notes;
  }

  function renderNotesList() {
    const notes = getFilteredNotes();
    els.notesGrid.innerHTML = '';
    els.notesGrid.classList.remove('timeline-mode');
    els.notesGrid.classList.add('overview-mode');

    if (!notes.length) {
      els.listEmpty.classList.remove('cn-hidden');
      return;
    }

    els.listEmpty.classList.add('cn-hidden');
    renderOverviewNotes(notes);
  }

  function getLocalizedTimelineLabel(key) {
    const labels = {
      today: isFa() ? 'امروز' : 'Today',
      yesterday: isFa() ? 'دیروز' : 'Yesterday',
      this_week: isFa() ? 'این هفته' : 'This Week',
      this_month: isFa() ? 'این ماه' : 'This Month',
      older: isFa() ? 'قدیمی‌تر' : 'Older'
    };
    return labels[key] || (isFa() ? 'قدیمی‌تر' : 'Older');
  }

  function renderOverviewNotes(notes) {
    getTimelineGroups(notes, (items) => items).forEach(group => {
      const section = document.createElement('section');
      section.className = 'cn-overview-group';
      section.innerHTML = `
        <div class="cn-timeline-heading">
          <div>
            <h3>${escapeHtml(getLocalizedTimelineLabel(group.key))}</h3>
            <p>${group.notes.length} ${group.notes.length === 1 ? t('note') : t('notes')}</p>
          </div>
        </div>
      `;
      const list = document.createElement('div');
      list.className = 'cn-overview-list';
      group.notes.forEach(note => list.appendChild(buildNoteCard(note)));
      section.appendChild(list);
      els.notesGrid.appendChild(section);
    });
  }

  function buildNoteCard(note) {
    const card = document.createElement('div');
    const noteLocked = isProtected(note) && !unlockedNotes.has(note.id);
    const workspace = getNoteWorkspace(note, workspaces);
    const colorStyle = NOTE_COLORS[note.color] || NOTE_COLORS.blue;
    const preview = noteLocked
      ? t('previewHidden')
      : escapeHtml((note.content || '').replace(/#/g, '').replace(/\n/g, ' ').slice(0, 140)) || t('untitled');
    const badges = [];
    if (workspace) badges.push(`<span class="cn-label cn-workspace-badge">${escapeHtml(workspaceLabel(workspace))}</span>`);
    if (note.category) badges.push(`<span class="cn-label" style="background:${colorStyle.bg};color:${colorStyle.text};border:1px solid ${colorStyle.border}">${escapeHtml(note.category)}</span>`);
    if (note.tags?.length) badges.push(...note.tags.slice(0, 4).map(tag => `<span class="cn-tag">${escapeHtml(tag)}</span>`));

    card.className = `cn-note-item cn-animate-fade ${noteLocked ? 'locked' : ''}`;
    card.style.borderTop = `4px solid ${colorStyle.border}`;
    card.style.boxShadow = `0 8px 20px ${colorStyle.bg}`;
    card.innerHTML = `
      <div class="cn-note-header">
        <div class="cn-note-title-wrap">
          <h3 class="cn-note-title" dir="auto">${escapeHtml(note.title || t('untitled'))}</h3>
          ${isProtected(note) ? '<span class="cn-note-lock-icon" title="Locked">🔒</span>' : ''}
          ${note.isPinned ? '<span class="cn-note-source-icon" title="Pinned">📌</span>' : ''}
          ${note.isFavorite ? '<span class="cn-note-source-icon" title="Favorite">⭐</span>' : ''}
          ${note.source?.type === 'context-menu' ? `<span class="cn-note-source-icon" title="${escapeHtml(t('savedFromWeb'))}">🌐</span>` : ''}
        </div>
        <div class="cn-note-actions">
          <button class="cn-action-btn" data-action="copy" type="button">📋</button>
          <button class="cn-action-btn" data-action="edit" type="button">✏️</button>
          <button class="cn-action-btn danger" data-action="delete" type="button">🗑</button>
        </div>
      </div>
      <div class="cn-note-preview" dir="auto">${preview}</div>
      <div class="cn-note-meta">
        <span>${localRelativeDate(note.updatedAt)}</span>
        <span>•</span>
        <span>${(note.content || '').length} ${t('chars')}</span>
      </div>
      ${badges.length ? `<div class="cn-note-badges">${badges.join('')}</div>` : ''}
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.cn-note-actions')) return;
      openEditor(note.id);
    });

    card.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
      e.stopPropagation();
      if (noteLocked) return showToast(t('unlockFirst'), 'warning');
      copyToClipboard(`${note.title}\n\n${note.content}`, e.currentTarget);
    });
    card.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
      e.stopPropagation();
      openEditor(note.id);
    });
    card.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
      e.stopPropagation();
      currentNoteId = note.id;
      els.deleteModal.classList.remove('cn-hidden');
    });
    return card;
  }

  function updateCounts() {
    document.getElementById('count-all').textContent = allNotes.length;
    els.settingsNoteCount.textContent = allNotes.length;
  }

  async function createNewNote() {
    if (currentView === 'edit' && isDirty) await saveCurrentNote(false);
    const workspaceId = currentScope === 'all' ? (settings.currentWorkspaceId || workspaces[0]?.id || DEFAULT_WORKSPACE_ID) : currentScope;
    const note = createNote({
      title: '',
      content: '',
      color: settings.defaultColor || 'blue',
      category: currentCategoryFilter || '',
      workspaceId,
      tags: currentTagFilter ? [currentTagFilter] : []
    }, workspaces);
    allNotes.unshift(note);
    await saveNotes(allNotes);
    currentNoteId = note.id;
    unlockedNotes.add(note.id);
    isDirty = false;
    updateCounts();
    await openEditor(note.id);
    showToast(t('newNoteCreated'), 'success');
  }

  async function openEditor(id) {
    await refreshState();
    const note = findNote(id);
    if (!note) {
      showToast(t('noteNotFound'), 'error');
      await showView('list');
      return;
    }
    if (isProtected(note) && !unlockedNotes.has(note.id)) {
      openUnlockModal(note, async () => {
        unlockedNotes.add(note.id);
        await openEditor(note.id);
      });
      return;
    }
    fillEditor(note);
    isDirty = false;
    await showView('edit');
  }

  function fillEditor(note) {
    currentNoteId = note.id;
    els.noteTitle.value = note.title || '';
    els.noteContent.value = note.content || '';
    els.noteCreated.textContent = `${t('created')}: ${localDate(note.createdAt)}`;
    els.noteUpdated.textContent = `${t('updated')}: ${localDate(note.updatedAt)}`;
    els.noteChars.textContent = `${(note.content || '').length} ${t('chars')}`;
    els.autoSaveStatus.textContent = '';
    populateCategorySelect();
    renderWorkspaceSelectors();
    renderTagSuggestionsDataList();
    els.noteWorkspace.value = note.workspaceId || DEFAULT_WORKSPACE_ID;
    els.noteCategory.value = note.category || '';
    els.noteTags.value = formatTagsInput(note.tags);
    setSelectedColor(note.color || settings.defaultColor || 'blue');
    els.notePin.checked = !!note.isPinned;
    els.noteFavorite.checked = !!note.isFavorite;
    updatePreview();
    updateCharCount();
    renderQuickTagPanel();
    renderSuggestionPanel();
    renderLockState();
    renderSourceMeta(note);
    pushEditorHistory(getCurrentNoteValues(), true);
  }

  function getCurrentNoteValues() {
    return {
      id: currentNoteId,
      title: els.noteTitle.value.trim() || truncateText(els.noteContent.value.split('\n').find(Boolean) || '', 60) || t('untitled'),
      content: els.noteContent.value,
      workspaceId: els.noteWorkspace.value || DEFAULT_WORKSPACE_ID,
      category: els.noteCategory.value || '',
      tags: parseTagsInput(els.noteTags.value),
      color: getSelectedColor(),
      isPinned: els.notePin.checked,
      isFavorite: els.noteFavorite.checked
    };
  }

  function areEditorStatesEqual(a, b) {
    return JSON.stringify(a || {}) === JSON.stringify(b || {});
  }

  function pushEditorHistory(state = null, reset = false) {
    const snapshot = state || getCurrentNoteValues();
    if (reset) {
      editorHistory = [snapshot];
      editorHistoryIndex = 0;
      updateUndoButtonState();
      return;
    }
    if (editorHistoryIndex >= 0 && areEditorStatesEqual(editorHistory[editorHistoryIndex], snapshot)) {
      updateUndoButtonState();
      return;
    }
    editorHistory = editorHistory.slice(0, editorHistoryIndex + 1);
    editorHistory.push(snapshot);
    if (editorHistory.length > 100) {
      editorHistory.shift();
    }
    editorHistoryIndex = editorHistory.length - 1;
    updateUndoButtonState();
  }

  function clearEditorHistory() {
    clearTimeout(historyTimer);
    editorHistory = [];
    editorHistoryIndex = -1;
    updateUndoButtonState();
  }

  function queueHistoryCapture() {
    clearTimeout(historyTimer);
    historyTimer = setTimeout(() => {
      if (currentView === 'edit' && currentNoteId) {
        pushEditorHistory();
      }
    }, 180);
  }

  function flushPendingHistoryCapture() {
    clearTimeout(historyTimer);
    if (currentView === 'edit' && currentNoteId) {
      pushEditorHistory();
    }
  }

  function applyEditorState(state, markAsDirty = true) {
    if (!state) return;
    applyingHistoryState = true;
    els.noteTitle.value = state.title || '';
    els.noteContent.value = state.content || '';
    els.noteWorkspace.value = state.workspaceId || DEFAULT_WORKSPACE_ID;
    els.noteCategory.value = state.category || '';
    els.noteTags.value = formatTagsInput(state.tags || []);
    setSelectedColor(state.color || settings.defaultColor || 'blue');
    els.notePin.checked = !!state.isPinned;
    els.noteFavorite.checked = !!state.isFavorite;
    updatePreview();
    updateCharCount();
    renderQuickTagPanel();
    renderSuggestionPanel();
    applyingHistoryState = false;
    if (markAsDirty) markDirty();
  }

  function undoEditorChange() {
    if (editorHistoryIndex <= 0) return;
    editorHistoryIndex -= 1;
    const snapshot = editorHistory[editorHistoryIndex];
    applyEditorState(snapshot, true);
    updateUndoButtonState();
    scheduleAutoSave();
  }

  function updateUndoButtonState() {
    if (!els.btnUndo) return;
    els.btnUndo.disabled = editorHistoryIndex <= 0;
  }

  async function saveCurrentNote(manual = false) {
    if (!currentNoteId) return;
    const existing = findNote();
    if (!existing) return;
    if (!isDirty) {
      if (manual) showToast(t('nothingToSave'), 'info');
      return;
    }

    flushPendingHistoryCapture();
    const values = getCurrentNoteValues();
    const index = allNotes.findIndex(note => note.id === currentNoteId);
    if (index === -1) return;

    allNotes[index] = createNote({
      ...existing,
      ...values,
      createdAt: existing.createdAt,
      updatedAt: Date.now(),
      lock: existing.lock,
      source: existing.source,
      ignoredSuggestedTags: existing.ignoredSuggestedTags
    }, workspaces);

    await Promise.all([
      saveNotes(allNotes),
      mergeCustomTags(allNotes[index].tags)
    ]);

    isDirty = false;
    customTags = await getCustomTags();
    els.autoSaveStatus.textContent = manual ? t('saved') : t('autosaved');
    els.noteUpdated.textContent = `${t('updated')}: ${localDate(allNotes[index].updatedAt)}`;
    pushEditorHistory(getCurrentNoteValues());
    renderAllListState();
    renderQuickTagPanel();
    renderSuggestionPanel();
    renderLockState();
    renderSourceMeta(allNotes[index]);
    if (manual) showToast(t('saveSuccess'), 'success');
  }

  function markDirty() {
    isDirty = true;
    els.autoSaveStatus.textContent = t('changesUnsaved');
  }

  function scheduleAutoSave() {
    if (!settings.autoSave) return;
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => saveCurrentNote(false), 800);
  }

  async function duplicateCurrentNote() {
    const note = findNote();
    if (!note) return;
    const duplicate = createNote({
      ...note,
      id: undefined,
      title: `${note.title || t('untitled')} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }, workspaces);
    allNotes.unshift(duplicate);
    await saveNotes(allNotes);
    unlockedNotes.add(duplicate.id);
    currentNoteId = duplicate.id;
    updateCounts();
    await openEditor(duplicate.id);
    showToast(t('noteDuplicated'), 'success');
  }

  async function deleteCurrentNote() {
    allNotes = allNotes.filter(note => note.id !== currentNoteId);
    await saveNotes(allNotes);
    unlockedNotes.delete(currentNoteId);
    currentNoteId = null;
    isDirty = false;
    closeDeleteModal();
    showToast(t('noteDeleted'), 'success');
    await showView('list');
  }

  function closeDeleteModal() {
    els.deleteModal.classList.add('cn-hidden');
  }

  function parseTagsInput(value) {
    return normalizeTags(value);
  }

  function formatTagsInput(tags) {
    return normalizeTags(tags).join(', ');
  }

  function renderTagSuggestionsDataList() {
    els.tagSuggestionsList.innerHTML = '';
    getTagCatalog(allNotes, customTags).forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      els.tagSuggestionsList.appendChild(option);
    });
  }

  function renderQuickTagPanel() {
    const activeTags = parseTagsInput(els.noteTags.value);
    const quickTags = getQuickTagList(allNotes, customTags).slice(0, 18);
    els.noteQuickTags.innerHTML = '';
    if (!quickTags.length) {
      els.noteQuickTags.innerHTML = `<span class="cn-text-sm cn-text-muted">${t('noTagsYet')}</span>`;
      return;
    }
    quickTags.forEach(tag => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `cn-chip-btn ${activeTags.includes(tag) ? 'active' : ''}`;
      button.textContent = tag;
      button.addEventListener('click', () => {
        toggleTagInInput(tag, els.noteTags);
        markDirty();
        renderQuickTagPanel();
        renderSuggestionPanel();
        scheduleAutoSave();
      });
      els.noteQuickTags.appendChild(button);
    });
  }

  function currentSuggestions() {
    const note = findNote();
    return suggestTags(`${els.noteTitle.value}\n${els.noteContent.value}`, parseTagsInput(els.noteTags.value), note?.ignoredSuggestedTags || []);
  }

  function renderSuggestionPanel() {
    const note = findNote();
    const suggestions = currentSuggestions();
    els.noteSuggestedTags.innerHTML = '';
    if (!suggestions.length) {
      els.noteSuggestedTags.innerHTML = `<span class="cn-text-sm cn-text-muted">${t('suggestionsEmpty')}</span>`;
      return;
    }
    suggestions.forEach(tag => {
      const item = document.createElement('div');
      item.className = 'cn-suggestion-item';
      item.innerHTML = `
        <span class="cn-tag">${escapeHtml(tag)}</span>
        <div class="cn-inline-actions">
          <button class="cn-btn cn-btn-ghost cn-btn-sm" data-action="accept" type="button">${t('acceptAll')}</button>
          <button class="cn-btn cn-btn-ghost cn-btn-sm" data-action="ignore" type="button">${t('cancel')}</button>
        </div>
      `;
      item.querySelector('[data-action="accept"]').addEventListener('click', () => {
        addTagToInput(tag, els.noteTags);
        markDirty();
        renderQuickTagPanel();
        renderSuggestionPanel();
        scheduleAutoSave();
      });
      item.querySelector('[data-action="ignore"]').addEventListener('click', () => {
        if (!note) return;
        note.ignoredSuggestedTags = normalizeTags([...(note.ignoredSuggestedTags || []), tag]);
        markDirty();
        renderSuggestionPanel();
        scheduleAutoSave();
      });
      els.noteSuggestedTags.appendChild(item);
    });
  }

  function addTagToInput(tag, input) {
    input.value = formatTagsInput([...parseTagsInput(input.value), tag]);
  }

  function toggleTagInInput(tag, input) {
    const current = parseTagsInput(input.value);
    input.value = formatTagsInput(current.includes(tag) ? current.filter(item => item !== tag) : [...current, tag]);
  }

  async function addCustomTagFromPrompt() {
    const value = prompt(t('enterTagName'));
    const tag = normalizeTag(value || '');
    if (!tag) return;
    customTags = normalizeTags([...customTags, tag]);
    await saveCustomTags(customTags);
    addTagToInput(tag, els.noteTags);
    markDirty();
    renderTagSuggestionsDataList();
    renderQuickTagPanel();
    renderSuggestionPanel();
    showToast(t('customTagAdded'), 'success');
  }

  function applyAllSuggestedTags() {
    const suggestions = currentSuggestions();
    if (!suggestions.length) return showToast(t('suggestionsEmpty'), 'info');
    els.noteTags.value = formatTagsInput([...parseTagsInput(els.noteTags.value), ...suggestions]);
    markDirty();
    renderQuickTagPanel();
    renderSuggestionPanel();
    scheduleAutoSave();
  }

  function mergeSuggestionsIntoInput() {
    els.noteTags.value = formatTagsInput([...parseTagsInput(els.noteTags.value), ...currentSuggestions()]);
    els.noteTags.focus();
    markDirty();
    renderQuickTagPanel();
    renderSuggestionPanel();
    scheduleAutoSave();
  }

  function renderColorOptions() {
    els.noteColorOptions.innerHTML = '';
    Object.entries(NOTE_COLORS).forEach(([key, color]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cn-color-option';
      button.style.background = color.border;
      button.title = color.name;
      button.dataset.color = key;
      button.addEventListener('click', () => {
        setSelectedColor(key);
        markDirty();
        scheduleAutoSave();
      });
      els.noteColorOptions.appendChild(button);
    });
  }

  function renderSettingColorOptions() {
    els.settingDefaultColor.innerHTML = '';
    Object.entries(NOTE_COLORS).forEach(([key, color]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cn-color-option';
      button.style.background = color.border;
      button.title = color.name;
      button.dataset.color = key;
      button.addEventListener('click', () => {
        document.querySelectorAll('#setting-default-color .cn-color-option').forEach(item => item.classList.remove('selected'));
        button.classList.add('selected');
        saveSettingsFromUI();
      });
      els.settingDefaultColor.appendChild(button);
    });
  }

  function setSelectedColor(color) {
    document.querySelectorAll('#note-color-options .cn-color-option').forEach(button => {
      button.classList.toggle('selected', button.dataset.color === color);
    });
  }

  function getSelectedColor() {
    return document.querySelector('#note-color-options .cn-color-option.selected')?.dataset.color || settings.defaultColor || 'blue';
  }

  function populateCategorySelect() {
    const current = els.noteCategory.value;
    els.noteCategory.innerHTML = `<option value="">${t('noCategory')}</option>`;
    const available = categories.includes(current) || !current ? categories : [...categories, current];
    available.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      els.noteCategory.appendChild(option);
    });
    els.noteCategory.value = current || '';
  }

  function updatePreview() {
    els.notePreview.innerHTML = parseMarkdown(els.noteContent.value);
  }

  function updateCharCount() {
    els.noteChars.textContent = `${els.noteContent.value.length} ${t('chars')}`;
  }

  function renderSourceMeta(note) {
    if (!note?.source?.pageUrl) {
      els.noteSourceMeta.textContent = t('sourceNone');
      return;
    }
    els.noteSourceMeta.innerHTML = `
      <div><strong>${t('source')}:</strong> ${escapeHtml(note.source.pageTitle || t('savedFromWeb'))}</div>
      <div><a href="${escapeHtml(note.source.pageUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(note.source.pageUrl)}</a></div>
      <div>${t('captured')}: ${localDate(note.source.capturedAt)}</div>
    `;
  }

  function isProtected(note) {
    return isNoteLocked(note);
  }

  function renderRecoveryPanel() {
    const note = findNote();
    const recovery = note?.lock?.recovery || null;
    els.recoveryQuestion.value = recovery?.question || '';
    els.recoveryAnswer.value = '';
    els.btnClearRecovery.classList.toggle('cn-hidden', !recovery);
  }

  function renderLockState() {
    const note = findNote();
    if (!note) return;
    const locked = isProtected(note);
    els.noteLockBadge.textContent = locked ? t('locked') : t('unlocked');
    els.noteLockBadge.className = locked ? 'cn-lock-badge locked' : 'cn-lock-badge';
    els.lockStatusText.textContent = locked
      ? (note.lock.type === 'pin' ? t('protectedByPin') : t('protectedByPassword'))
      : t('notLocked');

    els.btnLockNote.classList.toggle('cn-hidden', locked);
    els.btnChangeLock.classList.toggle('cn-hidden', !locked);
    els.btnRemoveLock.classList.toggle('cn-hidden', !locked);
    els.btnRecoveryToggle.classList.toggle('cn-hidden', !locked);
    if (!locked) {
      els.noteRecoveryPanel.classList.add('cn-hidden');
    }
    renderRecoveryPanel();
  }

  function openLockModal(mode = 'create') {
    const note = findNote();
    if (!note) return;
    lockModalMode = mode;
    els.lockModalTitle.textContent = mode === 'change' ? t('changeLock') : t('lockNote');
    els.lockType.value = note.lock?.type || 'password';
    els.lockSecret.value = '';
    els.lockConfirmSecret.value = '';
    els.lockSecret.type = 'password';
    els.lockConfirmSecret.type = 'password';
    updateLockModalPlaceholder();
    els.lockModal.classList.remove('cn-hidden');
    els.lockSecret.focus();
  }

  function updateLockModalPlaceholder() {
    const pinMode = els.lockType.value === 'pin';
    els.lockSecret.placeholder = pinMode ? t('secretPlaceholder') : t('secretPlaceholder');
    els.lockConfirmSecret.placeholder = t('confirmPlaceholder');
    els.lockSecret.inputMode = pinMode ? 'numeric' : 'text';
    els.lockConfirmSecret.inputMode = pinMode ? 'numeric' : 'text';
  }

  function closeLockModal() {
    els.lockModal.classList.add('cn-hidden');
    els.lockSecret.value = '';
    els.lockConfirmSecret.value = '';
  }

  function toggleRecoveryPanel() {
    els.noteRecoveryPanel.classList.toggle('cn-hidden');
    if (!els.noteRecoveryPanel.classList.contains('cn-hidden')) {
      renderRecoveryPanel();
      els.recoveryQuestion.focus();
    }
  }

  async function saveRecoveryQuestion() {
    const note = findNote();
    if (!note || !isProtected(note)) return;
    try {
      note.lock.recovery = await createRecoveryData(els.recoveryQuestion.value, els.recoveryAnswer.value);
      isDirty = true;
      await saveCurrentNote(true);
      renderRecoveryPanel();
      showToast(t('recoverySaved'), 'success');
    } catch (error) {
      showToast(error.message || t('recoveryFailed'), 'error');
    }
  }

  async function clearRecoveryQuestion() {
    const note = findNote();
    if (!note || !isProtected(note)) return;
    note.lock.recovery = null;
    isDirty = true;
    await saveCurrentNote(true);
    renderRecoveryPanel();
    showToast(t('recoveryCleared'), 'success');
  }

  async function saveLockFromModal() {
    const note = findNote();
    if (!note) return;
    const type = els.lockType.value;
    const secret = els.lockSecret.value;
    const confirmSecret = els.lockConfirmSecret.value;
    if (!secret || secret !== confirmSecret) {
      showToast(t('invalidSecret'), 'error');
      return;
    }
    try {
      note.lock = await createNoteLock(type, secret);
      unlockedNotes.add(note.id);
      isDirty = true;
      closeLockModal();
      await saveCurrentNote(true);
      renderLockState();
      showToast(lockModalMode === 'change' ? t('lockChanged') : t('noteLocked'), 'success');
    } catch (error) {
      showToast(error.message || t('invalidSecret'), 'error');
    }
  }

  async function removeCurrentLock() {
    const note = findNote();
    if (!note || !isProtected(note)) return;
    if (!confirm(t('confirmRemoveLock'))) return;
    note.lock = { enabled: false, type: null, salt: '', hash: '' };
    unlockedNotes.delete(note.id);
    isDirty = true;
    await saveCurrentNote(true);
    renderLockState();
    showToast(t('lockRemoved'), 'success');
  }

  async function relockCurrentNoteSession() {
    const note = findNote();
    if (!note || !isProtected(note)) return;
    unlockedNotes.delete(note.id);
    showToast(t('noteRelocked'), 'info');
    await showView('list');
  }

  function openUnlockModal(note, callback = null) {
    unlockTargetNoteId = note.id;
    unlockSuccessCallback = callback;
    unlockRecoveryMode = false;
    els.unlockModalTitle.textContent = t('unlockNote');
    els.unlockModalText.textContent = note.lock?.type === 'pin'
      ? (isFa() ? 'پین ۴ رقمی این یادداشت را وارد کنید.' : 'Enter the 4-digit PIN to view this note.')
      : t('unlockWithPassword');
    els.unlockSecret.value = '';
    els.unlockSecret.type = 'password';
    els.unlockSecret.inputMode = note.lock?.type === 'pin' ? 'numeric' : 'text';
    els.unlockRecoveryAnswer.value = '';
    els.unlockRecoveryQuestion.textContent = hasRecoveryQuestion(note) ? note.lock.recovery.question : t('recoveryUnavailable');
    els.unlockRecoveryPanel.classList.add('cn-hidden');
    els.unlockModal.classList.remove('cn-hidden');
    els.unlockSecret.focus();
  }

  function closeUnlockModal() {
    unlockTargetNoteId = null;
    unlockSuccessCallback = null;
    unlockRecoveryMode = false;
    els.unlockSecret.value = '';
    els.unlockSecret.type = 'password';
    els.unlockRecoveryAnswer.value = '';
    els.unlockRecoveryPanel.classList.add('cn-hidden');
    els.unlockModal.classList.add('cn-hidden');
  }

  async function handleRecoveryUnlock() {
    const note = findNote(unlockTargetNoteId);
    if (!note) return closeUnlockModal();
    if (!hasRecoveryQuestion(note)) {
      showToast(t('recoveryUnavailable'), 'warning');
      return;
    }
    if (els.unlockRecoveryPanel.classList.contains('cn-hidden')) {
      unlockRecoveryMode = true;
      els.unlockRecoveryPanel.classList.remove('cn-hidden');
      els.unlockRecoveryAnswer.focus();
      return;
    }
    const valid = await verifyRecoveryAnswer(note, els.unlockRecoveryAnswer.value);
    if (!valid) return showToast(t('recoveryFailed'), 'error');
    unlockedNotes.add(note.id);
    const callback = unlockSuccessCallback;
    closeUnlockModal();
    showToast(t('recoverySuccess'), 'success');
    if (callback) await callback();
  }

  async function confirmUnlock() {
    const note = findNote(unlockTargetNoteId);
    if (!note) return closeUnlockModal();

    if (!els.unlockRecoveryPanel.classList.contains('cn-hidden') && els.unlockRecoveryAnswer.value.trim()) {
      const validRecovery = await verifyRecoveryAnswer(note, els.unlockRecoveryAnswer.value);
      if (!validRecovery) return showToast(t('recoveryFailed'), 'error');
      unlockedNotes.add(note.id);
      const recoveryCallback = unlockSuccessCallback;
      closeUnlockModal();
      showToast(t('recoverySuccess'), 'success');
      if (recoveryCallback) await recoveryCallback();
      return;
    }

    const valid = await verifyNoteSecret(note, els.unlockSecret.value);
    if (!valid) return showToast(t('invalidSecret'), 'error');
    unlockedNotes.add(note.id);
    const callback = unlockSuccessCallback;
    closeUnlockModal();
    showToast(t('noteUnlocked'), 'success');
    if (callback) await callback();
  }

  function togglePasswordField(input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  function loadSettingsUI() {
    els.settingDarkMode.checked = settings.darkMode;
    els.settingTheme.value = settings.theme;
    els.settingFontSize.value = settings.fontSize;
    els.fontSizeValue.textContent = `${settings.fontSize}px`;
    els.settingAnimations.checked = settings.animations;
    els.settingAutoSave.checked = settings.autoSave;
    els.settingLanguage.value = settings.language || 'en';
    document.querySelectorAll('#setting-default-color .cn-color-option').forEach(button => {
      button.classList.toggle('selected', button.dataset.color === settings.defaultColor);
    });
  }

  async function saveSettingsFromUI() {
    const selectedDefaultColor = document.querySelector('#setting-default-color .cn-color-option.selected')?.dataset.color || 'blue';
    settings = {
      ...settings,
      darkMode: els.settingDarkMode.checked,
      theme: els.settingTheme.value,
      fontSize: parseInt(els.settingFontSize.value, 10),
      animations: els.settingAnimations.checked,
      autoSave: els.settingAutoSave.checked,
      defaultColor: selectedDefaultColor,
      sidebarCollapsed: els.sidebar.classList.contains('collapsed'),
      currentWorkspaceId: currentScope === 'all' ? (settings.currentWorkspaceId || DEFAULT_WORKSPACE_ID) : currentScope,
      fullViewMode: listMode,
      popupViewMode: settings.popupViewMode || 'normal',
      language: els.settingLanguage.value
    };
    await saveSettings(settings);
    await applyTheme(settings);
    applyLocale();
    renderWorkspaceSelectors();
    renderWorkspacesSidebar();
    renderCategoriesSidebar();
    renderTagsSidebar();
    renderNotesList();
    renderTagSuggestionsDataList();
    if (currentView === 'edit' && currentNoteId) fillEditor(findNote(currentNoteId));
    showToast(t('settingsSaved'), 'success');
  }

  async function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const success = await importFromJson(file);
    if (success) {
      await refreshState();
      await applyTheme(settings);
      renderAllListState();
      loadSettingsUI();
    }
    e.target.value = '';
  }

  async function clearAllData() {
    if (!confirm(t('clearConfirm'))) return;
    await chrome.storage.local.set({
      [STORAGE_KEYS.NOTES]: [],
      [STORAGE_KEYS.CATEGORIES]: DEFAULT_CATEGORIES,
      [STORAGE_KEYS.WORKSPACES]: DEFAULT_WORKSPACES,
      [STORAGE_KEYS.CUSTOM_TAGS]: [],
      [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS
    });
    allNotes = [];
    categories = [...DEFAULT_CATEGORIES];
    workspaces = DEFAULT_WORKSPACES.map(createWorkspace);
    customTags = [];
    settings = { ...DEFAULT_SETTINGS };
    currentScope = 'all';
    currentCategoryFilter = null;
    currentTagFilter = null;
    currentNoteId = null;
    isDirty = false;
    unlockedNotes.clear();
    clearEditorHistory();
    listMode = 'overview';
    await applyTheme(settings);
    renderAllListState();
    loadSettingsUI();
    await showView('list');
    showToast(t('dataCleared'), 'success');
  }

  async function setListMode(mode) {
    listMode = 'overview';
    settings.fullViewMode = 'overview';
    await saveSettings({ ...settings, fullViewMode: 'overview' });
    applyListModeUI();
    renderNotesList();
  }

  function applyListModeUI() {
    els.btnOverviewView.classList.toggle('active', true);
  }

  function openWorkspaceModal(workspaceId = null) {
    editingWorkspaceId = workspaceId;
    const workspace = workspaces.find(item => item.id === workspaceId);
    els.workspaceModalTitle.textContent = workspace ? t('renameWorkspaceTitle') : t('addWorkspaceTitle');
    els.workspaceInput.placeholder = t('workspacePlaceholder');
    els.workspaceInput.value = workspace?.name || '';
    els.workspaceModal.classList.remove('cn-hidden');
    els.workspaceInput.focus();
  }

  function closeWorkspaceModal() {
    editingWorkspaceId = null;
    els.workspaceModal.classList.add('cn-hidden');
  }

  async function saveWorkspaceFromModal() {
    const name = els.workspaceInput.value.trim();
    if (!name) return showToast(t('workspaceRequired'), 'error');
    if (workspaces.some(item => item.name.toLowerCase() === name.toLowerCase() && item.id !== editingWorkspaceId)) {
      return showToast(t('workspaceExists'), 'error');
    }
    if (editingWorkspaceId) {
      workspaces = workspaces.map(workspace => workspace.id === editingWorkspaceId ? { ...workspace, name } : workspace);
      showToast(t('workspaceUpdated'), 'success');
    } else {
      workspaces.push(createWorkspace({ name }));
      showToast(t('workspaceAdded'), 'success');
    }
    await saveWorkspaces(workspaces);
    closeWorkspaceModal();
    await refreshState();
    renderAllListState();
  }

  async function deleteWorkspace(workspaceId) {
    if (workspaces.length <= 1) return showToast(t('atLeastOneWorkspace'), 'warning');
    const workspace = workspaces.find(item => item.id === workspaceId);
    const fallback = workspaces.find(item => item.id !== workspaceId);
    if (!workspace || !fallback) return;
    const confirmed = confirm(t('workspaceDeleteConfirm', { name: workspace.name, fallback: workspaceLabel(fallback) }));
    if (!confirmed) return;

    workspaces = workspaces.filter(item => item.id !== workspaceId);
    allNotes = allNotes.map(note => note.workspaceId === workspaceId ? { ...note, workspaceId: fallback.id, updatedAt: Date.now() } : note);
    if (settings.currentWorkspaceId === workspaceId) settings.currentWorkspaceId = fallback.id;
    if (currentScope === workspaceId) currentScope = 'all';

    await Promise.all([
      saveWorkspaces(workspaces),
      saveNotes(allNotes),
      saveSettings({ ...settings })
    ]);
    renderAllListState();
    showToast(t('workspaceDeleted'), 'success');
  }

  function openCategoryModal(categoryName = null) {
    editingCategory = categoryName;
    els.categoryModalTitle.textContent = categoryName ? t('editCategoryTitle') : t('addCategoryTitle');
    els.categoryInput.placeholder = t('categoryPlaceholder');
    els.categoryInput.value = categoryName || '';
    els.categoryModal.classList.remove('cn-hidden');
    els.categoryInput.focus();
  }

  function closeCategoryModal() {
    editingCategory = null;
    els.categoryModal.classList.add('cn-hidden');
  }

  async function saveCategoryFromModal() {
    const name = els.categoryInput.value.trim();
    if (!name) return showToast(t('categoryRequired'), 'error');
    if (categories.includes(name) && name !== editingCategory) return showToast(t('categoryExists'), 'error');
    if (editingCategory) {
      const index = categories.indexOf(editingCategory);
      if (index !== -1) categories[index] = name;
      allNotes.forEach(note => { if (note.category === editingCategory) note.category = name; });
      await saveNotes(allNotes);
      if (currentCategoryFilter === editingCategory) currentCategoryFilter = name;
      showToast(t('categoryUpdated'), 'success');
    } else {
      categories.push(name);
      showToast(t('categoryAdded'), 'success');
    }
    await saveCategories(categories);
    closeCategoryModal();
    renderAllListState();
  }

  init();
})();
