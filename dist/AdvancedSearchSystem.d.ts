import { SearchEngine, SearchIndex, SearchQuery, SearchResult, SearchSettings } from './interfaces';
import { IndexType, QueryType, EngineMode } from './types';
export declare class AdvancedSearchSystem {
    private engines;
    private queries;
    private results;
    /**
     * Creates a new search engine with the specified configuration
     */
    createEngine(name: string, mode: EngineMode, settings: SearchSettings): SearchEngine;
    /**
     * Creates a new search index within the specified engine
     */
    createIndex(engineId: string, name: string, type: IndexType, fields: string[]): SearchIndex;
    /**
     * Creates a new search query for the specified engine
     */
    createQuery(engineId: string, type: QueryType, text: string): SearchQuery;
    /**
     * Executes a search query and returns the results
     */
    executeQuery(engineId: string, queryId: string): SearchResult;
    /**
     * Adds a document to the specified index
     */
    addDocument(engineId: string, indexId: string, document: Record<string, any>): void;
    /**
     * Gets all engines
     */
    getEngines(): SearchEngine[];
    /**
     * Gets a specific engine by ID
     */
    getEngine(engineId: string): SearchEngine | undefined;
    /**
     * Gets all queries
     */
    getQueries(): SearchQuery[];
    /**
     * Gets a specific query by ID
     */
    getQuery(queryId: string): SearchQuery | undefined;
    /**
     * Gets all results
     */
    getResults(): SearchResult[];
    /**
     * Gets a specific result by ID
     */
    getResult(resultId: string): SearchResult | undefined;
    /**
     * Generates highlights for search results
     */
    private generateHighlights;
    /**
     * Performs fuzzy matching using Levenshtein distance
     */
    private fuzzyMatch;
    /**
     * Calculates Levenshtein distance between two strings
     */
    private levenshteinDistance;
}
