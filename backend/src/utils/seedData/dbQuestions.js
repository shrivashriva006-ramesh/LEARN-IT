// 30 Assessment Questions & 20 Quiz Questions for Database Management
const assessmentQuestions = [
  {
    questionNumber: 1,
    questionText: 'What is the primary objective of database normalization?',
    options: ['To increase hard drive read speeds', 'To minimize data redundancy and eliminate update/delete anomalies', 'To encrypt database tables', 'To convert SQL queries to NoSQL syntax'],
    correctAnswer: 1,
    explanation: 'Normalization organizes schema tables to reduce duplicate data and avoid insertion, update, and deletion anomalies.'
  },
  {
    questionNumber: 2,
    questionText: 'A relation is in Second Normal Form (2NF) if it is in 1NF and:',
    options: ['Has no multi-valued attributes', 'Every non-prime attribute is fully functionally dependent on the entire primary key (no partial dependency)', 'Has no transitive dependencies', 'Every determinant is a candidate key'],
    correctAnswer: 1,
    explanation: '2NF eliminates partial functional dependencies on composite primary keys.'
  },
  {
    questionNumber: 3,
    questionText: 'What does the "A" in ACID database properties stand for?',
    options: ['Availability', 'Atomicity', 'Asynchronous', 'Authentication'],
    correctAnswer: 1,
    explanation: 'Atomicity ensures that all operations within a transaction complete successfully, or all are rolled back.'
  },
  {
    questionNumber: 4,
    questionText: 'Which SQL clause is used to filter records resulting from an aggregate function like COUNT() or AVG()?',
    options: ['WHERE', 'ORDER BY', 'HAVING', 'GROUP BY'],
    correctAnswer: 2,
    explanation: 'HAVING filters grouped rows after aggregation, whereas WHERE filters rows before aggregation.'
  },
  {
    questionNumber: 5,
    questionText: 'What is a Foreign Key in a relational database?',
    options: ['A key created in another database system', 'A field in one table that uniquely identifies a row in another table, enforcing referential integrity', 'An encrypted password field', 'A primary key with auto-increment'],
    correctAnswer: 1,
    explanation: 'Foreign keys establish and enforce links between data in different tables.'
  },
  {
    questionNumber: 6,
    questionText: 'In MongoDB, what data format is used internally to store documents on disk?',
    options: ['XML', 'YAML', 'BSON (Binary JSON)', 'CSV'],
    correctAnswer: 2,
    explanation: 'MongoDB stores documents internally in BSON, a binary serialization format supporting rich data types.'
  },
  {
    questionNumber: 7,
    questionText: 'Which isolation level prevents Dirty Reads but allows Non-Repeatable Reads?',
    options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
    correctAnswer: 1,
    explanation: 'Read Committed guarantees that transactions only read committed data, preventing dirty reads.'
  },
  {
    questionNumber: 8,
    questionText: 'What type of index is most commonly used by default in relational databases and MongoDB?',
    options: ['Hash Index', 'B-Tree (Balanced Tree) Index', 'Bitmap Index', 'Full-Text Inverted Index'],
    correctAnswer: 1,
    explanation: 'B-Trees support efficient logarithmic O(log N) searches, range queries, and sorted order.'
  },
  {
    questionNumber: 9,
    questionText: 'What does the SQL command "ROLLBACK" accomplish?',
    options: ['Permanently commits recent changes to the disk', 'Reverts all database modifications made during the current uncommitted transaction', 'Deletes all records from the table', 'Backs up the database to an external archive'],
    correctAnswer: 1,
    explanation: 'ROLLBACK undoes changes made during the transaction, restoring the database to its previous consistent state.'
  },
  {
    questionNumber: 10,
    questionText: 'In Mongoose, which method is used to populate reference fields with documents from other collections?',
    options: ['join()', 'populate()', 'merge()', 'lookup()'],
    correctAnswer: 1,
    explanation: 'Mongoose .populate() automatically replaces specified paths in a document with documents from other collections.'
  },
  {
    questionNumber: 11,
    questionText: 'What is the main difference between DELETE and TRUNCATE in SQL?',
    options: ['DELETE is DML (logged row-by-row, can be rolled back); TRUNCATE is DDL (deallocates pages, faster, resets identity)', 'TRUNCATE removes specific rows using WHERE; DELETE removes all rows', 'TRUNCATE deletes the database structure itself', 'DELETE is faster than TRUNCATE'],
    correctAnswer: 0,
    explanation: 'TRUNCATE is a DDL operation that empties a table by deallocating data pages; DELETE logs row by row.'
  },
  {
    questionNumber: 12,
    questionText: 'What is Third Normal Form (3NF)?',
    options: ['A relation in 2NF that has no transitive functional dependencies of non-prime attributes on the primary key', 'A relation with three columns only', 'A relation without null values', 'A table with 3 foreign keys'],
    correctAnswer: 0,
    explanation: '3NF requires that non-key attributes must depend only on the primary key, eliminating transitive dependencies.'
  },
  {
    questionNumber: 13,
    questionText: 'Which join returns all rows from the left table, and matching rows from the right table (with NULLs for unmatched)?',
    options: ['INNER JOIN', 'LEFT OUTER JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
    correctAnswer: 1,
    explanation: 'LEFT JOIN returns all records from the left table and matched records from the right table.'
  },
  {
    questionNumber: 14,
    questionText: 'What is a database deadlock?',
    options: ['A situation where the database disk is 100% full', 'A condition where two or more transactions are blocked waiting for locks held by each other in a circular chain', 'When network cables are disconnected', 'When a query has syntax errors'],
    correctAnswer: 1,
    explanation: 'A deadlock happens when transactions block each other permanently by waiting on locks held by one another.'
  },
  {
    questionNumber: 15,
    questionText: 'In MongoDB, which aggregation pipeline stage performs a left outer join with another collection?',
    options: ['$match', '$group', '$lookup', '$unwind'],
    correctAnswer: 2,
    explanation: '$lookup performs a left outer join to an unsharded collection in the same database.'
  },
  {
    questionNumber: 16,
    questionText: 'What is the primary purpose of a database view?',
    options: ['To speed up hard drive spin rates', 'To provide a virtual table based on the result-set of an SQL statement, enhancing security and query simplicity', 'To replace tables completely', 'To generate PDF charts automatically'],
    correctAnswer: 1,
    explanation: 'A view is a stored virtual table query that encapsulates complex joins and restricts column access.'
  },
  {
    questionNumber: 17,
    questionText: 'Which MongoDB command creates an index on the "email" field in ascending order?',
    options: ['db.users.addIndex({ email: "asc" })', 'db.users.createIndex({ email: 1 })', 'db.users.index({ email: true })', 'db.users.build({ email: 1 })'],
    correctAnswer: 1,
    explanation: 'createIndex({ field: 1 }) creates an ascending index in MongoDB.'
  },
  {
    questionNumber: 18,
    questionText: 'What does the CAP theorem state about distributed data stores?',
    options: ['A distributed system can guarantee at most two out of Consistency, Availability, and Partition Tolerance simultaneously', 'All databases must use C-based programming', 'Cloud databases are always consistent', 'Partitioning is never required in distributed databases'],
    correctAnswer: 0,
    explanation: 'CAP theorem proves that a distributed data store can satisfy at most two guarantees: C, A, or P.'
  },
  {
    questionNumber: 19,
    questionText: 'What is a Clustered Index in an RDBMS like SQL Server or MySQL InnoDB?',
    options: ['An index stored in a remote cluster', 'An index that determines the actual physical storage order of the rows in the table', 'An index with duplicate keys', 'A temporary index for sorting'],
    correctAnswer: 1,
    explanation: 'A clustered index physically sorts and stores data rows in the table based on the indexed key.'
  },
  {
    questionNumber: 20,
    questionText: 'What is the default port for MongoDB Server connections?',
    options: ['3306', '5432', '27017', '8080'],
    correctAnswer: 2,
    explanation: 'The default standalone MongoDB listener port is 27017.'
  },
  {
    questionNumber: 21,
    questionText: 'What is the function of a Database Trigger?',
    options: ['To automatically execute stored procedural code in response to specified events (INSERT, UPDATE, DELETE) on a table', 'To turn off database power during idle periods', 'To compress table columns', 'To encrypt network packets'],
    correctAnswer: 0,
    explanation: 'Triggers execute automatically when designated DML or DDL events occur on target tables.'
  },
  {
    questionNumber: 22,
    questionText: 'What is an "upsert" operation in MongoDB and relational databases?',
    options: ['Deleting outdated records', 'An operation that updates an existing document if it matches query criteria, or inserts a new document if it does not', 'Sorting data upwards', 'Exporting documents to CSV'],
    correctAnswer: 1,
    explanation: 'Upsert (Update + Insert) either updates matching records or creates a new record if none exists.'
  },
  {
    questionNumber: 23,
    questionText: 'Which SQL constraint guarantees that all values in a column are distinct from one another?',
    options: ['NOT NULL', 'UNIQUE', 'CHECK', 'DEFAULT'],
    correctAnswer: 1,
    explanation: 'The UNIQUE constraint ensures all values in a column are unique.'
  },
  {
    questionNumber: 24,
    questionText: 'What is Sharding in MongoDB?',
    options: ['Creating database backups every hour', 'Distributing data across multiple physical machines to support horizontal scaling for very large datasets', 'Combining multiple collections into one', 'Converting JSON to XML'],
    correctAnswer: 1,
    explanation: 'Sharding partitions and distributes data across cluster nodes for horizontal scalability.'
  },
  {
    questionNumber: 25,
    questionText: 'What does Boyce-Codd Normal Form (BCNF) require beyond 3NF?',
    options: ['For every non-trivial functional dependency X -> Y, X must be a super key', 'No foreign keys are allowed', 'Tables must have fewer than 10 columns', 'Only numeric primary keys are valid'],
    correctAnswer: 0,
    explanation: 'BCNF requires that every determinant X in X -> Y must be a candidate/super key.'
  },
  {
    questionNumber: 26,
    questionText: 'What is the purpose of an SQL Stored Procedure?',
    options: ['To store images on hard drives', 'A precompiled collection of SQL statements saved in the database server for reuse, consistency, and performance', 'To backup databases', 'To format web pages'],
    correctAnswer: 1,
    explanation: 'Stored procedures bundle business logic directly into the database engine for precompiled execution.'
  },
  {
    questionNumber: 27,
    questionText: 'In Mongoose, which option prevents the automatic creation of the "_v" version key in documents?',
    options: ['{ versionKey: false }', '{ noVersion: true }', '{ disableV: true }', '{ strict: false }'],
    correctAnswer: 0,
    explanation: 'Setting versionKey: false in schema options disables the __v property.'
  },
  {
    questionNumber: 28,
    questionText: 'What is Write-Ahead Logging (WAL) in database storage engines?',
    options: ['Writing documentation before writing queries', 'A technique where modifications are recorded in a transaction log file before being applied to the data pages', 'Logging user search queries to disk', 'Sending email alerts on slow queries'],
    correctAnswer: 1,
    explanation: 'WAL ensures durability (D in ACID) by logging changes sequentially before writing to main table pages.'
  },
  {
    questionNumber: 29,
    questionText: 'Which aggregate function calculates the total sum of numerical values in a column?',
    options: ['TOTAL()', 'SUM()', 'COUNT()', 'ADD()'],
    correctAnswer: 1,
    explanation: 'SUM() returns the summed total of numeric values in the specified column.'
  },
  {
    questionNumber: 30,
    questionText: 'What does the "$match" operator do in a MongoDB Aggregation Pipeline?',
    options: ['Sorts documents alphabetically', 'Filters documents to pass only those matching the specified condition to the next pipeline stage', 'Groups documents by category', 'Deletes matching documents'],
    correctAnswer: 1,
    explanation: '$match acts as a query filter stage in an aggregation pipeline.'
  }
];

const quizQuestions = [
  {
    questionNumber: 1,
    questionText: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Question Language', 'Standard Quality Language', 'Sequential Query Logic'],
    correctAnswer: 0,
    explanation: 'SQL stands for Structured Query Language.'
  },
  {
    questionNumber: 2,
    questionText: 'Which SQL statement is used to extract data from a database?',
    options: ['OPEN', 'GET', 'SELECT', 'EXTRACT'],
    correctAnswer: 2,
    explanation: 'The SELECT statement retrieves data from database tables.'
  },
  {
    questionNumber: 3,
    questionText: 'Which clause is used to filter records in a basic SQL SELECT query?',
    options: ['GROUP BY', 'WHERE', 'ORDER BY', 'LIMIT'],
    correctAnswer: 1,
    explanation: 'The WHERE clause specifies criteria that records must satisfy to be selected.'
  },
  {
    questionNumber: 4,
    questionText: 'Is MongoDB a Relational (RDBMS) or NoSQL database?',
    options: ['Relational Database', 'Document-oriented NoSQL Database', 'Graph Database', 'Hierarchical Database'],
    correctAnswer: 1,
    explanation: 'MongoDB is a document-oriented NoSQL database that stores data in flexible BSON documents.'
  },
  {
    questionNumber: 5,
    questionText: 'Which command is used to remove a table structure and all its data permanently in SQL?',
    options: ['REMOVE TABLE', 'DROP TABLE', 'DELETE TABLE', 'CLEAR TABLE'],
    correctAnswer: 1,
    explanation: 'DROP TABLE permanently removes table schema and all records.'
  },
  {
    questionNumber: 6,
    questionText: 'What is a Primary Key in a database table?',
    options: ['A key used to encrypt the database', 'A column or set of columns that uniquely identifies each row in a table', 'The first column added to a table', 'A foreign key pointing to another database'],
    correctAnswer: 1,
    explanation: 'A Primary Key enforces uniqueness and cannot contain NULL values.'
  },
  {
    questionNumber: 7,
    questionText: 'Which SQL keyword sorts the result set in descending order?',
    options: ['ASC', 'DESC', 'DOWN', 'BOTTOM'],
    correctAnswer: 1,
    explanation: 'DESC sorts the query results in descending order.'
  },
  {
    questionNumber: 8,
    questionText: 'What is the MongoDB equivalent of a relational table?',
    options: ['Document', 'Collection', 'Schema', 'Row'],
    correctAnswer: 1,
    explanation: 'In MongoDB, a Collection is equivalent to a table in an RDBMS.'
  },
  {
    questionNumber: 9,
    questionText: 'What is the MongoDB equivalent of a relational row/record?',
    options: ['Column', 'Collection', 'Document', 'Field'],
    correctAnswer: 2,
    explanation: 'A Document in MongoDB corresponds to a row or record in a relational table.'
  },
  {
    questionNumber: 10,
    questionText: 'Which SQL keyword prevents duplicate rows from appearing in a SELECT result set?',
    options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'SINGLE'],
    correctAnswer: 1,
    explanation: 'SELECT DISTINCT removes duplicate rows from query results.'
  },
  {
    questionNumber: 11,
    questionText: 'Which command updates existing data within a table in SQL?',
    options: ['MODIFY', 'UPDATE', 'SAVE', 'CHANGE'],
    correctAnswer: 1,
    explanation: 'UPDATE modifies existing records in a table.'
  },
  {
    questionNumber: 12,
    questionText: 'Which SQL operator is used to search for a specified pattern in a column?',
    options: ['LIKE', 'MATCH', 'SEARCH', 'IN'],
    correctAnswer: 0,
    explanation: 'The LIKE operator is used in a WHERE clause to search for patterns using wildcards (% and _).'
  },
  {
    questionNumber: 13,
    questionText: 'In MongoDB, what is the default unique identifier field generated for each document?',
    options: ['id', '_id', 'uuid', 'doc_id'],
    correctAnswer: 1,
    explanation: 'MongoDB automatically generates a unique 12-byte ObjectId in the _id field.'
  },
  {
    questionNumber: 14,
    questionText: 'Which SQL function counts the number of rows returned by a query?',
    options: ['SUM()', 'NUM()', 'COUNT()', 'ROWS()'],
    correctAnswer: 2,
    explanation: 'COUNT() returns the total number of rows matching the query criteria.'
  },
  {
    questionNumber: 15,
    questionText: 'What SQL statement adds new rows of data into a table?',
    options: ['ADD ROW', 'INSERT INTO', 'PUT INTO', 'APPEND'],
    correctAnswer: 1,
    explanation: 'INSERT INTO inserts new records into a database table.'
  },
  {
    questionNumber: 16,
    questionText: 'Can a Primary Key column contain NULL values?',
    options: ['Yes, one NULL is allowed', 'No, primary keys must never contain NULL values', 'Only in MySQL', 'Yes, if defined with DEFAULT NULL'],
    correctAnswer: 1,
    explanation: 'Primary keys strictly reject NULL values to maintain identity.'
  },
  {
    questionNumber: 17,
    questionText: 'What is an ODM like Mongoose?',
    options: ['Online Database Manager', 'Object Data Modeling library providing schema-based modeling for MongoDB in Node.js', 'An operating system kernel', 'A network switch protocol'],
    correctAnswer: 1,
    explanation: 'Mongoose is an ODM that provides schema validation and business logic abstraction over MongoDB.'
  },
  {
    questionNumber: 18,
    questionText: 'Which command shows all databases in a MongoDB shell?',
    options: ['SHOW DB', 'show dbs', 'list databases', 'display dbs'],
    correctAnswer: 1,
    explanation: '"show dbs" lists all available databases in the MongoDB instance.'
  },
  {
    questionNumber: 19,
    questionText: 'Which SQL constraint checks that all values in a column satisfy a specific Boolean condition?',
    options: ['CHECK', 'VERIFY', 'CONDITION', 'CONSTRAINT'],
    correctAnswer: 0,
    explanation: 'The CHECK constraint ensures that values in a column meet a specified logical condition.'
  },
  {
    questionNumber: 20,
    questionText: 'What type of relationship exists between an Author and their Books in typical database design?',
    options: ['One-to-One', 'One-to-Many', 'Many-to-Zero', 'None'],
    correctAnswer: 1,
    explanation: 'An author can write multiple books, modeling a classic One-to-Many relationship.'
  }
];

module.exports = { assessmentQuestions, quizQuestions };
