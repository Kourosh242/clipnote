/**
 * popup.js - Popup سبک و پایدار ClipNote
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
    getLastQuickSave,
    createNote,
    filterNotes,
    formatRelativeDate,
    escapeHtml,
    applyTheme,
    showToast,
    copyToClipboard,
    normalizeTags,
    isNoteLocked,
    verifyNoteSecret,
    getNoteWorkspace,
    truncateText,
    migrateStorageData,
    mergeCustomTags,
    parseMarkdown
  } = window.ClipNote;

  const I18N = {
    en: {
      new: 'New',
      openManager: 'Open Manager',
      search: 'Search notes... (Ctrl+F)',
      allNotes: 'All Notes',
      settings: 'Settings',
      noNotes: 'No notes found',
      noNotesSub: 'Create your first note to get started',
      quickSave: 'Quick Save',
      savedTo: 'saved to',
      quickNote: 'Quick Note',
      titlePlaceholder: 'Title / Topic',
      contentPlaceholder: 'Write your note here...',
      tagsPlaceholder: 'python, api, md',
      saveNote: 'Save Note',
      close: 'Close',
      copy: 'Copy',
      edit: 'Edit',
      cancel: 'Cancel',
      unlock: 'Unlock',
      unlockNote: 'Unlock Note',
      unlockHelp: 'Enter the password or PIN to unlock this note.',
      passwordOrPin: 'Password or PIN',
      deleted: 'Deleted Successfully',
      saved: 'Saved Successfully',
      unlockFirst: 'Unlock note first',
      invalidSecret: 'Invalid password or PIN',
      unlocked: 'Note unlocked',
      addTitleOrContent: 'Please enter a title or content',
      untitled: 'Untitled Note',
      note: 'note',
      notes: 'notes',
      chars: 'chars',
      previewHidden: '🔒 Preview hidden until unlocked',
      savedFromWeb: 'Saved from webpage',
      general: 'General',
      deleteConfirm: 'Delete this note?'
    },
    fa: {
      new: 'جدید',
      openManager: 'باز کردن مدیریت',
      search: 'جستجوی یادداشت‌ها... (Ctrl+F)',
      allNotes: 'همه یادداشت‌ها',
      settings: 'تنظیمات',
      noNotes: 'یادداشتی پیدا نشد',
      noNotesSub: 'اولین یادداشت خود را بسازید',
      quickSave: 'ذخیره سریع',
      savedTo: 'در این فضا ذخیره شد:',
      quickNote: 'یادداشت سریع',
      titlePlaceholder: 'عنوان / موضوع',
      contentPlaceholder: 'یادداشت خود را اینجا بنویسید...',
      tagsPlaceholder: 'python, api, md',
      saveNote: 'ذخیره یادداشت',
      close: 'بستن',
      copy: 'کپی',
      edit: 'ویرایش',
      cancel: 'انصراف',
      unlock: 'باز کردن',
      unlockNote: 'باز کردن یادداشت',
      unlockHelp: 'برای باز کردن این یادداشت رمز یا پین را وارد کنید.',
      passwordOrPin: 'رمز یا پین',
      deleted: 'یادداشت حذف شد',
      saved: 'یادداشت ذخیره شد',
      unlockFirst: 'ابتدا یادداشت را باز کنید',
      invalidSecret: 'رمز یا پین نادرست است',
      unlocked: 'یادداشت باز شد',
      addTitleOrContent: 'لطفاً عنوان یا محتوا وارد کنید',
      untitled: 'یادداشت بدون عنوان',
      note: 'یادداشت',
      notes: 'یادداشت',
      chars: 'کاراکتر',
      previewHidden: '🔒 پیش‌نمایش تا زمان باز شدن مخفی است',
      savedFromWeb: 'ذخیره‌شده از وب',
      general: 'عمومی',
      deleteConfirm: 'این یادداشت حذف شود؟'
    }
  };

  let allNotes = [];
  let workspaces = [];
  let settings = {};
  let lastQuickSave = null;
  let currentWorkspaceFilter = 'all';
  const unlockedNotes = new Set();
  let unlockTargetNoteId = null;
  let unlockSuccessCallback = null;
  let currentViewingNoteId = null;

  const els = {
    listShell: document.getElementById('popup-list-shell'),
    quickCapture: document.getElementById('quick-capture'),
    search: document.getElementById('popup-search'),
    workspaceFilter: document.getElementById('popup-workspace-filter'),
    notesList: document.getElementById('popup-notes-list'),
    empty: document.getElementById('popup-empty'),
    emptyTitle: document.getElementById('empty-title'),
    emptySubtitle: document.getElementById('empty-subtitle'),
    count: document.getElementById('popup-count'),
    settingsBtn: document.getElementById('btn-settings'),
    openManagerBtn: document.getElementById('btn-open-manager'),
    newNoteBtn: document.getElementById('btn-new-note'),
    newNoteLabel: document.getElementById('label-new-note'),

    quickSaveBanner: document.getElementById('quick-save-banner'),
    quickSaveBannerTitle: document.getElementById('quick-save-banner-title'),
    quickSaveBannerText: document.getElementById('quick-save-banner-text'),
    btnDismissQuickSave: document.getElementById('btn-dismiss-quick-save'),

    quickCaptureTitle: document.getElementById('quick-capture-title'),
    captureTitle: document.getElementById('capture-title'),
    captureContent: document.getElementById('capture-content'),
    captureWorkspace: document.getElementById('capture-workspace'),
    captureTags: document.getElementById('capture-tags'),
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
    noteContent: document.getElementById('popup-note-content'),
    btnCloseNote: document.getElementById('btn-popup-close-note'),
    btnCloseNoteX: document.getElementById('btn-popup-close-note-x'),
    btnCopyNote: document.getElementById('btn-popup-copy-note'),
    btnEditNote: document.getElementById('btn-popup-edit-note')
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

  function applyLocale() {
    document.documentElement.lang = locale();
    document.documentElement.dir = isFa() ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-lang', locale());

    els.newNoteLabel.textContent = t('new');
    els.openManagerBtn.title = t('openManager');
    els.search.placeholder = t('search');
    els.settingsBtn.textContent = t('settings');
    els.emptyTitle.textContent = t('noNotes');
    els.emptySubtitle.textContent = t('noNotesSub');
    els.quickSaveBannerTitle.textContent = t('quickSave');
    els.quickCaptureTitle.textContent = t('quickNote');
    els.captureTitle.placeholder = t('titlePlaceholder');
    els.captureContent.placeholder = t('contentPlaceholder');
    els.captureTags.placeholder = t('tagsPlaceholder');
    els.btnSaveCapture.textContent = t('saveNote');
    els.unlockTitle.textContent = t('unlockNote');
    els.unlockText.textContent = t('unlockHelp');
    els.unlockSecret.placeholder = t('passwordOrPin');
    els.btnCancelUnlock.textContent = t('cancel');
    els.btnConfirmUnlock.textContent = t('unlock');
    els.btnCloseNote.textContent = t('close');
    els.btnCopyNote.textContent = t('copy');
    els.btnEditNote.textContent = t('edit');
  }

  async function init() {
    await migrateStorageData();
    await refreshState();
    currentWorkspaceFilter = workspaces.some(workspace => workspace.id === settings.currentWorkspaceId)
      ? settings.currentWorkspaceId
      : 'all';

    await applyTheme(settings);
    applyLocale();
    renderWorkspaceOptions();
    updateCaptureChars();
    renderQuickSaveBanner();
    renderNotes();
    setupEventListeners();

    chrome.storage.onChanged.addListener(handleStorageChanges);
  }

  async function refreshState() {
    [allNotes, workspaces, settings, lastQuickSave] = await Promise.all([
      getNotes(),
      getWorkspaces(),
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

    els.newNoteBtn.addEventListener('click', toggleQuickCapture);
    els.btnCancelCapture.addEventListener('click', hideQuickCapture);
    els.btnSaveCapture.addEventListener('click', saveQuickCapture);
    els.captureContent.addEventListener('input', updateCaptureChars);
    els.captureWorkspace.addEventListener('change', async () => {
      settings.currentWorkspaceId = els.captureWorkspace.value;
      await saveSettings({ ...settings, currentWorkspaceId: settings.currentWorkspaceId });
    });

    els.openManagerBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
      window.close();
    });

    els.settingsBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html?view=settings') });
      window.close();
    });

    els.btnDismissQuickSave.addEventListener('click', () => {
      els.quickSaveBanner.classList.add('cn-hidden');
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

    els.btnCloseNote.addEventListener('click', closeNoteModal);
    els.btnCloseNoteX.addEventListener('click', closeNoteModal);
    els.btnCopyNote.addEventListener('click', () => {
      const note = allNotes.find(entry => entry.id === currentViewingNoteId);
      if (!note) return;
      copyToClipboard(note.content || note.title || '', els.btnCopyNote);
    });
    els.btnEditNote.addEventListener('click', () => {
      if (!currentViewingNoteId) return;
      openNoteEditor(currentViewingNoteId);
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f' && els.quickCapture.classList.contains('cn-hidden')) {
        e.preventDefault();
        els.search.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        showQuickCapture();
      }
      if (e.key === 'Escape' && !els.quickCapture.classList.contains('cn-hidden')) {
        hideQuickCapture();
      }
      if (e.key === 'Escape' && !els.noteModal.classList.contains('cn-hidden')) {
        closeNoteModal();
      }
    });
  }

  async function handleStorageChanges(changes, areaName) {
    if (areaName !== 'local') return;
    const relevantKeys = [STORAGE_KEYS.NOTES, STORAGE_KEYS.SETTINGS, STORAGE_KEYS.WORKSPACES, STORAGE_KEYS.LAST_QUICK_SAVE];
    if (!Object.keys(changes).some(key => relevantKeys.includes(key))) return;

    await refreshState();
    await applyTheme(settings);
    applyLocale();
    renderWorkspaceOptions();
    updateCaptureChars();
    renderQuickSaveBanner();
    renderNotes();
  }

  function renderWorkspaceOptions() {
    els.workspaceFilter.innerHTML = `<option value="all">${t('allNotes')}</option>`;
    els.captureWorkspace.innerHTML = '';

    workspaces.forEach(workspace => {
      const filterOption = document.createElement('option');
      filterOption.value = workspace.id;
      filterOption.textContent = workspaceLabel(workspace);
      els.workspaceFilter.appendChild(filterOption);

      const captureOption = document.createElement('option');
      captureOption.value = workspace.id;
      captureOption.textContent = workspaceLabel(workspace);
      els.captureWorkspace.appendChild(captureOption);
    });

    els.workspaceFilter.value = workspaces.some(workspace => workspace.id === currentWorkspaceFilter)
      ? currentWorkspaceFilter
      : 'all';

    const targetWorkspace = settings.currentWorkspaceId || workspaces[0]?.id || DEFAULT_WORKSPACE_ID;
    els.captureWorkspace.value = workspaces.some(workspace => workspace.id === targetWorkspace)
      ? targetWorkspace
      : (workspaces[0]?.id || DEFAULT_WORKSPACE_ID);
  }

  function getFilteredNotes() {
    let notes = [...allNotes];
    if (currentWorkspaceFilter !== 'all') {
      notes = notes.filter(note => note.workspaceId === currentWorkspaceFilter);
    }
    const query = els.search.value.trim();
    if (query) notes = filterNotes(notes, query);
    return notes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
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
      if (noteLocked) {
        openUnlockModal(note, () => openNoteModal(note.id));
        return;
      }
      openNoteModal(note.id);
    });

    item.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
      e.stopPropagation();
      if (noteLocked) return showToast(t('unlockFirst'), 'warning');
      copyToClipboard(note.content || note.title || '', e.currentTarget);
    });

    item.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
      e.stopPropagation();
      if (noteLocked) {
        openUnlockModal(note, () => openNoteModal(note.id));
        return;
      }
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

  function showQuickCapture() {
    els.listShell.classList.add('cn-hidden');
    els.quickCapture.classList.remove('cn-hidden');
    els.newNoteBtn.classList.add('active');
    els.captureWorkspace.value = workspaces.some(workspace => workspace.id === settings.currentWorkspaceId)
      ? settings.currentWorkspaceId
      : (workspaces[0]?.id || DEFAULT_WORKSPACE_ID);
    els.captureTitle.focus();
  }

  function hideQuickCapture() {
    els.listShell.classList.remove('cn-hidden');
    els.quickCapture.classList.add('cn-hidden');
    els.newNoteBtn.classList.remove('active');
    els.captureTitle.value = '';
    els.captureContent.value = '';
    els.captureTags.value = '';
    updateCaptureChars();
  }

  function toggleQuickCapture() {
    if (els.quickCapture.classList.contains('cn-hidden')) showQuickCapture();
    else hideQuickCapture();
  }

  function updateCaptureChars() {
    els.captureChars.textContent = `${els.captureContent.value.length} ${t('chars')}`;
  }

  async function saveQuickCapture() {
    const title = els.captureTitle.value.trim();
    const content = els.captureContent.value;
    const tags = normalizeTags(els.captureTags.value);

    if (!title && !content.trim()) {
      showToast(t('addTitleOrContent'), 'warning');
      return;
    }

    const workspaceId = els.captureWorkspace.value || settings.currentWorkspaceId || workspaces[0]?.id || DEFAULT_WORKSPACE_ID;
    const note = createNote({
      title: title || truncateText(content.split('\n').find(Boolean) || '', 60) || t('untitled'),
      content,
      tags,
      color: settings.defaultColor || 'blue',
      workspaceId,
      category: ''
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
    renderNotes();
    showToast(t('saved'), 'success');
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

  function openNoteModal(noteId) {
    const note = allNotes.find(entry => entry.id === noteId);
    if (!note) return;
    currentViewingNoteId = note.id;
    const workspace = getNoteWorkspace(note, workspaces);
    els.noteTitle.textContent = note.title || t('untitled');
    els.noteMeta.textContent = `${formatLocalRelativeDate(note.updatedAt)} • ${(note.content || '').length} ${t('chars')}`;
    els.noteSource.textContent = workspace ? workspaceLabel(workspace) : '';
    els.noteContent.innerHTML = note.content ? parseMarkdown(note.content) : `<p>${escapeHtml(t('untitled'))}</p>`;
    els.noteModal.classList.remove('cn-hidden');
  }

  function closeNoteModal() {
    currentViewingNoteId = null;
    els.noteModal.classList.add('cn-hidden');
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

  function openNoteEditor(id) {
    chrome.tabs.create({ url: chrome.runtime.getURL(`options.html?view=edit&id=${id}`) });
    window.close();
  }

  init();
})();
