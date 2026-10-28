// 30 Assessment Questions & 20 Quiz Questions for Python Programming
const assessmentQuestions = [
  {
    questionNumber: 1,
    questionText: 'What is the Global Interpreter Lock (GIL) in standard CPython?',
    options: ['A security firewall preventing file access', 'A mutex mechanism that allows only one native thread to execute Python bytecode at a time, preventing multi-core concurrency in CPU-bound tasks', 'A compiler flag for faster math', 'A license agreement for Python software'],
    correctAnswer: 1,
    explanation: 'The GIL synchronizes thread execution in CPython, allowing only one thread to hold the Python interpreter lock at once.'
  },
  {
    questionNumber: 2,
    questionText: 'What is the difference between a Python List and a Python Tuple?',
    options: ['Lists are mutable (can be changed); Tuples are immutable (cannot be modified after creation)', 'Tuples can hold integers only', 'Lists use parentheses (); Tuples use square brackets []', 'There is no difference in behavior'],
    correctAnswer: 0,
    explanation: 'Lists are mutable sequences defined with square brackets, while tuples are immutable sequences defined with parentheses.'
  },
  {
    questionNumber: 3,
    questionText: 'What does the "yield" keyword do inside a Python function?',
    options: ['Immediately terminates the operating system', 'Turns the function into a generator that produces values lazily one at a time, preserving local state between iterations', 'Imports an external library', 'Rounds floating-point numbers'],
    correctAnswer: 1,
    explanation: 'yield pauses function execution, returning an intermediate value and turning the function into a generator iterator.'
  },
  {
    questionNumber: 4,
    questionText: 'What is the time complexity of looking up a key in a standard Python dictionary (dict) on average?',
    options: ['O(N)', 'O(1)', 'O(log N)', 'O(N^2)'],
    correctAnswer: 1,
    explanation: 'Python dictionaries are implemented using hash tables, giving them an average O(1) constant time complexity for lookups.'
  },
  {
    questionNumber: 5,
    questionText: 'What does the `@decorator` syntax accomplish in Python?',
    options: ['Changes the color of terminal output', 'Passes the decorated function as an argument to a wrapper function, extending or altering its behavior dynamically', 'Deletes the function from memory', 'Converts the function to C++ code'],
    correctAnswer: 1,
    explanation: 'Decorators are higher-order functions that wrap other functions or methods to add cross-cutting behavior.'
  },
  {
    questionNumber: 6,
    questionText: 'What is the purpose of the `__init__` method in a Python class?',
    options: ['It is the class destructor called when an object is deleted', 'It is the constructor initializer method called automatically when a new instance of the class is created', 'It imports dependencies for the module', 'It verifies type hints at runtime'],
    correctAnswer: 1,
    explanation: '__init__ acts as the constructor initializer, setting up initial instance state.'
  },
  {
    questionNumber: 7,
    questionText: 'What is the difference between `==` and `is` in Python?',
    options: ['`==` compares values for equality; `is` checks whether two variables refer to the exact same object in memory (identity)', '`is` compares numbers; `==` compares strings', 'They are 100% interchangeable', '`==` is for booleans only'],
    correctAnswer: 0,
    explanation: '`==` checks for value equality via __eq__, whereas `is` checks identity (same memory address/id).'
  },
  {
    questionNumber: 8,
    questionText: 'What is a Python List Comprehension?',
    options: ['A tool to read PDF files', 'A concise, declarative syntactic construct for creating a new list from an existing iterable based on a condition', 'A method to compress lists into zip archives', 'A syntax error in Python 3'],
    correctAnswer: 1,
    explanation: 'List comprehensions provide an elegant syntax like [x*2 for x in items if x > 0] to construct lists.'
  },
  {
    questionNumber: 9,
    questionText: 'Which built-in module provides support for mathematical operations on arrays and matrices in the scientific Python ecosystem?',
    options: ['sys', 'NumPy', 'os', 'json'],
    correctAnswer: 1,
    explanation: 'NumPy is the fundamental package for scientific computing with multi-dimensional arrays in Python.'
  },
  {
    questionNumber: 10,
    questionText: 'How are method parameters passed in Python?',
    options: ['Strictly Pass-by-Value only', 'Strictly Pass-by-Reference only', 'Pass-by-Object-Reference (Call-by-Sharing)', 'Pass-by-Pointer exclusively'],
    correctAnswer: 2,
    explanation: 'Python uses pass-by-object-reference; references to objects are passed by value.'
  },
  {
    questionNumber: 11,
    questionText: 'What does the `with` statement in Python do (e.g. `with open("file.txt") as f:`)?',
    options: ['Enforces type validation', 'Simplifies resource management by invoking Context Managers via `__enter__` and `__exit__`, ensuring automatic cleanup even on errors', 'Loops infinitely over a list', 'Declares global variables'],
    correctAnswer: 1,
    explanation: 'The with statement creates a runtime context that guarantees resource release (like closing file descriptors).'
  },
  {
    questionNumber: 12,
    questionText: 'What will be the output of `bool([])` in Python?',
    options: ['True', 'False', 'None', 'TypeError'],
    correctAnswer: 1,
    explanation: 'Empty containers (lists, tuples, dicts, strings) evaluate to False in a boolean context.'
  },
  {
    questionNumber: 13,
    questionText: 'What is Method Resolution Order (MRO) in Python multiple inheritance?',
    options: ['The alphabetical order of methods in a file', 'The order in which Python searches for attributes and methods across base classes, resolved using the C3 Linearization algorithm', 'A database sorting algorithm', 'The speed of method execution'],
    correctAnswer: 1,
    explanation: 'MRO determines the search path for attributes in class hierarchies using the C3 linearization algorithm.'
  },
  {
    questionNumber: 14,
    questionText: 'What does `*args` and `**kwargs` represent in a Python function definition?',
    options: ['Multiplication and exponentiation operators', 'Variable-length positional arguments as a tuple (*args), and variable-length keyword arguments as a dictionary (**kwargs)', 'Memory pointer addresses', 'Regular expression tokens'],
    correctAnswer: 1,
    explanation: '*args captures arbitrary positional arguments into a tuple; **kwargs captures arbitrary keyword arguments into a dict.'
  },
  {
    questionNumber: 15,
    questionText: 'What is the purpose of the `__str__` vs `__repr__` dunder methods in Python?',
    options: ['`__str__` is intended for an informal, readable user representation; `__repr__` is intended for an unambiguous representation used by developers/debugging', 'There is no difference', '`__str__` is for integers; `__repr__` is for floats', 'Both return binary byte arrays'],
    correctAnswer: 0,
    explanation: '__str__ returns readable output for end users; __repr__ returns unambiguous developer-friendly representation.'
  },
  {
    questionNumber: 16,
    questionText: 'Which built-in function returns an iterator of tuples where the i-th tuple contains the i-th element from each of the input iterables?',
    options: ['enumerate()', 'zip()', 'map()', 'filter()'],
    correctAnswer: 1,
    explanation: 'zip(*iterables) aggregates elements from each of the iterables in parallel.'
  },
  {
    questionNumber: 17,
    questionText: 'What is a "lambda" function in Python?',
    options: ['A named recursive function', 'A small anonymous inline function defined with the `lambda` keyword that contains a single expression', 'A function running on AWS cloud only', 'A multi-threaded loop'],
    correctAnswer: 1,
    explanation: 'A lambda function is an anonymous inline function defined as `lambda arguments: expression`.'
  },
  {
    questionNumber: 18,
    questionText: 'What is the difference between `deepcopy` and `shallow copy` in Python\'s `copy` module?',
    options: ['Shallow copy copies the outer container only with references to nested objects; deepcopy recursively copies all nested objects as independent clones', 'Deepcopy is always faster than shallow copy', 'Shallow copy works only for strings', 'Deepcopy deletes the original object'],
    correctAnswer: 0,
    explanation: 'A deepcopy constructs a new compound object and recursively inserts copies of the objects found in the original.'
  },
  {
    questionNumber: 19,
    questionText: 'What does the built-in `enumerate()` function return when iterating over a sequence?',
    options: ['Pairs of (index, item)', 'Only the length of the sequence', 'Reversed items', 'Sorted numbers'],
    correctAnswer: 0,
    explanation: 'enumerate(iterable) yields (index, value) tuples during iteration.'
  },
  {
    questionNumber: 20,
    questionText: 'How do you handle multiple specific exceptions in a Python try-except block?',
    options: ['try { ... } catch (Exception e)', 'except (ValueError, TypeError) as e:', 'catch ValueError or TypeError:', 'handle all errors simultaneously'],
    correctAnswer: 1,
    explanation: 'Multiple exceptions are caught by specifying a parenthesized tuple of exception types in the except clause.'
  },
  {
    questionNumber: 21,
    questionText: 'What is the purpose of `__slots__` in a Python class definition?',
    options: ['To allow dynamic creation of arbitrary attributes at any time', 'To restrict attribute names to a fixed set and eliminate the instance `__dict__`, significantly reducing memory usage', 'To generate random numbers', 'To format strings'],
    correctAnswer: 1,
    explanation: '__slots__ reserves space for a fixed set of attributes, avoiding per-instance dictionary memory overhead.'
  },
  {
    questionNumber: 22,
    questionText: 'What does `sorted(my_list)` do compared to `my_list.sort()` in Python?',
    options: ['`sorted()` returns a new sorted list leaving the original untouched; `my_list.sort()` sorts the list in-place and returns None', '`my_list.sort()` is slower', '`sorted()` modifies the original list', 'Both do the exact same thing'],
    correctAnswer: 0,
    explanation: 'sorted() creates and returns a new sorted list, whereas .sort() sorts the existing list in-place.'
  },
  {
    questionNumber: 23,
    questionText: 'What does the `pass` statement do in Python?',
    options: ['Passes a variable to another thread', 'Acts as a null statement or syntactical placeholder where code is required but no action should be executed', 'Exits the entire program', 'Skips to the end of a file'],
    correctAnswer: 1,
    explanation: 'pass is a no-op placeholder used when a statement is required syntactically but no code needs to run.'
  },
  {
    questionNumber: 24,
    questionText: 'What is the output of `"hello"[::-1]` in Python?',
    options: ['"hello"', '"olleh"', '"h"', 'IndexError'],
    correctAnswer: 1,
    explanation: 'Slicing with a step of -1 reverses the sequence: "hello"[::-1] returns "olleh".'
  },
  {
    questionNumber: 25,
    questionText: 'Which Python standard library module is used for serialization and deserialization of Python object structures into a byte stream?',
    options: ['json', 'pickle', 'csv', 'marshal'],
    correctAnswer: 1,
    explanation: 'The pickle module implements binary protocols for serializing and deserializing a Python object hierarchy.'
  },
  {
    questionNumber: 26,
    questionText: 'What is the difference between a Set and a List in Python?',
    options: ['Sets contain only unique, unordered, hashable elements; Lists maintain insertion order and permit duplicate elements', 'Sets use square brackets', 'Lists cannot store numbers', 'Sets are immutable by default'],
    correctAnswer: 0,
    explanation: 'Sets cannot have duplicates and are unordered collections of hashable objects.'
  },
  {
    questionNumber: 27,
    questionText: 'What does `collections.defaultdict` provide in Python?',
    options: ['A dictionary that raises KeyError on every lookup', 'A dictionary subclass that calls a factory function to supply default values for missing keys automatically without throwing a KeyError', 'A dictionary with sorted keys', 'A read-only frozen dictionary'],
    correctAnswer: 1,
    explanation: 'defaultdict initializes nonexistent keys with a default factory function (e.g. list, int).'
  },
  {
    questionNumber: 28,
    questionText: 'What is the purpose of the `any()` built-in function in Python?',
    options: ['Returns True if at least one element of an iterable evaluates to truthy; False otherwise', 'Returns True only if all elements are truthy', 'Returns a random element', 'Converts elements to strings'],
    correctAnswer: 0,
    explanation: 'any(iterable) returns True if any element in the iterable is true.'
  },
  {
    questionNumber: 29,
    questionText: 'What is a Python Virtual Environment (`venv`) used for?',
    options: ['Running virtual machines with full operating systems', 'Creating isolated directory trees with their own independent set of Python packages to prevent dependency conflicts across projects', 'Accelerating Python rendering', 'Cleaning up disk fragments'],
    correctAnswer: 1,
    explanation: 'venv isolates project-specific Python binaries and installed site-packages from the global system.'
  },
  {
    questionNumber: 30,
    questionText: 'What is the `__name__ == "__main__"` idiom used for in Python scripts?',
    options: ['To define the author of the code', 'To allow or prevent parts of code from running when the file is imported as a module versus executed directly as a standalone script', 'To declare the main class', 'To benchmark execution time'],
    correctAnswer: 1,
    explanation: 'This idiom lets a file be executable as a script while remaining safely importable without executing side-effects.'
  }
];

const quizQuestions = [
  {
    questionNumber: 1,
    questionText: 'Who is the creator of the Python programming language?',
    options: ['Guido van Rossum', 'James Gosling', 'Bjarne Stroustrup', 'Dennis Ritchie'],
    correctAnswer: 0,
    explanation: 'Python was created by Dutch programmer Guido van Rossum and first released in 1991.'
  },
  {
    questionNumber: 2,
    questionText: 'Which character is used to indicate a single-line comment in Python?',
    options: ['//', '#', '/*', '--'],
    correctAnswer: 1,
    explanation: 'The hash symbol (#) begins a single-line comment in Python.'
  },
  {
    questionNumber: 3,
    questionText: 'How is code block indentation defined in Python?',
    options: ['Curly braces {}', 'Whitespace indentation (spaces or tabs)', 'begin / end keywords', 'Parentheses ()'],
    correctAnswer: 1,
    explanation: 'Python uses whitespace indentation rather than curly braces to delimit code blocks.'
  },
  {
    questionNumber: 4,
    questionText: 'Which built-in function outputs text to the standard console output in Python?',
    options: ['echo()', 'print()', 'console.log()', 'System.out.println()'],
    correctAnswer: 1,
    explanation: 'print() is Python\'s built-in console printing function.'
  },
  {
    questionNumber: 5,
    questionText: 'What is the output of `len("Python")` in Python?',
    options: ['5', '6', '7', '0'],
    correctAnswer: 1,
    explanation: 'The string "Python" has 6 characters, so len() returns 6.'
  },
  {
    questionNumber: 6,
    questionText: 'Which data structure is declared using curly braces with key-value pairs (e.g. `{"name": "Alice"}`)?',
    options: ['List', 'Dictionary (dict)', 'Tuple', 'Set'],
    correctAnswer: 1,
    explanation: 'Dictionaries store key-value mappings within curly braces {}.'
  },
  {
    questionNumber: 7,
    questionText: 'What is the standard file extension for Python source files?',
    options: ['.py', '.pt', '.python', '.pyt'],
    correctAnswer: 0,
    explanation: 'Standard Python source files use the .py file extension.'
  },
  {
    questionNumber: 8,
    questionText: 'Which operator is used for exponentiation (power) in Python?',
    options: ['^', '**', '^^', 'pow'],
    correctAnswer: 1,
    explanation: 'In Python, 2 ** 3 evaluates to 8 (2 raised to the 3rd power).'
  },
  {
    questionNumber: 9,
    questionText: 'Which function converts an integer or float to a string in Python?',
    options: ['str()', 'string()', 'toString()', 'convert()'],
    correctAnswer: 0,
    explanation: 'str(x) returns the string representation of object x.'
  },
  {
    questionNumber: 10,
    questionText: 'What is the result of integer division `7 // 2` in Python 3?',
    options: ['3.5', '3', '4', '3.0'],
    correctAnswer: 1,
    explanation: 'The // operator performs floor division, rounding down to the nearest integer (3).'
  },
  {
    questionNumber: 11,
    questionText: 'Which keyword is used to define a function in Python?',
    options: ['func', 'def', 'function', 'fn'],
    correctAnswer: 1,
    explanation: 'The "def" keyword starts a function definition in Python.'
  },
  {
    questionNumber: 12,
    questionText: 'What keyword is used to define a class in Python?',
    options: ['class', 'struct', 'object', 'type'],
    correctAnswer: 0,
    explanation: 'Classes are declared using the "class" keyword.'
  },
  {
    questionNumber: 13,
    questionText: 'Which built-in function returns the highest value in an iterable or list?',
    options: ['top()', 'max()', 'highest()', 'greatest()'],
    correctAnswer: 1,
    explanation: 'max(iterable) returns the largest item in an iterable.'
  },
  {
    questionNumber: 14,
    questionText: 'What is the first parameter traditionally named in an instance method within a Python class?',
    options: ['this', 'self', 'me', 'instance'],
    correctAnswer: 1,
    explanation: 'By convention, "self" refers to the specific instance of the class.'
  },
  {
    questionNumber: 15,
    questionText: 'Which method adds a single element to the end of a list in Python?',
    options: ['add()', 'append()', 'push()', 'insert()'],
    correctAnswer: 1,
    explanation: 'list.append(x) appends element x to the end of the list.'
  },
  {
    questionNumber: 16,
    questionText: 'Which package manager is the standard tool for installing Python packages from PyPI?',
    options: ['npm', 'pip', 'apt', 'gem'],
    correctAnswer: 1,
    explanation: 'pip (Pip Installs Packages) is the standard package manager for Python.'
  },
  {
    questionNumber: 17,
    questionText: 'What exception is raised when dividing a number by zero in Python?',
    options: ['ZeroDivisionError', 'ArithmeticError', 'NullPointerError', 'ValueError'],
    correctAnswer: 0,
    explanation: 'Dividing by zero raises a ZeroDivisionError.'
  },
  {
    questionNumber: 18,
    questionText: 'Which statement is used to import an external module in Python?',
    options: ['include', 'import', 'require', 'using'],
    correctAnswer: 1,
    explanation: 'The "import" statement brings external modules or symbols into scope.'
  },
  {
    questionNumber: 19,
    questionText: 'What does `range(5)` generate in Python 3?',
    options: ['A sequence from 1 to 5', 'A sequence of integers from 0 to 4 (0, 1, 2, 3, 4)', 'A sequence from 0 to 5 inclusive', 'A random number between 0 and 5'],
    correctAnswer: 1,
    explanation: 'range(5) produces numbers starting at 0 up to, but not including, 5.'
  },
  {
    questionNumber: 20,
    questionText: 'Can a tuple be modified after it has been created?',
    options: ['Yes, using tuple.append()', 'No, tuples are immutable and their elements cannot be changed', 'Only if declared inside a class', 'Yes, by casting to int'],
    correctAnswer: 1,
    explanation: 'Tuples are strictly immutable once created.'
  }
];

module.exports = { assessmentQuestions, quizQuestions };
