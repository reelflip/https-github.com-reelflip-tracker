# IITGEEPrep - Project Architecture & Documentation

**Version:** v3.9
**Tech Stack:** React 19, TypeScript, Tailwind CSS, PHP, MySQL

---

## 1. System Architecture

The application follows a **Decoupled Client-Server Architecture**.

### A. Frontend (Client)
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Mobile-First Utility Classes)
*   **Routing:** Custom State-Based Routing (in `App.tsx`)
*   **State Management:** React `useState` / `useEffect` (Lifted to `App.tsx` for global data)
*   **Build Tool:** Vite (Generates static `index.html` and `assets/js`)

### B. Backend (API Layer)
*   **Server:** Apache/Nginx (Hostinger Shared Hosting)
*   **Language:** PHP (Vanilla, no framework)
*   **Interface:** RESTful JSON API
*   **Location:** `/api/` folder in `public_html`

### C. Database (Storage)
*   **System:** MySQL / MariaDB
*   **Schema:** Relational (Users linked to Progress, Tests, etc.)
*   **Connection:** PDO (PHP Data Objects) with Exception Handling

---

## 2. Data Flow

### 1. Authentication Flow
1.  **User Input:** User enters Email/Password in `AuthScreen.tsx`.
2.  **API Call:** `fetch('/api/login.php')` sends JSON payload.
3.  **Backend:** PHP verifies hash, generates User Object (sanitized).
4.  **Frontend:** `App.tsx` receives User Object, sets `currentUser` state.
5.  **Hydration:** `useEffect` triggers `fetchDashboardData()` to load all user-specific data (Progress, Tests, Goals).

### 2. Syllabus Tracking Flow
1.  **Action:** User changes a topic status to "COMPLETED" in `SyllabusTracker.tsx`.
2.  **Optimistic UI:** React updates the progress bar *immediately* (feels instant).
3.  **Background Sync:** `handleUpdateProgress` sends a POST request to `/api/sync_progress.php`.
4.  **Database:** MySQL `INSERT` or `UPDATE` the `topic_progress` table.

### 3. Exam & Analytics Flow
1.  **Submission:** User clicks "Submit" in `TestCenter.tsx`.
2.  **Calculation:** Frontend calculates Score, Accuracy, and Detailed Question Analysis.
3.  **Persistence:** `handleCompleteTest` sends full result to `/api/save_attempt.php`.
4.  **Storage:**
    *   `test_attempts` stores summary (Score: 120).
    *   `attempt_details` stores granular data (Q1: Correct, Q2: Incorrect [Option B]).
5.  **Analytics:** `Analytics.tsx` fetches this data, joins it with `JEE_SYLLABUS`, and renders "Weak Areas" charts.

---

## 3. Core Feature Logic

### A. Smart Revision (Spaced Repetition)
*   **File:** `components/RevisionManager.tsx`
*   **Algorithm:** 1-7-30 Rule.
    *   Level 0 -> Level 1 (Interval: 1 Day)
    *   Level 1 -> Level 2 (Interval: 7 Days)
    *   Level 2 -> Level 3 (Interval: 30 Days)
*   **Trigger:** Happens when user clicks the "Check" button on a revision card.

### B. Smart Timetable Generator
*   **File:** `components/TimetableGenerator.tsx`
*   **Input:** Wake Time, Sleep Time, School Hours, Coaching Hours.
*   **Algorithm:** "Gap Filling".
    1.  Place fixed blocks (School/Coaching).
    2.  Identify gaps.
    3.  If gap > 20 mins after coaching -> Schedule "Class Revision".
    4.  If gap > 60 mins -> Schedule Deep Work (Physics/Maths based on time of day).
    5.  Prioritize "Stale Topics" (topics not updated in > 7 days).

### C. Flashcards
*   **File:** `components/FlashcardDeck.tsx`
*   **Data:** `INITIAL_FLASHCARDS` in `constants.ts`.
*   **Features:** 3D CSS Flip, Web Audio API Sound Effects, Mastery Tracking.

### D. System Tests (Diagnostic Engine)
*   **File:** `components/TestRunner.tsx`
*   **Function:** Runs end-to-end integration tests on the live server.
*   **Method:** Creates temporary users via API, performs actions (e.g., "Create Goal"), reads back data, verifies integrity, then cleans up.

---

## 4. Database Schema Reference

| Table Name | Purpose | Key Columns |
| :--- | :--- | :--- |
| `users` | Auth & Profile | `id`, `email`, `password_hash`, `target_exam`, `parent_id` |
| `topic_progress` | Syllabus Tracking | `user_id`, `topic_id`, `status`, `last_updated`, `next_revision_date` |
| `test_attempts` | Exam History | `id`, `user_id`, `test_id`, `score`, `accuracy_percent` |
| `attempt_details` | Question Analysis | `attempt_id`, `question_id`, `status`, `selected_option` |
| `mistake_notebook` | Error Logs | `question_text`, `user_notes`, `tags_json` |
| `timetable_settings` | Saved Schedule | `config_json`, `generated_slots_json` |
| `blog_posts` | CMS Content | `title`, `content`, `category`, `image_url` |
| `contact_messages` | Inquiries | `name`, `email`, `subject`, `message` |

---

## 5. Directory Structure (Deployment)

```
public_html/
├── .htaccess           # Routing rules (Fixes 404s)
├── index.html          # Entry point (SEO Meta tags)
├── sitemap.xml         # SEO
├── robots.txt          # SEO
├── assets/             # Compiled JS/CSS from Vite
└── api/                # Backend Folder
    ├── config.php      # Database Credentials
    ├── index.php       # API Root
    ├── login.php       # Auth
    ├── register.php    # Auth
    ├── get_dashboard.php # Main Data Fetch
    ├── sync_progress.php # Syllabus Save
    ├── save_attempt.php  # Exam Save
    └── ... (24 PHP Files total)
```

## 6. How to Deploy (Quick Steps)
1.  **Build:** Run `npm run build` locally.
2.  **Generate Backend:** Go to Admin Panel -> System Docs -> Download All (.zip).
3.  **Upload:**
    *   Upload `dist` contents to Hostinger `public_html`.
    *   Create `api` folder and upload PHP files there.
4.  **Database:** Create MySQL DB and import `database.sql`.
5.  **Config:** Edit `api/config.php` with DB credentials.
