// Gemini AI API Integration

class GeminiAPI {
    constructor(apiKey) {
        this.apiKey = apiKey || 'AIzaSyDiV_Mi1gCvOhq7uFovtBK4XM6AjO5ksKc';
        this.models = [
            'gemini-1.5-flash',
            'gemini-1.5-flash-002',
            'gemini-1.0-pro',
            'gemini-pro'
        ];
        this.cachedModelList = null;
        this.currentModelIndex = 0;
        this.apiVersions = ['v1beta', 'v1'];
    }

    async summarize(text, options = {}) {
        if (!this.apiKey) {
            throw new Error('API key not configured');
        }

        const { length = 'medium', extractKeyPoints = true, language = 'unknown' } = options;
        const prompt = this.buildSummaryPrompt(text, length, extractKeyPoints, language);

        // Try models sequentially until one works
        const modelsToTry = await this.getModelsToTry();
        let lastError = null;
        for (let i = 0; i < modelsToTry.length; i++) {
            const model = modelsToTry[i];
            console.log(`Attempting summarization with model: ${model}`);

            try {
                const result = await this.callApi(model, prompt);
                console.log(`Success with model: ${model}`);
                return result;
            } catch (error) {
                console.warn(`Failed with model ${model}:`, error.message);
                lastError = error;

                // If it's not a "not found" error (e.g. quota, auth), stop trying
                if (!error.message.includes('not found') && !error.message.includes('not supported')) {
                    throw error;
                }
            }
        }

        throw lastError || new Error('All models failed');
    }

    async getModelsToTry() {
        if (this.cachedModelList) {
            return this.cachedModelList;
        }

        const staticModels = [...this.models];
        const dynamicModels = await this.fetchAvailableModels().catch((error) => {
            console.warn('Unable to fetch model list:', error.message);
            return [];
        });

        const combined = [...dynamicModels, ...staticModels];
        const seen = new Set();
        const uniqueModels = combined.filter((model) => {
            if (!model) {
                return false;
            }
            const cleanName = model.startsWith('models/') ? model.replace('models/', '') : model;
            if (seen.has(cleanName)) {
                return false;
            }
            seen.add(cleanName);
            return true;
        }).map((model) => model.replace('models/', ''));

        this.cachedModelList = uniqueModels;
        return this.cachedModelList;
    }

    async callApi(model, prompt) {
        let lastError = null;

        for (const version of this.apiVersions) {
            const baseURL = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent`;

            try {
                const response = await fetch(`${baseURL}?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.3,
                            maxOutputTokens: 1024
                        }
                    })
                });

                if (!response.ok) {
                    const errorPayload = await this.safeParse(response);
                    const message = errorPayload?.error?.message || `Request failed with status ${response.status}`;

                    // Store error and try next API version for 404s (model/version mismatch)
                    if (response.status === 404 || /model.*not (found|exist)/i.test(message)) {
                        lastError = new Error(`${message} (version ${version})`);
                        continue;
                    }

                    // Improve common permission/quota messages
                    if (response.status === 403) {
                        throw new Error(`Access denied for model "${model}". Verify that billing is enabled and the Generative Language API is activated for this key. (${message})`);
                    }

                    if (response.status === 429) {
                        throw new Error(`Quota exceeded for Gemini API. Please slow down or review usage limits. (${message})`);
                    }

                    throw new Error(message);
                }

                const data = await response.json();
                const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!generatedText) {
                    throw new Error('No text returned by Gemini API');
                }

                return this.parseResponse(generatedText);

            } catch (error) {
                if (error instanceof Error) {
                    // Propagate fetch/network errors immediately except when trying next version
                    if (error.message && /version/i.test(error.message) === false && lastError === null) {
                        throw error;
                    }
                    lastError = error;
                }
            }
        }

        throw lastError || new Error(`API request failed for model "${model}"`);
    }

    async safeParse(response) {
        try {
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    async fetchAvailableModels() {
        for (const version of this.apiVersions) {
            const listURL = `https://generativelanguage.googleapis.com/${version}/models?key=${this.apiKey}`;

            try {
                const response = await fetch(listURL);

                if (!response.ok) {
                    const errorPayload = await this.safeParse(response);
                    const message = errorPayload?.error?.message || `Unable to list models (${response.status})`;

                    // 404 on list means this API version is not available; try the next one
                    if (response.status === 404) {
                        continue;
                    }

                    throw new Error(message);
                }

                const payload = await response.json();
                const models = payload.models || [];

                const supportedModels = models
                    .filter((model) => Array.isArray(model.supportedGenerationMethods) && model.supportedGenerationMethods.includes('generateContent'))
                    .map((model) => model.name) // returns "models/..."
                    .sort((a, b) => a.localeCompare(b));

                if (supportedModels.length > 0) {
                    console.log(`Fetched ${supportedModels.length} Gemini models from ${version}`);
                    return supportedModels;
                }

            } catch (error) {
                console.warn(`Failed to fetch models from ${version}:`, error.message || error);
            }
        }

        return [];
    }

    buildSummaryPrompt(text, length, extractKeyPoints, languageHint = 'unknown') {
        const lengthInstructions = {
            short: 'in 2-3 sentences',
            medium: 'in 1 paragraph (4-6 sentences)',
            long: 'in 2-3 paragraphs'
        };

        let prompt = `Summarize the following article ${lengthInstructions[length]}.\n\n`;

        const languageInstruction = this.languageInstruction(languageHint);
        prompt += `${languageInstruction}\n\n`;

        if (extractKeyPoints) {
            prompt += `Then, extract 3-5 key points in bullet format.\n\n`;
            prompt += `Format your response as:\n`;
            prompt += `SUMMARY:\n[Your summary here]\n\n`;
            prompt += `KEY POINTS:\n- [Point 1]\n- [Point 2]\n...\n\n`;
        } else {
            prompt += `Provide only the summary.\n\n`;
        }

        // Truncate article if too long (Gemini has token limits)
        const maxChars = 20000;
        const truncatedText = text.length > maxChars
            ? text.substring(0, maxChars) + '...'
            : text;

        prompt += `ARTICLE:\n${truncatedText}`;

        return prompt;
    }

    languageInstruction(languageHint) {
        const languageNames = {
            fr: 'French',
            en: 'English'
        };

        if (languageHint && languageHint !== 'unknown' && languageNames[languageHint]) {
            return `Write the summary and key points strictly in ${languageNames[languageHint]}.`;
        }

        return 'Detect the article language and write both the summary and key points in that same language. If unsure, default to English.';
    }

    parseResponse(text) {
        const result = {
            summary: '',
            keyPoints: []
        };

        // Try to extract summary and key points
        const summaryMatch = text.match(/SUMMARY:?\s*([\s\S]*?)(?=KEY POINTS:|$)/i);
        const keyPointsMatch = text.match(/KEY POINTS:?\s*([\s\S]*)/i);

        if (summaryMatch) {
            result.summary = summaryMatch[1].trim();
        } else {
            // If no structured format, use entire response as summary
            const lines = text.split('\n');
            const bulletPoints = lines.filter(line => line.trim().match(/^[-*•]/));

            if (bulletPoints.length > 0) {
                // Separate bullets from summary
                result.summary = lines.filter(line => !line.trim().match(/^[-*•]/)).join('\n').trim();
                result.keyPoints = bulletPoints.map(point => point.replace(/^[-*•]\s*/, '').trim());
            } else {
                result.summary = text.trim();
            }
        }

        if (keyPointsMatch) {
            const keyPointsText = keyPointsMatch[1];
            result.keyPoints = keyPointsText
                .split('\n')
                .filter(line => line.trim().match(/^[-*•]/))
                .map(line => line.replace(/^[-*•]\s*/, '').trim())
                .filter(point => point.length > 0);
        }

        return result;
    }
}
