/**
 * shared.js - ابزارها و منطق مشترک ClipNote
 * بین popup، options و background استفاده می‌شود.
 */

// ============== Storage Keys ==============
const STORAGE_KEYS = {
  NOTES: 'clipnote_notes',
  SETTINGS: 'clipnote_settings',
  CATEGORIES: 'clipnote_categories',
  WORKSPACES: 'clipnote_workspaces',
  CUSTOM_TAGS: 'clipnote_custom_tags',
  LAST_QUICK_SAVE: 'clipnote_last_quick_save',
  UPDATE_INFO: 'clipnote_update_info'
};

const DEFAULT_WORKSPACE_ID = 'ws_default';

// ============== Default Settings ==============
const DEFAULT_SETTINGS = {
  darkMode: false,
  theme: 'blue',
  fontSize: 14,
  autoSave: true,
  defaultColor: 'blue',
  animations: true,
  sidebarCollapsed: false,
  currentWorkspaceId: DEFAULT_WORKSPACE_ID,
  popupViewMode: 'normal',
  fullViewMode: 'normal',
  language: 'en'
};

const DEFAULT_CATEGORIES = ['Work', 'Personal', 'Programming', 'Shopping', 'Ideas', 'Passwords'];
const DEFAULT_TAGS = ['python', 'css', 'api_key', 'text', 'md'];
const DEFAULT_WORKSPACES = [{ id: DEFAULT_WORKSPACE_ID, name: 'General', createdAt: 0 }];

const NOTE_COLORS = {
  red: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', name: 'Red' },
  blue: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', name: 'Blue' },
  green: { bg: '#dcfce7', border: '#22c55e', text: '#166534', name: 'Green' },
  orange: { bg: '#ffedd5', border: '#f97316', text: '#9a3412', name: 'Orange' },
  purple: { bg: '#f3e8ff', border: '#a855f7', text: '#6b21a8', name: 'Purple' },
  gray: { bg: '#f3f4f6', border: '#6b7280', text: '#374151', name: 'Gray' }
};

const EMPTY_LOCK = Object.freeze({
  enabled: false,
  type: null,
  salt: '',
  hash: ''
});

const SMART_TAG_RULES = [
  { tag: 'python', regex: /\b(python|pip|django|flask|fastapi|jupyter)\b/i },
  { tag: 'javascript', regex: /\b(javascript|js|ecmascript)\b/i },
  { tag: 'react', regex: /\b(react|jsx|next\.js|nextjs)\b/i },
  { tag: 'vue', regex: /\b(vue|nuxt)\b/i },
  { tag: 'css', regex: /\b(css|tailwind|sass|scss|flexbox|grid)\b/i },
  { tag: 'html', regex: /\bhtml\b/i },
  { tag: 'api', regex: /\b(api|rest|graphql|endpoint|token)\b/i },
  { tag: 'nodejs', regex: /\b(node\.?js|npm|express)\b/i },
  { tag: 'sql', regex: /\b(sql|mysql|postgres|sqlite|select\s+.+from)\b/i },
  { tag: 'bug', regex: /\b(bug|fix|issue|error|exception|debug)\b/i },
  { tag: 'regex', regex: /\b(regex|regexp|regular expression)\b/i },
  { tag: 'markdown', regex: /(^|\s)(#+\s|```|\*\*|\[[^\]]+\]\([^)]+\)|\|.+\|)/im },
  { tag: 'json', regex: /\{[\s\S]*\}|\[[\s\S]*\]|\bjson\b/i },
  { tag: 'docker', regex: /\b(docker|dockerfile|compose|container)\b/i },
  { tag: 'linux', regex: /\b(linux|ubuntu|debian|bash|shell|chmod|systemctl)\b/i },
  { tag: 'git', regex: /\b(git|github|gitlab|commit|branch|merge)\b/i },
  { tag: 'md', regex: /\bmarkdown\b|(^|\s)#\s|```/im },
  { tag: 'text', regex: /[\s\S]{8,}/i }
];

const GITHUB_REPO_URL = 'https://github.com/Kourosh242/clipnote';
const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases/latest`;
const GITHUB_API_LATEST_RELEASE_URL = 'https://api.github.com/repos/Kourosh242/clipnote/releases/latest';
const GITHUB_API_TAGS_URL = 'https://api.github.com/repos/Kourosh242/clipnote/tags?per_page=1';
const UPDATE_CHECK_CACHE_MS = 1000 * 60 * 60 * 6;

// ============== Generic Helpers ==============
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeTag(tag) {
  if (typeof tag !== 'string') return '';
  return tag.replace(/^#+/, '').trim().toLowerCase();
}

function normalizeTags(tags) {
  const source = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
      ? tags.split(/[\n,،]+/)
      : [];

  return [...new Set(
    source
      .map(normalizeTag)
      .filter(Boolean)
  )];
}

function mergeUniqueStrings(...groups) {
  return [...new Set(groups.flat().filter(Boolean).map(item => String(item).trim()).filter(Boolean))];
}

function getWorkspaceMap(workspaces) {
  return new Map((workspaces || []).map(workspace => [workspace.id, workspace]));
}

function ensureWorkspaceId(workspaceId, workspaces) {
  const existingIds = new Set((workspaces || []).map(workspace => workspace.id));
  return existingIds.has(workspaceId) ? workspaceId : DEFAULT_WORKSPACE_ID;
}

function truncateText(text, max = 72) {
  const safe = normalizeText(text);
  if (!safe) return '';
  return safe.length > max ? `${safe.slice(0, max).trim()}…` : safe;
}

function normalizeVersionString(version = '') {
  return String(version || '').trim().replace(/^v/i, '').split('-')[0];
}

function compareVersions(a = '', b = '') {
  const partsA = normalizeVersionString(a).split('.').map(part => parseInt(part, 10) || 0);
  const partsB = normalizeVersionString(b).split('.').map(part => parseInt(part, 10) || 0);
  const maxLength = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < maxLength; i += 1) {
    const valueA = partsA[i] || 0;
    const valueB = partsB[i] || 0;
    if (valueA > valueB) return 1;
    if (valueA < valueB) return -1;
  }

  return 0;
}

async function fetchGithubJson(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status}`);
  }

  return await response.json();
}

async function fetchLatestGithubVersion() {
  try {
    const release = await fetchGithubJson(GITHUB_API_LATEST_RELEASE_URL);
    if (release && (release.tag_name || release.name)) {
      return {
        ok: true,
        latestVersion: release.tag_name || release.name,
        latestLabel: release.name || release.tag_name,
        url: release.html_url || GITHUB_RELEASES_URL,
        publishedAt: release.published_at || null,
        source: 'release'
      };
    }
  } catch (error) {
    // Fallback to tags below.
  }

  try {
    const tags = await fetchGithubJson(GITHUB_API_TAGS_URL);
    if (Array.isArray(tags) && tags.length > 0) {
      const firstTag = tags[0];
      return {
        ok: true,
        latestVersion: firstTag.name,
        latestLabel: firstTag.name,
        url: GITHUB_RELEASES_URL,
        publishedAt: null,
        source: 'tag'
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: error.message || String(error),
      url: GITHUB_REPO_URL
    };
  }

  return {
    ok: false,
    error: 'No release or tag information available.',
    url: GITHUB_REPO_URL
  };
}

async function checkForUpdates(force = false) {
  const currentVersion = normalizeVersionString(chrome.runtime.getManifest().version || '0.0.0');
  const cached = await getUpdateInfo();
  const now = Date.now();

  if (!force && cached && cached.currentVersion === currentVersion && (now - (cached.checkedAt || 0)) < UPDATE_CHECK_CACHE_MS) {
    return cached;
  }

  const info = {
    currentVersion,
    latestVersion: currentVersion,
    latestLabel: currentVersion,
    hasUpdate: false,
    checkedAt: now,
    url: GITHUB_REPO_URL,
    source: 'github',
    error: null,
    publishedAt: null
  };

  const remote = await fetchLatestGithubVersion();
  if (remote.ok && remote.latestVersion) {
    info.latestVersion = normalizeVersionString(remote.latestVersion);
    info.latestLabel = remote.latestLabel || remote.latestVersion;
    info.url = remote.url || GITHUB_RELEASES_URL;
    info.source = remote.source || 'github';
    info.publishedAt = remote.publishedAt || null;
    info.hasUpdate = compareVersions(info.latestVersion, currentVersion) > 0;
  } else {
    info.error = remote.error || 'Unable to check updates.';
  }

  await saveUpdateInfo(info);
  return info;
}

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
  const settings = await getStorage(STORAGE_KEYS.SETTINGS, {});
  const theme = settings.theme === 'default' ? 'blue' : settings.theme;
  return { ...DEFAULT_SETTINGS, ...settings, theme };
}

async function saveSettings(settings) {
  return await setStorage(STORAGE_KEYS.SETTINGS, { ...DEFAULT_SETTINGS, ...settings });
}

async function getCategories() {
  return await getStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
}

async function saveCategories(categories) {
  return await setStorage(STORAGE_KEYS.CATEGORIES, categories);
}

async function getWorkspaces() {
  return await getStorage(STORAGE_KEYS.WORKSPACES, DEFAULT_WORKSPACES);
}

async function saveWorkspaces(workspaces) {
  return await setStorage(STORAGE_KEYS.WORKSPACES, workspaces);
}

async function getCustomTags() {
  return await getStorage(STORAGE_KEYS.CUSTOM_TAGS, []);
}

async function saveCustomTags(tags) {
  return await setStorage(STORAGE_KEYS.CUSTOM_TAGS, normalizeTags(tags));
}

async function getLastQuickSave() {
  return await getStorage(STORAGE_KEYS.LAST_QUICK_SAVE, null);
}

async function saveLastQuickSave(payload) {
  return await setStorage(STORAGE_KEYS.LAST_QUICK_SAVE, payload);
}

async function getUpdateInfo() {
  return await getStorage(STORAGE_KEYS.UPDATE_INFO, null);
}

async function saveUpdateInfo(info) {
  return await setStorage(STORAGE_KEYS.UPDATE_INFO, info);
}

// ============== Note / Workspace Helpers ==============
function createWorkspace(data = {}) {
  return {
    id: data.id || generateId('ws'),
    name: normalizeText(data.name) || 'Workspace',
    createdAt: Number(data.createdAt) || Date.now()
  };
}

function createNote(data = {}, workspaces = DEFAULT_WORKSPACES) {
  const now = Date.now();
  const workspaceId = ensureWorkspaceId(data.workspaceId || DEFAULT_WORKSPACE_ID, workspaces);
  const rawTitle = normalizeText(data.title);
  const rawContent = typeof data.content === 'string' ? data.content : '';
  const computedTitle = rawTitle || truncateText(rawContent.split('\n').find(Boolean) || '', 60) || 'Untitled Note';

  return {
    id: data.id || generateId('note'),
    title: computedTitle,
    content: rawContent,
    tags: normalizeTags(data.tags),
    category: normalizeText(data.category),
    color: NOTE_COLORS[data.color] ? data.color : 'blue',
    isFavorite: !!data.isFavorite,
    isPinned: !!data.isPinned,
    createdAt: Number(data.createdAt) || now,
    updatedAt: Number(data.updatedAt) || now,
    workspaceId,
    source: {
      type: data.source?.type || 'manual',
      pageTitle: normalizeText(data.source?.pageTitle || data.pageTitle || ''),
      pageUrl: normalizeText(data.source?.pageUrl || data.pageUrl || ''),
      capturedAt: Number(data.source?.capturedAt || data.capturedAt) || (Number(data.createdAt) || now)
    },
    lock: normalizeLockObject(data.lock),
    ignoredSuggestedTags: normalizeTags(data.ignoredSuggestedTags)
  };
}

function normalizeLockObject(lock) {
  if (!lock || !lock.enabled || !lock.hash || !lock.salt) {
    return { ...EMPTY_LOCK };
  }
  return {
    enabled: true,
    type: lock.type === 'pin' ? 'pin' : 'password',
    salt: String(lock.salt),
    hash: String(lock.hash)
  };
}

function isNoteLocked(note) {
  return !!(note && note.lock && note.lock.enabled && note.lock.hash && note.lock.salt);
}

function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });
}

function getNoteWorkspace(note, workspaces) {
  const workspaceMap = getWorkspaceMap(workspaces);
  return workspaceMap.get(note.workspaceId) || workspaceMap.get(DEFAULT_WORKSPACE_ID) || null;
}

// ============== Date Helpers ==============
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

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getTimelineBucket(timestamp, nowTs = Date.now()) {
  const noteDate = new Date(timestamp || nowTs);
  const now = new Date(nowTs);
  const today = startOfDay(now).getTime();
  const targetDay = startOfDay(noteDate).getTime();
  const diffDays = Math.floor((today - targetDay) / 86400000);

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return 'this_week';
  if (noteDate.getFullYear() === now.getFullYear() && noteDate.getMonth() === now.getMonth()) {
    return 'this_month';
  }
  return 'older';
}

function getTimelineLabel(bucket) {
  return {
    today: 'Today',
    yesterday: 'Yesterday',
    this_week: 'This Week',
    this_month: 'This Month',
    older: 'Older'
  }[bucket] || 'Older';
}

function getTimelineGroups(notes, sortFn = sortNotes) {
  const buckets = {
    today: [],
    yesterday: [],
    this_week: [],
    this_month: [],
    older: []
  };

  (sortFn(notes) || []).forEach(note => {
    const bucket = getTimelineBucket(note.updatedAt || note.createdAt || Date.now());
    buckets[bucket].push(note);
  });

  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([key, items]) => ({ key, label: getTimelineLabel(key), notes: items }));
}

// ============== Tag Helpers ==============
function extractTags(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(/#[\w\-.]+/g) || [];
  return normalizeTags(matches);
}

function getTagCatalog(notes = [], customTags = []) {
  const noteTags = [];
  (notes || []).forEach(note => noteTags.push(...normalizeTags(note.tags)));
  return normalizeTags([...DEFAULT_TAGS, ...customTags, ...noteTags]);
}

function getQuickTagList(notes = [], customTags = []) {
  const usage = new Map();
  normalizeTags(DEFAULT_TAGS).forEach(tag => usage.set(tag, 2));
  normalizeTags(customTags).forEach(tag => usage.set(tag, (usage.get(tag) || 0) + 1));
  (notes || []).forEach(note => {
    normalizeTags(note.tags).forEach(tag => usage.set(tag, (usage.get(tag) || 0) + 1));
  });

  return [...usage.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

function suggestTags(text = '', existingTags = [], ignoredTags = []) {
  const content = typeof text === 'string' ? text : '';
  const existing = new Set(normalizeTags(existingTags));
  const ignored = new Set(normalizeTags(ignoredTags));
  const suggestions = [];

  SMART_TAG_RULES.forEach(rule => {
    if (rule.regex.test(content) && !existing.has(rule.tag) && !ignored.has(rule.tag)) {
      suggestions.push(rule.tag);
    }
  });

  return normalizeTags(suggestions);
}

async function mergeCustomTags(tags) {
  const current = await getCustomTags();
  const next = normalizeTags([...current, ...tags]);
  await saveCustomTags(next);
  return next;
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

  html = html.replace(/```([\w]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang ? escapeHtml(lang) : '';
    const codeContent = code.replace(/^\n|\n$/g, '');
    const blockHtml = `<div class="cn-code-block"><div class="cn-code-header"><span class="cn-code-lang">${language || 'code'}</span><button class="cn-copy-code-btn" data-code="${escapeHtml(codeContent).replace(/"/g, '&quot;')}">Copy</button></div><pre><code>${escapeHtml(codeContent)}</code></pre></div>`;
    const index = codeBlocks.push(blockHtml) - 1;
    return placeholder(index);
  });

  html = html.replace(/`([^`]+)`/g, '<code class="cn-inline-code">$1</code>');
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/^---+$/gim, '<hr>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="cn-md-image" loading="lazy">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="cn-link">$1</a>');
  html = parseTables(html);
  html = parseLists(html);

  codeBlocks.forEach((block, index) => {
    html = html.replace(placeholder(index), block);
  });

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
  const result = [];
  let inTable = false;
  let tableLines = [];

  for (const line of lines) {
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

  if (inTable) result.push(buildTable(tableLines));
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

  if (separators.some(separator => !separator.match(/^:?-+:?$/))) {
    return lines.join('\n');
  }

  let table = '<table class="cn-md-table"><thead><tr>';
  headers.forEach(header => { table += `<th>${header}</th>`; });
  table += '</tr></thead><tbody>';

  bodyLines.forEach(rowLine => {
    const cells = parseRow(rowLine);
    table += '<tr>';
    cells.forEach(cell => { table += `<td>${cell}</td>`; });
    table += '</tr>';
  });

  table += '</tbody></table>';
  return table;
}

function parseLists(html) {
  const lines = html.split('\n');
  const result = [];
  const listStack = [];

  function closeLists() {
    let out = '';
    while (listStack.length > 0) {
      const item = listStack.pop();
      out += item.ordered ? '</ol>' : '</ul>';
    }
    return out;
  }

  for (const line of lines) {
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
      if (listStack.length > 0) result.push(closeLists());
      result.push(line);
    }
  }

  if (listStack.length > 0) result.push(closeLists());
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
      setTimeout(() => { buttonElement.textContent = originalText; }, 1500);
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
    return await navigator.clipboard.readText();
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
  return (notes || []).filter(note => {
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
  if (typeof document === 'undefined') return;

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
  if (typeof document === 'undefined') return;

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
  requestAnimationFrame(() => toast.classList.add('show'));

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
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function mergeWorkspaceCollections(currentWorkspaces = [], importedWorkspaces = []) {
  const mergedById = new Map();
  [...currentWorkspaces, ...importedWorkspaces].forEach((workspace) => {
    const normalized = createWorkspace(workspace);
    const existing = mergedById.get(normalized.id);
    if (!existing) {
      mergedById.set(normalized.id, normalized);
      return;
    }
    mergedById.set(normalized.id, {
      ...existing,
      ...normalized,
      name: normalizeText(normalized.name) || existing.name,
      createdAt: Math.min(existing.createdAt || Date.now(), normalized.createdAt || Date.now())
    });
  });

  const merged = [...mergedById.values()];
  const hasDefault = merged.some(workspace => workspace.id === DEFAULT_WORKSPACE_ID);
  if (!hasDefault) merged.unshift(createWorkspace(DEFAULT_WORKSPACES[0]));
  return merged;
}

function mergeNoteCollections(currentNotes = [], importedNotes = [], mergedWorkspaces = DEFAULT_WORKSPACES) {
  const notesById = new Map();
  currentNotes.forEach(note => {
    const normalized = createNote(note, mergedWorkspaces);
    notesById.set(normalized.id, normalized);
  });

  importedNotes.forEach(note => {
    const normalized = createNote(note, mergedWorkspaces);
    const existing = notesById.get(normalized.id);
    if (!existing) {
      notesById.set(normalized.id, normalized);
      return;
    }
    const preferred = (normalized.updatedAt || 0) >= (existing.updatedAt || 0) ? normalized : existing;
    notesById.set(normalized.id, createNote(preferred, mergedWorkspaces));
  });

  return [...notesById.values()];
}

function mergeSettingsCollections(currentSettings = {}, importedSettings = {}, mergedWorkspaces = DEFAULT_WORKSPACES) {
  const merged = {
    ...DEFAULT_SETTINGS,
    ...(currentSettings || {}),
    ...(importedSettings || {})
  };
  const workspaceIds = new Set((mergedWorkspaces || []).map(workspace => workspace.id));
  if (!workspaceIds.has(merged.currentWorkspaceId)) {
    merged.currentWorkspaceId = DEFAULT_WORKSPACE_ID;
  }
  if (merged.theme === 'default') merged.theme = 'blue';
  return merged;
}

function mergeLastQuickSave(currentValue = null, importedValue = null) {
  if (!currentValue && !importedValue) return null;
  if (!currentValue) return importedValue;
  if (!importedValue) return currentValue;
  return (importedValue.savedAt || 0) >= (currentValue.savedAt || 0) ? importedValue : currentValue;
}

async function exportToJson() {
  const [notes, settings, categories, workspaces, customTags, lastQuickSave] = await Promise.all([
    getNotes(),
    getSettings(),
    getCategories(),
    getWorkspaces(),
    getCustomTags(),
    getLastQuickSave()
  ]);

  const data = {
    version: 3,
    exportedAt: Date.now(),
    notes,
    settings,
    categories,
    workspaces,
    customTags,
    lastQuickSave,
    metadata: {
      noteCount: notes.length,
      workspaceCount: workspaces.length,
      categoryCount: categories.length,
      customTagCount: customTags.length
    }
  };

  downloadFile(
    JSON.stringify(data, null, 2),
    `clipnote-backup-${new Date().toISOString().slice(0, 10)}.json`,
    'application/json'
  );
  showToast('Export Completed', 'success');
}

async function exportToTxt() {
  const [notes, workspaces] = await Promise.all([getNotes(), getWorkspaces()]);
  if (!notes.length) {
    showToast('No notes to export', 'info');
    return;
  }

  const workspaceMap = getWorkspaceMap(workspaces);
  const lines = [];

  notes.forEach(note => {
    lines.push('='.repeat(60));
    lines.push(`Title: ${note.title}`);
    lines.push(`Workspace: ${workspaceMap.get(note.workspaceId)?.name || 'General'}`);
    lines.push(`Category: ${note.category || 'None'}`);
    lines.push(`Tags: ${(note.tags || []).join(', ') || 'None'}`);
    lines.push(`Created: ${formatDate(note.createdAt)}`);
    lines.push(`Updated: ${formatDate(note.updatedAt)}`);
    if (note.source?.pageUrl) lines.push(`Source URL: ${note.source.pageUrl}`);
    if (note.source?.pageTitle) lines.push(`Source Title: ${note.source.pageTitle}`);
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

        const [currentNotes, currentSettings, currentCategories, currentWorkspaces, currentCustomTags, currentLastQuickSave] = await Promise.all([
          getNotes(),
          getSettings(),
          getCategories(),
          getWorkspaces(),
          getCustomTags(),
          getLastQuickSave()
        ]);

        const importedWorkspaces = Array.isArray(data.workspaces) && data.workspaces.length
          ? data.workspaces.map(createWorkspace)
          : DEFAULT_WORKSPACES.map(createWorkspace);

        const mergedWorkspaces = mergeWorkspaceCollections(currentWorkspaces, importedWorkspaces);
        const mergedNotes = mergeNoteCollections(currentNotes, data.notes, mergedWorkspaces);
        const mergedCategories = mergeUniqueStrings(currentCategories, Array.isArray(data.categories) ? data.categories : []);
        const mergedCustomTags = normalizeTags([...(currentCustomTags || []), ...((Array.isArray(data.customTags) ? data.customTags : []))]);
        const mergedSettings = mergeSettingsCollections(currentSettings, data.settings || {}, mergedWorkspaces);
        const mergedLastQuickSave = mergeLastQuickSave(currentLastQuickSave, data.lastQuickSave || null);

        await chrome.storage.local.set({
          [STORAGE_KEYS.WORKSPACES]: mergedWorkspaces,
          [STORAGE_KEYS.NOTES]: mergedNotes,
          [STORAGE_KEYS.SETTINGS]: mergedSettings,
          [STORAGE_KEYS.CATEGORIES]: mergedCategories.length ? mergedCategories : DEFAULT_CATEGORIES,
          [STORAGE_KEYS.CUSTOM_TAGS]: mergedCustomTags,
          [STORAGE_KEYS.LAST_QUICK_SAVE]: mergedLastQuickSave
        });

        await migrateStorageData();
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

// ============== Lock / Security Helpers ==============
function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function hashSecret(secret, saltBase64 = '') {
  const normalizedSecret = String(secret || '');
  const encoder = new TextEncoder();
  const saltBytes = saltBase64 ? base64ToBytes(saltBase64) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(normalizedSecret),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: saltBytes,
    iterations: 150000,
    hash: 'SHA-256'
  }, keyMaterial, 256);

  return {
    salt: bytesToBase64(saltBytes),
    hash: bytesToBase64(new Uint8Array(derivedBits))
  };
}

function validateLockSecret(type, secret) {
  if (type === 'pin') {
    return /^\d{4}$/.test(String(secret || ''));
  }
  return String(secret || '').trim().length >= 4;
}

async function createNoteLock(type, secret) {
  if (!validateLockSecret(type, secret)) {
    throw new Error(type === 'pin' ? 'PIN must be exactly 4 digits.' : 'Password must be at least 4 characters.');
  }
  const result = await hashSecret(String(secret));
  return {
    enabled: true,
    type: type === 'pin' ? 'pin' : 'password',
    salt: result.salt,
    hash: result.hash
  };
}

async function verifyNoteSecret(note, secret) {
  if (!isNoteLocked(note)) return true;
  const result = await hashSecret(String(secret || ''), note.lock.salt);
  return result.hash === note.lock.hash;
}

// ============== Migration ==============
async function migrateStorageData() {
  const [rawNotes, rawSettings, rawCategories, rawWorkspaces, rawCustomTags] = await Promise.all([
    getStorage(STORAGE_KEYS.NOTES, []),
    getStorage(STORAGE_KEYS.SETTINGS, {}),
    getStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES),
    getStorage(STORAGE_KEYS.WORKSPACES, DEFAULT_WORKSPACES),
    getStorage(STORAGE_KEYS.CUSTOM_TAGS, [])
  ]);

  let changed = false;

  const workspaces = Array.isArray(rawWorkspaces) && rawWorkspaces.length
    ? rawWorkspaces.map(createWorkspace)
    : DEFAULT_WORKSPACES.map(createWorkspace);

  if (!Array.isArray(rawWorkspaces) || !rawWorkspaces.length) changed = true;

  const workspaceIds = new Set(workspaces.map(workspace => workspace.id));
  if (!workspaceIds.has(DEFAULT_WORKSPACE_ID)) {
    workspaces.unshift(createWorkspace(DEFAULT_WORKSPACES[0]));
    changed = true;
  }

  const notes = Array.isArray(rawNotes)
    ? rawNotes.map(note => {
        const migrated = createNote(note, workspaces);
        if (!workspaceIds.has(migrated.workspaceId)) {
          migrated.workspaceId = DEFAULT_WORKSPACE_ID;
          changed = true;
        }
        if (JSON.stringify(migrated) !== JSON.stringify(note)) changed = true;
        return migrated;
      })
    : [];

  if (!Array.isArray(rawNotes)) changed = true;

  const settings = { ...DEFAULT_SETTINGS, ...(rawSettings || {}) };
  if (settings.theme === 'default') {
    settings.theme = 'blue';
    changed = true;
  }
  if (!workspaceIds.has(settings.currentWorkspaceId)) {
    settings.currentWorkspaceId = DEFAULT_WORKSPACE_ID;
    changed = true;
  }

  const categories = Array.isArray(rawCategories) && rawCategories.length
    ? mergeUniqueStrings(rawCategories)
    : [...DEFAULT_CATEGORIES];
  if (!Array.isArray(rawCategories) || !rawCategories.length) changed = true;

  const customTags = normalizeTags(rawCustomTags || []);
  if (JSON.stringify(customTags) !== JSON.stringify(rawCustomTags || [])) changed = true;

  if (changed) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.NOTES]: notes,
      [STORAGE_KEYS.SETTINGS]: settings,
      [STORAGE_KEYS.CATEGORIES]: categories,
      [STORAGE_KEYS.WORKSPACES]: workspaces,
      [STORAGE_KEYS.CUSTOM_TAGS]: customTags
    });
  }

  return { notes, settings, categories, workspaces, customTags };
}

// ============== Expose Shared Utilities ==============
const ClipNote = {
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_TAGS,
  DEFAULT_WORKSPACES,
  DEFAULT_WORKSPACE_ID,
  GITHUB_REPO_URL,
  GITHUB_RELEASES_URL,
  NOTE_COLORS,
  EMPTY_LOCK,
  SMART_TAG_RULES,
  getStorage,
  setStorage,
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
  getLastQuickSave,
  saveLastQuickSave,
  getUpdateInfo,
  saveUpdateInfo,
  createWorkspace,
  createNote,
  normalizeLockObject,
  isNoteLocked,
  sortNotes,
  getNoteWorkspace,
  escapeHtml,
  normalizeText,
  normalizeTag,
  normalizeTags,
  mergeUniqueStrings,
  getWorkspaceMap,
  ensureWorkspaceId,
  truncateText,
  normalizeVersionString,
  compareVersions,
  formatDate,
  formatRelativeDate,
  startOfDay,
  getTimelineBucket,
  getTimelineLabel,
  getTimelineGroups,
  extractTags,
  getTagCatalog,
  getQuickTagList,
  suggestTags,
  mergeCustomTags,
  linkifyUrls,
  parseMarkdown,
  checkForUpdates,
  copyToClipboard,
  readFromClipboard,
  filterNotes,
  applyTheme,
  showToast,
  exportToJson,
  exportToTxt,
  importFromJson,
  downloadFile,
  setupKeyboardShortcuts,
  debounce,
  generateId,
  hashSecret,
  validateLockSecret,
  createNoteLock,
  verifyNoteSecret,
  migrateStorageData
};

if (typeof globalThis !== 'undefined') {
  globalThis.ClipNote = ClipNote;
}
