# Advanced Search System

A comprehensive TypeScript-based search engine with multiple query types, indexing strategies, and advanced features.

## Features

- **Multiple Index Types**: Inverted, Vector, Graph, and Hybrid indexing
- **Query Types**: Full-text, Semantic, Fuzzy, and Regex search
- **Engine Modes**: Standalone, Distributed, and Federated configurations
- **Advanced Features**: Highlighting, Pagination, Sorting, and Aggregations
- **Performance Metrics**: Execution time tracking and caching support
- **Fuzzy Matching**: Levenshtein distance-based approximate string matching

## Installation

```bash
npm install
```

## Usage

### Basic Example

```typescript
import { AdvancedSearchSystem } from './AdvancedSearchSystem';

// Create search system
const searchSystem = new AdvancedSearchSystem();

// Create engine
const engine = searchSystem.createEngine("MainEngine", "standalone", {
  cacheEnabled: true,
  cacheTTL: 60000,
  maxResults: 100,
  timeoutMs: 2000,
  rankingAlgorithm: "bm25"
});

// Create index
const index = searchSystem.createIndex(engine.id, "BooksIndex", "inverted", ["title", "author"]);

// Add documents
searchSystem.addDocument(engine.id, index.id, {
  title: "Deep Learning",
  author: "Ian Goodfellow"
});

// Create and execute query
const query = searchSystem.createQuery(engine.id, "full_text", "learning");
const result = searchSystem.executeQuery(engine.id, query.id);

console.log("Search Result:", result);
```

### Query Types

#### Full-Text Search
```typescript
const query = searchSystem.createQuery(engine.id, "full_text", "machine learning");
```

#### Regex Search
```typescript
const query = searchSystem.createQuery(engine.id, "regex", "^Deep.*");
```

#### Fuzzy Search
```typescript
const query = searchSystem.createQuery(engine.id, "fuzzy", "algoritm"); // finds "algorithm"
```

#### Semantic Search
```typescript
const query = searchSystem.createQuery(engine.id, "semantic", "artificial intelligence");
```

### Advanced Features

#### Sorting and Pagination
```typescript
const query = searchSystem.createQuery(engine.id, "full_text", "technology");
query.sort = [{ field: "year", order: "desc" }];
query.page = 1;
query.pageSize = 10;
```

#### Highlighting
```typescript
const query = searchSystem.createQuery(engine.id, "full_text", "learning");
query.highlight = true;
const result = searchSystem.executeQuery(engine.id, query.id);
console.log(result.highlights);
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run the example with ts-node
- `npm start` - Run the compiled example
- `npm test` - Run comprehensive test suite
- `npm run lint` - Lint the code

## Architecture

### Core Classes

- **AdvancedSearchSystem**: Main system coordinator
- **SearchEngine**: Engine configuration and management
- **SearchIndex**: Document storage and indexing
- **SearchQuery**: Query definition and parameters
- **SearchResult**: Search results and metadata

### Types

- **IndexType**: "inverted" | "vector" | "graph" | "hybrid"
- **QueryType**: "full_text" | "semantic" | "fuzzy" | "regex"
- **EngineMode**: "standalone" | "distributed" | "federated"

## Performance

The system includes built-in performance tracking:
- Query execution time
- Result processing time
- Cache hit/miss tracking
- Document count and size metrics

## Future Enhancements

- Vector embeddings for semantic search
- Distributed search across multiple nodes
- Advanced aggregations and faceting
- Real-time indexing
- Machine learning-based ranking
- Query suggestion and auto-completion

## License

MIT