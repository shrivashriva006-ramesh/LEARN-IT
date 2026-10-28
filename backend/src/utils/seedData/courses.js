module.exports = [
  {
    title: 'Java Programming',
    category: 'Java Programming',
    description: 'Master object-oriented programming with Java. Covers OOP fundamentals, JVM architecture, Collections framework, Exception handling, Multi-threading, and Stream APIs.',
    level: 'Beginner',
    iconName: 'Coffee',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    learningObjectives: [
      'Understand JVM, JRE, and JDK architecture',
      'Master OOP principles: Encapsulation, Inheritance, Polymorphism, and Abstraction',
      'Work with Java Collections Framework (List, Set, Map)',
      'Implement robust exception handling and multi-threading',
      'Write functional Java using Lambda expressions and Stream API'
    ],
    lessons: [
      {
        lessonTitle: 'Java Fundamentals & JVM Architecture',
        contentType: 'video',
        durationMinutes: 25,
        order: 1,
        contentUrl: 'https://www.youtube.com/embed/eIrMbAQSU34',
        description: 'Comprehensive overview of JVM internal architecture, bytecode execution, and Java syntax.',
        notesContent: `### Java Fundamentals & JVM Architecture\n\nJava is a class-based, object-oriented programming language designed for portability ("Write Once, Run Anywhere").\n\n#### 1. JVM vs JRE vs JDK\n- **JDK (Java Development Kit)**: Contains JRE + development tools (compiler javac, debugger).\n- **JRE (Java Runtime Environment)**: Contains JVM + core runtime libraries.\n- **JVM (Java Virtual Machine)**: Executes bytecode (.class files) via JIT compiler and Interpreter.\n\n#### 2. Key Memory Areas\n- **Heap Memory**: Stores objects and instance variables.\n- **Stack Memory**: Stores method frames, local variables, and primitive values.\n- **Metaspace**: Stores class metadata and static variables.`
      },
      {
        lessonTitle: 'Object-Oriented Programming in Java',
        contentType: 'notes',
        durationMinutes: 30,
        order: 2,
        contentUrl: '',
        description: 'Deep dive into encapsulation, abstraction, inheritance, and dynamic polymorphism.',
        notesContent: `### Object-Oriented Programming (OOP) in Java\n\nOOP models software around real-world objects containing state and behavior.\n\n#### The Four Pillars:\n1. **Encapsulation**: Bundling fields and methods, restricting direct access using private access modifiers with getters/setters.\n2. **Inheritance**: Mechanism where one class acquires properties of another using \`extends\`.\n3. **Polymorphism**:\n   - Compile-time: Method Overloading (same method name, different signature).\n   - Runtime: Method Overriding (subclass overrides parent method with \`@Override\`).\n4. **Abstraction**: Hiding internal implementation details using Abstract Classes and Interfaces.`
      },
      {
        lessonTitle: 'Java Collections Framework & Streams',
        contentType: 'pdf',
        durationMinutes: 35,
        order: 3,
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'In-depth guide to List, Set, Map hierarchies, hashing algorithms, and Java 8 Stream operations.',
        notesContent: `### Java Collections & Streams Guide\n\n- **List**: Ordered collection with index access (ArrayList, LinkedList, Vector).\n- **Set**: Collection of unique elements (HashSet, TreeSet, LinkedHashSet).\n- **Map**: Key-Value pairs with unique keys (HashMap, TreeMap, ConcurrentHashMap).\n- **Stream API**: Functional declarative sequence processing using filter(), map(), and reduce().`
      }
    ]
  },
  {
    title: 'Web Development',
    category: 'Web Development',
    description: 'Complete modern full-stack web development. Learn semantic HTML5, modern CSS3 layout systems (Flexbox & Grid), modern JavaScript (ES6+), React components, and RESTful APIs.',
    level: 'Beginner',
    iconName: 'Globe',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=60',
    learningObjectives: [
      'Build responsive layouts using modern CSS Flexbox and Grid',
      'Master JavaScript asynchronous programming (Promises, Async/Await, Event Loop)',
      'Create reactive Single Page Applications using React and React Hooks',
      'Integrate frontend UI with backend REST APIs using Axios',
      'Implement client-side routing, state management, and form validation'
    ],
    lessons: [
      {
        lessonTitle: 'Modern HTML5 & Responsive CSS Layouts',
        contentType: 'video',
        durationMinutes: 28,
        order: 1,
        contentUrl: 'https://www.youtube.com/embed/kUMe1FH4CHE',
        description: 'Semantic HTML markup and modern CSS3 design techniques including CSS custom properties and media queries.',
        notesContent: `### HTML5 & Responsive CSS\n\nSemantic markup improves accessibility, maintainability, and search engine optimization (SEO).\n\n#### CSS Layout Systems:\n- **Flexbox**: 1-dimensional layout model for rows or columns (\`display: flex\`, \`justify-content\`, \`align-items\`).\n- **CSS Grid**: 2-dimensional layout model for rows and columns simultaneously (\`grid-template-columns\`, \`gap\`).`
      },
      {
        lessonTitle: 'Asynchronous JavaScript & ES6+ Features',
        contentType: 'notes',
        durationMinutes: 30,
        order: 2,
        contentUrl: '',
        description: 'Mastering the JavaScript Event Loop, closures, destructuring, Promises, and Async/Await.',
        notesContent: `### Asynchronous JavaScript & ES6+\n\nJavaScript is single-threaded and non-blocking via the Event Loop.\n\n#### Key Features:\n- **Arrow Functions**: Compact syntax and lexical \`this\` binding.\n- **Destructuring**: Unpacking properties from objects and arrays.\n- **Promises**: Objects representing the eventual completion (or failure) of an async operation.\n- **Async/Await**: Syntactic sugar over Promises for readable synchronous-looking async code.`
      },
      {
        lessonTitle: 'React.js Component Architecture & Hooks',
        contentType: 'pdf',
        durationMinutes: 40,
        order: 3,
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'Building interactive user interfaces using functional components, useState, useEffect, and custom hooks.',
        notesContent: `### React Component Architecture\n\nReact uses a Virtual DOM and one-way data binding.\n\n#### Fundamental Hooks:\n- \`useState\`: Local state management in functional components.\n- \`useEffect\`: Side-effects handler (API calls, subscriptions, DOM manipulation).\n- \`useContext\`: Global state sharing without prop-drilling.`
      }
    ]
  },
  {
    title: 'Database Management',
    category: 'Database Management',
    description: 'Comprehensive database design covering relational RDBMS (SQL, Normalization, ACID transactions) and NoSQL databases (MongoDB document stores, indexing, and aggregation pipelines).',
    level: 'Intermediate',
    iconName: 'Database',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60',
    learningObjectives: [
      'Design relational schemas with 1NF, 2NF, 3NF, and BCNF normalization',
      'Write advanced SQL queries with multi-table joins, subqueries, and window functions',
      'Understand ACID transaction guarantees and concurrency control',
      'Model documents and relationships in MongoDB using Mongoose',
      'Optimize database queries using B-Tree indexing and explain plans'
    ],
    lessons: [
      {
        lessonTitle: 'Relational Database Design & Normalization',
        contentType: 'video',
        durationMinutes: 26,
        order: 1,
        contentUrl: 'https://www.youtube.com/embed/ztHopE5Wnpc',
        description: 'Core relational concepts, primary/foreign keys, functional dependencies, and normal forms.',
        notesContent: `### Database Normalization Principles\n\nNormalization reduces data redundancy and prevents insertion, update, and deletion anomalies.\n\n- **1NF**: Atomic values, no repeating groups.\n- **2NF**: In 1NF and no partial dependencies on composite primary key.\n- **3NF**: In 2NF and no transitive dependencies.\n- **BCNF**: Stricter 3NF where every determinant is a super key.`
      },
      {
        lessonTitle: 'ACID Properties & Transaction Concurrency',
        contentType: 'notes',
        durationMinutes: 25,
        order: 2,
        contentUrl: '',
        description: 'Atomicity, Consistency, Isolation, Durability, and isolation levels in enterprise databases.',
        notesContent: `### ACID Properties & Concurrency\n\n- **Atomicity**: All operations succeed or none are applied (All-or-Nothing).\n- **Consistency**: Database transitions from one valid state to another, preserving constraints.\n- **Isolation**: Concurrent transactions execute independently without interference.\n- **Durability**: Committed data persists even in the event of system crashes.`
      },
      {
        lessonTitle: 'NoSQL & MongoDB Aggregation Framework',
        contentType: 'pdf',
        durationMinutes: 35,
        order: 3,
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'BSON document modeling, indexing strategies, and multi-stage aggregation pipelines.',
        notesContent: `### MongoDB Aggregation Pipeline\n\nStages in an aggregation pipeline process documents sequentially:\n- \`$match\`: Filters documents matching criteria.\n- \`$group\`: Groups documents by key and computes accumulator metrics.\n- \`$project\`: Reshapes document fields.\n- \`$lookup\`: Performs left outer join with another collection.`
      }
    ]
  },
  {
    title: 'Cyber Security',
    category: 'Cyber Security',
    description: 'In-depth security principles covering cryptography, network defenses, web vulnerabilities (OWASP Top 10), penetration testing fundamentals, and ethical hacking methodologies.',
    level: 'Intermediate',
    iconName: 'ShieldCheck',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    learningObjectives: [
      'Understand CIA Triad (Confidentiality, Integrity, Availability) and threat models',
      'Master symmetric (AES) and asymmetric (RSA) cryptography, hashing, and PKI',
      'Identify and remediate OWASP Top 10 web vulnerabilities (SQLi, XSS, CSRF, IDOR)',
      'Analyze network protocols, packet headers, firewalls, and IDS/IPS systems',
      'Implement defense-in-depth security controls and secure coding best practices'
    ],
    lessons: [
      {
        lessonTitle: 'Security Fundamentals & Cryptography',
        contentType: 'video',
        durationMinutes: 30,
        order: 1,
        contentUrl: 'https://www.youtube.com/embed/inWWhr5tnEA',
        description: 'CIA triad, hashing algorithms (SHA-256), encryption standards (AES, RSA), and digital certificates.',
        notesContent: `### Cybersecurity Fundamentals & Cryptography\n\n- **CIA Triad**:\n  - *Confidentiality*: Protecting information from unauthorized disclosure.\n  - *Integrity*: Safeguarding data accuracy against tampering.\n  - *Availability*: Ensuring reliable, timely access to authorized users.\n\n- **Symmetric vs Asymmetric Encryption**:\n  - Symmetric: Single shared key for encryption and decryption (AES, DES).\n  - Asymmetric: Public key encrypts, private key decrypts (RSA, ECC).\n- **Hashing**: One-way mathematical transformation (SHA-256, bcrypt).`
      },
      {
        lessonTitle: 'OWASP Top 10 Web Application Vulnerabilities',
        contentType: 'notes',
        durationMinutes: 35,
        order: 2,
        contentUrl: '',
        description: 'Comprehensive analysis of SQL Injection, Cross-Site Scripting, Broken Access Control, and mitigations.',
        notesContent: `### OWASP Top 10 Mitigation Strategies\n\n1. **SQL Injection (SQLi)**: Attackers inject malicious SQL via input. Fix: Parameterized queries / Prepared Statements.\n2. **Cross-Site Scripting (XSS)**: Injection of malicious scripts executed in user browser. Fix: Context-aware output encoding & CSP.\n3. **Cross-Site Request Forgery (CSRF)**: Forcing authenticated user to execute unauthorized actions. Fix: Anti-CSRF tokens and SameSite cookies.\n4. **Broken Access Control**: Missing authorization checks. Fix: Enforce role-based access control (RBAC) on the server.`
      },
      {
        lessonTitle: 'Network Defense, Firewalls & Incident Response',
        contentType: 'pdf',
        durationMinutes: 40,
        order: 3,
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'Packet inspection, Next-Gen Firewalls, Intrusion Detection Systems (IDS), and incident response lifecycles.',
        notesContent: `### Network Security & Incident Response\n\n- **Packet Filtering Firewalls**: Inspect IP headers and TCP/UDP ports.\n- **Stateful Inspection**: Tracks active connection states.\n- **IDS vs IPS**: IDS detects and alerts; IPS detects and actively blocks malicious traffic.\n- **NIST Incident Lifecycle**: Preparation -> Detection & Analysis -> Containment, Eradication & Recovery -> Post-Incident Activity.`
      }
    ]
  },
  {
    title: 'Cloud Computing',
    category: 'Cloud Computing',
    description: 'Enterprise cloud engineering covering AWS, Azure, virtualization, containerization with Docker, Kubernetes orchestration, serverless computing, and cloud architecture patterns.',
    level: 'Intermediate',
    iconName: 'Cloud',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
    learningObjectives: [
      'Compare cloud service models (IaaS, PaaS, SaaS) and deployment models',
      'Architect highly available, fault-tolerant infrastructure on AWS and cloud providers',
      'Containerize applications using Docker and multi-stage Dockerfiles',
      'Deploy and scale microservices using Kubernetes pods, services, and deployments',
      'Implement Cloud Security Shared Responsibility Model and IAM policies'
    ],
    lessons: [
      {
        lessonTitle: 'Cloud Service Models & Global Infrastructure',
        contentType: 'video',
        durationMinutes: 24,
        order: 1,
        contentUrl: 'https://www.youtube.com/embed/M988_fsOSWo',
        description: 'IaaS vs PaaS vs SaaS, Regions, Availability Zones, Edge Locations, and elasticity concepts.',
        notesContent: `### Cloud Computing Models\n\n#### Service Models:\n- **IaaS (Infrastructure as a Service)**: Virtual machines, raw storage, networks (e.g., AWS EC2, Azure VMs).\n- **PaaS (Platform as a Service)**: Managed runtime environment for code without managing OS (e.g., AWS Elastic Beanstalk, Heroku).\n- **SaaS (Software as a Service)**: Complete end-user software delivered over the web (e.g., Google Workspace, Office 365).\n\n#### Cloud Characteristics:\n- On-demand self-service\n- Broad network access\n- Resource pooling & multi-tenancy\n- Rapid elasticity and measured service.`
      },
      {
        lessonTitle: 'Docker Containers & Microservices Architecture',
        contentType: 'notes',
        durationMinutes: 32,
        order: 2,
        contentUrl: '',
        description: 'Container virtualization vs hypervisors, image layers, Dockerfiles, and container networking.',
        notesContent: `### Docker & Containerization\n\nContainers package code and all dependencies together, sharing the host OS kernel.\n\n- **Container vs VM**: VMs require a full guest OS on top of a hypervisor; containers share the host kernel and start in milliseconds.\n- **Dockerfile Best Practices**:\n  - Use lightweight alpine base images.\n  - Multi-stage builds to minimize image size.\n  - Run as non-root user for security.`
      },
      {
        lessonTitle: 'Kubernetes Orchestration & Serverless Architecture',
        contentType: 'pdf',
        durationMinutes: 38,
        order: 3,
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'Kubernetes architecture (control plane, worker nodes, pods, replica sets) and AWS Lambda serverless functions.',
        notesContent: `### Kubernetes & Serverless Overview\n\n#### Kubernetes Components:\n- **Control Plane**: API Server, etcd (key-value store), Controller Manager, Scheduler.\n- **Worker Node**: Kubelet, Kube-proxy, Container Runtime.\n- **Pod**: Smallest deployable execution unit containing one or more containers.\n\n#### Serverless Computing:\n- Event-driven execution (pay only for compute duration used).\n- Automatic scaling to zero and seamless high concurrency.`
      }
    ]
  },
  {
    title: 'Python Programming',
    category: 'Python Programming',
    description: 'Comprehensive Python programming from fundamentals to intermediate data analysis. Covers syntax, data structures, generators, decorators, file I/O, OOP, and popular libraries.',
    level: 'Beginner',
    iconName: 'Code',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60',
    learningObjectives: [
      'Master core Python syntax, dynamic typing, and control flow structures',
      'Utilize built-in data structures: Lists, Tuples, Dictionaries, and Sets',
      'Write advanced Python using List Comprehensions, Generators, and Decorators',
      'Apply object-oriented programming with classes, dunder methods, and inheritance',
      'Perform file handling, JSON parsing, and exception handling'
    ],
    lessons: [
      {
        lessonTitle: 'Python Fundamentals & Data Structures',
        contentType: 'video',
        durationMinutes: 27,
        order: 1,
        contentUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
        description: 'Dynamic typing, slicing, list comprehensions, dictionary operations, and memory management.',
        notesContent: `### Python Fundamentals & Structures\n\nPython is an interpreted, high-level, dynamically typed language.\n\n#### Built-in Data Structures:\n- **List**: Mutable, ordered sequence (\`[1, 2, 3]\`).\n- **Tuple**: Immutable, ordered sequence (\`(1, 2, 3)\`).\n- **Dictionary**: Mutable key-value mapping with O(1) average lookup (\`{'key': 'value'}\`).\n- **Set**: Mutable, unordered collection of unique elements (\`{1, 2, 3}\`).`
      },
      {
        lessonTitle: 'Advanced Python: Decorators, Generators & Context Managers',
        contentType: 'notes',
        durationMinutes: 30,
        order: 2,
        contentUrl: '',
        description: 'Functions as first-class citizens, closures, `@decorator` syntax, `yield` generators, and `with` blocks.',
        notesContent: `### Advanced Python Concepts\n\n- **Decorators**: Functions that take another function as an argument, extend its behavior without modifying it, and return a function.\n- **Generators**: Functions that produce a sequence of values lazily using the \`yield\` keyword, conserving memory for large datasets.\n- **Context Managers**: Facilitate resource management via \`with\` statement using \`__enter__\` and \`__exit__\` methods.`
      },
      {
        lessonTitle: 'Object-Oriented Python & File Operations',
        contentType: 'pdf',
        durationMinutes: 35,
        order: 3,
        contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'Classes, `__init__`, inheritance, special dunder methods, file handling, and error handling.',
        notesContent: `### OOP in Python & File I/O\n\n- **Classes & Self**: \`self\` represents the instance of the class.\n- **Dunder Methods**: Special methods with double underscores (\`__init__\`, \`__str__\`, \`__repr__\`, \`__len__\`).\n- **File I/O**: Safe reading and writing using \`with open('file.txt', 'r') as f:\` block.`
      }
    ]
  }
];
