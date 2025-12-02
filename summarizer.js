// Extractive Summarization (Fallback when no API key)
// Uses TF-IDF algorithm to score and extract important sentences

class ExtractiveSummarizer {
    summarize(text, options = {}) {
        const {
            sentenceCount = 5,
            extractKeyPoints = true
        } = options;

        // Split into sentences
        const sentences = this.splitIntoSentences(text);

        if (sentences.length === 0) {
            return { summary: '', keyPoints: [] };
        }

        // Calculate sentence scores
        const scores = this.calculateSentenceScores(sentences, text);

        // Get top sentences
        const topSentences = this.getTopSentences(sentences, scores, sentenceCount);

        // Create summary maintaining original order
        const summary = topSentences
            .sort((a, b) => a.index - b.index)
            .map(s => s.sentence)
            .join(' ');

        // Extract key points
        const keyPoints = extractKeyPoints
            ? this.extractKeyPhrases(text, 5)
            : [];

        return {
            summary,
            keyPoints
        };
    }

    splitIntoSentences(text) {
        // Simple sentence splitting (can be improved)
        return text
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 20); // Filter out very short sentences
    }

    calculateSentenceScores(sentences, fullText) {
        // Calculate TF-IDF scores for each sentence
        const words = this.tokenize(fullText);
        const wordFreq = this.calculateWordFrequency(words);

        return sentences.map(sentence => {
            const sentenceWords = this.tokenize(sentence);
            let score = 0;

            sentenceWords.forEach(word => {
                // Simple TF-IDF approximation
                const tf = wordFreq[word] || 0;
                score += tf;
            });

            // Normalize by sentence length
            return score / Math.max(sentenceWords.length, 1);
        });
    }

    getTopSentences(sentences, scores, count) {
        return sentences
            .map((sentence, index) => ({ sentence, score: scores[index], index }))
            .sort((a, b) => b.score - a.score)
            .slice(0, Math.min(count, sentences.length));
    }

    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !this.isStopWord(word));
    }

    calculateWordFrequency(words) {
        const freq = {};
        words.forEach(word => {
            freq[word] = (freq[word] || 0) + 1;
        });
        return freq;
    }

    isStopWord(word) {
        const stopWords = new Set([
            'the', 'and', 'that', 'this', 'with', 'for', 'are', 'was',
            'been', 'have', 'has', 'had', 'from', 'they', 'their', 'there',
            'will', 'would', 'could', 'should', 'which', 'what', 'when',
            'where', 'who', 'why', 'how', 'about', 'into', 'through'
        ]);
        return stopWords.has(word);
    }

    extractKeyPhrases(text, count = 5) {
        const words = this.tokenize(text);
        const wordFreq = this.calculateWordFrequency(words);

        // Get top words
        const topWords = Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(([word]) => word);

        // Convert to readable phrases
        return topWords.map(word => {
            // Capitalize first letter
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
    }
}
