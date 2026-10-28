// 30 Assessment Questions & 20 Quiz Questions for Web Development
const assessmentQuestions = [
  {
    questionNumber: 1,
    questionText: 'What is the semantic purpose of the HTML5 <article> tag?',
    options: ['To contain side navigation links', 'To represent a self-contained composition intended to be independently distributable', 'To display formatted mathematical articles', 'To define a footer section'],
    correctAnswer: 1,
    explanation: '<article> represents an independent piece of content such as a blog post or news story.'
  },
  {
    questionNumber: 2,
    questionText: 'Which CSS property defines the main axis alignment in a Flexbox container?',
    options: ['align-items', 'justify-content', 'flex-direction', 'align-content'],
    correctAnswer: 1,
    explanation: 'justify-content aligns items along the main axis of a flex container.'
  },
  {
    questionNumber: 3,
    questionText: 'What does the CSS "box-sizing: border-box" declaration do?',
    options: ['Removes margins from elements', 'Includes padding and border within the element’s total specified width and height', 'Adds an automatic shadow around boxes', 'Prevents elements from flexing'],
    correctAnswer: 1,
    explanation: 'border-box incorporates padding and border into width/height computations, preventing sizing overflow.'
  },
  {
    questionNumber: 4,
    questionText: 'In JavaScript, which array method creates a new array populated with the results of calling a provided function on every element?',
    options: ['forEach()', 'filter()', 'map()', 'reduce()'],
    correctAnswer: 2,
    explanation: 'Array.prototype.map() transforms each element and returns a new array of the same length.'
  },
  {
    questionNumber: 5,
    questionText: 'What is the primary function of the JavaScript Event Loop?',
    options: ['To render 3D canvas animations', 'To monitor the Call Stack and Task Queue, pushing callback tasks onto the stack when it is empty', 'To enforce strict typing rules', 'To compile code to machine binary'],
    correctAnswer: 1,
    explanation: 'The Event Loop coordinates non-blocking asynchronous execution between call stack, microtasks, and macrotasks.'
  },
  {
    questionNumber: 6,
    questionText: 'Which HTTP method should be idempotent and used to retrieve representation of resources without side effects?',
    options: ['POST', 'GET', 'PATCH', 'CONNECT'],
    correctAnswer: 1,
    explanation: 'GET requests are safe and idempotent, meaning multiple identical requests produce the same result without state changes.'
  },
  {
    questionNumber: 7,
    questionText: 'What HTTP status code represents "401 Unauthorized"?',
    options: ['The client lacks valid authentication credentials', 'The server cannot find the requested resource', 'The server encountered an unexpected condition', 'The client is authenticated but forbidden from accessing the resource'],
    correctAnswer: 0,
    explanation: '401 Unauthorized indicates that the request lacks valid authentication credentials.'
  },
  {
    questionNumber: 8,
    questionText: 'What is the difference between "let" and "var" in JavaScript?',
    options: ['"let" is block-scoped, while "var" is function-scoped', '"var" is block-scoped, while "let" is global-scoped', 'There is no difference', '"let" variables cannot be reassigned'],
    correctAnswer: 0,
    explanation: '"let" obeys block scoping and is not hoisted in the same manner as function-scoped "var".'
  },
  {
    questionNumber: 9,
    questionText: 'What hook in React is used to execute side effects like data fetching and subscriptions?',
    options: ['useState', 'useReducer', 'useEffect', 'useMemo'],
    correctAnswer: 2,
    explanation: 'useEffect handles component lifecycles and side effects in React functional components.'
  },
  {
    questionNumber: 10,
    questionText: 'In React, why must list elements rendered via map() have unique "key" props?',
    options: ['To style them differently in CSS', 'To allow React’s reconciliation algorithm to efficiently identify, reorder, or update elements', 'To bind click handlers automatically', 'To define database IDs'],
    correctAnswer: 1,
    explanation: 'Keys allow React to track which items have changed, been added, or been removed during reconciliation.'
  },
  {
    questionNumber: 11,
    questionText: 'What is the purpose of Cross-Origin Resource Sharing (CORS)?',
    options: ['To speed up image rendering', 'To allow a web application running at one origin to securely access resources from a different origin', 'To encrypt database passwords', 'To compress HTTP payloads'],
    correctAnswer: 1,
    explanation: 'CORS is a browser security mechanism that relaxes the Same-Origin Policy via specific HTTP headers.'
  },
  {
    questionNumber: 12,
    questionText: 'What does JSON Web Token (JWT) consist of?',
    options: ['Header, Payload, and Signature separated by dots', 'Encrypted binary file', 'Plain text username and password', 'XML document with public key'],
    correctAnswer: 0,
    explanation: 'A JWT consists of three Base64URL-encoded parts: Header, Payload, and Signature, separated by dots.'
  },
  {
    questionNumber: 13,
    questionText: 'What does the "z-index" property in CSS determine?',
    options: ['Horizontal zoom level', 'The stack order of positioned elements along the z-axis', 'Font size scaling', '3D rotation degree'],
    correctAnswer: 1,
    explanation: 'z-index sets the stack level of an element when its position is not static.'
  },
  {
    questionNumber: 14,
    questionText: 'What is a JavaScript Closure?',
    options: ['A function that cannot return a value', 'A function bundled together with references to its surrounding lexical environment', 'A method to close browser tabs', 'A syntax error in JavaScript'],
    correctAnswer: 1,
    explanation: 'A closure gives a function access to its outer scope even after the outer function has closed.'
  },
  {
    questionNumber: 15,
    questionText: 'Which React hook is designed for memoizing expensive calculations across renders?',
    options: ['useCallback', 'useMemo', 'useRef', 'useState'],
    correctAnswer: 1,
    explanation: 'useMemo returns a memoized value, recalculating only when declared dependencies change.'
  },
  {
    questionNumber: 16,
    questionText: 'What is the purpose of the HTML <meta name="viewport" content="width=device-width, initial-scale=1.0"> tag?',
    options: ['To load browser plugins', 'To configure viewport dimensions and scaling for responsive mobile viewing', 'To set the character encoding to UTF-8', 'To track page views'],
    correctAnswer: 1,
    explanation: 'The viewport meta tag instructs the browser how to adjust the page dimensions and scaling to screen size.'
  },
  {
    questionNumber: 17,
    questionText: 'In CSS Grid, which property specifies the sizes of columns in a grid layout?',
    options: ['grid-column-gap', 'grid-template-columns', 'grid-auto-flow', 'column-count'],
    correctAnswer: 1,
    explanation: 'grid-template-columns defines the line names and track sizing functions of grid columns.'
  },
  {
    questionNumber: 18,
    questionText: 'Which HTTP header is typically used to transmit JWT authorization tokens?',
    options: ['Accept-Encoding', 'Authorization: Bearer <token>', 'Content-Type: application/jwt', 'User-Agent'],
    correctAnswer: 1,
    explanation: 'Standard authentication sends tokens in the "Authorization: Bearer <token>" header.'
  },
  {
    questionNumber: 19,
    questionText: 'What is the Virtual DOM in React?',
    options: ['Direct memory access to GPU hardware', 'An in-memory lightweight representation of the real DOM tree used to compute minimal DOM diffs', 'A browser extension for debugging', 'A replacement for CSS stylesheets'],
    correctAnswer: 1,
    explanation: 'The Virtual DOM allows React to batch and compute diffs before updating the slower real browser DOM.'
  },
  {
    questionNumber: 20,
    questionText: 'What is the output of "typeof null" in JavaScript?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctAnswer: 2,
    explanation: 'In JavaScript, typeof null returns "object", a famous historical legacy bug in JS.'
  },
  {
    questionNumber: 21,
    questionText: 'Which CSS selector targets an element with id="main-header"?',
    options: ['.main-header', '#main-header', '*main-header', 'header#all'],
    correctAnswer: 1,
    explanation: 'The hash symbol (#) selects elements by their id attribute.'
  },
  {
    questionNumber: 22,
    questionText: 'What does the spread operator (...) do when used with an object in ES6?',
    options: ['Deletes all object keys', 'Copies enumerable properties from one object into another object', 'Converts the object to an XML string', 'Locks the object from modification'],
    correctAnswer: 1,
    explanation: 'Object spread shallow-copies properties into a new object literal.'
  },
  {
    questionNumber: 23,
    questionText: 'In React, what is "prop drilling"?',
    options: ['Optimizing component build times', 'Passing props through multiple intermediate components that do not need them directly', 'Validating form inputs', 'Connecting to external databases directly'],
    correctAnswer: 1,
    explanation: 'Prop drilling occurs when data is passed down through several nested component layers unnecessarily.'
  },
  {
    questionNumber: 24,
    questionText: 'Which CSS unit is relative to the font-size of the root <html> element?',
    options: ['em', 'rem', 'vh', 'px'],
    correctAnswer: 1,
    explanation: 'rem stands for "root em" and is relative to the root element’s font-size.'
  },
  {
    questionNumber: 25,
    questionText: 'What is the purpose of Axios interceptors in frontend applications?',
    options: ['To prevent users from navigating pages', 'To intercept requests or responses before they are handled by then/catch (e.g., attach JWT tokens or handle 401s)', 'To translate HTML to Spanish', 'To encrypt images on the client'],
    correctAnswer: 1,
    explanation: 'Axios interceptors allow global inspection and modification of outgoing requests and incoming responses.'
  },
  {
    questionNumber: 26,
    questionText: 'Which JavaScript method parses a JSON string into a JavaScript object?',
    options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'JSON.decode()'],
    correctAnswer: 1,
    explanation: 'JSON.parse() parses a JSON-formatted string and constructs the corresponding JavaScript value or object.'
  },
  {
    questionNumber: 27,
    questionText: 'What does the "useCallback" hook return in React?',
    options: ['A memoized callback function that only changes if one of the dependencies has changed', 'A promise that executes in the background', 'The current state value', 'A DOM reference'],
    correctAnswer: 0,
    explanation: 'useCallback caches a function definition between renders to prevent unnecessary child re-renders.'
  },
  {
    questionNumber: 28,
    questionText: 'What is event delegation in JavaScript DOM programming?',
    options: ['Binding an event handler to every child element individually', 'Attaching a single event listener to a common parent element and using event bubbling to handle child events', 'Preventing all mouse clicks on a page', 'Passing events to a web worker'],
    correctAnswer: 1,
    explanation: 'Event delegation leverages event bubbling to manage events on dynamic children via a single parent listener.'
  },
  {
    questionNumber: 29,
    questionText: 'Which CSS pseudo-class matches an element when a user hovers over it with a pointing device?',
    options: [':focus', ':active', ':hover', ':visited'],
    correctAnswer: 2,
    explanation: ':hover applies styles when the user positions the cursor over an element.'
  },
  {
    questionNumber: 30,
    questionText: 'What is the purpose of Single Page Applications (SPAs) using React Router?',
    options: ['To re-fetch the entire HTML page from the server on every link click', 'To dynamically rewrite the current page without full-page reloads, providing a fast native-like app experience', 'To store databases inside the browser cache', 'To disable CSS styling'],
    correctAnswer: 1,
    explanation: 'SPAs intercept URL changes and update the UI in-place via client-side routing without reloading the browser.'
  }
];

const quizQuestions = [
  {
    questionNumber: 1,
    questionText: 'What does HTML stand for?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink and Text Management Language', 'Home Tool Markup Language'],
    correctAnswer: 0,
    explanation: 'HTML stands for Hyper Text Markup Language.'
  },
  {
    questionNumber: 2,
    questionText: 'Which HTML tag is used to create a hyperlink?',
    options: ['<link>', '<a>', '<href>', '<url>'],
    correctAnswer: 1,
    explanation: 'The <a> (anchor) tag defines a hyperlink.'
  },
  {
    questionNumber: 3,
    questionText: 'Which CSS property changes the text color of an element?',
    options: ['text-color', 'font-color', 'color', 'background-color'],
    correctAnswer: 2,
    explanation: 'The "color" property sets the foreground text color.'
  },
  {
    questionNumber: 4,
    questionText: 'What is the default display value of a <div> element?',
    options: ['inline', 'block', 'inline-block', 'flex'],
    correctAnswer: 1,
    explanation: '<div> elements default to display: block.'
  },
  {
    questionNumber: 5,
    questionText: 'Which keyword declares a block-scoped constant in JavaScript?',
    options: ['var', 'let', 'const', 'immutable'],
    correctAnswer: 2,
    explanation: 'The "const" keyword declares a block-scoped constant variable.'
  },
  {
    questionNumber: 6,
    questionText: 'What does CSS stand for?',
    options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Syntax', 'Colorful Style Sheets'],
    correctAnswer: 1,
    explanation: 'CSS stands for Cascading Style Sheets.'
  },
  {
    questionNumber: 7,
    questionText: 'Which operator checks for both value and type equality in JavaScript?',
    options: ['==', '===', '=', '!='],
    correctAnswer: 1,
    explanation: '=== is the strict equality operator that compares value and type without type coercion.'
  },
  {
    questionNumber: 8,
    questionText: 'What JSX attribute is used instead of "class" in React components?',
    options: ['className', 'classId', 'styleClass', 'cssClass'],
    correctAnswer: 0,
    explanation: 'React uses className because class is a reserved keyword in JavaScript.'
  },
  {
    questionNumber: 9,
    questionText: 'Which HTML attribute specifies an alternative text for an image if it cannot be displayed?',
    options: ['title', 'alt', 'src', 'caption'],
    correctAnswer: 1,
    explanation: 'The "alt" attribute provides alternative text for accessibility and broken images.'
  },
  {
    questionNumber: 10,
    questionText: 'What status code indicates a successful HTTP request?',
    options: ['200 OK', '404 Not Found', '500 Server Error', '301 Moved Permanently'],
    correctAnswer: 0,
    explanation: '200 OK is the standard response for successful HTTP requests.'
  },
  {
    questionNumber: 11,
    questionText: 'Which built-in function displays an alert dialog box in browser JavaScript?',
    options: ['msg()', 'alert()', 'prompt()', 'console.log()'],
    correctAnswer: 1,
    explanation: 'window.alert() displays a modal dialog with a specified message.'
  },
  {
    questionNumber: 12,
    questionText: 'How do you add a comment in CSS?',
    options: ['// this is a comment', '/* this is a comment */', '<!-- this is a comment -->', '# this is a comment'],
    correctAnswer: 1,
    explanation: 'CSS comments are placed inside /* ... */.'
  },
  {
    questionNumber: 13,
    questionText: 'What hook is used to manage local component state in React functional components?',
    options: ['useStatus', 'useContext', 'useState', 'useEffect'],
    correctAnswer: 2,
    explanation: 'useState declares a state variable and its updater function.'
  },
  {
    questionNumber: 14,
    questionText: 'What is the purpose of the CSS "display: none" declaration?',
    options: ['Makes the element transparent but preserves its layout space', 'Completely removes the element from the document visual rendering flow', 'Hides only the text content', 'Changes the element to inline'],
    correctAnswer: 1,
    explanation: 'display: none removes the element from rendering, taking up 0 space.'
  },
  {
    questionNumber: 15,
    questionText: 'Which method converts a JavaScript object into a JSON string?',
    options: ['JSON.parse()', 'JSON.stringify()', 'JSON.encode()', 'JSON.toString()'],
    correctAnswer: 1,
    explanation: 'JSON.stringify() serializes a JavaScript object into a JSON string.'
  },
  {
    questionNumber: 16,
    questionText: 'What does DOM stand for in web browsers?',
    options: ['Document Object Model', 'Data Output Mechanism', 'Digital Object Management', 'Dynamic Order Module'],
    correctAnswer: 0,
    explanation: 'DOM stands for Document Object Model, the tree representation of the webpage.'
  },
  {
    questionNumber: 17,
    questionText: 'Which HTTP header specifies the MIME media type of the request or response entity?',
    options: ['Accept', 'Content-Type', 'User-Agent', 'Authorization'],
    correctAnswer: 1,
    explanation: 'Content-Type indicates the media type of the resource (e.g. application/json).'
  },
  {
    questionNumber: 18,
    questionText: 'Which symbol is used for template literals in modern JavaScript?',
    options: ['Single quotes (\')', 'Double quotes (")', 'Backticks (`)', 'Tildes (~)'],
    correctAnswer: 2,
    explanation: 'Template literals are enclosed by backticks (`) and allow embedded expressions via ${}.'
  },
  {
    questionNumber: 19,
    questionText: 'In React, what are props?',
    options: ['Internal mutable state', 'Read-only inputs passed from a parent component to a child component', 'CSS properties applied to elements', 'Database records'],
    correctAnswer: 1,
    explanation: 'Props are arbitrary inputs passed into React components, and are read-only.'
  },
  {
    questionNumber: 20,
    questionText: 'Which CSS property is used to create space around elements, outside of any defined borders?',
    options: ['padding', 'margin', 'spacing', 'border-spacing'],
    correctAnswer: 1,
    explanation: 'Margin creates space around elements outside borders; padding creates space inside borders.'
  }
];

module.exports = { assessmentQuestions, quizQuestions };
