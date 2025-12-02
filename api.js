// Gemini AI API Integration

class GeminiAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    }

    async summarize(text, options = {}) {
        if (!this.apiKey) {
            throw new Error('API key not configured');
        }

        const {
            length = 'medium',
            extractKeyPoints = true
        } = options;

        // Build prompt based on options
        const prompt = this.buildSummaryPrompt(text, length, extractKeyPoints);

        try {
            const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }

            const data = await response.json();
            const generatedText = data.candidates[0]?.content?.parts[0]?.text;

            if (!generatedText) {
                throw new Error('No response from AI');
            }

            return this.parseResponse(generatedText);

        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    }

    buildSummaryPrompt(text, length, extractKeyPoints) {
        const lengthInstructions = {
            short: 'in 2-3 sentences',
            medium: 'in 1 paragraph (4-6 sentences)',
            long: 'in 2-3 paragraphs'
        };

        let prompt = `Summarize the following article ${lengthInstructions[length]}.\n\n`;

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
