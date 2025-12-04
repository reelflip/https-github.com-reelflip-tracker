


import { JEE_SYLLABUS, DEFAULT_QUOTES, MOCK_TESTS, INITIAL_FLASHCARDS, INITIAL_MEMORY_HACKS } from '../constants';
import { Question } from '../types';

export const generateSQLSchema = (): string => {
  let sql = `-- DATABASE SCHEMA FOR IIT JEE PREP
-- Generated for Hostinger / Shared Hosting (MySQL)

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

SET FOREIGN_KEY_CHECKS = 1;

--
-- 1. USERS TABLE
--
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('STUDENT', 'PARENT', 'ADMIN') NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE, 
    target_year INT DEFAULT NULL,
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
-- 8. NOTIFICATIONS, QUOTES, FLASHCARDS & HACKS
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

  // 6. Seed Questions & Tests
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
      sql += `\n-- Seeding Questions Bank\n`;
      sql += `INSERT IGNORE INTO questions (id, subject_id, topic_id, question_text, options_json, correct_option_index) VALUES \n`;
      const qValues = allQuestions.map(q => {
          const safeText = q.text.replace(/'/g, "''");
          const options = JSON.stringify(q.options).replace(/'/g, "''");
          return `('${q.id}', '${q.subjectId}', '${q.topicId}', '${safeText}', '${options}', ${q.correctOptionIndex})`;
      }).join(',\n');
      sql += qValues + `;\n`;
  }

  if (MOCK_TESTS.length > 0) {
      sql += `\n-- Seeding Tests\n`;
      sql += `INSERT IGNORE INTO tests (id, title, duration_minutes, category, difficulty) VALUES \n`;
      const testValues = MOCK_TESTS.map(t => {
          return `('${t.id}', '${t.title}', ${t.durationMinutes}, '${t.category}', '${t.difficulty}')`;
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
  
  // 7. Seed ADMIN User
  sql += `\n-- Seeding Admin User (Pass: Ishika@123)\n`;
  sql += `INSERT IGNORE INTO users (email, password_hash, full_name, role, is_verified) VALUES ('admin', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'System Administrator', 'ADMIN', 1);\n`;

  // 8. Seed Demo Student & Parent
  sql += `\n-- Seeding Demo Student (innfriend1@gmail.com / 123456) and Parent (vikas.00@gmail.com / 123456)\n`;
  // Real hash for 123456: $2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm
  const hash123456 = "$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm";
  
  sql += `INSERT IGNORE INTO users (email, password_hash, full_name, role, is_verified, institute, target_year) VALUES ('innfriend1@gmail.com', '${hash123456}', 'InnFriend Student', 'STUDENT', 1, 'Allen Career Institute', 2025);\n`;
  sql += `INSERT IGNORE INTO users (email, password_hash, full_name, role, is_verified) VALUES ('vikas.00@gmail.com', '${hash123456}', 'Vikas Parent', 'PARENT', 1);\n`;
  
  // 9. Link Parent to Student
  sql += `\n-- Linking Parent to Student\n`;
  sql += `SET @student_id = (SELECT id FROM users WHERE email = 'innfriend1@gmail.com');\n`;
  sql += `SET @parent_id = (SELECT id FROM users WHERE email = 'vikas.00@gmail.com');\n`;
  sql += `UPDATE users SET student_id = @student_id WHERE id = @parent_id;\n`;
  sql += `UPDATE users SET parent_id = @parent_id WHERE id = @student_id;\n`;

  sql += `\n-- End of Schema\n`;

  return sql;
};

// Generates the .htaccess file for React Router support
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

// Export individual file objects
export const getBackendFiles = (dbConfig?: { host: string, user: string, pass: string, name: string }) => {
    
    // Use provided credentials or fallback to defaults
    const dbHost = dbConfig?.host || "82.25.121.80";
    const dbUser = dbConfig?.user || "u131922718_iitjee_user";
    const dbPass = dbConfig?.pass || "YourStrongPassword";
    const dbName = dbConfig?.name || "u131922718_iitjee_tracker";

    return [
        {
            name: "config.php",
            folder: "api",
            desc: "Database connection & settings. AUTO-GENERATED from your input.",
            content: `<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Cache-Control: no-cache, no-store, must-revalidate");

// Handle CORS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB CONFIGURATION FROM ADMIN PANEL INPUTS
$host = "${dbHost}"; 
$db_name = "${dbName}";
$username = "${dbUser}";
$password = "${dbPass}";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->exec("set names utf8mb4");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    http_response_code(500);
    // Use 'message' key instead of 'error' for consistency with frontend expectations
    echo json_encode(["message" => "Connection error: " . $exception->getMessage()]);
    exit();
}
?>`
        },
        {
            name: "index.php",
            folder: "api",
            desc: "Default file to prevent 403 Forbidden errors when accessing the /api folder.",
            content: `<?php
include_once 'config.php';
echo json_encode([
    "status" => "active", 
    "message" => "IIT JEE Prep API is running", 
    "timestamp" => date('c'),
    "info" => "Use endpoints like /login.php, /test_db.php etc."
]);
?>`
        },
        {
            name: ".htaccess",
            folder: "api",
            desc: "Allow access to API folder files (Fix for 403 Errors)",
            content: `<IfModule mod_rewrite.c>
    RewriteEngine On
</IfModule>
# Allow access to files in this directory
Order Allow,Deny
Allow from all`
        },
        {
            name: "test_db.php",
            folder: "api",
            desc: "Diagnostic tool to check database connection and table counts.",
            content: `<?php
error_reporting(0); // Suppress warnings for clean JSON
include_once 'config.php';

$response = [];

try {
    // 1. Check Connection
    $response['status'] = 'CONNECTED';
    $response['db_name'] = $db_name;
    $response['server_info'] = $conn->getAttribute(PDO::ATTR_SERVER_INFO);

    // 2. Get Table Stats
    $tables = [];
    $stmt = $conn->query("SHOW TABLES");
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $table = $row[0];
        $count = $conn->query("SELECT COUNT(*) FROM $table")->fetchColumn();
        $tables[] = ["name" => $table, "rows" => $count];
    }
    $response['tables'] = $tables;

} catch(Exception $e) {
    $response['status'] = 'ERROR';
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>`
        },
        {
            name: "login.php",
            folder: "api",
            desc: "Handles user authentication.",
            content: `<?php
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = $data->password;
    
    try {
        $query = "SELECT * FROM users WHERE email = :email LIMIT 0,1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Normalize user data to camelCase for Frontend
            $userObj = [
                "id" => $row['id'],
                "name" => $row['full_name'], // DB: full_name -> App: name
                "email" => $row['email'],
                "role" => strtoupper($row['role']),
                "isVerified" => ($row['is_verified'] == 1),
                "targetYear" => (int)$row['target_year'],
                "institute" => $row['institute'],
                "school" => $row['school'],
                "course" => $row['course_name'],
                "phone" => $row['phone'],
                "studentId" => $row['student_id'],
                "parentId" => $row['parent_id']
            ];

            // Admin Override check (For recovery, can be removed in prod)
            if ($email === 'admin' && $password === 'Ishika@123') {
                 echo json_encode(["message" => "Login successful", "user" => $userObj]);
                 exit();
            }

            if(password_verify($password, $row['password_hash'])) {
                echo json_encode(["message" => "Login successful", "user" => $userObj]);
            } else {
                 http_response_code(401);
                 echo json_encode(["message" => "Invalid password."]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["message" => "User not found."]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}
?>`
        },
        {
            name: "register.php",
            folder: "api",
            desc: "Handles user registration (Auto-Verified, No Token).",
            content: `<?php
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = password_hash($data->password, PASSWORD_BCRYPT);
    $name = $data->name;
    $role = $data->role;

    try {
        // Check if email exists
        $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$email]);
        if($check->rowCount() > 0) {
            http_response_code(409);
            echo json_encode(["message" => "Email already exists. Please login."]);
            exit();
        }

        // is_verified set to 1 by default, no token needed
        $query = "INSERT INTO users (email, password_hash, full_name, role, is_verified, institute, target_year) VALUES (:email, :pass, :name, :role, 1, :inst, :year)";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":pass", $password);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":inst", $data->institute);
        $stmt->bindParam(":year", $data->targetYear);

        if($stmt->execute()) {
            $newUserId = $conn->lastInsertId();
            
            // Return success with Normalized Data
            echo json_encode([
                "message" => "Registration successful", 
                "user" => [
                    "id" => $newUserId,
                    "name" => $name,
                    "email" => $email,
                    "role" => $role,
                    "isVerified" => true,
                    "institute" => $data->institute,
                    "targetYear" => $data->targetYear
                ]
            ]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Error registering user."]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}
?>`
        },
        {
            name: "verify.php",
            folder: "api",
            desc: "Legacy endpoint (No longer needed but kept for safety).",
            content: `<?php
echo "<h1>Account Verified! ✅</h1><p>Email verification is no longer required.</p>";
?>`
        },
        {
            name: "get_dashboard.php",
            folder: "api",
            desc: "Fetches all user data (progress, goals, mistakes, timetable).",
            content: `<?php
include_once 'config.php';
$user_id = $_GET['user_id'];

if (!$user_id) {
    echo json_encode(["error" => "No User ID provided"]);
    exit();
}

try {
    // Get Progress
    $progQuery = $conn->prepare("SELECT * FROM topic_progress WHERE user_id = ?");
    $progQuery->execute([$user_id]);
    $progress = $progQuery->fetchAll(PDO::FETCH_ASSOC);

    // Get Goals
    $goalsQuery = $conn->prepare("SELECT * FROM daily_goals WHERE user_id = ? AND created_at = CURDATE()");
    $goalsQuery->execute([$user_id]);
    $goals = $goalsQuery->fetchAll(PDO::FETCH_ASSOC);

    // Get Backlogs
    $blogQuery = $conn->prepare("SELECT * FROM backlogs WHERE user_id = ?");
    $blogQuery->execute([$user_id]);
    $backlogs = $blogQuery->fetchAll(PDO::FETCH_ASSOC);

    // Get Mistakes
    $mistakeQuery = $conn->prepare("SELECT * FROM mistake_notebook WHERE user_id = ?");
    $mistakeQuery->execute([$user_id]);
    $mistakes = $mistakeQuery->fetchAll(PDO::FETCH_ASSOC);

    // Get Timetable
    $ttQuery = $conn->prepare("SELECT generated_slots_json FROM timetable_settings WHERE user_id = ?");
    $ttQuery->execute([$user_id]);
    $timetable = $ttQuery->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "progress" => $progress,
        "goals" => $goals,
        "backlogs" => $backlogs,
        "mistakes" => $mistakes,
        "timetable" => $timetable ? json_decode($timetable['generated_slots_json']) : null
    ]);
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>`
        },
        {
            name: "get_common.php",
            folder: "api",
            desc: "Fetches shared data (quotes, tests, flashcards, notifications).",
            content: `<?php
include_once 'config.php';

// Quotes
$quotes = $conn->query("SELECT * FROM quotes ORDER BY RAND() LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);

// Flashcards
$flashcards = $conn->query("SELECT * FROM flashcards")->fetchAll(PDO::FETCH_ASSOC);

// Memory Hacks
$hacks = $conn->query("SELECT * FROM memory_hacks")->fetchAll(PDO::FETCH_ASSOC);

// Notifications
$notifs = $conn->query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);

// Tests
$tests = $conn->query("SELECT * FROM tests")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "quotes" => $quotes,
    "flashcards" => $flashcards,
    "hacks" => $hacks,
    "notifications" => $notifs,
    "tests" => $tests
]);
?>`
        },
        {
            name: "sync_progress.php",
            folder: "api",
            desc: "Saves syllabus progress updates.",
            content: `<?php
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->user_id) && isset($data->topic_id)) {
    // Check if exists
    $check = $conn->prepare("SELECT id FROM topic_progress WHERE user_id = ? AND topic_id = ?");
    $check->execute([$data->user_id, $data->topic_id]);
    
    // Ensure values are set or default to 0
    $ex1s = $data->ex1Solved ?? 0; $ex1t = $data->ex1Total ?? 30;
    $ex2s = $data->ex2Solved ?? 0; $ex2t = $data->ex2Total ?? 20;
    $ex3s = $data->ex3Solved ?? 0; $ex3t = $data->ex3Total ?? 15;
    $ex4s = $data->ex4Solved ?? 0; $ex4t = $data->ex4Total ?? 10;
    
    if($check->rowCount() > 0) {
        $sql = "UPDATE topic_progress SET status=?, ex1_solved=?, ex1_total=?, ex2_solved=?, ex2_total=?, ex3_solved=?, ex3_total=?, ex4_solved=?, ex4_total=? WHERE user_id=? AND topic_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $data->status, 
            $ex1s, $ex1t, 
            $ex2s, $ex2t, 
            $ex3s, $ex3t,
            $ex4s, $ex4t,
            $data->user_id, $data->topic_id
        ]);
    } else {
        $sql = "INSERT INTO topic_progress (user_id, topic_id, status, ex1_solved, ex1_total, ex2_solved, ex2_total, ex3_solved, ex3_total, ex4_solved, ex4_total) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $data->user_id, $data->topic_id, $data->status,
            $ex1s, $ex1t, 
            $ex2s, $ex2t, 
            $ex3s, $ex3t,
            $ex4s, $ex4t
        ]);
    }
    echo json_encode(["message" => "Progress saved"]);
}
?>`
        },
        {
            name: "manage_goals.php",
            folder: "api",
            desc: "Add/Update/Delete Daily Goals.",
            content: `<?php
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Add Goal
    $stmt = $conn->prepare("INSERT INTO daily_goals (id, user_id, goal_text, is_completed) VALUES (?, ?, ?, 0)");
    $stmt->execute([$data->id, $data->user_id, $data->text]);
    echo json_encode(["message" => "Goal added"]);
} elseif ($method === 'PUT') {
    // Toggle Status
    $stmt = $conn->prepare("UPDATE daily_goals SET is_completed = NOT is_completed WHERE id = ?");
    $stmt->execute([$data->id]);
    echo json_encode(["message" => "Goal toggled"]);
}
?>`
        },
        {
            name: "manage_backlogs.php",
            folder: "api",
            desc: "Manage backlog items.",
            content: `<?php
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $stmt = $conn->prepare("INSERT INTO backlogs (id, user_id, title, subject_id, priority, deadline, status) VALUES (?, ?, ?, ?, ?, ?, 'PENDING')");
    $stmt->execute([$data->id, $data->user_id, $data->title, $data->subjectId, $data->priority, $data->deadline]);
    echo json_encode(["message" => "Backlog added"]);
} elseif ($method === 'PUT') {
    $stmt = $conn->prepare("UPDATE backlogs SET status = IF(status='PENDING','CLEARED','PENDING') WHERE id = ?");
    $stmt->execute([$data->id]);
    echo json_encode(["message" => "Status updated"]);
} elseif ($method === 'DELETE') {
    $stmt = $conn->prepare("DELETE FROM backlogs WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    echo json_encode(["message" => "Deleted"]);
}
?>`
        },
        {
            name: "manage_mistakes.php",
            folder: "api",
            desc: "Manage mistake notebook.",
            content: `<?php
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $stmt = $conn->prepare("INSERT INTO mistake_notebook (id, user_id, question_text, subject_id, topic_id, test_name, user_notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data->id, $data->user_id, $data->questionText, $data->subjectId, $data->topicId, $data->testName, $data->userNotes]);
} elseif ($method === 'PUT') {
    $stmt = $conn->prepare("UPDATE mistake_notebook SET user_notes = ?, tags_json = ? WHERE id = ?");
    $stmt->execute([$data->userNotes, json_encode($data->tags), $data->id]);
} elseif ($method === 'DELETE') {
    $stmt = $conn->prepare("DELETE FROM mistake_notebook WHERE id = ?");
    $stmt->execute([$_GET['id']]);
}
?>`
        },
        {
            name: "save_timetable.php",
            folder: "api",
            desc: "Save generated timetable config.",
            content: `<?php
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));

// Insert or Update
$stmt = $conn->prepare("INSERT INTO timetable_settings (user_id, config_json, generated_slots_json) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE config_json=VALUES(config_json), generated_slots_json=VALUES(generated_slots_json)");
$stmt->execute([$data->user_id, json_encode($data->config), json_encode($data->slots)]);
echo json_encode(["message" => "Timetable saved"]);
?>`
        }
    ];
};

export const generateGitHubAction = (): string => {
    return `# GITHUB ACTION DISABLED
# To use automated deployment:
# 1. Create .github/workflows/deploy.yml
# 2. Paste the content generated in previous versions.
# 3. Add secrets to GitHub.
`;
};

// Provides data for UI Rendering
export const getDeploymentPhases = () => {
    return [
        {
            title: "Phase 1: Database Setup",
            subtitle: "Hostinger hPanel",
            color: "text-green-600",
            bg: "bg-green-50",
            steps: [
                "Log in to Hostinger > Databases > Management.",
                "Create a new MySQL Database (Save the password!).",
                "Scroll down and click 'Enter phpMyAdmin'.",
                "Import the 'database.sql' file (Download it from the block above)."
            ]
        },
        {
            title: "Phase 2: Backend API Setup",
            subtitle: "File Manager",
            color: "text-purple-600",
            bg: "bg-purple-50",
            steps: [
                "Go to Files > File Manager > public_html.",
                "Create a folder named 'api'.",
                "Create specific PHP files inside 'api' (Download scripts from above).",
                "Edit 'api/config.php' and PUT YOUR DATABASE PASSWORD (or use the generator above)."
            ]
        },
        {
            title: "Phase 3: Frontend Build",
            subtitle: "StackBlitz Terminal",
            color: "text-blue-600",
            bg: "bg-blue-50",
            steps: [
                "In StackBlitz terminal, run: `npm run build`.",
                "Wait for the 'dist' folder to appear.",
                "Click the StackBlitz logo (top-left) -> Export Project.",
                "Unzip the project on your computer."
            ]
        },
        {
            title: "Phase 4: Configuration",
            subtitle: "Local Code",
            color: "text-orange-600",
            bg: "bg-orange-50",
            steps: [
                "Open `src/config.ts` (or create it).",
                "Set `API_BASE_URL` to 'https://your-domain.com/api'.",
                "If you missed this before building, you might need to rebuild or edit the JS files."
            ]
        },
        {
            title: "Phase 5: Upload & Go Live",
            subtitle: "Hostinger File Manager",
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            steps: [
                "Go back to Hostinger File Manager > public_html.",
                "OPEN your local 'dist' folder.",
                "Select ALL files inside it (Usually just index.html and assets/ folder).",
                "Drag & Drop them DIRECTLY into 'public_html'.",
                "Ensure .htaccess is present to fix routing."
            ]
        }
    ];
};

// Keeps the text version for the downloadable file
export const generateFrontendGuide = (): string => {
    return `# HOSTINGER DEPLOYMENT MANUAL (ZERO-TO-HERO GUIDE)
======================================================

This guide assumes you have a clean Hostinger Shared Hosting plan and a domain (e.g., iitjeeprep.com).

TROUBLESHOOTING 403 ERRORS (ACCESS FORBIDDEN)
---------------------------------------------
If you see "Server error (403)" or "Access Denied":
1. **File Permissions:**
   - Go to Hostinger File Manager.
   - Right-click the \`api\` folder > Permissions. Set to **755**.
   - Open \`api\` folder. Select all PHP files. Right-click > Permissions. Set to **644**.
   - 600 or 400 is too restrictive; 777 is blocked by security.
2. **ModSecurity:**
   - Go to Hostinger hPanel > Security > ModSecurity.
   - If enabled, try temporarily disabling it to check if it's blocking the JSON requests.
3. **.htaccess in API:**
   - Ensure you uploaded the \`.htaccess\` file inside the \`api\` folder (provided in the backend zip).
   - This file forces Apache to allow access.

PHASE 1: DATABASE SETUP (Hostinger hPanel)
------------------------------------------
1. Log in to **Hostinger**.
2. Go to **Databases** > **Management**.
3. Create a New MySQL Database:
   - **Database Name:** u131922718_iitjee_tracker (or whatever you prefer)
   - **MySQL Username:** u131922718_iitjee_user
   - **Password:** Create a STRONG password (e.g., "MyStrongPass@2025"). **Write this down!**
   - Click **Create**.
4. Scroll down to your database list and click **Enter phpMyAdmin**.
5. inside phpMyAdmin:
   - Click the **Import** tab at the top.
   - Click **Choose File** and select the \`database.sql\` file you downloaded from this Admin Panel.
   - Click **Go** (bottom of page).
   - ✅ Success! Your tables are created.

PHASE 2: BACKEND API SETUP (File Manager)
-----------------------------------------
1. Go to Hostinger **Files** > **File Manager**.
2. Open the **public_html** folder.
3. **Create a Folder** named \`api\`. Open it.
4. **Create PHP Files**:
   - Download the "PHP Backend API" text from the System Docs.
   - **IMPORTANT:** If you entered your DB password in the "Database Configuration" form above before downloading, your \`config.php\` is ready to use. 
   - Otherwise, open \`api/config.php\` and manually replace "YourStrongPassword" with your real DB password.
   - You need to create each file manually in the \`api\` folder:
     - \`api/config.php\`
     - \`api/login.php\`
     - \`api/register.php\`
     - \`api/sync_progress.php\`
     - \`api/get_dashboard.php\`
     - \`api/get_common.php\`
     - \`api/verify.php\`
     - \`api/test_db.php\`
     - \`api/index.php\`
     - \`api/.htaccess\` (IMPORTANT)

PHASE 3: FRONTEND BUILD (StackBlitz)
------------------------------------
1. In the StackBlitz **Terminal** (bottom of screen), run:
   \`\`\`bash
   npm run build
   \`\`\`
   *(If it asks to install dependencies, let it).*
2. Wait for it to finish. A \`dist\` folder will appear in the file tree.
3. **Export Project**: Click the StackBlitz logo (top left) -> **Export Project**.
4. Unzip the downloaded file on your computer.
5. Find the \`dist\` folder inside the unzipped project.

PHASE 4: FRONTEND CONFIGURATION
-------------------------------
1. Before uploading, we need to tell the Frontend to talk to your live API.
2. In your local unzipped code (or on StackBlitz before building), open \`src/config.ts\` (create if missing).
   \`\`\`typescript
   // src/config.ts
   export const API_BASE_URL = "https://your-domain.com/api"; // CHANGE THIS URL!
   \`\`\`
3. If you changed this *after* building, you need to build again. 
   *(Hack: You can also search-replace the localhost URL in the generated .js files in dist/assets, but rebuilding is safer).*

PHASE 5: UPLOAD & GO LIVE
-------------------------
1. Go back to Hostinger **File Manager** > **public_html**.
2. **Open the \`dist\` folder on your computer.**
3. **Select ALL files** inside it.
   - You should typically see:
     - \`index.html\`
     - \`assets/\` (This folder contains your compiled .js file)
     - \`vite.svg\` (optional)
   - **Note:** You will likely NOT see a large .css file because this app uses Tailwind via CDN. This is normal!
4. **Drag and Drop them DIRECTLY into the \`public_html\` folder** on Hostinger.
   - ⚠️ **CRITICAL:** Do NOT upload the \`dist\` folder itself. Upload its CONTENTS.
   - Your \`public_html\` should look like:
     - \`api/\` (folder)
     - \`assets/\` (folder)
     - \`index.html\`
     - \`.htaccess\`
     - ...other files
5. **React Routing Fix**:
   - Create a new file in \`public_html\` named \`.htaccess\`.
   - Paste the following:
     \`\`\`apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     \`\`\`

🎉 DONE!
--------
Visit your domain. You should see the login screen.
- Try logging in with: \`innfriend1@gmail.com\` / \`123456\`.
- Try creating a new account (Email verification is disabled, you will be logged in immediately).
- Use the 'Live Connection Tester' in Admin Panel to verify everything is working.
`;
};