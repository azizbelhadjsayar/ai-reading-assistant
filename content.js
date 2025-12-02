// SecureNav Content Script
// Analyzes page security features and sends data to background script

(function () {
    'use strict';

    // Analyze page security
    function analyzeSecurity() {
        const securityData = {
            url: window.location.href,
            protocol: window.location.protocol,
            isHTTPS: window.location.protocol === 'https:',
            timestamp: new Date().toISOString(),

            // Security headers (will be populated from network request if available)
            headers: analyzeHeaders(),

            // Cookies
            cookies: analyzeCookies(),

            // Forms
            forms: analyzeForms(),

            // Mixed content
            mixedContent: checkMixedContent(),

            // Third-party resources
            thirdParty: analyzeThirdParty(),

            // Calculate security score
            securityScore: 0
        };

        // Calculate overall security score
        securityData.securityScore = calculateSecurityScore(securityData);

        // Send to background script
        chrome.runtime.sendMessage({
            type: 'SECURITY_DATA',
            data: securityData
        });

        return securityData;
    }

    function analyzeHeaders() {
        // Note: Content scripts can't access response headers directly
        // This would need to be done via the background script with webRequest API
        // For this demo, we'll return placeholder data
        return {
            csp: false,
            hsts: false,
            xFrameOptions: false,
            xContentTypeOptions: false,
            referrerPolicy: false
        };
    }

    function analyzeCookies() {
        const cookies = document.cookie.split(';').filter(c => c.trim());

        return {
            count: cookies.length,
            hasSecure: document.cookie.includes('Secure'),
            hasHttpOnly: document.cookie.includes('HttpOnly'),
            hasSameSite: document.cookie.includes('SameSite')
        };
    }

    function analyzeForms() {
        const forms = document.querySelectorAll('form');
        const insecureForms = [];

        forms.forEach(form => {
            const action = form.action || window.location.href;
            if (action.startsWith('http://')) {
                insecureForms.push(action);
            }
        });

        return {
            total: forms.length,
            insecure: insecureForms.length,
            insecureActions: insecureForms
        };
    }

    function checkMixedContent() {
        const issues = [];

        // Check images
        const images = document.querySelectorAll('img[src^="http://"]');
        if (images.length > 0) {
            issues.push({ type: 'images', count: images.length });
        }

        // Check scripts
        const scripts = document.querySelectorAll('script[src^="http://"]');
        if (scripts.length > 0) {
            issues.push({ type: 'scripts', count: scripts.length });
        }

        // Check stylesheets
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"][href^="http://"]');
        if (stylesheets.length > 0) {
            issues.push({ type: 'stylesheets', count: stylesheets.length });
        }

        return {
            hasIssues: issues.length > 0,
            issues: issues
        };
    }

    function analyzeThirdParty() {
        const currentDomain = window.location.hostname;
        const thirdPartyDomains = new Set();

        // Check all scripts
        document.querySelectorAll('script[src]').forEach(script => {
            try {
                const url = new URL(script.src);
                if (url.hostname !== currentDomain) {
                    thirdPartyDomains.add(url.hostname);
                }
            } catch (e) {
                // Invalid URL
            }
        });

        // Check all iframes
        document.querySelectorAll('iframe[src]').forEach(iframe => {
            try {
                const url = new URL(iframe.src);
                if (url.hostname !== currentDomain) {
                    thirdPartyDomains.add(url.hostname);
                }
            } catch (e) {
                // Invalid URL
            }
        });

        return {
            count: thirdPartyDomains.size,
            domains: Array.from(thirdPartyDomains)
        };
    }

    function calculateSecurityScore(data) {
        let score = 0;

        // HTTPS (40 points)
        if (data.isHTTPS) {
            score += 40;
        }

        // No insecure forms (20 points)
        if (data.forms.insecure === 0) {
            score += 20;
        } else {
            score -= data.forms.insecure * 5;
        }

        // No mixed content (20 points)
        if (!data.mixedContent.hasIssues) {
            score += 20;
        } else {
            score -= data.mixedContent.issues.length * 5;
        }

        // Reasonable number of cookies (10 points)
        if (data.cookies.count <= 10) {
            score += 10;
        } else if (data.cookies.count <= 20) {
            score += 5;
        }

        // Limited third-party resources (10 points)
        if (data.thirdParty.count <= 5) {
            score += 10;
        } else if (data.thirdParty.count <= 10) {
            score += 5;
        }

        // Clamp score between 0-100
        return Math.max(0, Math.min(100, score));
    }

    // Run analysis when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', analyzeSecurity);
    } else {
        analyzeSecurity();
    }
})();
