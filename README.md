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

## 🔐 Authentication

Students register with their own name, email address, and password. Passwords are hashed with bcrypt before storage. Public registration assigns the student role; instructor requests require administrator approval. Only the normalized email configured in the backend's `ADMIN_EMAIL` variable can hold administrator access. Login uses an HTTP-only JWT cookie, and registration does not automatically sign users in.

Email verification is optional and disabled by default. To require it, configure the SMTP environment variables described below and set `EMAIL_VERIFICATION_ENABLED=true`. When enabled, verification links expire after 24 hours.

---

## 👥 Role-Based Access Control (RBAC) & Workflow Comparison

### 1. Permission Matrix
| Functional Capability | Student | Instructor | Administrator | Security Rule & Implementation |
| :--- | :---: | :---: | :---: | :--- |
| **Public Registration** | ✅ | ⏳ | ❌ | Instructor requests require approval; admin access is limited to `ADMIN_EMAIL` and secure bootstrap |
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
| **User Role Management** | ❌ | ❌ | ✅ | `PATCH /api/admin/users/:id/role` may manage student/instructor roles; admin creation is bootstrap-only |
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

### 2. Backend Setup

```powershell
# Navigate to the backend directory
cd backend

# Create local environment configuration and set a random JWT secret
Copy-Item .env.example .env
node -e "const fs=require('fs');const crypto=require('crypto');const p='.env';let s=fs.readFileSync(p,'utf8');s=s.replace(/^JWT_SECRET=.*$/m,'JWT_SECRET='+crypto.randomBytes(48).toString('base64url'));fs.writeFileSync(p,s);"

# Install locked dependencies
npm ci

# Start the API
npm run dev
# Backend runs at: http://localhost:5000
```

The seed command never creates accounts. To seed courses, first register an account, then grant it the instructor role using trusted MongoDB administrative access. Set `SEED_INSTRUCTOR_EMAIL` in `backend/.env` to that account's email and run `npm run seed`. **Seeding clears existing courses, lessons, assessments, quizzes, results, enrollments, progress, and notifications; it preserves user accounts.** On databases populated by older seed scripts, review and deactivate legacy sample accounts through trusted MongoDB access; the current seed intentionally preserves account records and their references.

Set `ADMIN_EMAIL` in the ignored `backend/.env` to the one authorized address. The value is normalized (trimmed and case-insensitive) and is never sent to the frontend. The initial administrator registration must use the **Administrator** option, match this email, and complete email verification; administrator access is not granted during public registration. Configure SMTP first, then run the one-time bootstrap from a trusted backend terminal. It only promotes an active, verified account that made an administrator setup request, and refuses to run if any administrator already exists. In PowerShell:

```powershell
$env:ADMIN_EMAIL = Read-Host "Authorized administrator email"
npm run bootstrap-admin --prefix backend
Remove-Item Env:ADMIN_EMAIL
```

The bootstrap command reads `ADMIN_EMAIL` from `backend/.env`; the PowerShell assignment above is only needed if overriding it temporarily. The administrator signs in with the password set during registration; no default admin account or password is stored in source code. Administrator API access checks both the database role and the configured email. Additional admin grants through user-management APIs are rejected.

For email verification, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and `EMAIL_FROM` in the ignored `backend/.env` file, set `CLIENT_URL` to the frontend origin, and set `EMAIL_VERIFICATION_ENABLED=true`. Registration reports an error if verification is enabled without a complete SMTP configuration; no email is claimed to have been sent.

---

### 3. Frontend Setup

```powershell
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install locked dependencies
npm ci

# Start the Vite development server
npm run dev
# Frontend runs at: http://localhost:5173
```

Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

### 4. Running the Automated Integration Checks

With MongoDB and the backend running, execute the integration checks for registration, password hashing, login, role restrictions, logout, and existing course/assessment/quiz APIs:

```powershell
cd backend
node test_portal.js
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a student account
- `POST /api/auth/login` - Authenticate and set an HTTP-only JWT cookie
- `POST /api/auth/logout` - Clear the authentication cookie
- `POST /api/auth/verify-email` - Verify an expiring email token (when enabled)
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
