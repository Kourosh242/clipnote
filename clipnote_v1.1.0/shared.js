/**
 * shared.js - Core utilities shared across popup, options, and background.
 * Handles storage, themes, markdown parsing, clipboard, search, and toasts.
 */

// ============== Storage Keys ==============
const STORAGE_KEYS = {
  NOTES: 'clipnote_notes',
  SETTINGS: 'clipnote_settings',
  CATEGORIES: 'clipnote_categories'
};

// ============== Default Settings ==============
const DEFAULT_SETTINGS = {
  darkMode: false,
  theme: 'blue',
  fontSize: 14,
  autoSave: true,
  defaultColor: 'blue',
  animations: true,
  sidebarCollapsed: false
};

const DEFAULT_CATEGORIES = ['Work', 'Personal', 'Programming', 'Shopping', 'Ideas', 'Passwords'];

const NOTE_COLORS = {
  red: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', name: 'Red' },
  blue: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', name: 'Blue' },
  green: { bg: '#dcfce7', border: '#22c55e', text: '#166534', name: 'Green' },
  orange: { bg: '#ffedd5', border: '#f97316', text: '#9a3412', name: 'Orange' },
  purple: { bg: '#f3e8ff', border: '#a855f7', text: '#6b21a8', name: 'Purple' },
  gray: { bg: '#f3f4f6', border: '#6b7280', text: '#374151', name: 'Gray' }
};

// ============== Storage Helpers ==============
async function getStorage(key, defaultValue = null) {
  try {
    const result = await chrome.storage.local.get(key);
    return result[key] !== undefined ? result[key] : defaultValue;
  } catch (e) {
    console.error('Storage read error:', e);
    return defaultValue;
  }
}

async function setStorage(key, value) {
  try {
    await chrome.storage.local.set({ [key]: value });
    return true;
  } catch (e) {
    console.error('Storage write error:', e);
    return false;
  }
}

async function getNotes() {
  return await getStorage(STORAGE_KEYS.NOTES, []);
}

async function saveNotes(notes) {
  return await setStorage(STORAGE_KEYS.NOTES, notes);
}

async function getSettings() {
  return { ...DEFAULT_SETTINGS, ...(await getStorage(STORAGE_KEYS.SETTINGS, {})) };
}

async function saveSettings(settings) {
  return await setStorage(STORAGE_KEYS.SETTINGS, settings);
}

async function getCategories() {
  return await getStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
}

async function saveCategories(categories) {
  return await setStorage(STORAGE_KEYS.CATEGORIES, categories);
}

// ============== Note Helpers ==============
function createNote(data = {}) {
  const now = Date.now();
  return {
    id: data.id || 'note_' + now + '_' + Math.random().toString(36).substr(2, 9),
    title: data.title || 'Untitled Note',
    content: data.content || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    category: data.category || '',
    color: data.color || 'blue',
    isFavorite: !!data.isFavorite,
    isPinned: !!data.isPinned,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
}

function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatRelativeDate(timestamp) {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(timestamp);
}

// ============== Tag Helpers ==============
function extractTags(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(/#[\w\-]+/g) || [];
  return [...new Set(matches.map(t => t.toLowerCase()))];
}

function linkifyUrls(text) {
  if (typeof text !== 'string') return '';
  const urlRegex = /(https?:\/\/[^\s<>"'{}|\^`[\]]+)/gi;
  return escapeHtml(text).replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="cn-link">${url}</a>`;
  }).replace(/\n/g, '<br>');
}

// ============== Markdown Parser ==============
function parseMarkdown(text) {
  if (!text) return '';

  let html = escapeHtml(text);
  const codeBlocks = [];
  const placeholder = (index) => `\n<!--CNCB${index}-->\n`;

  // Protect code blocks first so inline formatting doesn't touch them
  html = html.replace(/```([\w]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang ? escapeHtml(lang) : '';
    const codeContent = code.replace(/^\n|\n$/g, '');
    const blockHtml = `<div class="cn-code-block"><div class="cn-code-header"><span class="cn-code-lang">${language || 'code'}</span><button class="cn-copy-code-btn" data-code="${escapeHtml(codeContent).replace(/"/g, '&quot;')}">Copy</button></div><pre><code>${escapeHtml(codeContent)}</code></pre></div>`;
    const index = codeBlocks.push(blockHtml) - 1;
    return placeholder(index);
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="cn-inline-code">$1</code>');

  // Headers
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---+$/gim, '<hr>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="cn-md-image" loading="lazy">');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="cn-link">$1</a>');

  // Tables
  html = parseTables(html);

  // Lists
  html = parseLists(html);

  // Restore code blocks before paragraph wrapping so they remain block-level
  codeBlocks.forEach((block, index) => {
    html = html.replace(placeholder(index), block);
  });

  // Paragraphs
  html = html.split(/\n\n+/).map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<ol') ||
        block.startsWith('<blockquote') || block.startsWith('<div') ||
        block.startsWith('<hr') || block.startsWith('<table')) {
      return block;
    }
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  return html;
}

function parseTables(html) {
  const lines = html.split('\n');
  let result = [];
  let inTable = false;
  let tableLines = [];

  for (let line of lines) {
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      tableLines.push(line);
    } else {
      if (inTable) {
        result.push(buildTable(tableLines));
        tableLines = [];
        inTable = false;
      }
      result.push(line);
    }
  }
  if (inTable) {
    result.push(buildTable(tableLines));
  }
  return result.join('\n');
}

function buildTable(lines) {
  if (lines.length < 2) return lines.join('\n');
  const headerLine = lines[0];
  const separatorLine = lines[1];
  const bodyLines = lines.slice(2);

  const parseRow = (line) => line.split('|').slice(1, -1).map(cell => cell.trim());

  const headers = parseRow(headerLine);
  const separators = parseRow(separatorLine);

  if (separators.some(s => !s.match(/^:?-+:?$/))) {
    return lines.join('\n');
  }

  let table = '<table class="cn-md-table"><thead><tr>';
  headers.forEach(h => {
    table += `<th>${h}</th>`;
  });
  table += '</tr></thead><tbody>';

  bodyLines.forEach(rowLine => {
    const cells = parseRow(rowLine);
    table += '<tr>';
    cells.forEach(c => {
      table += `<td>${c}</td>`;
    });
    table += '</tr>';
  });

  table += '</tbody></table>';
  return table;
}

function parseLists(html) {
  const lines = html.split('\n');
  let result = [];
  let listStack = [];

  function closeLists() {
    let out = '';
    while (listStack.length > 0) {
      const item = listStack.pop();
      out += item.ordered ? '</ol>' : '</ul>';
    }
    return out;
  }

  for (let line of lines) {
    const unordered = line.match(/^(\s*)[-*]\s+(.*)$/);
    const ordered = line.match(/^(\s*)\d+\.\s+(.*)$/);

    if (unordered || ordered) {
      const match = unordered || ordered;
      const indent = match[1].length;
      const content = match[2];
      const orderedList = !!ordered;

      if (listStack.length === 0) {
        listStack.push({ indent, ordered: orderedList });
        result.push(orderedList ? '<ol>' : '<ul>');
      } else {
        const top = listStack[listStack.length - 1];
        if (indent > top.indent) {
          listStack.push({ indent, ordered: orderedList });
          result.push(orderedList ? '<ol>' : '<ul>');
        } else if (indent < top.indent || orderedList !== top.ordered) {
          while (listStack.length > 0 && (listStack[listStack.length - 1].indent > indent || listStack[listStack.length - 1].ordered !== orderedList)) {
            const item = listStack.pop();
            result.push(item.ordered ? '</ol>' : '</ul>');
          }
          if (listStack.length === 0 || listStack[listStack.length - 1].indent < indent) {
            listStack.push({ indent, ordered: orderedList });
            result.push(orderedList ? '<ol>' : '<ul>');
          }
        }
      }
      result.push(`<li>${content}</li>`);
    } else {
      if (listStack.length > 0) {
        result.push(closeLists());
      }
      result.push(line);
    }
  }

  if (listStack.length > 0) {
    result.push(closeLists());
  }

  return result.join('\n');
}

// ============== Clipboard Helpers ==============
async function copyToClipboard(text, buttonElement = null) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied Successfully', 'success');
    if (buttonElement) {
      const originalText = buttonElement.textContent;
      buttonElement.textContent = 'Copied!';
      setTimeout(() => buttonElement.textContent = originalText, 1500);
    }
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Copied Successfully', 'success');
      return true;
    } catch (e) {
      showToast('Copy Failed', 'error');
      return false;
    }
  }
}

async function readFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (err) {
    console.error('Paste failed:', err);
    showToast('Cannot read clipboard', 'error');
    return '';
  }
}

// ============== Search ==============
function filterNotes(notes, query) {
  if (!query || !query.trim()) return notes;
  const q = query.toLowerCase().trim();
  return notes.filter(note => {
    const inTitle = (note.title || '').toLowerCase().includes(q);
    const inContent = (note.content || '').toLowerCase().includes(q);
    const inTags = (note.tags || []).some(tag => tag.toLowerCase().includes(q));
    const inCategory = (note.category || '').toLowerCase().includes(q);
    return inTitle || inContent || inTags || inCategory;
  });
}

// ============== Theme System ==============
async function applyTheme(settings = null) {
  if (!settings) settings = await getSettings();
  // Backward compatibility: old 'default' theme is now 'blue'
  const theme = settings.theme === 'default' ? 'blue' : settings.theme;
  document.documentElement.setAttribute('data-theme', theme);
  if (settings.darkMode) {
    document.documentElement.setAttribute('data-dark', 'true');
  } else {
    document.documentElement.removeAttribute('data-dark');
  }
  document.documentElement.style.setProperty('--cn-font-size', `${settings.fontSize}px`);

  if (!settings.animations) {
    document.documentElement.classList.add('no-animations');
  } else {
    document.documentElement.classList.remove('no-animations');
  }
}

// ============== Toast Notifications ==============
function showToast(message, type = 'success', duration = 2500) {
  let container = document.getElementById('cn-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'cn-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `cn-toast cn-toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'info' ? 'ℹ' : '⚠';
  toast.innerHTML = `<span class="cn-toast-icon">${icon}</span><span class="cn-toast-message">${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

// ============== Import / Export ==============
function downloadFile(content, filename, mimeType = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportToJson() {
  const notes = await getNotes();
  const settings = await getSettings();
  const categories = await getCategories();
  const data = { version: 1, exportedAt: Date.now(), notes, settings, categories };
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `clipnote-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
  showToast('Export Completed', 'success');
}

async function exportToTxt() {
  const notes = await getNotes();
  if (notes.length === 0) {
    showToast('No notes to export', 'info');
    return;
  }
  const lines = [];
  notes.forEach(note => {
    lines.push('='.repeat(60));
    lines.push(`Title: ${note.title}`);
    lines.push(`Category: ${note.category || 'None'}`);
    lines.push(`Tags: ${(note.tags || []).join(', ')}`);
    lines.push(`Created: ${formatDate(note.createdAt)}`);
    lines.push(`Updated: ${formatDate(note.updatedAt)}`);
    lines.push('-'.repeat(60));
    lines.push(note.content || '');
    lines.push('');
  });
  downloadFile(lines.join('\n'), `clipnote-notes-${new Date().toISOString().slice(0, 10)}.txt`, 'text/plain');
  showToast('Export Completed', 'success');
}

async function importFromJson(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.notes || !Array.isArray(data.notes)) {
          showToast('Invalid backup file', 'error');
          resolve(false);
          return;
        }
        await saveNotes(data.notes.map(n => createNote(n)));
        if (data.settings) await saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        if (data.categories) await saveCategories(data.categories);
        showToast('Import Completed', 'success');
        resolve(true);
      } catch (err) {
        console.error(err);
        showToast('Import Failed', 'error');
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
}

// ============== Keyboard Shortcuts ==============
function setupKeyboardShortcuts(handlers) {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      handlers.save && handlers.save();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      handlers.search && handlers.search();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      handlers.newNote && handlers.newNote();
    }
    if (e.key === 'Escape') {
      handlers.escape && handlers.escape();
    }
  });
}

// ============== Debounce ==============
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ============== Generate unique ID ==============
function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 12);
}

// Expose shared utilities globally for popup, options, and service worker
const ClipNote = {
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  DEFAULT_CATEGORIES,
  NOTE_COLORS,
  getStorage, setStorage,
  getNotes, saveNotes,
  getSettings, saveSettings,
  getCategories, saveCategories,
  createNote, sortNotes,
  escapeHtml, formatDate, formatRelativeDate,
  extractTags, linkifyUrls,
  parseMarkdown,
  copyToClipboard, readFromClipboard,
  filterNotes,
  applyTheme,
  showToast,
  exportToJson, exportToTxt, importFromJson, downloadFile,
  setupKeyboardShortcuts,
  debounce,
  generateId
};

if (typeof globalThis !== 'undefined') {
  globalThis.ClipNote = ClipNote;
}
