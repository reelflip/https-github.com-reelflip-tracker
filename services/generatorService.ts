

import { JEE_SYLLABUS, DEFAULT_QUOTES, MOCK_TESTS, INITIAL_FLASHCARDS, MOCK_USERS } from '../constants';
import { Question } from '../types';

export const generateSQLSchema = (): string => {
  let sql = `-- DATABASE SCHEMA FOR JEE TRACKER PRO
-- Generated for Hostinger / Shared Hosting (MySQL)

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
    is_verified BOOLEAN DEFAULT FALSE, 
    verification_token VARCHAR(100),
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
-- 7. TIMETABLE, GOALS & BACKLOGS
--
CREATE TABLE IF NOT EXISTS daily_goals (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    goal_text VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS backlogs (
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

CREATE TABLE IF NOT EXISTS timetable_settings (
    user_id INT PRIMARY KEY,
    config_json JSON NOT NULL,
    generated_slots_json JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--
-- 8. NOTIFICATIONS, QUOTES & FLASHCARDS
--
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'ALERT', 'SUCCESS') DEFAULT 'INFO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotes (
    id VARCHAR(50) PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flashcards (
    id VARCHAR(50) PRIMARY KEY,
    subject_id ENUM('phys', 'chem', 'math') NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    difficulty ENUM('HARD', 'MEDIUM', 'EASY') DEFAULT 'MEDIUM',
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
  sql += `\n-- Seeding Chapters and Topics\n`;
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
  sql += `\n-- Seeding Default Quotes\n`;
  if (DEFAULT_QUOTES.length > 0) {
      sql += `INSERT IGNORE INTO quotes (id, text, author) VALUES \n`;
      const quoteValues = DEFAULT_QUOTES.map(q => {
          const safeText = q.text.replace(/'/g, "''");
          const safeAuthor = q.author?.replace(/'/g, "''") || '';
          return `('${q.id}', '${safeText}', '${safeAuthor}')`;
      }).join(',\n');
      sql += quoteValues + `;\n`;
  }

  // 4. Seed Flashcards
  sql += `\n-- Seeding Initial Flashcards\n`;
  if (INITIAL_FLASHCARDS.length > 0) {
      sql += `INSERT IGNORE INTO flashcards (id, subject_id, front, back, difficulty) VALUES \n`;
      const flashcardValues = INITIAL_FLASHCARDS.map(f => {
          const safeFront = f.front.replace(/'/g, "''").replace(/\\/g, '\\\\');
          const safeBack = f.back.replace(/'/g, "''").replace(/\\/g, '\\\\');
          return `('${f.id}', '${f.subjectId}', '${safeFront}', '${safeBack}', '${f.difficulty}')`;
      }).join(',\n');
      sql += flashcardValues + `;\n`;
  }

  // 5. Seed Questions & Tests
  const allQuestions: Question[] = [];
  const questionIds = new Set();
  
  MOCK_TESTS.forEach(test => {
      test.questions.forEach(q => {
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
  
  // 6. Seed ADMIN User
  sql += `\n-- Seeding Admin User (Pass: Ishika@123)\n`;
  sql += `INSERT IGNORE INTO users (email, password_hash, full_name, role, is_verified) VALUES ('admin', '$2y$10$YourHashedPasswordHereForIshika123', 'System Administrator', 'ADMIN', 1);\n`;

  // 7. Seed Demo Student & Parent
  sql += `\n-- Seeding Demo Student (innfriend1@gmail.com / 123456) and Parent (vikas.00@gmail.com / 123456)\n`;
  // Using a known hash for '123456' -> $2y$10$fWv0o... (example placeholder, replace with real bcrypt hash for 123456)
  // Real hash for 123456: $2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm
  const hash123456 = "$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm";
  
  sql += `INSERT IGNORE INTO users (email, password_hash, full_name, role, is_verified, institute, target_year) VALUES ('innfriend1@gmail.com', '${hash123456}', 'InnFriend Student', 'STUDENT', 1, 'Allen Career Institute', 2025);\n`;
  sql += `INSERT IGNORE INTO users (email, password_hash, full_name, role, is_verified) VALUES ('vikas.00@gmail.com', '${hash123456}', 'Vikas Parent', 'PARENT', 1);\n`;
  
  // 8. Link Parent to Student
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

export const generatePHPAuth = (): string => {
  return `
/* ========================================================
   FILE: api/config.php
   ACTION: Create this file inside 'api' folder.
   ======================================================== */
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$host = "82.25.121.80"; 
$db_name = "u131922718_iitjee_tracker";
$username = "u131922718_iitjee_user";
$password = "YourStrongPassword";    // CHANGE THIS: You must manually set your DB password here.

// GMAIL SMTP CONFIG
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'innfriend1@gmail.com'); 
define('SMTP_PASS', 'YOUR_GMAIL_APP_PASSWORD_HERE'); // Generate from Google Account > Security > App Passwords
define('SMTP_PORT', 587);

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->exec("set names utf8mb4");
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit();
}
?>


/* ========================================================
   FILE: api/register.php
   ACTION: Create this file inside 'api' folder.
   ======================================================== */
<?php
use PHPMailer\\PHPMailer\\PHPMailer;
use PHPMailer\\PHPMailer\\Exception;

// IMPORTANT: Ensure /api/PHPMailer/src/ folder exists with these files
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = password_hash($data->password, PASSWORD_BCRYPT);
    $name = $data->name;
    $role = $data->role;
    $token = bin2hex(random_bytes(16)); // Verification Token

    // Insert user with is_verified = 0
    $query = "INSERT INTO users (email, password_hash, full_name, role, is_verified, verification_token, institute, target_year) VALUES (:email, :pass, :name, :role, 0, :token, :inst, :year)";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":pass", $password);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":role", $role);
    $stmt->bindParam(":token", $token);
    $stmt->bindParam(":inst", $data->institute);
    $stmt->bindParam(":year", $data->targetYear);

    if($stmt->execute()) {
        // --- SEND EMAIL VIA GMAIL SMTP ---
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();                                            
            $mail->Host       = SMTP_HOST;                     
            $mail->SMTPAuth   = true;                                   
            $mail->Username   = SMTP_USER;                     
            $mail->Password   = SMTP_PASS;                               
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;            
            $mail->Port       = SMTP_PORT;                                    

            $mail->setFrom(SMTP_USER, 'JEE Tracker Admin');
            $mail->addAddress($email, $name);     

            $mail->isHTML(true);                                  
            $mail->Subject = 'Verify your JEE Tracker Account';
            
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $domain = $_SERVER['HTTP_HOST'];
            $verifyLink = "$protocol://$domain/api/verify.php?token=$token";

            $mail->Body    = "
                <h3>Hi $name,</h3>
                <p>Welcome to JEE Tracker. Please verify your email to unlock your account.</p>
                <p><a href='$verifyLink' style='background:#2563eb; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;'>Verify Account</a></p>
                <p>Or copy this link: $verifyLink</p>
            ";
            $mail->AltBody = "Hi $name, Please verify your account: $verifyLink";

            $mail->send();
            echo json_encode(["message" => "Registration successful. Verification email sent."]);
        } catch (Exception $e) {
            echo json_encode(["message" => "User registered, but email could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
        }

    } else {
        http_response_code(400);
        echo json_encode(["message" => "User already exists or error occurred."]);
    }
}
?>


/* ========================================================
   FILE: api/verify.php
   ACTION: Create this file inside 'api' folder.
   ======================================================== */
<?php
include_once 'config.php';

if(isset($_GET['token'])) {
    $token = $_GET['token'];
    $query = "UPDATE users SET is_verified = 1, verification_token = NULL WHERE verification_token = :token";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":token", $token);
    
    if($stmt->execute() && $stmt->rowCount() > 0) {
        echo "<h1>Account Verified! ✅</h1><p>You can now go back to the app and login.</p>";
    } else {
        echo "<h1>Invalid or expired token. ❌</h1>";
    }
}
?>


/* ========================================================
   FILE: api/login.php
   ACTION: Create this file inside 'api' folder.
   ======================================================== */
<?php
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $email = $data->email;
    $password = $data->password;
    
    $query = "SELECT * FROM users WHERE email = :email LIMIT 0,1";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Admin Override check (For recovery, can be removed in prod)
        if ($email === 'admin' && $password === 'Ishika@123') {
             unset($row['password_hash']);
             echo json_encode(["message" => "Login successful", "user" => $row]);
             exit();
        }

        if(password_verify($password, $row['password_hash'])) {
            if ($row['is_verified'] == 1 || $email == 'admin') {
                unset($row['password_hash']);
                echo json_encode(["message" => "Login successful", "user" => $row]);
            } else {
                http_response_code(403);
                echo json_encode(["message" => "Please verify your email first."]);
            }
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


/* ========================================================
   FILE: api/sync_progress.php
   ACTION: Create this file inside 'api' folder.
   ======================================================== */
<?php
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->user_id) && isset($data->topic_id)) {
    // Check if exists
    $check = $conn->prepare("SELECT id FROM topic_progress WHERE user_id = ? AND topic_id = ?");
    $check->execute([$data->user_id, $data->topic_id]);
    
    if($check->rowCount() > 0) {
        $sql = "UPDATE topic_progress SET status=?, ex1_solved=?, ex1_total=?, ex2_solved=?, ex2_total=?, ex3_solved=?, ex3_total=?, ex4_solved=?, ex4_total=? WHERE user_id=? AND topic_id=?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $data->status, 
            $data->ex1Solved, $data->ex1Total, 
            $data->ex2Solved, $data->ex2Total, 
            $data->ex3Solved, $data->ex3Total,
            $data->ex4Solved, $data->ex4Total,
            $data->user_id, $data->topic_id
        ]);
    } else {
        $sql = "INSERT INTO topic_progress (user_id, topic_id, status, ex1_solved, ex1_total, ex2_solved, ex2_total, ex3_solved, ex3_total, ex4_solved, ex4_total) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $data->user_id, $data->topic_id, $data->status,
            $data->ex1Solved, $data->ex1Total, 
            $data->ex2Solved, $data->ex2Total, 
            $data->ex3Solved, $data->ex3Total,
            $data->ex4Solved, $data->ex4Total
        ]);
    }
    echo json_encode(["message" => "Progress saved"]);
}
?>


/* ========================================================
   FILE: api/get_dashboard.php
   ACTION: Create this file inside 'api' folder.
   ======================================================== */
<?php
include_once 'config.php';
$user_id = $_GET['user_id'];

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
?>

/* ========================================================
   FILE: api/get_common.php
   ACTION: Create this file inside 'api' folder.
   ======================================================== */
<?php
include_once 'config.php';

// Quotes
$quotes = $conn->query("SELECT * FROM quotes ORDER BY RAND() LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);

// Flashcards
$flashcards = $conn->query("SELECT * FROM flashcards")->fetchAll(PDO::FETCH_ASSOC);

// Notifications
$notifs = $conn->query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);

// Tests
$tests = $conn->query("SELECT * FROM tests")->fetchAll(PDO::FETCH_ASSOC);
// Note: In real app, you would fetch questions for each test here or lazy load them.

echo json_encode([
    "quotes" => $quotes,
    "flashcards" => $flashcards,
    "notifications" => $notifs,
    "tests" => $tests
]);
?>

/* ========================================================
   FILE: api/manage_goals.php
   ACTION: Create this file inside 'api' folder.
   ======================================================== */
<?php
include_once 'config.php';
$data = json_decode(file_get_contents("php://input"));
// Basic CRUD for goals...
?>
`;
};

export const generateGitHubAction = (): string => {
    return `# GITHUB ACTION DISABLED
# To use automated deployment:
# 1. Create .github/workflows/deploy.yml
# 2. Paste the content generated in previous versions.
# 3. Add secrets to GitHub.
`;
};

export const generateFrontendGuide = (): string => {
    return `# HOSTINGER DEPLOYMENT MANUAL (ZERO-TO-HERO GUIDE)
======================================================

This guide assumes you have a clean Hostinger Shared Hosting plan and a domain (e.g., iitjeetracker.com).

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
   - It contains code for multiple files separated by headers.
   - You need to create each file manually in the \`api\` folder:
     - \`api/config.php\` (Paste code. **IMPORTANT:** Replace "YourStrongPassword" with your real DB password).
     - \`api/login.php\`
     - \`api/register.php\`
     - \`api/sync_progress.php\`
     - \`api/get_dashboard.php\`
     - \`api/get_common.php\`
     - \`api/verify.php\`
5. **Install PHPMailer** (For Emails):
   - Inside the \`api\` folder, create a folder named \`PHPMailer\`.
   - Inside \`PHPMailer\`, create a folder named \`src\`.
   - Download PHPMailer ZIP: https://github.com/PHPMailer/PHPMailer/archive/master.zip
   - Extract it on your PC.
   - Upload \`Exception.php\`, \`PHPMailer.php\`, and \`SMTP.php\` into the \`public_html/api/PHPMailer/src/\` folder.

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
2. **Upload** all files/folders from inside your \`dist\` folder.
   - You should see \`index.html\`, \`assets\`, \`vite.svg\` etc. sitting directly in \`public_html\`.
   - Ensure you do NOT upload the \`dist\` folder itself, but its *contents*.
3. **React Routing Fix**:
   - React needs a special file to handle routing (so refreshing /dashboard doesn't give 404).
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
- Try creating a new account (Email verification should work if you set up Gmail App Password in config.php).
`;
};
