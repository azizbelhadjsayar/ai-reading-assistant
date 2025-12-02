// SecureNav Background Service Worker
// Handles badge updates and manages extension state

// Update badge when tab is activated or updated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  updateBadge(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateBadge(tabId);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SECURITY_DATA') {
    // Store security data for the tab
    const tabId = sender.tab.id;
    chrome.storage.local.set({
      [`security_${tabId}`]: message.data
    });
    
    // Update badge based on security score
    updateBadgeWithScore(tabId, message.data.securityScore);
  }
});

async function updateBadge(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
      // Don't show badge for browser internal pages
      chrome.action.setBadgeText({ tabId, text: '' });
      return;
    }

    // Check if using HTTPS
    const isSecure = tab.url.startsWith('https://');
    
    if (isSecure) {
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#10b981' }); // Green
      chrome.action.setBadgeText({ tabId, text: '✓' });
    } else {
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#ef4444' }); // Red
      chrome.action.setBadgeText({ tabId, text: '!' });
    }
  } catch (error) {
    console.error('Error updating badge:', error);
  }
}

function updateBadgeWithScore(tabId, score) {
  let color, text;
  
  if (score >= 80) {
    color = '#10b981'; // Green
    text = 'A';
  } else if (score >= 60) {
    color = '#3b82f6'; // Blue
    text = 'B';
  } else if (score >= 40) {
    color = '#f59e0b'; // Orange
    text = 'C';
  } else {
    color = '#ef4444'; // Red
    text = 'D';
  }
  
  chrome.action.setBadgeBackgroundColor({ tabId, color });
  chrome.action.setBadgeText({ tabId, text });
}

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('SecureNav extension installed');
  
  // Set default settings
  chrome.storage.local.set({
    settings: {
      showNotifications: true,
      strictMode: false
    }
  });
});
