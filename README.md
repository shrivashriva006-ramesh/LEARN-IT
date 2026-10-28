# Ed Tech Interactive Learning and Assessment Portal

> **Full Stack MERN Educational Platform**  
> **Course Code**: 2311CSC503R - Full Stack Development  
> **Department**: Department of CSE (Cyber Security)  
> **Candidate**: R. Shriva (310624149053)  
> **Guide**: Ms. Divyanjali (Technical Trainer)

---

## 📌 Project Overview
**Ed Tech Interactive Learning and Assessment Portal** is a production-ready, full-stack educational web application engineered with modern MERN architecture (MongoDB, Express.js, React.js, Node.js + TypeScript). The portal delivers interactive video lectures, rich markdown study notes, supplementary PDF handouts, comprehensive 30-question examinations across 6 technical domains (180 questions total), 20-minute timed speed quizzes (120 questions total), real-time progress computation, and role-based access control for **Students**, **Instructors**, and **Administrators**.

---

## 🛠 Technology Stack

### Frontend:
- **React.js 18** with **TypeScript** and **Vite**
- **React Router DOM v6** (Protected client-side routing & role redirection)
- **Axios** (Configured with request/response interceptors & JWT injection)
- **Lucide React** (Clean, modern iconography)
- **Recharts** (Interactive dashboard performance analytics & degree pie visualizers)
- **Vanilla CSS3** Design System (Tailored theme: Primary Purple `#7C3AED`, Accent Pink `#EC4899`, Soft Slate `#F8FAFC`)

### Backend:
- **Node.js** & **Express.js** (RESTful API architecture)
- **JWT (JSON Web Tokens)** (Stateless, secure session authorization)
- **bcryptjs** (Salted password hashing, zero plain-text storage)
- **Mongoose ODM** & **MongoDB** (Validated schemas, indexing, and atomic updates)
- **Centralized Error Handler** & **CORS** middleware

---

## 📚 6 Core Academic Disciplines
The curriculum features six subjects with structured learning units, 30 assessment questions each, and 20 timed quiz questions each:

1. **Java Programming** (JVM architecture, OOP pillars, Collections, Streams, Threading)
2. **Web Development** (HTML5 Semantic layout, CSS Grid/Flexbox, ES6+ Async, React)
3. **Database Management** (RDBMS Normalization 1NF-BCNF, ACID transactions, MongoDB Aggregation)
4. **Cyber Security** (CIA Triad, AES/RSA Cryptography, OWASP Top 10, Network Defense)
5. **Cloud Computing** (IaaS/PaaS/SaaS, AWS Global Infrastructure, Docker & Kubernetes)
6. **Python Programming** (CPython internals, GIL, Generators, Decorators, OOP & File I/O)

- **Total Assessment Questions**: 180 (30 per subject)
- **Total Quiz Questions**: 120 (20 per subject)

---

## 🔑 Default Credentials (Seed Accounts)

| Role | Email Address | Password | Primary Dashboard | Privileges & Key Workflows |
| :--- | :--- | :--- | :--- | :--- |
| **🎓 Student** | `student@edtech.com` | `Student@123` | `/dashboard` | Enrolled in 6 courses, watch video lectures, read notes, attempt 180 assessment questions, take 120 timed speed quizzes, track graduation progress |
| **👨‍🏫 Instructor** | `instructor@edtech.com` | `Instructor@123` | `/instructor/dashboard` | Create & edit courses, upload video/notes lessons, toggle published/draft status, monitor enrolled student rosters, view student assessment scores |
| **🛡️ Administrator** | `admin@edtech.com` | `Admin@123` | `/admin/dashboard` | System health analytics, view all registered accounts, change user roles (Student ⇄ Instructor ⇄ Admin), toggle account activation/deactivation |

*(Quick-autofill cards are integrated directly into the login screen and an instantaneous Demo Role Switcher is available in the top navigation bar).*

---

## 👥 Role-Based Access Control (RBAC) & Workflow Comparison

### 1. Permission Matrix
| Functional Capability | Student | Instructor | Administrator | Security Rule & Implementation |
| :--- | :---: | :---: | :---: | :--- |
| **Public Registration** | ✅ | ✅ | ❌ | Admin accounts cannot be self-registered |
| **Course Catalog Access** | ✅ | ✅ | ✅ | Open to all authenticated users |
| **Video Lectures & Study Notes** | ✅ | ✅ | ✅ | Accessible across all user roles |
| **Mark Lessons Completed** | ✅ | ❌ | ❌ | Recalculates individual student progress in MongoDB |
| **Attempt 30-Q Assessments** | ✅ | ✅ | ✅ | 180 total questions; answers hidden from public API |
| **Attempt 20-Q Speed Quizzes** | ✅ | ✅ | ✅ | 120 total questions; 20-min countdown timer |
| **View Personal Transcripts** | ✅ | ✅ | ✅ | Detailed question-by-question solution review |
| **Create Technical Courses** | ❌ | ✅ | ✅ | Protected by `authorize('instructor', 'admin')` |
| **Publish / Unpublish Courses** | ❌ | ✅ | ✅ | `PATCH /api/courses/:id/publish` |
| **View Enrolled Student Rosters** | ❌ | ✅ | ✅ | `GET /api/instructor/students` |
| **View Student Cohort Scores** | ❌ | ✅ | ✅ | Faculty monitoring of all student attempts |
| **User Role Management** | ❌ | ❌ | ✅ | `PATCH /api/admin/users/:id/role` (Admin exclusive) |
| **Account Activation/Deactivation** | ❌ | ❌ | ✅ | `PATCH /api/admin/users/:id/status` (Admin exclusive) |
| **Platform System Analytics** | ❌ | ❌ | ✅ | `GET /api/admin/stats` (Admin exclusive) |

---

### 2. Operational Workflows
1. **🎓 Student Workflow**:
   - **Login** ➔ Opens `/dashboard` (Student Learning Workspace).
   - **Curriculum Exploration** ➔ Opens `/courses`, views lessons, streams video lectures, and reads notes.
   - **Progress Tracking** ➔ Marks lessons completed to increase graduation percentage.
   - **Examination** ➔ Completes 30-question subject assessments with server-side auto-grading.
   - **Rapid Testing** ➔ Solves 20-question speed quizzes under a 20-minute countdown timer.
   - **Transcript Review** ➔ Inspects `/results` and `/progress` with detailed solution explanations.

2. **👨‍🏫 Instructor Workflow**:
   - **Login** ➔ Automatically lands on `/instructor/dashboard` (Faculty Control Center).
   - **Course Authoring** ➔ Clicks **"Create New Course"**, inputs title, syllabus, and objectives.
   - **Content Management** ➔ Adds video URLs, notes, and PDF handouts; toggles published/draft state.
   - **Evaluation Oversight** ➔ Monitors enrolled learners and audits cohort assessment scores.

3. **🛡️ Administrator Workflow**:
   - **Login** ➔ Automatically lands on `/admin/dashboard` (Portal Administrator Control Center).
   - **System Auditing** ➔ Evaluates registered user metrics, active courses, and pass rates.
   - **Governance & Access Control** ➔ Adjusts user roles (Student ⇄ Instructor ⇄ Admin) and activates/deactivates accounts in real time.

---

## 🚀 How to Run the Application

### 1. Prerequisites
- **Node.js** (v18 or higher recommended, verified with v24)
- **MongoDB** running locally on port `27017` (e.g. `mongodb://127.0.0.1:27017`)

---

### 2. Backend Setup & Seeding

```powershell
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Seed the database with users, courses, 180 assessment questions, and 120 quiz questions
npm run seed

# Run the backend server
node src/server.js
# Backend runs at: http://localhost:5000
```

---

### 3. Frontend Setup

```powershell
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
# Frontend runs at: http://localhost:5173
```

Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

### 4. Running the Automated Integration Test Suite

To verify all 21 system assertions across authentication, assessments, quizzes, results, and progress:

```powershell
cd backend
node test_portal.js
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a student or instructor
- `POST /api/auth/login` - Authenticate and retrieve JWT
- `GET /api/auth/me` - Fetch profile of currently logged-in user
- `PUT /api/auth/profile` - Update user profile and bio

### Courses (`/api/courses`)
- `GET /api/courses` - Browse courses with search & category filters
- `GET /api/courses/:id` - Course details with populated lessons & instructor
- `POST /api/courses` - Create new course *(Instructor/Admin only)*
- `PATCH /api/courses/:id/publish` - Toggle publish status *(Instructor/Admin only)*
- `POST /api/courses/:id/enroll` - Enroll in course *(Student)*

### Lessons & Materials (`/api/lessons`)
- `GET /api/lessons` - Retrieve lessons by course
- `GET /api/lessons/:id` - Retrieve lesson content
- `POST /api/lessons` - Add lesson *(Instructor/Admin only)*

### Assessments (`/api/assessments`)
- `GET /api/assessments` - List all 6 subject assessments
- `GET /api/assessments/:id` - Retrieve 30 questions (Correct answers stripped for security)
- `POST /api/assessments/:id/submit` - Server-side evaluation, score calculation & result generation

### Quizzes (`/api/quizzes`)
- `GET /api/quizzes` - List all 6 speed quizzes with duration timers
- `GET /api/quizzes/:id` - Retrieve 20 questions (Correct answers stripped)
- `POST /api/quizzes/:id/submit` - Evaluate timed attempt & update progress

### Results & Progress (`/api/results` & `/api/progress`)
- `GET /api/results/my-results` - Student's historical assessment & quiz attempts
- `GET /api/results/:id` - Detailed review of an individual test attempt
- `GET /api/progress/my-progress` - Dynamic calculated degree progress & analytics
- `PATCH /api/progress/:lessonId` - Mark lesson as completed and recalculate progress percentage

### Administration & Instructor (`/api/admin` & `/api/instructor`)
- `GET /api/admin/stats` - Total registered students, instructors, courses, attempts, pass rate
- `GET /api/admin/users` - View all registered accounts
- `PATCH /api/admin/users/:id/role` - Update role (student, instructor, admin)
- `PATCH /api/admin/users/:id/status` - Activate or deactivate user accounts
- `GET /api/instructor/stats` - Instructor course stats and submissions
- `GET /api/instructor/students` - Enrolled student roster
