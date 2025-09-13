// ==============================
// Advanced Search System Example Usage
// ==============================

import { AdvancedSearchSystem } from './AdvancedSearchSystem';

// Create a new search system instance
const searchSystem = new AdvancedSearchSystem();

// Create a search engine
const engine = searchSystem.createEngine("MainEngine", "standalone", {
  cacheEnabled: true,
  cacheTTL: 60000,
  maxResults: 100,
  timeoutMs: 2000,
  rankingAlgorithm: "bm25"
});

console.log("Created engine:", engine.id, engine.name);

// Create an index for books
const booksIndex = searchSystem.createIndex(engine.id, "BooksIndex", "inverted", ["title", "author", "genre", "year"]);

// Add some sample documents
searchSystem.addDocument(engine.id, booksIndex.id, {
  id: 1,
  title: "Deep Learning",
  author: "Ian Goodfellow",
  genre: "Technology",
  year: 2016,
  description: "A comprehensive guide to deep learning and neural networks"
});

searchSystem.addDocument(engine.id, booksIndex.id, {
  id: 2,
  title: "Introduction to Algorithms",
  author: "Thomas H. Cormen",
  genre: "Computer Science",
  year: 2009,
  description: "The definitive guide to algorithms and data structures"
});

searchSystem.addDocument(engine.id, booksIndex.id, {
  id: 3,
  title: "Machine Learning Yearning",
  author: "Andrew Ng",
  genre: "Technology",
  year: 2018,
  description: "Practical advice for machine learning projects"
});

searchSystem.addDocument(engine.id, booksIndex.id, {
  id: 4,
  title: "The Art of Computer Programming",
  author: "Donald Knuth",
  genre: "Computer Science",
  year: 1968,
  description: "Multi-volume work on computer programming algorithms"
});

console.log("Added documents to index. Total documents:", booksIndex.documents.length);

// Example 1: Full-text search
console.log("\n=== Full-text Search Example ===");
const fullTextQuery = searchSystem.createQuery(engine.id, "full_text", "learning");
fullTextQuery.highlight = true;
fullTextQuery.pageSize = 5;

const fullTextResult = searchSystem.executeQuery(engine.id, fullTextQuery.id);
console.log("Full-text search for 'learning':");
console.log("Total results:", fullTextResult.total);
console.log("Documents found:", fullTextResult.documents.map(doc => doc['title']));
console.log("Processing time:", fullTextResult.metadata.processingTimeMs + "ms");

// Example 2: Regex search
console.log("\n=== Regex Search Example ===");
const regexQuery = searchSystem.createQuery(engine.id, "regex", "^(Deep|Machine).*");
const regexResult = searchSystem.executeQuery(engine.id, regexQuery.id);
console.log("Regex search for titles starting with 'Deep' or 'Machine':");
console.log("Documents found:", regexResult.documents.map(doc => doc['title']));

// Example 3: Fuzzy search
console.log("\n=== Fuzzy Search Example ===");
const fuzzyQuery = searchSystem.createQuery(engine.id, "fuzzy", "algoritm"); // misspelled "algorithm"
const fuzzyResult = searchSystem.executeQuery(engine.id, fuzzyQuery.id);
console.log("Fuzzy search for 'algoritm' (misspelled):");
console.log("Documents found:", fuzzyResult.documents.map(doc => doc['title']));

// Example 4: Search with sorting
console.log("\n=== Sorted Search Example ===");
const sortedQuery = searchSystem.createQuery(engine.id, "full_text", "computer");
sortedQuery.sort = [{ field: "year", order: "desc" }];
sortedQuery.pageSize = 10;

const sortedResult = searchSystem.executeQuery(engine.id, sortedQuery.id);
console.log("Search for 'computer' sorted by year (newest first):");
sortedResult.documents.forEach(doc => {
  console.log(`- ${doc['title']} (${doc['year']}) by ${doc['author']}`);
});

// Example 5: Pagination
console.log("\n=== Pagination Example ===");
const paginatedQuery = searchSystem.createQuery(engine.id, "full_text", "");
paginatedQuery.pageSize = 2;
paginatedQuery.page = 1;

const page1Result = searchSystem.executeQuery(engine.id, paginatedQuery.id);
console.log("Page 1 (2 items per page):");
page1Result.documents.forEach(doc => console.log(`- ${doc['title']}`));

paginatedQuery.page = 2;
const page2Result = searchSystem.executeQuery(engine.id, paginatedQuery.id);
console.log("Page 2 (2 items per page):");
page2Result.documents.forEach(doc => console.log(`- ${doc['title']}`));

// Example 6: Multiple indexes
console.log("\n=== Multiple Indexes Example ===");
const articlesIndex = searchSystem.createIndex(engine.id, "ArticlesIndex", "inverted", ["title", "content", "tags"]);

searchSystem.addDocument(engine.id, articlesIndex.id, {
  id: 5,
  title: "The Future of AI",
  content: "Artificial intelligence is rapidly evolving with deep learning breakthroughs",
  tags: ["AI", "technology", "future"],
  type: "article"
});

searchSystem.addDocument(engine.id, articlesIndex.id, {
  id: 6,
  title: "Algorithm Optimization Techniques",
  content: "Various methods to optimize algorithm performance and efficiency",
  tags: ["algorithms", "optimization", "performance"],
  type: "article"
});

const multiIndexQuery = searchSystem.createQuery(engine.id, "full_text", "algorithm");
const multiIndexResult = searchSystem.executeQuery(engine.id, multiIndexQuery.id);
console.log("Search across multiple indexes for 'algorithm':");
multiIndexResult.documents.forEach(doc => {
  console.log(`- ${doc['title']} (${doc['type'] || 'book'})`);
});

// Display system statistics
console.log("\n=== System Statistics ===");
const engines = searchSystem.getEngines();
console.log("Total engines:", engines.length);

engines.forEach(eng => {
  console.log(`Engine: ${eng.name}`);
  console.log(`  Indexes: ${eng.indexes.length}`);
  eng.indexes.forEach(idx => {
    console.log(`    - ${idx.name}: ${idx.metadata.documentCount} documents (${idx.metadata.sizeMB.toFixed(2)} MB)`);
  });
});

const queries = searchSystem.getQueries();
console.log("Total queries executed:", queries.length);

const results = searchSystem.getResults();
console.log("Total results generated:", results.length);

export { searchSystem };