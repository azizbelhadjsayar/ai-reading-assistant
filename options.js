// Options Page Logic

document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await loadStats();
    setupEventListeners();
});

async function loadSettings() {
    const { settings } = await chrome.storage.local.get(['settings']);

    if (settings) {
        if (settings.apiKey) {
            document.getElementById('apiKey').value = settings.apiKey;
            showAPIStatus('API Key configured ✓', 'success');
        }

        if (settings.summaryLength) {
            document.getElementById('summaryLength').value = settings.summaryLength;
        }
    }
}

async function loadStats() {
    const { summaries = [] } = await chrome.storage.local.get(['summaries']);

    document.getElementById('totalSummaries').textContent = summaries.length;
    document.getElementById('totalArticles').textContent = summaries.length;
}

function setupEventListeners() {
    document.getElementById('saveApiKey').addEventListener('click', saveAPIKey);
    document.getElementById('savePreferences').addEventListener('click', savePreferences);
    document.getElementById('clearData').addEventListener('click', clearData);
}

async function saveAPIKey() {
    const apiKey = document.getElementById('apiKey').value.trim();

    if (!apiKey) {
        showAPIStatus('Please enter an API key', 'error');
        return;
    }

    try {
        // Get existing settings
        const { settings = {} } = await chrome.storage.local.get(['settings']);

        // Update API key
        settings.apiKey = apiKey;

        await chrome.storage.local.set({ settings });

        showAPIStatus('API Key saved successfully! ✓', 'success');
    } catch (error) {
        console.error('Error saving API key:', error);
        showAPIStatus('Failed to save API key', 'error');
    }
}

async function savePreferences() {
    try {
        const { settings = {} } = await chrome.storage.local.get(['settings']);

        settings.summaryLength = document.getElementById('summaryLength').value;

        await chrome.storage.local.set({ settings });

        showMessage('Preferences saved successfully! ✓');
    } catch (error) {
        console.error('Error saving preferences:', error);
        alert('Failed to save preferences');
    }
}

async function clearData() {
    const confirmed = confirm('Are you sure you want to clear all data? This cannot be undone.');

    if (confirmed) {
        try {
            await chrome.storage.local.clear();

            // Reset to defaults
            await chrome.storage.local.set({
                settings: {
                    apiKey: '',
                    summaryLength: 'medium',
                    autoSummarize: false
                },
                summaries: []
            });

            // Reload page
            window.location.reload();
        } catch (error) {
            console.error('Error clearing data:', error);
            alert('Failed to clear data');
        }
    }
}

function showAPIStatus(message, type) {
    const statusDiv = document.getElementById('apiStatus');
    statusDiv.className = `alert alert-${type === 'success' ? 'success' : 'info'}`;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
}

function showMessage(message) {
    const btn = document.getElementById('savePreferences');
    const originalText = btn.textContent;
    btn.textContent = message;
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    }, 2000);
}
