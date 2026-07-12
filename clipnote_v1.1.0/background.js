/**
 * background.js - Service worker for ClipNote.
 * Handles extension install/update events and keeps storage healthy.
 */

importScripts('shared.js');

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set defaults on first install
    chrome.storage.local.set({
      [ClipNote.STORAGE_KEYS.SETTINGS]: ClipNote.DEFAULT_SETTINGS,
      [ClipNote.STORAGE_KEYS.CATEGORIES]: ClipNote.DEFAULT_CATEGORIES,
      [ClipNote.STORAGE_KEYS.NOTES]: []
    }).catch(err => console.error('Install defaults error:', err));

    // Open the manager on install
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html?view=settings')
    }).catch(() => {});
  }

  console.log('ClipNote installed/updated:', details.reason);
});

// Keep service worker alive for clipboard-related operations if needed.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'open-manager') {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    sendResponse({ success: true });
  }
  return false;
});
