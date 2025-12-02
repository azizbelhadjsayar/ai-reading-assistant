// AI Reading Assistant Content Script
// Extracts article content using Mozilla Readability

(function () {
    'use strict';

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', extractArticle);
    } else {
        extractArticle();
    }

    function extractArticle() {
        try {
            // Clone document for Readability (it mutates the DOM)
            const documentClone = document.cloneNode(true);

            // Check if Readability is available (loaded from libs/readability.js)
            if (typeof Readability === 'undefined') {
                console.warn('Readability not loaded, skipping article extraction');
                return;
            }

            // Parse with Readability
            const reader = new Readability(documentClone);
            const article = reader.parse();

            if (article) {
                // Article successfully extracted
                const articleData = {
                    title: article.title || document.title,
                    author: article.byline || extractAuthor(),
                    content: article.textContent,
                    excerpt: article.excerpt,
                    length: article.length,
                    url: window.location.href,
                    siteName: article.siteName || window.location.hostname,
                    publishedTime: extractPublishDate(),
                    wordCount: countWords(article.textContent)
                };

                // Only send if article has substantial content (>200 words)
                if (articleData.wordCount >= 200) {
                    chrome.runtime.sendMessage({
                        type: 'ARTICLE_DETECTED',
                        data: articleData
                    });

                    console.log('Article detected:', articleData.title);
                }
            } else {
                console.log('No article content found on this page');
            }
        } catch (error) {
            console.error('Error extracting article:', error);
        }
    }

    function extractAuthor() {
        // Try various meta tags for author
        const authorMeta = document.querySelector('meta[name="author"]') ||
            document.querySelector('meta[property="article:author"]');

        if (authorMeta) {
            return authorMeta.getAttribute('content');
        }

        return null;
    }

    function extractPublishDate() {
        // Try various meta tags for publish date
        const dateMeta = document.querySelector('meta[property="article:published_time"]') ||
            document.querySelector('meta[name="date"]') ||
            document.querySelector('meta[name="publishdate"]');

        if (dateMeta) {
            return dateMeta.getAttribute('content');
        }

        return null;
    }

    function countWords(text) {
        return text.trim().split(/\s+/).length;
    }

    // Listen for requests to re-extract article
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'EXTRACT_ARTICLE') {
            extractArticle();
            sendResponse({ success: true });
        }
    });
})();
