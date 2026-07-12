/**
 * popup.js - Logic for the ClipNote popup window.
 */

(function () {
  const {
    getNotes, saveNotes, getSettings, createNote, sortNotes,
    filterNotes, formatRelativeDate, escapeHtml, applyTheme,
    showToast, copyToClipboard
  } = window.ClipNote;

  let allNotes = [];
  let currentFilter = 'all';
  let settings = {};

  const els = {
    search: document.getElementById('popup-search'),
    notesList: document.getElementById('popup-notes-list'),
    empty: document.getElementById('popup-empty'),
    count: document.getElementById('popup-count'),
    filterBtns: document.querySelectorAll('.cn-filter-btn'),
    newNoteBtn: document.getElementById('btn-new-note'),
    openManagerBtn: document.getElementById('btn-open-manager'),
    settingsBtn: document.getElementById('btn-settings'),

    quickCapture: document.getElementById('quick-capture'),
    captureTitle: document.getElementById('capture-title'),
    captureContent: document.getElementById('capture-content'),
    captureChars: document.getElementById('capture-chars'),
    btnSaveCapture: document.getElementById('btn-save-capture'),
    btnCancelCapture: document.getElementById('btn-cancel-capture')
  };

  async function init() {
    settings = await getSettings();
    await applyTheme(settings);
    allNotes = await getNotes();
    renderNotes();
    setupEventListeners();
    setupKeyboardShortcuts();
  }

  function setupEventListeners() {
    els.search.addEventListener('input', () => renderNotes());

    els.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        els.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderNotes();
      });
    });

    els.newNoteBtn.addEventListener('click', toggleQuickCapture);
    els.btnCancelCapture.addEventListener('click', hideQuickCapture);
    els.btnSaveCapture.addEventListener('click', saveQuickCapture);
    els.captureContent.addEventListener('input', updateCaptureChars);

    els.openManagerBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
      window.close();
    });

    els.settingsBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html?view=settings') });
      window.close();
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        els.search.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (els.quickCapture.classList.contains('cn-hidden')) {
          showQuickCapture();
        }
        els.captureTitle.focus();
      }
      if (e.key === 'Escape' && !els.quickCapture.classList.contains('cn-hidden')) {
        hideQuickCapture();
      }
    });
  }

  function toggleQuickCapture() {
    if (els.quickCapture.classList.contains('cn-hidden')) {
      showQuickCapture();
    } else {
      hideQuickCapture();
    }
  }

  function showQuickCapture() {
    els.quickCapture.classList.remove('cn-hidden');
    els.newNoteBtn.classList.add('active');
    els.captureTitle.focus();
  }

  function hideQuickCapture() {
    els.quickCapture.classList.add('cn-hidden');
    els.newNoteBtn.classList.remove('active');
    els.captureTitle.value = '';
    els.captureContent.value = '';
    updateCaptureChars();
  }

  function updateCaptureChars() {
    els.captureChars.textContent = `${els.captureContent.value.length} chars`;
  }

  async function saveQuickCapture() {
    const title = els.captureTitle.value.trim();
    const content = els.captureContent.value;

    if (!title && !content.trim()) {
      showToast('Please enter a title or content', 'warning');
      return;
    }

    const note = createNote({
      title: title || 'Untitled Note',
      content: content,
      color: settings.defaultColor || 'blue',
      category: ''
    });

    allNotes.unshift(note);
    await saveNotes(allNotes);

    hideQuickCapture();
    renderNotes();
    updateCounts();
    showToast('Saved Successfully', 'success');
  }

  function getFilteredNotes() {
    let notes = [...allNotes];

    if (currentFilter === 'pinned') {
      notes = notes.filter(n => n.isPinned);
    } else if (currentFilter === 'favorites') {
      notes = notes.filter(n => n.isFavorite);
    }

    const query = els.search.value.trim();
    if (query) {
      notes = filterNotes(notes, query);
    }

    return sortNotes(notes);
  }

  function renderNotes() {
    const notes = getFilteredNotes();
    els.notesList.innerHTML = '';

    if (notes.length === 0) {
      els.empty.classList.remove('cn-hidden');
      els.count.textContent = '0 notes';
      return;
    }

    els.empty.classList.add('cn-hidden');
    els.count.textContent = `${notes.length} note${notes.length !== 1 ? 's' : ''}`;

    notes.forEach(note => {
      const item = buildNoteItem(note);
      els.notesList.appendChild(item);
    });
  }

  function buildNoteItem(note) {
    const div = document.createElement('div');
    div.className = `cn-note-item cn-animate-fade ${note.isPinned ? 'pinned' : ''} ${note.isFavorite ? 'favorite' : ''}`;
    div.setAttribute('data-id', note.id);

    const badges = [];
    if (note.category) {
      badges.push(`<span class="cn-label" style="background:${window.ClipNote.NOTE_COLORS[note.color]?.bg || '#dbeafe'};color:${window.ClipNote.NOTE_COLORS[note.color]?.text || '#1e40af'}">${escapeHtml(note.category)}</span>`);
    }
    if (note.tags && note.tags.length > 0) {
      badges.push(...note.tags.slice(0, 3).map(tag => `<span class="cn-tag">${escapeHtml(tag)}</span>`));
    }

    const preview = escapeHtml((note.content || '').replace(/#/g, '').replace(/\n/g, ' ').slice(0, 90));

    div.innerHTML = `
      <div class="cn-note-header">
        <h3 class="cn-note-title" dir="auto">${escapeHtml(note.title || 'Untitled Note')}</h3>
        <div class="cn-note-actions">
          <button class="cn-action-btn cn-pin-btn ${note.isPinned ? 'active' : ''}" title="Pin" data-action="pin">📌</button>
          <button class="cn-action-btn cn-fav-btn ${note.isFavorite ? 'active' : ''}" title="Favorite" data-action="favorite">⭐</button>
          <button class="cn-action-btn" title="Copy" data-action="copy">📋</button>
          <button class="cn-action-btn" title="Edit in Manager" data-action="edit">✏️</button>
          <button class="cn-action-btn danger" title="Delete" data-action="delete">🗑</button>
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

    div.addEventListener('click', (e) => {
      if (e.target.closest('.cn-note-actions')) return;
      openNoteEditor(note.id);
    });

    div.querySelector('[data-action="pin"]').addEventListener('click', (e) => {
      e.stopPropagation();
      togglePin(note.id);
    });
    div.querySelector('[data-action="favorite"]').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(note.id);
    });
    div.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(note.content || note.title || '', e.currentTarget);
    });
    div.querySelector('[data-action="edit"]').addEventListener('click', (e) => {
      e.stopPropagation();
      openNoteEditor(note.id);
    });
    div.querySelector('[data-action="delete"]').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm(`Delete "${note.title || 'Untitled Note'}"?`)) return;
      allNotes = allNotes.filter(n => n.id !== note.id);
      await saveNotes(allNotes);
      renderNotes();
      updateCounts();
      showToast('Deleted Successfully', 'success');
    });

    return div;
  }

  function updateCounts() {
    const count = allNotes.length;
    els.count.textContent = `${count} note${count !== 1 ? 's' : ''}`;
  }

  async function togglePin(id) {
    const note = allNotes.find(n => n.id === id);
    if (!note) return;
    note.isPinned = !note.isPinned;
    note.updatedAt = Date.now();
    await saveNotes(allNotes);
    renderNotes();
    showToast(note.isPinned ? 'Pinned' : 'Unpinned', 'success');
  }

  async function toggleFavorite(id) {
    const note = allNotes.find(n => n.id === id);
    if (!note) return;
    note.isFavorite = !note.isFavorite;
    note.updatedAt = Date.now();
    await saveNotes(allNotes);
    renderNotes();
    showToast(note.isFavorite ? 'Added to Favorites' : 'Removed from Favorites', 'success');
  }

  function openNoteEditor(id) {
    chrome.tabs.create({ url: chrome.runtime.getURL(`options.html?view=edit&id=${id}`) });
    window.close();
  }

  init();
})();
