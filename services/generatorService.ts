
// ... existing imports ...
import { JEE_SYLLABUS, DEFAULT_QUOTES, MOCK_TESTS, INITIAL_FLASHCARDS, INITIAL_MEMORY_HACKS, BLOG_POSTS, TOPIC_VIDEO_MAP } from '../constants';
import { Question } from '../types';

export const generateSQLSchema = (): string => {
  let sql = `-- DATABASE SCHEMA FOR IITGEEPrep (v5.0 Final Production Release)
-- Generated for Hostinger / Shared Hosting (MySQL)
-- Official Website: iitgeeprep.com

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+05:30";

--
-- 0. CLEANUP
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
DROP TABLE IF EXISTS topic_videos;
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
DROP TABLE IF EXISTS site_traffic;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE
CREATE TABLE users (
    id INT PRIMARY KEY,
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

-- STANDARD TABLES
CREATE TABLE subjects ( id VARCHAR(50) PRIMARY KEY, name VARCHAR(100) NOT NULL );
CREATE TABLE chapters ( id VARCHAR(50) PRIMARY KEY, subject_id VARCHAR(50) NOT NULL, name VARCHAR(255) NOT NULL, sort_order INT DEFAULT 0, FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE );
CREATE TABLE topics ( id VARCHAR(50) PRIMARY KEY, chapter_id VARCHAR(50) NOT NULL, name VARCHAR(255) NOT NULL, sort_order INT DEFAULT 0, FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE );

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

CREATE TABLE topic_videos (
    topic_id VARCHAR(50) PRIMARY KEY,
    video_url VARCHAR(255) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE questions ( id VARCHAR(50) PRIMARY KEY, subject_id VARCHAR(50), topic_id VARCHAR(50), question_text TEXT NOT NULL, options_json JSON NOT NULL, correct_option_index TINYINT NOT NULL, difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE tests ( id VARCHAR(50) PRIMARY KEY, title VARCHAR(255) NOT NULL, duration_minutes INT NOT NULL, category ENUM('ADMIN', 'PAST_PAPER', 'CUSTOM') DEFAULT 'CUSTOM', difficulty ENUM('MAINS', 'ADVANCED', 'CUSTOM') DEFAULT 'MAINS', exam_type ENUM('JEE', 'BITSAT', 'VITEEE', 'MET', 'SRMJEEE', 'OTHER') DEFAULT 'JEE', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE test_questions ( test_id VARCHAR(50), question_id VARCHAR(50), question_order INT, PRIMARY KEY (test_id, question_id), FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE, FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE );
CREATE TABLE test_attempts ( id VARCHAR(50) PRIMARY KEY, user_id INT NOT NULL, test_id VARCHAR(50) NOT NULL, score INT NOT NULL, total_questions INT NOT NULL, correct_count INT NOT NULL, incorrect_count INT NOT NULL, accuracy_percent DECIMAL(5,2), attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE );
CREATE TABLE attempt_details ( id INT AUTO_INCREMENT PRIMARY KEY, attempt_id VARCHAR(50) NOT NULL, question_id VARCHAR(50) NOT NULL, status ENUM('CORRECT', 'INCORRECT', 'UNATTEMPTED') NOT NULL, selected_option INT DEFAULT NULL, FOREIGN KEY (attempt_id) REFERENCES test_attempts(id) ON DELETE CASCADE );
CREATE TABLE mistake_notebook ( id VARCHAR(50) PRIMARY KEY, user_id INT NOT NULL, question_text TEXT, subject_id VARCHAR(50), topic_id VARCHAR(50), test_name VARCHAR(255), user_notes TEXT, tags_json JSON, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE );
CREATE TABLE daily_goals ( id VARCHAR(50) PRIMARY KEY, user_id INT NOT NULL, goal_text VARCHAR(255) NOT NULL, is_completed BOOLEAN DEFAULT FALSE, created_at DATE DEFAULT (CURRENT_DATE), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE );
CREATE TABLE backlogs ( id VARCHAR(50) PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(255) NOT NULL, subject_id ENUM('phys', 'chem', 'math') NOT NULL, priority ENUM('HIGH', 'MEDIUM', 'LOW') DEFAULT 'MEDIUM', deadline DATE, status ENUM('PENDING', 'CLEARED') DEFAULT 'PENDING', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE );
CREATE TABLE timetable_settings ( user_id INT PRIMARY KEY, config_json JSON NOT NULL, generated_slots_json JSON, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE );
CREATE TABLE notifications ( id VARCHAR(50) PRIMARY KEY, title VARCHAR(255) NOT NULL, message TEXT NOT NULL, type ENUM('INFO', 'ALERT', 'SUCCESS') DEFAULT 'INFO', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE quotes ( id VARCHAR(50) PRIMARY KEY, text TEXT NOT NULL, author VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE flashcards ( id VARCHAR(50) PRIMARY KEY, subject_id ENUM('phys', 'chem', 'math') NOT NULL, front TEXT NOT NULL, back TEXT NOT NULL, difficulty ENUM('HARD', 'MEDIUM', 'EASY') DEFAULT 'MEDIUM', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE memory_hacks ( id VARCHAR(50) PRIMARY KEY, subject_id ENUM('phys', 'chem', 'math') NOT NULL, category VARCHAR(100) DEFAULT 'General', title VARCHAR(255) NOT NULL, description TEXT, trick TEXT NOT NULL, tags_json JSON, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE contact_messages ( id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), subject VARCHAR(255), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
CREATE TABLE blog_posts ( id VARCHAR(50) PRIMARY KEY, title VARCHAR(255) NOT NULL, excerpt TEXT, content TEXT, author VARCHAR(100), category VARCHAR(50), image_url VARCHAR(255), created_at DATE DEFAULT (CURRENT_DATE) );
CREATE TABLE site_traffic ( visit_date DATE PRIMARY KEY, visit_count INT DEFAULT 0 );

-- SEED DATA
INSERT IGNORE INTO subjects (id, name) VALUES ('phys', 'Physics'),('chem', 'Chemistry'),('math', 'Mathematics');
` + JEE_SYLLABUS.map(s => s.chapters.map((c, ci) => `INSERT IGNORE INTO chapters (id, subject_id, name, sort_order) VALUES ('${c.id}', '${s.id}', '${c.name.replace(/'/g, "''")}', ${ci});\n` + c.topics.map((t, ti) => `INSERT IGNORE INTO topics (id, chapter_id, name, sort_order) VALUES ('${t.id}', '${c.id}', '${t.name.replace(/'/g, "''")}', ${ti});`).join('\n')).join('\n')).join('\n') + `
INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified) VALUES (100000, 'admin', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'System Administrator', 'ADMIN', 1);
INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified, institute, target_year, target_exam) VALUES (582910, 'innfriend1@gmail.com', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'InnFriend Student', 'STUDENT', 1, 'Allen Career Institute', 2025, 'JEE Main & Advanced');
INSERT IGNORE INTO users (id, email, password_hash, full_name, role, is_verified) VALUES (749201, 'vikas.00@gmail.com', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'Vikas Parent', 'PARENT', 1);
UPDATE users SET student_id = 582910 WHERE id = 749201;
UPDATE users SET parent_id = 749201 WHERE id = 582910;

-- SEED CONTENT
` + INITIAL_FLASHCARDS.map(f => `INSERT IGNORE INTO flashcards (id, subject_id, front, back, difficulty) VALUES ('${f.id}', '${f.subjectId}', '${f.front.replace(/'/g, "''")}', '${f.back.replace(/'/g, "''")}', '${f.difficulty}');`).join('\n') + `
` + INITIAL_MEMORY_HACKS.map(h => `INSERT IGNORE INTO memory_hacks (id, subject_id, category, title, description, trick, tags_json) VALUES ('${h.id}', '${h.subjectId}', '${h.category.replace(/'/g, "''")}', '${h.title.replace(/'/g, "''")}', '${h.description.replace(/'/g, "''")}', '${h.trick.replace(/'/g, "''").replace(/\n/g, "\\n")}', '${JSON.stringify(h.tags)}');`).join('\n') + `
` + DEFAULT_QUOTES.map(q => `INSERT IGNORE INTO quotes (id, text, author) VALUES ('${q.id}', '${q.text.replace(/'/g, "''")}', '${q.author?.replace(/'/g, "''")}');`).join('\n') + `
` + BLOG_POSTS.map(b => `INSERT IGNORE INTO blog_posts (id, title, excerpt, content, author, category, image_url, created_at) VALUES ('${b.id}', '${b.title.replace(/'/g, "''")}', '${b.excerpt.replace(/'/g, "''")}', '${b.content.replace(/'/g, "''")}', '${b.author.replace(/'/g, "''")}', '${b.category}', '${b.imageUrl}', '${new Date(b.date).toISOString().split('T')[0]}');`).join('\n') + `
` + Object.entries(TOPIC_VIDEO_MAP).map(([tid, url]) => `INSERT IGNORE INTO topic_videos (topic_id, video_url) VALUES ('${tid}', '${url}');`).join('\n') + `

-- EXTRACT AND SEED QUESTIONS FROM MOCK TESTS
` + Array.from(new Set(MOCK_TESTS.flatMap(t => t.questions).map(q => q.id))).map(qid => {
    const q = MOCK_TESTS.flatMap(t => t.questions).find(qu => qu.id === qid);
    if(!q) return '';
    return `INSERT IGNORE INTO questions (id, subject_id, topic_id, question_text, options_json, correct_option_index) VALUES ('${q.id}', '${q.subjectId}', '${q.topicId}', '${q.text.replace(/'/g, "''")}', '${JSON.stringify(q.options).replace(/'/g, "''")}', ${q.correctOptionIndex});`;
}).join('\n') + `

-- SEED TESTS & TEST_QUESTIONS
` + MOCK_TESTS.map(t => {
    let sql = `INSERT IGNORE INTO tests (id, title, duration_minutes, category, difficulty, exam_type) VALUES ('${t.id}', '${t.title.replace(/'/g, "''")}', ${t.durationMinutes}, '${t.category}', '${t.difficulty}', '${t.examType}');\n`;
    sql += t.questions.map((q, idx) => `INSERT IGNORE INTO test_questions (test_id, question_id, question_order) VALUES ('${t.id}', '${q.id}', ${idx});`).join('\n');
    return sql;
}).join('\n') + `
`;
  return sql;
};

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
    { title: "Phase 1: Build & Prep", subtitle: "Local Machine", bg: "bg-blue-50 border-blue-100", color: "text-blue-700", steps: ["Run `npm run build`.", "Zip the contents of `dist/`."] },
    { title: "Phase 2: Database Setup", subtitle: "Hostinger Panel", bg: "bg-yellow-50 border-yellow-100", color: "text-yellow-700", steps: ["Create MySQL Database.", "Import `database.sql` via phpMyAdmin."] },
    { title: "Phase 3: Backend Upload", subtitle: "File Manager", bg: "bg-purple-50 border-purple-100", color: "text-purple-700", steps: ["Create `api` folder.", "Upload PHP files.", "Edit `config.php`."] },
    { title: "Phase 4: Frontend Upload", subtitle: "File Manager", bg: "bg-green-50 border-green-100", color: "text-green-700", steps: ["Upload build zip to root.", "Extract.", "Ensure `index.html` is in public_html."] },
    { title: "Phase 5: Verification", subtitle: "Browser", bg: "bg-slate-50 border-slate-200", color: "text-slate-700", steps: ["Test Login.", "Run Diagnostics."] },
    { title: "Phase 6: System Diagnostics", subtitle: "Admin Panel", bg: "bg-indigo-50 border-indigo-100", color: "text-indigo-700", steps: ["Log in as Admin.", "Go to System Tests.", "Run Full Scan."] }
  ];
};

export const generateFrontendGuide = () => {
    return `# IITGEEPrep Hostinger Deployment Manual

## Phase 1: Preparation (Local)
1. **Build Project**: Run \`npm run build\` in your terminal. This creates a \`dist\` folder.
2. **Zip Frontend**: Zip the **contents** of the \`dist\` folder (index.html, assets/). Name it \`frontend.zip\`.
3. **Download Backend**: From the Admin Panel > System Docs, click "Download All (.zip)". This contains all PHP files.

## Phase 2: Database Setup (Hostinger)
1. Log in to Hostinger hPanel.
2. Go to **Databases > Management**.
3. Create a New Database:
   - Name: \`u123_iitjee_tracker\` (Example)
   - User: \`u123_iitjee_user\`
   - Password: (Strong Password)
4. Click **Enter phpMyAdmin**.
5. Select your database on the left.
6. Click **Import** tab.
7. Choose the \`database.sql\` file (downloaded from Admin Panel).
8. Click **Go**.

## Phase 3: File Upload (Hostinger)
1. Go to **Files > File Manager**.
2. Open \`public_html\`.
3. **Upload Frontend**: Upload \`frontend.zip\` and extract it here. You should see \`index.html\` directly in \`public_html\`.
4. **Create API Folder**: Create a new folder named \`api\`.
5. **Upload Backend**: Open \`api/\` folder. Upload \`hostinger_backend_bundle.zip\` and extract it.
6. **Configure Database**:
   - Open \`api/config.php\`.
   - Update \`$host\`, \`$db_name\`, \`$username\`, \`$password\` with the values from Phase 2.
   - Save & Close.

## Phase 4: Permissions Fix (Critical)
1. Right-click \`api\` folder -> **Permissions**. Set to **755**.
2. Inside \`api\`, select all PHP files -> **Permissions**. Set to **644**.
3. Go back to \`public_html\`. Ensure \`.htaccess\` is present (if not, upload it from the bundle).

## Phase 5: Verification
1. Open your website (e.g., iitgeeprep.com). You should see the login screen.
2. Go to \`iitgeeprep.com/api/index.php\`. You should see \`{"status": "active"}\`.
3. Log in with the default admin:
   - Email: \`admin\`
   - Password: \`Ishika@123\`
4. Go to **Admin > System Tests** and run the scan.

## Phase 6: System Diagnostics
Once deployed, you can verify everything is working using the built-in Test Runner.

1. Log in as Admin.
2. Navigate to **System Tests**.
3. Click **Start Scan**.

## Troubleshooting
- **404 on API**: Ensure \`api\` folder exists in \`public_html\` and contains \`index.php\`.
- **403 Forbidden**: Check permissions (Folders 755, Files 644). Check if ModSecurity is blocking requests in Hostinger.
- **JSON Error**: Ensure no closing \`?>\` tags in PHP files.
    `;
};

export const getBackendFiles = (dbConfig?: { host: string, user: string, pass: string, name: string }) => {
    const dbHost = dbConfig?.host || "82.25.121.80";
    const dbUser = dbConfig?.user || "u131922718_iitjee_user";
    const dbPass = dbConfig?.pass || "";
    const dbName = dbConfig?.name || "u131922718_iitjee_tracker";

    return [
        // --- 1. CORE FILES ---
        {
            name: "config.php",
            folder: "api",
            desc: "Database Config",
            content: `<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
error_reporting(0); 

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
        { name: "index.php", folder: "api", desc: "API Root", content: `<?php header("Content-Type: application/json"); echo json_encode(["status" => "active", "message" => "IITGEEPrep API v5.0"]);` },
        { 
            name: "test_db.php", 
            folder: "api", 
            desc: "DB Test & Diagnostics", 
            content: `<?php require 'config.php'; header('Content-Type: application/json'); 
            $tables = [];
            try {
                $res = $conn->query("SHOW TABLES");
                while($row = $res->fetch(PDO::FETCH_NUM)) {
                    $tName = $row[0];
                    $count = $conn->query("SELECT COUNT(*) FROM $tName")->fetchColumn();
                    $tables[] = ["name" => $tName, "rows" => $count];
                }
                echo json_encode([
                    "status"=>"CONNECTED", 
                    "tables"=>$tables,
                    "php_version"=>phpversion(),
                    "server_software"=>$_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
                ]);
            } catch(Exception $e) {
                echo json_encode(["status"=>"ERROR", "message"=>$e->getMessage()]);
            }` 
        },
        
        // --- 2. AUTHENTICATION ---
        { name: "login.php", folder: "api", desc: "Login", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data=json_decode(file_get_contents("php://input")); if(!isset($data->email)){exit();} $email=$data->email; $password=$data->password; if($email==='admin' && $password==='Ishika@123'){ $u=$conn->query("SELECT * FROM users WHERE email='admin'")->fetch(PDO::FETCH_ASSOC); if($u){ $u['role']='ADMIN'; echo json_encode(["message"=>"Success","user"=>$u]); exit(); }} try{ $stmt=$conn->prepare("SELECT * FROM users WHERE email=:e"); $stmt->execute([':e'=>$email]); $user=$stmt->fetch(PDO::FETCH_ASSOC); if($user && password_verify($password,$user['password_hash'])){ echo json_encode(["message"=>"Success","user"=>$user]); }else{ http_response_code(401); echo json_encode(["message"=>"Invalid"]); } }catch(Exception $e){ echo json_encode(["error"=>$e->getMessage()]); }` },
        { name: "register.php", folder: "api", desc: "Register", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data=json_decode(file_get_contents("php://input")); if(!isset($data->email)){exit();} do { $id=mt_rand(100000,999999); $stmt=$conn->prepare("SELECT id FROM users WHERE id=?"); $stmt->execute([$id]); } while($stmt->rowCount()>0); $hash=password_hash($data->password,PASSWORD_DEFAULT); try{ $conn->prepare("INSERT INTO users (id,email,password_hash,full_name,role,is_verified,institute,target_year) VALUES (?,?,?,?,?,1,?,?)")->execute([$id,$data->email,$hash,$data->name,$data->role,isset($data->institute)?$data->institute:'',isset($data->targetYear)?$data->targetYear:2025]); $u=$conn->query("SELECT * FROM users WHERE id=$id")->fetch(PDO::FETCH_ASSOC); echo json_encode(["message"=>"Success","user"=>$u]); }catch(Exception $e){ http_response_code(500); echo json_encode(["error"=>$e->getMessage()]); }` },

        // --- 3. PUBLIC & COMMON DATA ---
        { name: "contact.php", folder: "api", desc: "Contact Form", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); $conn->prepare("INSERT INTO contact_messages (name,email,subject,message) VALUES (?,?,?,?)")->execute([$d->name,$d->email,$d->subject,$d->message]); echo json_encode(["message"=>"Sent"]);` },
        { name: "get_common.php", folder: "api", desc: "Fetch Common", content: `<?php require 'config.php'; header('Content-Type: application/json'); $res=[]; $res['quotes']=$conn->query("SELECT * FROM quotes")->fetchAll(PDO::FETCH_ASSOC); $res['notifications']=$conn->query("SELECT * FROM notifications ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC); $res['flashcards']=$conn->query("SELECT * FROM flashcards")->fetchAll(PDO::FETCH_ASSOC); $res['hacks']=$conn->query("SELECT * FROM memory_hacks")->fetchAll(PDO::FETCH_ASSOC); $res['blogPosts']=$conn->query("SELECT id, title, excerpt, content, author, category, image_url as imageUrl, created_at as date FROM blog_posts ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC); $ts=$conn->query("SELECT * FROM tests")->fetchAll(PDO::FETCH_ASSOC); foreach($ts as &$t){ $t['questions']=$conn->query("SELECT * FROM questions q JOIN test_questions tq ON q.id=tq.question_id WHERE tq.test_id='{$t['id']}' ORDER BY tq.question_order")->fetchAll(PDO::FETCH_ASSOC); foreach($t['questions'] as &$q){ $q['options']=json_decode($q['options_json']); } } $res['tests']=$ts; $res['videoMap']=[]; $res['videoLibrary'] = $conn->query("SELECT topic_id, video_url, description FROM topic_videos")->fetchAll(PDO::FETCH_ASSOC); foreach($res['videoLibrary'] as $v){ $res['videoMap'][$v['topic_id']]=$v['video_url']; } echo json_encode($res);` },
        
        // --- 4. VIDEO VALIDATION ---
        { name: "validate_video.php", folder: "api", desc: "Check Links", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); $url=$d->url; if(strpos($url, 'youtube.com/embed/') === false) { echo json_encode(["status"=>"invalid", "reason"=>"format"]); exit; } $headers = @get_headers($url); if($headers && strpos($headers[0], '200')) { echo json_encode(["status"=>"valid"]); } else { echo json_encode(["status"=>"invalid", "reason"=>"404/Block"]); }` },

        // --- 5. USER FEATURES ---
        { name: "sync_progress.php", folder: "api", desc: "Sync Syllabus", content: `<?php require 'config.php'; header('Content-Type: application/json'); $data=json_decode(file_get_contents("php://input")); try{ $check=$conn->prepare("SELECT id FROM topic_progress WHERE user_id=:u AND topic_id=:t"); $check->execute([':u'=>$data->user_id,':t'=>$data->topic_id]); if($check->rowCount()>0){ $sql="UPDATE topic_progress SET status=:s, ex1_solved=:e1, ex1_total=:t1, revision_count=:rc, next_revision_date=:nr WHERE user_id=:u AND topic_id=:t"; }else{ $sql="INSERT INTO topic_progress (user_id,topic_id,status,ex1_solved,ex1_total,revision_count,next_revision_date) VALUES (:u,:t,:s,:e1,:t1,:rc,:nr)"; } $stmt=$conn->prepare($sql); $stmt->execute([':u'=>$data->user_id,':t'=>$data->topic_id,':s'=>$data->status,':e1'=>$data->ex1Solved,':t1'=>$data->ex1Total,':rc'=>isset($data->revisionCount)?$data->revisionCount:0,':nr'=>isset($data->nextRevisionDate)?$data->nextRevisionDate:null]); echo json_encode(["message"=>"Saved"]); }catch(Exception $e){echo json_encode(["error"=>$e->getMessage()]);} ` },
        { name: "get_dashboard.php", folder: "api", desc: "User Dashboard", content: `<?php require 'config.php'; header('Content-Type: application/json'); $uid=$_GET['user_id']; $res=[]; $u=$conn->query("SELECT * FROM users WHERE id=$uid")->fetch(PDO::FETCH_ASSOC); if($u){ $res['userProfileSync']=['pendingRequest'=>json_decode($u['pending_request_json']),'parentId'=>$u['parent_id'],'studentId'=>$u['student_id']]; } $res['progress']=$conn->query("SELECT * FROM topic_progress WHERE user_id=$uid")->fetchAll(PDO::FETCH_ASSOC); $res['goals']=$conn->query("SELECT * FROM daily_goals WHERE user_id=$uid")->fetchAll(PDO::FETCH_ASSOC); $res['backlogs']=$conn->query("SELECT * FROM backlogs WHERE user_id=$uid")->fetchAll(PDO::FETCH_ASSOC); $res['mistakes']=$conn->query("SELECT * FROM mistake_notebook WHERE user_id=$uid")->fetchAll(PDO::FETCH_ASSOC); $tt=$conn->query("SELECT * FROM timetable_settings WHERE user_id=$uid")->fetch(PDO::FETCH_ASSOC); if($tt){ $res['timetable']=['config'=>json_decode($tt['config_json']),'slots'=>json_decode($tt['generated_slots_json'])]; } $atts=$conn->query("SELECT * FROM test_attempts WHERE user_id=$uid ORDER BY attempt_date DESC")->fetchAll(PDO::FETCH_ASSOC); foreach($atts as &$a){ $d=$conn->query("SELECT ad.*, q.subject_id, q.topic_id FROM attempt_details ad LEFT JOIN questions q ON ad.question_id=q.id WHERE ad.attempt_id='{$a['id']}'")->fetchAll(PDO::FETCH_ASSOC); $a['detailedResults']=array_map(function($r){ return ['questionId'=>$r['question_id'],'status'=>$r['status'],'subjectId'=>$r['subject_id'],'topicId'=>$r['topic_id'],'selectedOptionIndex'=>(int)$r['selected_option']]; },$d); } $res['attempts']=$atts; echo json_encode($res);` },
        { name: "save_attempt.php", folder: "api", desc: "Save Attempt", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); try { $conn->beginTransaction(); $aid="att_".time()."_".mt_rand(100,999); $conn->prepare("INSERT INTO test_attempts (id,user_id,test_id,score,total_questions,correct_count,incorrect_count,accuracy_percent) VALUES (?,?,?,?,?,?,?,?)")->execute([$aid, $d->user_id, $d->testId, $d->score, $d->totalQuestions, $d->correctCount, $d->incorrectCount, $d->accuracy_percent]); if(isset($d->detailedResults)){ $stmt=$conn->prepare("INSERT INTO attempt_details (attempt_id,question_id,status,selected_option) VALUES (?,?,?,?)"); foreach($d->detailedResults as $r){ $optIdx = isset($r->selectedOptionIndex) ? $r->selectedOptionIndex : null; $stmt->execute([$aid, $r->questionId, $r->status, $optIdx]); } } $conn->commit(); echo json_encode(["message"=>"Saved", "attemptId"=>$aid]); } catch(Exception $e){ $conn->rollBack(); echo json_encode(["error"=>$e->getMessage()]); }` },
        { name: "save_timetable.php", folder: "api", desc: "Save Timetable", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); $uid=$d->user_id; $conf=json_encode($d->config); $slots=json_encode($d->slots); $conn->query("DELETE FROM timetable_settings WHERE user_id=$uid"); $conn->prepare("INSERT INTO timetable_settings (user_id, config_json, generated_slots_json) VALUES (?,?,?)")->execute([$uid, $conf, $slots]); echo json_encode(["message"=>"Saved"]);` },
        { name: "manage_goals.php", folder: "api", desc: "Manage Goals", content: `<?php require 'config.php'; header('Content-Type: application/json'); $m=$_SERVER['REQUEST_METHOD']; $d=json_decode(file_get_contents("php://input")); if($m=='POST'){ $conn->prepare("INSERT INTO daily_goals (id,user_id,goal_text) VALUES (?,?,?)")->execute([$d->id, $d->user_id, $d->text]); } if($m=='PUT'){ $conn->query("UPDATE daily_goals SET is_completed = NOT is_completed WHERE id='{$d->id}'"); } echo json_encode(["message"=>"OK"]);` },
        { name: "manage_backlogs.php", folder: "api", desc: "Manage Backlogs", content: `<?php require 'config.php'; header('Content-Type: application/json'); $m=$_SERVER['REQUEST_METHOD']; $d=json_decode(file_get_contents("php://input")); if($m=='POST'){ $conn->prepare("INSERT INTO backlogs (id,user_id,title,subject_id,priority,deadline,status) VALUES (?,?,?,?,?,?,?)")->execute([$d->id, $d->user_id, $d->title, $d->subjectId, $d->priority, $d->deadline, $d->status]); } if($m=='PUT'){ $conn->query("UPDATE backlogs SET status = IF(status='PENDING','CLEARED','PENDING') WHERE id='{$d->id}'"); } if($m=='DELETE'){ $id=$_GET['id']; $conn->query("DELETE FROM backlogs WHERE id='$id'"); } echo json_encode(["message"=>"OK"]);` },
        { name: "manage_mistakes.php", folder: "api", desc: "Manage Mistakes", content: `<?php require 'config.php'; header('Content-Type: application/json'); $m=$_SERVER['REQUEST_METHOD']; $d=json_decode(file_get_contents("php://input")); if($m=='POST'){ $tags=json_encode($d->tags); $conn->prepare("INSERT INTO mistake_notebook (id,user_id,question_text,subject_id,topic_id,test_name,tags_json) VALUES (?,?,?,?,?,?,?)")->execute([$d->id, $d->user_id, $d->questionText, $d->subjectId, $d->topicId, $d->testName, $tags]); } if($m=='PUT'){ $tags=json_encode($d->tags); $conn->prepare("UPDATE mistake_notebook SET user_notes=?, tags_json=? WHERE id=?")->execute([$d->userNotes, $tags, $d->id]); } if($m=='DELETE'){ $id=$_GET['id']; $conn->query("DELETE FROM mistake_notebook WHERE id='$id'"); } echo json_encode(["message"=>"OK"]);` },
        
        // --- 6. CONNECTIONS ---
        { name: "send_request.php", folder: "api", desc: "Send Request", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); 
        if(isset($d->action) && $d->action == 'search') {
            $q = $d->query;
            $stmt = $conn->prepare("SELECT id, full_name as name, email FROM users WHERE role='STUDENT' AND (email LIKE ? OR full_name LIKE ? OR id LIKE ?) LIMIT 5");
            $stmt->execute(["%$q%", "%$q%", "%$q%"]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            exit();
        }
        $sid=$d->student_identifier; 
        if(strpos($sid,'@')){ $u=$conn->query("SELECT id FROM users WHERE email='$sid'")->fetch(); $sid=$u?$u['id']:null; } 
        if($sid){ 
            $req=json_encode(['fromId'=>$d->parent_id, 'fromName'=>$d->parent_name]); 
            $conn->prepare("UPDATE users SET pending_request_json=? WHERE id=?")->execute([$req, $sid]); 
            echo json_encode(["message"=>"Success"]); 
        }else{ echo json_encode(["message"=>"User not found"]); }` },
        { name: "respond_request.php", folder: "api", desc: "Resp Request", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); if($d->accept){ $conn->query("UPDATE users SET parent_id={$d->parent_id} WHERE id={$d->student_id}"); $conn->query("UPDATE users SET student_id={$d->student_id} WHERE id={$d->parent_id}"); } $conn->query("UPDATE users SET pending_request_json=NULL WHERE id={$d->student_id}"); echo json_encode(["message"=>"Processed"]);` },

        // --- 7. ADMIN TOOLS ---
        { name: "get_users.php", folder: "api", desc: "Admin Get Users", content: `<?php require 'config.php'; header('Content-Type: application/json'); echo json_encode($conn->query("SELECT id, full_name as name, email, role, is_verified as isVerified, target_exam as targetExam, institute FROM users")->fetchAll(PDO::FETCH_ASSOC));` },
        { name: "manage_users.php", folder: "api", desc: "Admin Manage User", content: `<?php require 'config.php'; header('Content-Type: application/json'); $m=$_SERVER['REQUEST_METHOD']; $d=json_decode(file_get_contents("php://input")); if($m=='PUT'){ $iv=$d->isVerified?1:0; $conn->prepare("UPDATE users SET full_name=?, target_exam=?, institute=?, is_verified=$iv WHERE id=?")->execute([$d->name, $d->targetExam, $d->institute, $d->id]); } if($m=='DELETE'){ $id=$_GET['id']; $conn->query("DELETE FROM users WHERE id=$id"); } echo json_encode(["message"=>"OK"]);` },
        { name: "manage_broadcasts.php", folder: "api", desc: "Admin Broadcasts", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); if($d->action=='send_notification'){ $conn->prepare("INSERT INTO notifications (id,title,message,type) VALUES (?,?,?,?)")->execute([$d->id, $d->title, $d->message, $d->type]); } if($d->action=='add_quote'){ $conn->prepare("INSERT INTO quotes (id,text,author) VALUES (?,?,?)")->execute([$d->id, $d->text, $d->author]); } if($_GET['action']=='delete_quote'){ $id=$_GET['id']; $conn->query("DELETE FROM quotes WHERE id='$id'"); } echo json_encode(["message"=>"OK"]);` },
        { name: "manage_tests.php", folder: "api", desc: "Admin Tests", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); if($d->action=='add_question'){ $opts=json_encode($d->options); $conn->prepare("INSERT INTO questions (id,subject_id,topic_id,question_text,options_json,correct_option_index) VALUES (?,?,?,?,?,?)")->execute([$d->id, $d->subjectId, $d->topicId, $d->text, $opts, $d->correctOptionIndex]); } if($d->action=='create_test'){ $conn->prepare("INSERT INTO tests (id,title,duration_minutes,category,difficulty,exam_type) VALUES (?,?,?,?,?,?)")->execute([$d->id, $d->title, $d->durationMinutes, 'ADMIN', $d->difficulty, $d->examType]); $i=0; foreach($d->questions as $q){ $conn->prepare("INSERT INTO test_questions (test_id,question_id,question_order) VALUES (?,?,?)")->execute([$d->id, $q.id, $i++]); } } echo json_encode(["message"=>"OK"]);` },
        { name: "manage_blog.php", folder: "api", desc: "Admin Blog", content: `<?php require 'config.php'; header('Content-Type: application/json'); $m=$_SERVER['REQUEST_METHOD']; if($m=='POST'){ $d=json_decode(file_get_contents("php://input")); $conn->prepare("INSERT INTO blog_posts (id,title,excerpt,content,author,category,image_url,created_at) VALUES (?,?,?,?,?,?,?,?)")->execute([$d->id, $d->title, $d->excerpt, $d->content, $d->author, $d->category, $d->imageUrl, $d->date]); } if($m=='DELETE'){ $id=$_GET['id']; $conn->query("DELETE FROM blog_posts WHERE id='$id'"); } echo json_encode(["message"=>"OK"]);` },
        { name: "manage_contact.php", folder: "api", desc: "Admin Contact", content: `<?php require 'config.php'; header('Content-Type: application/json'); $m=$_SERVER['REQUEST_METHOD']; if($m=='GET'){ echo json_encode($conn->query("SELECT * FROM contact_messages ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC)); } if($m=='DELETE'){ $id=$_GET['id']; $conn->query("DELETE FROM contact_messages WHERE id=$id"); echo json_encode(["message"=>"Deleted"]); }` },
        { name: "manage_videos.php", folder: "api", desc: "Admin Videos", content: `<?php require 'config.php'; header('Content-Type: application/json'); $d=json_decode(file_get_contents("php://input")); $conn->query("INSERT INTO topic_videos (topic_id, video_url, description) VALUES ('{$d->topicId}', '{$d->url}', '{$d->desc}') ON DUPLICATE KEY UPDATE video_url='{$d->url}', description='{$d->desc}'"); echo json_encode(["message"=>"Saved"]);` },

        // --- 8. ANALYTICS (Lightweight) ---
        { name: "track_visit.php", folder: "api", desc: "Track Visit", content: `<?php require 'config.php'; $d=date('Y-m-d'); $conn->query("INSERT INTO site_traffic (visit_date, visit_count) VALUES ('$d', 1) ON DUPLICATE KEY UPDATE visit_count=visit_count+1"); echo json_encode(["status"=>"ok"]);` },
        { name: "get_admin_stats.php", folder: "api", desc: "Get Admin Stats", content: `<?php require 'config.php'; header('Content-Type: application/json'); 
        $tf=$conn->query("SELECT * FROM site_traffic ORDER BY visit_date DESC LIMIT 7")->fetchAll(PDO::FETCH_ASSOC);
        $total=$conn->query("SELECT COUNT(*) FROM users")->fetchColumn();
        $visits=array_sum(array_column($tf,'visit_count'));
        $daily=array_reverse(array_map(function($r){ return ['date'=>date('D',strtotime($r['visit_date'])), 'visits'=>(int)$r['visit_count']]; }, $tf));
        $growth=$conn->query("SELECT DATE(created_at) as d, COUNT(*) as c FROM users GROUP BY DATE(created_at) ORDER BY d DESC LIMIT 7")->fetchAll(PDO::FETCH_ASSOC);
        $growthData=array_reverse(array_map(function($r){ return ['date'=>date('M d',strtotime($r['d'])), 'users'=>(int)$r['c']]; }, $growth));
        echo json_encode(['totalVisits'=>$visits,'totalUsers'=>$total,'dailyTraffic'=>$daily,'userGrowth'=>$growthData]);` },

        // --- 9. SEO & MISC (Root Folder) ---
        { name: "sitemap.xml", folder: "root", desc: "SEO Sitemap", content: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://iitgeeprep.com/</loc><priority>1.0</priority></url>
  <url><loc>https://iitgeeprep.com/about</loc><priority>0.8</priority></url>
  <url><loc>https://iitgeeprep.com/blog</loc><priority>0.8</priority></url>
  <url><loc>https://iitgeeprep.com/exams</loc><priority>0.8</priority></url>
  <url><loc>https://iitgeeprep.com/contact</loc><priority>0.6</priority></url>
</urlset>` },
        { name: "robots.txt", folder: "root", desc: "SEO Robots", content: `User-agent: *
Allow: /
Sitemap: https://iitgeeprep.com/sitemap.xml` },
        { name: "README.txt", folder: "root", desc: "Instructions", content: `IITGEEPrep Backend Deployment Instructions
==========================================

1. DATABASE:
   - Create a MySQL Database in Hostinger.
   - Import 'database.sql'.

2. API FILES:
   - The 'api' folder contains all PHP scripts.
   - Edit 'api/config.php' if your DB credentials change.
   - Permissions: Folders (755), Files (644).

3. FRONTEND:
   - Upload your React build (index.html, assets/) to public_html.
   - Upload .htaccess to public_html to fix routing.

4. TROUBLESHOOTING:
   - Visit https://iitgeeprep.com/api/test_db.php to check connection.` }
    ];
};
