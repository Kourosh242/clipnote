/**
 * popup.js - Popup کامل‌تر ClipNote با حفظ پایداری
 */

(function () {
  const {
    STORAGE_KEYS,
    DEFAULT_WORKSPACE_ID,
    NOTE_COLORS,
    getNotes,
    saveNotes,
    getSettings,
    saveSettings,
    getWorkspaces,
    getCategories,
    getCustomTags,
    saveCustomTags,
    getLastQuickSave,
    getUpdateInfo,
    checkForUpdates,
    GITHUB_REPO_URL,
    createNote,
    sortNotes,
    filterNotes,
    formatRelativeDate,
    escapeHtml,
    applyTheme,
    showToast,
    copyToClipboard,
    normalizeTag,
    normalizeTags,
    getTagCatalog,
    getQuickTagList,
    getTimelineGroups,
    suggestTags,
    mergeCustomTags,
    isNoteLocked,
    verifyNoteSecret,
    getNoteWorkspace,
    truncateText,
    migrateStorageData,
    parseMarkdown
  } = window.ClipNote;

  const I18N = {
    en: {
      new: 'New', openManager: 'Open Manager', search: 'Search notes... (Ctrl+F)',
      allNotes: 'All Notes', settings: 'Settings', noNotes: 'No notes found', noNotesSub: 'Create your first note to get started',
      quickSave: 'Quick Save', savedTo: 'saved to', overview: 'Overview', timeline: 'Timeline',
      updates: 'Check for Updates', updateNow: 'Update', newVersion: 'New Version Available', updatesChecking: 'Checking latest version...',
      updatesCurrent: 'You already have the latest version.', updatesUnknown: 'Unable to verify the latest version right now.',
      updatesPrivacy: 'Only a public version check is sent to GitHub. No notes or private user data are uploaded.', newBadge: 'New',
      all: 'All', pinned: 'Pinned', favorites: 'Favorites', quickNote: 'Quick Note',
      titlePlaceholder: 'Title / Topic', contentPlaceholder: 'Write your note here...', tagsPlaceholder: 'python, api, md',
      workspace: 'Workspace', category: 'Category', noCategory: 'No Category', tags: 'Tags', addTag: '+ Tag',
      quickTags: 'Quick Tags', suggestions: 'Suggested Tags', acceptAll: 'Accept All', color: 'Color',
      pin: 'Pin', favorite: 'Favorite', saveNote: 'Save Note', saveChanges: 'Save Changes',
      close: 'Close', copy: 'Copy', edit: 'Edit', delete: 'Delete', undo: 'Undo',
      editor: 'Editor', preview: 'Preview', unlockNote: 'Unlock Note', unlockHelp: 'Enter the password or PIN to unlock this note.',
      passwordOrPin: 'Password or PIN', deleted: 'Deleted Successfully', saved: 'Saved Successfully',
      pinnedAdded: 'Pinned', pinnedRemoved: 'Unpinned', favoriteAdded: 'Added to Favorites', favoriteRemoved: 'Removed from Favorites',
      unlockFirst: 'Unlock note first', invalidSecret: 'Invalid password or PIN', unlocked: 'Note unlocked',
      addTitleOrContent: 'Please enter a title or content', untitled: 'Untitled Note', note: 'note', notes: 'notes', chars: 'chars',
      previewHidden: '🔒 Preview hidden until unlocked', savedFromWeb: 'Saved from webpage', general: 'General', deleteConfirm: 'Delete this note?',
      noSuggestions: 'No suggestions yet.', noTagsYet: 'No tags yet.', customTagAdded: 'Custom tag added', enterTagName: 'Enter new tag name'
    },
    fa: {
      new: 'جدید', openManager: 'باز کردن مدیریت', search: 'جستجوی یادداشت‌ها... (Ctrl+F)',
      allNotes: 'همه یادداشت‌ها', settings: 'تنظیمات', noNotes: 'یادداشتی پیدا نشد', noNotesSub: 'اولین یادداشت خود را بسازید',
      quickSave: 'ذخیره سریع', savedTo: 'در این فضا ذخیره شد:', overview: 'نمای کلی', timeline: 'نمای زمانی',
      updates: 'بررسی بروزرسانی جدید', updateNow: 'بروزرسانی', newVersion: 'نسخه جدید موجود است', updatesChecking: 'در حال بررسی آخرین نسخه...',
      updatesCurrent: 'هم‌اکنون جدیدترین نسخه را دارید.', updatesUnknown: 'فعلاً امکان بررسی نسخه جدید وجود ندارد.',
      updatesPrivacy: 'فقط یک درخواست عمومی برای بررسی نسخه به GitHub ارسال می‌شود و هیچ یادداشت یا دادهٔ خصوصی کاربر ارسال نمی‌شود.', newBadge: 'جدید',
      all: 'همه', pinned: 'پین‌شده', favorites: 'علاقه‌مندی‌ها', quickNote: 'یادداشت سریع',
      titlePlaceholder: 'عنوان / موضوع', contentPlaceholder: 'یادداشت خود را اینجا بنویسید...', tagsPlaceholder: 'python, api, md',
      workspace: 'فضای کاری', category: 'دسته‌بندی', noCategory: 'بدون دسته‌بندی', tags: 'برچسب‌ها', addTag: '+ برچسب',
      quickTags: 'برچسب‌های سریع', suggestions: 'برچسب‌های پیشنهادی', acceptAll: 'افزودن همه', color: 'رنگ',
      pin: 'پین', favorite: 'علاقه‌مندی', saveNote: 'ذخیره یادداشت', saveChanges: 'ذخیره تغییرات',
      close: 'بستن', copy: 'کپی', edit: 'ویرایش', delete: 'حذف', undo: 'بازگشت',
      editor: 'ویرایشگر', preview: 'پیش‌نمایش', unlockNote: 'باز کردن یادداشت', unlockHelp: 'برای باز کردن این یادداشت رمز یا پین را وارد کنید.',
      passwordOrPin: 'رمز یا پین', deleted: 'یادداشت حذف شد', saved: 'یادداشت ذخیره شد',
      pinnedAdded: 'پین شد', pinnedRemoved: 'از پین خارج شد', favoriteAdded: 'به علاقه‌مندی‌ها اضافه شد', favoriteRemoved: 'از علاقه‌مندی‌ها حذف شد',
      unlockFirst: 'ابتدا یادداشت را باز کنید', invalidSecret: 'رمز یا پین نادرست است', unlocked: 'یادداشت باز شد',
      addTitleOrContent: 'لطفاً عنوان یا محتوا وارد کنید', untitled: 'یادداشت بدون عنوان', note: 'یادداشت', notes: 'یادداشت', chars: 'کاراکتر',
      previewHidden: '🔒 پیش‌نمایش تا زمان باز شدن مخفی است', savedFromWeb: 'ذخیره‌شده از وب', general: 'عمومی', deleteConfirm: 'این یادداشت حذف شود؟',
      noSuggestions: 'فعلاً پیشنهادی وجود ندارد.', noTagsYet: 'هنوز برچسبی وجود ندارد.', customTagAdded: 'برچسب سفارشی اضافه شد', enterTagName: 'نام برچسب جدید را وارد کنید'
    }
  };

  let allNotes = [];
  let workspaces = [];
  let categories = [];
  let customTags = [];
  let settings = {};
  let lastQuickSave = null;
  let currentWorkspaceFilter = 'all';
  let currentFilter = 'all';
  let currentViewMode = 'overview';
  const unlockedNotes = new Set();
  let unlockTargetNoteId = null;
  let unlockSuccessCallback = null;
  let currentViewingNoteId = null;
  let captureIgnoredSuggestions = [];
  let popupEditorIgnoredSuggestions = [];
  let popupEditorMode = 'editor';
  let popupEditorHistory = [];
  let popupEditorHistoryIndex = -1;
  let popupHistoryTimer = null;
  let applyingPopupHistory = false;

  const els = {
    listShell: document.getElementById('popup-list-shell'),
    quickCapture: document.getElementById('quick-capture'),

    search: document.getElementById('popup-search'),
    workspaceFilter: document.getElementById('popup-workspace-filter'),
    btnOverview: document.getElementById('btn-popup-overview'),
    btnTimeline: document.getElementById('btn-popup-timeline'),
    btnFilterAll: document.getElementById('btn-filter-all'),
    btnFilterPinned: document.getElementById('btn-filter-pinned'),
    btnFilterFavorites: document.getElementById('btn-filter-favorites'),
    notesList: document.getElementById('popup-notes-list'),
    empty: document.getElementById('popup-empty'),
    emptyTitle: document.getElementById('empty-title'),
    emptySubtitle: document.getElementById('empty-subtitle'),
    count: document.getElementById('popup-count'),
    settingsBtn: document.getElementById('btn-settings'),
    openManagerBtn: document.getElementById('btn-open-manager'),
    newNoteBtn: document.getElementById('btn-new-note'),
    newNoteLabel: document.getElementById('label-new-note'),
    popupUpdateBadge: document.getElementById('popup-update-badge'),

    quickSaveBanner: document.getElementById('quick-save-banner'),
    quickSaveBannerTitle: document.getElementById('quick-save-banner-title'),
    quickSaveBannerText: document.getElementById('quick-save-banner-text'),
    btnDismissQuickSave: document.getElementById('btn-dismiss-quick-save'),
    updateBanner: document.getElementById('popup-update-banner'),
    updateBannerTitle: document.getElementById('popup-update-banner-title'),
    updateBannerText: document.getElementById('popup-update-banner-text'),
    btnPopupCheckUpdates: document.getElementById('btn-popup-check-updates'),
    btnDismissUpdateBanner: document.getElementById('btn-dismiss-update-banner'),

    quickCaptureTitle: document.getElementById('quick-capture-title'),
    captureTitle: document.getElementById('capture-title'),
    captureContent: document.getElementById('capture-content'),
    captureWorkspace: document.getElementById('capture-workspace'),
    captureCategory: document.getElementById('capture-category'),
    captureTags: document.getElementById('capture-tags'),
    btnCaptureAddTag: document.getElementById('btn-capture-add-tag'),
    captureTagList: document.getElementById('popup-capture-tag-list'),
    captureQuickTagsTitle: document.getElementById('capture-quick-tags-title'),
    captureQuickTags: document.getElementById('capture-quick-tags'),
    captureSuggestionsTitle: document.getElementById('capture-suggestions-title'),
    btnCaptureAcceptAll: document.getElementById('btn-capture-accept-all'),
    captureSuggestions: document.getElementById('capture-suggestions'),
    captureColorTitle: document.getElementById('capture-color-title'),
    captureColorOptions: document.getElementById('capture-color-options'),
    capturePin: document.getElementById('capture-pin'),
    captureFavorite: document.getElementById('capture-favorite'),
    capturePinLabel: document.getElementById('capture-pin-label'),
    captureFavoriteLabel: document.getElementById('capture-favorite-label'),
    captureChars: document.getElementById('capture-chars'),
    btnSaveCapture: document.getElementById('btn-save-capture'),
    btnCancelCapture: document.getElementById('btn-cancel-capture'),

    unlockModal: document.getElementById('popup-unlock-modal'),
    unlockTitle: document.getElementById('popup-unlock-title'),
    unlockText: document.getElementById('popup-unlock-text'),
    unlockSecret: document.getElementById('popup-unlock-secret'),
    btnToggleUnlockSecret: document.getElementById('btn-popup-toggle-secret'),
    btnCancelUnlock: document.getElementById('btn-popup-cancel-unlock'),
    btnConfirmUnlock: document.getElementById('btn-popup-confirm-unlock'),

    noteModal: document.getElementById('popup-note-modal'),
    noteTitle: document.getElementById('popup-note-title'),
    noteMeta: document.getElementById('popup-note-meta'),
    noteSource: document.getElementById('popup-note-source'),
    noteEditTitle: document.getElementById('popup-note-edit-title'),
    noteWorkspace: document.getElementById('popup-note-workspace'),
    noteCategory: document.getElementById('popup-note-category'),
    noteTags: document.getElementById('popup-note-tags'),
    btnNoteAddTag: document.getElementById('btn-popup-note-add-tag'),
    noteTagList: document.getElementById('popup-editor-tag-list'),
    editorQuickTagsTitle: document.getElementById('editor-quick-tags-title'),
    noteQuickTags: document.getElementById('popup-note-quick-tags'),
    editorSuggestionsTitle: document.getElementById('editor-suggestions-title'),
    btnNoteAcceptAll: document.getElementById('btn-popup-note-accept-all'),
    noteSuggestions: document.getElementById('popup-note-suggestions'),
    editorColorTitle: document.getElementById('editor-color-title'),
    noteColorOptions: document.getElementById('popup-note-color-options'),
    notePin: document.getElementById('popup-note-pin'),
    noteFavorite: document.getElementById('popup-note-favorite'),
    notePinLabel: document.getElementById('popup-note-pin-label'),
    noteFavoriteLabel: document.getElementById('popup-note-favorite-label'),
    btnModeEdit: document.getElementById('btn-popup-mode-edit'),
    btnModePreview: document.getElementById('btn-popup-mode-preview'),
    noteEditContent: document.getElementById('popup-note-edit-content'),
    notePreview: document.getElementById('popup-note-preview'),
    btnCloseNote: document.getElementById('btn-popup-close-note'),
    btnCloseNoteX: document.getElementById('btn-popup-close-note-x'),
    btnNoteUndo: document.getElementById('btn-popup-note-undo'),
    btnCopyNote: document.getElementById('btn-popup-copy-note'),
    btnDeleteNote: document.getElementById('btn-popup-delete-note'),
    btnSaveNote: document.getElementById('btn-popup-save-note'),
    btnFooterUpdates: document.getElementById('btn-popup-footer-updates')
  };

  function locale() {
    return settings.language === 'fa' ? 'fa' : 'en';
  }

  function t(key) {
    return I18N[locale()][key] || I18N.en[key] || key;
  }

  function isFa() {
    return locale() === 'fa';
  }

  function formatLocalRelativeDate(timestamp) {
    if (!isFa()) return formatRelativeDate(timestamp);
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return 'همین الآن';
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    if (days < 7) return `${days} روز پیش`;
    return new Date(timestamp).toLocaleString('fa-IR');
  }

  function workspaceLabel(workspace) {
    if (!workspace) return t('general');
    if (workspace.id === DEFAULT_WORKSPACE_ID && workspace.name === 'General' && isFa()) {
      return t('general');
    }
    return workspace.name;
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

  function getLocalizedUpdateStatus(info = null) {
    if (!info) return t('updatesChecking');
    if (info.hasUpdate) return `${t('newVersion')}: v${info.latestVersion}`;
    if (info.error) return t('updatesUnknown');
    return t('updatesCurrent');
  }

  function renderUpdateUI(info = null) {
    const hasUpdate = !!(info && info.hasUpdate);
    if (els.popupUpdateBadge) {
      els.popupUpdateBadge.textContent = t('newBadge');
      els.popupUpdateBadge.classList.toggle('cn-hidden', !hasUpdate);
    }
    if (els.updateBannerTitle) els.updateBannerTitle.textContent = t('newVersion');
    if (els.updateBannerText) els.updateBannerText.textContent = getLocalizedUpdateStatus(info);
    if (els.updateBanner) els.updateBanner.classList.toggle('cn-hidden', !hasUpdate);
  }

  async function openUpdatesPage(forceCheck = true) {
    const info = forceCheck ? await checkForUpdates(true) : ((await getUpdateInfo()) || null);
    renderUpdateUI(info);
    chrome.tabs.create({ url: (info && info.url) ? info.url : GITHUB_REPO_URL });
  }

  function applyLocale() {
    document.documentElement.lang = locale();
    document.documentElement.dir = isFa() ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-lang', locale());

    els.newNoteLabel.textContent = t('new');
    els.openManagerBtn.title = t('openManager');
    els.search.placeholder = t('search');
    els.btnOverview.textContent = t('overview');
    els.btnTimeline.textContent = t('timeline');
    els.btnFilterAll.textContent = t('all');
    els.btnFilterPinned.textContent = t('pinned');
    els.btnFilterFavorites.textContent = t('favorites');
    els.settingsBtn.textContent = t('settings');
    els.btnFooterUpdates.textContent = t('updates');
    els.emptyTitle.textContent = t('noNotes');
    els.emptySubtitle.textContent = t('noNotesSub');
    els.quickSaveBannerTitle.textContent = t('quickSave');
    els.updateBannerTitle.textContent = t('newVersion');
    els.btnPopupCheckUpdates.textContent = t('updateNow');

    els.quickCaptureTitle.textContent = t('quickNote');
    els.captureTitle.placeholder = t('titlePlaceholder');
    els.captureContent.placeholder = t('contentPlaceholder');
    els.captureTags.placeholder = t('tagsPlaceholder');
    els.btnCaptureAddTag.textContent = t('addTag');
    els.captureQuickTagsTitle.textContent = t('quickTags');
    els.captureSuggestionsTitle.textContent = t('suggestions');
    els.btnCaptureAcceptAll.textContent = t('acceptAll');
    els.captureColorTitle.textContent = t('color');
    els.capturePinLabel.textContent = t('pin');
    els.captureFavoriteLabel.textContent = t('favorite');
    els.btnSaveCapture.textContent = t('saveNote');

    els.unlockTitle.textContent = t('unlockNote');
    els.unlockText.textContent = t('unlockHelp');
    els.unlockSecret.placeholder = t('passwordOrPin');
    els.btnCancelUnlock.textContent = t('cancel');
    els.btnConfirmUnlock.textContent = t('unlock');

    els.noteTitle.textContent = t('edit');
    els.noteEditTitle.placeholder = t('titlePlaceholder');
    els.noteTags.placeholder = t('tagsPlaceholder');
    els.btnNoteAddTag.textContent = t('addTag');
    els.editorQuickTagsTitle.textContent = t('quickTags');
    els.editorSuggestionsTitle.textContent = t('suggestions');
    els.btnNoteAcceptAll.textContent = t('acceptAll');
    els.editorColorTitle.textContent = t('color');
    els.notePinLabel.textContent = t('pin');
    els.noteFavoriteLabel.textContent = t('favorite');
    els.btnModeEdit.textContent = t('editor');
    els.btnModePreview.textContent = t('preview');
    els.noteEditContent.placeholder = t('contentPlaceholder');
    els.btnCloseNote.textContent = t('close');
    els.btnNoteUndo.textContent = t('undo');
    els.btnCopyNote.textContent = t('copy');
    els.btnDeleteNote.textContent = t('delete');
    els.btnSaveNote.textContent = t('saveChanges');
  }

  async function init() {
    await migrateStorageData();
    await refreshState();
    currentWorkspaceFilter = workspaces.some(workspace => workspace.id === settings.currentWorkspaceId)
      ? settings.currentWorkspaceId
      : 'all';
    currentViewMode = settings.popupViewMode === 'timeline' ? 'timeline' : 'overview';

    await applyTheme(settings);
    applyLocale();
    renderWorkspaceOptions();
    renderCategoryOptions();
    renderTagDataLists();
    renderCaptureColorOptions(settings.defaultColor || 'blue');
    updateCaptureChars();
    renderCaptureQuickTags();
    renderCaptureSuggestions();
    renderQuickSaveBanner();
    renderUpdateUI(await getUpdateInfo());
    renderViewButtons();
    renderFilterButtons();
    renderNotes();
    setupEventListeners();
    checkForUpdates(false).then(renderUpdateUI).catch(() => renderUpdateUI({ error: true }));
    chrome.storage.onChanged.addListener(handleStorageChanges);
  }

  async function refreshState() {
    [allNotes, workspaces, categories, customTags, settings, lastQuickSave] = await Promise.all([
      getNotes(),
      getWorkspaces(),
      getCategories(),
      getCustomTags(),
      getSettings(),
      getLastQuickSave()
    ]);
  }

  function setupEventListeners() {
    els.search.addEventListener('input', renderNotes);
    els.workspaceFilter.addEventListener('change', async (e) => {
      currentWorkspaceFilter = e.target.value;
      if (currentWorkspaceFilter !== 'all') {
        settings.currentWorkspaceId = currentWorkspaceFilter;
        await saveSettings({ ...settings, currentWorkspaceId: currentWorkspaceFilter });
      }
      renderNotes();
    });

    els.btnOverview.addEventListener('click', () => setPopupViewMode('overview'));
    els.btnTimeline.addEventListener('click', () => setPopupViewMode('timeline'));
    els.btnFilterAll.addEventListener('click', () => setPopupFilter('all'));
    els.btnFilterPinned.addEventListener('click', () => setPopupFilter('pinned'));
    els.btnFilterFavorites.addEventListener('click', () => setPopupFilter('favorites'));

    els.newNoteBtn.addEventListener('click', toggleQuickCapture);
    els.btnCancelCapture.addEventListener('click', hideQuickCapture);
    els.btnSaveCapture.addEventListener('click', saveQuickCapture);
    els.captureTitle.addEventListener('input', renderCaptureSuggestions);
    els.captureContent.addEventListener('input', () => {
      updateCaptureChars();
      renderCaptureSuggestions();
    });
    els.captureTags.addEventListener('input', () => {
      renderCaptureQuickTags();
      renderCaptureSuggestions();
    });
    els.captureWorkspace.addEventListener('change', async () => {
      settings.currentWorkspaceId = els.captureWorkspace.value;
      await saveSettings({ ...settings, currentWorkspaceId: settings.currentWorkspaceId });
    });
    els.btnCaptureAddTag.addEventListener('click', () => addCustomTagFromPrompt('capture'));
    els.btnCaptureAcceptAll.addEventListener('click', applyAllCaptureSuggestions);
    els.capturePin.addEventListener('change', () => {});
    els.captureFavorite.addEventListener('change', () => {});

    els.openManagerBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
      window.close();
    });
    els.settingsBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html?view=settings') });
      window.close();
    });
    els.btnFooterUpdates.addEventListener('click', () => openUpdatesPage(true));
    els.btnPopupCheckUpdates.addEventListener('click', () => openUpdatesPage(true));
    els.btnDismissQuickSave.addEventListener('click', () => {
      els.quickSaveBanner.classList.add('cn-hidden');
    });
    els.btnDismissUpdateBanner.addEventListener('click', () => {
      els.updateBanner.classList.add('cn-hidden');
    });

    els.btnToggleUnlockSecret.addEventListener('click', () => {
      els.unlockSecret.type = els.unlockSecret.type === 'password' ? 'text' : 'password';
    });
    els.btnCancelUnlock.addEventListener('click', closeUnlockModal);
    els.btnConfirmUnlock.addEventListener('click', confirmUnlock);
    els.unlockSecret.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmUnlock();
      if (e.key === 'Escape') closeUnlockModal();
    });

    els.noteEditTitle.addEventListener('input', onPopupEditorInput);
    els.noteEditContent.addEventListener('input', () => {
      onPopupEditorInput();
      updatePopupNotePreview();
      renderNoteSuggestions();
    });
    els.noteWorkspace.addEventListener('change', onPopupEditorInput);
    els.noteCategory.addEventListener('change', onPopupEditorInput);
    els.noteTags.addEventListener('input', () => {
      onPopupEditorInput();
      renderNoteQuickTags();
      renderNoteSuggestions();
    });
    els.notePin.addEventListener('change', onPopupEditorInput);
    els.noteFavorite.addEventListener('change', onPopupEditorInput);

    els.btnCloseNote.addEventListener('click', closeNoteModal);
    els.btnCloseNoteX.addEventListener('click', closeNoteModal);
    els.btnNoteUndo.addEventListener('click', undoPopupNoteChange);
    els.btnCopyNote.addEventListener('click', () => {
      copyToClipboard(els.noteEditContent.value || els.noteEditTitle.value || '', els.btnCopyNote);
    });
    els.btnDeleteNote.addEventListener('click', deleteCurrentPopupNote);
    els.btnSaveNote.addEventListener('click', savePopupNoteChanges);
    els.btnModeEdit.addEventListener('click', () => setPopupEditorMode('editor'));
    els.btnModePreview.addEventListener('click', () => setPopupEditorMode('preview'));
    els.btnNoteAddTag.addEventListener('click', () => addCustomTagFromPrompt('editor'));
    els.btnNoteAcceptAll.addEventListener('click', applyAllEditorSuggestions);

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f' && isListVisible()) {
        e.preventDefault();
        els.search.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        showQuickCapture();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        if (!els.noteModal.classList.contains('cn-hidden')) {
          e.preventDefault();
          savePopupNoteChanges();
        } else if (!els.quickCapture.classList.contains('cn-hidden')) {
          e.preventDefault();
          saveQuickCapture();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u' && !els.noteModal.classList.contains('cn-hidden')) {
        e.preventDefault();
        undoPopupNoteChange();
      }
      if (e.key === 'Escape') {
        if (!els.unlockModal.classList.contains('cn-hidden')) return closeUnlockModal();
        if (!els.noteModal.classList.contains('cn-hidden')) return closeNoteModal();
        if (!els.quickCapture.classList.contains('cn-hidden')) return hideQuickCapture();
      }
    });
  }

  function isListVisible() {
    return els.quickCapture.classList.contains('cn-hidden') && els.noteModal.classList.contains('cn-hidden');
  }

  async function handleStorageChanges(changes, areaName) {
    if (areaName !== 'local') return;
    const relevantKeys = [STORAGE_KEYS.NOTES, STORAGE_KEYS.SETTINGS, STORAGE_KEYS.WORKSPACES, STORAGE_KEYS.CATEGORIES, STORAGE_KEYS.CUSTOM_TAGS, STORAGE_KEYS.LAST_QUICK_SAVE, STORAGE_KEYS.UPDATE_INFO];
    if (!Object.keys(changes).some(key => relevantKeys.includes(key))) return;

    await refreshState();
    await applyTheme(settings);
    applyLocale();
    renderWorkspaceOptions();
    renderCategoryOptions();
    renderTagDataLists();
    renderCaptureColorOptions(getSelectedCaptureColor());
    renderViewButtons();
    renderFilterButtons();
    renderQuickSaveBanner();
    renderUpdateUI(await getUpdateInfo());
    renderCaptureQuickTags();
    renderCaptureSuggestions();
    renderNotes();
    if (currentViewingNoteId && !els.noteModal.classList.contains('cn-hidden')) {
      openNoteModal(currentViewingNoteId);
    }
  }

  function renderWorkspaceOptions() {
    els.workspaceFilter.innerHTML = `<option value="all">${t('allNotes')}</option>`;
    els.captureWorkspace.innerHTML = '';
    els.noteWorkspace.innerHTML = '';

    workspaces.forEach(workspace => {
      const label = workspaceLabel(workspace);
      [els.workspaceFilter, els.captureWorkspace, els.noteWorkspace].forEach(select => {
        const option = document.createElement('option');
        option.value = workspace.id;
        option.textContent = label;
        select.appendChild(option);
      });
    });

    els.workspaceFilter.value = workspaces.some(workspace => workspace.id === currentWorkspaceFilter) ? currentWorkspaceFilter : 'all';
    const currentWorkspace = settings.currentWorkspaceId || workspaces[0]?.id || DEFAULT_WORKSPACE_ID;
    els.captureWorkspace.value = workspaces.some(workspace => workspace.id === currentWorkspace) ? currentWorkspace : (workspaces[0]?.id || DEFAULT_WORKSPACE_ID);
    if (currentViewingNoteId) {
      const note = allNotes.find(entry => entry.id === currentViewingNoteId);
      els.noteWorkspace.value = note?.workspaceId || currentWorkspace;
    }
  }

  function renderCategoryOptions() {
    const fillSelect = (select, selected = '') => {
      select.innerHTML = `<option value="">${t('noCategory')}</option>`;
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
      });
      select.value = selected;
    };
    fillSelect(els.captureCategory, '');
    fillSelect(els.noteCategory, els.noteCategory.value || '');
  }

  function renderTagDataLists() {
    const tags = getTagCatalog(allNotes, customTags);
    [els.captureTagList, els.noteTagList].forEach(list => {
      list.innerHTML = '';
      tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        list.appendChild(option);
      });
    });
  }

  function parseTagsInput(value) {
    return normalizeTags(value);
  }

  function formatTags(tags) {
    return normalizeTags(tags).join(', ');
  }

  function toggleTagInInput(tag, input) {
    const current = parseTagsInput(input.value);
    input.value = formatTags(current.includes(tag) ? current.filter(item => item !== tag) : [...current, tag]);
  }

  function addTagToInput(tag, input) {
    input.value = formatTags([...parseTagsInput(input.value), tag]);
  }

  function renderColorOptions(container, selectedColor, onSelect) {
    container.innerHTML = '';
    Object.entries(NOTE_COLORS).forEach(([key, value]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `cn-color-option ${selectedColor === key ? 'selected' : ''}`;
      button.style.background = value.border;
      button.title = value.name;
      button.dataset.color = key;
      button.addEventListener('click', () => onSelect(key));
      container.appendChild(button);
    });
  }

  function getSelectedCaptureColor() {
    return els.captureColorOptions.querySelector('.cn-color-option.selected')?.dataset.color || settings.defaultColor || 'blue';
  }

  function getSelectedEditorColor() {
    return els.noteColorOptions.querySelector('.cn-color-option.selected')?.dataset.color || settings.defaultColor || 'blue';
  }

  function renderCaptureColorOptions(selected) {
    renderColorOptions(els.captureColorOptions, selected, (color) => renderCaptureColorOptions(color));
  }

  function renderEditorColorOptions(selected) {
    renderColorOptions(els.noteColorOptions, selected, (color) => {
      renderEditorColorOptions(color);
      onPopupEditorInput();
    });
  }

  function renderQuickTagChips(container, selectedTags, onToggle) {
    const quickTags = getQuickTagList(allNotes, customTags).slice(0, 18);
    container.innerHTML = '';
    if (!quickTags.length) {
      container.innerHTML = `<span class="cn-text-sm cn-text-muted">${t('noTagsYet')}</span>`;
      return;
    }
    quickTags.forEach(tag => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `cn-chip-btn ${selectedTags.includes(tag) ? 'active' : ''}`;
      button.textContent = tag;
      button.addEventListener('click', () => onToggle(tag));
      container.appendChild(button);
    });
  }

  function buildSuggestionItems(container, suggestions, onAccept, onIgnore) {
    container.innerHTML = '';
    if (!suggestions.length) {
      container.innerHTML = `<span class="cn-text-sm cn-text-muted">${t('noSuggestions')}</span>`;
      return;
    }
    suggestions.forEach(tag => {
      const item = document.createElement('div');
      item.className = 'cn-suggestion-item';
      item.innerHTML = `
        <span class="cn-tag">${escapeHtml(tag)}</span>
        <div class="cn-inline-actions">
          <button class="cn-btn cn-btn-ghost cn-btn-sm" type="button" data-accept="1">${t('acceptAll')}</button>
          <button class="cn-btn cn-btn-ghost cn-btn-sm" type="button" data-ignore="1">${t('cancel')}</button>
        </div>
      `;
      item.querySelector('[data-accept]').addEventListener('click', () => onAccept(tag));
      item.querySelector('[data-ignore]').addEventListener('click', () => onIgnore(tag));
      container.appendChild(item);
    });
  }

  function renderCaptureQuickTags() {
    renderQuickTagChips(els.captureQuickTags, parseTagsInput(els.captureTags.value), (tag) => {
      toggleTagInInput(tag, els.captureTags);
      renderCaptureQuickTags();
      renderCaptureSuggestions();
    });
  }

  function getCaptureSuggestions() {
    return suggestTags(`${els.captureTitle.value}\n${els.captureContent.value}`, parseTagsInput(els.captureTags.value), captureIgnoredSuggestions);
  }

  function renderCaptureSuggestions() {
    buildSuggestionItems(
      els.captureSuggestions,
      getCaptureSuggestions(),
      (tag) => {
        addTagToInput(tag, els.captureTags);
        renderCaptureQuickTags();
        renderCaptureSuggestions();
      },
      (tag) => {
        captureIgnoredSuggestions = normalizeTags([...captureIgnoredSuggestions, tag]);
        renderCaptureSuggestions();
      }
    );
  }

  function applyAllCaptureSuggestions() {
    const suggestions = getCaptureSuggestions();
    els.captureTags.value = formatTags([...parseTagsInput(els.captureTags.value), ...suggestions]);
    renderCaptureQuickTags();
    renderCaptureSuggestions();
  }

  function showQuickCapture() {
    els.listShell.classList.add('cn-hidden');
    els.quickCapture.classList.remove('cn-hidden');
    els.newNoteBtn.classList.add('active');
    els.captureWorkspace.value = settings.currentWorkspaceId || workspaces[0]?.id || DEFAULT_WORKSPACE_ID;
    els.captureCategory.value = '';
    els.capturePin.checked = false;
    els.captureFavorite.checked = false;
    renderCaptureColorOptions(settings.defaultColor || 'blue');
    captureIgnoredSuggestions = [];
    renderCaptureQuickTags();
    renderCaptureSuggestions();
    els.captureTitle.focus();
  }

  function hideQuickCapture() {
    els.listShell.classList.remove('cn-hidden');
    els.quickCapture.classList.add('cn-hidden');
    els.newNoteBtn.classList.remove('active');
    els.captureTitle.value = '';
    els.captureContent.value = '';
    els.captureTags.value = '';
    els.captureCategory.value = '';
    els.capturePin.checked = false;
    els.captureFavorite.checked = false;
    captureIgnoredSuggestions = [];
    updateCaptureChars();
  }

  function toggleQuickCapture() {
    if (els.quickCapture.classList.contains('cn-hidden')) showQuickCapture();
    else hideQuickCapture();
  }

  function updateCaptureChars() {
    els.captureChars.textContent = `${els.captureContent.value.length} ${t('chars')}`;
  }

  async function addCustomTagFromPrompt(scope = 'capture') {
    const value = prompt(t('enterTagName'));
    const tag = normalizeTag(value || '');
    if (!tag) return;
    customTags = normalizeTags([...customTags, tag]);
    await saveCustomTags(customTags);
    renderTagDataLists();
    if (scope === 'capture') {
      addTagToInput(tag, els.captureTags);
      renderCaptureQuickTags();
      renderCaptureSuggestions();
    } else {
      addTagToInput(tag, els.noteTags);
      renderNoteQuickTags();
      renderNoteSuggestions();
      onPopupEditorInput();
    }
    showToast(t('customTagAdded'), 'success');
  }

  async function saveQuickCapture() {
    const title = els.captureTitle.value.trim();
    const content = els.captureContent.value;
    const tags = parseTagsInput(els.captureTags.value);
    if (!title && !content.trim()) {
      showToast(t('addTitleOrContent'), 'warning');
      return;
    }

    const workspaceId = els.captureWorkspace.value || settings.currentWorkspaceId || workspaces[0]?.id || DEFAULT_WORKSPACE_ID;
    const note = createNote({
      title: title || truncateText(content.split('\n').find(Boolean) || '', 60) || t('untitled'),
      content,
      tags,
      color: getSelectedCaptureColor(),
      workspaceId,
      category: els.captureCategory.value || '',
      isPinned: els.capturePin.checked,
      isFavorite: els.captureFavorite.checked
    }, workspaces);

    allNotes.unshift(note);
    await Promise.all([
      saveNotes(allNotes),
      saveSettings({ ...settings, currentWorkspaceId: workspaceId }),
      mergeCustomTags(tags)
    ]);

    currentWorkspaceFilter = workspaceId;
    hideQuickCapture();
    await refreshState();
    renderWorkspaceOptions();
    renderCategoryOptions();
    renderTagDataLists();
    renderNotes();
    showToast(t('saved'), 'success');
  }

  async function setPopupViewMode(mode) {
    currentViewMode = mode;
    settings.popupViewMode = mode;
    await saveSettings({ ...settings, popupViewMode: mode });
    renderViewButtons();
    renderNotes();
  }

  function renderViewButtons() {
    els.btnOverview.classList.toggle('active', currentViewMode === 'overview');
    els.btnTimeline.classList.toggle('active', currentViewMode === 'timeline');
  }

  function setPopupFilter(filterName) {
    currentFilter = filterName;
    renderFilterButtons();
    renderNotes();
  }

  function renderFilterButtons() {
    els.btnFilterAll.classList.toggle('active', currentFilter === 'all');
    els.btnFilterPinned.classList.toggle('active', currentFilter === 'pinned');
    els.btnFilterFavorites.classList.toggle('active', currentFilter === 'favorites');
  }

  function getFilteredNotes() {
    let notes = [...allNotes];
    if (currentFilter === 'pinned') notes = notes.filter(note => note.isPinned);
    if (currentFilter === 'favorites') notes = notes.filter(note => note.isFavorite);
    if (currentWorkspaceFilter !== 'all') notes = notes.filter(note => note.workspaceId === currentWorkspaceFilter);
    const query = els.search.value.trim();
    if (query) notes = filterNotes(notes, query);
    return sortNotes(notes);
  }

  function renderNotes() {
    const notes = getFilteredNotes();
    els.notesList.innerHTML = '';
    if (!notes.length) {
      els.empty.classList.remove('cn-hidden');
      els.count.textContent = `0 ${t('notes')}`;
      return;
    }
    els.empty.classList.add('cn-hidden');
    els.count.textContent = `${notes.length} ${notes.length === 1 ? t('note') : t('notes')}`;

    if (currentViewMode === 'timeline') {
      getTimelineGroups(notes, (items) => items).forEach(group => {
        const section = document.createElement('section');
        section.className = 'cn-popup-overview-group';
        section.innerHTML = `
          <div class="cn-timeline-heading cn-timeline-heading-compact">
            <div>
              <h3>${escapeHtml(getLocalizedTimelineLabel(group.key))}</h3>
              <p>${group.notes.length} ${group.notes.length === 1 ? t('note') : t('notes')}</p>
            </div>
          </div>
        `;
        const list = document.createElement('div');
        list.className = 'cn-popup-overview-list';
        group.notes.forEach(note => list.appendChild(buildNoteItem(note)));
        section.appendChild(list);
        els.notesList.appendChild(section);
      });
      return;
    }

    notes.forEach(note => els.notesList.appendChild(buildNoteItem(note)));
  }

  function buildNoteItem(note) {
    const item = document.createElement('div');
    const noteLocked = isNoteLocked(note) && !unlockedNotes.has(note.id);
    const workspace = getNoteWorkspace(note, workspaces);
    const colorStyle = NOTE_COLORS[note.color] || NOTE_COLORS.blue;
    const preview = noteLocked
      ? t('previewHidden')
      : escapeHtml((note.content || '').replace(/#/g, '').replace(/\n/g, ' ').slice(0, 100)) || t('untitled');

    const badges = [];
    if (workspace) badges.push(`<span class="cn-label cn-workspace-badge">${escapeHtml(workspaceLabel(workspace))}</span>`);
    if (note.category) badges.push(`<span class="cn-label" style="background:${colorStyle.bg};color:${colorStyle.text};border:1px solid ${colorStyle.border}">${escapeHtml(note.category)}</span>`);
    if (note.tags?.length) badges.push(...note.tags.slice(0, 3).map(tag => `<span class="cn-tag">${escapeHtml(tag)}</span>`));

    item.className = `cn-note-item cn-animate-fade ${noteLocked ? 'locked' : ''}`;
    item.style.borderTop = `4px solid ${colorStyle.border}`;
    item.innerHTML = `
      <div class="cn-note-header">
        <div class="cn-note-title-wrap">
          <h3 class="cn-note-title" dir="auto">${escapeHtml(note.title || t('untitled'))}</h3>
          ${isNoteLocked(note) ? '<span class="cn-note-lock-icon">🔒</span>' : ''}
          ${note.isPinned ? '<span class="cn-note-source-icon" title="Pinned">📌</span>' : ''}
          ${note.isFavorite ? '<span class="cn-note-source-icon" title="Favorite">⭐</span>' : ''}
          ${note.source?.type === 'context-menu' ? `<span class="cn-note-source-icon" title="${escapeHtml(t('savedFromWeb'))}">🌐</span>` : ''}
        </div>
        <div class="cn-note-actions">
          <button class="cn-action-btn ${note.isPinned ? 'active' : ''}" type="button" data-action="pin">📌</button>
          <button class="cn-action-btn ${note.isFavorite ? 'active' : ''}" type="button" data-action="favorite">⭐</button>
          <button class="cn-action-btn" type="button" data-action="copy">📋</button>
          <button class="cn-action-btn" type="button" data-action="edit">✏️</button>
          <button class="cn-action-btn danger" type="button" data-action="delete">🗑</button>
        </div>
      </div>
      <div class="cn-note-preview" dir="auto">${preview}</div>
      <div class="cn-note-meta">
        <span>${formatLocalRelativeDate(note.updatedAt)}</span>
        <span>•</span>
        <span>${(note.content || '').length} ${t('chars')}</span>
      </div>
      ${badges.length ? `<div class="cn-note-badges">${badges.join('')}</div>` : ''}
    `;

    item.addEventListener('click', (e) => {
      if (e.target.closest('.cn-note-actions')) return;
      if (noteLocked) return openUnlockModal(note, () => openNoteModal(note.id));
      openNoteModal(note.id);
    });

    item.querySelector('[data-action="pin"]').addEventListener('click', async (e) => {
      e.stopPropagation();
      note.isPinned = !note.isPinned;
      note.updatedAt = Date.now();
      await saveNotes(allNotes);
      renderNotes();
      showToast(note.isPinned ? t('pinnedAdded') : t('pinnedRemoved'), 'success');
    });

    item.querySelector('[data-action="favorite"]').addEventListener('click', async (e) => {
      e.stopPropagation();
      note.isFavorite = !note.isFavorite;
      note.updatedAt = Date.now();
      await saveNotes(allNotes);
      renderNotes();
      showToast(note.isFavorite ? t('favoriteAdded') : t('favoriteRemoved'), 'success');
    });

    item.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
      e.stopPropagation();
      if (noteLocked) return showToast(t('unlockFirst'), 'warning');
      copyToClipboard(note.content || note.title || '', e.currentTarget);
    });

    item.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
      e.stopPropagation();
      if (noteLocked) return openUnlockModal(note, () => openNoteModal(note.id));
      openNoteModal(note.id);
    });

    item.querySelector('[data-action="delete"]').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm(t('deleteConfirm'))) return;
      allNotes = allNotes.filter(entry => entry.id !== note.id);
      await saveNotes(allNotes);
      renderNotes();
      showToast(t('deleted'), 'success');
    });

    return item;
  }

  function renderQuickSaveBanner() {
    if (!lastQuickSave?.savedAt) {
      els.quickSaveBanner.classList.add('cn-hidden');
      return;
    }
    const age = Date.now() - lastQuickSave.savedAt;
    if (age > 15 * 60 * 1000) {
      els.quickSaveBanner.classList.add('cn-hidden');
      return;
    }
    const workspaceName = isFa() && lastQuickSave.workspaceName === 'General'
      ? t('general')
      : (lastQuickSave.workspaceName || t('general'));
    els.quickSaveBannerText.textContent = `${lastQuickSave.title || t('untitled')} ${t('savedTo')} ${workspaceName}`;
    els.quickSaveBanner.classList.remove('cn-hidden');
  }

  function openUnlockModal(note, callback = null) {
    unlockTargetNoteId = note.id;
    unlockSuccessCallback = callback;
    els.unlockTitle.textContent = t('unlockNote');
    els.unlockText.textContent = note.lock?.type === 'pin'
      ? (isFa() ? 'پین ۴ رقمی این یادداشت را وارد کنید.' : 'Enter the 4-digit PIN to unlock this note.')
      : t('unlockHelp');
    els.unlockSecret.value = '';
    els.unlockSecret.type = 'password';
    els.unlockSecret.inputMode = note.lock?.type === 'pin' ? 'numeric' : 'text';
    els.unlockModal.classList.remove('cn-hidden');
    els.unlockSecret.focus();
  }

  function closeUnlockModal() {
    unlockTargetNoteId = null;
    unlockSuccessCallback = null;
    els.unlockSecret.value = '';
    els.unlockSecret.type = 'password';
    els.unlockModal.classList.add('cn-hidden');
  }

  async function confirmUnlock() {
    const note = allNotes.find(entry => entry.id === unlockTargetNoteId);
    if (!note) return closeUnlockModal();
    const valid = await verifyNoteSecret(note, els.unlockSecret.value);
    if (!valid) return showToast(t('invalidSecret'), 'error');
    unlockedNotes.add(note.id);
    const callback = unlockSuccessCallback;
    closeUnlockModal();
    showToast(t('unlocked'), 'success');
    if (callback) callback();
  }

  function getPopupEditorState() {
    return {
      title: els.noteEditTitle.value.trim() || t('untitled'),
      content: els.noteEditContent.value,
      workspaceId: els.noteWorkspace.value || DEFAULT_WORKSPACE_ID,
      category: els.noteCategory.value || '',
      tags: parseTagsInput(els.noteTags.value),
      color: getSelectedEditorColor(),
      isPinned: els.notePin.checked,
      isFavorite: els.noteFavorite.checked
    };
  }

  function resetPopupEditorHistory(state) {
    popupEditorHistory = [state];
    popupEditorHistoryIndex = 0;
    updatePopupUndoState();
  }

  function queuePopupEditorHistory() {
    clearTimeout(popupHistoryTimer);
    popupHistoryTimer = setTimeout(() => {
      if (!currentViewingNoteId || applyingPopupHistory) return;
      const snapshot = getPopupEditorState();
      const current = popupEditorHistory[popupEditorHistoryIndex];
      if (JSON.stringify(current) === JSON.stringify(snapshot)) return;
      popupEditorHistory = popupEditorHistory.slice(0, popupEditorHistoryIndex + 1);
      popupEditorHistory.push(snapshot);
      if (popupEditorHistory.length > 60) popupEditorHistory.shift();
      popupEditorHistoryIndex = popupEditorHistory.length - 1;
      updatePopupUndoState();
    }, 160);
  }

  function updatePopupUndoState() {
    els.btnNoteUndo.disabled = popupEditorHistoryIndex <= 0;
  }

  function onPopupEditorInput() {
    if (applyingPopupHistory) return;
    queuePopupEditorHistory();
  }

  function renderNoteQuickTags() {
    renderQuickTagChips(els.noteQuickTags, parseTagsInput(els.noteTags.value), (tag) => {
      toggleTagInInput(tag, els.noteTags);
      renderNoteQuickTags();
      renderNoteSuggestions();
      onPopupEditorInput();
    });
  }

  function getEditorSuggestions() {
    const note = allNotes.find(entry => entry.id === currentViewingNoteId);
    return suggestTags(`${els.noteEditTitle.value}\n${els.noteEditContent.value}`, parseTagsInput(els.noteTags.value), note?.ignoredSuggestedTags || popupEditorIgnoredSuggestions);
  }

  function renderNoteSuggestions() {
    buildSuggestionItems(
      els.noteSuggestions,
      getEditorSuggestions(),
      (tag) => {
        addTagToInput(tag, els.noteTags);
        renderNoteQuickTags();
        renderNoteSuggestions();
        onPopupEditorInput();
      },
      (tag) => {
        popupEditorIgnoredSuggestions = normalizeTags([...popupEditorIgnoredSuggestions, tag]);
        renderNoteSuggestions();
      }
    );
  }

  function applyAllEditorSuggestions() {
    els.noteTags.value = formatTags([...parseTagsInput(els.noteTags.value), ...getEditorSuggestions()]);
    renderNoteQuickTags();
    renderNoteSuggestions();
    onPopupEditorInput();
  }

  function setPopupEditorMode(mode) {
    popupEditorMode = mode;
    els.btnModeEdit.classList.toggle('active', mode === 'editor');
    els.btnModePreview.classList.toggle('active', mode === 'preview');
    els.noteEditContent.classList.toggle('cn-hidden', mode === 'preview');
    els.notePreview.classList.toggle('cn-hidden', mode !== 'preview');
    if (mode === 'preview') updatePopupNotePreview();
  }

  function updatePopupNotePreview() {
    els.notePreview.innerHTML = parseMarkdown(els.noteEditContent.value || '');
  }

  function openNoteModal(noteId) {
    const note = allNotes.find(entry => entry.id === noteId);
    if (!note) return;
    currentViewingNoteId = note.id;
    popupEditorIgnoredSuggestions = normalizeTags(note.ignoredSuggestedTags || []);
    const workspace = getNoteWorkspace(note, workspaces);
    els.noteTitle.textContent = t('edit');
    els.noteMeta.textContent = `${formatLocalRelativeDate(note.updatedAt)} • ${(note.content || '').length} ${t('chars')}`;
    els.noteSource.textContent = workspace ? workspaceLabel(workspace) : '';
    renderWorkspaceOptions();
    renderCategoryOptions();
    renderTagDataLists();
    els.noteEditTitle.value = note.title || '';
    els.noteEditContent.value = note.content || '';
    els.noteWorkspace.value = note.workspaceId || DEFAULT_WORKSPACE_ID;
    els.noteCategory.value = note.category || '';
    els.noteTags.value = formatTags(note.tags || []);
    els.notePin.checked = !!note.isPinned;
    els.noteFavorite.checked = !!note.isFavorite;
    renderEditorColorOptions(note.color || settings.defaultColor || 'blue');
    renderNoteQuickTags();
    renderNoteSuggestions();
    setPopupEditorMode('editor');
    updatePopupNotePreview();
    resetPopupEditorHistory(getPopupEditorState());
    els.noteModal.classList.remove('cn-hidden');
  }

  function closeNoteModal() {
    currentViewingNoteId = null;
    popupEditorIgnoredSuggestions = [];
    popupEditorHistory = [];
    popupEditorHistoryIndex = -1;
    clearTimeout(popupHistoryTimer);
    els.noteModal.classList.add('cn-hidden');
  }

  function undoPopupNoteChange() {
    if (popupEditorHistoryIndex <= 0) return;
    popupEditorHistoryIndex -= 1;
    const snapshot = popupEditorHistory[popupEditorHistoryIndex];
    applyingPopupHistory = true;
    els.noteEditTitle.value = snapshot.title || '';
    els.noteEditContent.value = snapshot.content || '';
    els.noteWorkspace.value = snapshot.workspaceId || DEFAULT_WORKSPACE_ID;
    els.noteCategory.value = snapshot.category || '';
    els.noteTags.value = formatTags(snapshot.tags || []);
    els.notePin.checked = !!snapshot.isPinned;
    els.noteFavorite.checked = !!snapshot.isFavorite;
    renderEditorColorOptions(snapshot.color || settings.defaultColor || 'blue');
    updatePopupNotePreview();
    renderNoteQuickTags();
    renderNoteSuggestions();
    applyingPopupHistory = false;
    updatePopupUndoState();
  }

  async function savePopupNoteChanges() {
    const note = allNotes.find(entry => entry.id === currentViewingNoteId);
    if (!note) return;
    const next = getPopupEditorState();
    note.title = next.title;
    note.content = next.content;
    note.workspaceId = next.workspaceId;
    note.category = next.category;
    note.tags = next.tags;
    note.color = next.color;
    note.isPinned = next.isPinned;
    note.isFavorite = next.isFavorite;
    note.updatedAt = Date.now();
    await Promise.all([
      saveNotes(allNotes),
      mergeCustomTags(next.tags)
    ]);
    await refreshState();
    renderWorkspaceOptions();
    renderCategoryOptions();
    renderTagDataLists();
    renderNotes();
    els.noteMeta.textContent = `${formatLocalRelativeDate(note.updatedAt)} • ${(note.content || '').length} ${t('chars')}`;
    resetPopupEditorHistory(getPopupEditorState());
    showToast(t('saved'), 'success');
  }

  async function deleteCurrentPopupNote() {
    if (!currentViewingNoteId) return;
    if (!confirm(t('deleteConfirm'))) return;
    allNotes = allNotes.filter(note => note.id !== currentViewingNoteId);
    await saveNotes(allNotes);
    closeNoteModal();
    renderNotes();
    showToast(t('deleted'), 'success');
  }

  function openNoteEditor(id) {
    chrome.tabs.create({ url: chrome.runtime.getURL(`options.html?view=edit&id=${id}`) });
    window.close();
  }

  init();
})();
