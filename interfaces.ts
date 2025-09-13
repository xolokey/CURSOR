// ==============================
// Advanced Search System Interfaces
// ==============================

import { IndexType, QueryType, EngineMode } from './types';

export interface SearchEngine {
  id: string;
  name: string;
  version: string;
  mode: EngineMode;
  indexes: SearchIndex[];
  settings: SearchSettings;
  metadata: EngineMetadata;
}

export interface SearchIndex {
  id: string;
  name: string;
  type: IndexType;
  fields: string[];
  documents: Record<string, any>[];
  analyzers: Analyzer[];
  metadata: IndexMetadata;
}

export interface SearchQuery {
  id: string;
  type: QueryType;
  text: string;
  filters: Record<string, any>;
  sort: { field: string; order: "asc" | "desc" }[];
  page: number;
  pageSize: number;
  highlight: boolean;
  aggregations: string[];
  metadata: QueryMetadata;
}

export interface SearchResult {
  id: string;
  queryId: string;
  documents: Record<string, any>[];
  total: number;
  highlights: Record<string, string[]>;
  aggregations: Record<string, any>;
  suggestions: string[];
  metadata: ResultMetadata;
}

export interface Analyzer {
  name: string;
  type: "text" | "semantic" | "custom";
  config: Record<string, any>;
}

export interface EngineMetadata {
  createdAt: Date;
  updatedAt: Date;
  nodeCount: number;
  shardCount: number;
}

export interface IndexMetadata {
  createdAt: Date;
  updatedAt: Date;
  documentCount: number;
  sizeMB: number;
}

export interface QueryMetadata {
  timestamp: Date;
  executionTimeMs: number;
  cacheHit: boolean;
}

export interface ResultMetadata {
  timestamp: Date;
  processingTimeMs: number;
  scoringAlgorithm: string;
}

export interface SearchSettings {
  cacheEnabled: boolean;
  cacheTTL: number;
  maxResults: number;
  timeoutMs: number;
  rankingAlgorithm: "bm25" | "tfidf" | "neural";
}
