/**
 * background.js - Service worker for ClipNote.
 * نصب/به‌روزرسانی، مهاجرت داده‌ها و Quick Save از منوی راست‌کلیک.
 */

importScripts('shared.js');

const CONTEXT_MENU_ID = 'clipnote-save-selection';

const UPDATE_CHECK_ALARM = 'clipnote-update-check';
const UPDATE_CHECK_FIRST_DELAY_MINUTES = 5;
const UPDATE_CHECK_PERIOD_MINUTES = 360;

const BG_I18N = {
  en: {
    menuTitle: 'Save to ClipNote',
    saved: 'Saved successfully to ClipNote.',
    saveFailed: 'Quick save failed.',
    updateAvailable: (label) => `New version v${label} is available. Click to view the release.`
  },
  fa: {
    menuTitle: 'ذخیره در ClipNote',
    saved: 'با موفقیت در ClipNote ذخیره شد.',
    saveFailed: 'ذخیره سریع انجام نشد.',
    updateAvailable: (label) => `نسخه جدید v${label} آماده است. برای مشاهده کلیک کنید.`
  }
};

async function getBgLang() {
  try {
    const settings = await ClipNote.getSettings();
    return settings.language === 'fa' ? 'fa' : 'en';
  } catch (error) {
    return 'en';
  }
}

function bt(lang, key, ...args) {
  const pack = BG_I18N[lang] || BG_I18N.en;
  const value = pack[key];
  return typeof value === 'function' ? value(...args) : value;
}

async function ensureBaseStorage() {
  await ClipNote.migrateStorageData();
}

function setupUpdateAlarm() {
  chrome.alarms.create(UPDATE_CHECK_ALARM, {
    delayInMinutes: UPDATE_CHECK_FIRST_DELAY_MINUTES,
    periodInMinutes: UPDATE_CHECK_PERIOD_MINUTES
  });
}

async function createContextMenus() {
  const lang = await getBgLang();
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: bt(lang, 'menuTitle'),
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

  const lang = await getBgLang();
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
    const saved = await ClipNote.saveNotes(notes);
    if (!saved) throw new Error('storage');
    await Promise.all([
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
      message: bt(lang, 'saved')
    }, () => void chrome.runtime.lastError);
  } catch (error) {
    console.error('Quick save failed:', error);
    chrome.notifications.create(`clipnote_error_${Date.now()}`, {
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'ClipNote',
      message: bt(lang, 'saveFailed')
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
    await createContextMenus();
    setupUpdateAlarm();
    console.log('ClipNote installed/updated:', details.reason);
  } catch (error) {
    console.error('Install/update handling error:', error);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureBaseStorage();
  await createContextMenus();
  setupUpdateAlarm();
  ClipNote.checkForUpdates(false).catch((error) => {
    console.error('Startup update check failed:', error);
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== UPDATE_CHECK_ALARM) return;
  ClipNote.checkForUpdates(false).catch(error => {
    console.error('Update check failed:', error);
  });
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

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;
  if (changes[ClipNote.STORAGE_KEYS.SETTINGS]) {
    createContextMenus().catch(() => {});
  }
});
