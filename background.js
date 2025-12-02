// AI Reading Assistant Background Service Worker
// Manages extension state, side panel, and caching

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Reading Assistant installed');

    // Set default settings
    chrome.storage.local.set({
        settings: {
            apiKey: '',
            summaryLength: 'medium',
            autoSummarize: false,
            theme: 'auto'
        },
        summaries: []
    });
});

// Update badge based on page content
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
    if (message.type === 'ARTICLE_DETECTED') {
        // Article found on page
        const tabId = sender.tab.id;

        // Store article data
        chrome.storage.local.set({
            [`article_${tabId}`]: message.data
        });

        // Update badge to show article is ready
        chrome.action.setBadgeBackgroundColor({ tabId, color: '#3b82f6' });
        chrome.action.setBadgeText({ tabId, text: '📖' });

    } else if (message.type === 'OPEN_SIDE_PANEL') {
        // Open side panel for reader mode
        chrome.sidePanel.open({ tabId: sender.tab.id });

    } else if (message.type === 'SAVE_SUMMARY') {
        // Save summary to storage
        saveSummary(message.data).then(() => {
            sendResponse({ success: true });
        });
        return true; // Keep channel open for async response
    }
});

// Handle side panel toggle from action
chrome.action.onClicked.addListener(async (tab) => {
    // Toggle side panel
    chrome.sidePanel.open({ tabId: tab.id });
});

async function updateBadge(tabId) {
    try {
        const tab = await chrome.tabs.get(tabId);

        if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
            chrome.action.setBadgeText({ tabId, text: '' });
            return;
        }

        // Check if article data exists for this tab
        const result = await chrome.storage.local.get([`article_${tabId}`]);

        if (result[`article_${tabId}`]) {
            chrome.action.setBadgeBackgroundColor({ tabId, color: '#3b82f6' });
            chrome.action.setBadgeText({ tabId, text: '📖' });
        } else {
            chrome.action.setBadgeText({ tabId, text: '' });
        }
    } catch (error) {
        console.error('Error updating badge:', error);
    }
}

async function saveSummary(summaryData) {
    try {
        const { summaries = [] } = await chrome.storage.local.get(['summaries']);

        // Add new summary with timestamp
        const newSummary = {
            ...summaryData,
            id: Date.now(),
            timestamp: new Date().toISOString()
        };

        summaries.unshift(newSummary);

        // Keep only last 100 summaries
        const trimmedSummaries = summaries.slice(0, 100);

        await chrome.storage.local.set({ summaries: trimmedSummaries });

        console.log('Summary saved successfully');
    } catch (error) {
        console.error('Error saving summary:', error);
    }
}

// Clean up article data when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.storage.local.remove([`article_${tabId}`, `summary_${tabId}`]);
});
