// SecureNav Popup Script
// Displays security information and handles user interactions

document.addEventListener('DOMContentLoaded', async () => {
    await loadSecurityData();
});

async function loadSecurityData() {
    try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || !tab.id) {
            showError('Impossible d\'analyser cette page');
            return;
        }

        // Check if it's a browser internal page
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
            showError('Les pages internes du navigateur ne peuvent pas être analysées');
            return;
        }

        // Retrieve security data from storage
        const result = await chrome.storage.local.get([`security_${tab.id}`]);
        const securityData = result[`security_${tab.id}`];

        if (securityData) {
            displaySecurityData(securityData);
        } else {
            // Data not yet available, inject content script manually if needed
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                });

                // Wait a bit for analysis
                setTimeout(async () => {
                    const retryResult = await chrome.storage.local.get([`security_${tab.id}`]);
                    const retryData = retryResult[`security_${tab.id}`];
                    if (retryData) {
                        displaySecurityData(retryData);
                    } else {
                        showError('Analyse en cours...');
                    }
                }, 1000);
            } catch (error) {
                console.error('Error executing content script:', error);
                showBasicInfo(tab);
            }
        }
    } catch (error) {
        console.error('Error loading security data:', error);
        showError('Erreur lors du chargement des données');
    }
}

function displaySecurityData(data) {
    // Update security score
    updateSecurityScore(data.securityScore);

    // Update HTTPS status
    const httpsIcon = document.getElementById('httpsIcon');
    const httpsStatus = document.getElementById('httpsStatus');

    if (data.isHTTPS) {
        httpsIcon.classList.add('secure');
        httpsStatus.textContent = 'Sécurisé (HTTPS)';
        httpsStatus.style.color = 'var(--success)';
    } else {
        httpsIcon.classList.add('danger');
        httpsStatus.textContent = 'Non sécurisé (HTTP)';
        httpsStatus.style.color = 'var(--danger)';
    }

    // Update cookies
    const cookieCount = document.getElementById('cookieCount');
    cookieCount.textContent = `${data.cookies.count} cookie${data.cookies.count !== 1 ? 's' : ''}`;

    // Update trackers
    const trackerCount = document.getElementById('trackerCount');
    trackerCount.textContent = `${data.thirdParty.count} domaine${data.thirdParty.count !== 1 ? 's' : ''}`;

    // Update forms
    const formStatus = document.getElementById('formStatus');
    if (data.forms.insecure > 0) {
        formStatus.textContent = `${data.forms.insecure} non sécurisé${data.forms.insecure !== 1 ? 's' : ''}`;
        formStatus.style.color = 'var(--danger)';
    } else if (data.forms.total > 0) {
        formStatus.textContent = `${data.forms.total} sécurisé${data.forms.total !== 1 ? 's' : ''}`;
        formStatus.style.color = 'var(--success)';
    } else {
        formStatus.textContent = 'Aucun formulaire';
        formStatus.style.color = 'var(--text-secondary)';
    }

    // Show recommendations
    showRecommendations(data);
}

function updateSecurityScore(score) {
    const scoreValue = document.getElementById('scoreValue');
    const scoreLabel = document.getElementById('scoreLabel');
    const scoreRing = document.getElementById('scoreRing');

    // Animate score
    let currentScore = 0;
    const duration = 1000;
    const increment = score / (duration / 16);

    const animation = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
            currentScore = score;
            clearInterval(animation);
        }
        scoreValue.textContent = Math.round(currentScore);
    }, 16);

    // Update ring progress
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;
    scoreRing.style.strokeDashoffset = offset;

    // Update color and label based on score
    if (score >= 80) {
        scoreRing.style.stroke = 'var(--success)';
        scoreLabel.textContent = 'Excellente sécurité';
        scoreLabel.className = 'score-label excellent';
    } else if (score >= 60) {
        scoreRing.style.stroke = 'var(--info)';
        scoreLabel.textContent = 'Bonne sécurité';
        scoreLabel.className = 'score-label good';
    } else if (score >= 40) {
        scoreRing.style.stroke = 'var(--warning)';
        scoreLabel.textContent = 'Sécurité moyenne';
        scoreLabel.className = 'score-label warning';
    } else {
        scoreRing.style.stroke = 'var(--danger)';
        scoreLabel.textContent = 'Sécurité faible';
        scoreLabel.className = 'score-label danger';
    }
}

function showRecommendations(data) {
    const recommendations = [];

    if (!data.isHTTPS) {
        recommendations.push('Cette page n\'utilise pas HTTPS. Évitez de soumettre des informations sensibles.');
    }

    if (data.forms.insecure > 0) {
        recommendations.push(`${data.forms.insecure} formulaire${data.forms.insecure !== 1 ? 's' : ''} envoie${data.forms.insecure === 1 ? '' : 'nt'} des données de manière non sécurisée.`);
    }

    if (data.mixedContent.hasIssues) {
        recommendations.push('Cette page contient du contenu mixte (HTTP sur HTTPS), ce qui peut compromettre la sécurité.');
    }

    if (data.cookies.count > 20) {
        recommendations.push(`${data.cookies.count} cookies détectés. Un nombre élevé peut indiquer un suivi excessif.`);
    }

    if (data.thirdParty.count > 10) {
        recommendations.push(`${data.thirdParty.count} domaines tiers chargent du contenu. Cela peut affecter votre vie privée.`);
    }

    if (recommendations.length > 0) {
        const recommendationsSection = document.getElementById('recommendations');
        const recommendationsList = document.getElementById('recommendationsList');

        recommendationsList.innerHTML = '';
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            recommendationsList.appendChild(li);
        });

        recommendationsSection.style.display = 'block';
    }
}

function showBasicInfo(tab) {
    const isHTTPS = tab.url.startsWith('https://');

    // Show basic HTTPS status
    const httpsIcon = document.getElementById('httpsIcon');
    const httpsStatus = document.getElementById('httpsStatus');

    if (isHTTPS) {
        httpsIcon.classList.add('secure');
        httpsStatus.textContent = 'Sécurisé (HTTPS)';
        httpsStatus.style.color = 'var(--success)';
        updateSecurityScore(60);
    } else {
        httpsIcon.classList.add('danger');
        httpsStatus.textContent = 'Non sécurisé (HTTP)';
        httpsStatus.style.color = 'var(--danger)';
        updateSecurityScore(20);
    }

    document.getElementById('cookieCount').textContent = 'Analyse...';
    document.getElementById('trackerCount').textContent = 'Analyse...';
    document.getElementById('formStatus').textContent = 'Analyse...';
}

function showError(message) {
    const scoreValue = document.getElementById('scoreValue');
    const scoreLabel = document.getElementById('scoreLabel');

    scoreValue.textContent = '--';
    scoreLabel.textContent = message;
    scoreLabel.className = 'score-label';

    document.getElementById('httpsStatus').textContent = 'N/A';
    document.getElementById('cookieCount').textContent = 'N/A';
    document.getElementById('trackerCount').textContent = 'N/A';
    document.getElementById('formStatus').textContent = 'N/A';
}
