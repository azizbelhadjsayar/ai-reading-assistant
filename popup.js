// AI Reading Assistant Popup Logic

let currentArticle = null;
let currentSummary = null;
let isSpeaking = false;
let speechSynthesis = window.speechSynthesis;

// DOM Elements
const elements = {
    apiWarning: document.getElementById('apiWarning'),
    openSettings: document.getElementById('openSettings'),
    articleInfo: document.getElementById('articleInfo'),
    noArticle: document.getElementById('noArticle'),
    summarySection: document.getElementById('summarySection'),
    loadingState: document.getElementById('loadingState'),
    summaryContent: document.getElementById('summaryContent'),
    articleTitle: document.getElementById('articleTitle'),
    articleAuthor: document.getElementById('articleAuthor'),
    articleWords: document.getElementById('articleWords'),
    readTime: document.getElementById('readTime'),
    summaryMethod: document.getElementById('summaryMethod'),
    summaryText: document.getElementById('summaryText'),
    keyPointsSection: document.getElementById('keyPointsSection'),
    keyPointsList: document.getElementById('keyPointsList'),
    actions: document.getElementById('actions'),
    summarizeBtn: document.getElementById('summarizeBtn'),
    ttsBtn: document.getElementById('ttsBtn'),
    saveBtn: document.getElementById('saveBtn'),
    viewSavedBtn: document.getElementById('viewSavedBtn'),
    settingsBtn: document.getElementById('settingsBtn')
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadArticle();
    setupEventListeners();
    checkAPIKey();
});

async function loadArticle() {
    try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || !tab.id) {
            showNoArticle();
            return;
        }

        // Get article data from storage
        const result = await chrome.storage.local.get([`article_${tab.id}`]);
        currentArticle = result[`article_${tab.id}`];

        if (currentArticle) {
            displayArticle(currentArticle);
        } else {
            showNoArticle();
        }
    } catch (error) {
        console.error('Error loading article:', error);
        showNoArticle();
    }
}

function displayArticle(article) {
    elements.noArticle.style.display = 'none';
    elements.articleInfo.style.display = 'block';
    elements.actions.style.display = 'flex';

    // Display article info
    elements.articleTitle.textContent = article.title;

    if (article.author) {
        elements.articleAuthor.textContent = article.author;
    } else {
        elements.articleAuthor.parentElement.querySelector('.separator').style.display = 'none';
        elements.articleAuthor.style.display = 'none';
    }

    elements.articleWords.textContent = `${article.wordCount.toLocaleString()} words`;

    const readTime = Math.ceil(article.wordCount / 200); // Assuming 200 words/min
    elements.readTime.textContent = `${readTime} min read`;
}

function showNoArticle() {
    elements.noArticle.style.display = 'block';
    elements.articleInfo.style.display = 'none';
    elements.actions.style.display = 'none';
    elements.summarySection.style.display = 'none';
}

async function checkAPIKey() {
    const { settings } = await chrome.storage.local.get(['settings']);

    if (!settings || !settings.apiKey) {
        elements.apiWarning.style.display = 'flex';
    }
}

function setupEventListeners() {
    elements.summarizeBtn.addEventListener('click', generateSummary);
    elements.ttsBtn.addEventListener('click', toggleTTS);
    elements.saveBtn.addEventListener('click', saveSummary);
    elements.viewSavedBtn.addEventListener('click', openSavedSummaries);
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.openSettings.addEventListener('click', openSettings);
}

async function generateSummary() {
    if (!currentArticle) return;

    // Show loading state
    elements.summarySection.style.display = 'block';
    elements.loadingState.style.display = 'block';
    elements.summaryContent.style.display = 'none';
    elements.summarizeBtn.disabled = true;

    try {
        // Get settings
        const { settings } = await chrome.storage.local.get(['settings']);
        const summaryLength = settings?.summaryLength || 'medium';

        let result;

        if (settings?.apiKey) {
            // Use AI Summarization
            try {
                const gemini = new GeminiAPI(settings.apiKey);
                result = await gemini.summarize(currentArticle.content, {
                    length: summaryLength,
                    extractKeyPoints: true
                });
                elements.summaryMethod.textContent = 'AI';
            } catch (error) {
                console.error('AI summarization failed, using fallback:', error);
                result = await fallbackSummarization();
            }
        } else {
            // Use fallback extractive summarization
            result = await fallbackSummarization();
        }

        currentSummary = result;
        displaySummary(result);

    } catch (error) {
        console.error('Error generating summary:', error);
        alert('Failed to generate summary. Please try again.');
    } finally {
        elements.summarizeBtn.disabled = false;
    }
}

async function fallbackSummarization() {
    const summarizer = new ExtractiveSummarizer();
    const result = summarizer.summarize(currentArticle.content, {
        sentenceCount: 5,
        extractKeyPoints: true
    });
    elements.summaryMethod.textContent = 'Extractive';
    return result;
}

function displaySummary(summary) {
    elements.loadingState.style.display = 'none';
    elements.summaryContent.style.display = 'block';

    // Display summary text
    elements.summaryText.textContent = summary.summary;

    // Display key points
    if (summary.keyPoints && summary.keyPoints.length > 0) {
        elements.keyPointsSection.style.display = 'block';
        elements.keyPointsList.innerHTML = '';

        summary.keyPoints.forEach(point => {
            const li = document.createElement('li');
            li.textContent = point;
            elements.keyPointsList.appendChild(li);
        });
    } else {
        elements.keyPointsSection.style.display = 'none';
    }

    // Enable action buttons
    elements.ttsBtn.disabled = false;
    elements.saveBtn.disabled = false;
}

function toggleTTS() {
    if (!currentSummary) return;

    if (isSpeaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
        elements.ttsBtn.classList.remove('speaking');
        elements.ttsBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2"/>
      </svg>
      Listen
    `;
    } else {
        const utterance = new SpeechSynthesisUtterance(currentSummary.summary);
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onend = () => {
            isSpeaking = false;
            elements.ttsBtn.classList.remove('speaking');
            elements.ttsBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2"/>
        </svg>
        Listen
      `;
        };

        speechSynthesis.speak(utterance);
        isSpeaking = true;
        elements.ttsBtn.classList.add('speaking');
        elements.ttsBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
        <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
      </svg>
      Stop
    `;
    }
}

async function saveSummary() {
    if (!currentArticle || !currentSummary) return;

    try {
        const summaryData = {
            url: currentArticle.url,
            title: currentArticle.title,
            author: currentArticle.author,
            summary: currentSummary.summary,
            keyPoints: currentSummary.keyPoints,
            wordCount: currentArticle.wordCount
        };

        // Send to background to save
        await chrome.runtime.sendMessage({
            type: 'SAVE_SUMMARY',
            data: summaryData
        });

        // Show feedback
        const originalText = elements.saveBtn.innerHTML;
        elements.saveBtn.innerHTML = '✓ Saved!';
        elements.saveBtn.disabled = true;

        setTimeout(() => {
            elements.saveBtn.innerHTML = originalText;
            elements.saveBtn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Error saving summary:', error);
        alert('Failed to save summary');
    }
}

function openSavedSummaries() {
    chrome.tabs.create({ url: chrome.runtime.getURL('saved.html') });
}

function openSettings() {
    chrome.runtime.openOptionsPage();
}
