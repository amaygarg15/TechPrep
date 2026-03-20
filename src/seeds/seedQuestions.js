const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

const questions = [
  // ─── Easy Questions (Free) ───
  {
    title: 'What is the difference between var, let, and const in JavaScript?',
    difficulty: 'easy',
    isPremium: false,
    answer:
      '`var` is function-scoped and hoisted, `let` is block-scoped and not hoisted to the top in the same way, and `const` is block-scoped and cannot be reassigned after initialization. Use `const` by default, `let` when reassignment is needed, and avoid `var` in modern code.',
  },
  {
    title: 'What is the purpose of the `this` keyword in JavaScript?',
    difficulty: 'easy',
    isPremium: false,
    answer:
      '`this` refers to the object that is currently executing the function. In a method, `this` refers to the owner object. In a standalone function (non-strict), it refers to the global object. Arrow functions do not have their own `this` — they inherit it from the enclosing scope.',
  },
  {
    title: 'What are RESTful APIs?',
    difficulty: 'easy',
    isPremium: false,
    answer:
      'REST (Representational State Transfer) is an architectural style for designing network applications. RESTful APIs use HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations on resources identified by URIs. Key principles include statelessness, uniform interface, and resource-based URLs.',
  },
  {
    title: 'Explain the event loop in Node.js.',
    difficulty: 'easy',
    isPremium: false,
    answer:
      'The event loop is the mechanism that allows Node.js to perform non-blocking I/O operations. It continuously checks the call stack and callback queue. When the call stack is empty, it pushes callbacks from the queue to the stack for execution. This enables Node.js to handle concurrent operations on a single thread.',
  },

  // ─── Medium Questions (Free) ───
  {
    title: 'What is the difference between SQL and NoSQL databases?',
    difficulty: 'medium',
    isPremium: false,
    answer:
      'SQL databases are relational, table-based, and use structured schemas (e.g., PostgreSQL, MySQL). NoSQL databases are non-relational and can be document-based (MongoDB), key-value (Redis), column-family (Cassandra), or graph-based (Neo4j). SQL is better for complex queries and ACID transactions; NoSQL excels at horizontal scaling and flexible schemas.',
  },
  {
    title: 'Explain middleware in Express.js.',
    difficulty: 'medium',
    isPremium: false,
    answer:
      'Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function (next). They can execute code, modify req/res, end the request-response cycle, or call next(). Types include application-level, router-level, error-handling, built-in, and third-party middleware.',
  },
  {
    title: 'What are Promises and how do they differ from callbacks?',
    difficulty: 'medium',
    isPremium: false,
    answer:
      'Promises represent the eventual completion (or failure) of an asynchronous operation. Unlike callbacks, Promises avoid "callback hell" by providing .then() and .catch() chaining. They have three states: pending, fulfilled, and rejected. async/await is syntactic sugar over Promises that makes asynchronous code look synchronous.',
  },

  // ─── Medium Questions (Premium) ───
  {
    title: 'How does indexing work in MongoDB?',
    difficulty: 'medium',
    isPremium: true,
    answer:
      'MongoDB indexes are B-tree data structures that store a small portion of the collection data in an easy-to-traverse form. They improve query performance by reducing the number of documents scanned. Types include single field, compound, multikey (for arrays), text, geospatial, and hashed indexes. Without indexes, MongoDB performs a collection scan. Use explain() to analyze query performance.',
  },
  {
    title: 'Explain JWT authentication flow in a Node.js application.',
    difficulty: 'medium',
    isPremium: true,
    answer:
      'JWT (JSON Web Token) authentication flow: 1) User sends credentials to login endpoint. 2) Server validates credentials and generates a JWT containing user claims, signed with a secret key. 3) Token is sent back to the client. 4) Client stores the token (localStorage/cookie) and includes it in subsequent requests via Authorization header. 5) Server middleware verifies the token signature and expiry before granting access. JWTs are stateless — the server does not need to store session data.',
  },

  // ─── Hard Questions (Free) ───
  {
    title: 'What is the CAP theorem?',
    difficulty: 'hard',
    isPremium: false,
    answer:
      'The CAP theorem states that a distributed data store cannot simultaneously provide more than two of the following three guarantees: Consistency (all nodes see the same data at the same time), Availability (every request receives a response), and Partition tolerance (the system continues to operate despite network failures). In practice, since network partitions are unavoidable, systems must choose between CP (consistency + partition tolerance) and AP (availability + partition tolerance).',
  },
  {
    title: 'Explain the differences between horizontal and vertical scaling.',
    difficulty: 'hard',
    isPremium: false,
    answer:
      'Vertical scaling (scaling up) means adding more resources (CPU, RAM) to an existing server. Horizontal scaling (scaling out) means adding more servers to distribute the load. Vertical has hardware limits and a single point of failure. Horizontal offers better fault tolerance and near-infinite scalability but adds complexity with load balancing, data consistency, and distributed systems challenges. Most modern architectures prefer horizontal scaling.',
  },

  // ─── Hard Questions (Premium) ───
  {
    title: 'How would you design a rate limiter for a distributed system?',
    difficulty: 'hard',
    isPremium: true,
    answer:
      'A distributed rate limiter can use algorithms like Token Bucket, Leaky Bucket, Fixed Window, or Sliding Window. For distributed systems, use a centralized store like Redis to track request counts atomically. Key considerations: 1) Use MULTI/EXEC or Lua scripts in Redis for atomicity. 2) Sliding window log or sliding window counter provides the best accuracy. 3) Handle race conditions with distributed locks or atomic operations. 4) Consider using a separate rate-limiting service. 5) Return 429 Too Many Requests with Retry-After header.',
  },
  {
    title: 'Explain microservices architecture and its trade-offs.',
    difficulty: 'hard',
    isPremium: true,
    answer:
      'Microservices architecture decomposes an application into small, independently deployable services, each owning its own data and business logic. Benefits: independent deployment, technology diversity, fault isolation, team autonomy, and scalability per service. Trade-offs: increased operational complexity, distributed system challenges (network latency, data consistency), inter-service communication overhead, debugging difficulty, and the need for service discovery, API gateways, and distributed tracing. Not suitable for small teams or simple applications.',
  },
  {
    title: 'What are database transactions and how does ACID work?',
    difficulty: 'hard',
    isPremium: true,
    answer:
      'A database transaction is a sequence of operations treated as a single unit of work. ACID properties: Atomicity (all operations succeed or all fail), Consistency (database moves from one valid state to another), Isolation (concurrent transactions do not interfere with each other — achieved through locking or MVCC), Durability (committed changes survive system failures — achieved through write-ahead logging). Isolation levels from weakest to strongest: Read Uncommitted, Read Committed, Repeatable Read, Serializable. Higher isolation = more consistency but lower concurrency.',
  },
  {
    title: 'How do you handle memory leaks in a Node.js application?',
    difficulty: 'hard',
    isPremium: true,
    answer:
      'Common causes of memory leaks in Node.js: 1) Global variables accumulating data. 2) Closures retaining references. 3) Event listeners not being removed. 4) Unreleased timers/intervals. 5) Large buffers or caches without eviction. Detection: use --inspect flag with Chrome DevTools, take heap snapshots, use process.memoryUsage(). Tools: clinic.js, memwatch-next, heapdump. Prevention: use WeakMap/WeakSet, implement LRU caches, set maxListeners, always clear intervals/timeouts, stream large files instead of buffering.',
  },
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert seed data
    const inserted = await Question.insertMany(questions);
    console.log(`Seeded ${inserted.length} questions successfully`);

    // Summary
    const freeCount = inserted.filter((q) => !q.isPremium).length;
    const premiumCount = inserted.filter((q) => q.isPremium).length;
    console.log(`   Free questions: ${freeCount}`);
    console.log(`   Premium questions: ${premiumCount}`);
    console.log(
      `   Difficulties: Easy(${inserted.filter((q) => q.difficulty === 'easy').length}) Medium(${inserted.filter((q) => q.difficulty === 'medium').length}) Hard(${inserted.filter((q) => q.difficulty === 'hard').length})`
    );

    await mongoose.connection.close();
    console.log('Seeding complete. Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedQuestions();
