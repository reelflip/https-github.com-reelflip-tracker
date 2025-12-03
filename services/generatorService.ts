
import { JEE_SYLLABUS } from '../constants';

export const generateSQLSchema = (): string => {
  let sql = `-- DATABASE SCHEMA FOR JEE TRACKER PRO
-- Generated for Hostinger / Shared Hosting (MySQL)
-- --------------------------------------------------------

/*
    ===================================================================
    DEPLOYMENT INSTRUCTIONS FOR HOSTINGER / SHARED HOSTING
    ===================================================================

    STEP 1: DATABASE SETUP
    1. Log in to Hostinger hPanel -> Databases -> MySQL Databases.
    2. Create a new Database Name (e.g., u123456789_jee_db).
    3. Create a new Database User and Password.
    4. Click "Enter phpMyAdmin".

    STEP 2: IMPORT SCHEMA
    1. In phpMyAdmin, click the "Import" tab.
    2. Upload this .sql file (save the text below as database.sql).
    3. Click "Go". This will create all tables and fill the Syllabus.

    STEP 3: BACKEND API (PHP)
    1. In Hostinger File Manager, go to 'public_html'.
    2. Create a folder named 'api'.
    3. Inside 'api', create 'config.php' (Database connection).
    4. Create other endpoints like 'login.php', 'sync_progress.php'.
    5. Update 'config.php' with the Database Name, User, and Password from Step 1.

    STEP 4: FRONTEND REACT APP
    1. On your local machine, run 'npm run build'.
    2. This creates a 'dist' (or 'build') folder.
    3. Upload the CONTENTS of this 'dist' folder to 'public_html' on Hostinger.
    4. Ensure 'index.html' is in the root of 'public_html'.

    ===================================================================
*/

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

--
-- 1. USERS TABLE
--
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('STUDENT', 'PARENT', 'ADMIN') NOT NULL,
    target_year INT DEFAULT NULL,
    institute VARCHAR(100),
    school VARCHAR(100),
    course_name VARCHAR(100),
    phone VARCHAR(20),
    parent_id INT DEFAULT NULL,
    student_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL
);

--
-- 2. SYLLABUS TABLES (Subjects -> Chapters -> Topics)
--
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS chapters (
    id VARCHAR(50) PRIMARY KEY,
    subject_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(50) PRIMARY KEY,
    chapter_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

--
-- 3. PROGRESS TRACKING (Chapter to Exercise)
--
CREATE TABLE IF NOT EXISTS topic_progress (
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
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_topic (user_id, topic_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

--
-- 4. TESTS & QUESTIONS
--
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(50) PRIMARY KEY,
    subject_id VARCHAR(50),
    topic_id VARCHAR(50),
    question_text TEXT NOT NULL,
    options_json JSON NOT NULL COMMENT '["Op1", "Op2", "Op3", "Op4"]',
    correct_option_index TINYINT NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tests (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration_minutes INT NOT NULL,
    category ENUM('ADMIN', 'PAST_PAPER', 'CUSTOM') DEFAULT 'CUSTOM',
    difficulty ENUM('MAINS', 'ADVANCED', 'CUSTOM') DEFAULT 'MAINS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_questions (
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
CREATE TABLE IF NOT EXISTS test_attempts (
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

CREATE TABLE IF NOT EXISTS attempt_details (
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
CREATE TABLE IF NOT EXISTS mistake_notebook (
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
-- 7. TIMETABLE & GOALS
--
CREATE TABLE IF NOT EXISTS daily_goals (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    goal_text VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS timetable_settings (
    user_id INT PRIMARY KEY,
    config_json JSON NOT NULL,
    generated_slots_json JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--
-- 8. NOTIFICATIONS
--
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'ALERT', 'SUCCESS') DEFAULT 'INFO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- SEED DATA: SYLLABUS
-- (Automatically generated from constants.ts)
--
`;

  // Generate Inserts for Subjects
  sql += `\n-- Seeding Subjects\n`;
  sql += `INSERT IGNORE INTO subjects (id, name) VALUES \n`;
  sql += `('phys', 'Physics'),\n('chem', 'Chemistry'),\n('math', 'Mathematics');\n`;

  // Generate Inserts for Chapters & Topics
  sql += `\n-- Seeding Chapters and Topics\n`;
  
  JEE_SYLLABUS.forEach((subject) => {
    subject.chapters.forEach((chapter, cIndex) => {
      // Escape single quotes for SQL
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

  sql += `\n-- End of Schema\n`;

  return sql;
};

export const generatePHPAuth = (): string => {
  return `<?php
/**
 * api/config.php
 * Database Connection for Hostinger
 */
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$host = "localhost";
$db_name = "u123456789_jee_tracker"; // CHANGE THIS to your Hostinger DB Name
$username = "u123456789_admin";      // CHANGE THIS to your Hostinger Username
$password = "YourStrongPassword";    // CHANGE THIS

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->exec("set names utf8mb4");
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit();
}
?>

<?php
/**
 * api/login.php
 * Endpoint to authenticate user
 */
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = $data->password; // In production, use password_verify()

    // Query
    $query = "SELECT * FROM users WHERE email = :email LIMIT 0,1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Simple password check
        if ($password === '123456') { 
            unset($row['password_hash']);
            http_response_code(200);
            echo json_encode([
                "message" => "Login successful",
                "user" => $row,
                "token" => bin2hex(random_bytes(16))
            ]);
        } else {
             http_response_code(401);
             echo json_encode(["message" => "Invalid password."]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["message" => "User not found."]);
    }
}
?>

<?php
/**
 * api/sync_progress.php
 * Endpoint to save topic progress
 */
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->user_id) && isset($data->topic_id)) {
    // Insert or Update progress
    $query = "INSERT INTO topic_progress (user_id, topic_id, status, ex1_solved) 
              VALUES (:uid, :tid, :status, :ex1) 
              ON DUPLICATE KEY UPDATE status=:status, ex1_solved=:ex1";
              
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":uid", $data->user_id);
    $stmt->bindParam(":tid", $data->topic_id);
    $stmt->bindParam(":status", $data->status);
    $stmt->bindParam(":ex1", $data->ex1_solved);
    
    if($stmt->execute()){
        echo json_encode(["message" => "Progress saved."]);
    } else {
        echo json_encode(["message" => "Failed to save."]);
    }
}
?>`;
};

export const generateFrontendGuide = (): string => {
    return `# REACT TO PHP INTEGRATION GUIDE
========================================

Step 1: Configure Base URL
--------------------------
Create a file 'src/config.ts':
export const API_BASE_URL = "https://your-domain.com/api";

Step 2: Update Authentication (AuthScreen.tsx)
----------------------------------------------
Replace the 'handleAuth' mock logic with:

const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch(\`\${API_BASE_URL}/login.php\`, {
      method: 'POST',
      body: JSON.stringify({ email: formData.email, password: formData.password })
    });
    const data = await res.json();
    if (res.ok) {
      onLogin(data.user); // Store user in App state
    } else {
      setError(data.message);
    }
  } catch (err) {
    setError("Network error");
  }
};

Step 3: Fetch Data on Load (App.tsx)
------------------------------------
Replace the initial useEffect in App.tsx:

useEffect(() => {
  if (currentUser) {
    // Fetch Progress
    fetch(\`\${API_BASE_URL}/get_progress.php?user_id=\${currentUser.id}\`)
      .then(res => res.json())
      .then(data => setProgress(data));
      
    // Fetch Mistakes, Tests, etc.
  }
}, [currentUser]);

Step 4: Update Progress (App.tsx)
---------------------------------
Update 'handleUpdateProgress':

const handleUpdateProgress = (topicId, updates) => {
  // 1. Optimistic Update (Update UI immediately)
  setProgress(prev => ({ ...prev, [topicId]: { ...prev[topicId], ...updates } }));
  
  // 2. Sync with Backend
  fetch(\`\${API_BASE_URL}/sync_progress.php\`, {
      method: 'POST',
      body: JSON.stringify({
          user_id: currentUser.id,
          topic_id: topicId,
          ...updates
      })
  });
};
`;
};
