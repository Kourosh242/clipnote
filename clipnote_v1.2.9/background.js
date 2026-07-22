/**
 * background.js - Service worker for ClipNote.
 * نصب/به‌روزرسانی، مهاجرت داده‌ها و Quick Save از منوی راست‌کلیک.
 */

importScripts('shared.js');

const CONTEXT_MENU_ID = 'clipnote-save-selection';

async function ensureBaseStorage() {
  await ClipNote.migrateStorageData();
}

function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: 'Save to ClipNote',
      contexts: ['selection']
    }, () => {
      if (chrome.runtime.lastError) {
        console.warn('Context menu create warning:', chrome.runtime.lastError.message);
      }
    });
  });
}

async function saveSelectionToClipNote(info, tab) {
  const selectedText = (info.selectionText || '').trim();
  if (!selectedText) return;

  try {
    const [notes, settings, workspaces] = await Promise.all([
      ClipNote.getNotes(),
      ClipNote.getSettings(),
      ClipNote.getWorkspaces()
    ]);

    const workspaceMap = ClipNote.getWorkspaceMap(workspaces);
    const targetWorkspaceId = workspaceMap.has(settings.currentWorkspaceId)
      ? settings.currentWorkspaceId
      : ClipNote.DEFAULT_WORKSPACE_ID;

    const suggestedTags = ClipNote.suggestTags(selectedText);
    const tags = suggestedTags.length ? suggestedTags : ['text'];
    const pageTitle = tab?.title || info.pageUrl || 'Quick Saved Note';
    const pageUrl = info.pageUrl || tab?.url || '';

    const note = ClipNote.createNote({
      title: ClipNote.truncateText(selectedText.split('\n').find(Boolean) || pageTitle, 60) || pageTitle,
      content: selectedText,
      tags,
      category: '',
      color: settings.defaultColor || 'blue',
      workspaceId: targetWorkspaceId,
      source: {
        type: 'context-menu',
        pageTitle,
        pageUrl,
        capturedAt: Date.now()
      }
    }, workspaces);

    notes.unshift(note);
    await Promise.all([
      ClipNote.saveNotes(notes),
      ClipNote.mergeCustomTags(tags),
      ClipNote.saveLastQuickSave({
        id: note.id,
        title: note.title,
        workspaceId: targetWorkspaceId,
        workspaceName: workspaceMap.get(targetWorkspaceId)?.name || 'General',
        savedAt: Date.now(),
        pageTitle,
        pageUrl
      })
    ]);

    chrome.notifications.create(`clipnote_saved_${note.id}`, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'ClipNote',
      message: 'Saved successfully to ClipNote.'
    }, () => void chrome.runtime.lastError);
  } catch (error) {
    console.error('Quick save failed:', error);
    chrome.notifications.create(`clipnote_error_${Date.now()}`, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'ClipNote',
      message: 'Quick save failed.'
    }, () => void chrome.runtime.lastError);
  }
}

chrome.runtime.onInstalled.addListener(async (details) => {
  try {
    if (details.reason === 'install') {
      await chrome.storage.local.set({
        [ClipNote.STORAGE_KEYS.SETTINGS]: ClipNote.DEFAULT_SETTINGS,
        [ClipNote.STORAGE_KEYS.CATEGORIES]: ClipNote.DEFAULT_CATEGORIES,
        [ClipNote.STORAGE_KEYS.WORKSPACES]: ClipNote.DEFAULT_WORKSPACES,
        [ClipNote.STORAGE_KEYS.CUSTOM_TAGS]: [],
        [ClipNote.STORAGE_KEYS.NOTES]: []
      });

      chrome.tabs.create({
        url: chrome.runtime.getURL('options.html?view=settings')
      }).catch(() => {});
    }

    await ensureBaseStorage();
    createContextMenus();
    console.log('ClipNote installed/updated:', details.reason);
  } catch (error) {
    console.error('Install/update handling error:', error);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureBaseStorage();
  createContextMenus();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    saveSelectionToClipNote(info, tab);
  }
});

chrome.notifications.onClicked.addListener(async (notificationId) => {
  if (!notificationId.startsWith('clipnote_update_')) return;

  try {
    const info = await ClipNote.getUpdateInfo();
    const url = (info && info.latestReleaseUrl) || ClipNote.GITHUB_RELEASES_URL;
    await chrome.tabs.create({ url });
  } catch (error) {
    await chrome.tabs.create({ url: ClipNote.GITHUB_RELEASES_URL }).catch(() => {});
  }

  chrome.notifications.clear(notificationId);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'open-manager') {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    sendResponse({ success: true });
    return false;
  }

  if (message.action === 'quick-save-selection' && message.selectionText) {
    saveSelectionToClipNote({ selectionText: message.selectionText, pageUrl: message.pageUrl }, sender.tab)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: String(error) }));
    return true;
  }

  return false;
});
