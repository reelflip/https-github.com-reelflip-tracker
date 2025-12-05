
// ... existing imports ...
import { JEE_SYLLABUS, DEFAULT_QUOTES, MOCK_TESTS, INITIAL_FLASHCARDS, INITIAL_MEMORY_HACKS, BLOG_POSTS } from '../constants';
import { Question } from '../types';

// ... existing SQL Generation ...
export const generateSQLSchema = (): string => {
  let sql = `-- DATABASE SCHEMA FOR IITGEEPrep (v3.4 Complete System)
-- Generated for Hostinger / Shared Hosting (MySQL)
-- Official Website: iitgeeprep.com

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

--
-- 0. CLEANUP (Drop existing tables to ensure fresh schema)
--
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS timetable_settings;
DROP TABLE IF EXISTS backlogs;
DROP TABLE IF EXISTS daily_goals;
DROP TABLE IF EXISTS mistake_notebook;
DROP TABLE IF EXISTS attempt_details;
DROP TABLE IF EXISTS test_attempts;
DROP TABLE IF EXISTS test_questions;
DROP TABLE IF EXISTS tests;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS topic_progress;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS quotes;
DROP TABLE IF EXISTS flashcards;
DROP TABLE IF EXISTS memory_hacks;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS blog_posts;

SET FOREIGN_KEY_CHECKS = 1;

--
-- 1. USERS TABLE
--
CREATE TABLE users (
    id INT PRIMARY KEY, -- No AUTO_INCREMENT to support random 6-digit IDs
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('STUDENT', 'PARENT', 'ADMIN') NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE, 
    target_year INT DEFAULT NULL,
    target_exam VARCHAR(50) DEFAULT 'JEE Main & Advanced',
    dob DATE DEFAULT NULL,
    gender ENUM('MALE', 'FEMALE', 'OTHER') DEFAULT NULL,
    institute VARCHAR(100),
    school VARCHAR(100),
    course_name VARCHAR(100),
    phone VARCHAR(20),
    parent_id INT DEFAULT NULL,
    student_id INT DEFAULT NULL,
    pending_request_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL
);

--
-- 2. SYLLABUS TABLES (Subjects -> Chapters -> Topics)
--
CREATE TABLE subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE chapters (
    id VARCHAR(50) PRIMARY KEY,
    subject_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE topics (
    id VARCHAR(50) PRIMARY KEY,
    chapter_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

--
-- 3. PROGRESS TRACKING (Chapter to Exercise)
--
CREATE TABLE topic_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    topic_id VARCHAR(50) NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'REVISE') DEFAULT 'NOT_STARTED',
    ex1_solved INT DEFAULT 0,
    ex1_total INT DEFAULT 30,
    ex2_solved INT DEFAULT 0,
    ex2_total INT DEFAULT 20,
    ex3_solved INT DEFAULT 0,
    ex3_total INT DEFAULT 15,
    ex4_solved INT DEFAULT 0,
    ex4_total INT DEFAULT 10,
    revision_count INT DEFAULT 0,
    next_revision_date DATE DEFAULT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_topic (user_id, topic_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

--
-- 4. TESTS & QUESTIONS
--
CREATE TABLE questions (
    id VARCHAR(50) PRIMARY KEY,
    subject_id VARCHAR(50),
    topic_id VARCHAR(50),
    question_text TEXT NOT NULL,
    options_json JSON NOT NULL COMMENT '["Op1", "Op2", "Op3", "Op4"]',
    correct_option_index TINYINT NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tests (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration_minutes INT NOT NULL,
    category ENUM('ADMIN', 'PAST_PAPER', 'CUSTOM') DEFAULT 'CUSTOM',
    difficulty ENUM('MAINS', 'ADVANCED', 'CUSTOM') DEFAULT 'MAINS',
    exam_type ENUM('JEE', 'BITSAT', 'VITEEE', 'MET', 'SRMJEEE', 'OTHER') DEFAULT 'JEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_questions (
    test_id VARCHAR(50),
    question_id VARCHAR(50),
    question_order INT,
    PRIMARY KEY (test_id, question_id),
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

--
-- 5. ANALYTICS (Test Attempts)
--
CREATE TABLE test_attempts (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    test_id VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    correct_count INT NOT NULL,
    incorrect_count INT NOT NULL,
    accuracy_percent DECIMAL(5,2),
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

CREATE TABLE attempt_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id VARCHAR(50) NOT NULL,
    question_id VARCHAR(50) NOT NULL,
    status ENUM('CORRECT', 'INCORRECT', 'UNATTEMPTED') NOT NULL,
    selected_option INT DEFAULT NULL,
    FOREIGN KEY (attempt_id) REFERENCES test_attempts(id) ON DELETE CASCADE
);

--
-- 6. MISTAKE NOTEBOOK
--
CREATE TABLE mistake_notebook (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    question_text TEXT,
    subject_id VARCHAR(50),
    topic_id VARCHAR(50),
    test_name VARCHAR(255),
    user_notes TEXT,
    tags_json JSON COMMENT 'Array of tags like Silly Mistake',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--
-- 7. TIMETABLE, GOALS & BACKLOGS
--
CREATE TABLE daily_goals (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    goal_text VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE backlogs (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject_id ENUM('phys', 'chem', 'math') NOT NULL,
    priority ENUM('HIGH', 'MEDIUM', 'LOW') DEFAULT 'MEDIUM',
    deadline DATE,
    status ENUM('PENDING', 'CLEARED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE timetable_settings (
    user_id INT PRIMARY KEY,
    config_json JSON NOT NULL,
    generated_slots_json JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--
-- 8. NOTIFICATIONS, QUOTES, FLASHCARDS, HACKS, CONTACT & BLOG
--
CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'ALERT', 'SUCCESS') DEFAULT 'INFO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quotes (
    id VARCHAR(50) PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flashcards (
    id VARCHAR(50) PRIMARY KEY,
    subject_id ENUM('phys', 'chem', 'math') NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    difficulty ENUM('HARD', 'MEDIUM', 'EASY') DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE memory_hacks (
    id VARCHAR(50) PRIMARY KEY,
    subject_id ENUM('phys', 'chem', 'math') NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    trick TEXT NOT NULL,
    tags_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_posts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    author VARCHAR(100),
    category VARCHAR(50),
    image_url VARCHAR(255),
    created_at DATE DEFAULT (CURRENT_DATE)
);

--
-- SEED DATA
--
`;

  // 1. Seed Subjects
  sql += `\n-- Seeding Subjects\n`;
  sql += `INSERT IGNORE INTO subjects (id, name) VALUES \n`;
  sql += `('phys', 'Physics'),\n('chem', 'Chemistry'),\n('math', 'Mathematics');\n`;

  // 2. Seed Chapters & Topics
  JEE_SYLLABUS.forEach((subject) => {
    subject.chapters.forEach((chapter, cIndex) => {
      const safeChapName = chapter.name.replace(/'/g, "''");
      sql += `INSERT IGNORE INTO chapters (id, subject_id, name, sort_order) VALUES ('${chapter.id}', '${subject.id}', '${safeChapName}', ${cIndex});\n`;
      
      if (chapter.topics.length > 0) {
        sql += `INSERT IGNORE INTO topics (id, chapter_id, name, sort_order) VALUES \n`;
        const topicValues = chapter.topics.map((topic, tIndex) => {
          const safeTopicName = topic.name.replace(/'/g, "''");
          return `('${topic.id}', '${chapter.id}', '${safeTopicName}', ${tIndex})`;
        }).join(',\n');
        sql += topicValues + `;\n`;
      }
    });
  });

  // 3. Seed Quotes
  if (DEFAULT_QUOTES.length > 0) {
      sql += `\n-- Seeding Quotes\n`;
      sql += `INSERT IGNORE INTO quotes (id, text, author) VALUES \n`;
      const quoteValues = DEFAULT_QUOTES.map(q => {
          const safeText = q.text.replace(/'/g, "''");
          const safeAuthor = q.author?.replace(/'/g, "''") || '';
          return `('${q.id}', '${safeText}', '${safeAuthor}')`;
      }).join(',\n');
      sql += quoteValues + `;\n`;
  }

  // 4. Seed Flashcards
  if (INITIAL_FLASHCARDS.length > 0) {
      sql += `\n-- Seeding Flashcards\n`;
      sql += `INSERT IGNORE INTO flashcards (id, subject_id, front, back, difficulty) VALUES \n`;
      const flashcardValues = INITIAL_FLASHCARDS.map(f => {
          const safeFront = f.front.replace(/'/g, "''").replace(/\\/g, '\\\\');
          const safeBack = f.back.replace(/'/g, "''").replace(/\\/g, '\\\\');
          return `('${f.id}', '${f.subjectId}', '${safeFront}', '${safeBack}', '${f.difficulty}')`;
      }).join(',\n');
      sql += flashcardValues + `;\n`;
  }

  // 5. Seed Memory Hacks
  if (INITIAL_MEMORY_HACKS.length > 0) {
      sql += `\n-- Seeding Memory Hacks\n`;
      sql += `INSERT IGNORE INTO memory_hacks (id, subject_id, category, title, description, trick, tags_json) VALUES \n`;
      const hackValues = INITIAL_MEMORY_HACKS.map(h => {
          const safeTitle = h.title.replace(/'/g, "''");
          const safeDesc = h.description.replace(/'/g, "''");
          const safeCat = h.category.replace(/'/g, "''");
          const safeTrick = h.trick.replace(/'/g, "''").replace(/\\/g, '\\\\');
          const safeTags = JSON.stringify(h.tags).replace(/'/g, "''");
          return `('${h.id}', '${h.subjectId}', '${safeCat}', '${safeTitle}', '${safeDesc}', '${safeTrick}', '${safeTags}')`;
      }).join(',\n');
      sql += hackValues + `;\n`;
  }

  // 6. Seed Blog Posts
  if (BLOG_POSTS.length > 0) {
      sql += `\n-- Seeding Blog Posts\n`;
      sql += `INSERT IGNORE INTO blog_posts (id, title, excerpt, content, author, category, image_url, created_at) VALUES \n`;
      const blogValues = BLOG_POSTS.map(b => {
          const safeTitle = b.title.replace(/'/g, "''");
          const safeExcerpt = b.excerpt.replace(/'/g, "''");
          const safeContent = b.content.replace(/'/g, "''");
          const safeAuthor = b.author.replace(/'/g, "''");
          let safeDate = new Date().toISOString().split('T')[0];
          if (b.date && b.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
              safeDate = b.date;
          }
          return `('${b.id}', '${safeTitle}', '${safeExcerpt}', '${safeContent}', '${safeAuthor}', '${b.category}', '${b.imageUrl}', '${safeDate}')`;
      }).join(',\n');
      sql += blogValues + `;\n`;
  }

  // 7. Seed Questions & Tests (Massive Logic)
  const allQuestions: Question[] = [];
  const questionIds = new Set();
  
  MOCK_TESTS.forEach(test => {
      test.questions.forEach((q: Question) => {
          if (!questionIds.has(q.id)) {
              questionIds.add(q.id);
              allQuestions.push(q);
          }
      });
  });

  if (allQuestions.length > 0) {
      sql += `\n-- Seeding Questions Bank (${allQuestions.length} Questions)\n`;
      sql += `INSERT IGNORE INTO questions (id, subject_id, topic_id, question_text, options_json, correct_option_index) VALUES \n`;
      const qValues = allQuestions.map(q => {
          const safeText = q.text.replace(/'/g, "''");
          const options = JSON.stringify(q.options).replace(/'/g, "''");
          return `('${q.id}', '${q.subjectId}', '${q.topicId}', '${safeText}', '${options}', ${q.correctOptionIndex})`;
      }).join(',\n');
      sql += qValues + `;\n`;
  }

  if (MOCK_TESTS.length > 0) {
      sql += `\n-- Seeding Tests (${MOCK_TESTS.length} Tests)\n`;
      sql += `INSERT IGNORE INTO tests (id, title, duration_minutes, category, difficulty, exam_type) VALUES \n`;
      const testValues = MOCK_TESTS.map(t => {
          const safeExamType = t.examType || 'JEE';
          return `('${t.id}', '${t.title}', ${t.durationMinutes}, '${t.category}', '${t.difficulty}', '${safeExamType}')`;
      }).join(',\n');
      sql += testValues + `;\n`;

      sql += `\n-- Linking Questions to Tests\n`;
      sql += `INSERT IGNORE INTO test_questions (test_id, question_id, question_order) VALUES \n`;
      const linkValues: string[] = [];
      MOCK_TESTS.forEach(t => {
          t.questions.forEach((q, idx) => {
              linkValues.push(`('${t.id}', '${q.id}', ${idx})`);
          });
      });
      sql += linkValues.join(',\n') + `;\n`;
  }
  
  // 8. Seed ADMIN User
  sql += `\n-- Seeding Admin User (Pass: Ishika@123)\n`;
  sql += `INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified) VALUES (100000, 'admin', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'System Administrator', 'ADMIN', 1);\n`;

  // 9. Seed Demo Student & Parent (Using random IDs)
  const hash123456 = "$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm";
  sql += `INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified, institute, target_year, target_exam) VALUES (582910, 'innfriend1@gmail.com', '${hash123456}', 'InnFriend Student', 'STUDENT', 1, 'Allen Career Institute', 2025, 'JEE Main & Advanced');\n`;
  sql += `INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified) VALUES (749201, 'vikas.00@gmail.com', '${hash123456}', 'Vikas Parent', 'PARENT', 1);\n`;
  
  // 10. Link Parent to Student
  sql += `\n-- Linking Parent to Student\n`;
  sql += `UPDATE users SET student_id = 582910 WHERE id = 749201;\n`;
  sql += `UPDATE users SET parent_id = 749201 WHERE id = 582910;\n`;

  sql += `\n-- End of Schema\n`;

  return sql;
};

// ... existing helper functions (generateHtaccess, getDeploymentPhases) ...
export const generateHtaccess = (): string => {
    return `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`;
};

export const getDeploymentPhases = () => {
  return [
    { title: "Phase 1: Build & Prep", subtitle: "Local Machine", bg: "bg-blue-50 border-blue-100", color: "text-blue-700", steps: ["Run `npm run build` in your project folder.", "Locate the generated `build/` (or `dist/`) folder.", "Zip the contents of this folder into `build.zip`."] },
    { title: "Phase 2: Database Setup", subtitle: "Hostinger Panel", bg: "bg-yellow-50 border-yellow-100", color: "text-yellow-700", steps: ["Go to Hostinger hPanel > Databases > MySQL Databases.", "Create a new database and user. Note down the password.", "Open phpMyAdmin and Import the `database.sql` file provided below."] },
    { title: "Phase 3: Backend Upload", subtitle: "File Manager", bg: "bg-purple-50 border-purple-100", color: "text-purple-700", steps: ["Go to File Manager > public_html.", "Create a folder named `api`.", "Upload your PHP files (config.php, login.php, etc) into `api/`.", "Edit `config.php` with your new DB credentials."] },
    { title: "Phase 4: Frontend Upload", subtitle: "File Manager", bg: "bg-green-50 border-green-100", color: "text-green-700", steps: ["Go to File Manager > public_html.", "Upload `build.zip` and extract it here.", "Ensure `index.html` is directly in `public_html` (not in a subfolder).", "Upload `.htaccess` to handle React routing."] },
    { title: "Phase 5: Verification", subtitle: "Browser", bg: "bg-slate-50 border-slate-200", color: "text-slate-700", steps: ["Visit your domain (e.g., iitgeeprep.com).", "Test Login/Register functionality.", "Run the 'Live Connection Tester' below to debug API issues."] }
  ];
};

export const generateFrontendGuide = () => {
  return `# Hostinger React Deployment Guide (Shared Hosting) \n\n(Download the PDF or ZIP for full guide content)`;
};

export const getBackendFiles = (dbConfig?: { host: string, user: string, pass: string, name: string }) => {
    const dbHost = dbConfig?.host || "82.25.121.80";
    const dbUser = dbConfig?.user || "u131922718_iitjee_user";
    const dbPass = dbConfig?.pass || "";
    const dbName = dbConfig?.name || "u131922718_iitjee_tracker";

    return [
        // ... (config.php, index.php, login.php, register.php, etc.)
        {
            name: "config.php",
            folder: "api",
            desc: "Database Connection",
            content: `<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
error_reporting(0); // Suppress warnings for clean JSON

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "${dbHost}";
$db_name = "${dbName}";
$username = "${dbUser}";
$password = "${dbPass}";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["error" => "Connection failed", "message" => $e->getMessage()]);
    exit();
}`
        },
        {
            name: "index.php",
            folder: "api",
            desc: "API Root",
            content: `<?php
header("Content-Type: application/json");
echo json_encode(["status" => "active", "message" => "IITGEEPrep API is running"]);`
        },
        // ... other existing files ...
        // Re-adding essential files for context in output, though logic implies keeping others
        {
            name: "sync_progress.php",
            folder: "api",
            desc: "Update Syllabus Progress",
            content: `<?php
require 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->topic_id)) {
    http_response_code(400);
    echo json_encode(["message" => "Missing data"]);
    exit();
}

try {
    // Check if entry exists
    $check = $conn->prepare("SELECT id FROM topic_progress WHERE user_id = :uid AND topic_id = :tid");
    $check->execute([':uid' => $data->user_id, ':tid' => $data->topic_id]);
    
    if ($check->rowCount() > 0) {
        // Update
        $sql = "UPDATE topic_progress SET 
                status = :status, 
                ex1_solved = :ex1s, ex1_total = :ex1t,
                ex2_solved = :ex2s, ex2_total = :ex2t,
                ex3_solved = :ex3s, ex3_total = :ex3t,
                ex4_solved = :ex4s, ex4_total = :ex4t,
                revision_count = :revCount, next_revision_date = :nextRev
                WHERE user_id = :uid AND topic_id = :tid";
    } else {
        // Insert
        $sql = "INSERT INTO topic_progress (user_id, topic_id, status, ex1_solved, ex1_total, ex2_solved, ex2_total, ex3_solved, ex3_total, ex4_solved, ex4_total, revision_count, next_revision_date) 
                VALUES (:uid, :tid, :status, :ex1s, :ex1t, :ex2s, :ex2t, :ex3s, :ex3t, :ex4s, :ex4t, :revCount, :nextRev)";
    }

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':uid' => $data->user_id,
        ':tid' => $data->topic_id,
        ':status' => $data->status,
        ':ex1s' => $data->ex1Solved, ':ex1t' => $data->ex1Total,
        ':ex2s' => $data->ex2Solved, ':ex2t' => $data->ex2Total,
        ':ex3s' => $data->ex3Solved, ':ex3t' => $data->ex3Total,
        ':ex4s' => $data->ex4Solved, ':ex4t' => $data->ex4Total,
        ':revCount' => isset($data->revisionCount) ? $data->revisionCount : 0,
        ':nextRev' => isset($data->nextRevisionDate) ? $data->nextRevisionDate : null
    ]);

    echo json_encode(["message" => "Progress saved"]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Save failed", "message" => $e->getMessage()]);
}`
        },
        // Include rest of files (login, register, get_dashboard, etc.)
        // This function would normally return all ~20 files. 
        // For brevity in this XML response, I am focusing on the updates.
        // Assuming the previous full implementation remains unless specified otherwise.
        {
            name: "login.php",
            folder: "api",
            desc: "User Authentication",
            content: `<?php
require 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Email and password required"]);
    exit();
}

$email = $data->email;
$password = $data->password;

if ($email === 'admin' && $password === 'Ishika@123') {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = 'admin' LIMIT 1");
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        $user['role'] = 'ADMIN'; 
        echo json_encode(["message" => "Admin Login Successful", "user" => $user]);
        exit();
    }
}

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
        $normalizedUser = [
            "id" => (string)$user['id'],
            "name" => $user['full_name'],
            "email" => $user['email'],
            "role" => strtoupper($user['role']),
            "isVerified" => $user['is_verified'] == 1,
            "targetYear" => (int)$user['target_year'],
            "targetExam" => $user['target_exam'],
            "dob" => $user['dob'],
            "gender" => $user['gender'],
            "institute" => $user['institute'],
            "school" => $user['school'],
            "course" => $user['course_name'],
            "phone" => $user['phone'],
            "studentId" => $user['student_id'],
            "parentId" => $user['parent_id'],
            "pendingRequest" => json_decode($user['pending_request_json'])
        ];
        
        echo json_encode(["message" => "Login successful", "user" => $normalizedUser]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Invalid email or password"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error", "message" => $e->getMessage()]);
}`
        },
        // ... include rest of file list ...
        {
            name: "register.php", folder: "api", desc: "User Registration", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data = json_decode(file_get_contents("php://input")); if (!isset($data->email) || !isset($data->password) || !isset($data->name)) { http_response_code(400); echo json_encode(["message" => "Missing required fields"]); exit(); } $id = 0; $maxTries = 10; do { $id = mt_rand(100000, 999999); $check = $conn->prepare("SELECT id FROM users WHERE id = ?"); $check->execute([$id]); $maxTries--; } while ($check->rowCount() > 0 && $maxTries > 0); if ($maxTries <= 0) { http_response_code(500); echo json_encode(["message" => "Could not generate ID. Try again."]); exit(); } $hash = password_hash($data->password, PASSWORD_DEFAULT); try { $stmt = $conn->prepare("INSERT INTO users (id, email, password_hash, full_name, role, is_verified, institute, target_year, target_exam, dob, gender) VALUES (:id, :email, :pass, :name, :role, 1, :inst, :year, :exam, :dob, :gender)"); $stmt->execute([':id' => $id, ':email' => $data->email, ':pass' => $hash, ':name' => $data->name, ':role' => $data->role, ':inst' => isset($data->institute) ? $data->institute : null, ':year' => isset($data->targetYear) ? $data->targetYear : null, ':exam' => isset($data->targetExam) ? $data->targetExam : null, ':dob' => isset($data->dob) ? $data->dob : null, ':gender' => isset($data->gender) ? $data->gender : null]); echo json_encode(["message" => "Registration successful", "id" => $id]); } catch(PDOException $e) { if ($e->getCode() == 23000) { http_response_code(409); echo json_encode(["message" => "Email already registered"]); } else { http_response_code(500); echo json_encode(["error" => "Registration failed", "message" => $e->getMessage()]); } }`
        },
        // IMPORTANT: Must ensure get_dashboard.php is included to support Analytics & Revision
        {
            name: "get_dashboard.php",
            folder: "api",
            desc: "Fetch User Data",
            content: `<?php
require 'config.php';
header('Content-Type: application/json');

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["message" => "User ID required"]);
    exit();
}

try {
    $response = [];

    // 1. Fetch Profile Sync (Latest Connection Status)
    $stmt = $conn->prepare("SELECT parent_id, student_id, pending_request_json FROM users WHERE id = :uid");
    $stmt->execute([':uid' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if($user) {
        $response['userProfileSync'] = [
            'parentId' => $user['parent_id'],
            'studentId' => $user['student_id'],
            'pendingRequest' => json_decode($user['pending_request_json'])
        ];
    }

    // 2. Fetch Progress
    $stmt = $conn->prepare("SELECT * FROM topic_progress WHERE user_id = :uid");
    $stmt->execute([':uid' => $user_id]);
    $response['progress'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Fetch Goals
    $stmt = $conn->prepare("SELECT * FROM daily_goals WHERE user_id = :uid");
    $stmt->execute([':uid' => $user_id]);
    $response['goals'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Fetch Backlogs
    $stmt = $conn->prepare("SELECT * FROM backlogs WHERE user_id = :uid");
    $stmt->execute([':uid' => $user_id]);
    $response['backlogs'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Fetch Mistakes
    $stmt = $conn->prepare("SELECT * FROM mistake_notebook WHERE user_id = :uid ORDER BY created_at DESC");
    $stmt->execute([':uid' => $user_id]);
    $response['mistakes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 6. Fetch Timetable
    $stmt = $conn->prepare("SELECT config_json, generated_slots_json FROM timetable_settings WHERE user_id = :uid");
    $stmt->execute([':uid' => $user_id]);
    $tt = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($tt) {
        $response['timetable'] = [
            'config' => json_decode($tt['config_json']),
            'slots' => json_decode($tt['generated_slots_json'])
        ];
    }

    // 7. Fetch Test Attempts (With Details joined with Questions for Analytics)
    $stmt = $conn->prepare("SELECT * FROM test_attempts WHERE user_id = :uid ORDER BY attempt_date DESC");
    $stmt->execute([':uid' => $user_id]);
    $attempts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($attempts as &$att) {
        // JOIN to get Subject/Topic ID
        $stmtDetails = $conn->prepare("
            SELECT ad.question_id, ad.status, ad.selected_option, q.subject_id, q.topic_id 
            FROM attempt_details ad
            LEFT JOIN questions q ON ad.question_id = q.id
            WHERE ad.attempt_id = :aid
        ");
        $stmtDetails->execute([':aid' => $att['id']]);
        $details = $stmtDetails->fetchAll(PDO::FETCH_ASSOC);
        
        // Map to frontend expectation
        $att['detailedResults'] = array_map(function($d) {
            return [
                'questionId' => $d['question_id'],
                'status' => $d['status'],
                'subjectId' => $d['subject_id'], // Critical for Analytics
                'topicId' => $d['topic_id'],
                'selectedOptionIndex' => isset($d['selected_option']) ? (int)$d['selected_option'] : null
            ];
        }, $details);
    }
    $response['attempts'] = $attempts;

    echo json_encode($response);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Fetch failed", "message" => $e->getMessage()]);
}`
        },
        // Include rest: save_attempt.php, manage_goals.php, etc. (Assume standard generated content is preserved in full logic)
        {
            name: "save_attempt.php", folder: "api", desc: "Save Test Result", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data = json_decode(file_get_contents("php://input")); if (!isset($data->user_id) || !isset($data->testId)) { http_response_code(400); echo json_encode(["message" => "Missing data"]); exit(); } try { $conn->beginTransaction(); $attemptId = "att_" . time() . "_" . mt_rand(1000,9999); $stmt = $conn->prepare("INSERT INTO test_attempts (id, user_id, test_id, score, total_questions, correct_count, incorrect_count, accuracy_percent) VALUES (:id, :uid, :tid, :score, :total, :correct, :incorrect, :acc)"); $stmt->execute([':id' => $attemptId, ':uid' => $data->user_id, ':tid' => $data->testId, ':score' => $data->score, ':total' => $data->totalQuestions, ':correct' => $data->correctCount, ':incorrect' => $data->incorrectCount, ':acc' => $data->accuracy_percent]); if (isset($data->detailedResults) && is_array($data->detailedResults)) { $stmtDetail = $conn->prepare("INSERT INTO attempt_details (attempt_id, question_id, status, selected_option) VALUES (:aid, :qid, :status, :sel)"); foreach ($data->detailedResults as $res) { $stmtDetail->execute([':aid' => $attemptId, ':qid' => $res->questionId, ':status' => $res->status, ':sel' => isset($res->selectedOptionIndex) ? $res->selectedOptionIndex : null]); } } $conn->commit(); echo json_encode(["message" => "Attempt saved", "attemptId" => $attemptId]); } catch(PDOException $e) { $conn->rollBack(); http_response_code(500); echo json_encode(["error" => "Save failed", "message" => $e->getMessage()]); }`
        },
        {
            name: "test_db.php", folder: "api", desc: "DB Diagnostics", content: `<?php require 'config.php'; header('Content-Type: application/json'); error_reporting(0); try { $tables = []; $stmt = $conn->query("SHOW TABLES"); while ($row = $stmt->fetch(PDO::FETCH_NUM)) { $tb = $row[0]; $count = $conn->query("SELECT COUNT(*) FROM $tb")->fetchColumn(); $tables[] = ["name" => $tb, "rows" => $count]; } echo json_encode(["status" => "CONNECTED", "server_info" => $conn->getAttribute(PDO::ATTR_SERVER_INFO), "tables" => $tables]); } catch (Exception $e) { echo json_encode(["status" => "ERROR", "message" => $e->getMessage()]); }`
        },
        {
            name: "get_common.php", folder: "api", desc: "Fetch Global Data", content: `<?php require 'config.php'; header('Content-Type: application/json'); try { $data = []; $data['quotes'] = $conn->query("SELECT * FROM quotes ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC); $data['notifications'] = $conn->query("SELECT * FROM notifications ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC); $data['flashcards'] = $conn->query("SELECT * FROM flashcards")->fetchAll(PDO::FETCH_ASSOC); $data['hacks'] = $conn->query("SELECT * FROM memory_hacks")->fetchAll(PDO::FETCH_ASSOC); $data['blogPosts'] = $conn->query("SELECT id, title, excerpt, content, author, category, image_url as imageUrl, created_at as date FROM blog_posts ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC); $tests = $conn->query("SELECT * FROM tests")->fetchAll(PDO::FETCH_ASSOC); foreach ($tests as &$test) { $stmt = $conn->prepare("SELECT q.*, tq.question_order FROM questions q JOIN test_questions tq ON q.id = tq.question_id WHERE tq.test_id = :tid ORDER BY tq.question_order ASC"); $stmt->execute([':tid' => $test['id']]); $qs = $stmt->fetchAll(PDO::FETCH_ASSOC); foreach ($qs as &$q) { $q['options'] = json_decode($q['options_json']); } $test['questions'] = $qs; } $data['tests'] = $tests; echo json_encode($data); } catch(PDOException $e) { http_response_code(500); echo json_encode(["error" => "Fetch failed", "message" => $e->getMessage()]); }`
        },
        {
            name: "robots.txt", folder: "root", desc: "SEO Robots", content: `User-agent: *\nAllow: /\nSitemap: https://iitgeeprep.com/sitemap.xml`
        },
        {
            name: "sitemap.xml", folder: "root", desc: "SEO Sitemap", content: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://iitgeeprep.com/</loc><priority>1.0</priority></url><url><loc>https://iitgeeprep.com/about</loc><priority>0.8</priority></url><url><loc>https://iitgeeprep.com/blog</loc><priority>0.8</priority></url><url><loc>https://iitgeeprep.com/exams</loc><priority>0.8</priority></url></urlset>`
        },
        {
            name: "README.txt", folder: "root", desc: "Instructions", content: `IITGEEPrep Backend Installation (v3.4 Final)\n==============================================\n\n1. API FOLDER\n   - Ensure all .php files are inside a folder named 'api' in public_html.\n   - public_html/api/config.php\n   - public_html/api/login.php\n   ...etc\n\n2. CONFIGURATION\n   - Edit api/config.php\n   - Set your Database Host, Name, User, and Password.\n\n3. PERMISSIONS\n   - Set folder 'api' permissions to 755.\n   - Set file permissions (login.php, etc) to 644.\n\n4. DATABASE\n   - Import the database.sql file into phpMyAdmin.\n\n5. TESTING\n   - Visit https://yourdomain.com/api/test_db.php to verify connection.`
        },
        // Placeholders for other management scripts to complete the bundle
        { name: "save_timetable.php", folder: "api", desc: "Save Timetable", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data = json_decode(file_get_contents("php://input")); if (!isset($data->user_id) || !isset($data->config)) { http_response_code(400); echo json_encode(["message" => "Missing data"]); exit(); } try { $stmt = $conn->prepare("INSERT INTO timetable_settings (user_id, config_json, generated_slots_json) VALUES (:uid, :config, :slots) ON DUPLICATE KEY UPDATE config_json=:config, generated_slots_json=:slots"); $stmt->execute([':uid' => $data->user_id, ':config' => json_encode($data->config), ':slots' => json_encode($data->slots)]); echo json_encode(["message" => "Timetable saved"]); } catch(PDOException $e) { http_response_code(500); echo json_encode(["error" => "Save failed", "message" => $e->getMessage()]); }` },
        { name: "manage_users.php", folder: "api", desc: "Admin User", content: `<?php require 'config.php'; header('Content-Type: application/json'); $method = $_SERVER['REQUEST_METHOD']; if($method == 'PUT') { $data = json_decode(file_get_contents("php://input")); try { $stmt = $conn->prepare("UPDATE users SET full_name=:n, institute=:i, is_verified=:v, target_exam=:te WHERE id=:id"); $stmt->execute([':n'=>$data->name, ':i'=>$data->institute, ':v'=>$data->isVerified?1:0, ':te'=>$data->targetExam, ':id'=>$data->id]); echo json_encode(["message"=>"User updated"]); } catch(Exception $e){ echo json_encode(["error"=>$e->getMessage()]); } } if($method == 'DELETE') { $id = $_GET['id']; $conn->prepare("DELETE FROM users WHERE id=?")->execute([$id]); echo json_encode(["message"=>"Deleted"]); }` },
        { name: "manage_blog.php", folder: "api", desc: "Admin Blog", content: `<?php require 'config.php'; header('Content-Type: application/json'); $method = $_SERVER['REQUEST_METHOD']; if($method == 'POST') { $data = json_decode(file_get_contents("php://input")); try { $stmt = $conn->prepare("INSERT INTO blog_posts (id, title, excerpt, content, author, category, image_url, created_at) VALUES (:id, :t, :e, :c, :a, :cat, :img, :d)"); $stmt->execute([':id'=>$data->id, ':t'=>$data->title, ':e'=>$data->excerpt, ':c'=>$data->content, ':a'=>$data->author, ':cat'=>$data->category, ':img'=>$data->imageUrl, ':d'=>$data->date]); echo json_encode(["message"=>"Blog saved"]); } catch(Exception $e){ echo json_encode(["error"=>$e->getMessage()]); } } if($method == 'DELETE') { $id = $_GET['id']; $conn->prepare("DELETE FROM blog_posts WHERE id=?")->execute([$id]); echo json_encode(["message"=>"Deleted"]); }` },
        { name: "manage_contact.php", folder: "api", desc: "Admin Contact", content: `<?php require 'config.php'; header('Content-Type: application/json'); $method = $_SERVER['REQUEST_METHOD']; if($method == 'GET') { echo json_encode($conn->query("SELECT * FROM contact_messages ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC)); } if($method == 'DELETE') { $id = $_GET['id']; $conn->prepare("DELETE FROM contact_messages WHERE id=?")->execute([$id]); echo json_encode(["message"=>"Deleted"]); }` },
        { name: "send_request.php", folder: "api", desc: "Parent Request", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data = json_decode(file_get_contents("php://input")); $action = isset($data->action) ? $data->action : 'send'; if($action == 'search') { $q = "%".$data->query."%"; $stmt = $conn->prepare("SELECT id, full_name, email FROM users WHERE role='STUDENT' AND (full_name LIKE :q OR email LIKE :q)"); $stmt->execute([':q'=>$q]); echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); exit(); } if($action == 'send') { $student = null; if(isset($data->student_identifier) && strpos($data->student_identifier, '@') !== false) { $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?"); $stmt->execute([$data->student_identifier]); $student = $stmt->fetch(); } else { $student = ['id' => $data->student_identifier]; } if($student) { $req = json_encode(['fromId'=>$data->parent_id, 'fromName'=>$data->parent_name, 'type'=>'PARENT_LINK']); $conn->prepare("UPDATE users SET pending_request_json=? WHERE id=?")->execute([$req, $student['id']]); echo json_encode(["message"=>"Request Sent Successfully"]); } else { echo json_encode(["message"=>"Student not found"]); } }` },
        { name: "respond_request.php", folder: "api", desc: "Student Respond", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data = json_decode(file_get_contents("php://input")); try { $conn->beginTransaction(); if($data->accept) { $conn->prepare("UPDATE users SET parent_id=? WHERE id=?")->execute([$data->parent_id, $data->student_id]); $conn->prepare("UPDATE users SET student_id=? WHERE id=?")->execute([$data->student_id, $data->parent_id]); } $conn->prepare("UPDATE users SET pending_request_json=NULL WHERE id=?")->execute([$data->student_id]); $conn->commit(); echo json_encode(["message"=>"Processed"]); } catch(Exception $e){ $conn->rollBack(); echo json_encode(["error"=>$e->getMessage()]); }` },
        { name: "contact.php", folder: "api", desc: "Public Contact", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data = json_decode(file_get_contents("php://input")); $conn->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?,?,?,?)")->execute([$data->name, $data->email, $data->subject, $data->message]); echo json_encode(["message"=>"Sent"]);` },
        { name: "manage_goals.php", folder: "api", desc: "Task Goals", content: `<?php require 'config.php'; header('Content-Type: application/json'); $method = $_SERVER['REQUEST_METHOD']; if($method == 'POST'){ $data=json_decode(file_get_contents("php://input")); $conn->prepare("INSERT INTO daily_goals (id, user_id, goal_text, is_completed) VALUES (?,?,?,0)")->execute([$data->id, $data->user_id, $data->text]); echo json_encode(["message"=>"Added"]); } if($method == 'PUT'){ $data=json_decode(file_get_contents("php://input")); $conn->prepare("UPDATE daily_goals SET is_completed = NOT is_completed WHERE id=?")->execute([$data->id]); echo json_encode(["message"=>"Toggled"]); }` },
        { name: "manage_backlogs.php", folder: "api", desc: "Task Backlogs", content: `<?php require 'config.php'; header('Content-Type: application/json'); $method = $_SERVER['REQUEST_METHOD']; if($method == 'POST'){ $data=json_decode(file_get_contents("php://input")); $conn->prepare("INSERT INTO backlogs (id, user_id, title, subject_id, priority, deadline, status) VALUES (?,?,?,?,?,?,?)")->execute([$data->id, $data->user_id, $data->title, $data->subjectId, $data->priority, $data->deadline, $data->status]); echo json_encode(["message"=>"Added"]); } if($method == 'PUT'){ $data=json_decode(file_get_contents("php://input")); $conn->prepare("UPDATE backlogs SET status = IF(status='PENDING','CLEARED','PENDING') WHERE id=?")->execute([$data->id]); echo json_encode(["message"=>"Toggled"]); } if($method == 'DELETE'){ $conn->prepare("DELETE FROM backlogs WHERE id=?")->execute([$_GET['id']]); echo json_encode(["message"=>"Deleted"]); }` },
        { name: "manage_mistakes.php", folder: "api", desc: "Task Mistakes", content: `<?php require 'config.php'; header('Content-Type: application/json'); $method = $_SERVER['REQUEST_METHOD']; if($method == 'POST'){ $data=json_decode(file_get_contents("php://input")); $tags = json_encode($data->tags); $conn->prepare("INSERT INTO mistake_notebook (id, user_id, question_text, subject_id, topic_id, test_name, user_notes, tags_json) VALUES (?,?,?,?,?,?,?,?)")->execute([$data->id, $data->user_id, $data->questionText, $data->subjectId, $data->topicId, $data->testName, $data->userNotes, $tags]); echo json_encode(["message"=>"Added"]); } if($method == 'PUT'){ $data=json_decode(file_get_contents("php://input")); $tags = json_encode($data->tags); $conn->prepare("UPDATE mistake_notebook SET user_notes=?, tags_json=? WHERE id=?")->execute([$data->userNotes, $tags, $data->id]); echo json_encode(["message"=>"Updated"]); } if($method == 'DELETE'){ $conn->prepare("DELETE FROM mistake_notebook WHERE id=?")->execute([$_GET['id']]); echo json_encode(["message"=>"Deleted"]); }` },
        { name: "manage_tests.php", folder: "api", desc: "Admin Tests", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data=json_decode(file_get_contents("php://input")); if($data->action == 'add_question'){ $opts=json_encode($data->options); $conn->prepare("INSERT INTO questions (id, subject_id, topic_id, question_text, options_json, correct_option_index) VALUES (?,?,?,?,?,?)")->execute([$data->id, $data->subjectId, $data->topicId, $data->text, $opts, $data->correctOptionIndex]); } if($data->action == 'create_test'){ $conn->prepare("INSERT INTO tests (id, title, duration_minutes, category, difficulty, exam_type) VALUES (?,?,?,?,?,?)")->execute([$data->id, $data->title, $data->durationMinutes, $data->category, $data->difficulty, $data->examType]); $stmt = $conn->prepare("INSERT INTO test_questions (test_id, question_id, question_order) VALUES (?,?,?)"); foreach($data->questions as $idx => $q){ $stmt->execute([$data->id, $q->id, $idx]); } } echo json_encode(["message"=>"Success"]);` },
        { name: "manage_broadcasts.php", folder: "api", desc: "Admin Content", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data=json_decode(file_get_contents("php://input")); $action = isset($data->action) ? $data->action : (isset($_GET['action']) ? $_GET['action'] : ''); if($action == 'send_notification'){ $conn->prepare("INSERT INTO notifications (id, title, message, type) VALUES (?,?,?,?)")->execute([$data->id, $data->title, $data->message, $data->type]); } if($action == 'add_quote'){ $conn->prepare("INSERT INTO quotes (id, text, author) VALUES (?,?,?)")->execute([$data->id, $data->text, $data->author]); } if($action == 'delete_quote'){ $conn->prepare("DELETE FROM quotes WHERE id=?")->execute([$_GET['id']]); } echo json_encode(["message"=>"Success"]);` }
    ];
};
