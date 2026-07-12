/**
 * options.js - Full note manager logic.
 */

(function () {
  const {
    getNotes, saveNotes, getSettings, saveSettings, getCategories, saveCategories,
    createNote, sortNotes, filterNotes, formatDate, formatRelativeDate,
    escapeHtml, parseMarkdown, applyTheme, showToast,
    copyToClipboard, readFromClipboard, exportToJson, exportToTxt, importFromJson,
    setupKeyboardShortcuts, debounce, NOTE_COLORS, DEFAULT_SETTINGS, DEFAULT_CATEGORIES
  } = window.ClipNote;

  // State
  let allNotes = [];
  let categories = [];
  let settings = {};
  let currentView = 'all';
  let currentNoteId = null;
  let currentCategoryFilter = null;
  let currentTagFilter = null;
  let sortMode = 'updated-desc';
  let isDirty = false;
  let autoSaveTimer = null;

  // DOM Elements
  const els = {
    sidebar: document.getElementById('sidebar'),
    collapseBtn: document.getElementById('btn-collapse'),
    navItems: document.querySelectorAll('.cn-nav-item'),
    globalSearch: document.getElementById('global-search'),
    categoriesList: document.getElementById('categories-list'),
    tagsList: document.getElementById('tags-list'),
    btnAddCategory: document.getElementById('btn-add-category'),
    btnNewNote: document.getElementById('btn-new-note'),
    btnNewNoteHeader: document.getElementById('btn-new-note-header'),
    btnSettingsNav: document.getElementById('btn-settings-nav'),

    viewList: document.getElementById('view-list'),
    viewEditor: document.getElementById('view-editor'),
    viewSettings: document.getElementById('view-settings'),
    listTitle: document.getElementById('list-title'),
    listSubtitle: document.getElementById('list-subtitle'),
    listSearch: document.getElementById('list-search'),
    listSort: document.getElementById('list-sort'),
    notesGrid: document.getElementById('notes-grid'),
    listEmpty: document.getElementById('list-empty'),
    btnImport: document.getElementById('btn-import'),
    btnExport: document.getElementById('btn-export'),

    btnBack: document.getElementById('btn-back'),
    noteTitle: document.getElementById('note-title'),
    noteCreated: document.getElementById('note-created'),
    noteUpdated: document.getElementById('note-updated'),
    noteChars: document.getElementById('note-chars'),
    autoSaveStatus: document.getElementById('auto-save-status'),
    btnSave: document.getElementById('btn-save'),
    btnCopyNote: document.getElementById('btn-copy-note'),
    btnDuplicate: document.getElementById('btn-duplicate'),
    btnDelete: document.getElementById('btn-delete'),
    noteCategory: document.getElementById('note-category'),
    noteTags: document.getElementById('note-tags'),
    noteColorOptions: document.getElementById('note-color-options'),
    notePin: document.getElementById('note-pin'),
    noteFavorite: document.getElementById('note-favorite'),
    modeTabs: document.querySelectorAll('.cn-mode-tab'),
    btnPaste: document.getElementById('btn-paste'),
    noteContent: document.getElementById('note-content'),
    notePreview: document.getElementById('note-preview'),
    editorContainer: document.getElementById('editor-container'),

    btnBackSettings: document.getElementById('btn-back-settings'),
    settingDarkMode: document.getElementById('setting-dark-mode'),
    settingTheme: document.getElementById('setting-theme'),
    settingFontSize: document.getElementById('setting-font-size'),
    fontSizeValue: document.getElementById('font-size-value'),
    settingAnimations: document.getElementById('setting-animations'),
    settingAutoSave: document.getElementById('setting-auto-save'),
    settingDefaultColor: document.getElementById('setting-default-color'),
    btnExportJson: document.getElementById('btn-export-json'),
    btnExportTxt: document.getElementById('btn-export-txt'),
    btnImportJson: document.getElementById('btn-import-json'),
    btnClearData: document.getElementById('btn-clear-data'),
    settingsNoteCount: document.getElementById('settings-note-count'),

    categoryModal: document.getElementById('category-modal'),
    categoryModalTitle: document.getElementById('category-modal-title'),
    categoryInput: document.getElementById('category-input'),
    btnSaveCategory: document.getElementById('btn-save-category'),
    btnCancelCategory: document.getElementById('btn-cancel-category'),

    deleteModal: document.getElementById('delete-modal'),
    btnConfirmDelete: document.getElementById('btn-confirm-delete'),
    btnCancelDelete: document.getElementById('btn-cancel-delete')
  };

  // ============== Initialization ==============
  async function init() {
    settings = await getSettings();
    categories = await getCategories();
    allNotes = await getNotes();

    await applyTheme(settings);
    renderColorOptions();
    renderSettingColorOptions();
    renderCategoriesSidebar();
    renderTagsSidebar();
    updateCounts();
    setupEventListeners();
    setupKeyboardShortcuts({
      save: () => currentNoteId && saveCurrentNote(),
      search: () => focusSearch(),
      newNote: () => createNewNote(),
      escape: () => handleEscape()
    });

    // Also save before the page/tab is hidden
    document.addEventListener('visibilitychange', async () => {
      if (document.hidden && currentView === 'edit' && isDirty && currentNoteId) {
        await saveCurrentNote();
      }
    });

    // Handle URL params for direct navigation
    await handleUrlParams();
  }

  async function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const id = params.get('id');

    if (view === 'settings') {
      await showView('settings');
    } else if (view === 'edit' && id) {
      openEditor(id);
    } else {
      await showView('list');
    }
  }

  function focusSearch() {
    if (currentView === 'list' || currentView === 'pinned' || currentView === 'favorites') {
      els.listSearch.focus();
    } else if (currentView === 'edit') {
      els.noteContent.focus();
    }
  }

  async function handleEscape() {
    if (!els.categoryModal.classList.contains('cn-hidden')) {
      closeCategoryModal();
      return;
    }
    if (!els.deleteModal.classList.contains('cn-hidden')) {
      closeDeleteModal();
      return;
    }
    if (currentView === 'edit') {
      await showView('list');
    } else if (currentView === 'settings') {
      await showView('list');
    }
  }

  // ============== View Navigation ==============
  async function showView(viewName) {
    // 'list' is an alias for the default 'all' notes view
    if (viewName === 'list') viewName = 'all';
    currentView = viewName;

    els.viewList.classList.add('cn-hidden');
    els.viewEditor.classList.add('cn-hidden');
    els.viewSettings.classList.add('cn-hidden');

    if (viewName === 'all' || viewName === 'pinned' || viewName === 'favorites') {
      // Refresh data from storage every time the list is shown
      allNotes = await getNotes();
      categories = await getCategories();
      renderCategoriesSidebar();
      renderTagsSidebar();
      updateCounts();
      els.viewList.classList.remove('cn-hidden');
      updateListTitle();
      renderNotesList();
    } else if (viewName === 'edit') {
      els.viewEditor.classList.remove('cn-hidden');
    } else if (viewName === 'settings') {
      els.viewSettings.classList.remove('cn-hidden');
      loadSettingsUI();
    }

    // Update sidebar nav
    els.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewName);
    });

    // Update URL without reload
    const url = new URL(window.location.href);
    if (viewName === 'settings') {
      url.searchParams.set('view', 'settings');
      url.searchParams.delete('id');
    } else if (viewName === 'edit' && currentNoteId) {
      url.searchParams.set('view', 'edit');
      url.searchParams.set('id', currentNoteId);
    } else {
      url.searchParams.delete('view');
      url.searchParams.delete('id');
    }
    window.history.replaceState({}, '', url);
  }

  function updateListTitle() {
    if (currentCategoryFilter) {
      els.listTitle.textContent = `Category: ${currentCategoryFilter}`;
      els.listSubtitle.textContent = 'Notes in this category';
    } else if (currentTagFilter) {
      els.listTitle.textContent = `Tag: ${currentTagFilter}`;
      els.listSubtitle.textContent = 'Notes with this tag';
    } else if (currentView === 'pinned') {
      els.listTitle.textContent = '📌 Pinned Notes';
      els.listSubtitle.textContent = 'Important notes pinned to the top';
    } else if (currentView === 'favorites') {
      els.listTitle.textContent = '⭐ Favorite Notes';
      els.listSubtitle.textContent = 'Your favorite notes';
    } else {
      els.listTitle.textContent = '📝 All Notes';
      els.listSubtitle.textContent = 'Manage your clipboard notes';
    }
  }

  // ============== Event Listeners ==============
  function setupEventListeners() {
    // Sidebar
    els.collapseBtn.addEventListener('click', () => els.sidebar.classList.toggle('collapsed'));

    els.navItems.forEach(item => {
      item.addEventListener('click', async () => {
        currentView = item.dataset.view;
        currentCategoryFilter = null;
        currentTagFilter = null;
        await showView(currentView);
      });
    });

    els.globalSearch.addEventListener('input', debounce(async () => {
      currentCategoryFilter = null;
      currentTagFilter = null;
      currentView = 'all';
      await showView('list');
    }, 150));

    els.btnAddCategory.addEventListener('click', () => openCategoryModal());
    els.btnNewNote.addEventListener('click', () => createNewNote());
    els.btnNewNoteHeader.addEventListener('click', () => createNewNote());
    els.btnSettingsNav.addEventListener('click', () => showView('settings'));

    // List view
    els.listSearch.addEventListener('input', debounce(renderNotesList, 150));
    els.listSort.addEventListener('change', (e) => {
      sortMode = e.target.value;
      renderNotesList();
    });
    els.btnImport.addEventListener('click', () => els.btnImportJson.click());
    els.btnExport.addEventListener('click', exportToJson);

    // Editor
    els.btnBack.addEventListener('click', async () => {
      if (isDirty) await saveCurrentNote();
      await showView('list');
    });
    els.noteTitle.addEventListener('input', () => markDirty());
    els.noteContent.addEventListener('input', () => {
      markDirty();
      updatePreview();
      updateCharCount();
      scheduleAutoSave();
    });
    els.noteCategory.addEventListener('change', () => markDirty());
    els.noteTags.addEventListener('input', () => markDirty());
    els.notePin.addEventListener('change', () => markDirty());
    els.noteFavorite.addEventListener('change', () => markDirty());
    els.btnSave.addEventListener('click', () => saveCurrentNote(true));
    els.btnCopyNote.addEventListener('click', () => {
      const note = getCurrentNoteValues();
      const text = `${note.title}\n\n${note.content}`;
      copyToClipboard(text, els.btnCopyNote);
    });
    els.btnDuplicate.addEventListener('click', duplicateCurrentNote);
    els.btnDelete.addEventListener('click', () => els.deleteModal.classList.remove('cn-hidden'));
    els.btnPaste.addEventListener('click', async () => {
      const text = await readFromClipboard();
      if (text) {
        els.noteContent.value += text;
        markDirty();
        updatePreview();
        updateCharCount();
        scheduleAutoSave();
      }
    });

    els.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        els.modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const mode = tab.dataset.mode;
        els.editorContainer.className = `cn-editor-container ${mode}-mode`;
      });
    });

    // Settings
    els.btnBackSettings.addEventListener('click', () => {
      showView('list');
      renderNotesList();
    });
    els.settingDarkMode.addEventListener('change', saveSettingsFromUI);
    els.settingTheme.addEventListener('change', saveSettingsFromUI);
    els.settingFontSize.addEventListener('input', () => {
      els.fontSizeValue.textContent = `${els.settingFontSize.value}px`;
      saveSettingsFromUI();
    });
    els.settingAnimations.addEventListener('change', saveSettingsFromUI);
    els.settingAutoSave.addEventListener('change', saveSettingsFromUI);
    els.btnExportJson.addEventListener('click', exportToJson);
    els.btnExportTxt.addEventListener('click', exportToTxt);
    els.btnImportJson.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const success = await importFromJson(file);
      if (success) {
        allNotes = await getNotes();
        categories = await getCategories();
        settings = await getSettings();
        await applyTheme(settings);
        renderCategoriesSidebar();
        renderTagsSidebar();
        renderNotesList();
        updateCounts();
      }
      e.target.value = '';
    });
    els.btnClearData.addEventListener('click', clearAllData);

    // Persist data when leaving page
    window.addEventListener('beforeunload', () => {
      if (currentView === 'edit' && isDirty && currentNoteId) {
        saveCurrentNote();
      }
    });

    // Reload notes when returning to the tab to keep data fresh
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden && currentView !== 'edit') {
        allNotes = await getNotes();
        categories = await getCategories();
        renderCategoriesSidebar();
        renderTagsSidebar();
        renderNotesList();
        updateCounts();
      }
    });

    // Category modal
    els.btnSaveCategory.addEventListener('click', saveCategoryFromModal);
    els.btnCancelCategory.addEventListener('click', closeCategoryModal);
    els.categoryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveCategoryFromModal();
      if (e.key === 'Escape') closeCategoryModal();
    });

    // Delete modal
    els.btnConfirmDelete.addEventListener('click', deleteCurrentNote);
    els.btnCancelDelete.addEventListener('click', closeDeleteModal);
  }

  // ============== Note Management ==============
  function getCurrentNoteValues() {
    return {
      id: currentNoteId,
      title: els.noteTitle.value.trim() || 'Untitled Note',
      content: els.noteContent.value,
      category: els.noteCategory.value,
      tags: parseTagsInput(els.noteTags.value),
      color: getSelectedColor(),
      isPinned: els.notePin.checked,
      isFavorite: els.noteFavorite.checked
    };
  }

  function parseTagsInput(value) {
    return value.split(/[,\s]+/)
      .map(t => {
        t = t.trim().toLowerCase();
        if (!t) return '';
        return t.startsWith('#') ? t : '#' + t;
      })
      .filter(t => t)
      .filter((t, i, arr) => arr.indexOf(t) === i);
  }

  function formatTagsInput(tags) {
    return (tags || []).join(', ');
  }

  async function createNewNote() {
    if (currentView === 'edit' && isDirty) {
      await saveCurrentNote();
    }

    const note = createNote({
      title: '',
      content: '',
      color: settings.defaultColor || 'blue',
      category: currentCategoryFilter || ''
    });
    allNotes.unshift(note);
    await saveNotes(allNotes);
    currentNoteId = note.id;
    isDirty = false;
    openEditor(note.id);
    updateCounts();
    showToast('New Note Created', 'success');
  }

  function openEditor(id) {
    const note = allNotes.find(n => n.id === id);
    if (!note) {
      showToast('Note not found', 'error');
      showView('list');
      renderNotesList();
      return;
    }

    currentNoteId = id;
    isDirty = false;

    els.noteTitle.value = note.title || '';
    els.noteContent.value = note.content || '';
    els.noteCreated.textContent = `Created: ${formatDate(note.createdAt)}`;
    els.noteUpdated.textContent = `Updated: ${formatDate(note.updatedAt)}`;
    els.noteChars.textContent = `${(note.content || '').length} chars`;
    els.autoSaveStatus.textContent = '';

    populateCategorySelect();
    els.noteCategory.value = note.category || '';
    els.noteTags.value = formatTagsInput(note.tags);
    setSelectedColor(note.color || 'blue');
    els.notePin.checked = !!note.isPinned;
    els.noteFavorite.checked = !!note.isFavorite;

    updatePreview();
    showView('edit');
  }

  async function saveCurrentNote(manual = false) {
    if (!currentNoteId || !isDirty) {
      if (manual) showToast('Nothing to save', 'info');
      return;
    }

    const values = getCurrentNoteValues();
    const index = allNotes.findIndex(n => n.id === currentNoteId);
    if (index === -1) return;

    allNotes[index] = {
      ...allNotes[index],
      ...values,
      updatedAt: Date.now()
    };

    await saveNotes(allNotes);
    isDirty = false;

    // Update UI metadata
    const note = allNotes[index];
    els.noteUpdated.textContent = `Updated: ${formatDate(note.updatedAt)}`;
    els.autoSaveStatus.textContent = manual ? 'Saved' : 'Auto-saved';

    renderCategoriesSidebar();
    renderTagsSidebar();
    updateCounts();

    if (manual) showToast('Saved Successfully', 'success');
  }

  function markDirty() {
    isDirty = true;
    els.autoSaveStatus.textContent = 'Unsaved changes';
  }

  function scheduleAutoSave() {
    if (!settings.autoSave) return;
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => saveCurrentNote(false), 800);
  }

  async function duplicateCurrentNote() {
    const original = allNotes.find(n => n.id === currentNoteId);
    if (!original) return;

    const duplicate = createNote({
      ...original,
      title: `${original.title} (Copy)`,
      isPinned: false,
      isFavorite: false
    });
    allNotes.unshift(duplicate);
    await saveNotes(allNotes);
    currentNoteId = duplicate.id;
    updateCounts();
    openEditor(duplicate.id);
    showToast('Note Duplicated', 'success');
  }

  async function deleteCurrentNote() {
    allNotes = allNotes.filter(n => n.id !== currentNoteId);
    await saveNotes(allNotes);
    closeDeleteModal();
    showToast('Deleted Successfully', 'success');
    currentNoteId = null;
    isDirty = false;
    await showView('list');
  }

  function closeDeleteModal() {
    els.deleteModal.classList.add('cn-hidden');
  }

  // ============== Rendering Lists ==============
  function getFilteredAndSortedNotes() {
    let notes = [...allNotes];

    // View filter
    if (currentView === 'pinned') notes = notes.filter(n => n.isPinned);
    if (currentView === 'favorites') notes = notes.filter(n => n.isFavorite);
    if (currentCategoryFilter) notes = notes.filter(n => n.category === currentCategoryFilter);
    if (currentTagFilter) notes = notes.filter(n => (n.tags || []).includes(currentTagFilter));

    // Search filter (prefer list search, fallback global)
    const query = els.listSearch.value.trim() || els.globalSearch.value.trim();
    if (query) notes = filterNotes(notes, query);

    // Sort
    notes.sort((a, b) => {
      if (sortMode === 'updated-desc') return b.updatedAt - a.updatedAt;
      if (sortMode === 'created-desc') return b.createdAt - a.createdAt;
      if (sortMode === 'title-asc') return (a.title || '').localeCompare(b.title || '');
      if (sortMode === 'title-desc') return (b.title || '').localeCompare(a.title || '');
      return 0;
    });

    // Always keep pinned at top for all notes view
    if (currentView === 'all' && !currentCategoryFilter && !currentTagFilter && sortMode === 'updated-desc') {
      notes = sortNotes(notes);
    }

    return notes;
  }

  function renderNotesList() {
    const notes = getFilteredAndSortedNotes();
    els.notesGrid.innerHTML = '';

    if (notes.length === 0) {
      els.listEmpty.classList.remove('cn-hidden');
      return;
    }

    els.listEmpty.classList.add('cn-hidden');

    notes.forEach(note => {
      const card = buildNoteCard(note);
      els.notesGrid.appendChild(card);
    });
  }

  function buildNoteCard(note) {
    const card = document.createElement('div');
    card.className = `cn-note-item cn-animate-fade ${note.isPinned ? 'pinned' : ''} ${note.isFavorite ? 'favorite' : ''}`;

    const colorStyle = NOTE_COLORS[note.color] || NOTE_COLORS.blue;

    const badges = [];
    if (note.category) {
      badges.push(`<span class="cn-label" style="background:${colorStyle.bg};color:${colorStyle.text};border:1px solid ${colorStyle.border}">${escapeHtml(note.category)}</span>`);
    }
    if (note.tags && note.tags.length) {
      badges.push(...note.tags.slice(0, 4).map(tag => `<span class="cn-tag">${escapeHtml(tag)}</span>`));
    }

    const preview = escapeHtml((note.content || '').replace(/#/g, '').replace(/\n/g, ' ').slice(0, 120));

    card.innerHTML = `
      <div class="cn-note-header">
        <h3 class="cn-note-title" dir="auto">${escapeHtml(note.title || 'Untitled Note')}</h3>
        <div class="cn-note-actions">
          <button class="cn-action-btn cn-pin-btn ${note.isPinned ? 'active' : ''}" data-action="pin" title="Pin">📌</button>
          <button class="cn-action-btn cn-fav-btn ${note.isFavorite ? 'active' : ''}" data-action="favorite" title="Favorite">⭐</button>
          <button class="cn-action-btn" data-action="copy" title="Copy">📋</button>
          <button class="cn-action-btn danger" data-action="delete" title="Delete">🗑</button>
        </div>
      </div>
      <div class="cn-note-preview" dir="auto">${preview || 'No content'}</div>
      <div class="cn-note-meta">
        <span>${formatRelativeDate(note.updatedAt)}</span>
        <span>•</span>
        <span>${(note.content || '').length} chars</span>
      </div>
      ${badges.length ? `<div class="cn-note-badges">${badges.join('')}</div>` : ''}
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.cn-note-actions')) return;
      openEditor(note.id);
    });

    card.querySelector('[data-action="pin"]').addEventListener('click', async (e) => {
      e.stopPropagation();
      note.isPinned = !note.isPinned;
      note.updatedAt = Date.now();
      await saveNotes(allNotes);
      renderNotesList();
      updateCounts();
      showToast(note.isPinned ? 'Pinned' : 'Unpinned', 'success');
    });

    card.querySelector('[data-action="favorite"]').addEventListener('click', async (e) => {
      e.stopPropagation();
      note.isFavorite = !note.isFavorite;
      note.updatedAt = Date.now();
      await saveNotes(allNotes);
      renderNotesList();
      updateCounts();
      showToast(note.isFavorite ? 'Added to Favorites' : 'Removed from Favorites', 'success');
    });

    card.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
      e.stopPropagation();
      const text = `${note.title}\n\n${note.content}`;
      copyToClipboard(text, e.currentTarget);
    });

    card.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
      e.stopPropagation();
      currentNoteId = note.id;
      els.deleteModal.classList.remove('cn-hidden');
    });

    return card;
  }

  function updateCounts() {
    const all = allNotes.length;
    const pinned = allNotes.filter(n => n.isPinned).length;
    const favorites = allNotes.filter(n => n.isFavorite).length;
    document.getElementById('count-all').textContent = all;
    document.getElementById('count-pinned').textContent = pinned;
    document.getElementById('count-favorites').textContent = favorites;
    if (els.settingsNoteCount) els.settingsNoteCount.textContent = all;
  }

  // ============== Categories ==============
  function renderCategoriesSidebar() {
    els.categoriesList.innerHTML = '';

    categories.forEach(cat => {
      const count = allNotes.filter(n => n.category === cat).length;
      const item = document.createElement('div');
      item.className = `cn-category-item ${currentCategoryFilter === cat ? 'active' : ''}`;
      item.innerHTML = `
        <span class="cn-color-dot cn-color-gray"></span>
        <span class="cn-truncate">${escapeHtml(cat)}</span>
        <span class="cn-nav-count">${count}</span>
        <div class="cn-category-actions">
          <button class="cn-action-btn cn-btn-sm" data-action="edit" title="Edit">✏️</button>
          <button class="cn-action-btn cn-btn-sm danger" data-action="delete" title="Delete">🗑</button>
        </div>
      `;

      item.addEventListener('click', async (e) => {
        if (e.target.closest('.cn-category-actions')) return;
        currentCategoryFilter = currentCategoryFilter === cat ? null : cat;
        currentTagFilter = null;
        currentView = 'all';
        await showView('list');
        renderCategoriesSidebar();
      });

      item.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
        e.stopPropagation();
        openCategoryModal(cat);
      });

      item.querySelector('[data-action="delete"]').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(`Delete category "${cat}"? Notes will become uncategorized.`)) return;
        categories = categories.filter(c => c !== cat);
        allNotes.forEach(n => {
          if (n.category === cat) n.category = '';
        });
        await saveCategories(categories);
        await saveNotes(allNotes);
        currentCategoryFilter = null;
        renderCategoriesSidebar();
        populateCategorySelect();
        renderNotesList();
        updateCounts();
        showToast('Category Deleted', 'success');
      });

      els.categoriesList.appendChild(item);
    });
  }

  function populateCategorySelect() {
    const current = els.noteCategory.value;
    els.noteCategory.innerHTML = '<option value="">No Category</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      els.noteCategory.appendChild(opt);
    });
    els.noteCategory.value = current;
  }

  let editingCategory = null;

  function openCategoryModal(categoryName = null) {
    editingCategory = categoryName;
    els.categoryModalTitle.textContent = categoryName ? 'Edit Category' : 'Add Category';
    els.categoryInput.value = categoryName || '';
    els.categoryModal.classList.remove('cn-hidden');
    els.categoryInput.focus();
  }

  function closeCategoryModal() {
    els.categoryModal.classList.add('cn-hidden');
    editingCategory = null;
  }

  async function saveCategoryFromModal() {
    const name = els.categoryInput.value.trim();
    if (!name) {
      showToast('Category name is required', 'error');
      return;
    }
    if (categories.includes(name) && name !== editingCategory) {
      showToast('Category already exists', 'error');
      return;
    }

    if (editingCategory) {
      const idx = categories.indexOf(editingCategory);
      if (idx !== -1) categories[idx] = name;
      allNotes.forEach(n => {
        if (n.category === editingCategory) n.category = name;
      });
      await saveNotes(allNotes);
      if (currentCategoryFilter === editingCategory) currentCategoryFilter = name;
      showToast('Category Updated', 'success');
    } else {
      categories.push(name);
      showToast('Category Added', 'success');
    }

    await saveCategories(categories);
    closeCategoryModal();
    renderCategoriesSidebar();
    populateCategorySelect();
    renderNotesList();
  }

  // ============== Tags ==============
  function renderTagsSidebar() {
    els.tagsList.innerHTML = '';
    const tagMap = new Map();
    allNotes.forEach(n => {
      (n.tags || []).forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const sortedTags = [...tagMap.entries()].sort((a, b) => b[1] - a[1]);

    sortedTags.forEach(([tag, count]) => {
      const item = document.createElement('div');
      item.className = `cn-tag-item ${currentTagFilter === tag ? 'active' : ''}`;
      item.innerHTML = `<span class="cn-tag">${escapeHtml(tag)}</span><span class="cn-nav-count">${count}</span>`;
      item.addEventListener('click', async () => {
        currentTagFilter = currentTagFilter === tag ? null : tag;
        currentCategoryFilter = null;
        currentView = 'all';
        await showView('list');
        renderTagsSidebar();
      });
      els.tagsList.appendChild(item);
    });
  }

  // ============== Color Options ==============
  function renderColorOptions() {
    els.noteColorOptions.innerHTML = '';
    Object.entries(NOTE_COLORS).forEach(([key, value]) => {
      const dot = document.createElement('button');
      dot.className = 'cn-color-option';
      dot.style.background = value.border;
      dot.title = value.name;
      dot.dataset.color = key;
      dot.addEventListener('click', () => {
        setSelectedColor(key);
        markDirty();
      });
      els.noteColorOptions.appendChild(dot);
    });
  }

  function renderSettingColorOptions() {
    els.settingDefaultColor.innerHTML = '';
    Object.entries(NOTE_COLORS).forEach(([key, value]) => {
      const dot = document.createElement('button');
      dot.className = 'cn-color-option';
      dot.style.background = value.border;
      dot.title = value.name;
      dot.dataset.color = key;
      dot.addEventListener('click', () => {
        document.querySelectorAll('#setting-default-color .cn-color-option').forEach(d => d.classList.remove('selected'));
        dot.classList.add('selected');
        saveSettingsFromUI();
      });
      els.settingDefaultColor.appendChild(dot);
    });
  }

  function setSelectedColor(color) {
    document.querySelectorAll('#note-color-options .cn-color-option').forEach(d => {
      d.classList.toggle('selected', d.dataset.color === color);
    });
  }

  function getSelectedColor() {
    const selected = document.querySelector('#note-color-options .cn-color-option.selected');
    return selected ? selected.dataset.color : (settings.defaultColor || 'blue');
  }

  // ============== Preview ==============
  function updatePreview() {
    const html = parseMarkdown(els.noteContent.value);
    els.notePreview.innerHTML = html;
  }

  function updateCharCount() {
    els.noteChars.textContent = `${els.noteContent.value.length} chars`;
  }

  // Copy code buttons in preview
  els.notePreview.addEventListener('click', (e) => {
    const btn = e.target.closest('.cn-copy-code-btn');
    if (!btn) return;
    const code = btn.dataset.code;
    if (code) copyToClipboard(code, btn);
  });

  // ============== Settings ==============
  function loadSettingsUI() {
    els.settingDarkMode.checked = settings.darkMode;
    els.settingTheme.value = settings.theme;
    els.settingFontSize.value = settings.fontSize;
    els.fontSizeValue.textContent = `${settings.fontSize}px`;
    els.settingAnimations.checked = settings.animations;
    els.settingAutoSave.checked = settings.autoSave;

    document.querySelectorAll('#setting-default-color .cn-color-option').forEach(d => {
      d.classList.toggle('selected', d.dataset.color === settings.defaultColor);
    });
  }

  async function saveSettingsFromUI() {
    const defaultColorOption = document.querySelector('#setting-default-color .cn-color-option.selected');
    settings = {
      darkMode: els.settingDarkMode.checked,
      theme: els.settingTheme.value,
      fontSize: parseInt(els.settingFontSize.value, 10),
      animations: els.settingAnimations.checked,
      autoSave: els.settingAutoSave.checked,
      defaultColor: defaultColorOption ? defaultColorOption.dataset.color : 'blue',
      sidebarCollapsed: els.sidebar.classList.contains('collapsed')
    };
    await saveSettings(settings);
    await applyTheme(settings);
    els.fontSizeValue.textContent = `${settings.fontSize}px`;
    showToast('Settings Saved', 'success');
  }

  async function clearAllData() {
    const confirmed = confirm('Are you sure? This will delete ALL notes, categories, and settings. This cannot be undone.');
    if (!confirmed) return;

    await saveNotes([]);
    await saveCategories(DEFAULT_CATEGORIES);
    await saveSettings(DEFAULT_SETTINGS);

    allNotes = [];
    categories = DEFAULT_CATEGORIES;
    settings = DEFAULT_SETTINGS;
    currentNoteId = null;
    isDirty = false;

    await applyTheme(settings);
    populateCategorySelect();
    await showView('list');
    showToast('All Data Cleared', 'success');
  }

  // Initialize
  init();
})();
