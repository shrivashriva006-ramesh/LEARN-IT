// 30 Assessment Questions & 20 Quiz Questions for Java Programming
const assessmentQuestions = [
  {
    questionNumber: 1,
    questionText: 'What is the primary role of the Java Virtual Machine (JVM)?',
    options: ['To compile Java source code into bytecode', 'To execute Java bytecode on any underlying platform', 'To provide an IDE for writing code', 'To design graphical user interfaces'],
    correctAnswer: 1,
    explanation: 'The JVM is the runtime engine of the Java Platform that executes compiled bytecode (.class files).'
  },
  {
    questionNumber: 2,
    questionText: 'Which of the following is NOT a primitive data type in Java?',
    options: ['int', 'float', 'String', 'boolean'],
    correctAnswer: 2,
    explanation: 'String is a class (reference type) in Java, whereas int, float, and boolean are primitive types.'
  },
  {
    questionNumber: 3,
    questionText: 'What is the default value of a boolean variable declared as a class field in Java?',
    options: ['true', 'false', '0', 'null'],
    correctAnswer: 1,
    explanation: 'In Java, boolean instance variables default to false.'
  },
  {
    questionNumber: 4,
    questionText: 'Which keyword is used to inherit a class in Java?',
    options: ['implements', 'extends', 'inherits', 'instanceof'],
    correctAnswer: 1,
    explanation: 'The "extends" keyword is used by a class to inherit from a parent class.'
  },
  {
    questionNumber: 5,
    questionText: 'What does the "final" keyword mean when applied to a method in Java?',
    options: ['The method cannot be called outside its class', 'The method cannot be overloaded', 'The method cannot be overridden by subclasses', 'The method must return a constant value'],
    correctAnswer: 2,
    explanation: 'Declaring a method final prevents any subclass from overriding it.'
  },
  {
    questionNumber: 6,
    questionText: 'Where are objects allocated in Java memory?',
    options: ['Stack Memory', 'Heap Memory', 'Program Counter Register', 'Metaspace Native Memory'],
    correctAnswer: 1,
    explanation: 'All Java objects and instance variables are allocated on the Heap.'
  },
  {
    questionNumber: 7,
    questionText: 'Which collection class allows duplicate elements and maintains insertion order?',
    options: ['HashSet', 'TreeSet', 'ArrayList', 'HashMap'],
    correctAnswer: 2,
    explanation: 'ArrayList implements the List interface, allowing duplicates and maintaining insertion order.'
  },
  {
    questionNumber: 8,
    questionText: 'Which exception is thrown when attempting to access an array element outside its valid index range?',
    options: ['NullPointerException', 'ArrayIndexOutOfBoundsException', 'IllegalArgumentException', 'ClassCastException'],
    correctAnswer: 1,
    explanation: 'ArrayIndexOutOfBoundsException is thrown when an index is negative or greater than or equal to the array length.'
  },
  {
    questionNumber: 9,
    questionText: 'What is the difference between "==" and ".equals()" when comparing object references in Java?',
    options: ['"==" compares memory addresses, while ".equals()" compares object state/value', '"==" compares values, while ".equals()" compares memory addresses', 'There is no difference', '".equals()" only works with primitive types'],
    correctAnswer: 0,
    explanation: '"==" checks if both references point to the same memory location, while .equals() checks logical equivalence.'
  },
  {
    questionNumber: 10,
    questionText: 'Which package is automatically imported into every Java compilation unit?',
    options: ['java.util', 'java.io', 'java.lang', 'java.net'],
    correctAnswer: 2,
    explanation: 'java.lang is implicitly imported into every Java class file.'
  },
  {
    questionNumber: 11,
    questionText: 'Which keyword is used to manually trigger an exception in Java?',
    options: ['throws', 'throw', 'catch', 'assert'],
    correctAnswer: 1,
    explanation: 'The "throw" keyword is used to explicitly throw an exception object.'
  },
  {
    questionNumber: 12,
    questionText: 'What is the purpose of the "super" keyword in Java?',
    options: ['To create a new class', 'To refer to the immediate parent class object/constructor', 'To optimize memory garbage collection', 'To mark a method as static'],
    correctAnswer: 1,
    explanation: 'super is used to invoke the parent class constructor or access parent fields/methods.'
  },
  {
    questionNumber: 13,
    questionText: 'Can an interface in Java 8 and later contain method implementations?',
    options: ['No, interfaces can only have abstract methods', 'Yes, using default and static methods', 'Only if the interface is marked private', 'Yes, but only private methods'],
    correctAnswer: 1,
    explanation: 'Java 8 introduced default and static methods with implementations inside interfaces.'
  },
  {
    questionNumber: 14,
    questionText: 'Which interface must a class implement to enable execution in a separate thread?',
    options: ['Comparable', 'Runnable', 'Serializable', 'Cloneable'],
    correctAnswer: 1,
    explanation: 'Implementing java.lang.Runnable allows an instance to be executed by a Thread.'
  },
  {
    questionNumber: 15,
    questionText: 'What is the return type of the hashCode() method defined in java.lang.Object?',
    options: ['long', 'int', 'String', 'byte'],
    correctAnswer: 1,
    explanation: 'public int hashCode() returns an integer hash value representing the object.'
  },
  {
    questionNumber: 16,
    questionText: 'Which of the following is true about String immutability in Java?',
    options: ['String values can be changed directly in the same memory location', 'Any modification to a String results in the creation of a new String object', 'Strings are mutable if declared with public access', 'Immutability prevents Strings from being cached'],
    correctAnswer: 1,
    explanation: 'Strings in Java are immutable; any change creates a new instance in the String Constant Pool or Heap.'
  },
  {
    questionNumber: 17,
    questionText: 'Which collection class does NOT permit null keys or null values?',
    options: ['HashMap', 'TreeMap', 'Hashtable', 'LinkedHashMap'],
    correctAnswer: 2,
    explanation: 'Hashtable does not allow null keys or null values, throwing a NullPointerException if attempted.'
  },
  {
    questionNumber: 18,
    questionText: 'What does the "transient" modifier indicate when applied to an instance field?',
    options: ['The field cannot be modified', 'The field should not be serialized when the object is written to a stream', 'The field is shared among all threads', 'The field is garbage collected immediately'],
    correctAnswer: 1,
    explanation: 'The transient keyword prevents a field from being included in the serialization process.'
  },
  {
    questionNumber: 19,
    questionText: 'What is the purpose of the Garbage Collector (GC) in Java?',
    options: ['To format source code indentation', 'To automatically reclaim memory occupied by unreferenced objects', 'To compile code into machine language', 'To prevent stack overflow errors'],
    correctAnswer: 1,
    explanation: 'Java GC tracks and frees heap memory occupied by unreachable objects automatically.'
  },
  {
    questionNumber: 20,
    questionText: 'Which class provides synchronized (thread-safe) operations on mutable character sequences?',
    options: ['String', 'StringBuilder', 'StringBuffer', 'StringTokenizer'],
    correctAnswer: 2,
    explanation: 'StringBuffer is synchronized and thread-safe, unlike StringBuilder.'
  },
  {
    questionNumber: 21,
    questionText: 'What is method overloading in Java?',
    options: ['Defining methods with the same name but different parameter lists within the same class', 'Subclasses providing a specific implementation of a parent class method', 'Calling a method recursively until an exception occurs', 'Creating multiple constructors with identical signatures'],
    correctAnswer: 0,
    explanation: 'Method overloading occurs when methods share a name but differ in parameters (compile-time polymorphism).'
  },
  {
    questionNumber: 22,
    questionText: 'Which block in a try-catch-finally construct is guaranteed to execute regardless of whether an exception occurs?',
    options: ['try', 'catch', 'finally', 'throw'],
    correctAnswer: 2,
    explanation: 'The finally block always executes, usually to clean up external resources.'
  },
  {
    questionNumber: 23,
    questionText: 'What is autoboxing in Java?',
    options: ['Converting an object to an array', 'Automatic conversion between primitive types and their corresponding wrapper classes', 'Serializing an object into a JSON string', 'Passing parameters by reference'],
    correctAnswer: 1,
    explanation: 'Autoboxing is the automatic conversion the Java compiler makes between primitives and wrapper classes (e.g., int to Integer).'
  },
  {
    questionNumber: 24,
    questionText: 'Which of the following classes is thread-safe and implements the Map interface in java.util.concurrent?',
    options: ['HashMap', 'TreeMap', 'ConcurrentHashMap', 'IdentityHashMap'],
    correctAnswer: 2,
    explanation: 'ConcurrentHashMap provides concurrent thread-safe access with segment-level locking.'
  },
  {
    questionNumber: 25,
    questionText: 'What does the "static" keyword denote when applied to a variable?',
    options: ['The variable value cannot be altered', 'The variable belongs to the class rather than instances and is shared across all objects', 'The variable is stored in the CPU cache exclusively', 'The variable is local to the current method frame'],
    correctAnswer: 1,
    explanation: 'Static variables are class-level variables shared across all instances of the class.'
  },
  {
    questionNumber: 26,
    questionText: 'Which functional interface in java.util.function accepts one argument and returns a boolean value?',
    options: ['Consumer', 'Supplier', 'Predicate', 'Function'],
    correctAnswer: 2,
    explanation: 'Predicate<T> represents a predicate (boolean-valued function) of one argument.'
  },
  {
    questionNumber: 27,
    questionText: 'What will happen if a class attempts to inherit from multiple classes using "extends"?',
    options: ['It will compile and run using multiple inheritance', 'A compile-time error occurs because Java does not support multiple class inheritance', 'The right-most class will override the left-most class', 'The JVM throws a RuntimeException'],
    correctAnswer: 1,
    explanation: 'Java does not support multiple inheritance of classes to prevent ambiguity (the Diamond Problem).'
  },
  {
    questionNumber: 28,
    questionText: 'Which stream operation is an intermediate operation in Java 8 Stream API?',
    options: ['collect()', 'forEach()', 'filter()', 'count()'],
    correctAnswer: 2,
    explanation: 'filter() is an intermediate operation that returns a new Stream; collect(), forEach(), and count() are terminal operations.'
  },
  {
    questionNumber: 29,
    questionText: 'Which access modifier allows access within the same class, same package, and subclasses in other packages?',
    options: ['private', 'default (package-private)', 'protected', 'public'],
    correctAnswer: 2,
    explanation: 'protected members are accessible in the same package and in subclasses located in different packages.'
  },
  {
    questionNumber: 30,
    questionText: 'What is the purpose of the Java "Optional" class introduced in Java 8?',
    options: ['To replace primitive data types', 'To provide a container object that may or may not contain a non-null value, mitigating NullPointerExceptions', 'To make methods run faster', 'To enable optional method parameters in Java'],
    correctAnswer: 1,
    explanation: 'java.util.Optional represents a present or absent value to avoid null pointer dereferencing.'
  }
];

const quizQuestions = [
  {
    questionNumber: 1,
    questionText: 'Which tool is used to compile Java source code into bytecode?',
    options: ['java', 'javac', 'javadoc', 'javap'],
    correctAnswer: 1,
    explanation: 'javac is the standard Java compiler command.'
  },
  {
    questionNumber: 2,
    questionText: 'What is the size of an int data type in Java?',
    options: ['16 bits', '32 bits', '64 bits', '8 bits'],
    correctAnswer: 1,
    explanation: 'In Java, an int is a 32-bit signed two’s complement integer.'
  },
  {
    questionNumber: 3,
    questionText: 'Which loop is guaranteed to execute its block at least once?',
    options: ['for loop', 'while loop', 'do-while loop', 'enhanced for-each loop'],
    correctAnswer: 2,
    explanation: 'A do-while loop evaluates its condition after executing the body, ensuring at least one execution.'
  },
  {
    questionNumber: 4,
    questionText: 'Which class is the root superclass of every class in Java?',
    options: ['java.lang.Class', 'java.lang.Object', 'java.lang.System', 'java.lang.Base'],
    correctAnswer: 1,
    explanation: 'java.lang.Object is the ultimate root of the Java class hierarchy.'
  },
  {
    questionNumber: 5,
    questionText: 'Can constructors in Java be declared as static?',
    options: ['Yes, always', 'No, constructors cannot be static', 'Only in abstract classes', 'Only in anonymous inner classes'],
    correctAnswer: 1,
    explanation: 'Constructors initialize individual instances of a class, so they cannot be static.'
  },
  {
    questionNumber: 6,
    questionText: 'Which statement immediately terminates the innermost enclosing loop or switch?',
    options: ['continue', 'break', 'return', 'exit'],
    correctAnswer: 1,
    explanation: 'The break statement terminates execution of the innermost loop or switch construct.'
  },
  {
    questionNumber: 7,
    questionText: 'Which of the following collections maintains elements in sorted ascending order?',
    options: ['HashSet', 'LinkedHashSet', 'TreeSet', 'ArrayList'],
    correctAnswer: 2,
    explanation: 'TreeSet implements NavigableSet and stores elements in natural or comparator-defined sorted order.'
  },
  {
    questionNumber: 8,
    questionText: 'Which keyword prevents a class from being inherited?',
    options: ['static', 'abstract', 'final', 'sealed'],
    correctAnswer: 2,
    explanation: 'A final class cannot be extended by any other class.'
  },
  {
    questionNumber: 9,
    questionText: 'What is the index of the first element in a Java array?',
    options: ['1', '0', '-1', 'Any index defined by user'],
    correctAnswer: 1,
    explanation: 'Java arrays are zero-indexed.'
  },
  {
    questionNumber: 10,
    questionText: 'Which interface allows sorting objects by defining a natural ordering via compareTo()?',
    options: ['Comparator', 'Comparable', 'Sortable', 'Cloneable'],
    correctAnswer: 1,
    explanation: 'Comparable<T> requires implementing compareTo(T o) for natural sorting.'
  },
  {
    questionNumber: 11,
    questionText: 'Which keyword creates an instance of a class in Java?',
    options: ['alloc', 'malloc', 'new', 'create'],
    correctAnswer: 2,
    explanation: 'The "new" keyword allocates memory on the heap and calls the constructor.'
  },
  {
    questionNumber: 12,
    questionText: 'What is the signature of the main entry point method in a standard Java application?',
    options: ['public void main(String[] args)', 'public static void main(String[] args)', 'static void main()', 'protected static int main(String[] args)'],
    correctAnswer: 1,
    explanation: 'The standard entry point is public static void main(String[] args).'
  },
  {
    questionNumber: 13,
    questionText: 'What is the value of 5 % 2 in Java?',
    options: ['2.5', '2', '1', '0'],
    correctAnswer: 2,
    explanation: 'The modulus operator (%) returns the remainder of division: 5 % 2 = 1.'
  },
  {
    questionNumber: 14,
    questionText: 'Which wrapper class corresponds to the primitive char type?',
    options: ['Char', 'Character', 'String', 'Chars'],
    correctAnswer: 1,
    explanation: 'java.lang.Character is the wrapper class for the char primitive.'
  },
  {
    questionNumber: 15,
    questionText: 'What happens when an unhandled runtime exception is thrown on the main thread?',
    options: ['The computer restarts', 'The thread terminates and prints a stack trace to stderr', 'The program automatically ignores it and continues', 'The code recompiles itself'],
    correctAnswer: 1,
    explanation: 'An uncaught exception causes the executing thread to terminate with a printed stack trace.'
  },
  {
    questionNumber: 16,
    questionText: 'Which class should you use for efficient string concatenation inside a single-threaded loop?',
    options: ['String', 'StringBuilder', 'StringBuffer', 'Vector'],
    correctAnswer: 1,
    explanation: 'StringBuilder is unsynchronized and significantly faster for single-threaded string manipulations.'
  },
  {
    questionNumber: 17,
    questionText: 'Can an abstract class instantiate objects directly using the "new" keyword?',
    options: ['Yes, if it has a constructor', 'No, abstract classes cannot be directly instantiated', 'Only if it has no abstract methods', 'Yes, by casting to Object'],
    correctAnswer: 1,
    explanation: 'Abstract classes cannot be instantiated directly; they must be extended by concrete subclasses.'
  },
  {
    questionNumber: 18,
    questionText: 'Which keyword is used to access an overridden method in the superclass?',
    options: ['this', 'super', 'parent', 'base'],
    correctAnswer: 1,
    explanation: 'super.methodName() invokes the superclass version of an overridden method.'
  },
  {
    questionNumber: 19,
    questionText: 'Which method starts the execution of a thread after creating a Thread object?',
    options: ['run()', 'start()', 'execute()', 'init()'],
    correctAnswer: 1,
    explanation: 'start() allocates a new thread call stack and invokes the run() method asynchronously.'
  },
  {
    questionNumber: 20,
    questionText: 'What does the JVM JIT compiler do?',
    options: ['Translates source code to bytecode', 'Compiles frequently executed bytecode into native machine instructions at runtime for speed', 'Checks Java syntax before compilation', 'Manages database connections'],
    correctAnswer: 1,
    explanation: 'The Just-In-Time (JIT) compiler converts hot bytecode paths into native machine code to boost performance.'
  }
];

module.exports = { assessmentQuestions, quizQuestions };
