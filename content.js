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
            // Skip search result pages and non-article pages
            const url = window.location.href;

            // Blacklist: pages that should NOT be processed
            const blacklistedPatterns = [
                /google\.(com|fr|co\.uk|ca|de|it|es)\/search/i,  // Google search results
                /bing\.com\/search/i,                            // Bing search  
                /yahoo\.com\/search/i,                           // Yahoo search
                /duckduckgo\.com/i,                              // DuckDuckGo
                /twitter\.com|x\.com/i,                          // Twitter/X feeds
                /facebook\.com/i,                                // Facebook
                /instagram\.com/i,                               // Instagram  
                /reddit\.com\/r\/\w+\/?$/i,                      // Reddit subreddit pages
                /youtube\.com/i                                  // YouTube
            ];

            // Check if URL matches blacklist
            if (blacklistedPatterns.some(pattern => pattern.test(url))) {
                console.log('Skipping blacklisted page (search/social):', url);
                return;
            }

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

                // Only send if article has substantial content (>300 words)
                // This filters out search results and snippet pages
                if (articleData.wordCount >= 300) {
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
