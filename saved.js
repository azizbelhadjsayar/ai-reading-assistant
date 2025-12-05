// Saved Summaries Page Logic

let allSummaries = [];
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const summariesGrid = document.getElementById('summariesGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearAllBtn = document.getElementById('clearAll');
const totalSummariesEl = document.getElementById('totalSummaries');
const totalWordsEl = document.getElementById('totalWords');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadSummaries();
    setupEventListeners();
});

async function loadSummaries() {
    try {
        const { summaries = [] } = await chrome.storage.local.get(['summaries']);
        allSummaries = summaries;
        updateStats();
        renderSummaries();
    } catch (error) {
        console.error('Error loading summaries:', error);
    }
}

function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderSummaries();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderSummaries();
        });
    });

    clearAllBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete all saved summaries? This cannot be undone.')) {
            await chrome.storage.local.set({ summaries: [] });
            allSummaries = [];
            updateStats();
            renderSummaries();
        }
    });
}

function updateStats() {
    totalSummariesEl.textContent = allSummaries.length;
    const totalWords = allSummaries.reduce((sum, s) => sum + (s.wordCount || 0), 0);
    totalWordsEl.textContent = totalWords.toLocaleString();
}

function renderSummaries() {
    const filtered = getFilteredSummaries();

    if (filtered.length === 0) {
        summariesGrid.style.display = 'none';
        emptyState.style.display = 'block';
        if (searchQuery) {
            emptyState.querySelector('h2').textContent = 'No results found';
            emptyState.querySelector('p').textContent = 'Try a different search term';
        } else {
            emptyState.querySelector('h2').textContent = 'No summaries yet';
            emptyState.querySelector('p').textContent = 'Start saving summaries from articles you read to see them here';
        }
        return;
    }

    summariesGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    summariesGrid.innerHTML = filtered.map(summary => createSummaryCard(summary)).join('');

    // Add event listeners
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteSummary(btn.dataset.id));
    });

    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => copySummary(btn.dataset.id));
    });

    document.querySelectorAll('.btn-visit').forEach(btn => {
        btn.addEventListener('click', () => {
            chrome.tabs.create({ url: btn.dataset.url });
        });
    });
}

function getFilteredSummaries() {
    let filtered = [...allSummaries];

    // Apply time filter
    if (currentFilter === 'today') {
        const today = new Date().setHours(0, 0, 0, 0);
        filtered = filtered.filter(s => new Date(s.timestamp).setHours(0, 0, 0, 0) === today);
    } else if (currentFilter === 'week') {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        filtered = filtered.filter(s => new Date(s.timestamp).getTime() > weekAgo);
    }

    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(s => {
            const searchText = `${s.title} ${s.summary} ${s.keyPoints?.join(' ')}`.toLowerCase();
            return searchText.includes(searchQuery);
        });
    }

    return filtered;
}

function createSummaryCard(summary) {
    const date = new Date(summary.timestamp);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const keyPointsHtml = summary.keyPoints && summary.keyPoints.length > 0
        ? `
        <div class="key-points">
            <div class="key-points-title">💡 Key Points</div>
            <ul class="key-points-list">
                ${summary.keyPoints.map(point => `<li>${escapeHtml(point)}</li>`).join('')}
            </ul>
        </div>
    `
        : '';

    return `
        <div class="summary-card">
            <div class="summary-header">
                <div>
                    <div class="summary-title">
                        <a href="${summary.url}" target="_blank">${escapeHtml(summary.title)}</a>
                    </div>
                    <div class="summary-meta">
                        <span class="meta-item">📅 ${formattedDate}</span>
                        <span class="meta-item">🕒 ${formattedTime}</span>
                        ${summary.wordCount ? `<span class="meta-item">📝 ${summary.wordCount.toLocaleString()} words</span>` : ''}
                        ${summary.author ? `<span class="meta-item">✍️ ${escapeHtml(summary.author)}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="summary-text">${escapeHtml(summary.summary)}</div>
            ${keyPointsHtml}
            <div class="summary-actions">
                <button class="btn-action btn-visit" data-url="${summary.url}">
                    🔗 Visit Article
                </button>
                <button class="btn-action btn-copy" data-id="${summary.id}">
                    📋 Copy
                </button>
                <button class="btn-action btn-delete" data-id="${summary.id}">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `;
}

async function deleteSummary(id) {
    if (!confirm('Delete this summary?')) return;

    try {
        const { summaries = [] } = await chrome.storage.local.get(['summaries']);
        const updated = summaries.filter(s => s.id !== parseInt(id));
        await chrome.storage.local.set({ summaries: updated });
        allSummaries = updated;
        updateStats();
        renderSummaries();
    } catch (error) {
        console.error('Error deleting summary:', error);
        alert('Failed to delete summary');
    }
}

async function copySummary(id) {
    const summary = allSummaries.find(s => s.id === parseInt(id));
    if (!summary) return;

    let text = `${summary.title}\n\n${summary.summary}`;

    if (summary.keyPoints && summary.keyPoints.length > 0) {
        text += `\n\nKey Points:\n${summary.keyPoints.map(p => `• ${p}`).join('\n')}`;
    }

    text += `\n\nSource: ${summary.url}`;

    try {
        await navigator.clipboard.writeText(text);
        const btn = document.querySelector(`[data-id="${id}"].btn-copy`);
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Failed to copy to clipboard');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
