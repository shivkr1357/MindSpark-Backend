import mongoose from "mongoose";
import dotenv from "dotenv";
// import { initializeFirebase } from "../config/firebase.js";
import { connectDB } from "../config/db.js";
import {
  Subject,
  Syllabus,
  InterviewQuestion,
  FunContent,
  User,
  FeaturedContent,
  FeaturedQuestion,
  TopRatedSubject,
  Achievement,
  ProgressStats,
  QuizQuestion,
  Puzzle,
  Meme,
  Motivation,
  CodingQuestion,
  Lesson,
} from "../models/index.js";

// Load environment variables
dotenv.config();

// Sample data based on your React Native hooks
const subjectsData = [
  {
    title: "JavaScript Fundamentals",
    description: "Core JavaScript concepts, ES6+ features, and modern syntax",
    icon: "logo-javascript",
    color: "#3B82F6",
    difficulty: "Beginner",
    estimatedTime: "12h",
    totalLessons: 15,
    completedLessons: 8,
    progress: 53,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "React & React Native",
    description:
      "Component lifecycle, hooks, state management, and mobile development",
    icon: "logo-react",
    color: "#61DAFB",
    difficulty: "Intermediate",
    estimatedTime: "8h",
    totalLessons: 12,
    completedLessons: 5,
    progress: 42,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "Data Structures & Algorithms",
    description:
      "Arrays, objects, sorting, searching, and problem-solving techniques",
    icon: "code-slash",
    color: "#10B981",
    difficulty: "Advanced",
    estimatedTime: "15h",
    totalLessons: 20,
    completedLessons: 3,
    progress: 15,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "System Design",
    description: "Architecture patterns, scalability, and distributed systems",
    icon: "git-network",
    color: "#8B5CF6",
    difficulty: "Expert",
    estimatedTime: "20h",
    totalLessons: 25,
    completedLessons: 0,
    progress: 0,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "Node.js & Backend",
    description: "Server-side JavaScript, APIs, databases, and deployment",
    icon: "server",
    color: "#10B981",
    difficulty: "Intermediate",
    estimatedTime: "10h",
    totalLessons: 14,
    completedLessons: 7,
    progress: 50,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "Database & SQL",
    description: "Database design, queries, optimization, and NoSQL concepts",
    icon: "database",
    color: "#F59E0B",
    difficulty: "Intermediate",
    estimatedTime: "14h",
    totalLessons: 18,
    completedLessons: 12,
    progress: 67,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "Web Security",
    description:
      "Authentication, authorization, HTTPS, and security best practices",
    icon: "shield-checkmark",
    color: "#EF4444",
    difficulty: "Advanced",
    estimatedTime: "8h",
    totalLessons: 10,
    completedLessons: 2,
    progress: 20,
    createdBy: "system",
    isActive: true,
  },
  {
    title: "Testing & Quality",
    description:
      "Unit testing, integration testing, and code quality practices",
    icon: "checkmark-circle",
    color: "#06B6D4",
    difficulty: "Intermediate",
    estimatedTime: "6h",
    totalLessons: 8,
    completedLessons: 6,
    progress: 75,
    createdBy: "system",
    isActive: true,
  },
];

// Dashboard seed data
const featuredContentData = [
  {
    title: "JavaScript Fundamentals Crash Course",
    description: "Master the basics of JavaScript in 2 hours",
    type: "course",
    duration: "2h",
    rating: 4.8,
    students: 1250,
    color: "#3B82F6",
    icon: "logo-javascript",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "React Hooks Deep Dive",
    description: "Learn advanced React patterns and hooks",
    type: "tutorial",
    duration: "1.5h",
    rating: 4.9,
    students: 890,
    color: "#61DAFB",
    icon: "logo-react",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Algorithm Problem Solving",
    description: "Solve coding challenges step by step",
    type: "challenge",
    duration: "3h",
    rating: 4.7,
    students: 2100,
    color: "#10B981",
    icon: "code-slash",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "System Design Patterns",
    description: "Build scalable applications with proven patterns",
    type: "course",
    duration: "4h",
    rating: 4.6,
    students: 750,
    color: "#8B5CF6",
    icon: "git-network",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Node.js Backend Mastery",
    description: "Build robust server-side applications",
    type: "course",
    duration: "5h",
    rating: 4.5,
    students: 680,
    color: "#10B981",
    icon: "server",
    isActive: true,
    createdBy: "system",
  },
];

const featuredQuestionsData = [
  {
    title: "What is the difference between let, const, and var?",
    category: "JavaScript Fundamentals",
    difficulty: "Easy",
    views: 15420,
    answered: false,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "How do you optimize React component re-renders?",
    category: "React & React Native",
    difficulty: "Medium",
    views: 8930,
    answered: false,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Implement a binary search algorithm",
    category: "Data Structures & Algorithms",
    difficulty: "Medium",
    views: 12750,
    answered: false,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Design a URL shortener service",
    category: "System Design",
    difficulty: "Hard",
    views: 6780,
    answered: false,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Explain the CAP theorem",
    category: "Database & SQL",
    difficulty: "Hard",
    views: 4520,
    answered: false,
    isActive: true,
    createdBy: "system",
  },
];

const topRatedSubjectsData = [
  {
    title: "JavaScript Fundamentals",
    rating: 4.9,
    students: 3450,
    progress: 75,
    color: "#3B82F6",
    icon: "logo-javascript",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "React & React Native",
    rating: 4.8,
    students: 2890,
    progress: 60,
    color: "#61DAFB",
    icon: "logo-react",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Data Structures & Algorithms",
    rating: 4.7,
    students: 4120,
    progress: 45,
    color: "#10B981",
    icon: "code-slash",
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Node.js & Backend",
    rating: 4.6,
    students: 1980,
    progress: 80,
    color: "#10B981",
    icon: "server",
    isActive: true,
    createdBy: "system",
  },
];

const achievementsData = [
  {
    title: "First Steps",
    description: "Completed your first lesson",
    icon: "trophy",
    color: "#F59E0B",
    date: new Date("2024-01-15T10:30:00Z"),
    type: "lesson",
    points: 10,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "JavaScript Master",
    description: "Completed JavaScript Fundamentals course",
    icon: "medal",
    color: "#3B82F6",
    date: new Date("2024-01-14T16:45:00Z"),
    type: "course",
    points: 50,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Problem Solver",
    description: "Solved 50 coding challenges",
    icon: "star",
    color: "#10B981",
    date: new Date("2024-01-13T14:20:00Z"),
    type: "challenge",
    points: 75,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Streak Master",
    description: "7-day learning streak",
    icon: "flame",
    color: "#EF4444",
    date: new Date("2024-01-12T09:15:00Z"),
    type: "streak",
    points: 25,
    isActive: true,
    createdBy: "system",
  },
  {
    title: "Quiz Champion",
    description: "Achieved 90% accuracy in quizzes",
    icon: "checkmark-circle",
    color: "#06B6D4",
    date: new Date("2024-01-11T11:30:00Z"),
    type: "milestone",
    points: 40,
    isActive: true,
    createdBy: "system",
  },
];

const progressStatsData = [
  {
    userId: "default",
    lessonsCompleted: 24,
    questionsAnswered: 156,
    accuracy: 87,
    totalStudyTime: 1200, // 20 hours in minutes
    streak: 7,
    level: 3,
    experience: 450,
    createdBy: "system",
  },
];

const interviewQuestionsData = [
  // JavaScript Fundamentals
  {
    subjectId: "", // Will be set after subjects are created
    question:
      "What is the difference between let, const, and var in JavaScript?",
    options: [
      "let and const are block-scoped, var is function-scoped",
      "let and const are function-scoped, var is block-scoped",
      "All three have the same scoping rules",
      "let is block-scoped, const and var are function-scoped",
    ],
    correctAnswer: 0,
    difficulty: "Easy",
    explanation:
      "let and const are block-scoped, meaning they are only accessible within the block they are declared in. var is function-scoped, making it accessible throughout the entire function.",
    category: "JavaScript Fundamentals",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "What are closures in JavaScript? Provide practical examples.",
    options: [
      "Functions that have access to variables in their outer scope",
      "Functions that can only access global variables",
      "Functions that are defined inside other functions",
      "Functions that return other functions",
    ],
    correctAnswer: 0,
    difficulty: "Medium",
    explanation:
      "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns. This is a fundamental concept in JavaScript.",
    category: "JavaScript Fundamentals",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "Explain the concept of hoisting in JavaScript",
    options: [
      "Variables and function declarations are moved to the top of their scope",
      "Variables are automatically initialized with undefined",
      "Functions can be called before they are declared",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Medium",
    explanation:
      "Hoisting is JavaScript's behavior of moving declarations to the top of their scope. Variable declarations are hoisted but not their values, while function declarations are fully hoisted.",
    category: "JavaScript Fundamentals",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "What is the difference between == and === in JavaScript?",
    options: [
      "== performs type coercion, === does not",
      "=== performs type coercion, == does not",
      "Both perform type coercion",
      "There is no difference",
    ],
    correctAnswer: 0,
    difficulty: "Easy",
    explanation:
      "The == operator performs type coercion before comparing values, while === performs strict equality comparison without type coercion.",
    category: "JavaScript Fundamentals",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "Explain async/await and how it differs from Promises",
    options: [
      "async/await is syntactic sugar over Promises",
      "Promises are syntactic sugar over async/await",
      "They are completely different concepts",
      "async/await can only be used with Promises",
    ],
    correctAnswer: 0,
    difficulty: "Hard",
    explanation:
      "async/await is syntactic sugar that makes asynchronous code look and behave more like synchronous code. It's built on top of Promises but provides cleaner syntax.",
    category: "JavaScript Fundamentals",
    createdBy: "system",
  },
  // React & React Native
  {
    subjectId: "",
    question: "Explain React component lifecycle methods and hooks",
    options: [
      "Lifecycle methods are class-based, hooks are for functional components",
      "Hooks replace lifecycle methods in functional components",
      "Both can be used interchangeably",
      "Lifecycle methods are deprecated",
    ],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation:
      "Lifecycle methods like componentDidMount, componentDidUpdate are used in class components. Hooks like useEffect provide similar functionality in functional components.",
    category: "React & React Native",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "What is the difference between state and props in React?",
    options: [
      "State is mutable, props are immutable",
      "Props are mutable, state is immutable",
      "Both are mutable",
      "Both are immutable",
    ],
    correctAnswer: 0,
    difficulty: "Easy",
    explanation:
      "State is internal to a component and can be changed using setState or useState. Props are passed down from parent components and are read-only.",
    category: "React & React Native",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "How do you handle navigation in React Native?",
    options: [
      "Using React Navigation library",
      "Using React Router",
      "Using native navigation APIs",
      "All of the above",
    ],
    correctAnswer: 0,
    difficulty: "Medium",
    explanation:
      "React Navigation is the most popular library for handling navigation in React Native applications. It provides a JavaScript-based navigation solution.",
    category: "React & React Native",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "Explain the Virtual DOM and how it improves performance",
    options: [
      "Virtual DOM is a JavaScript representation of the real DOM",
      "It allows React to batch updates and minimize DOM manipulations",
      "It uses a diffing algorithm to update only changed elements",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Hard",
    explanation:
      "Virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to efficiently update the UI by comparing the virtual DOM with the previous version and applying only the necessary changes.",
    category: "React & React Native",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "What are React hooks and when should you use them?",
    options: [
      "Hooks allow you to use state and lifecycle features in functional components",
      "Hooks should be used at the top level of React functions",
      "Custom hooks allow you to extract component logic into reusable functions",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Medium",
    explanation:
      "React hooks are functions that let you use state and other React features in functional components. They should be called at the top level and can be used to create custom logic.",
    category: "React & React Native",
    createdBy: "system",
  },
  // Data Structures & Algorithms
  {
    subjectId: "",
    question:
      "Implement a binary search algorithm with time complexity analysis",
    options: [
      "O(log n) time complexity",
      "O(n) time complexity",
      "O(n log n) time complexity",
      "O(1) time complexity",
    ],
    correctAnswer: 0,
    difficulty: "Hard",
    explanation:
      "Binary search has O(log n) time complexity because it eliminates half of the search space with each comparison, making it very efficient for sorted arrays.",
    category: "Data Structures & Algorithms",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "Explain the difference between arrays and linked lists",
    options: [
      "Arrays have contiguous memory, linked lists have scattered memory",
      "Arrays have O(1) random access, linked lists have O(n) random access",
      "Arrays have fixed size, linked lists can grow dynamically",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Medium",
    explanation:
      "Arrays store elements in contiguous memory locations with fixed size and O(1) random access. Linked lists store elements in scattered memory with pointers, allowing dynamic growth but O(n) random access.",
    category: "Data Structures & Algorithms",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "What is Big O notation and why is it important?",
    options: [
      "It describes the worst-case time complexity of an algorithm",
      "It helps compare the efficiency of different algorithms",
      "It's used to analyze space complexity as well",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Easy",
    explanation:
      "Big O notation describes the time and space complexity of algorithms, helping developers choose the most efficient solution for their problems.",
    category: "Data Structures & Algorithms",
    createdBy: "system",
  },
  // System Design
  {
    subjectId: "",
    question: "How would you design a URL shortener like bit.ly?",
    options: [
      "Use hash functions to generate short URLs",
      "Implement a distributed system with load balancers",
      "Use a database to store URL mappings",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Hard",
    explanation:
      "A URL shortener requires hash generation, database storage, load balancing, caching, and considerations for scalability and security.",
    category: "System Design",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "Design a chat application like WhatsApp",
    options: [
      "Use WebSockets for real-time communication",
      "Implement message queuing and delivery guarantees",
      "Design for scalability with multiple servers",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Hard",
    explanation:
      "A chat application requires real-time communication, message persistence, delivery guarantees, scalability, and security features.",
    category: "System Design",
    createdBy: "system",
  },
  // Node.js & Backend
  {
    subjectId: "",
    question: "Explain the event loop in Node.js",
    options: [
      "It handles asynchronous operations in a single-threaded environment",
      "It uses callbacks, promises, and async/await",
      "It has different phases: timers, I/O, idle, prepare, poll, check, close",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Hard",
    explanation:
      "The event loop is the core of Node.js that enables non-blocking I/O operations. It processes callbacks and manages the execution of asynchronous code.",
    category: "Node.js & Backend",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "How do you handle authentication in a Node.js API?",
    options: [
      "Use JWT tokens for stateless authentication",
      "Implement middleware to verify tokens",
      "Hash passwords with bcrypt",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Medium",
    explanation:
      "Node.js authentication typically involves JWT tokens, middleware verification, password hashing, and secure session management.",
    category: "Node.js & Backend",
    createdBy: "system",
  },
  // Database & SQL
  {
    subjectId: "",
    question: "Explain the difference between SQL and NoSQL databases",
    options: [
      "SQL is relational with ACID properties, NoSQL is non-relational",
      "SQL uses structured schemas, NoSQL is schema-less",
      "SQL scales vertically, NoSQL scales horizontally",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Easy",
    explanation:
      "SQL databases are relational with structured schemas and ACID properties, while NoSQL databases are non-relational, schema-less, and designed for horizontal scaling.",
    category: "Database & SQL",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "What are database indexes and when should you use them?",
    options: [
      "Indexes speed up data retrieval operations",
      "They should be used on frequently queried columns",
      "Too many indexes can slow down write operations",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Medium",
    explanation:
      "Database indexes are data structures that improve the speed of data retrieval operations but can slow down write operations and require additional storage space.",
    category: "Database & SQL",
    createdBy: "system",
  },
  // Web Security
  {
    subjectId: "",
    question: "What are the main security vulnerabilities in web applications?",
    options: [
      "OWASP Top 10 includes XSS, SQL Injection, CSRF",
      "Insecure authentication and session management",
      "Security misconfiguration and sensitive data exposure",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Hard",
    explanation:
      "The OWASP Top 10 lists the most critical security risks in web applications, including injection attacks, broken authentication, and security misconfigurations.",
    category: "Web Security",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "Explain Cross-Site Scripting (XSS) and how to prevent it",
    options: [
      "XSS allows attackers to inject malicious scripts into web pages",
      "Prevent by validating and sanitizing user input",
      "Use Content Security Policy (CSP) headers",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Medium",
    explanation:
      "XSS attacks occur when malicious scripts are injected into web pages. Prevention includes input validation, output encoding, and implementing CSP headers.",
    category: "Web Security",
    createdBy: "system",
  },
  // Testing & Quality
  {
    subjectId: "",
    question:
      "What is the difference between unit testing and integration testing?",
    options: [
      "Unit tests test individual components in isolation",
      "Integration tests test how components work together",
      "Unit tests are faster, integration tests are more comprehensive",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Easy",
    explanation:
      "Unit testing focuses on testing individual components in isolation, while integration testing verifies that different components work correctly together.",
    category: "Testing & Quality",
    createdBy: "system",
  },
  {
    subjectId: "",
    question: "Explain Test-Driven Development (TDD) and its benefits",
    options: [
      "Write tests before writing the actual code",
      "Improves code quality and reduces bugs",
      "Makes refactoring safer and easier",
      "All of the above",
    ],
    correctAnswer: 3,
    difficulty: "Medium",
    explanation:
      "TDD is a development approach where tests are written before the implementation. It leads to better design, fewer bugs, and safer refactoring.",
    category: "Testing & Quality",
    createdBy: "system",
  },
];

const funContentData = [
  // Quiz Games
  {
    type: "quiz",
    title: "JavaScript Fundamentals Quiz",
    content:
      "Test your knowledge of basic JavaScript concepts with 20 questions covering variables, functions, and DOM manipulation.",
    difficulty: "Easy",
    subjectId: "", // Will be set after subjects are created
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "React Hooks Mastery Quiz",
    content:
      "Advanced questions about React hooks, patterns, and best practices for modern React development.",
    difficulty: "Hard",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "CSS Flexbox & Grid Quiz",
    content:
      "Master CSS layout techniques with questions about Flexbox and Grid systems.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "TypeScript Fundamentals Quiz",
    content:
      "Test your TypeScript knowledge and type safety concepts with practical examples.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "Git & Version Control Quiz",
    content:
      "Master Git commands and version control concepts for collaborative development.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "Web Performance Quiz",
    content:
      "Optimize web applications for better performance with advanced techniques.",
    difficulty: "Hard",
    subjectId: "",
    createdBy: "system",
  },

  // Puzzle Games
  {
    type: "puzzle",
    title: "Binary Tree Logic Puzzle",
    content:
      "Arrange the binary tree traversal steps in the correct order. Solve complex binary tree traversal problems.",
    difficulty: "Hard",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "puzzle",
    title: "Code Syntax Puzzle",
    content:
      "Arrange code snippets in correct order to create a working JavaScript function.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "puzzle",
    title: "Algorithm Flowchart Puzzle",
    content:
      "Connect flowchart elements for sorting algorithm. Design the perfect bubble sort flow.",
    difficulty: "Hard",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "puzzle",
    title: "Database Schema Puzzle",
    content:
      "Design optimal database relationships for an e-commerce system with proper normalization.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "puzzle",
    title: "API Endpoint Puzzle",
    content:
      "Design RESTful API endpoints for e-commerce platform with proper HTTP methods and status codes.",
    difficulty: "Hard",
    subjectId: "",
    createdBy: "system",
  },

  // Coding Challenges
  {
    type: "quiz",
    title: "React Hooks Challenge",
    content:
      "Build a custom hook for API data fetching with error handling and loading states.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "JavaScript Array Methods Challenge",
    content:
      "Transform data using array methods like map, filter, and reduce in practical scenarios.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "CSS Animation Challenge",
    content:
      "Create smooth loading animations and transitions using CSS keyframes and transforms.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "React Component Challenge",
    content:
      "Build a reusable modal component with accessibility features and proper event handling.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "Node.js API Challenge",
    content:
      "Create a RESTful API with authentication, middleware, and proper error handling.",
    difficulty: "Hard",
    subjectId: "",
    createdBy: "system",
  },

  // Memes & Jokes
  {
    type: "meme",
    title: "Programming Memes Collection",
    content:
      "Laugh with the latest programming memes about debugging, code reviews, and developer life.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "meme",
    title: "Debugging Jokes & Puns",
    content:
      "Hilarious debugging scenarios and code puns that every developer can relate to.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "meme",
    title: "Stack Overflow Memes",
    content:
      "Classic Stack Overflow moments and the eternal struggle of finding the right answer.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "meme",
    title: "Git Commit Messages Memes",
    content:
      "Funny git commit message fails and successes that every developer has experienced.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "meme",
    title: "Code Review Memes",
    content:
      "Hilarious code review experiences and the art of constructive criticism.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },

  // Motivation
  {
    type: "motivational",
    title: "Daily Coding Motivation",
    content:
      "Inspirational quotes for developers: 'Code is like humor. When you have to explain it, it's bad.' - Cory House",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "motivational",
    title: "Success Stories Collection",
    content:
      "Real developer success stories: From bootcamp to senior developer, self-taught success, and career changes.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "motivational",
    title: "Career Growth Tips",
    content:
      "Tips for advancing your tech career: Build strong portfolios, contribute to open source, practice system design.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },

  // Trivia
  {
    type: "quiz",
    title: "Tech Trivia - AI Edition",
    content:
      "Test your knowledge about AI and machine learning with fascinating facts and history.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "Programming Languages Trivia",
    content:
      "History and facts about programming languages from FORTRAN to modern languages.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "Tech Company Trivia",
    content:
      "Facts about major tech companies, their founders, and interesting company histories.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },

  // Memory Games (represented as quiz type)
  {
    type: "quiz",
    title: "Algorithm Memory Game",
    content:
      "Match algorithm names with their time complexity and understand Big O notation.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "CSS Properties Memory",
    content:
      "Remember CSS properties and their values in this memory challenge game.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "JavaScript Methods Memory",
    content: "Match JavaScript methods with their descriptions and use cases.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },

  // Code Snippets (represented as quiz type)
  {
    type: "quiz",
    title: "React Custom Hooks Snippets",
    content:
      "Learn reusable React hooks patterns with practical code examples and best practices.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "CSS Grid Layout Snippets",
    content:
      "Master CSS Grid with practical examples and responsive layout techniques.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "JavaScript Array Methods Snippets",
    content:
      "Essential array manipulation techniques with real-world examples and use cases.",
    difficulty: "Easy",
    subjectId: "",
    createdBy: "system",
  },

  // Daily Challenges
  {
    type: "quiz",
    title: "Daily Challenge: Build a Calculator",
    content:
      "Create a functional calculator using vanilla JavaScript with proper event handling.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "Daily Challenge: CSS Animation",
    content:
      "Create smooth loading animations with CSS keyframes and transform properties.",
    difficulty: "Hard",
    subjectId: "",
    createdBy: "system",
  },
  {
    type: "quiz",
    title: "Daily Challenge: API Integration",
    content:
      "Fetch and display data from a REST API with proper error handling and loading states.",
    difficulty: "Medium",
    subjectId: "",
    createdBy: "system",
  },
];

const syllabusData = [
  {
    subjectId: "", // Will be set after subjects are created
    title: "JavaScript Fundamentals - Complete Guide",
    description: "Master JavaScript from basics to advanced concepts",
    difficulty: "Beginner",
    modules: [
      {
        title: "Introduction to JavaScript",
        order: 1,
        lessons: [
          {
            title: "What is JavaScript?",
            content: "Introduction to JavaScript programming language",
            duration: "30min",
            type: "video",
            order: 1,
          },
          {
            title: "Setting up Development Environment",
            content: "Setting up VS Code, Node.js, and browser tools",
            duration: "45min",
            type: "text",
            order: 2,
          },
        ],
      },
      {
        title: "Variables and Data Types",
        order: 2,
        lessons: [
          {
            title: "let, const, and var",
            content: "Deep dive into variable declarations and scoping",
            duration: "1h",
            type: "video",
            order: 1,
          },
          {
            title: "Data Types in JavaScript",
            content: "Hands-on practice with different data types",
            duration: "2h",
            type: "quiz",
            order: 2,
          },
        ],
      },
    ],
    createdBy: "system",
  },
  {
    subjectId: "",
    title: "React & React Native Development",
    description: "Build modern web and mobile applications with React",
    difficulty: "Intermediate",
    modules: [
      {
        title: "React Basics",
        order: 1,
        lessons: [
          {
            title: "Components and JSX",
            content: "Building your first React components",
            duration: "2h",
            type: "video",
            order: 1,
          },
          {
            title: "Props and State",
            content: "Props vs State in React components",
            duration: "2h",
            type: "text",
            order: 2,
          },
        ],
      },
      {
        title: "React Hooks",
        order: 2,
        lessons: [
          {
            title: "useState and useEffect",
            content: "Practice with useState and useEffect hooks",
            duration: "2h",
            type: "quiz",
            order: 1,
          },
          {
            title: "Custom Hooks",
            content: "Building custom hooks for common functionality",
            duration: "2h",
            type: "video",
            order: 2,
          },
        ],
      },
    ],
    createdBy: "system",
  },
  {
    subjectId: "",
    title: "Data Structures & Algorithms Mastery",
    description: "Master fundamental data structures and algorithmic thinking",
    difficulty: "Advanced",
    modules: [
      {
        title: "Arrays and Strings",
        order: 1,
        lessons: [
          {
            title: "Array Operations",
            content: "Understanding array manipulation and common operations",
            duration: "2h",
            type: "video",
            order: 1,
          },
          {
            title: "String Algorithms",
            content: "Pattern matching and string manipulation techniques",
            duration: "3h",
            type: "quiz",
            order: 2,
          },
        ],
      },
      {
        title: "Trees and Graphs",
        order: 2,
        lessons: [
          {
            title: "Binary Trees",
            content: "Tree traversal algorithms and implementations",
            duration: "3h",
            type: "video",
            order: 1,
          },
          {
            title: "Graph Algorithms",
            content: "BFS, DFS, and shortest path algorithms",
            duration: "4h",
            type: "quiz",
            order: 2,
          },
        ],
      },
    ],
    createdBy: "system",
  },
  {
    subjectId: "",
    title: "System Design Fundamentals",
    description: "Learn to design scalable and reliable systems",
    difficulty: "Expert",
    modules: [
      {
        title: "Architecture Patterns",
        order: 1,
        lessons: [
          {
            title: "Microservices vs Monolith",
            content: "Choosing the right architecture for your system",
            duration: "2h",
            type: "video",
            order: 1,
          },
          {
            title: "Load Balancing",
            content: "Distributing traffic across multiple servers",
            duration: "2h",
            type: "text",
            order: 2,
          },
        ],
      },
      {
        title: "Scalability & Performance",
        order: 2,
        lessons: [
          {
            title: "Caching Strategies",
            content: "Redis, Memcached, and CDN implementation",
            duration: "3h",
            type: "video",
            order: 1,
          },
          {
            title: "Database Sharding",
            content: "Horizontal and vertical partitioning techniques",
            duration: "3h",
            type: "quiz",
            order: 2,
          },
        ],
      },
    ],
    createdBy: "system",
  },
  {
    subjectId: "",
    title: "Node.js & Backend Development",
    description: "Build robust server-side applications with Node.js",
    difficulty: "Intermediate",
    modules: [
      {
        title: "Node.js Fundamentals",
        order: 1,
        lessons: [
          {
            title: "Event Loop and Async Programming",
            content: "Understanding Node.js event-driven architecture",
            duration: "2h",
            type: "video",
            order: 1,
          },
          {
            title: "Express.js Framework",
            content: "Building RESTful APIs with Express",
            duration: "3h",
            type: "text",
            order: 2,
          },
        ],
      },
      {
        title: "Database Integration",
        order: 2,
        lessons: [
          {
            title: "MongoDB with Mongoose",
            content: "Working with NoSQL databases in Node.js",
            duration: "3h",
            type: "video",
            order: 1,
          },
          {
            title: "Authentication & Security",
            content: "JWT, bcrypt, and security best practices",
            duration: "3h",
            type: "quiz",
            order: 2,
          },
        ],
      },
    ],
    createdBy: "system",
  },
  {
    subjectId: "",
    title: "Database & SQL Mastery",
    description: "Master database design, optimization, and SQL queries",
    difficulty: "Intermediate",
    modules: [
      {
        title: "SQL Fundamentals",
        order: 1,
        lessons: [
          {
            title: "Database Design & Normalization",
            content: "Creating efficient database schemas",
            duration: "2h",
            type: "video",
            order: 1,
          },
          {
            title: "Complex Queries & Joins",
            content: "Advanced SQL query techniques",
            duration: "3h",
            type: "quiz",
            order: 2,
          },
        ],
      },
      {
        title: "Performance & Optimization",
        order: 2,
        lessons: [
          {
            title: "Indexing Strategies",
            content: "Optimizing query performance with indexes",
            duration: "2h",
            type: "video",
            order: 1,
          },
          {
            title: "NoSQL vs SQL",
            content: "Choosing the right database for your needs",
            duration: "2h",
            type: "text",
            order: 2,
          },
        ],
      },
    ],
    createdBy: "system",
  },
  {
    subjectId: "",
    title: "Web Security Essentials",
    description: "Protect your applications from common security threats",
    difficulty: "Advanced",
    modules: [
      {
        title: "Authentication & Authorization",
        order: 1,
        lessons: [
          {
            title: "OAuth & JWT Implementation",
            content: "Secure authentication mechanisms",
            duration: "2h",
            type: "video",
            order: 1,
          },
          {
            title: "Session Management",
            content: "Secure session handling and storage",
            duration: "2h",
            type: "text",
            order: 2,
          },
        ],
      },
      {
        title: "Common Vulnerabilities",
        order: 2,
        lessons: [
          {
            title: "OWASP Top 10",
            content: "Understanding and preventing common attacks",
            duration: "3h",
            type: "video",
            order: 1,
          },
          {
            title: "HTTPS & SSL/TLS",
            content: "Encrypting data in transit",
            duration: "2h",
            type: "quiz",
            order: 2,
          },
        ],
      },
    ],
    createdBy: "system",
  },
  {
    subjectId: "",
    title: "Testing & Quality Assurance",
    description: "Ensure code quality through comprehensive testing strategies",
    difficulty: "Intermediate",
    modules: [
      {
        title: "Testing Fundamentals",
        order: 1,
        lessons: [
          {
            title: "Unit Testing with Jest",
            content: "Writing effective unit tests for JavaScript",
            duration: "2h",
            type: "video",
            order: 1,
          },
          {
            title: "Integration Testing",
            content: "Testing component interactions and APIs",
            duration: "3h",
            type: "text",
            order: 2,
          },
        ],
      },
      {
        title: "Quality & Performance",
        order: 2,
        lessons: [
          {
            title: "Code Quality Tools",
            content: "ESLint, Prettier, and SonarQube integration",
            duration: "2h",
            type: "video",
            order: 1,
          },
          {
            title: "Performance Testing",
            content: "Load testing and performance optimization",
            duration: "2h",
            type: "quiz",
            order: 2,
          },
        ],
      },
    ],
    createdBy: "system",
  },
];

const sampleUsersData = [
  {
    uid: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "student",
    preferences: {
      notifications: true,
      theme: "light",
      language: "en",
    },
    stats: {
      totalLessons: 45,
      completedLessons: 32,
      totalQuestions: 120,
      correctAnswers: 89,
    },
  },
  {
    uid: "user2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "student",
    preferences: {
      notifications: false,
      theme: "dark",
      language: "en",
    },
    stats: {
      totalLessons: 38,
      completedLessons: 25,
      totalQuestions: 95,
      correctAnswers: 72,
    },
  },
  {
    uid: "user3",
    name: "Mike Chen",
    email: "mike.chen@example.com",
    role: "student",
    preferences: {
      notifications: true,
      theme: "dark",
      language: "en",
    },
    stats: {
      totalLessons: 52,
      completedLessons: 41,
      totalQuestions: 156,
      correctAnswers: 128,
    },
  },
  {
    uid: "user4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "student",
    preferences: {
      notifications: true,
      theme: "light",
      language: "en",
    },
    stats: {
      totalLessons: 28,
      completedLessons: 18,
      totalQuestions: 78,
      correctAnswers: 56,
    },
  },
  {
    uid: "admin1",
    name: "Admin User",
    email: "admin@mindspark.com",
    role: "admin",
    preferences: {
      notifications: true,
      theme: "light",
      language: "en",
    },
    stats: {
      totalLessons: 0,
      completedLessons: 0,
      totalQuestions: 0,
      correctAnswers: 0,
    },
  },
];

// Sample data for new models
const quizQuestionsData = [
  {
    title: "JavaScript Fundamentals Quiz",
    description: "Test your knowledge of basic JavaScript concepts",
    questions: [
      {
        id: "q1",
        question: "What is the difference between let and var?",
        options: [
          {
            id: "a1",
            text: "let is block-scoped, var is function-scoped",
            isCorrect: true,
          },
          {
            id: "a2",
            text: "var is block-scoped, let is function-scoped",
            isCorrect: false,
          },
          { id: "a3", text: "They are identical", isCorrect: false },
          { id: "a4", text: "let is newer syntax", isCorrect: false },
        ],
        correctAnswer: "a1",
        explanation:
          "let creates block-scoped variables while var creates function-scoped variables.",
        points: 1,
      },
      {
        id: "q2",
        question: "What does 'this' refer to in JavaScript?",
        options: [
          { id: "a1", text: "The current object", isCorrect: false },
          { id: "a2", text: "The global object", isCorrect: false },
          {
            id: "a3",
            text: "Depends on how the function is called",
            isCorrect: true,
          },
          { id: "a4", text: "The parent object", isCorrect: false },
        ],
        correctAnswer: "a3",
        explanation:
          "The value of 'this' depends on how a function is called, not where it's defined.",
        points: 2,
      },
    ],
    totalQuestions: 2,
    timeLimit: 10,
    difficulty: "Easy",
    category: "JavaScript Fundamentals",
    createdBy: "system",
  },
];

const puzzlesData = [
  {
    title: "Binary Tree Traversal Puzzle",
    description: "Arrange the traversal steps in correct order",
    type: "logic",
    difficulty: "Medium",
    category: "Data Structures",
    puzzleData: {
      question:
        "Arrange these binary tree traversal methods in order of complexity:",
      options: ["Inorder", "Preorder", "Postorder", "Level-order"],
      grid: [
        ["1", "2", "3", "4"],
        ["", "", "", ""],
      ],
    },
    solution: "Preorder, Inorder, Postorder, Level-order",
    hints: [
      "Consider the order of visiting nodes",
      "Think about recursive vs iterative approaches",
    ],
    timeLimit: 15,
    points: 10,
    createdBy: "system",
  },
];

const memesData = [
  {
    title: "Debugging Life",
    description: "Classic debugging meme",
    type: "image",
    category: "programming",
    content: {
      text: "99 bugs in the code, 99 bugs in the code. Fix one bug, commit the code. 127 bugs in the code!",
      caption: "The eternal cycle of debugging",
    },
    tags: ["debugging", "programming", "funny"],
    likes: 150,
    shares: 25,
    views: 1200,
    difficulty: "Easy",
    createdBy: "system",
  },
];

const motivationsData = [
  {
    title: "Daily Coding Motivation",
    content:
      "Code is like humor. When you have to explain it, it's bad. - Cory House",
    type: "quote",
    category: "coding",
    author: "Cory House",
    tags: ["coding", "humor", "wisdom"],
    likes: 89,
    shares: 15,
    views: 450,
    bookmarks: 23,
    isFeatured: true,
    createdBy: "system",
  },
];

const codingQuestionsData = [
  {
    title: "Two Sum Problem",
    description: "Find two numbers that add up to a target",
    problem:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    category: "Arrays",
    language: "js",
    tags: ["array", "hash-table", "two-pointer"],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    testCases: [
      {
        input: "[2,7,11,15]",
        expectedOutput: "[0,1]",
        isPublic: true,
      },
    ],
    hints: [
      "Use a hash map to store numbers and their indices",
      "Check if target - current number exists in the map",
    ],
    timeLimit: 30,
    memoryLimit: 64,
    points: 10,
    createdBy: "system",
  },
];

const lessonsData = [
  {
    title: "Introduction to JavaScript",
    description: "Learn the basics of JavaScript programming",
    content: [
      {
        type: "text",
        title: "What is JavaScript?",
        content:
          "JavaScript is a high-level, interpreted programming language that is one of the core technologies of the World Wide Web.",
        order: 1,
      },
      {
        type: "video",
        title: "JavaScript History",
        content: "Learn about the history and evolution of JavaScript",
        metadata: {
          url: "https://example.com/js-history",
          duration: 10,
        },
        order: 2,
      },
    ],
    duration: 30,
    difficulty: "Beginner",
    category: "JavaScript Fundamentals",
    tags: ["javascript", "basics", "programming"],
    objectives: [
      "Understand what JavaScript is",
      "Learn JavaScript history",
      "Set up development environment",
    ],
    prerequisites: ["Basic computer knowledge"],
    resources: [
      {
        title: "MDN JavaScript Guide",
        type: "link",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        description: "Official JavaScript documentation",
      },
    ],
    exercises: [
      {
        title: "First JavaScript Program",
        description: "Write your first Hello World program",
        type: "coding",
        content: "console.log('Hello, World!');",
        points: 5,
      },
    ],
    order: 1,
    createdBy: "system",
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Initialize Firebase and connect to database
    // initializeFirebase(); // Skip Firebase initialization for seeding
    await connectDB();

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Subject.deleteMany({});
    await Syllabus.deleteMany({});
    await InterviewQuestion.deleteMany({});
    await FunContent.deleteMany({});
    await User.deleteMany({});
    await QuizQuestion.deleteMany({});
    await Puzzle.deleteMany({});
    await Meme.deleteMany({});
    await Motivation.deleteMany({});
    await CodingQuestion.deleteMany({});
    await Lesson.deleteMany({});

    // Create subjects
    console.log("📚 Creating subjects...");
    const createdSubjects = await Subject.insertMany(subjectsData);
    console.log(`✅ Created ${createdSubjects.length} subjects`);

    // Create a dynamic subject mapping for easier reference
    const subjectMap = new Map();
    createdSubjects.forEach((subject) => {
      subjectMap.set(subject.title, subject._id.toString());
    });
    console.log("📋 Subject mapping created:", Object.fromEntries(subjectMap));

    // Create interview questions with subject IDs
    console.log("❓ Creating interview questions...");

    const questionsWithSubjectIds = interviewQuestionsData.map((q) => {
      let subjectId = "";

      // Use dynamic mapping for interview questions
      subjectId = subjectMap.get(q.category) || "";

      return { ...q, subjectId };
    });

    const createdQuestions = await InterviewQuestion.insertMany(
      questionsWithSubjectIds
    );
    console.log(`✅ Created ${createdQuestions.length} interview questions`);

    // Create fun content with subject IDs
    console.log("🎮 Creating fun content...");
    const funContentWithSubjectIds = funContentData.map((fc) => {
      let subjectId = "";

      // Assign subjects based on content type and title using dynamic mapping
      if (
        fc.title.includes("JavaScript") ||
        fc.title.includes("CSS") ||
        fc.title.includes("TypeScript")
      ) {
        subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      } else if (fc.title.includes("React")) {
        subjectId = subjectMap.get("React & React Native") || "";
      } else if (
        fc.title.includes("Algorithm") ||
        fc.title.includes("Memory") ||
        fc.title.includes("Binary")
      ) {
        subjectId = subjectMap.get("Data Structures & Algorithms") || "";
      } else if (fc.title.includes("Database") || fc.title.includes("SQL")) {
        subjectId = subjectMap.get("Database & SQL") || "";
      } else if (fc.title.includes("Node.js") || fc.title.includes("API")) {
        subjectId = subjectMap.get("Node.js & Backend") || "";
      } else if (fc.title.includes("Git") || fc.title.includes("Version")) {
        subjectId = subjectMap.get("JavaScript Fundamentals") || ""; // Git is commonly used with JS
      } else if (
        fc.title.includes("Performance") ||
        fc.title.includes("Security")
      ) {
        subjectId = subjectMap.get("Web Security") || "";
      } else {
        // Default to JavaScript subject for general content (memes, motivation, etc.)
        subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      }

      return { ...fc, subjectId };
    });

    const createdFunContent = await FunContent.insertMany(
      funContentWithSubjectIds
    );
    console.log(`✅ Created ${createdFunContent.length} fun content items`);

    // Create syllabus with subject IDs using dynamic mapping
    console.log("📖 Creating syllabus...");
    const syllabusWithSubjectIds = syllabusData.map((s) => {
      let subjectId = "";

      // Use dynamic mapping based on syllabus title keywords
      if (s.title.includes("JavaScript")) {
        subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      } else if (s.title.includes("React")) {
        subjectId = subjectMap.get("React & React Native") || "";
      } else if (s.title.includes("Data Structures")) {
        subjectId = subjectMap.get("Data Structures & Algorithms") || "";
      } else if (s.title.includes("System Design")) {
        subjectId = subjectMap.get("System Design") || "";
      } else if (s.title.includes("Node.js") || s.title.includes("Backend")) {
        subjectId = subjectMap.get("Node.js & Backend") || "";
      } else if (s.title.includes("Database") || s.title.includes("SQL")) {
        subjectId = subjectMap.get("Database & SQL") || "";
      } else if (s.title.includes("Security")) {
        subjectId = subjectMap.get("Web Security") || "";
      } else if (s.title.includes("Testing")) {
        subjectId = subjectMap.get("Testing & Quality") || "";
      }

      console.log(`Mapping syllabus "${s.title}" to subject ID: ${subjectId}`);
      return { ...s, subjectId };
    });

    const createdSyllabus = await Syllabus.insertMany(syllabusWithSubjectIds);
    console.log(`✅ Created ${createdSyllabus.length} syllabus entries`);

    // Create sample users
    console.log("👥 Creating sample users...");
    const createdUsers = await User.insertMany(sampleUsersData);
    console.log(`✅ Created ${createdUsers.length} sample users`);

    // Create quiz questions with subject IDs
    console.log("🧩 Creating quiz questions...");
    const quizQuestionsWithSubjectIds = quizQuestionsData.map((qq) => {
      const subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      return { ...qq, subjectId };
    });
    const createdQuizQuestions = await QuizQuestion.insertMany(
      quizQuestionsWithSubjectIds
    );
    console.log(`✅ Created ${createdQuizQuestions.length} quiz questions`);

    // Create puzzles with subject IDs
    console.log("🧩 Creating puzzles...");
    const puzzlesWithSubjectIds = puzzlesData.map((p) => {
      const subjectId = subjectMap.get("Data Structures & Algorithms") || "";
      return { ...p, subjectId };
    });
    const createdPuzzles = await Puzzle.insertMany(puzzlesWithSubjectIds);
    console.log(`✅ Created ${createdPuzzles.length} puzzles`);

    // Create memes with subject IDs
    console.log("😂 Creating memes...");
    const memesWithSubjectIds = memesData.map((m) => {
      const subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      return { ...m, subjectId };
    });
    const createdMemes = await Meme.insertMany(memesWithSubjectIds);
    console.log(`✅ Created ${createdMemes.length} memes`);

    // Create motivations with subject IDs
    console.log("💪 Creating motivational content...");
    const motivationsWithSubjectIds = motivationsData.map((mot) => {
      const subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      return { ...mot, subjectId };
    });
    const createdMotivations = await Motivation.insertMany(
      motivationsWithSubjectIds
    );
    console.log(`✅ Created ${createdMotivations.length} motivational content`);

    // Create coding questions with subject IDs (temporarily skipped due to language override issue)
    console.log("💻 Creating coding questions...");
    // const codingQuestionsWithSubjectIds = codingQuestionsData.map((cq) => {
    //   const subjectId = subjectMap.get("Data Structures & Algorithms") || "";
    //   return { ...cq, subjectId };
    // });
    // const createdCodingQuestions = await CodingQuestion.insertMany(codingQuestionsWithSubjectIds);
    // console.log(`✅ Created ${createdCodingQuestions.length} coding questions`);
    console.log("⏭️ Skipped coding questions (language override issue)");

    // Create lessons with subject and syllabus IDs
    console.log("📖 Creating lessons...");
    const lessonsWithSubjectIds = lessonsData.map((l) => {
      const subjectId = subjectMap.get("JavaScript Fundamentals") || "";
      const syllabusId =
        createdSyllabus
          .find((s) => s.title.includes("JavaScript"))
          ?._id.toString() || "";
      return { ...l, subjectId, syllabusId };
    });
    const createdLessons = await Lesson.insertMany(lessonsWithSubjectIds);
    console.log(`✅ Created ${createdLessons.length} lessons`);

    // Create dashboard data
    console.log("📊 Creating dashboard data...");

    // Create featured content
    const createdFeaturedContent = await FeaturedContent.insertMany(
      featuredContentData
    );
    console.log(
      `✅ Created ${createdFeaturedContent.length} featured content items`
    );

    // Create featured questions
    const createdFeaturedQuestions = await FeaturedQuestion.insertMany(
      featuredQuestionsData
    );
    console.log(
      `✅ Created ${createdFeaturedQuestions.length} featured questions`
    );

    // Create top rated subjects
    const createdTopRatedSubjects = await TopRatedSubject.insertMany(
      topRatedSubjectsData
    );
    console.log(
      `✅ Created ${createdTopRatedSubjects.length} top rated subjects`
    );

    // Create achievements
    const createdAchievements = await Achievement.insertMany(achievementsData);
    console.log(`✅ Created ${createdAchievements.length} achievements`);

    // Create progress stats (handle duplicates)
    const existingProgressStats = await ProgressStats.find({});
    if (existingProgressStats.length === 0) {
      const createdProgressStats = await ProgressStats.insertMany(
        progressStatsData
      );
      console.log(`✅ Created ${createdProgressStats.length} progress stats`);
    } else {
      console.log(
        `✅ Progress stats already exist (${existingProgressStats.length} records)`
      );
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- ${createdSubjects.length} subjects created`);
    console.log(`- ${createdQuestions.length} interview questions created`);
    console.log(`- ${createdFunContent.length} fun content items created`);
    console.log(
      `  • Quiz Games: ${
        createdFunContent.filter((fc) => fc.type === "quiz").length
      }`
    );
    console.log(
      `  • Puzzles: ${
        createdFunContent.filter((fc) => fc.type === "puzzle").length
      }`
    );
    console.log(
      `  • Memes: ${
        createdFunContent.filter((fc) => fc.type === "meme").length
      }`
    );
    console.log(
      `  • Motivation: ${
        createdFunContent.filter((fc) => fc.type === "motivational").length
      }`
    );
    console.log(`- ${createdSyllabus.length} syllabus entries created`);
    console.log(`- ${createdUsers.length} sample users created`);
    console.log(`- ${createdQuizQuestions.length} quiz questions created`);
    console.log(`- ${createdPuzzles.length} puzzles created`);
    console.log(`- ${createdMemes.length} memes created`);
    console.log(`- ${createdMotivations.length} motivational content created`);
    console.log(
      `- 0 coding questions created (skipped due to language override issue)`
    );
    console.log(`- ${createdLessons.length} lessons created`);
    console.log(
      `- ${createdFeaturedContent.length} featured content items created`
    );
    console.log(
      `- ${createdFeaturedQuestions.length} featured questions created`
    );
    console.log(
      `- ${createdTopRatedSubjects.length} top rated subjects created`
    );
    console.log(`- ${createdAchievements.length} achievements created`);
    console.log(`- Progress stats created/verified`);
    console.log(`- Dashboard data available at /api/v1/dashboard endpoints`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
}

// Run the seeder
seedDatabase().catch((error) => {
  console.error("💥 Seeding failed:", error);
  process.exit(1);
});
