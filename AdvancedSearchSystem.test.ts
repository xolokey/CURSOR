// ==============================
// Advanced Search System Tests
// ==============================

import { AdvancedSearchSystem } from './AdvancedSearchSystem';
import { SearchEngine, SearchIndex } from './interfaces';

describe('AdvancedSearchSystem', () => {
  let searchSystem: AdvancedSearchSystem;
  let engine: SearchEngine;
  let index: SearchIndex;

  beforeEach(() => {
    searchSystem = new AdvancedSearchSystem();
    engine = searchSystem.createEngine('TestEngine', 'standalone', {
      cacheEnabled: true,
      cacheTTL: 60000,
      maxResults: 100,
      timeoutMs: 2000,
      rankingAlgorithm: 'bm25'
    });
    index = searchSystem.createIndex(engine.id, 'TestIndex', 'inverted', ['title', 'content']);
  });

  describe('Engine Management', () => {
    test('should create a new engine', () => {
      expect(engine.id).toBeDefined();
      expect(engine.name).toBe('TestEngine');
      expect(engine.mode).toBe('standalone');
      expect(engine.version).toBe('1.0');
    });

    test('should get engine by id', () => {
      const retrievedEngine = searchSystem.getEngine(engine.id);
      expect(retrievedEngine).toEqual(engine);
    });

    test('should return all engines', () => {
      const engines = searchSystem.getEngines();
      expect(engines).toHaveLength(1);
      expect(engines[0]).toEqual(engine);
    });
  });

  describe('Index Management', () => {
    test('should create a new index', () => {
      expect(index.id).toBeDefined();
      expect(index.name).toBe('TestIndex');
      expect(index.type).toBe('inverted');
      expect(index.fields).toEqual(['title', 'content']);
    });

    test('should throw error when creating index for non-existent engine', () => {
      expect(() => {
        searchSystem.createIndex('invalid-id', 'TestIndex', 'inverted', ['title']);
      }).toThrow('Engine with ID invalid-id not found');
    });

    test('should add documents to index', () => {
      const document = { title: 'Test Document', content: 'This is a test' };
      searchSystem.addDocument(engine.id, index.id, document);
      
      expect(index.documents).toHaveLength(1);
      expect(index.documents[0]).toEqual(document);
      expect(index.metadata.documentCount).toBe(1);
    });
  });

  describe('Query Management', () => {
    test('should create a new query', () => {
      const query = searchSystem.createQuery(engine.id, 'full_text', 'test query');
      
      expect(query.id).toBeDefined();
      expect(query.type).toBe('full_text');
      expect(query.text).toBe('test query');
      expect(query.page).toBe(1);
      expect(query.pageSize).toBe(10);
    });

    test('should throw error when creating query for non-existent engine', () => {
      expect(() => {
        searchSystem.createQuery('invalid-id', 'full_text', 'test');
      }).toThrow('Engine with ID invalid-id not found');
    });

    test('should get query by id', () => {
      const query = searchSystem.createQuery(engine.id, 'full_text', 'test');
      const retrievedQuery = searchSystem.getQuery(query.id);
      expect(retrievedQuery).toEqual(query);
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      // Add test documents
      searchSystem.addDocument(engine.id, index.id, {
        title: 'Machine Learning Basics',
        content: 'Introduction to machine learning algorithms'
      });
      searchSystem.addDocument(engine.id, index.id, {
        title: 'Deep Learning Advanced',
        content: 'Advanced concepts in deep learning and neural networks'
      });
      searchSystem.addDocument(engine.id, index.id, {
        title: 'Data Science Guide',
        content: 'Complete guide to data science and analytics'
      });
    });

    test('should perform full-text search', () => {
      const query = searchSystem.createQuery(engine.id, 'full_text', 'learning');
      const result = searchSystem.executeQuery(engine.id, query.id);
      
      expect(result.total).toBe(2);
      expect(result.documents).toHaveLength(2);
      expect(result.documents.some(doc => doc['title'].includes('Machine Learning'))).toBe(true);
      expect(result.documents.some(doc => doc['title'].includes('Deep Learning'))).toBe(true);
    });

    test('should perform regex search', () => {
      const query = searchSystem.createQuery(engine.id, 'regex', '^Deep.*');
      const result = searchSystem.executeQuery(engine.id, query.id);
      
      expect(result.total).toBe(1);
      expect(result.documents[0]!['title']).toBe('Deep Learning Advanced');
    });

    test('should perform fuzzy search', () => {
      const query = searchSystem.createQuery(engine.id, 'fuzzy', 'machne'); // misspelled "machine"
      const result = searchSystem.executeQuery(engine.id, query.id);
      
      expect(result.total).toBeGreaterThan(0);
      expect(result.documents.some(doc => doc['title'].includes('Machine'))).toBe(true);
    });

    test('should handle pagination', () => {
      const query = searchSystem.createQuery(engine.id, 'full_text', '');
      query.pageSize = 2;
      query.page = 1;
      
      const result = searchSystem.executeQuery(engine.id, query.id);
      
      expect(result.documents).toHaveLength(2);
      expect(result.total).toBe(3);
    });

    test('should handle sorting', () => {
      const query = searchSystem.createQuery(engine.id, 'full_text', '');
      query.sort = [{ field: 'title', order: 'asc' }];
      
      const result = searchSystem.executeQuery(engine.id, query.id);
      
      expect(result.documents).toHaveLength(3);
      expect(result.documents[0]!['title']).toBe('Data Science Guide');
      expect(result.documents[1]!['title']).toBe('Deep Learning Advanced');
      expect(result.documents[2]!['title']).toBe('Machine Learning Basics');
    });

    test('should generate highlights when enabled', () => {
      const query = searchSystem.createQuery(engine.id, 'full_text', 'learning');
      query.highlight = true;
      
      const result = searchSystem.executeQuery(engine.id, query.id);
      
      expect(Object.keys(result.highlights)).toHaveLength(2);
    });

    test('should track performance metrics', () => {
      const query = searchSystem.createQuery(engine.id, 'full_text', 'test');
      const result = searchSystem.executeQuery(engine.id, query.id);
      
      expect(result.metadata.processingTimeMs).toBeGreaterThanOrEqual(0);
      expect(result.metadata.timestamp).toBeInstanceOf(Date);
      expect(result.metadata.scoringAlgorithm).toBe('bm25');
    });
  });

  describe('Error Handling', () => {
    test('should throw error when executing query with invalid engine', () => {
      const query = searchSystem.createQuery(engine.id, 'full_text', 'test');
      
      expect(() => {
        searchSystem.executeQuery('invalid-engine', query.id);
      }).toThrow('Engine or Query not found');
    });

    test('should throw error when executing invalid query', () => {
      expect(() => {
        searchSystem.executeQuery(engine.id, 'invalid-query');
      }).toThrow('Engine or Query not found');
    });

    test('should throw error when adding document to invalid index', () => {
      expect(() => {
        searchSystem.addDocument(engine.id, 'invalid-index', { title: 'test' });
      }).toThrow('Index with ID invalid-index not found');
    });
  });

  describe('Levenshtein Distance Algorithm', () => {
    test('should calculate correct distance for identical strings', () => {
      const system = new AdvancedSearchSystem();
      // Access private method through any cast for testing
      const distance = (system as any).levenshteinDistance('hello', 'hello');
      expect(distance).toBe(0);
    });

    test('should calculate correct distance for different strings', () => {
      const system = new AdvancedSearchSystem();
      const distance = (system as any).levenshteinDistance('kitten', 'sitting');
      expect(distance).toBe(3);
    });
  });
});