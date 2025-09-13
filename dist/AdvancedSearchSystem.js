"use strict";
// ==============================
// Advanced Search System Core Class
// ==============================
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSearchSystem = void 0;
class AdvancedSearchSystem {
    constructor() {
        this.engines = new Map();
        this.queries = new Map();
        this.results = new Map();
    }
    /**
     * Creates a new search engine with the specified configuration
     */
    createEngine(name, mode, settings) {
        const id = `engine_${this.engines.size + 1}`;
        const engine = {
            id,
            name,
            version: "1.0",
            mode,
            indexes: [],
            settings,
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                nodeCount: 1,
                shardCount: 1
            }
        };
        this.engines.set(id, engine);
        return engine;
    }
    /**
     * Creates a new search index within the specified engine
     */
    createIndex(engineId, name, type, fields) {
        const engine = this.engines.get(engineId);
        if (!engine) {
            throw new Error(`Engine with ID ${engineId} not found`);
        }
        const index = {
            id: `index_${engine.indexes.length + 1}`,
            name,
            type,
            fields,
            documents: [],
            analyzers: [{ name: "default", type: "text", config: {} }],
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                documentCount: 0,
                sizeMB: 0
            }
        };
        engine.indexes.push(index);
        engine.metadata.updatedAt = new Date();
        return index;
    }
    /**
     * Creates a new search query for the specified engine
     */
    createQuery(engineId, type, text) {
        if (!this.engines.has(engineId)) {
            throw new Error(`Engine with ID ${engineId} not found`);
        }
        const query = {
            id: `query_${this.queries.size + 1}`,
            type,
            text,
            filters: {},
            sort: [],
            page: 1,
            pageSize: 10,
            highlight: false,
            aggregations: [],
            metadata: {
                timestamp: new Date(),
                executionTimeMs: 0,
                cacheHit: false
            }
        };
        this.queries.set(query.id, query);
        return query;
    }
    /**
     * Executes a search query and returns the results
     */
    executeQuery(engineId, queryId) {
        const engine = this.engines.get(engineId);
        const query = this.queries.get(queryId);
        if (!engine || !query) {
            throw new Error("Engine or Query not found");
        }
        const start = Date.now();
        const allDocs = engine.indexes.flatMap(idx => idx.documents);
        let filteredDocs;
        // Apply query type-specific filtering
        switch (query.type) {
            case "full_text":
                filteredDocs = allDocs.filter(doc => JSON.stringify(doc).toLowerCase().includes(query.text.toLowerCase()));
                break;
            case "regex":
                const regex = new RegExp(query.text, "i");
                filteredDocs = allDocs.filter(doc => {
                    // Check each field value for regex match
                    for (const value of Object.values(doc)) {
                        if (regex.test(String(value))) {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            case "fuzzy":
                filteredDocs = allDocs.filter(doc => {
                    // Check each field value for fuzzy match
                    for (const value of Object.values(doc)) {
                        if (this.fuzzyMatch(String(value), query.text)) {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            case "semantic":
                // Placeholder for AI semantic search integration
                filteredDocs = allDocs;
                break;
            default:
                filteredDocs = allDocs;
        }
        // Apply sorting
        for (const sortConfig of query.sort) {
            filteredDocs.sort((a, b) => {
                const av = a[sortConfig.field] ?? "";
                const bv = b[sortConfig.field] ?? "";
                const comparison = String(av).localeCompare(String(bv));
                return sortConfig.order === "asc" ? comparison : -comparison;
            });
        }
        // Apply pagination
        const startIdx = (query.page - 1) * query.pageSize;
        const paginatedDocs = filteredDocs.slice(startIdx, startIdx + query.pageSize);
        // Create result
        const result = {
            id: `result_${this.results.size + 1}`,
            queryId: query.id,
            documents: paginatedDocs,
            total: filteredDocs.length,
            highlights: query.highlight ? this.generateHighlights(paginatedDocs, query.text) : {},
            aggregations: {},
            suggestions: [],
            metadata: {
                timestamp: new Date(),
                processingTimeMs: Date.now() - start,
                scoringAlgorithm: engine.settings.rankingAlgorithm
            }
        };
        // Update query metadata
        query.metadata.executionTimeMs = result.metadata.processingTimeMs;
        this.results.set(result.id, result);
        return result;
    }
    /**
     * Adds a document to the specified index
     */
    addDocument(engineId, indexId, document) {
        const engine = this.engines.get(engineId);
        if (!engine) {
            throw new Error(`Engine with ID ${engineId} not found`);
        }
        const index = engine.indexes.find(idx => idx.id === indexId);
        if (!index) {
            throw new Error(`Index with ID ${indexId} not found`);
        }
        index.documents.push(document);
        index.metadata.documentCount = index.documents.length;
        index.metadata.updatedAt = new Date();
        index.metadata.sizeMB = JSON.stringify(index.documents).length / (1024 * 1024);
    }
    /**
     * Gets all engines
     */
    getEngines() {
        return Array.from(this.engines.values());
    }
    /**
     * Gets a specific engine by ID
     */
    getEngine(engineId) {
        return this.engines.get(engineId);
    }
    /**
     * Gets all queries
     */
    getQueries() {
        return Array.from(this.queries.values());
    }
    /**
     * Gets a specific query by ID
     */
    getQuery(queryId) {
        return this.queries.get(queryId);
    }
    /**
     * Gets all results
     */
    getResults() {
        return Array.from(this.results.values());
    }
    /**
     * Gets a specific result by ID
     */
    getResult(resultId) {
        return this.results.get(resultId);
    }
    // -------------------------------
    // Private utility methods
    // -------------------------------
    /**
     * Generates highlights for search results
     */
    generateHighlights(docs, term) {
        const highlights = {};
        for (const doc of docs) {
            const matches = [];
            for (const [key, value] of Object.entries(doc)) {
                if (String(value).toLowerCase().includes(term.toLowerCase())) {
                    matches.push(`${key}: ${value}`);
                }
            }
            if (matches.length > 0) {
                highlights[JSON.stringify(doc)] = matches;
            }
        }
        return highlights;
    }
    /**
     * Performs fuzzy matching using Levenshtein distance
     */
    fuzzyMatch(text, pattern) {
        const maxDistance = Math.max(2, Math.floor(pattern.length * 0.2)); // Allow up to 20% difference
        const textLower = text.toLowerCase();
        const patternLower = pattern.toLowerCase();
        // Check if pattern is a substring (exact match)
        if (textLower.includes(patternLower)) {
            return true;
        }
        // Check Levenshtein distance for the whole text
        if (this.levenshteinDistance(textLower, patternLower) <= maxDistance) {
            return true;
        }
        // Check if any word in the text matches the pattern with fuzzy logic
        const words = textLower.split(/\s+/);
        for (const word of words) {
            if (this.levenshteinDistance(word, patternLower) <= Math.min(maxDistance, Math.floor(word.length * 0.3))) {
                return true;
            }
        }
        return false;
    }
    /**
     * Calculates Levenshtein distance between two strings
     */
    levenshteinDistance(a, b) {
        const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) {
            dp[i][0] = i;
        }
        for (let j = 0; j <= b.length; j++) {
            dp[0][j] = j;
        }
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
                else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j], // deletion
                    dp[i][j - 1], // insertion
                    dp[i - 1][j - 1] // substitution
                    );
                }
            }
        }
        return dp[a.length][b.length];
    }
}
exports.AdvancedSearchSystem = AdvancedSearchSystem;
